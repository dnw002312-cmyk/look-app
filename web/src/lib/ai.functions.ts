import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: Msg[], opts?: { json?: boolean; model?: string }) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts?.model ?? "google/gemini-2.5-flash",
      messages,
      ...(opts?.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/** Chat with an AI playing a seller persona. */
export const aiSellerReply = createServerFn({ method: "POST" })
  .inputValidator((d: { sellerName: string; productTitle: string; history: { from: "me" | "them"; text: string }[] }) => d)
  .handler(async ({ data }) => {
    const system: Msg = {
      role: "system",
      content: `Eres @${data.sellerName}, un vendedor real en LOOK, un marketplace español de ropa de segunda mano. Estás chateando con un comprador interesado en "${data.productTitle}". Responde de forma natural, cercana, juvenil, con emojis ocasionales. Mensajes cortos (máx 2 frases). No inventes precios distintos al publicado. Si preguntan por estado, talla, envío, responde con detalles plausibles. Habla en español.`,
    };
    const msgs: Msg[] = [
      system,
      ...data.history.map((m) => ({
        role: m.from === "me" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
    ];
    const reply = await callAI(msgs);
    return { reply };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .inputValidator((d: {
    email: string;
    password: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    gender: string;
    age: string;
    styles: string[];
    brands: string[];
    categories: string[];
    topSize: string;
    bottomSize: string;
    shoeSize: string;
    intent: string;
  }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name, avatar: data.avatar },
    });
    if (authErr) throw new Error(`Auth: ${authErr.message}`);
    const userId = authData.user.id;
    const { error: profileErr } = await (supabaseAdmin as any)
      .from("profiles")
      .upsert({
        id: userId,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        gender: data.gender,
        age: data.age ? Number(data.age) : null,
        styles: data.styles,
        brands: data.brands,
        categories: data.categories,
        top_size: data.topSize,
        bottom_size: data.bottomSize,
        shoe_size: data.shoeSize,
        intent: data.intent,
        rating: 5.0,
        sales: 0,
        verified: false,
      });
    if (profileErr) throw new Error(`Profile: ${profileErr.message}`);
    return { userId };
  });

/** Generate outfit recommendations based on user style preferences. */
export const aiOutfits = createServerFn({ method: "POST" })
  .inputValidator((d: { vibe: string; sizes?: { top?: string; bottom?: string; shoes?: string }; styles?: string[] }) => d)
  .handler(async ({ data }) => {
    const system: Msg = {
      role: "system",
      content:
        "Eres un stylist personal experto en moda circular y segunda mano. Genera recomendaciones de outfits completos para el usuario. Devuelve SOLO JSON válido sin markdown.",
    };
    const user: Msg = {
      role: "user",
      content: `Genera 4 outfits completos con el vibe "${data.vibe}". Estilos favoritos del usuario: ${(data.styles ?? []).join(", ") || "variado"}. Tallas: top ${data.sizes?.top ?? "M"}, bottom ${data.sizes?.bottom ?? "M"}, zapatos ${data.sizes?.shoes ?? "40"}.

Responde con este JSON exacto:
{"outfits":[{"title":"Nombre del look","description":"1 frase descriptiva","items":[{"type":"Top|Bottom|Shoes|Accessory|Outerwear","name":"nombre prenda","brand":"marca real second-hand plausible","price":25,"color":"color","why":"por qué encaja"}],"totalPrice":120,"tags":["tag1","tag2"]}]}

Marcas plausibles: Levi's, COS, Zara, Carhartt, Vintage, & Other Stories, Mango, New Balance, Nike, Adidas, Stüssy, Patagonia, Massimo Dutti, Bershka. Precios realistas de segunda mano (8-80€ por pieza). 3-4 items por outfit.`,
    };
    const raw = await callAI([system, user], { json: true });
    try {
      return JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("Respuesta IA inválida");
    }
  });
