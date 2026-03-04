import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   CSS GLOBAL
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{background:#04080F;color:#D4E8F8;font-family:'Outfit',sans-serif;overflow:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#1A3050;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes flow{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.4);opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes cartBounce{0%,100%{transform:scale(1)}35%{transform:scale(1.35)}70%{transform:scale(0.9)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes checkPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(110%);opacity:0}}
@keyframes heartPop{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rotateIn{from{transform:rotate(-180deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .38s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.skel{background:linear-gradient(90deg,#0C1520 25%,#101C2A 50%,#0C1520 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;}
.flowing path{stroke-dasharray:8 4;animation:flow 1.2s linear infinite}
`;

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const C = {
  bg:"#04080F", s1:"#080F1A", s2:"#0C1520", s3:"#101C2A", s4:"#141E2C",
  b:"#112233", b2:"#1A3050", b3:"#243850",
  cyan:"#00D4FF", green:"#00FF88", amber:"#FFB300",
  red:"#FF4466", violet:"#9B7FFF", pink:"#F472B6",
  text:"#D4E8F8", sub:"#5A8AAA", dim:"#2A4A66",
  gold:"#C9A96E", dark:"#1A1410", cream:"#FAFAF7", shopBg:"#F7F5F0",
};

/* ─────────────────────────────────────────
   8 CARACTÉRISTIQUES — Laudon & Traver
───────────────────────────────────────── */
const CARAC = [
  {
    id:"ubiquite", icon:"🌐", label:"Ubiquité", color:"#38BDF8", slide:"Slide 14",
    def:"Accessible partout, à tout moment, depuis n'importe quel appareil connecté.",
    nouasell:"NouaSell fonctionne sur desktop, mobile et tablette sans installation. Badge devices visible dans le hero.",
    code:`// PWA Service Worker — accès offline\nself.addEventListener('fetch', e => {\n  e.respondWith(\n    caches.match(e.request)\n      .then(r => r || fetch(e.request))\n  )\n})\n\n// manifest.json\n{\n  "display": "standalone",\n  "start_url": "/",\n  "theme_color": "#1A1410"\n}`,
    where:"🛍 Boutique → Hero → Badge 'Accessible partout'"
  },
  {
    id:"portee", icon:"🌍", label:"Portée mondiale", color:"#34D399", slide:"Slide 15",
    def:"Dépasse les frontières géographiques. Un artisan de Fès peut vendre à Paris, Montréal ou Dubai.",
    nouasell:"Livraison dans 47 pays. Prix en MAD, EUR, USD, GBP — sélecteur de devise dans le header.",
    code:`// Détection pays + conversion de devise\nconst { country } = await fetch(\n  'https://ipapi.co/json'\n).then(r => r.json())\n\nconst RATES = { MAD:1, EUR:0.092, USD:0.099, GBP:0.079 }\nconst rate = RATES[country] ?? 1\nreturn (price * rate).toFixed(2)`,
    where:"🛍 Header → Sélecteur MAD/EUR/USD/GBP"
  },
  {
    id:"standards", icon:"🔌", label:"Standards Universels", color:"#A78BFA", slide:"Slide 16",
    def:"Protocoles ouverts (HTTP, TCP/IP, HTML, JSON) accessibles à tous les acteurs du marché.",
    nouasell:"REST API, JSON, HTTPS/TLS 1.3, OAuth 2.0 — intégrable avec n'importe quel partenaire ou ERP.",
    code:`// API REST standardisée\nGET    /api/products     → 200 JSON\nPOST   /api/orders       → 201 JSON\nPATCH  /api/orders/:id   → 200 JSON\nDELETE /api/cart/:id     → 204\n\n// En-têtes standard\nContent-Type: application/json\nAuthorization: Bearer <JWT>`,
    where:"🛍 Hero → Bandeau protocoles actifs"
  },
  {
    id:"richesse", icon:"🎬", label:"Richesse", color:"#F472B6", slide:"Slide 17",
    def:"Capacité à transmettre des messages riches : vidéo HD, images 360°, fiches PDF, audio.",
    nouasell:"Chaque produit : 4–10 photos HD, vidéo artisan, fiche technique PDF, certificats d'authenticité.",
    code:`// Next.js Image avec formats modernes\n<Image\n  src={product.image}\n  width={800}\n  height={600}\n  quality={90}\n  formats={['avif', 'webp']}\n  placeholder="blur"\n/>\n\n// Vidéo artisan optimisée\n<video autoPlay muted loop playsInline\n  src={product.videoUrl}/>`,
    where:"🛍 Fiche produit → Onglet Médias + badges"
  },
  {
    id:"interactivite", icon:"💬", label:"Interactivité", color:"#FB923C", slide:"Slide 18",
    def:"Communication bidirectionnelle en temps réel entre marchand et consommateur.",
    nouasell:"Chat live avec les artisans, FAQ dynamique, chatbot IA, configurateur produit personnalisé.",
    code:`// Realtime chat avec Supabase\nsupabase\n  .channel('chat')\n  .on('postgres_changes', {\n    event: 'INSERT',\n    schema: 'public',\n    table: 'messages'\n  }, handleNewMessage)\n  .subscribe()`,
    where:"🛍 Boutique → Bouton 💬 bas-droite"
  },
  {
    id:"personnalisation", icon:"🎯", label:"Personnalisation", color:"#FBBF24", slide:"Slide 19",
    def:"Adapter le contenu, les offres et l'expérience à chaque utilisateur individuellement.",
    nouasell:"Algorithme de recommandations basé sur historique, catégorie vue, localisation et panier.",
    code:`// Recommandations personnalisées SQL\nSELECT p.*\nFROM products p\nJOIN user_views uv\n  ON p.category = uv.category\nWHERE uv.user_id = $1\n  AND p.id != ALL($2)\nORDER BY p.rating DESC\nLIMIT 4`,
    where:"🛍 Boutique → Bandeau doré 'Sélection pour vous'"
  },
  {
    id:"densite", icon:"📊", label:"Densité d'information", color:"#60A5FA", slide:"Slide 20",
    def:"Quantité et qualité d'informations disponibles pour acheteurs et vendeurs en temps réel.",
    nouasell:"Dashboard analytics : taux de conversion, panier moyen, heatmaps, historique prix concurrents.",
    code:`-- Agrégation analytique temps réel\nSELECT\n  DATE_TRUNC('day', created_at) as day,\n  COUNT(*) as orders,\n  AVG(total) as avg_basket,\n  SUM(total) as revenue,\n  COUNT(DISTINCT user_id) as unique_buyers\nFROM orders\nGROUP BY 1\nORDER BY 1 DESC`,
    where:"⚙️ Admin → Onglet 📈 Analytics"
  },
  {
    id:"social", icon:"👥", label:"Technologie Sociale", color:"#4ADE80", slide:"Slide 21",
    def:"Intégration des réseaux sociaux, avis communautaires, partage et interactions sociales.",
    nouasell:"Avis vérifiés avec photos, partage WhatsApp/Instagram, programme parrainage, wishlist partageable.",
    code:`CREATE TABLE reviews (\n  id UUID PRIMARY KEY,\n  product_id UUID REFERENCES products,\n  user_id UUID REFERENCES profiles,\n  verified_purchase BOOLEAN DEFAULT FALSE,\n  rating INT CHECK (rating BETWEEN 1 AND 5),\n  body TEXT,\n  photos JSONB,\n  helpful_votes INT DEFAULT 0\n);`,
    where:"🛍 Bas page → Avis communauté / ⚙️ Admin → ⭐ Avis"
  },
];

/* ─────────────────────────────────────────
   XRAY — Architecture Data
───────────────────────────────────────── */
const LAYERS = [
  {
    id:"client", label:"COUCHE CLIENT", color:C.cyan,
    nodes:[
      {id:"browser",label:"Navigateur Web",sub:"React / Next.js",icon:"🌐",
       code:`export default async function ProductPage({ params }) {\n  const product = await getProduct(params.slug)\n  return <ProductView product={product} />\n}`,course:"Slides 56–59 · Web & HTTP"},
      {id:"mobile",label:"App Mobile",sub:"React Native / PWA",icon:"📱",
       code:`// manifest.json\n{\n  "display": "standalone",\n  "start_url": "/",\n  "theme_color": "#04080F",\n  "background_color": "#1A1410"\n}`,course:"Slides 62–64 · M-Commerce"},
      {id:"cdn",label:"CDN / Edge",sub:"Vercel Edge Network",icon:"⚡",
       code:`export default {\n  images: { domains: ['cdn.store.ma'] },\n  experimental: { ppr: true }\n}`,course:"Slides 65–68 · Cloud Computing"},
    ]
  },
  {
    id:"api", label:"COUCHE API", color:C.green,
    nodes:[
      {id:"products_api",label:"API Produits",sub:"REST / GET · POST · PUT",icon:"📦",
       code:`export async function GET(req) {\n  const { data } = await supabase\n    .from('products').select('*')\n    .eq('status', 'active')\n  return Response.json(data)\n}`,course:"Slides 56 · Infrastructure"},
      {id:"auth_api",label:"Auth API",sub:"JWT · Sessions · OAuth",icon:"🔐",
       code:`export function middleware(req) {\n  const token = req.cookies.get('session')\n  if (!token) return redirect('/login')\n  return verifyJWT(token)\n}`,course:"Slides 74–78 · Sécurité"},
      {id:"checkout_api",label:"Checkout API",sub:"Stripe · CMI · PayPal",icon:"💳",
       code:`const session = await stripe.checkout\n  .sessions.create({\n    line_items: cartItems,\n    mode: 'payment',\n    success_url: '/merci',\n  })`,course:"Slides 80–84 · Paiements"},
      {id:"webhook",label:"Webhook",sub:"Events Stripe → DB",icon:"🔄",
       code:`switch (event.type) {\n  case 'checkout.session.completed':\n    await updateOrder({ status: 'paid' })\n    await sendConfirmEmail()\n    break\n}`,course:"Slides 86 · O2C"},
    ]
  },
  {
    id:"data", label:"COUCHE DONNÉES", color:C.amber,
    nodes:[
      {id:"db",label:"Base de Données",sub:"PostgreSQL / Supabase",icon:"🗄️",
       code:`CREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name TEXT NOT NULL,\n  price NUMERIC(10,2),\n  stock INT DEFAULT 0\n);\nCREATE POLICY "public_read"\n  ON products FOR SELECT\n  USING (status = 'active');`,course:"Slides 69 · Big Data"},
      {id:"storage",label:"Stockage Fichiers",sub:"Images · Médias · Docs",icon:"🗂️",
       code:`const { data } = await supabase.storage\n  .from('product-images')\n  .upload(fileName, file, {\n    contentType: 'image/webp',\n    upsert: true\n  })`,course:"Slides 65–68 · Cloud"},
      {id:"cache",label:"Cache / Redis",sub:"Sessions · Panier · KPIs",icon:"⚡",
       code:`await redis.setex(\n  \`cart:\${userId}\`,\n  3600,\n  JSON.stringify(cartItems)\n)\nconst cart = await redis.get(\`cart:\${userId}\`)`,course:"Slides 98 · Performance"},
    ]
  },
  {
    id:"infra", label:"COUCHE INFRASTRUCTURE", color:C.violet,
    nodes:[
      {id:"cicd",label:"CI/CD Pipeline",sub:"GitHub Actions → Vercel",icon:"🔧",
       code:`on:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    steps:\n      - run: npm test\n      - run: vercel --prod`,course:"Slides 92 · Alignement Tech"},
      {id:"monitoring",label:"Monitoring",sub:"Logs · Alertes · Uptime",icon:"📊",
       code:`import { track } from '@vercel/analytics'\ntrack('purchase', {\n  amount: order.total,\n  currency: 'MAD',\n  products: order.items.length\n})`,course:"Slides 108 · KPIs"},
      {id:"security",label:"Sécurité",sub:"SSL · WAF · PCI DSS",icon:"🛡️",
       code:`const securityHeaders = [\n  { key: 'X-Frame-Options', value: 'DENY' },\n  { key: 'Content-Security-Policy',\n    value: "default-src 'self'" },\n  { key: 'Strict-Transport-Security',\n    value: 'max-age=63072000' }\n]`,course:"Slides 77 · Sécurité"},
    ]
  },
];

const CONNECTIONS = [
  {from:"browser",to:"products_api",color:C.cyan},
  {from:"mobile",to:"checkout_api",color:C.cyan},
  {from:"cdn",to:"auth_api",color:C.cyan},
  {from:"products_api",to:"db",color:C.green},
  {from:"auth_api",to:"cache",color:C.green},
  {from:"checkout_api",to:"db",color:C.green},
  {from:"webhook",to:"db",color:C.green},
  {from:"db",to:"cicd",color:C.amber},
  {from:"storage",to:"monitoring",color:C.amber},
  {from:"cache",to:"security",color:C.amber},
];

const PAYMENT_STEPS = [
  {icon:"🛒",label:"Client clique\n'Acheter'",sub:"React state update",color:C.cyan,slide:"Slide 81"},
  {icon:"🔐",label:"Session\nauthentifiée",sub:"JWT vérifié",color:C.green,slide:"Slide 78"},
  {icon:"📋",label:"Commande créée\nen DB",sub:"status: 'pending'",color:C.amber,slide:"Slide 86"},
  {icon:"💳",label:"Redirigé vers\nStripe / CMI",sub:"TLS 1.3 + AES-256",color:C.violet,slide:"Slide 77"},
  {icon:"✅",label:"Paiement\nconfirmé",sub:"Webhook reçu",color:C.green,slide:"Slide 86"},
  {icon:"📦",label:"Stock\ndécrémenté",sub:"DB trigger SQL",color:C.amber,slide:"Slide 92"},
  {icon:"📧",label:"Email de\nconfirmation",sub:"Resend API",color:C.cyan,slide:"Slide 101"},
];

const DB_TABLES = [
  {name:"products",color:C.amber,fields:[["id","UUID 🔑"],["name","TEXT"],["price","NUMERIC"],["stock","INT"],["status","ENUM"],["images","JSONB"]]},
  {name:"orders",color:C.cyan,fields:[["id","UUID 🔑"],["user_id","FK →"],["total","NUMERIC"],["status","ENUM"],["stripe_id","TEXT"],["created_at","TIMESTAMP"]]},
  {name:"order_items",color:C.green,fields:[["id","UUID 🔑"],["order_id","FK →"],["product_id","FK →"],["qty","INT"],["price","NUMERIC"]]},
  {name:"profiles",color:C.violet,fields:[["id","UUID 🔑"],["email","TEXT"],["role","ENUM"],["loyalty_pts","INT"]]},
  {name:"reviews",color:C.pink,fields:[["id","UUID 🔑"],["product_id","FK →"],["rating","INT 1–5"],["verified","BOOL"],["body","TEXT"]]},
];

const SEC_LAYERS = [
  {level:1,label:"HTTPS / TLS 1.3",desc:"Chiffrement de toutes les communications",tech:"Certificat SSL automatique — Vercel",course:"Slide 77",color:C.cyan},
  {level:2,label:"Authentification JWT",desc:"Tokens signés, expiration 24h, rotation automatique",tech:"Supabase Auth / NextAuth.js",course:"Slide 78",color:C.green},
  {level:3,label:"Row Level Security",desc:"Chaque utilisateur voit uniquement ses données",tech:"PostgreSQL RLS Policies",course:"Slide 122",color:C.amber},
  {level:4,label:"PCI DSS Level 1",desc:"Données bancaires jamais stockées sur nos serveurs",tech:"Stripe Tokenisation + AES-256",course:"Slide 77",color:C.violet},
  {level:5,label:"Rate Limiting",desc:"Protection contre les attaques par force brute",tech:"Vercel Edge Middleware",course:"Slide 76",color:C.red},
];

/* ─────────────────────────────────────────
   PRODUCTS DATA
───────────────────────────────────────── */
const PRODUCTS = [
  {
    id:1, name:"Caftan Brodé Royal", cat:"Mode", price:1850,
    rating:4.8, rCount:124, stock:3, badge:"Bestseller", emoji:"👘",
    colors:["Bordeaux","Bleu nuit","Ivoire"], sizes:["S","M","L","XL"],
    desc:"Caftan en velours brodé à la main. Motifs géométriques traditionnels, fil d'or, doublure soie.",
    media:["📸 8 photos HD","🎬 Vidéo artisan 3min","📐 Guide tailles","🏅 Certificat authenticité"],
    reviews:[
      {n:"Salma B.",s:5,t:"Broderie parfaite, qualité digne d'un couturier.",v:true,d:"12 jan"},
      {n:"Karim M.",s:5,t:"Livraison en 3 jours, emballage luxueux.",v:true,d:"8 jan"},
      {n:"Nadia O.",s:4,t:"Très beau, couleur légèrement différente des photos.",v:false,d:"3 jan"},
    ]
  },
  {
    id:2, name:"Argan Pur Bio 100ml", cat:"Beauté", price:280,
    rating:4.9, rCount:312, stock:45, badge:"Top Ventes", emoji:"🫙",
    colors:["Standard"], sizes:["50ml","100ml","200ml"],
    desc:"Huile d'argan 100% pure, première pression à froid, certifiée bio ECOCERT.",
    media:["📸 6 photos HD","🧪 Analyse laboratoire","🏅 Certificat bio","📋 Fiche INCI"],
    reviews:[
      {n:"Leila H.",s:5,t:"Résultats visibles en une semaine.",v:true,d:"15 jan"},
      {n:"Amina K.",s:5,t:"Texture parfaite, sans résidu.",v:true,d:"10 jan"},
      {n:"Sara T.",s:5,t:"4ème commande — fidèle à vie !",v:true,d:"5 jan"},
    ]
  },
  {
    id:3, name:"Tajine en Terre Cuite", cat:"Maison", price:420,
    rating:4.7, rCount:89, stock:23, badge:"Artisanat", emoji:"🍲",
    colors:["Ocre","Blanc"], sizes:["24cm","28cm","32cm"],
    desc:"Tajine authentique de Safi, peint à la main. Utilisable en cuisson directe.",
    media:["📸 5 photos HD","🎬 Fabrication artisanale","📐 Dimensions","📋 Guide entretien"],
    reviews:[
      {n:"Youssef D.",s:5,t:"Saveurs incomparables, vraie cuisson lente.",v:true,d:"20 jan"},
      {n:"Fatima Z.",s:4,t:"Parfait comme cadeau.",v:true,d:"14 jan"},
    ]
  },
  {
    id:4, name:"Babouches Cuir Naturel", cat:"Mode", price:350,
    rating:4.6, rCount:201, stock:31, badge:"", emoji:"🥿",
    colors:["Naturel","Noir","Camel","Miel"], sizes:["38","39","40","41","42","43","44"],
    desc:"Babouches en cuir végétal tanné, finitions cousues main. Artisans de Fès.",
    media:["📸 8 photos","🎨 12 coloris","📏 Guide tailles","🎬 Savoir-faire Fès"],
    reviews:[
      {n:"Omar L.",s:5,t:"Confort incroyable, port toute la journée.",v:true,d:"18 jan"},
      {n:"Rim A.",s:4,t:"Très belle qualité de cuir.",v:false,d:"9 jan"},
    ]
  },
  {
    id:5, name:"Thé à la Menthe Premium", cat:"Épicerie", price:95,
    rating:4.9, rCount:445, stock:120, badge:"Favori", emoji:"🍵",
    colors:["Signature"], sizes:["50g","100g","200g"],
    desc:"Gunpowder et menthe fraîche séchée. Coffret cadeau avec notice de préparation.",
    media:["📸 3 photos HD","🌿 Origine certifiée","🎁 Packaging cadeau"],
    reviews:[
      {n:"Hassan M.",s:5,t:"Le meilleur thé que j'aie goûté.",v:true,d:"22 jan"},
      {n:"Zineb R.",s:5,t:"Parfum incroyable, très authentique.",v:true,d:"17 jan"},
    ]
  },
  {
    id:6, name:"Coussin Berbère Tissé", cat:"Maison", price:680,
    rating:4.7, rCount:67, stock:14, badge:"Nouveau", emoji:"🛋️",
    colors:["Naturel","Rouge","Ocre"], sizes:["40×40cm","50×50cm","60×60cm"],
    desc:"Laine berbère tissée à la main dans le Haut Atlas. Motifs symboles de protection.",
    media:["📸 6 photos HD","🎬 Artisane au travail","🗺️ Origine Haut-Atlas"],
    reviews:[
      {n:"Dounia S.",s:5,t:"Pièce centrale de mon salon.",v:true,d:"11 jan"},
    ]
  },
  {
    id:7, name:"Savon Beldi Noir", cat:"Beauté", price:120,
    rating:4.8, rCount:289, stock:78, badge:"", emoji:"🫧",
    colors:["Standard"], sizes:["200g","400g","800g"],
    desc:"Savon beldi naturel au ghassoul et huile d'olive. Idéal hammam traditionnel.",
    media:["📸 4 photos HD","🧪 Composition détaillée","♻️ Emballage éco"],
    reviews:[
      {n:"Meryem B.",s:5,t:"Peau douce après la 1ère utilisation.",v:true,d:"19 jan"},
      {n:"Ines C.",s:5,t:"Sent divinement bon.",v:true,d:"13 jan"},
    ]
  },
  {
    id:8, name:"Plateau Zellige Doré", cat:"Maison", price:950,
    rating:4.9, rCount:43, stock:4, badge:"Exclusif", emoji:"✨",
    colors:["Doré","Argenté"], sizes:["30cm","40cm","50cm"],
    desc:"Zellige doré par maître artisan. Pièce unique numérotée avec certificat.",
    media:["📸 10 photos HD","🔢 N° de série","🎬 Maître zellij","🏅 Certificat"],
    reviews:[
      {n:"Adil K.",s:5,t:"Pièce d'exception, certificat inclus.",v:true,d:"6 jan"},
    ]
  },
];

const CATS = ["Tous","Mode","Maison","Beauté","Épicerie"];
const RATES = { MAD:1, EUR:0.092, USD:0.099, GBP:0.079 };
const SYM = { MAD:"MAD", EUR:"€", USD:"$", GBP:"£" };
const PROMOS = { "ENCG2025":10, "MAROC10":10, "ARTISAN15":15 };

const CHAT_BOT = {
  livraison:"📦 Livraison 2–5 jours au Maroc (DHL Express), 7–14 jours international. Suivi temps réel inclus !",
  paiement:"💳 CMI, Stripe, PayPal et Cash à la livraison. Paiement 100% sécurisé TLS 1.3 + PCI DSS.",
  retour:"↩️ Retours gratuits sous 30 jours. Remboursement sous 48h après réception du colis.",
  artisan:"🤝 Tous nos artisans sont certifiés et sourcés directement — 0 intermédiaire.",
  promo:"🏷️ Code ENCG2025 pour -10% sur votre 1ère commande !",
  default:"👋 Bonjour ! Je suis l'assistant NouaSell. Tapez : livraison, paiement, retour, artisan ou promo.",
};

/* ─────────────────────────────────────────
   🔔 TOAST SYSTEM
───────────────────────────────────────── */
function ToastContainer({ toasts }) {
  return (
    <div style={{position:"fixed",top:60,right:16,zIndex:1000,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="success"?"#0C2A1A":t.type==="error"?"#2A0C14":C.s2,
          border: `1px solid ${t.type==="success"?C.green:t.type==="error"?C.red:C.b2}`,
          borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:8,
          minWidth:240, boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
          animation:`${t.leaving?"slideOutRight":"slideInRight"} .3s ease forwards`
        }}>
          <span style={{fontSize:16}}>{t.icon}</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,
            color:t.type==="success"?C.green:t.type==="error"?C.red:C.text,fontWeight:600}}>
            {t.msg}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [mode, setMode] = useState("store");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currency, setCurrency] = useState("MAD");
  const [toasts, setToasts] = useState([]);
  const [loyaltyPts, setLoyaltyPts] = useState(0);

  const toast = useCallback((msg, type="success", icon="✓") => {
    const id = Date.now();
    setToasts(p => [...p, {id, msg, type, icon, leaving:false}]);
    setTimeout(() => setToasts(p => p.map(t => t.id===id ? {...t,leaving:true} : t)), 2500);
    setTimeout(() => setToasts(p => p.filter(t => t.id!==id)), 2900);
  }, []);

  const fx = useCallback((p, cur=currency) => {
    const v = (p * RATES[cur]).toFixed(cur==="MAD" ? 0 : 2);
    return `${Number(v).toLocaleString()} ${SYM[cur]}`;
  }, [currency]);

  const addToCart = useCallback((product, opts={}) => {
    const key = `${product.id}-${opts.color||""}-${opts.size||""}`;
    setCart(prev => {
      const ex = prev.find(i => i.key===key);
      return ex
        ? prev.map(i => i.key===key ? {...i,qty:i.qty+1} : i)
        : [...prev, {...product,...opts,key,qty:1}];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
    toast(`${product.emoji} ${product.name} ajouté !`, "success", "🛒");
  }, [toast]);

  const removeFromCart = (key) => setCart(p => p.filter(i => i.key!==key));
  const updateQty = (key, d) => setCart(p => p.map(i => i.key===key ? {...i,qty:Math.max(1,i.qty+d)} : i));
  const cartTotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  const toggleWishlist = (p) => {
    const has = wishlist.find(x => x.id===p.id);
    setWishlist(prev => has ? prev.filter(x => x.id!==p.id) : [...prev,p]);
    toast(has ? `${p.emoji} Retiré des favoris` : `${p.emoji} Ajouté aux favoris !`, has?"info":"success", has?"🤍":"❤️");
  };

  const placeOrder = (info, discount=0) => {
    const discountAmt = Math.round(cartTotal * discount / 100);
    const deliveryFee = info.delivery==="express" ? 50 : cartTotal>=500 ? 0 : 30;
    const finalTotal = cartTotal - discountAmt + deliveryFee;
    const pts = Math.round(finalTotal / 10);
    const order = {
      id: `CMD-${Date.now().toString().slice(-5)}`,
      items:[...cart], total:finalTotal, originalTotal:cartTotal,
      discount, discountAmt, deliveryFee,
      customer:info, status:"En attente",
      date:new Date().toLocaleString('fr-FR'),
    };
    setOrders(p => [order, ...p]);
    setLoyaltyPts(p => p + pts);
    setCart([]);
    setCartOpen(false);
    toast(`Commande ${order.id} confirmée ! +${pts} pts 🎉`, "success", "✅");
    return order;
  };

  const MODES = [
    {id:"store", icon:"🛍", label:"Boutique"},
    {id:"admin", icon:"⚙️", label:"Admin"},
    {id:"xray",  icon:"◈",  label:"X-Ray"},
  ];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}}>
      <style>{CSS}</style>
      <ToastContainer toasts={toasts}/>

      {/* ── TOP BAR ── */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.b}`,padding:"0 18px",display:"flex",alignItems:"center",gap:10,height:48,flexShrink:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginRight:6}}>
          <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#fff"}}>N</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:C.text}}>NouaSell</span>
        </div>

        <div style={{display:"flex",gap:2,background:C.s2,borderRadius:9,padding:2,border:`1px solid ${C.b}`}}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              background:mode===m.id?C.s3:"transparent",
              border:`1px solid ${mode===m.id?C.b2:"transparent"}`,
              borderRadius:7,padding:"4px 11px",
              color:mode===m.id?C.text:C.sub,
              fontSize:11,cursor:"pointer",fontWeight:600,
              transition:"all .2s",fontFamily:"'Outfit',sans-serif",
              display:"flex",alignItems:"center",gap:4
            }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {loyaltyPts>0 && (
          <div style={{background:`${C.gold}20`,border:`1px solid ${C.gold}44`,borderRadius:6,padding:"2px 8px",fontSize:9,color:C.gold,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>
            ⭐ {loyaltyPts} pts
          </div>
        )}

        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {mode==="store" && (
            <div style={{display:"flex",gap:2,background:C.s2,borderRadius:6,padding:2,border:`1px solid ${C.b}`}}>
              {["MAD","EUR","USD","GBP"].map(cur => (
                <button key={cur} onClick={() => setCurrency(cur)} style={{
                  background:currency===cur?`${C.gold}33`:"transparent",border:"none",borderRadius:4,
                  padding:"3px 6px",color:currency===cur?C.gold:C.dim,fontSize:9,
                  cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,transition:"all .2s"
                }}>{cur}</button>
              ))}
            </div>
          )}
          <div style={{overflow:"hidden",width:180,background:C.s2,borderRadius:6,border:`1px solid ${C.b}`,padding:"3px 8px",fontSize:9,color:C.sub,fontFamily:"'JetBrains Mono',monospace"}}>
            <div style={{whiteSpace:"nowrap",animation:"ticker 14s linear infinite",display:"inline-block"}}>
              ✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;
            </div>
          </div>
          {mode!=="xray" && (
            <button onClick={() => setCartOpen(true)} style={{
              background:cartCount>0?`${C.gold}22`:"transparent",
              border:`1px solid ${cartCount>0?C.gold:C.b}`,
              borderRadius:8,padding:"5px 11px",
              color:cartCount>0?C.gold:C.sub,cursor:"pointer",
              display:"flex",alignItems:"center",gap:5,
              fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,
              transition:"all .3s",animation:cartBounce?"cartBounce .6s ease":"none"
            }}>
              🛒
              {cartCount>0 && (
                <span style={{background:C.gold,color:"#1A1410",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>
                  {cartCount}
                </span>
              )}
              {cartCount>0 && (
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>
                  {fx(cartTotal)}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",position:"relative"}}>
        {mode==="store" && <StoreView products={PRODUCTS} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} fx={fx}/>}
        {mode==="admin" && <AdminView orders={orders} setOrders={setOrders} products={PRODUCTS} loyaltyPts={loyaltyPts}/>}
        {mode==="xray"  && <XRayView/>}
      </div>

      {cartOpen && (
        <CartDrawer
          cart={cart} total={cartTotal}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart} onQty={updateQty}
          onOrder={placeOrder} fx={fx} toast={toast}
        />
      )}
      {mode==="store" && <ChatWidget open={chatOpen} onToggle={() => setChatOpen(o => !o)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────
   💬 CHAT WIDGET — Interactivité Slide 18
───────────────────────────────────────── */
function ChatWidget({ open, onToggle }) {
  const [msgs, setMsgs] = useState([{from:"bot",text:CHAT_BOT.default}]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => endRef.current?.scrollIntoView({behavior:"smooth"}), 50);
  }, [msgs, open]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = {from:"user", text:input};
    const key = Object.keys(CHAT_BOT).find(k => input.toLowerCase().includes(k) && k!=="default") || "default";
    setMsgs(p => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(p => [...p, {from:"bot",text:CHAT_BOT[key]}]); }, 900);
  };

  return (
    <>
      <button onClick={onToggle} style={{
        position:"fixed",bottom:20,right:20,width:46,height:46,borderRadius:"50%",
        background:`linear-gradient(135deg,${C.gold},#8B6914)`,border:"none",cursor:"pointer",
        fontSize:18,zIndex:200,boxShadow:`0 4px 20px ${C.gold}55`,
        display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s"
      }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
        {open?"✕":"💬"}
      </button>

      {open && (
        <div className="fu" style={{
          position:"fixed",bottom:78,right:20,width:300,height:370,
          background:C.cream,borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,0.25)",
          zIndex:200,display:"flex",flexDirection:"column",overflow:"hidden",border:"1px solid #E5E7EB"
        }}>
          <div style={{background:C.dark,padding:"11px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#FAFAF7"}}>Support NouaSell</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#6B5A42",marginLeft:"auto"}}>Interactivité · Slide 18</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:7}}>
            {msgs.map((m, i) => (
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                <div style={{
                  maxWidth:"83%",background:m.from==="user"?C.dark:"#F3F4F6",
                  borderRadius:10,padding:"7px 11px",fontFamily:"'Outfit',sans-serif",
                  fontSize:11,color:m.from==="user"?"#FAFAF7":"#1A1410",lineHeight:1.5,animation:"fadeUp .2s ease"
                }}>{m.text}</div>
              </div>
            ))}
            {typing && (
              <div style={{display:"flex",gap:3,padding:"8px 12px",background:"#F3F4F6",borderRadius:10,width:52}}>
                {[0,1,2].map(i => <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#9CA3AF",animation:`ping .9s ease ${i*.2}s infinite`}}/>)}
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div style={{display:"flex",gap:6,padding:"9px 10px",borderTop:"1px solid #E5E7EB"}}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()}
              placeholder="livraison, promo, retour..."
              style={{flex:1,border:"1px solid #E5E7EB",borderRadius:8,padding:"7px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff"}}/>
            <button onClick={send} style={{background:C.dark,border:"none",borderRadius:8,padding:"7px 12px",color:"#FAFAF7",cursor:"pointer",fontSize:13,transition:"all .2s"}}
              onMouseEnter={e => e.currentTarget.style.background=C.b2}
              onMouseLeave={e => e.currentTarget.style.background=C.dark}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   🛍 STORE VIEW
───────────────────────────────────────── */
function StoreView({ products, onAdd, wishlist, onWish, fx }) {
  const [cat, setCat] = useState("Tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 1100); }, []);

  const filtered = products
    .filter(p => (cat==="Tous" || p.cat===cat) && (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) =>
      sort==="price_asc"  ? a.price - b.price :
      sort==="price_desc" ? b.price - a.price :
      sort==="rating"     ? b.rating - a.rating :
      b.rCount - a.rCount
    );

  const toggleCompare = (p) => setCompare(prev =>
    prev.find(x => x.id===p.id) ? prev.filter(x => x.id!==p.id) :
    prev.length < 3 ? [...prev, p] : prev
  );

  return (
    <div style={{flex:1,overflowY:"auto",background:C.shopBg}}>

      {/* ── Promo banner ── */}
      {promoVisible && (
        <div style={{background:`linear-gradient(90deg,${C.dark},#2C1F0E,${C.dark})`,padding:"7px 40px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,position:"relative"}}>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.gold}}>
            🏷️ Code <strong>ENCG2025</strong> — -10% sur votre 1ère commande · Livraison offerte dès 500 MAD
          </span>
          <button onClick={() => setPromoVisible(false)} style={{position:"absolute",right:14,background:"transparent",border:"none",color:"#6B5A42",cursor:"pointer",fontSize:13}}>✕</button>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{background:`linear-gradient(135deg,#1A1410 0%,#2C1F0E 40%,#1A1410 100%)`,padding:"30px 40px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}12,transparent 70%)`}}/>
        <div style={{position:"relative",maxWidth:960,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.gold,letterSpacing:"0.2em",marginBottom:8}}>✦ L'ARTISANAT MAROCAIN EN LIGNE</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:30,color:"#FAFAF7",lineHeight:1.2,marginBottom:12}}>
                Découvrez <em style={{fontStyle:"italic",color:C.gold}}>l'authenticité</em><br/>marocaine
              </h1>
              {/* Search dans le hero */}
              <div style={{position:"relative",maxWidth:420,marginBottom:14}}>
                <input placeholder="Caftan, argan, zellige..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 40px 10px 16px",fontSize:13,fontFamily:"'Outfit',sans-serif",color:"#FAFAF7",outline:"none"}}/>
                <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#6B5A42",fontSize:15}}>🔍</span>
              </div>
              <div style={{display:"flex",gap:18}}>
                {[["12k+","Commandes"],["47","Pays"],["340","Artisans"],["4.8★","Satisfaction"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.gold,animation:"countUp .6s ease"}}>{v}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B5A42"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ubiquité widget — Slide 14 */}
            <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",minWidth:175}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.gold,letterSpacing:"0.14em",marginBottom:8}}>🌐 UBIQUITÉ · SLIDE 14</div>
              {[["🖥️","Desktop","Tous navigateurs"],["📱","Mobile","iOS & Android"],["⌚","Tablette","iPad · Galaxy Tab"]].map(([ico,d,sub]) => (
                <div key={d} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:14}}>{ico}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#FAFAF7",fontWeight:600}}>{d}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#6B5A42"}}>{sub}</div>
                  </div>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 5px ${C.green}`}}/>
                </div>
              ))}
            </div>
          </div>

          {/* Standards Universels — protocoles actifs — Slide 16 */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:12}}>
            {[["🔒","HTTPS/TLS 1.3"],["⚡","REST API"],["🔑","OAuth 2.0"],["💳","PCI DSS L1"],["🌍","CDN 42 régions"]].map(([ico,label]) => (
              <div key={label} style={{background:"rgba(0,212,255,0.07)",border:"1px solid rgba(0,212,255,0.18)",borderRadius:5,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                <span style={{fontSize:9}}>{ico}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#00D4FF"}}>{label}</span>
              </div>
            ))}
            <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}30`,borderRadius:5,padding:"2px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold}}>
              🔌 Standards Universels · Slide 16
            </div>
          </div>
        </div>
      </div>

      {/* ── Personnalisation — Recommandations — Slide 19 ── */}
      <div style={{padding:"14px 40px 0",maxWidth:1060,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFFBF5)",border:"1px solid #FDE8C0",borderRadius:14,padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:14}}>🎯</span>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#92400E"}}>Sélection pour vous</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.amber,background:"#FDE8C010",border:"1px solid #FDE8C0",borderRadius:4,padding:"1px 5px",marginLeft:"auto"}}>Personnalisation · Slide 19</span>
          </div>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
            {products.filter(p => p.rating>=4.8).slice(0,5).map(p => (
              <div key={p.id} onClick={() => setSelected(p)} style={{background:"#fff",border:"1px solid #F0EDE8",borderRadius:10,padding:"9px 12px",cursor:"pointer",minWidth:148,flexShrink:0,display:"flex",alignItems:"center",gap:8,transition:"all .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}
                onMouseEnter={e => {e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.10)";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e => {e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";e.currentTarget.style.transform="none";}}>
                <span style={{fontSize:28,flexShrink:0}}>{p.emoji}</span>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:11,color:"#1A1410",lineHeight:1.3,marginBottom:2}}>{p.name}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#1A1410"}}>{fx(p.price)}</div>
                  <div style={{color:C.gold,fontSize:9}}>{"★".repeat(5)} {p.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div style={{background:C.cream,borderBottom:"1px solid #E5E7EB",padding:"10px 40px",display:"flex",gap:8,alignItems:"center",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              background:cat===c?"#1A1410":"transparent",
              border:`1px solid ${cat===c?"#1A1410":"#D1D5DB"}`,
              borderRadius:20,padding:"5px 13px",fontSize:11,fontWeight:600,
              cursor:"pointer",color:cat===c?"#FAFAF7":"#4B5563",
              fontFamily:"'Outfit',sans-serif",transition:"all .2s"
            }}>{c}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:7,padding:"5px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",color:"#374151",background:"#fff",outline:"none",cursor:"pointer"}}>
            <option value="popular">Plus populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
          {compare.length>0 && (
            <button onClick={() => setShowCompare(true)} style={{background:"#1A1410",border:"none",borderRadius:7,padding:"5px 11px",color:"#FAFAF7",fontSize:10,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700}}>
              ⚖️ Comparer ({compare.length})
            </button>
          )}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9CA3AF"}}>{filtered.length} produits</div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div style={{padding:"18px 40px 40px",maxWidth:1060,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:16}}>
          {loading ? [...Array(8)].map((_,i) => (
            <div key={i} style={{background:"#fff",borderRadius:16,overflow:"hidden"}}>
              <div className="skel" style={{height:145,width:"100%"}}/>
              <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:7}}>
                <div className="skel" style={{height:10,borderRadius:4,width:"60%"}}/>
                <div className="skel" style={{height:14,borderRadius:4,width:"85%"}}/>
                <div className="skel" style={{height:10,borderRadius:4,width:"45%"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div className="skel" style={{height:18,borderRadius:4,width:"40%"}}/>
                  <div className="skel" style={{height:30,borderRadius:7,width:"38%"}}/>
                </div>
              </div>
            </div>
          )) : filtered.map((p, i) => {
            const inWish = wishlist.find(x => x.id===p.id);
            const inCmp  = compare.find(x => x.id===p.id);
            const isLow  = p.stock <= 5;
            return (
              <div key={p.id} style={{
                background:"#fff",
                border:`1px solid ${inCmp?"#1A1410":"#F0EDE8"}`,
                borderRadius:16,overflow:"hidden",transition:"all .25s",
                boxShadow:inCmp?"0 0 0 2px #1A1410":"0 1px 4px rgba(0,0,0,0.06)",
                animation:`fadeUp .3s ease ${i*.04}s both`
              }}
                onMouseEnter={e => { if(!inCmp){e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-3px)";}}}
                onMouseLeave={e => { if(!inCmp){e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}}>

                {/* Richesse — image area avec badges médias — Slide 17 */}
                <div onClick={() => setSelected(p)} style={{height:145,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
                  <span style={{fontSize:56}}>{p.emoji}</span>
                  {p.badge && (
                    <div style={{position:"absolute",top:8,left:8,background:p.badge==="Bestseller"?"#1A1410":p.badge==="Nouveau"?C.cyan:p.badge==="Exclusif"?C.gold:"#059669",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4}}>{p.badge}</div>
                  )}
                  {isLow
                    ? <div style={{position:"absolute",top:8,right:8,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4,padding:"2px 6px",fontSize:8,color:"#EF4444",fontWeight:700}}>⚡ Plus que {p.stock} !</div>
                    : <div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.85)",borderRadius:4,padding:"1px 5px",fontSize:9,color:"#6B5A42",fontFamily:"'JetBrains Mono',monospace"}}>Stock:{p.stock}</div>
                  }
                  <div style={{position:"absolute",bottom:6,left:8,display:"flex",gap:3}}>
                    {p.media.slice(0,2).map((m,j) => <div key={j} style={{background:"rgba(0,0,0,0.55)",borderRadius:3,padding:"1px 4px",fontSize:7,color:"#fff"}}>{m.split(" ")[0]}</div>)}
                  </div>
                  {/* Wishlist — Technologie Sociale */}
                  <button onClick={e => {e.stopPropagation();onWish(p);}} style={{position:"absolute",bottom:6,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",animation:inWish?"heartPop .3s ease":"none"}}>
                    {inWish?"❤️":"🤍"}
                  </button>
                </div>

                <div style={{padding:"11px 13px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:3}}>{p.cat.toUpperCase()}</div>
                  <div onClick={() => setSelected(p)} style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#1A1410",marginBottom:4,lineHeight:1.3,cursor:"pointer"}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                    <span style={{color:C.gold,fontSize:10}}>{"★".repeat(Math.floor(p.rating))}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#9B8A6E"}}>{p.rating} ({p.rCount})</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:"#1A1410"}}>{fx(p.price)}</span>
                    <div style={{display:"flex",gap:3}}>
                      {/* Densité d'information — comparateur */}
                      <button onClick={() => toggleCompare(p)} style={{background:inCmp?"#1A1410":"transparent",border:`1px solid ${inCmp?"#1A1410":"#E5E7EB"}`,borderRadius:6,padding:"5px 6px",cursor:"pointer",fontSize:10,color:inCmp?"#FAFAF7":"#9CA3AF",transition:"all .2s"}} title="Comparer (Densité d'info)">⚖️</button>
                      <button onClick={() => setSelected(p)} style={{background:"#1A1410",border:"none",borderRadius:7,padding:"6px 11px",color:"#FAFAF7",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}
                        onMouseEnter={e => e.currentTarget.style.background="#2C1F0E"}
                        onMouseLeave={e => e.currentTarget.style.background="#1A1410"}>Voir →</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technologie Sociale — avis communauté — Slide 21 */}
        {!loading && (
          <div style={{marginTop:26,background:"#fff",border:"1px solid #F0EDE8",borderRadius:14,padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:16}}>👥</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#1A1410"}}>La communauté NouaSell</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.violet,background:`${C.violet}12`,border:`1px solid ${C.violet}25`,borderRadius:4,padding:"1px 5px",marginLeft:"auto"}}>Tech. Sociale · Slide 21</span>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
              {products.flatMap(p => p.reviews.map(r => ({...r,product:p.name,emoji:p.emoji}))).filter(r => r.v).slice(0,6).map((r, i) => (
                <div key={i} style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:10,padding:"10px 13px",minWidth:190,flexShrink:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{r.n[0]}</div>
                    <div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:"#1A1410"}}>{r.n}</div>
                      <div style={{color:C.gold,fontSize:9}}>{"★".repeat(r.s)}</div>
                    </div>
                    <div style={{marginLeft:"auto",background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 4px",fontSize:7,color:"#059669",fontWeight:700}}>✓ Vérifié</div>
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#4B5563",lineHeight:1.5,marginBottom:5}}>"{r.t}"</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>{r.emoji} {r.product}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,marginTop:12,alignItems:"center"}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280"}}>Partager :</span>
              {[["📱","WhatsApp","#25D366"],["📸","Instagram","#E1306C"],["🐦","X/Twitter","#1DA1F2"]].map(([ico,name,color]) => (
                <div key={name} style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:6,padding:"4px 10px",fontSize:10,color,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e => e.currentTarget.style.background=`${color}22`}
                  onMouseLeave={e => e.currentTarget.style.background=`${color}12`}>{ico} {name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} fx={fx}/>}
      {showCompare && compare.length>0 && <CompareModal products={compare} onClose={() => setShowCompare(false)} fx={fx}/>}
    </div>
  );
}

/* ── Product Modal — Richesse + Avis ── */
function ProductModal({ product:p, onClose, onAdd, onWish, wishlist, fx }) {
  const [tab, setTab] = useState("info");
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(p.sizes?.[0] || null);
  const [adding, setAdding] = useState(false);
  const inWish = wishlist.find(x => x.id===p.id);
  const isLow  = p.stock <= 5;

  const handleAdd = () => {
    setAdding(true);
    for (let i=0; i<qty; i++) onAdd(p, {color, size});
    setTimeout(() => { setAdding(false); onClose(); }, 800);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}}>
      <div onClick={e => e.stopPropagation()} className="fu" style={{background:C.cream,borderRadius:20,width:540,maxWidth:"93vw",maxHeight:"90vh",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.35)",display:"flex",flexDirection:"column"}}>
        {/* Image */}
        <div style={{height:180,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,position:"relative",flexShrink:0}}>
          {p.emoji}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.15)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#4B5563",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <button onClick={() => onWish(p)} style={{position:"absolute",top:12,left:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",animation:inWish?"heartPop .3s ease":"none"}}>
            {inWish?"❤️":"🤍"}
          </button>
          {isLow && <div style={{position:"absolute",bottom:10,left:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:6,padding:"3px 8px",fontSize:9,color:"#EF4444",fontWeight:700}}>⚡ Seulement {p.stock} en stock !</div>}
          <div style={{position:"absolute",top:10,right:50,background:"rgba(201,169,110,0.85)",borderRadius:5,padding:"2px 7px",fontSize:7,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>🎬 Richesse · Slide 17</div>
          <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:3}}>
            {p.media.map((m,i) => <div key={i} style={{background:"rgba(0,0,0,0.55)",borderRadius:3,padding:"1px 4px",fontSize:7,color:"#fff"}}>{m.split(" ")[0]}</div>)}
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid #E5E7EB",flexShrink:0}}>
          {[["info","📋 Produit"],["reviews",`⭐ Avis (${p.reviews.length})`]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{flex:1,padding:"10px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#1A1410":"transparent"}`,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?"#1A1410":"#6B7280",transition:"all .2s"}}>{label}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {tab==="info" && (
            <>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:4}}>{p.cat.toUpperCase()}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{color:C.gold,fontSize:13}}>{"★".repeat(Math.floor(p.rating))}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{p.rating}/5 · {p.rCount} avis</span>
                {p.reviews.filter(r => r.v).length>0 && <span style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 5px",fontSize:8,color:"#059669",fontWeight:700,marginLeft:"auto"}}>✓ Achats vérifiés</span>}
              </div>
              <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563",lineHeight:1.7,marginBottom:14}}>{p.desc}</p>

              {p.colors.length>1 && (
                <div style={{marginBottom:12}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>Couleur : <span style={{color:"#1A1410"}}>{color}</span></div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {p.colors.map(c => <button key={c} onClick={() => setColor(c)} style={{background:color===c?"#1A1410":"transparent",border:`1px solid ${color===c?"#1A1410":"#D1D5DB"}`,borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer",color:color===c?"#FAFAF7":"#4B5563",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{c}</button>)}
                  </div>
                </div>
              )}
              {size && (
                <div style={{marginBottom:12}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>Taille : <span style={{color:"#1A1410"}}>{size}</span></div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {p.sizes.map(s => <button key={s} onClick={() => setSize(s)} style={{background:size===s?"#1A1410":"transparent",border:`1px solid ${size===s?"#1A1410":"#D1D5DB"}`,borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:size===s?"#FAFAF7":"#4B5563",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{s}</button>)}
                  </div>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,paddingTop:12,borderTop:"1px solid #F0EDE8"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#1A1410"}}>{fx(p.price*qty)}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>{qty>1&&`${fx(p.price)} × ${qty} · `}Stock: {p.stock}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,background:"#F3F4F6",borderRadius:8,padding:"4px 8px"}}>
                    <button onClick={() => setQty(Math.max(1,qty-1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:"#4B5563",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#1A1410",minWidth:18,textAlign:"center"}}>{qty}</span>
                    <button onClick={() => setQty(Math.min(p.stock,qty+1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:"#4B5563",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <button onClick={handleAdd} style={{background:adding?"#059669":"#1A1410",border:"none",borderRadius:10,padding:"11px 20px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",minWidth:130,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    {adding ? <><span style={{animation:"rotateIn .4s ease"}}>✓</span> Ajouté !</> : "🛒 Ajouter au panier"}
                  </button>
                </div>
              </div>
            </>
          )}
          {tab==="reviews" && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",background:"#F9FAFB",borderRadius:10}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:"#1A1410"}}>{p.rating}</div>
                <div>
                  <div style={{color:C.gold,fontSize:18}}>{"★".repeat(Math.floor(p.rating))}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280"}}>{p.rCount} avis · {p.reviews.filter(r=>r.v).length} vérifiés</div>
                </div>
                <div style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.violet,background:`${C.violet}12`,border:`1px solid ${C.violet}22`,borderRadius:4,padding:"2px 6px"}}>👥 Tech. Sociale · Slide 21</div>
              </div>
              {p.reviews.map((r,i) => (
                <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #F0EDE8"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{r.n[0]}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{r.n}</div>
                      <div style={{color:C.gold,fontSize:11}}>{"★".repeat(r.s)}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
                      {r.v && <div style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 5px",fontSize:8,color:"#059669",fontWeight:700}}>✓ Achat vérifié</div>}
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9CA3AF"}}>{r.d}</div>
                    </div>
                  </div>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563",lineHeight:1.6,paddingLeft:40}}>{r.t}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Comparateur — Densité d'information ── */
function CompareModal({ products, onClose, fx }) {
  const rows = [
    ["Prix",     p => fx(p.price)],
    ["Note",     p => `${"★".repeat(Math.floor(p.rating))} ${p.rating}`],
    ["Avis",     p => `${p.rCount} avis`],
    ["Stock",    p => `${p.stock} unités`],
    ["Catégorie",p => p.cat],
    ["Couleurs", p => `${p.colors.length} option(s)`],
    ["Tailles",  p => `${p.sizes.length} option(s)`],
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e => e.stopPropagation()} className="fu" style={{background:C.cream,borderRadius:20,maxWidth:"92vw",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"13px 20px",background:C.dark,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#FAFAF7"}}>Comparateur de produits</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,marginLeft:10}}>📊 Densité d'information · Slide 20</span>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"#FAFAF7",fontSize:13}}>✕</button>
        </div>
        <div style={{padding:18,overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",width:"100%",fontFamily:"'Outfit',sans-serif"}}>
            <thead>
              <tr>
                <th style={{padding:"8px 14px",textAlign:"left",fontSize:11,color:"#6B7280",fontWeight:600,borderBottom:"2px solid #E5E7EB"}}></th>
                {products.map(p => (
                  <th key={p.id} style={{padding:"8px 18px",textAlign:"center",borderBottom:"2px solid #E5E7EB",minWidth:130}}>
                    <div style={{fontSize:32,marginBottom:4}}>{p.emoji}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:11,color:"#1A1410"}}>{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label} style={{borderBottom:"1px solid #F0EDE8"}}>
                  <td style={{padding:"10px 14px",fontWeight:600,fontSize:12,color:"#374151"}}>{label}</td>
                  {products.map(p => (
                    <td key={p.id} style={{padding:"10px 18px",textAlign:"center",fontSize:13,color:"#1A1410",fontFamily:label==="Prix"?"'Syne',sans-serif":"'Outfit',sans-serif",fontWeight:label==="Prix"?800:400}}>
                      {render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   🛒 CART DRAWER — Tunnel 4 étapes
───────────────────────────────────────── */
function CartDrawer({ cart, total, onClose, onRemove, onQty, onOrder, fx, toast }) {
  const [step, setStep]   = useState(0); // 0=cart 1=livraison 2=paiement 3=confirm
  const [info, setInfo]   = useState({name:"",email:"",phone:"",address:"",city:"Casablanca",delivery:"standard"});
  const [payment, setPayment] = useState("CMI");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [paying, setPaying] = useState(false);
  const [trackStep, setTrackStep] = useState(0);

  const discount   = promoApplied ? PROMOS[promoApplied] : 0;
  const deliveryFee = info.delivery==="express" ? 50 : total>=500 ? 0 : 30;
  const discountAmt = Math.round(total * discount / 100);
  const finalTotal  = total - discountAmt + deliveryFee;

  const applyPromo = () => {
    if (PROMOS[promo.toUpperCase()]) {
      setPromoApplied(promo.toUpperCase());
      toast(`Code ${promo.toUpperCase()} appliqué ! -${PROMOS[promo.toUpperCase()]}%`, "success", "🏷️");
    } else {
      toast("Code promo invalide", "error", "✕");
    }
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      const o = onOrder({...info, payment}, discount);
      setConfirmed(o);
      setStep(3);
      setPaying(false);
      [1,2,3].forEach((v, idx) => setTimeout(() => setTrackStep(v), 3000 + idx*4000));
    }, 2200);
  };

  const STEP_LABELS = ["Panier","Livraison","Paiement","Confirmation"];

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={step<3 ? onClose : undefined} style={{flex:1,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(3px)"}}/>
      <div className="fi" style={{width:420,background:C.cream,display:"flex",flexDirection:"column",boxShadow:"-8px 0 48px rgba(0,0,0,0.25)",position:"relative"}}>

        {/* Header + barre de progression */}
        <div style={{padding:"14px 18px",background:C.dark,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:step<3?10:0}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#FAFAF7"}}>{STEP_LABELS[step]}</div>
            {step<3 && <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#FAFAF7",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
          </div>
          {step<3 && (
            <div style={{display:"flex",gap:4}}>
              {STEP_LABELS.slice(0,3).map((s,i) => (
                <div key={s} style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{height:3,borderRadius:2,background:i<=step?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.2)",transition:"all .4s"}}/>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:i===step?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)",fontWeight:i===step?700:400}}>{s}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>

          {/* ── ÉTAPE 0 : Panier ── */}
          {step===0 && (
            <>
              {cart.length===0
                ? <div style={{textAlign:"center",padding:"40px 20px",color:"#9B8A6E",fontFamily:"'Outfit',sans-serif"}}><div style={{fontSize:40,marginBottom:12}}>🛒</div>Votre panier est vide</div>
                : <>
                  {cart.map(item => (
                    <div key={item.key} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0EDE8"}}>
                      <div style={{width:44,height:44,background:"#F7F3ED",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#1A1410",marginBottom:1}}>{item.name}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>{item.color}{item.size?` · ${item.size}`:""}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{fx(item.price)}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <button onClick={() => onQty(item.key,-1)} style={{width:22,height:22,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:13,color:"#4B5563",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                        <button onClick={() => onQty(item.key,1)} style={{width:22,height:22,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:13,color:"#4B5563",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#1A1410",minWidth:60,textAlign:"right"}}>{fx(item.price*item.qty)}</div>
                      <button onClick={() => onRemove(item.key)} style={{background:"transparent",border:"none",cursor:"pointer",color:"#D1D5DB",fontSize:14,transition:"color .2s"}}
                        onMouseEnter={e => e.currentTarget.style.color="#EF4444"}
                        onMouseLeave={e => e.currentTarget.style.color="#D1D5DB"}>✕</button>
                    </div>
                  ))}

                  {/* Code promo */}
                  <div style={{marginTop:12,padding:"12px 14px",background:"#FFF8F0",border:"1px solid #FDE8C0",borderRadius:10}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:"#92400E",marginBottom:7}}>🏷️ Code promo</div>
                    {promoApplied
                      ? <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#059669"}}>✓ {promoApplied} — -{discount}% appliqué !</div>
                      : <div style={{display:"flex",gap:6}}>
                          <input value={promo} onChange={e => setPromo(e.target.value)} onKeyDown={e => e.key==="Enter"&&applyPromo()} placeholder="Ex: ENCG2025" style={{flex:1,border:"1px solid #FDE8C0",borderRadius:7,padding:"6px 9px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff"}}/>
                          <button onClick={applyPromo} style={{background:"#92400E",border:"none",borderRadius:7,padding:"6px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>OK</button>
                        </div>
                    }
                  </div>

                  {/* Totaux */}
                  <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563"}}><span>Sous-total</span><span>{fx(total)}</span></div>
                    {promoApplied && <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#059669"}}><span>Remise -{discount}%</span><span>-{fx(discountAmt)}</span></div>}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"2px solid #1A1410",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#1A1410",marginTop:4}}><span>Total estimé</span><span>{fx(total-discountAmt)}</span></div>
                    {total<500 && <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>💡 Encore {fx(500-total)} pour la livraison gratuite</div>}
                  </div>
                </>
              }
            </>
          )}

          {/* ── ÉTAPE 1 : Livraison ── */}
          {step===1 && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["Nom complet","name","text","👤"],["Email","email","email","✉️"],["Téléphone","phone","tel","📱"],["Adresse complète","address","text","🏠"]].map(([label,field,type,ico]) => (
                <div key={field}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>{ico} {label}</div>
                  <input type={type} value={info[field]} onChange={e => setInfo(p => ({...p,[field]:e.target.value}))}
                    style={{width:"100%",border:`1px solid ${info[field]?"#1A1410":"#E5E7EB"}`,borderRadius:8,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",outline:"none",transition:"border-color .2s"}}/>
                </div>
              ))}
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>🏙️ Ville</div>
                <select value={info.city} onChange={e => setInfo(p => ({...p,city:e.target.value}))} style={{width:"100%",border:"1px solid #1A1410",borderRadius:8,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",background:"#fff",outline:"none"}}>
                  {["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Meknès","Kénitra"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>🚚 Mode de livraison — Portée mondiale · Slide 15</div>
                {[["standard","Livraison standard","3–5 jours","Gratuite dès 500 MAD",30],["express","Livraison express","24–48h","Priorité absolue",50]].map(([val,label,time,note,fee]) => (
                  <div key={val} onClick={() => setInfo(p => ({...p,delivery:val}))} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",border:`1px solid ${info.delivery===val?"#1A1410":"#E5E7EB"}`,borderRadius:9,marginBottom:6,cursor:"pointer",background:info.delivery===val?"rgba(26,20,16,0.04)":"transparent",transition:"all .2s"}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${info.delivery===val?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {info.delivery===val && <div style={{width:8,height:8,borderRadius:"50%",background:"#1A1410"}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{label}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>{time} · {note}</div>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:total>=500&&val==="standard"?"#059669":"#1A1410"}}>
                      {total>=500&&val==="standard"?"Gratuite":`+${fee} MAD`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : Paiement ── */}
          {step===2 && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:8}}>💳 Mode de paiement — Standards Universels · Slide 16</div>
                {[
                  ["CMI","💳","Carte bancaire marocaine","TLS 1.3 + 3D Secure"],
                  ["Stripe","🌍","Carte internationale","PCI DSS Level 1"],
                  ["PayPal","🏧","Compte PayPal","Protection acheteur 180j"],
                  ["Cash","💵","Cash à la livraison","Paiement à réception"],
                ].map(([val,ico,label,note]) => (
                  <div key={val} onClick={() => setPayment(val)} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 13px",border:`1px solid ${payment===val?"#1A1410":"#E5E7EB"}`,borderRadius:9,marginBottom:6,cursor:"pointer",background:payment===val?"rgba(26,20,16,0.04)":"transparent",transition:"all .2s"}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ico}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{label}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>{note}</div>
                    </div>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${payment===val?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {payment===val && <div style={{width:8,height:8,borderRadius:"50%",background:"#1A1410"}}/>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Récap */}
              <div style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:11,color:"#374151",marginBottom:8}}>Récapitulatif commande</div>
                {cart.map(i => (
                  <div key={i.key} style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563",marginBottom:4}}>
                    <span>{i.emoji} {i.name} ×{i.qty}</span>
                    <span style={{fontWeight:600}}>{fx(i.price*i.qty)}</span>
                  </div>
                ))}
                <div style={{borderTop:"1px solid #E5E7EB",marginTop:8,paddingTop:8,display:"flex",flexDirection:"column",gap:4}}>
                  {promoApplied && <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#059669"}}><span>Remise {discount}%</span><span>-{fx(discountAmt)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563"}}><span>Livraison</span><span>{deliveryFee===0?"Gratuite":`+${deliveryFee} MAD`}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#1A1410",paddingTop:4,borderTop:"1px solid #E5E7EB"}}><span>Total</span><span>{fx(finalTotal)}</span></div>
                </div>
              </div>

              <div style={{background:"#FFF8F0",border:"1px solid #FDE8C0",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.1em",marginBottom:3}}>⚡ SIMULATION · X-RAY</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#92400E",lineHeight:1.6}}>En production : TLS 1.3 → API Checkout → Stripe tokenise la carte → Webhook → DB mise à jour → Email Resend. Voir ◈ X-Ray.</div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : Confirmation + Suivi ── */}
          {step===3 && confirmed && (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:60,marginBottom:10,animation:"checkPop .6s ease"}}>✅</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1A1410",marginBottom:4}}>
                Merci {confirmed.customer.name.split(" ")[0]} !
              </h3>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.gold,marginBottom:6}}>{confirmed.id}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280",marginBottom:18}}>Confirmation envoyée à {confirmed.customer.email}</div>

              {/* Points fidélité */}
              <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFFBF5)",border:"1px solid #FDE8C0",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>⭐</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#92400E"}}>+{Math.round(confirmed.total/10)} points fidélité gagnés !</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#B45309"}}>Programme de fidélité NouaSell</div>
                </div>
              </div>

              {/* Tracking timeline */}
              <div style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:12,padding:"14px 16px",marginBottom:14,textAlign:"left"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:"#1A1410",marginBottom:12}}>📦 Suivi de commande en temps réel</div>
                {["Commande confirmée","En préparation","Expédiée","Livrée"].map((label, idx) => {
                  const done   = idx <= trackStep;
                  const active = idx === trackStep && idx>0;
                  return (
                    <div key={label} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:idx<3?12:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:done?"#1A1410":"#E5E7EB",border:`2px solid ${done?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done?"#FAFAF7":"#9CA3AF",transition:"all .5s",boxShadow:active?"0 0 0 3px rgba(26,20,16,0.15)":"none"}}>{done?"✓":idx+1}</div>
                        {idx<3 && <div style={{width:2,height:16,background:done&&idx<trackStep?"#1A1410":"#E5E7EB",transition:"all .5s",marginTop:2}}/>}
                      </div>
                      <div style={{paddingTop:1}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:done?600:400,color:done?"#1A1410":"#9CA3AF",transition:"all .5s"}}>{label}</div>
                        {active && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.amber}}>⟳ En cours...</div>}
                        {done && idx===0 && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#9B8A6E"}}>✓ Effectué</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Récap articles */}
              <div style={{textAlign:"left"}}>
                {confirmed.items.map(i => (
                  <div key={i.key} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F0EDE8",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563"}}>
                    <span>{i.emoji} {i.name} ×{i.qty}</span>
                    <span style={{fontWeight:600,color:"#1A1410"}}>{fx(i.price*i.qty)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#1A1410"}}>
                  <span>Total payé</span><span>{fx(confirmed.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay paiement en cours */}
          {paying && (
            <div style={{position:"absolute",inset:0,background:"rgba(250,250,247,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,zIndex:10}}>
              <div style={{width:60,height:60,border:`3px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:"#1A1410",fontWeight:600}}>Traitement du paiement...</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>🔒 Connexion TLS 1.3 sécurisée</div>
            </div>
          )}
        </div>

        {/* Actions bas */}
        <div style={{padding:"12px 18px",borderTop:"1px solid #E5E7EB",background:C.cream,flexShrink:0}}>
          {step===0 && cart.length>0 && (
            <button onClick={() => setStep(1)} style={{width:"100%",background:C.dark,border:"none",borderRadius:10,padding:"12px",color:"#FAFAF7",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}
              onMouseEnter={e => e.currentTarget.style.background="#2C1F0E"}
              onMouseLeave={e => e.currentTarget.style.background=C.dark}>Continuer — {fx(total)} →</button>
          )}
          {step===1 && (
            <div style={{display:"flex",gap:7}}>
              <button onClick={() => setStep(0)} style={{flex:1,background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← Retour</button>
              <button onClick={() => setStep(2)} disabled={!info.name||!info.email||!info.address} style={{flex:2,background:info.name&&info.email&&info.address?C.dark:"#E5E7EB",border:"none",borderRadius:10,padding:"11px",color:info.name&&info.email&&info.address?"#FAFAF7":"#9CA3AF",fontSize:12,fontWeight:700,cursor:info.name&&info.email&&info.address?"pointer":"not-allowed",fontFamily:"'Outfit',sans-serif",transition:"all .3s"}}>
                Choisir le paiement →
              </button>
            </div>
          )}
          {step===2 && (
            <div style={{display:"flex",gap:7}}>
              <button onClick={() => setStep(1)} style={{flex:1,background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← Retour</button>
              <button onClick={handlePay} style={{flex:2,background:C.dark,border:"none",borderRadius:10,padding:"11px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                🔒 Payer {fx(finalTotal)}
              </button>
            </div>
          )}
          {step===3 && (
            <button onClick={onClose} style={{width:"100%",background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Continuer mes achats</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ⚙️ ADMIN VIEW
───────────────────────────────────────── */
function AdminView({ orders, setOrders, products, loyaltyPts }) {
  const [tab, setTab] = useState("overview");
  const totalRev = orders.reduce((s,o) => s+o.total, 0);
  const SC = {"En attente":C.amber,"En traitement":C.cyan,"Expédiée":C.violet,"Livrée":C.green,"Annulé":C.red};
  const FLOW = ["En attente","En traitement","Expédiée","Livrée"];

  const advance = (id) => setOrders(p => p.map(o => {
    if (o.id!==id) return o;
    const i = FLOW.indexOf(o.status);
    return {...o, status:i<FLOW.length-1 ? FLOW[i+1] : o.status};
  }));

  const ANALYTICS = [
    {d:"Lun",r:8400,o:12},{d:"Mar",r:14200,o:18},{d:"Mer",r:6300,o:9},
    {d:"Jeu",r:19800,o:24},{d:"Ven",r:26500,o:31},{d:"Sam",r:23100,o:28},{d:"Dim",r:12400,o:15},
  ];
  const mxR = Math.max(...ANALYTICS.map(a => a.r));

  const TABS = [
    ["overview","📊","Tableau de bord"],
    ["orders","📋","Commandes"],
    ["products","📦","Produits"],
    ["analytics","📈","Analytics"],
    ["reviews","⭐","Avis clients"],
  ];

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:175,background:C.s1,borderRight:`1px solid ${C.b}`,padding:"14px 0",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0 14px",marginBottom:12}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.15em"}}>BACK-OFFICE</div>
        </div>
        {TABS.map(([id,ico,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            width:"100%",background:tab===id?C.s2:"transparent",border:"none",
            borderLeft:`2px solid ${tab===id?C.cyan:"transparent"}`,
            padding:"9px 14px",color:tab===id?C.text:C.sub,
            cursor:"pointer",textAlign:"left",fontSize:11,
            fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?600:400,
            display:"flex",alignItems:"center",gap:8,transition:"all .2s"
          }}>{ico} {label}</button>
        ))}
        {loyaltyPts>0 && (
          <div style={{margin:"auto 0 14px",padding:"0 14px"}}>
            <div style={{background:`${C.gold}15`,border:`1px solid ${C.gold}33`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:18,marginBottom:3}}>⭐</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.gold,fontWeight:700}}>{loyaltyPts} pts</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim}}>Fidélité clients</div>
            </div>
          </div>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>

        {/* ── VUE D'ENSEMBLE ── */}
        {tab==="overview" && (
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Tableau de bord</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 108 · KPIs en temps réel</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[
                {l:"Commandes",v:orders.length,i:"📋",c:C.cyan},
                {l:"Revenus",v:`${totalRev.toLocaleString()} MAD`,i:"💰",c:C.green},
                {l:"Produits",v:products.length,i:"📦",c:C.amber},
                {l:"Livrées",v:orders.filter(o=>o.status==="Livrée").length,i:"✅",c:C.violet},
              ].map(k => (
                <div key={k.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"14px 15px",transition:"all .3s"}}
                  onMouseEnter={e => {e.currentTarget.style.border=`1px solid ${k.c}44`;e.currentTarget.style.boxShadow=`0 4px 16px ${k.c}22`;}}
                  onMouseLeave={e => {e.currentTarget.style.border=`1px solid ${C.b}`;e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{k.l}</div>
                    <span style={{fontSize:16}}>{k.i}</span>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:k.c}}>{k.v}</div>
                </div>
              ))}
            </div>
            {orders.length===0
              ? <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>🛒</div>Passez une commande depuis la Boutique !</div>
              : <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.b}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text}}>Commandes récentes</div>
                  {orders.slice(0,5).map(o => (
                    <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:`1px solid ${C.b}44`,transition:"background .2s"}}
                      onMouseEnter={e => e.currentTarget.style.background=C.s2}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.cyan,minWidth:85}}>{o.id}</div>
                      <div style={{flex:1,fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{o.customer?.name||"—"}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                      <div style={{background:`${SC[o.status]||C.sub}20`,border:`1px solid ${SC[o.status]||C.sub}44`,borderRadius:4,padding:"1px 7px",fontSize:9,color:SC[o.status]||C.sub,fontFamily:"'JetBrains Mono',monospace"}}>{o.status}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── COMMANDES ── */}
        {tab==="orders" && (
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Gestion des Commandes</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 86 · Chaîne O2C — Order to Cash</div>
            {orders.length===0
              ? <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>🛒</div>Passez une commande depuis la Boutique !</div>
              : orders.map(o => (
                <div key={o.id} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:14,marginBottom:10,transition:"all .2s"}}
                  onMouseEnter={e => e.currentTarget.style.border=`1px solid ${C.b2}`}
                  onMouseLeave={e => e.currentTarget.style.border=`1px solid ${C.b}`}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.cyan,marginBottom:2}}>{o.id}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text,fontWeight:600}}>{o.customer?.name} · {o.customer?.city}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{o.date} · {o.customer?.payment}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                      {o.discount>0 && <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.green}}>Code promo -{o.discount}%</div>}
                      <div style={{background:`${SC[o.status]}20`,border:`1px solid ${SC[o.status]}44`,borderRadius:5,padding:"2px 8px",fontSize:9,color:SC[o.status],fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:10}}>
                    {FLOW.map((s,i) => { const cur=FLOW.indexOf(o.status); return <div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=cur?SC[s]:C.b,transition:"all .5s"}}/>;})}
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                    {o.status!=="Livrée" && (
                      <button onClick={() => advance(o.id)} style={{background:`${C.green}15`,border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 11px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}
                        onMouseEnter={e => e.currentTarget.style.background=`${C.green}25`}
                        onMouseLeave={e => e.currentTarget.style.background=`${C.green}15`}>
                        ▶ → {FLOW[Math.min(FLOW.indexOf(o.status)+1,3)]}
                      </button>
                    )}
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,display:"flex",alignItems:"center",gap:4}}>
                      📦 {o.items.length} article(s) · {o.items.map(i=>i.emoji).join(" ")}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── PRODUITS ── */}
        {tab==="products" && (
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Catalogue Produits</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 69 · Table products en DB</div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
                <thead>
                  <tr style={{background:C.bg}}>
                    {["Produit","Cat.","Prix MAD","Stock","Note","Statut"].map(h => (
                      <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,color:C.dim,letterSpacing:"0.1em",fontWeight:700,borderBottom:`1px solid ${C.b}`}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{borderBottom:`1px solid ${C.b}44`,transition:"background .2s"}}
                      onMouseEnter={e => e.currentTarget.style.background=C.s2}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{p.emoji}</span><span style={{fontWeight:600,color:C.text}}>{p.name}</span></div></td>
                      <td style={{padding:"9px 12px",color:C.sub,fontSize:10}}>{p.cat}</td>
                      <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:C.amber,fontWeight:600,fontSize:11}}>{p.price.toLocaleString()}</td>
                      <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:p.stock<5?C.red:p.stock<20?C.amber:C.green,fontSize:11,fontWeight:700}}>{p.stock}</span></td>
                      <td style={{padding:"9px 12px"}}><span style={{color:C.gold,fontSize:11}}>{"★".repeat(Math.floor(p.rating))}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub,marginLeft:3}}>{p.rating}</span></td>
                      <td style={{padding:"9px 12px"}}><span style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"1px 7px",fontSize:9,color:C.green}}>actif</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS — Densité d'information Slide 20 ── */}
        {tab==="analytics" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Analytics</h2>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.cyan,background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:4,padding:"2px 7px"}}>📊 Densité d'info · Slide 20</span>
            </div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Accès en temps réel aux KPIs pour toute décision stratégique</div>

            {/* Graphique revenus */}
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:14,padding:18,marginBottom:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:14}}>REVENUS HEBDOMADAIRES (MAD)</div>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
                {ANALYTICS.map((a,i) => (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.green}}>{(a.r/1000).toFixed(1)}k</div>
                    <div style={{width:"100%",background:C.green,borderRadius:"3px 3px 0 0",height:`${(a.r/mxR)*90}px`,minHeight:4,transition:"height .8s ease",boxShadow:`0 0 8px ${C.green}33`}}/>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{a.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métriques */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
              {[
                {l:"Taux de conversion",v:"3.4%",t:"↑ +0.8%",c:C.green,d:"Visiteurs → Acheteurs"},
                {l:"Panier moyen",v:"847 MAD",t:"↑ +12%",c:C.amber,d:"Par commande"},
                {l:"Taux de rebond",v:"38%",t:"↓ -5%",c:C.cyan,d:"Pages / session"},
              ].map(m => (
                <div key={m.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"13px 15px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:5}}>{m.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:m.c,marginBottom:2}}>{m.v}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green,marginBottom:3}}>{m.t}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim}}>{m.d}</div>
                </div>
              ))}
            </div>

            {/* Top produits */}
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.b}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text}}>Top 5 Produits</div>
              {[...products].sort((a,b) => b.rCount-a.rCount).slice(0,5).map((p,i) => (
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:`1px solid ${C.b}44`}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.dim,minWidth:18}}>#{i+1}</div>
                  <span style={{fontSize:18}}>{p.emoji}</span>
                  <div style={{flex:1,fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{p.name}</div>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <div style={{height:5,borderRadius:3,background:C.amber,width:`${(p.rCount/445)*80}px`,minWidth:8}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.amber}}>{p.rCount} avis</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AVIS — Technologie Sociale Slide 21 ── */}
        {tab==="reviews" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Modération des Avis</h2>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#4ADE80",background:"#4ADE8015",border:"1px solid #4ADE8033",borderRadius:4,padding:"2px 7px"}}>👥 Tech. Sociale · Slide 21</span>
            </div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Gestion des avis vérifiés, modération, réponses aux clients</div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
              {[
                {l:"Avis total",v:products.reduce((s,p)=>s+p.reviews.length,0),c:C.cyan},
                {l:"Avis vérifiés",v:products.reduce((s,p)=>s+p.reviews.filter(r=>r.v).length,0),c:C.green},
                {l:"Note moyenne",v:(products.reduce((s,p)=>s+p.rating,0)/products.length).toFixed(1)+"★",c:C.amber},
              ].map(m => (
                <div key={m.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"14px 16px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:6}}>{m.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:m.c}}>{m.v}</div>
                </div>
              ))}
            </div>

            {products.flatMap(p => p.reviews.map(r => ({...r,product:p.name,emoji:p.emoji}))).map((r,i) => (
              <div key={i} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`${C.gold}22`,border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.gold,flexShrink:0}}>{r.n[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{r.n}</span>
                      <span style={{color:C.amber,fontSize:11}}>{"★".repeat(r.s)}</span>
                      {r.v && <span style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"1px 5px",fontSize:8,color:C.green,fontWeight:600}}>✓ Vérifié</span>}
                      <span style={{marginLeft:"auto",fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{r.emoji} {r.product}</span>
                    </div>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6,marginBottom:8}}>{r.t}</p>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:5,padding:"3px 10px",fontSize:9,color:C.green,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>✓ Approuver</button>
                      <button style={{background:`${C.red}15`,border:`1px solid ${C.red}33`,borderRadius:5,padding:"3px 10px",fontSize:9,color:C.red,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>✕ Masquer</button>
                      <button style={{background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:5,padding:"3px 10px",fontSize:9,color:C.cyan,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>↩ Répondre</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ◈ XRAY VIEW
───────────────────────────────────────── */
function XRayView() {
  const [view, setView] = useState("carac");
  const [selected, setSelected] = useState(null);
  const [payStep, setPayStep] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (autoPlay && view==="payment") {
      if (payStep < PAYMENT_STEPS.length-1) {
        timerRef.current = setTimeout(() => setPayStep(s => s+1), 1200);
      } else {
        setAutoPlay(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [autoPlay, payStep, view]);

  const XVIEWS = [
    {id:"carac",       icon:"✦", label:"8 Caractéristiques"},
    {id:"architecture",icon:"◈", label:"Architecture"},
    {id:"payment",     icon:"◎", label:"Flux Paiement"},
    {id:"database",    icon:"⊞", label:"Base de Données"},
    {id:"security",    icon:"🛡",label:"Sécurité"},
    {id:"deploy",      icon:"⟶",label:"Déploiement"},
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:C.s2,borderBottom:`1px solid ${C.b}`,padding:"0 18px",display:"flex",gap:2,height:38,alignItems:"center",flexShrink:0,overflowX:"auto"}}>
        {XVIEWS.map(v => (
          <button key={v.id} onClick={() => {setView(v.id);setSelected(null);}} style={{
            background:view===v.id?C.s3:"transparent",
            border:`1px solid ${view===v.id?C.b:"transparent"}`,
            borderRadius:6,padding:"3px 11px",
            color:view===v.id?C.text:C.sub,
            fontSize:10,cursor:"pointer",fontWeight:600,
            letterSpacing:"0.05em",transition:"all .2s",
            fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap"
          }}>{v.icon} {v.label}</button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {view==="carac"        && <CaracView/>}
        {view==="architecture" && <ArchView selected={selected} setSelected={setSelected}/>}
        {view==="payment"      && <PayView payStep={payStep} onStart={() => {setPayStep(0);setAutoPlay(true);}} onReset={() => {setPayStep(-1);setAutoPlay(false);}}/>}
        {view==="database"     && <DBView/>}
        {view==="security"     && <SecView/>}
        {view==="deploy"       && <DeployView/>}
      </div>
    </div>
  );
}

/* ── Vue 8 Caractéristiques ── */
function CaracView() {
  const [active, setActive] = useState(null);
  const sel = active!==null ? CARAC[active] : null;

  return (
    <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 380px",overflow:"hidden"}}>
      <div style={{overflowY:"auto",padding:"22px 18px"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>8 Caractéristiques des plateformes e-commerce</h2>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Laudon & Traver · Slides 14–21 · Cliquez sur chaque caractéristique</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {CARAC.map((c,i) => (
            <div key={c.id} onClick={() => setActive(active===i?null:i)} style={{
              background:active===i?`${c.color}18`:C.s2,
              border:`1px solid ${active===i?c.color:C.b}`,
              borderRadius:12,padding:"14px 12px",
              cursor:"pointer",transition:"all .25s",textAlign:"center",
              boxShadow:active===i?`0 0 16px ${c.color}33`:"none"
            }}>
              <div style={{fontSize:26,marginBottom:6}}>{c.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:active===i?c.color:C.text,marginBottom:3}}>{c.label}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim}}>{c.slide}</div>
              {active===i && <div style={{width:20,height:2,background:c.color,borderRadius:1,margin:"6px auto 0"}}/>}
            </div>
          ))}
        </div>

        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:"14px 18px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text,marginBottom:5}}>📚 Laudon & Traver — E-Commerce 2023</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.7}}>Ces 8 caractéristiques définissent ce qui distingue fondamentalement le commerce électronique du commerce traditionnel. Elles constituent le cadre théorique central du cours d'E-commerce & E-business.</div>
        </div>
      </div>

      {/* Panneau détail */}
      <div style={{background:C.s1,borderLeft:`1px solid ${C.b}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {sel ? (
          <div style={{flex:1,overflowY:"auto",padding:20}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:16}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`${sel.color}20`,border:`2px solid ${sel.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{sel.icon}</div>
              <div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:sel.color,marginBottom:2}}>{sel.label}</h3>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim}}>{sel.slide}</div>
              </div>
            </div>
            <div style={{background:`${sel.color}0D`,border:`1px solid ${sel.color}30`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:sel.color,letterSpacing:"0.12em",marginBottom:5}}>DÉFINITION THÉORIQUE</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text,lineHeight:1.7}}>{sel.def}</div>
            </div>
            <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,letterSpacing:"0.12em",marginBottom:5}}>🛍 DANS NOUASELL</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub,lineHeight:1.7}}>{sel.nouasell}</div>
            </div>
            <div style={{background:"#020609",border:`1px solid ${C.b}`,borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim,letterSpacing:"0.1em",marginBottom:7}}>IMPLÉMENTATION TECHNIQUE</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#C8E6FF",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{sel.code}</pre>
            </div>
            <div style={{background:`${C.cyan}10`,border:`1px solid ${C.cyan}30`,borderRadius:8,padding:10}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.cyan,letterSpacing:"0.1em",marginBottom:3}}>OÙ LE VOIR DANS L'APP</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{sel.where}</div>
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12,opacity:.3}}>✦</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.sub,marginBottom:8}}>8 Caractéristiques</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.dim,lineHeight:1.7}}>Cliquez sur une caractéristique pour voir sa définition, son incarnation dans NouaSell et son code</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Architecture View ── */
function ArchView({ selected, setSelected }) {
  const sel = selected ? LAYERS.flatMap(l => l.nodes).find(n => n.id===selected) : null;
  const np = {
    browser:{x:170,y:90},mobile:{x:370,y:90},cdn:{x:570,y:90},
    products_api:{x:130,y:230},auth_api:{x:310,y:230},checkout_api:{x:490,y:230},webhook:{x:650,y:230},
    db:{x:150,y:370},storage:{x:350,y:370},cache:{x:540,y:370},
    cicd:{x:140,y:490},monitoring:{x:330,y:490},security:{x:520,y:490},
  };
  return (
    <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 320px",overflow:"hidden"}}>
      <div style={{overflowY:"auto",padding:"18px 14px",position:"relative"}}>
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Architecture en couches</h2>
          <span style={{fontSize:10,color:C.sub}}>Cliquez pour voir le code</span>
        </div>
        <svg style={{position:"absolute",top:65,left:0,width:"100%",height:600,pointerEvents:"none",zIndex:0}} className="flowing">
          {CONNECTIONS.map((c,i) => {
            const f=np[c.from], t=np[c.to]; if(!f||!t) return null;
            const my = (f.y+t.y)/2;
            return <g key={i}><path d={`M${f.x},${f.y} C${f.x},${my} ${t.x},${my} ${t.x},${t.y}`} stroke={c.color} strokeWidth={1.5} fill="none" opacity={0.35} strokeDasharray="6 3"/><circle cx={t.x} cy={t.y} r={3} fill={c.color} opacity={0.6}/></g>;
          })}
        </svg>
        {LAYERS.map((layer,li) => (
          <div key={layer.id} style={{marginBottom:18,animation:`fadeUp .4s ease ${li*.1}s both`,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,${layer.color}44,transparent)`}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:600,color:layer.color,letterSpacing:"0.18em"}}>{layer.label}</span>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,transparent,${layer.color}44)`}}/>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {layer.nodes.map(node => (
                <div key={node.id} onClick={() => setSelected(selected===node.id?null:node.id)} style={{
                  background:selected===node.id?`${layer.color}18`:C.s2,
                  border:`1px solid ${selected===node.id?layer.color:C.b}`,
                  borderRadius:10,padding:"10px 14px",cursor:"pointer",
                  transition:"all .2s",minWidth:140,flex:1,maxWidth:190,
                  position:"relative",overflow:"hidden"
                }}>
                  {selected===node.id && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:layer.color}}/>}
                  <div style={{fontSize:20,marginBottom:5}}>{node.icon}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:12,color:C.text,marginBottom:2}}>{node.label}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:layer.color,marginBottom:3}}>{node.sub}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.dim,background:C.s1,borderRadius:3,padding:"1px 5px",display:"inline-block"}}>{node.course}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:C.s1,borderLeft:`1px solid ${C.b}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {sel ? (
          <div style={{flex:1,overflowY:"auto",padding:18}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:14}}>
              <span style={{fontSize:26}}>{sel.icon}</span>
              <div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text,marginBottom:1}}>{sel.label}</h3>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.cyan}}>{sel.sub}</div>
              </div>
            </div>
            <div style={{background:"#020609",border:`1px solid ${C.b}`,borderRadius:9,padding:12,marginBottom:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:7}}>CODE RÉEL</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#C8E6FF",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{sel.code}</pre>
            </div>
            <div style={{background:`${C.cyan}10`,border:`1px solid ${C.cyan}30`,borderRadius:7,padding:10}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.cyan,letterSpacing:"0.1em",marginBottom:3}}>RÉFÉRENCE COURS</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{sel.course}</div>
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10,opacity:.3}}>◈</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub,lineHeight:1.7}}>Cliquez sur un composant pour explorer son code et sa référence cours</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Payment Flow View ── */
function PayView({ payStep, onStart, onReset }) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Flux de paiement</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 80–86 · Ce qui se passe en 3 secondes quand un client clique "Acheter"</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            {payStep===-1
              ? <Btn onClick={onStart} color={C.green}>▶ Lancer</Btn>
              : <Btn onClick={onReset} color={C.sub} outline>↺ Reset</Btn>
            }
          </div>
        </div>
        <div style={{display:"flex",gap:0,alignItems:"flex-start",marginBottom:32,overflowX:"auto",paddingBottom:6}}>
          {PAYMENT_STEPS.map((step,i) => {
            const active=i===payStep, done=i<payStep, waiting=i>payStep;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{textAlign:"center",width:100,opacity:waiting?0.3:1,transition:"all .5s"}}>
                  <div style={{position:"relative",width:50,height:50,margin:"0 auto 7px",borderRadius:"50%",
                    background:active?`${step.color}30`:done?`${step.color}20`:C.s2,
                    border:`2px solid ${active||done?step.color:C.b}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                    transition:"all .5s",boxShadow:active?`0 0 18px ${step.color}55`:"none"
                  }}>
                    {done ? <span style={{fontSize:16,color:step.color}}>✓</span> : step.icon}
                    {active && <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:`1px solid ${step.color}`,animation:"ping 1s ease infinite"}}/>}
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:10,color:active?step.color:done?C.text:C.dim,whiteSpace:"pre-line",lineHeight:1.4,marginBottom:3}}>{step.label}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub}}>{step.sub}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:step.color,marginTop:3,background:`${step.color}12`,borderRadius:3,padding:"1px 5px",display:"inline-block"}}>{step.slide}</div>
                </div>
                {i<PAYMENT_STEPS.length-1 && <div style={{width:20,height:2,background:i<payStep?PAYMENT_STEPS[i].color:C.b,transition:"all .6s",flexShrink:0,position:"relative",top:-16}}/>}
              </div>
            );
          })}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {title:"Pourquoi TLS/SSL ?",body:"Chaque octet échangé est chiffré. Sans SSL, les données bancaires transitent en clair — interceptables. (Slide 77)",color:C.cyan},
            {title:"Qu'est-ce qu'un Webhook ?",body:"Stripe appelle automatiquement notre API quand le paiement réussit. Sans webhook, on ne saurait jamais si le client a payé. (Slide 86)",color:C.green},
            {title:"Tokenisation bancaire",body:"Le numéro de carte n'est jamais stocké sur nos serveurs. Stripe génère un token unique. PCI DSS Level 1. (Slide 77)",color:C.amber},
            {title:"Idempotence",body:"Si le webhook est reçu deux fois, la commande ne doit pas être créée deux fois. On vérifie l'ID Stripe avant insertion. (Slide 86)",color:C.violet},
          ].map(card => (
            <div key={card.title} style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:14}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:card.color,marginBottom:5}}>{card.title}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.7}}>{card.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Database View ── */
function DBView() {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Schéma de la Base de Données</h2>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 69 · Big Data — Les tables qui stockent TOUTE la logique métier</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
          {DB_TABLES.map(table => (
            <div key={table.name} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,overflow:"hidden",minWidth:155,flex:1,maxWidth:195}}>
              <div style={{background:`${table.color}18`,padding:"7px 12px",borderBottom:`1px solid ${table.color}33`,display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim}}>TABLE</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:11,color:table.color}}>{table.name}</span>
              </div>
              {table.fields.map(([field,type]) => (
                <div key={field} style={{padding:"4px 12px",borderBottom:`1px solid ${C.b}44`,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:field==="id"?table.color:C.text}}>{field}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub}}>{type}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {icon:"📊",label:"Volume",value:"Millions de lignes",desc:"Chaque visite, clic, commande = 1 ligne"},
            {icon:"⚡",label:"Vélocité",value:"Temps réel",desc:"Stock mis à jour à chaque achat"},
            {icon:"🔀",label:"Variété",value:"SQL + JSON + Fichiers",desc:"Texte, images, événements, logs"},
          ].map(v => (
            <div key={v.label} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:22,marginBottom:5}}>{v.icon}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.12em",marginBottom:2}}>{v.label.toUpperCase()}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text,marginBottom:3}}>{v.value}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Security View ── */
function SecView() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Modèle de Sécurité en Oignon</h2>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 74–78 · 5 couches de protection superposées</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {SEC_LAYERS.map((layer,i) => (
            <div key={layer.level} onClick={() => setExpanded(expanded===i?null:i)} style={{
              background:expanded===i?`${layer.color}10`:C.s2,
              border:`1px solid ${expanded===i?layer.color:C.b}`,
              borderRadius:10,padding:"12px 16px",cursor:"pointer",
              transition:"all .25s",
              marginLeft:`${i*18}px`,marginRight:`${i*18}px`
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:`${layer.color}22`,border:`2px solid ${layer.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:layer.color,flexShrink:0}}>{layer.level}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:layer.color}}>{layer.label}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{layer.desc}</div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim,background:C.s1,borderRadius:3,padding:"2px 7px"}}>{layer.course}</div>
                <span style={{color:C.dim,fontSize:11}}>{expanded===i?"▲":"▼"}</span>
              </div>
              {expanded===i && (
                <div className="fu" style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${layer.color}22`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub}}>TECHNOLOGIE : </span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:layer.color}}>{layer.tech}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Deploy View ── */
function DeployView() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const PIPELINE = [
    {icon:"👨‍💻",label:"git push origin main",sub:"Le développeur pousse le code",color:C.cyan,log:["[git] Compressing objects: 100%","[git] Writing objects: 100% (12/12)","[git] ✓ To github.com:store/repo.git"]},
    {icon:"⚙️",label:"GitHub Actions déclenché",sub:"Tests automatiques lancés",color:C.amber,log:["[CI] npm install — 127 packages","[CI] npm test — 47 tests","[CI] ✓ All tests passed in 8.2s","[CI] ✓ Build: 2.1MB"]},
    {icon:"🔍",label:"Vérifications qualité",sub:"Lint · Types · Sécurité",color:C.violet,log:["[lint] ESLint: 0 errors","[types] TypeScript: no errors","[audit] 0 vulnerabilities","[lighthouse] Performance: 94/100"]},
    {icon:"🌍",label:"Déploiement Vercel",sub:"Edge Network mondial",color:C.green,log:["[vercel] Building...","[vercel] ✓ Casablanca — ready","[vercel] ✓ Paris — ready","[vercel] 🎉 https://store.vercel.app"]},
    {icon:"🗄️",label:"Migration DB Supabase",sub:"Nouvelles colonnes / tables",color:C.amber,log:["[db] Running migration 002","[db] ALTER TABLE products...","[db] ✓ Migration complete"]},
    {icon:"✅",label:"Boutique en production",sub:"0 downtime · 0 coût",color:C.green,log:["[health] GET / → 200 OK (43ms)","[health] /api/products → 200 (12ms)","[monitor] Uptime: 99.97%","🚀 Deployment complete!"]},
  ];
  const run = () => {
    setStep(0); setRunning(true);
    PIPELINE.forEach((_,i) => setTimeout(() => {
      setStep(i);
      if (i===PIPELINE.length-1) setRunning(false);
    }, i*1400));
  };
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Pipeline CI/CD</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 92 · Chaque commit déclenche un déploiement automatique</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            {!running && <Btn onClick={run} color={C.green}>▶ Simuler</Btn>}
            {(step>=0||running) && <Btn onClick={() => {setStep(-1);setRunning(false);}} color={C.sub} outline>↺ Reset</Btn>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {PIPELINE.map((p,i) => {
            const done=i<step, active=i===step, future=i>step;
            return (
              <div key={i} style={{
                background:active?`${p.color}15`:done?C.s2:C.s1,
                border:`1px solid ${active?p.color:done?C.b2:C.b}`,
                borderRadius:10,padding:12,transition:"all .4s",
                opacity:future&&step>=0?0.4:1
              }}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:30,height:30,borderRadius:"50%",
                    background:done||active?`${p.color}20`:C.s3,
                    border:`2px solid ${done||active?p.color:C.b}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:14,flexShrink:0,transition:"all .4s",
                    boxShadow:active?`0 0 14px ${p.color}55`:"none"
                  }}>{done?"✓":p.icon}</div>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:active?p.color:done?C.green:C.dim}}>{p.label}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{p.sub}</div>
                  </div>
                </div>
                {(active||done) && (
                  <div className="fu" style={{background:"#010508",borderRadius:6,padding:"7px 9px",maxHeight:80,overflow:"hidden"}}>
                    {p.log.map((l,j) => (
                      <div key={j} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                        color:l.includes("✓")||l.includes("🎉")||l.includes("🚀")?C.green:C.sub,lineHeight:1.6}}>{l}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARED BUTTON COMPONENT
───────────────────────────────────────── */
function Btn({ children, onClick, color=C.cyan, outline=false }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? "transparent" : `${color}22`,
      border: `1px solid ${outline?C.b:color}`,
      borderRadius:7, padding:"6px 14px",
      color: outline ? C.sub : color,
      fontSize:11, fontWeight:700, cursor:"pointer",
      fontFamily:"'Outfit',sans-serif",
      letterSpacing:"0.05em", transition:"all .2s"
    }}>{children}</button>
  );
}
