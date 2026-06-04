import { createClient } from "@supabase/supabase-js";

type Env = Record<string, string>;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function getAuthUserId(request: Request): number | null {
  const token = request.headers.get("Authorization");
  if (!token) return null;
  const id = parseInt(token, 10);
  return isNaN(id) ? null : id;
}

function auth(request: Request): number | Response {
  const userId = getAuthUserId(request);
  if (!userId) return json({ error: "Token requerido" }, 401);
  return userId;
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function handleApiRequest(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (!path.startsWith("/api/")) return null;

  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
  );

  const parts = path.replace("/api/", "").split("/");
  const resource = parts[0];
  const resourceId = parts[1];

  // Auth
  if (resource === "auth" && resourceId === "login" && method === "POST") {
    const { email } = await readBody(request);
    const { data: users, error } = await supabase.from("users").select("*").eq("email", email);
    if (error) return json({ error: error.message }, 500);
    if (!users || users.length === 0) return json({ error: "Usuario no encontrado" }, 401);
    const { password: _, ...safeUser } = users[0];
    return json({ token: String(safeUser.id), user: safeUser });
  }

  if (resource === "auth" && resourceId === "register" && method === "POST") {
    const { name, email, password } = await readBody(request);
    const { data: existing } = await supabase.from("users").select("id").eq("email", email);
    if (existing && existing.length > 0) return json({ error: "El correo ya existe" }, 400);
    const { data: newUser, error } = await supabase.from("users").insert({
      name, email, password, photo: "person", join_date: new Date().toISOString().split("T")[0],
    }).select().single();
    if (error) return json({ error: error.message }, 500);
    const { password: _, ...safeUser } = newUser;
    return json({ token: String(safeUser.id), user: safeUser });
  }

  // Protected routes
  const authResult = auth(request);
  if (authResult instanceof Response) return authResult;
  const userId = authResult;

  // Products
  if (resource === "products" && method === "GET" && !resourceId) {
    let query = supabase.from("products").select("*");
    const cat = url.searchParams.get("category");
    const q = url.searchParams.get("query");
    if (cat && cat !== "todas") query = query.eq("category", cat);
    if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`);
    if (url.searchParams.get("size")) query = query.eq("size", url.searchParams.get("size")!);
    if (url.searchParams.get("color")) query = query.eq("color", url.searchParams.get("color")!);
    if (url.searchParams.get("brand")) query = query.eq("brand", url.searchParams.get("brand")!);
    if (url.searchParams.get("condition")) query = query.eq("condition", url.searchParams.get("condition")!);
    if (url.searchParams.get("minPrice")) query = query.gte("price", parseInt(url.searchParams.get("minPrice")!));
    if (url.searchParams.get("maxPrice")) query = query.lte("price", parseInt(url.searchParams.get("maxPrice")!));
    query = query.order("date_posted", { ascending: false });
    const { data, error } = await query;
    if (error) return json({ error: error.message }, 500);
    return json(data || []);
  }

  if (resource === "products" && resourceId && method === "GET") {
    const { data, error } = await supabase.from("products").select("*").eq("id", parseInt(resourceId)).single();
    if (error || !data) return json({ error: "No encontrado" }, 404);
    return json(data);
  }

  if (resource === "products" && method === "POST") {
    const body = await readBody(request);
    const { data, error } = await supabase.from("products").insert({
      name: body.name, category: body.category, price: parseInt(body.price as string),
      icon: (body.icon as string) || "checkroom", seller_id: userId,
      size: body.size, color: body.color, brand: body.brand, condition: body.condition,
      description: body.description, date_posted: new Date().toISOString().split("T")[0],
    }).select().single();
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  // Users
  if (resource === "users" && resourceId && method === "GET" && resourceId !== "profile") {
    const { data, error } = await supabase.from("users")
      .select("id, name, email, photo, description, rating, sales_count, followers, following, avg_response_time, join_date")
      .eq("id", parseInt(resourceId)).single();
    if (error || !data) return json({ error: "No encontrado" }, 404);
    return json(data);
  }

  if (resource === "users" && resourceId === "profile" && method === "PUT") {
    const body = await readBody(request);
    const { data: existing } = await supabase.from("users").select("*").eq("id", userId).single();
    if (!existing) return json({ error: "No encontrado" }, 404);
    if (body.email && body.email !== existing.email) {
      const { data: dup } = await supabase.from("users").select("id").eq("email", body.email as string).neq("id", userId);
      if (dup && dup.length > 0) return json({ error: "El correo ya existe" }, 400);
    }
    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.description !== undefined) updates.description = body.description;
    if (body.photo) updates.photo = body.photo;
    if (body.newPassword) updates.password = body.newPassword;
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId)
      .select("id, name, email, photo, description, rating, sales_count, followers, following, avg_response_time, join_date").single();
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  // Cart
  if (resource === "cart" && method === "GET") {
    const { data, error } = await supabase.from("carts")
      .select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq("user_id", userId);
    if (error) return json({ error: error.message }, 500);
    return json(data || []);
  }

  if (resource === "cart" && method === "POST") {
    const { productId } = await readBody(request);
    const { data: existing } = await supabase.from("carts").select("product_id").eq("user_id", userId).eq("product_id", productId);
    if (existing && existing.length > 0) return json({ error: "Ya está en el carrito" }, 400);
    const { data: product } = await supabase.from("products").select("id, name, icon, price").eq("id", productId).single();
    if (!product) return json({ error: "Producto no encontrado" }, 404);
    await supabase.from("carts").insert({
      user_id: userId, product_id: product.id, name: product.name, icon: product.icon, effective_price: product.price,
    });
    const { data: items } = await supabase.from("carts")
      .select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq("user_id", userId);
    return json(items || []);
  }

  if (resource === "cart" && resourceId === "checkout" && method === "POST") {
    await supabase.from("carts").delete().eq("user_id", userId);
    return json({ ok: true });
  }

  if (resource === "cart" && resourceId && method === "DELETE") {
    await supabase.from("carts").delete().eq("user_id", userId).eq("product_id", parseInt(resourceId));
    const { data } = await supabase.from("carts")
      .select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq("user_id", userId);
    return json(data || []);
  }

  // Favorites
  if (resource === "favorites" && method === "GET") {
    const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
    if (error) return json({ error: error.message }, 500);
    return json((data || []).map((r) => r.product_id));
  }

  if (resource === "favorites" && resourceId === "toggle" && method === "POST") {
    const { productId } = await readBody(request);
    const { data: existing } = await supabase.from("favorites").select("product_id").eq("user_id", userId).eq("product_id", productId);
    if (existing && existing.length > 0) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("product_id", productId);
    } else {
      await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
    }
    const { data } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
    return json((data || []).map((r) => r.product_id));
  }

  // Follows
  if (resource === "follows" && method === "GET") {
    const { data, error } = await supabase.from("follows").select("seller_id").eq("user_id", userId);
    if (error) return json({ error: error.message }, 500);
    return json((data || []).map((r) => r.seller_id));
  }

  if (resource === "follows" && resourceId === "toggle" && method === "POST") {
    const { sellerId } = await readBody(request);
    const { data: existing } = await supabase.from("follows").select("seller_id").eq("user_id", userId).eq("seller_id", sellerId);
    if (existing && existing.length > 0) {
      await supabase.from("follows").delete().eq("user_id", userId).eq("seller_id", sellerId);
    } else {
      await supabase.from("follows").insert({ user_id: userId, seller_id: sellerId });
    }
    const { data } = await supabase.from("follows").select("seller_id").eq("user_id", userId);
    return json((data || []).map((r) => r.seller_id));
  }

  // Messages
  if (resource === "messages" && method === "GET" && !resourceId) {
    const { data, error } = await supabase.from("messages")
      .select("conv_id, from_user, text, time")
      .or(`conv_id.ilike.%-${userId},conv_id.ilike.${userId}-%`);
    if (error) return json({ error: error.message }, 500);
    const convs: Record<string, unknown[]> = {};
    for (const msg of data || []) {
      if (!convs[msg.conv_id]) convs[msg.conv_id] = [];
      convs[msg.conv_id].push({ from: msg.from_user, text: msg.text, time: msg.time });
    }
    return json(convs);
  }

  if (resource === "messages" && resourceId && method === "GET") {
    const { data, error } = await supabase.from("messages")
      .select('from_user AS "from", text, time')
      .eq("conv_id", resourceId).order("id", { ascending: true });
    if (error) return json({ error: error.message }, 500);
    return json(data || []);
  }

  if (resource === "messages" && resourceId && method === "POST") {
    const { text } = await readBody(request);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await supabase.from("messages").insert({ conv_id: resourceId, from_user: userId, text, time });
    const { data } = await supabase.from("messages")
      .select('from_user AS "from", text, time')
      .eq("conv_id", resourceId).order("id", { ascending: true });
    return json(data || []);
  }

  // AI — Gemini Outfit Generator
  if (resource === "ai" && resourceId === "outfits" && method === "POST") {
    const { vibe, styles, sizes } = await readBody(request);
    if (!vibe) return json({ error: 'Se requiere "vibe"' }, 400);

    const geminiKey = env.GEMINI_API_KEY || "";
    if (!geminiKey || geminiKey === "pon-tu-api-key-aqui") {
      return json({ error: "API key de Gemini no configurada. Usa wrangler secret put GEMINI_API_KEY." }, 400);
    }

    const model = "gemini-2.5-flash-lite";
    const { data: products } = await supabase.from("products").select("*").limit(50);
    const catalog = (products || []).map((p) => ({
      name: p.name, category: p.category, brand: p.brand,
      price: `₡${p.price}`, size: p.size, color: p.color,
      condition: p.condition, gender: p.gender, style: p.style, description: p.description,
    }));

    const prompt = `Eres un stylist personal experto en moda circular y segunda mano.
Genera EXACTAMENTE 4 outfits completos para el vibe: "${vibe}".
Estilos del usuario: ${(styles || []).join(", ") || "variado"}.
Tallas: top ${sizes?.top || "M"}, bottom ${sizes?.bottom || "M"}, shoes ${sizes?.shoes || "40"}.
Catálogo disponible: ${JSON.stringify(catalog)}
IMPORTANTE: Para cada outfit usa NOMBRES de prendas y marcas CREÍBLES y REALISTAS de segunda mano (Zara, Mango, Levi's, H&M, Nike, COS, Massimo Dutti, vintage, etc). Precios EN COLONES COSTARRICENSES (₡): entre ₡3,000 y ₡60,000 por pieza. 3-4 items por outfit.
Responde SOLO con JSON válido (sin markdown, sin \`\`\`):
{"outfits":[{"title":"Nombre creativo del look","description":"1 frase descriptiva","items":[{"type":"Top|Bottom|Shoes|Accesorio|Outerwear","name":"Nombre prenda","brand":"Marca","price":25,"color":"Color","why":"Por qué encaja en este look"}],"totalPrice":120,"tags":["estilo1","estilo2"]}]}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 4096 },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return json({ error: `Gemini API error ${geminiRes.status}: ${errText.slice(0, 300)}` }, 502);
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return json({ error: "Respuesta vacía de Gemini" }, 502);

    let outfits;
    try {
      outfits = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) outfits = JSON.parse(m[0]);
      else return json({ error: "No se pudo parsear JSON" }, 500);
    }
    return json(outfits);
  }

  return null;
}
