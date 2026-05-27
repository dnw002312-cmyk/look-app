export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  size: string;
  color: string;
  condition: string;
  category: string;
  image: string;
  seller: { name: string; avatar: string; rating: number; verified: boolean };
  description: string;
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;

const lucia = { name: "lucia.vtg", avatar: "https://i.pravatar.cc/100?img=47", rating: 4.9, verified: true };
const marco = { name: "marco_st", avatar: "https://i.pravatar.cc/100?img=12", rating: 4.7, verified: false };
const ana = { name: "anabel.co", avatar: "https://i.pravatar.cc/100?img=44", rating: 5.0, verified: true };
const kicks = { name: "kicks.lab", avatar: "https://i.pravatar.cc/100?img=33", rating: 4.8, verified: true };
const estilo = { name: "estilo.ana", avatar: "https://i.pravatar.cc/100?img=20", rating: 4.6, verified: false };
const vbag = { name: "vintage.bag", avatar: "https://i.pravatar.cc/100?img=49", rating: 4.9, verified: true };
const julio = { name: "julio.mens", avatar: "https://i.pravatar.cc/100?img=15", rating: 4.8, verified: true };

export const products: Product[] = [
  // MUJER
  { id: "1", title: "Vestido midi minimalista", brand: "COS", price: 45, size: "M", color: "Negro", condition: "Como nuevo", category: "Mujer",
    image: img("photo-1539008835657-9e8e9680c956"), seller: ana,
    description: "Vestido midi de COS, usado dos veces. Caída perfecta y tejido premium." },
  { id: "2", title: "Falda plisada midi", brand: "& Other Stories", price: 24, size: "M", color: "Rosa", condition: "Como nuevo", category: "Mujer",
    image: img("photo-1582142306909-195724d33ffc"), seller: ana,
    description: "Falda plisada, cintura alta. Color rosa empolvado precioso." },
  { id: "3", title: "Blusa de seda floral", brand: "Massimo Dutti", price: 32, size: "S", color: "Crema", condition: "Como nuevo", category: "Mujer",
    image: img("photo-1564257577-2d3eea2b8d6e"), seller: estilo,
    description: "Blusa de seda con estampado floral discreto. Caída elegante." },
  { id: "4", title: "Jeans mom fit vintage", brand: "Levi's", price: 38, size: "38", color: "Azul", condition: "Bueno", category: "Mujer",
    image: img("photo-1542272604-787c3835535d"), seller: lucia,
    description: "Levi's 501 originales de los 90s. Tiro alto, ajuste mom perfecto." },

  // HOMBRE
  { id: "5", title: "Camisa Oxford clásica", brand: "Ralph Lauren", price: 42, size: "L", color: "Azul", condition: "Como nuevo", category: "Hombre",
    image: img("photo-1602810318383-e386cc2a3ccf"), seller: julio,
    description: "Camisa Oxford slim fit, prácticamente sin uso." },
  { id: "6", title: "Pantalón chino beige", brand: "Uniqlo", price: 22, size: "42", color: "Beige", condition: "Bueno", category: "Hombre",
    image: img("photo-1473966968600-fa801b869a1a"), seller: marco,
    description: "Chinos clásicos Uniqlo, tejido suave y resistente." },
  { id: "7", title: "Polo piqué slim", brand: "Lacoste", price: 28, size: "M", color: "Verde", condition: "Como nuevo", category: "Hombre",
    image: img("photo-1586790170083-2f9ceadc732d"), seller: julio,
    description: "Polo Lacoste auténtico, color verde botella." },
  { id: "8", title: "Sudadera con capucha", brand: "Champion", price: 35, size: "L", color: "Gris", condition: "Bueno", category: "Hombre",
    image: img("photo-1556821840-3a63f95609a7"), seller: marco,
    description: "Hoodie Champion vintage, tejido grueso reverse weave." },

  // VINTAGE
  { id: "9", title: "Chaqueta vintage oversize", brand: "Levi's", price: 38, size: "M", color: "Beige", condition: "Como nuevo", category: "Vintage",
    image: img("photo-1551028719-00167b16eac5"), seller: lucia,
    description: "Chaqueta vaquera vintage de los 90s, tejido grueso y sin defectos." },
  { id: "10", title: "Abrigo de lana años 80", brand: "Vintage", price: 60, size: "L", color: "Camel", condition: "Bueno", category: "Vintage",
    image: img("photo-1544022613-e87ca75a784a"), seller: lucia,
    description: "Abrigo de lana auténtico de los 80s, corte oversize maravilloso." },
  { id: "11", title: "Camisa hawaiana retro", brand: "Vintage", price: 19, size: "M", color: "Multicolor", condition: "Bueno", category: "Vintage",
    image: img("photo-1562157873-818bc0726f68"), seller: marco,
    description: "Camisa hawaiana original años 70, estampado tropical." },

  // STREETWEAR
  { id: "12", title: "Camiseta gráfica Y2K", brand: "Vintage", price: 18, size: "S", color: "Blanco", condition: "Bueno", category: "Streetwear",
    image: img("photo-1503342217505-b0a15ec3261c"), seller: marco,
    description: "Tee Y2K original, estampado vibrante. Pequeño desgaste en cuello." },
  { id: "13", title: "Hoodie oversize verde", brand: "Carhartt", price: 55, size: "L", color: "Verde", condition: "Como nuevo", category: "Streetwear",
    image: img("photo-1620799140188-3b2a02fd9a77"), seller: marco,
    description: "Carhartt hoodie verde oliva, tejido grueso. Usado pocas veces." },
  { id: "14", title: "Cargo pants tácticos", brand: "Dickies", price: 30, size: "L", color: "Caqui", condition: "Bueno", category: "Streetwear",
    image: img("photo-1517438476312-10d79c077509"), seller: marco,
    description: "Pantalones cargo Dickies con múltiples bolsillos." },

  // FORMAL
  { id: "15", title: "Blazer estructurado marino", brand: "Zara", price: 32, size: "S", color: "Marino", condition: "Como nuevo", category: "Formal",
    image: img("photo-1591047139829-d91aecb6caea"), seller: estilo,
    description: "Blazer azul marino con hombreras suaves. Ideal para oficina." },
  { id: "16", title: "Traje gris dos piezas", brand: "Hugo Boss", price: 120, size: "L", color: "Gris", condition: "Como nuevo", category: "Formal",
    image: img("photo-1594938298603-c8148c4dae35"), seller: julio,
    description: "Traje Hugo Boss gris marengo, slim fit. Solo usado en una boda." },

  // ACCESORIOS
  { id: "17", title: "Bolso baguette piel", brand: "Mango", price: 28, size: "Único", color: "Crema", condition: "Bueno", category: "Accesorios",
    image: img("photo-1584917865442-de89df76afd3"), seller: vbag,
    description: "Bolso baguette tipo Y2K, piel sintética en perfecto estado." },
  { id: "18", title: "Cinturón cuero clásico", brand: "Massimo Dutti", price: 22, size: "M", color: "Marrón", condition: "Como nuevo", category: "Accesorios",
    image: img("photo-1624222247344-550fb60583dc"), seller: estilo,
    description: "Cinturón de cuero genuino, hebilla metálica clásica." },
  { id: "19", title: "Gafas de sol cat-eye", brand: "Ray-Ban", price: 55, size: "Único", color: "Negro", condition: "Como nuevo", category: "Accesorios",
    image: img("photo-1572635196237-14b3f281503f"), seller: ana,
    description: "Ray-Ban cat-eye originales, vienen con estuche." },
  { id: "20", title: "Bufanda cashmere", brand: "Acne Studios", price: 75, size: "Único", color: "Rosa", condition: "Como nuevo", category: "Accesorios",
    image: img("photo-1601924994987-69e26d50dc26"), seller: vbag,
    description: "Bufanda Acne 100% cashmere, suavísima." },

  // ZAPATOS
  { id: "21", title: "Sneakers retro 574", brand: "New Balance", price: 65, size: "42", color: "Gris", condition: "Bueno", category: "Zapatos",
    image: img("photo-1542291026-7eec264c27ff"), seller: kicks,
    description: "New Balance 574 originales, suela sin desgaste excesivo. Con caja." },
  { id: "22", title: "Botas chelsea cuero", brand: "Dr. Martens", price: 85, size: "40", color: "Negro", condition: "Como nuevo", category: "Zapatos",
    image: img("photo-1605812860427-4024433a70fd"), seller: kicks,
    description: "Dr. Martens chelsea negras, usadas pocas veces." },
  { id: "23", title: "Sandalias planas piel", brand: "Birkenstock", price: 40, size: "38", color: "Marrón", condition: "Bueno", category: "Zapatos",
    image: img("photo-1603487742131-4160ec999306"), seller: ana,
    description: "Birkenstock Arizona auténticas." },
];

export const categories = [
  { id: "Mujer", label: "Mujer", emoji: "👗" },
  { id: "Hombre", label: "Hombre", emoji: "👔" },
  { id: "Vintage", label: "Vintage", emoji: "🕰️" },
  { id: "Streetwear", label: "Streetwear", emoji: "🧢" },
  { id: "Formal", label: "Formal", emoji: "🎩" },
  { id: "Accesorios", label: "Accesorios", emoji: "👜" },
  { id: "Zapatos", label: "Zapatos", emoji: "👟" },
];

export const currentUser = {
  name: "Sofía Marín",
  username: "@sofi.look",
  avatar: "https://i.pravatar.cc/200?img=48",
  bio: "Amante del vintage 💚 Curaduría semanal · Madrid",
  rating: 4.9,
  sales: 87,
  verified: true,
};

export const chats = [
  { id: "1", name: "lucia.vtg", avatar: "https://i.pravatar.cc/100?img=47", last: "¿Sigue disponible la chaqueta?", time: "2m", online: true, unread: 2 },
  { id: "2", name: "marco_st", avatar: "https://i.pravatar.cc/100?img=12", last: "Te mando foto del estado real", time: "1h", online: false, unread: 0 },
  { id: "3", name: "kicks.lab", avatar: "https://i.pravatar.cc/100?img=33", last: "Perfecto, envío mañana 📦", time: "Ayer", online: true, unread: 0 },
];
