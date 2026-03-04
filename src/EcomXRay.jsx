import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   NouaSell v3 · Dr. H. Faouzi · ENCG Kénitra 2025/2026
   Couverture complète cours : Slides 14–125
   8 Caractéristiques + Modèles revenus + Concurrence + RGPD + Logistique
═══════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{background:#04080F;color:#D4E8F8;font-family:'Outfit',sans-serif;overflow:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#1A3050;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes cartBounce{0%,100%{transform:scale(1)}35%{transform:scale(1.3)}70%{transform:scale(.9)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes checkPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(110%);opacity:0}}
@keyframes heartPop{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rotateIn{from{transform:rotate(-180deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
@keyframes flow{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
@keyframes pulseGlow{0%,100%{opacity:.6}50%{opacity:1}}
.fu{animation:fadeUp .35s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.skel{background:linear-gradient(90deg,#0C1520 25%,#101C2A 50%,#0C1520 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;}
.flowing path{stroke-dasharray:8 4;animation:flow 1.2s linear infinite}
`;

const C = {
  bg:"#04080F",s1:"#080F1A",s2:"#0C1520",s3:"#101C2A",
  b:"#112233",b2:"#1A3050",
  cyan:"#00D4FF",green:"#00FF88",amber:"#FFB300",
  red:"#FF4466",violet:"#9B7FFF",pink:"#F472B6",
  text:"#D4E8F8",sub:"#5A8AAA",dim:"#2A4A66",
  gold:"#C9A96E",dark:"#1A1410",cream:"#FAFAF7",shopBg:"#F7F5F0",
};

const RATES={MAD:1,EUR:0.092,USD:0.099,GBP:0.079};
const SYM={MAD:"MAD",EUR:"€",USD:"$",GBP:"£"};
const PROMOS={"ENCG2025":10,"MAROC10":10,"ARTISAN15":15};
const CATS=["Tous","Mode","Maison","Beauté","Épicerie"];

/* ── 8 CARACTÉRISTIQUES ── */
const CARAC=[
  {id:"ubiquite",icon:"🌐",label:"Ubiquité",color:"#38BDF8",slide:"Slide 14",
   def:"Accessible partout, à tout moment — rupture avec le commerce physique lié aux horaires et lieux.",
   nouasell:"Badge devices dans le hero. PWA installable. 0 installation. 24h/24 7j/7.",
   code:"// Service Worker PWA\nself.addEventListener('fetch', e => {\n  e.respondWith(\n    caches.match(e.request)\n      .then(r => r || fetch(e.request))\n  )\n})",
   where:"🛍 Hero → Badge devices"},
  {id:"portee",icon:"🌍",label:"Portée mondiale",color:"#34D399",slide:"Slide 15",
   def:"Dépasse les frontières. Artisan de Fès vend à Paris, Montréal, Dubai sans intermédiaire physique.",
   nouasell:"Livraison 47 pays. Devise auto IP. Interface multilingue.",
   code:"const {country} = await fetch('https://ipapi.co/json').then(r=>r.json())\nconst rate = RATES[country] ?? 1\nreturn (price * rate).toFixed(2)",
   where:"🛍 Header → Sélecteur devises"},
  {id:"standards",icon:"🔌",label:"Standards Universels",color:"#A78BFA",slide:"Slide 16",
   def:"Protocoles ouverts (HTTP, TCP/IP, HTML5, JSON) partagés. Barrière d'entrée réduite vs EDI propriétaire.",
   nouasell:"REST API JSON, HTTPS TLS 1.3, OAuth 2.0, OpenAPI 3.0.",
   code:"GET  /api/products  → 200 JSON\nPOST /api/orders    → 201 JSON\nContent-Type: application/json\nAuthorization: Bearer <JWT>",
   where:"🛍 Hero → Bandeau protocoles"},
  {id:"richesse",icon:"🎬",label:"Richesse",color:"#F472B6",slide:"Slide 17",
   def:"Messages riches : vidéo HD, 360°, PDF, audio. Impossible en commerce traditionnel à ce coût.",
   nouasell:"8-10 photos HD, vidéo artisan, fiche PDF, certificat. AVIF/WebP auto.",
   code:"<Image src={p.img} quality={90}\n  formats={['avif','webp']}\n  placeholder=\"blur\"/>\n<video autoPlay muted loop src={p.video}/>",
   where:"🛍 Fiche produit → Onglet médias"},
  {id:"interactivite",icon:"💬",label:"Interactivité",color:"#FB923C",slide:"Slide 18",
   def:"Communication bidirectionnelle temps réel. Remplace la relation vendeur/acheteur en présentiel.",
   nouasell:"Chat IA Claude API intégré, FAQ dynamique, configurateur produit temps réel.",
   code:"supabase.channel('chat')\n  .on('postgres_changes',{\n    event:'INSERT', table:'messages'\n  }, handleMsg)\n  .subscribe()",
   where:"🛍 Bouton 💬 → Claude AI Chat"},
  {id:"personnalisation",icon:"🎯",label:"Personnalisation",color:"#FBBF24",slide:"Slide 19",
   def:"Personnalisation de masse : offre différente pour chaque utilisateur, sans coût marginal.",
   nouasell:"Recommandations historique + catégorie + localisation. Profil client complet.",
   code:"SELECT p.* FROM products p\nJOIN user_views uv ON p.category=uv.category\nWHERE uv.user_id=$1\n  AND p.id!=ALL($2)\nORDER BY p.rating DESC LIMIT 4",
   where:"🛍 Boutique → 'Sélection pour vous'"},
  {id:"densite",icon:"📊",label:"Densité d'information",color:"#60A5FA",slide:"Slide 20",
   def:"Volume et qualité d'informations. Asymétrie réduite. Comparaison de prix transparente.",
   nouasell:"Analytics temps réel : conversion, panier moyen, heatmaps. Comparateur ⚖️.",
   code:"SELECT DATE_TRUNC('day',created_at) day,\n  COUNT(*) orders,\n  AVG(total) avg_basket,\n  SUM(total) revenue\nFROM orders GROUP BY 1 ORDER BY 1 DESC",
   where:"⚙️ Admin → Analytics / ⚖️ Comparateur"},
  {id:"social",icon:"👥",label:"Technologie Sociale",color:"#4ADE80",slide:"Slide 21",
   def:"Réseaux sociaux, avis, partage, co-création intégrés. Inexistant en commerce traditionnel.",
   nouasell:"Avis vérifiés, partage WhatsApp/Instagram, parrainage, wishlist partageable.",
   code:"CREATE TABLE reviews (\n  verified_purchase BOOLEAN DEFAULT FALSE,\n  rating INT CHECK (rating BETWEEN 1 AND 5),\n  helpful_votes INT DEFAULT 0,\n  photos JSONB\n);",
   where:"🛍 Communauté / ❤️ Wishlist / 👤 Profil"},
];

/* ── PRODUITS ── */
const PRODUCTS=[
  {id:1,name:"Caftan Brodé Royal",cat:"Mode",price:1850,rating:4.8,rCount:124,stock:3,badge:"Bestseller",emoji:"👘",
   colors:["Bordeaux","Bleu nuit","Ivoire"],sizes:["S","M","L","XL"],
   desc:"Caftan en velours brodé à la main. Motifs géométriques traditionnels, fil d'or, doublure soie.",
   media:["📸 8 photos HD","🎬 Vidéo 3min","📐 Guide tailles","🏅 Certificat"],
   reviews:[{n:"Salma B.",s:5,t:"Broderie parfaite, qualité luxueuse.",v:true,d:"12 jan"},{n:"Karim M.",s:5,t:"Livraison en 3 jours, emballage parfait.",v:true,d:"8 jan"},{n:"Nadia O.",s:4,t:"Très beau, couleur légèrement différente.",v:false,d:"3 jan"}]},
  {id:2,name:"Argan Pur Bio 100ml",cat:"Beauté",price:280,rating:4.9,rCount:312,stock:45,badge:"Top Ventes",emoji:"🫙",
   colors:["Standard"],sizes:["50ml","100ml","200ml"],
   desc:"Huile d'argan 100% pure, première pression à froid, certifiée ECOCERT.",
   media:["📸 6 photos","🧪 Analyse labo","🏅 Certificat bio"],
   reviews:[{n:"Leila H.",s:5,t:"Résultats visibles en une semaine.",v:true,d:"15 jan"},{n:"Sara T.",s:5,t:"4ème commande — fidèle à vie !",v:true,d:"5 jan"}]},
  {id:3,name:"Tajine Terre Cuite",cat:"Maison",price:420,rating:4.7,rCount:89,stock:23,badge:"Artisanat",emoji:"🍲",
   colors:["Ocre","Blanc"],sizes:["24cm","28cm","32cm"],
   desc:"Tajine authentique de Safi, peint à la main. Utilisable en cuisson directe.",
   media:["📸 5 photos","🎬 Fabrication","📋 Guide entretien"],
   reviews:[{n:"Youssef D.",s:5,t:"Saveurs incomparables.",v:true,d:"20 jan"},{n:"Fatima Z.",s:4,t:"Parfait cadeau.",v:true,d:"14 jan"}]},
  {id:4,name:"Babouches Cuir Naturel",cat:"Mode",price:350,rating:4.6,rCount:201,stock:31,badge:"",emoji:"🥿",
   colors:["Naturel","Noir","Camel","Miel"],sizes:["38","39","40","41","42","43","44"],
   desc:"Cuir végétal tanné, finitions cousues main. Artisans de Fès.",
   media:["📸 8 photos","🎨 12 coloris","📏 Guide tailles"],
   reviews:[{n:"Omar L.",s:5,t:"Confort incroyable.",v:true,d:"18 jan"},{n:"Rim A.",s:4,t:"Belle qualité de cuir.",v:false,d:"9 jan"}]},
  {id:5,name:"Thé à la Menthe Premium",cat:"Épicerie",price:95,rating:4.9,rCount:445,stock:120,badge:"Favori",emoji:"🍵",
   colors:["Signature"],sizes:["50g","100g","200g"],
   desc:"Gunpowder et menthe fraîche séchée. Coffret cadeau inclus.",
   media:["📸 3 photos","🌿 Origine certifiée","🎁 Packaging cadeau"],
   reviews:[{n:"Hassan M.",s:5,t:"Le meilleur thé que j'aie goûté.",v:true,d:"22 jan"}]},
  {id:6,name:"Coussin Berbère Tissé",cat:"Maison",price:680,rating:4.7,rCount:67,stock:14,badge:"Nouveau",emoji:"🛋️",
   colors:["Naturel","Rouge","Ocre"],sizes:["40×40cm","50×50cm"],
   desc:"Laine berbère tissée main dans le Haut Atlas. Motifs symboles de protection.",
   media:["📸 6 photos","🎬 Artisane","🗺️ Haut-Atlas"],
   reviews:[{n:"Dounia S.",s:5,t:"Pièce centrale de mon salon.",v:true,d:"11 jan"}]},
  {id:7,name:"Savon Beldi Noir",cat:"Beauté",price:120,rating:4.8,rCount:289,stock:78,badge:"",emoji:"🫧",
   colors:["Standard"],sizes:["200g","400g"],
   desc:"Savon beldi au ghassoul et huile d'olive. Idéal hammam traditionnel.",
   media:["📸 4 photos","🧪 Composition","♻️ Emballage éco"],
   reviews:[{n:"Meryem B.",s:5,t:"Peau douce dès la 1ère utilisation.",v:true,d:"19 jan"}]},
  {id:8,name:"Plateau Zellige Doré",cat:"Maison",price:950,rating:4.9,rCount:43,stock:4,badge:"Exclusif",emoji:"✨",
   colors:["Doré","Argenté"],sizes:["30cm","40cm","50cm"],
   desc:"Zellige doré par maître artisan. Pièce numérotée + certificat d'authenticité.",
   media:["📸 10 photos","🔢 N° de série","🎬 Maître zellij"],
   reviews:[{n:"Adil K.",s:5,t:"Pièce d'exception, certificat inclus.",v:true,d:"6 jan"}]},
];

/* ── MODÈLES DE REVENUS Slides 35–42 ── */
const REVENUE_MODELS=[
  {id:"commission",icon:"💰",label:"Commission transactionnelle",color:"#00FF88",slide:"Slide 36",
   pct:"8–12%",monthly:"~148 000 MAD",
   desc:"NouaSell prélève 8–12% sur chaque vente. Modèle dominant des marketplaces. Alignement d'intérêt vendeur/plateforme.",
   ex:"1 Caftan 1850 MAD → commission ~148 MAD",
   avantages:["Alignement vendeur/plateforme","Revenu proportionnel volume","0 risque stock"],
   limites:["Revenu variable","Dépend du volume"]},
  {id:"abonnement",icon:"🔄",label:"Abonnement Premium Artisan",color:"#00D4FF",slide:"Slide 37",
   pct:"299 MAD/mois",monthly:"~101 660 MAD MRR",
   desc:"Les artisans paient pour accéder aux outils premium : analytics avancés, boost visibilité, badge certifié, rapport concurrentiel.",
   ex:"340 artisans × 299 MAD = 101 660 MAD/mois récurrent",
   avantages:["Revenu prévisible (MRR)","Indépendant des ventes","Scalable"],
   limites:["Barrière à l'entrée","Nécessite valeur perçue forte"]},
  {id:"freemium",icon:"⭐",label:"Freemium Acheteurs NouaSell+",color:"#FFB300",slide:"Slide 38",
   pct:"49 MAD/mois",monthly:"~3–5% de conversion",
   desc:"Gratuit = accès standard. NouaSell+ = livraison gratuite illimitée + retours prioritaires + ventes privées artisans.",
   ex:"10 000 membres × 49 MAD × 3% conv. = 14 700 MAD/mois",
   avantages:["ARPU augmenté","Fidélisation","Réduction coût acquisition"],
   limites:["Conversion freemium→payant difficile","Valeur perçue à construire"]},
  {id:"pub",icon:"📢",label:"Sponsored / Publicité CPC",color:"#9B7FFF",slide:"Slide 40",
   pct:"0.5–2 MAD/clic",monthly:"Revenu additionnel",
   desc:"Produits sponsorisés dans les résultats de recherche. CPC (coût par clic) ou CPM (coût pour mille impressions).",
   ex:"Artisan paie pour apparaître en 1ère position dans sa catégorie",
   avantages:["Revenu additionnel sans frais","Scalable avec le trafic"],
   limites:["Risque de dégradation UX","Nécessite trafic important"]},
  {id:"data",icon:"📊",label:"Monétisation données B2B",color:"#F472B6",slide:"Slide 42",
   pct:"Rapports sectoriels",monthly:"Haute marge",
   desc:"Agrégation anonymisée des données de vente → rapports sectoriels vendus à marques, investisseurs, institutions.",
   ex:"Rapport 'Tendances artisanat Q1 2025' → marques internationales",
   avantages:["Haute marge","Valorise actifs existants","Revenu passif"],
   limites:["RGPD à respecter rigoureusement","Volume de données requis"]},
];

/* ── CONCURRENTS Slides 51–55 ── */
const COMPETITORS=[
  {name:"NouaSell",emoji:"🏛️",type:"Marketplace artisanat niche",modele:"Commission + Abo",
   force:"Authenticité certifiée, artisans vérifiés, expérience premium",
   faiblesse:"Notoriété en construction, catalogue limité",
   part:"2%",note:4.8,color:"#C9A96E",
   strategy:"Différenciation par la niche et l'authenticité (Porter)"},
  {name:"Amazon.ma",emoji:"📦",type:"Marketplace généraliste",modele:"Commission + FBA",
   force:"Logistique, confiance, UX, large catalogue",
   faiblesse:"Pas d'authenticité artisanale, produits génériques",
   part:"35%",note:4.3,color:"#FF9900",
   strategy:"Leadership coût et volume"},
  {name:"Jumia",emoji:"🦁",type:"Marketplace africaine",modele:"Commission",
   force:"Présence locale, paiement cash, ancrage africain",
   faiblesse:"Qualité variable, UX datée, confiance mitigée",
   part:"28%",note:3.8,color:"#F6831E",
   strategy:"Portée géographique africaine"},
  {name:"Etsy",emoji:"🎨",type:"Marketplace artisanat mondial",modele:"Commission + Listing fees",
   force:"Audience internationale artisanat, brand forte",
   faiblesse:"Pas focalisé Maroc, MAD absent, artisans peu connus",
   part:"5%",note:4.5,color:"#F1641E",
   strategy:"Artisanat mondial, audience premium"},
  {name:"Commerce local",emoji:"🏪",type:"Boutiques physiques",modele:"Marge directe",
   force:"Tangibilité, relation humaine, expérience sensorielle",
   faiblesse:"0 reach mondial, horaires limités, coût fixe élevé",
   part:"30%",note:4.0,color:"#059669",
   strategy:"Proximité et expérience physique"},
];

/* ── RGPD Slides 113–125 ── */
const RGPD=[
  {art:"Art. 5",title:"Principes de traitement",req:"Licéité, loyauté, transparence. Minimisation des données collectées.",
   impl:"NouaSell collecte uniquement email + adresse livraison. Aucun profilage comportemental sans consentement explicite.",
   color:"#00D4FF",slide:"Slide 114"},
  {art:"Art. 7",title:"Consentement",req:"Libre, spécifique, éclairé, univoque et révocable à tout moment.",
   impl:"Case à cocher explicite à l'inscription. Opt-in newsletter séparé du compte. Bouton de retrait en profil.",
   color:"#00FF88",slide:"Slide 115"},
  {art:"Art. 13",title:"Droit à l'information",req:"Informer sur la collecte, la finalité et la durée de conservation.",
   impl:"Politique de confidentialité accessible en footer. Bandeau cookies conforme. Mentions légales complètes.",
   color:"#FFB300",slide:"Slide 116"},
  {art:"Art. 17",title:"Droit à l'effacement",req:"'Droit à l'oubli' — suppression complète sur demande.",
   impl:"Bouton 'Supprimer mon compte' dans Profil → suppression en cascade PostgreSQL (commandes, avis, sessions).",
   color:"#9B7FFF",slide:"Slide 118"},
  {art:"Art. 20",title:"Portabilité des données",req:"Exporter ses données personnelles dans un format lisible (JSON/CSV).",
   impl:"Export depuis 'Mon Profil > Mes données'. Format JSON structuré. Délai maximum 72h.",
   color:"#F472B6",slide:"Slide 119"},
  {art:"Art. 25",title:"Privacy by Design",req:"Intégrer la protection des données dès la conception du système.",
   impl:"Chiffrement AES-256, RLS PostgreSQL, 0 données bancaires stockées (Stripe tokenise), JWT 24h.",
   color:"#4ADE80",slide:"Slide 121"},
  {art:"Art. 32",title:"Sécurité du traitement",req:"Mesures techniques et organisationnelles appropriées au risque.",
   impl:"TLS 1.3, bcrypt mots de passe, rate limiting, WAF Vercel, audit logs, PCI DSS Level 1.",
   color:"#FF4466",slide:"Slide 122"},
];

/* ── LOGISTIQUE Slides 89–97 ── */
const LOGISTIQUE=[
  {icon:"🛒",label:"Commande passée",sub:"Stock réservé en DB",
   detail:"Trigger SQL décrémente le stock immédiatement. Évite la survente. Statut : 'pending'.",
   slide:"Slide 89",color:"#00D4FF"},
  {icon:"📥",label:"Réception entrepôt",sub:"Scan QR artisan",
   detail:"Artisan remet le colis au point de collecte NouaSell. QR code scané → statut 'En préparation'.",
   slide:"Slide 90",color:"#FFB300"},
  {icon:"📦",label:"Conditionnement",sub:"Packaging premium",
   detail:"Emballage éco-responsable + carte artisan manuscrite. Valeur perçue augmentée (+18% satisfaction).",
   slide:"Slide 91",color:"#9B7FFF"},
  {icon:"🚚",label:"Expédition",sub:"DHL / Amana / CTM",
   detail:"Intégration API transporteurs. Numéro de suivi généré automatiquement + envoyé par email.",
   slide:"Slide 93",color:"#00FF88"},
  {icon:"📡",label:"Suivi temps réel",sub:"GPS tracking",
   detail:"Client suit son colis depuis l'app. Notifications push à chaque étape. Densité d'information — Slide 20.",
   slide:"Slide 94",color:"#00D4FF"},
  {icon:"🏠",label:"Livraison",sub:"Signature électronique",
   detail:"Photo de livraison + signature digitale. Preuve stockée en DB. Statut automatique → 'Livrée'.",
   slide:"Slide 95",color:"#00FF88"},
  {icon:"↩️",label:"Retours & SAV",sub:"30 jours gratuits",
   detail:"Label retour prégénéré envoyé par email. Remboursement automatique sous 48h via Stripe Refund API.",
   slide:"Slide 97",color:"#FFB300"},
];

/* ── XRAY ARCHITECTURE ── */
const LAYERS=[
  {id:"client",label:"COUCHE CLIENT",color:"#00D4FF",nodes:[
    {id:"browser",label:"Navigateur Web",sub:"React / Next.js",icon:"🌐",
     code:"export default async function Page({params}) {\n  const p = await getProduct(params.slug)\n  return <ProductView product={p}/>\n}",course:"Slides 56–59 · Web & HTTP"},
    {id:"mobile",label:"App Mobile",sub:"PWA / React Native",icon:"📱",
     code:'{ "display":"standalone",\n  "start_url":"/",\n  "theme_color":"#04080F" }',course:"Slides 62–64 · M-Commerce"},
    {id:"cdn",label:"CDN / Edge",sub:"Vercel Edge Network",icon:"⚡",
     code:"export default {\n  images:{domains:['cdn.store.ma']},\n  experimental:{ppr:true}\n}",course:"Slides 65–68 · Cloud"},
  ]},
  {id:"api",label:"COUCHE API",color:"#00FF88",nodes:[
    {id:"products_api",label:"API Produits",sub:"REST / JSON",icon:"📦",
     code:"export async function GET() {\n  const {data} = await supabase\n    .from('products').select('*')\n    .eq('status','active')\n  return Response.json(data)\n}",course:"Slides 56 · Infrastructure"},
    {id:"auth_api",label:"Auth / JWT",sub:"OAuth 2.0",icon:"🔐",
     code:"export function middleware(req) {\n  const token = req.cookies.get('session')\n  if (!token) return redirect('/login')\n  return verifyJWT(token)\n}",course:"Slides 74–78 · Sécurité"},
    {id:"checkout_api",label:"Checkout API",sub:"Stripe · CMI",icon:"💳",
     code:"const session = await stripe.checkout\n  .sessions.create({\n    line_items: cartItems,\n    mode: 'payment'\n  })",course:"Slides 80–84 · Paiements"},
    {id:"webhook",label:"Webhook Events",sub:"Stripe → DB",icon:"🔄",
     code:"switch(event.type) {\n  case 'checkout.session.completed':\n    await updateOrder({status:'paid'})\n    await sendEmail()\n    break\n}",course:"Slides 86 · O2C"},
  ]},
  {id:"data",label:"COUCHE DONNÉES",color:"#FFB300",nodes:[
    {id:"db",label:"PostgreSQL",sub:"Supabase · RLS",icon:"🗄️",
     code:"CREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name TEXT NOT NULL,\n  price NUMERIC(10,2),\n  stock INT DEFAULT 0\n);\nCREATE POLICY 'read' ON products\n  FOR SELECT USING (status='active');",course:"Slides 69 · Big Data"},
    {id:"storage",label:"Stockage Fichiers",sub:"Images · PDFs",icon:"🗂️",
     code:"await supabase.storage\n  .from('product-images')\n  .upload(fileName, file, {\n    contentType:'image/webp'\n  })",course:"Slides 65–68 · Cloud"},
    {id:"cache",label:"Redis Cache",sub:"Sessions · KPIs",icon:"⚡",
     code:"await redis.setex(\n  `cart:${userId}`, 3600,\n  JSON.stringify(cartItems)\n)",course:"Slides 98 · Performance"},
  ]},
  {id:"infra",label:"INFRASTRUCTURE",color:"#9B7FFF",nodes:[
    {id:"cicd",label:"CI/CD Pipeline",sub:"GitHub → Vercel",icon:"🔧",
     code:"on:\n  push:\n    branches:[main]\njobs:\n  deploy:\n    steps:\n      - run: npm test\n      - run: vercel --prod",course:"Slides 92 · Alignement Tech"},
    {id:"monitoring",label:"Monitoring",sub:"Logs · Alertes",icon:"📊",
     code:"track('purchase',{\n  amount:order.total,\n  currency:'MAD'\n})",course:"Slides 108 · KPIs"},
    {id:"security",label:"Sécurité",sub:"SSL · WAF · PCI",icon:"🛡️",
     code:"[\n  {key:'X-Frame-Options',value:'DENY'},\n  {key:'Strict-Transport-Security',\n   value:'max-age=63072000'}\n]",course:"Slides 77 · Sécurité"},
  ]},
];

const CONNECTIONS=[
  {from:"browser",to:"products_api",color:"#00D4FF"},{from:"mobile",to:"checkout_api",color:"#00D4FF"},
  {from:"cdn",to:"auth_api",color:"#00D4FF"},{from:"products_api",to:"db",color:"#00FF88"},
  {from:"auth_api",to:"cache",color:"#00FF88"},{from:"checkout_api",to:"db",color:"#00FF88"},
  {from:"webhook",to:"db",color:"#00FF88"},{from:"db",to:"cicd",color:"#FFB300"},
  {from:"storage",to:"monitoring",color:"#FFB300"},{from:"cache",to:"security",color:"#FFB300"},
];

const PAYMENT_STEPS=[
  {icon:"🛒",label:"Client clique\n'Acheter'",sub:"React state",color:"#00D4FF",slide:"Slide 81"},
  {icon:"🔐",label:"Session\nauthentifiée",sub:"JWT vérifié",color:"#00FF88",slide:"Slide 78"},
  {icon:"📋",label:"Commande\ncréée DB",sub:"status:pending",color:"#FFB300",slide:"Slide 86"},
  {icon:"💳",label:"Stripe/CMI\nTokenisation",sub:"TLS 1.3 AES-256",color:"#9B7FFF",slide:"Slide 77"},
  {icon:"✅",label:"Paiement\nconfirmé",sub:"Webhook reçu",color:"#00FF88",slide:"Slide 86"},
  {icon:"📦",label:"Stock\ndécrémenté",sub:"DB trigger SQL",color:"#FFB300",slide:"Slide 92"},
  {icon:"📧",label:"Email\nenvoyé",sub:"Resend API",color:"#00D4FF",slide:"Slide 101"},
];

const DB_TABLES=[
  {name:"products",color:"#FFB300",fields:[["id","UUID 🔑"],["name","TEXT"],["price","NUMERIC"],["stock","INT"],["status","ENUM"],["images","JSONB"]]},
  {name:"orders",color:"#00D4FF",fields:[["id","UUID 🔑"],["user_id","FK →"],["total","NUMERIC"],["status","ENUM"],["stripe_id","TEXT"],["created_at","TIMESTAMP"]]},
  {name:"order_items",color:"#00FF88",fields:[["id","UUID 🔑"],["order_id","FK →"],["product_id","FK →"],["qty","INT"],["price","NUMERIC"]]},
  {name:"profiles",color:"#9B7FFF",fields:[["id","UUID 🔑"],["email","TEXT"],["role","ENUM"],["loyalty_pts","INT"]]},
  {name:"reviews",color:"#F472B6",fields:[["id","UUID 🔑"],["product_id","FK →"],["rating","INT 1–5"],["verified","BOOL"],["body","TEXT"]]},
];

const SEC_LAYERS=[
  {level:1,label:"HTTPS / TLS 1.3",desc:"Chiffrement total — aucun octet en clair",tech:"SSL automatique Vercel",course:"Slide 77",color:"#00D4FF"},
  {level:2,label:"Authentification JWT",desc:"Tokens signés, expiration 24h, rotation auto",tech:"Supabase Auth / NextAuth.js",course:"Slide 78",color:"#00FF88"},
  {level:3,label:"Row Level Security",desc:"Chaque utilisateur voit uniquement ses données",tech:"PostgreSQL RLS Policies",course:"Slide 122",color:"#FFB300"},
  {level:4,label:"PCI DSS Level 1",desc:"Données bancaires jamais stockées ici",tech:"Stripe Tokenisation + AES-256",course:"Slide 77",color:"#9B7FFF"},
  {level:5,label:"Rate Limiting",desc:"Protection brute force et DDoS",tech:"Vercel Edge Middleware",course:"Slide 76",color:"#FF4466"},
];

/* ══ TOAST ══════════════════════════════════════════════════ */
function ToastContainer({toasts}) {
  return (
    <div style={{position:"fixed",top:60,right:16,zIndex:1000,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.type==="success"?"#0C2A1A":t.type==="error"?"#2A0C14":C.s2,border:`1px solid ${t.type==="success"?C.green:t.type==="error"?C.red:C.b2}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,minWidth:240,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",animation:`${t.leaving?"slideOutRight":"slideInRight"} .3s ease forwards`}}>
          <span style={{fontSize:16}}>{t.icon}</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:t.type==="success"?C.green:t.type==="error"?C.red:C.text,fontWeight:600}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ══ CHAT IA — Claude API · Slide 18 ════════════════════════ */
function ChatWidget({open,onToggle}) {
  const [msgs,setMsgs]=useState([{from:"bot",text:"👋 Bonjour ! Je suis l'assistant IA NouaSell. Posez-moi n'importe quelle question sur nos produits, la livraison, ou l'e-commerce marocain !"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{if(open)setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);},[msgs,open]);

  const send=async()=>{
    if(!input.trim()||loading)return;
    const q=input;
    setMsgs(p=>[...p,{from:"user",text:q}]);
    setInput(""); setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:300,
          system:"Tu es l'assistant IA de NouaSell, boutique e-commerce d'artisanat marocain premium. Réponds en français, concis (max 3 phrases), chaleureux et professionnel. Produits : caftans, argan, tajines, babouches, thé, coussins, savon beldi, zellige. Livraison : 2–5j Maroc, 7–14j international. Paiement : CMI, Stripe, PayPal, Cash. Retours : 30j gratuits. Code promo : ENCG2025 = -10%. Si on parle d'e-commerce, tu peux mentionner les concepts du cours Dr. Faouzi ENCG Kénitra (Laudon & Traver, 8 caractéristiques, modèles de revenus).",
          messages:[...msgs.slice(-4).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text})),{role:"user",content:q}]
        })
      });
      const data=await res.json();
      setMsgs(p=>[...p,{from:"bot",text:data.content?.[0]?.text||"Désolé, réessayez !"}]);
    } catch {
      setMsgs(p=>[...p,{from:"bot",text:"⚠️ Connexion indisponible. Essayez : livraison, paiement, retour, promo."}]);
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={onToggle} style={{position:"fixed",bottom:20,right:20,width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,border:"none",cursor:"pointer",fontSize:18,zIndex:200,boxShadow:`0 4px 20px ${C.gold}55`,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open?"✕":"💬"}
      </button>
      {open&&(
        <div className="fu" style={{position:"fixed",bottom:80,right:20,width:310,height:390,background:C.cream,borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,0.25)",zIndex:200,display:"flex",flexDirection:"column",overflow:"hidden",border:"1px solid #E5E7EB"}}>
          <div style={{background:C.dark,padding:"11px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`,animation:"pulseGlow 2s ease infinite"}}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#FAFAF7"}}>Assistant IA NouaSell</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#6B5A42",marginLeft:"auto"}}>Claude API · Slide 18</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:7}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",background:m.from==="user"?C.dark:"#F3F4F6",borderRadius:10,padding:"8px 11px",fontFamily:"'Outfit',sans-serif",fontSize:11,color:m.from==="user"?"#FAFAF7":"#1A1410",lineHeight:1.5}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:3,padding:"8px 12px",background:"#F3F4F6",borderRadius:10,width:52}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#9CA3AF",animation:`ping .9s ease ${i*.2}s infinite`}}/>)}
            </div>}
            <div ref={endRef}/>
          </div>
          <div style={{display:"flex",gap:6,padding:"9px 10px",borderTop:"1px solid #E5E7EB"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Posez votre question..." style={{flex:1,border:"1px solid #E5E7EB",borderRadius:8,padding:"7px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff"}}/>
            <button onClick={send} disabled={loading} style={{background:loading?C.b2:C.dark,border:"none",borderRadius:8,padding:"7px 12px",color:"#FAFAF7",cursor:loading?"not-allowed":"pointer",fontSize:13,transition:"all .2s"}}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ══ STORE VIEW ══════════════════════════════════════════════ */
function StoreView({products,onAdd,wishlist,onWish,fx}) {
  const [cat,setCat]=useState("Tous");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("popular");
  const [selected,setSelected]=useState(null);
  const [loading,setLoading]=useState(true);
  const [compare,setCompare]=useState([]);
  const [showCmp,setShowCmp]=useState(false);
  const [promoVis,setPromoVis]=useState(true);

  useEffect(()=>{setTimeout(()=>setLoading(false),1100);},[]);

  const filtered=products
    .filter(p=>(cat==="Tous"||p.cat===cat)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.desc.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>sort==="price_asc"?a.price-b.price:sort==="price_desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:b.rCount-a.rCount);

  const toggleCmp=p=>setCompare(prev=>prev.find(x=>x.id===p.id)?prev.filter(x=>x.id!==p.id):prev.length<3?[...prev,p]:prev);

  return (
    <div style={{flex:1,overflowY:"auto",background:C.shopBg}}>
      {promoVis&&(
        <div style={{background:`linear-gradient(90deg,${C.dark},#2C1F0E,${C.dark})`,padding:"7px 40px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,position:"relative"}}>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.gold}}>🏷️ Code <strong>ENCG2025</strong> — -10% sur 1ère commande · Livraison gratuite dès 500 MAD</span>
          <button onClick={()=>setPromoVis(false)} style={{position:"absolute",right:14,background:"transparent",border:"none",color:"#6B5A42",cursor:"pointer",fontSize:13}}>✕</button>
        </div>
      )}
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#1A1410 0%,#2C1F0E 40%,#1A1410 100%)",padding:"28px 40px 22px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}12,transparent 70%)`}}/>
        <div style={{position:"relative",maxWidth:960,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.gold,letterSpacing:"0.2em",marginBottom:8}}>✦ L'ARTISANAT MAROCAIN EN LIGNE</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:28,color:"#FAFAF7",lineHeight:1.2,marginBottom:12}}>Découvrez <em style={{color:C.gold}}>l'authenticité</em><br/>marocaine</h1>
              <div style={{position:"relative",maxWidth:400,marginBottom:14}}>
                <input placeholder="Caftan, argan, zellige..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 40px 10px 16px",fontSize:13,fontFamily:"'Outfit',sans-serif",color:"#FAFAF7",outline:"none"}}/>
                <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#6B5A42",fontSize:14}}>🔍</span>
              </div>
              <div style={{display:"flex",gap:18}}>
                {[["12k+","Commandes"],["47","Pays"],["340","Artisans"],["4.8★","Note"]].map(([v,l])=>(
                  <div key={l}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.gold}}>{v}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B5A42"}}>{l}</div></div>
                ))}
              </div>
            </div>
            {/* Ubiquité Slide 14 */}
            <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",minWidth:170}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.gold,letterSpacing:"0.14em",marginBottom:8}}>🌐 UBIQUITÉ · SLIDE 14</div>
              {[["🖥️","Desktop","Tous navigateurs"],["📱","Mobile","iOS & Android"],["⌚","Tablette","iPad · Galaxy"]].map(([ico,d,sub])=>(
                <div key={d} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:14}}>{ico}</span>
                  <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#FAFAF7",fontWeight:600}}>{d}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#6B5A42"}}>{sub}</div></div>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 5px ${C.green}`}}/>
                </div>
              ))}
            </div>
          </div>
          {/* Standards Universels Slide 16 */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:12}}>
            {[["🔒","HTTPS/TLS 1.3"],["⚡","REST API"],["🔑","OAuth 2.0"],["💳","PCI DSS L1"],["🌍","CDN 42 régions"]].map(([ico,label])=>(
              <div key={label} style={{background:"rgba(0,212,255,0.07)",border:"1px solid rgba(0,212,255,0.18)",borderRadius:5,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                <span style={{fontSize:9}}>{ico}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#00D4FF"}}>{label}</span>
              </div>
            ))}
            <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}30`,borderRadius:5,padding:"2px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold}}>🔌 Standards Universels · Slide 16</div>
          </div>
        </div>
      </div>

      {/* Personnalisation Slide 19 */}
      <div style={{padding:"14px 40px 0",maxWidth:1060,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFFBF5)",border:"1px solid #FDE8C0",borderRadius:14,padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:14}}>🎯</span>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#92400E"}}>Sélection pour vous</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.amber,background:"#FDE8C010",border:"1px solid #FDE8C0",borderRadius:4,padding:"1px 5px",marginLeft:"auto"}}>Personnalisation · Slide 19</span>
          </div>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
            {products.filter(p=>p.rating>=4.8).slice(0,5).map(p=>(
              <div key={p.id} onClick={()=>setSelected(p)} style={{background:"#fff",border:"1px solid #F0EDE8",borderRadius:10,padding:"9px 12px",cursor:"pointer",minWidth:148,flexShrink:0,display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.10)";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
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

      {/* Filters */}
      <div style={{background:C.cream,borderBottom:"1px solid #E5E7EB",padding:"10px 40px",display:"flex",gap:8,alignItems:"center",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?"#1A1410":"transparent",border:`1px solid ${cat===c?"#1A1410":"#D1D5DB"}`,borderRadius:20,padding:"5px 13px",fontSize:11,fontWeight:600,cursor:"pointer",color:cat===c?"#FAFAF7":"#4B5563",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>{c}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:7,padding:"5px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",color:"#374151",background:"#fff",outline:"none",cursor:"pointer"}}>
            <option value="popular">Plus populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
          {compare.length>0&&<button onClick={()=>setShowCmp(true)} style={{background:"#1A1410",border:"none",borderRadius:7,padding:"5px 11px",color:"#FAFAF7",fontSize:10,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700}}>⚖️ Comparer ({compare.length})</button>}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9CA3AF"}}>{filtered.length} produits</div>
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:"18px 40px 40px",maxWidth:1060,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:16}}>
          {loading?[...Array(8)].map((_,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:16,overflow:"hidden"}}>
              <div className="skel" style={{height:145,width:"100%"}}/>
              <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:7}}>
                <div className="skel" style={{height:10,borderRadius:4,width:"60%"}}/><div className="skel" style={{height:14,borderRadius:4,width:"85%"}}/><div className="skel" style={{height:10,borderRadius:4,width:"45%"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}><div className="skel" style={{height:18,borderRadius:4,width:"40%"}}/><div className="skel" style={{height:30,borderRadius:7,width:"38%"}}/></div>
              </div>
            </div>
          )):filtered.map((p,i)=>{
            const inW=wishlist.find(x=>x.id===p.id);
            const inC=compare.find(x=>x.id===p.id);
            const low=p.stock<=5;
            return (
              <div key={p.id} style={{background:"#fff",border:`1px solid ${inC?"#1A1410":"#F0EDE8"}`,borderRadius:16,overflow:"hidden",transition:"all .25s",boxShadow:inC?"0 0 0 2px #1A1410":"0 1px 4px rgba(0,0,0,0.06)",animation:`fadeUp .3s ease ${i*.04}s both`}}
                onMouseEnter={e=>{if(!inC){e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-3px)";}}}
                onMouseLeave={e=>{if(!inC){e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}}>
                <div onClick={()=>setSelected(p)} style={{height:145,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
                  <span style={{fontSize:56}}>{p.emoji}</span>
                  {p.badge&&<div style={{position:"absolute",top:8,left:8,background:p.badge==="Bestseller"?"#1A1410":p.badge==="Exclusif"?C.gold:"#059669",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4}}>{p.badge}</div>}
                  {low?<div style={{position:"absolute",top:8,right:8,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4,padding:"2px 6px",fontSize:8,color:"#EF4444",fontWeight:700}}>⚡ Plus que {p.stock} !</div>:<div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.85)",borderRadius:4,padding:"1px 5px",fontSize:9,color:"#6B5A42",fontFamily:"'JetBrains Mono',monospace"}}>Stock:{p.stock}</div>}
                  <div style={{position:"absolute",bottom:6,left:8,display:"flex",gap:3}}>{p.media.slice(0,2).map((m,j)=><div key={j} style={{background:"rgba(0,0,0,0.55)",borderRadius:3,padding:"1px 4px",fontSize:7,color:"#fff"}}>{m.split(" ")[0]}</div>)}</div>
                  <button onClick={e=>{e.stopPropagation();onWish(p);}} style={{position:"absolute",bottom:6,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",animation:inW?"heartPop .3s ease":"none"}}>{inW?"❤️":"🤍"}</button>
                </div>
                <div style={{padding:"11px 13px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:3}}>{p.cat.toUpperCase()}</div>
                  <div onClick={()=>setSelected(p)} style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#1A1410",marginBottom:4,lineHeight:1.3,cursor:"pointer"}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                    <span style={{color:C.gold,fontSize:10}}>{"★".repeat(Math.floor(p.rating))}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#9B8A6E"}}>{p.rating} ({p.rCount})</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:"#1A1410"}}>{fx(p.price)}</span>
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={()=>toggleCmp(p)} style={{background:inC?"#1A1410":"transparent",border:`1px solid ${inC?"#1A1410":"#E5E7EB"}`,borderRadius:6,padding:"5px 6px",cursor:"pointer",fontSize:10,color:inC?"#FAFAF7":"#9CA3AF",transition:"all .2s"}} title="Comparer">⚖️</button>
                      <button onClick={()=>setSelected(p)} style={{background:"#1A1410",border:"none",borderRadius:7,padding:"6px 11px",color:"#FAFAF7",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#2C1F0E"}
                        onMouseLeave={e=>e.currentTarget.style.background="#1A1410"}>Voir →</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technologie Sociale Slide 21 */}
        {!loading&&(
          <div style={{marginTop:26,background:"#fff",border:"1px solid #F0EDE8",borderRadius:14,padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:16}}>👥</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#1A1410"}}>La communauté NouaSell</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.violet,background:`${C.violet}12`,border:`1px solid ${C.violet}25`,borderRadius:4,padding:"1px 5px",marginLeft:"auto"}}>Tech. Sociale · Slide 21</span>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
              {PRODUCTS.flatMap(p=>p.reviews.map(r=>({...r,product:p.name,emoji:p.emoji}))).filter(r=>r.v).slice(0,6).map((r,i)=>(
                <div key={i} style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:10,padding:"10px 13px",minWidth:190,flexShrink:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{r.n[0]}</div>
                    <div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:"#1A1410"}}>{r.n}</div><div style={{color:C.gold,fontSize:9}}>{"★".repeat(r.s)}</div></div>
                    <div style={{marginLeft:"auto",background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 4px",fontSize:7,color:"#059669",fontWeight:700}}>✓ Vérifié</div>
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#4B5563",lineHeight:1.5,marginBottom:4}}>"{r.t}"</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>{r.emoji} {r.product}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,marginTop:12,alignItems:"center"}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280"}}>Partager :</span>
              {[["📱","WhatsApp","#25D366"],["📸","Instagram","#E1306C"],["🐦","X","#1DA1F2"]].map(([ico,name,color])=>(
                <div key={name} style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:6,padding:"4px 10px",fontSize:10,color,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:"pointer"}}>{ico} {name}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} fx={fx}/>}
      {showCmp&&compare.length>0&&<CompareModal products={compare} onClose={()=>setShowCmp(false)} fx={fx}/>}
    </div>
  );
}

/* ══ WISHLIST VIEW ═══════════════════════════════════════════ */
function WishlistView({wishlist,onAdd,onWish,fx,onBack}) {
  const [selected,setSelected]=useState(null);
  return (
    <div style={{flex:1,overflowY:"auto",background:C.shopBg}}>
      <div style={{background:`linear-gradient(135deg,${C.dark},#2C1F0E)`,padding:"20px 40px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"7px 12px",color:"#FAFAF7",cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>← Boutique</button>
        <div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:"#FAFAF7"}}>❤️ Mes Favoris</h1>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B5A42"}}>{wishlist.length} article(s) sauvegardé(s) · Technologie Sociale — Slide 21</div>
        </div>
      </div>
      <div style={{padding:"24px 40px",maxWidth:1060,margin:"0 auto"}}>
        {wishlist.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px",background:"#fff",borderRadius:14,border:"1px solid #F0EDE8"}}>
            <div style={{fontSize:48,marginBottom:16}}>🤍</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:"#4B5563",marginBottom:8}}>Votre liste de favoris est vide</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:"#9B8A6E",marginBottom:20}}>Ajoutez des articles en cliquant sur 🤍 sur les fiches produits</div>
            <button onClick={onBack} style={{background:"#1A1410",border:"none",borderRadius:10,padding:"11px 24px",color:"#FAFAF7",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Découvrir les produits →</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
            {wishlist.map((p,i)=>(
              <div key={p.id} style={{background:"#fff",border:"1px solid #F0EDE8",borderRadius:16,overflow:"hidden",animation:`fadeUp .3s ease ${i*.05}s both`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all .25s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.10)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}>
                <div onClick={()=>setSelected(p)} style={{height:140,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                  <span style={{fontSize:52}}>{p.emoji}</span>
                  <button onClick={e=>{e.stopPropagation();onWish(p);}} style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>❤️</button>
                </div>
                <div style={{padding:"12px 14px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.1em",marginBottom:3}}>{p.cat.toUpperCase()}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#1A1410",marginBottom:6,lineHeight:1.3}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:"#1A1410"}}>{fx(p.price)}</span>
                    <button onClick={()=>onAdd(p,{color:p.colors[0],size:p.sizes?.[0]})} style={{background:"#1A1410",border:"none",borderRadius:7,padding:"7px 12px",color:"#FAFAF7",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>+ Panier</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} fx={fx}/>}
    </div>
  );
}

/* ══ PROFIL CLIENT ═══════════════════════════════════════════ */
function ProfileView({user,orders,loyaltyPts,fx,onBack}) {
  const [tab,setTab]=useState("orders");
  const totalSpent=orders.reduce((s,o)=>s+o.total,0);
  const LEVEL=loyaltyPts<100?"Bronze":loyaltyPts<300?"Argent":loyaltyPts<600?"Or":"Platine";
  const LC={"Bronze":"#CD7F32","Argent":"#C0C0C0","Or":C.gold,"Platine":"#E5E4E2"};
  return (
    <div style={{flex:1,overflowY:"auto",background:C.shopBg}}>
      <div style={{background:`linear-gradient(135deg,${C.dark},#2C1F0E)`,padding:"20px 40px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}10,transparent 70%)`}}/>
        <div style={{position:"relative",maxWidth:960,margin:"0 auto"}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"7px 12px",color:"#FAFAF7",cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",marginBottom:14}}>← Boutique</button>
          <div style={{display:"flex",gap:16,alignItems:"flex-start",paddingBottom:20,flexWrap:"wrap"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#fff",flexShrink:0}}>{user.name[0]}</div>
            <div style={{flex:1}}>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:"#FAFAF7",marginBottom:2}}>{user.name}</h1>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B5A42",marginBottom:10}}>{user.email} · {user.city} · Membre depuis {user.since}</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {[{l:"Commandes",v:orders.length},{l:"Total dépensé",v:`${totalSpent.toLocaleString()} MAD`},{l:"Pts fidélité",v:`⭐ ${loyaltyPts}`},{l:"Niveau",v:`🏅 ${LEVEL}`}].map(k=>(
                  <div key={k.l}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:k.l==="Niveau"?LC[LEVEL]:C.gold}}>{k.v}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#6B5A42"}}>{k.l}</div></div>
                ))}
              </div>
            </div>
            {/* Barre fidélité */}
            <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",minWidth:180}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.gold,letterSpacing:"0.12em",marginBottom:8}}>🏅 PROGRAMME FIDÉLITÉ</div>
              {[["Bronze",0,100],["Argent",100,300],["Or",300,600],["Platine",600,1000]].map(([name,min,max])=>(
                <div key={name} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:loyaltyPts>=min?LC[name]:"#2A4A66",flexShrink:0}}/>
                  <div style={{flex:1,height:3,borderRadius:2,background:"#1A3050",overflow:"hidden"}}>
                    <div style={{height:"100%",background:LC[name],width:loyaltyPts>=max?"100%":loyaltyPts<min?"0%":`${((loyaltyPts-min)/(max-min))*100}%`,transition:"width 1s ease"}}/>
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:LEVEL===name?LC[name]:"#2A4A66",fontWeight:700}}>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:2}}>
            {[["orders","📋 Commandes"],["benefits","💡 Avantages"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"rgba(255,255,255,0.8)":"transparent"}`,padding:"8px 16px",color:tab===id?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?700:400,transition:"all .2s"}}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"24px 40px",maxWidth:960,margin:"0 auto"}}>
        {tab==="orders"&&(
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#1A1410",marginBottom:14}}>Historique de commandes — Slides 86 · O2C</div>
            {orders.length===0?(
              <div style={{textAlign:"center",padding:"40px",color:"#9B8A6E",fontFamily:"'Outfit',sans-serif",background:"#fff",borderRadius:14,border:"1px solid #F0EDE8"}}>
                <div style={{fontSize:36,marginBottom:10}}>📋</div>
                <div style={{fontSize:14,fontWeight:600,color:"#4B5563",marginBottom:6}}>Aucune commande pour l'instant</div>
                <div style={{fontSize:12}}>Vos commandes apparaîtront ici après votre premier achat</div>
              </div>
            ):orders.map((o,i)=>(
              <div key={o.id} style={{background:"#fff",border:"1px solid #F0EDE8",borderRadius:14,padding:"16px 18px",marginBottom:10,animation:`fadeUp .3s ease ${i*.05}s both`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.gold,marginBottom:2}}>{o.id}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280"}}>{o.date} · {o.customer?.city}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#1A1410"}}>{fx(o.total)}</div>
                    <div style={{background:o.status==="Livrée"?"#DCFCE7":"#FEF9C3",border:`1px solid ${o.status==="Livrée"?"#BBF7D0":"#FDE68A"}`,borderRadius:5,padding:"2px 8px",fontSize:9,color:o.status==="Livrée"?"#059669":"#92400E",fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {o.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"center",gap:5,background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:7,padding:"4px 9px"}}>
                      <span style={{fontSize:14}}>{item.emoji}</span>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#4B5563"}}>{item.name} ×{item.qty}</span>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10,color:"#1A1410"}}>{fx(item.price*item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="benefits"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {title:"🎯 Offres personnalisées",desc:"Offres ciblées basées sur vos favoris et historique d'achat.",slide:"Personnalisation · Slide 19",color:C.amber},
              {title:"🔔 Alertes de prix",desc:"Notification quand un article de vos favoris est en promo.",slide:"Densité d'info · Slide 20",color:C.cyan},
              {title:"📦 Stock temps réel",desc:"Disponibilité en direct. Réservez avant rupture de stock.",slide:"Richesse · Slide 17",color:C.violet},
              {title:"🤝 Partage social",desc:"Partagez votre wishlist avec vos proches pour les fêtes.",slide:"Tech. Sociale · Slide 21",color:C.green},
              {title:"⭐ Points fidélité",desc:"Chaque achat depuis la wishlist = 20% de points supplémentaires.",slide:"Personnalisation · Slide 19",color:C.gold},
              {title:"🌍 Devise automatique",desc:"Prix dans votre devise locale selon votre localisation IP.",slide:"Portée mondiale · Slide 15",color:"#34D399"},
            ].map(card=>(
              <div key={card.title} style={{background:"#fff",border:"1px solid #F0EDE8",borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#1A1410",marginBottom:6}}>{card.title}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563",lineHeight:1.7,marginBottom:8}}>{card.desc}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:card.color,background:`${card.color}12`,border:`1px solid ${card.color}25`,borderRadius:4,padding:"2px 7px",display:"inline-block"}}>{card.slide}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ PRODUCT MODAL ═══════════════════════════════════════════ */
function ProductModal({product:p,onClose,onAdd,onWish,wishlist,fx}) {
  const [tab,setTab]=useState("info");
  const [qty,setQty]=useState(1);
  const [color,setColor]=useState(p.colors[0]);
  const [size,setSize]=useState(p.sizes?.[0]||null);
  const [adding,setAdding]=useState(false);
  const inW=wishlist.find(x=>x.id===p.id);
  const handleAdd=()=>{setAdding(true);for(let i=0;i<qty;i++)onAdd(p,{color,size});setTimeout(()=>{setAdding(false);onClose();},800);};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{background:C.cream,borderRadius:20,width:540,maxWidth:"93vw",maxHeight:"90vh",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.35)",display:"flex",flexDirection:"column"}}>
        <div style={{height:180,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,position:"relative",flexShrink:0}}>
          {p.emoji}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.15)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#4B5563",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <button onClick={()=>onWish(p)} style={{position:"absolute",top:12,left:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",animation:inW?"heartPop .3s ease":"none"}}>{inW?"❤️":"🤍"}</button>
          {p.stock<=5&&<div style={{position:"absolute",bottom:10,left:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:6,padding:"3px 8px",fontSize:9,color:"#EF4444",fontWeight:700}}>⚡ Seulement {p.stock} en stock !</div>}
          <div style={{position:"absolute",top:10,right:50,background:"rgba(201,169,110,0.85)",borderRadius:5,padding:"2px 7px",fontSize:7,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>🎬 Richesse · Slide 17</div>
          <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:3}}>{p.media.map((m,i)=><div key={i} style={{background:"rgba(0,0,0,0.55)",borderRadius:3,padding:"1px 4px",fontSize:7,color:"#fff"}}>{m.split(" ")[0]}</div>)}</div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #E5E7EB",flexShrink:0}}>
          {[["info","📋 Produit"],["reviews",`⭐ Avis (${p.reviews.length})`]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#1A1410":"transparent"}`,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?"#1A1410":"#6B7280",transition:"all .2s"}}>{label}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {tab==="info"&&(
            <>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:4}}>{p.cat.toUpperCase()}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{color:C.gold,fontSize:13}}>{"★".repeat(Math.floor(p.rating))}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{p.rating}/5 · {p.rCount} avis</span>
                <span style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 5px",fontSize:8,color:"#059669",fontWeight:700,marginLeft:"auto"}}>✓ Achats vérifiés</span>
              </div>
              <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563",lineHeight:1.7,marginBottom:14}}>{p.desc}</p>
              {p.colors.length>1&&<div style={{marginBottom:12}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>Couleur : <span style={{color:"#1A1410"}}>{color}</span></div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{p.colors.map(c=><button key={c} onClick={()=>setColor(c)} style={{background:color===c?"#1A1410":"transparent",border:`1px solid ${color===c?"#1A1410":"#D1D5DB"}`,borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer",color:color===c?"#FAFAF7":"#4B5563",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{c}</button>)}</div>
              </div>}
              {size&&<div style={{marginBottom:12}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>Taille : <span style={{color:"#1A1410"}}>{size}</span></div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{p.sizes.map(s=><button key={s} onClick={()=>setSize(s)} style={{background:size===s?"#1A1410":"transparent",border:`1px solid ${size===s?"#1A1410":"#D1D5DB"}`,borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:size===s?"#FAFAF7":"#4B5563",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{s}</button>)}</div>
              </div>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,paddingTop:12,borderTop:"1px solid #F0EDE8"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#1A1410"}}>{fx(p.price*qty)}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>Stock: {p.stock} unités</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,background:"#F3F4F6",borderRadius:8,padding:"4px 8px"}}>
                    <button onClick={()=>setQty(Math.max(1,qty-1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:"#4B5563",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#1A1410",minWidth:18,textAlign:"center"}}>{qty}</span>
                    <button onClick={()=>setQty(Math.min(p.stock,qty+1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:"#4B5563",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <button onClick={handleAdd} style={{background:adding?"#059669":"#1A1410",border:"none",borderRadius:10,padding:"11px 20px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",minWidth:130,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    {adding?<><span style={{animation:"rotateIn .4s ease"}}>✓</span> Ajouté !</>:"🛒 Ajouter au panier"}
                  </button>
                </div>
              </div>
            </>
          )}
          {tab==="reviews"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",background:"#F9FAFB",borderRadius:10}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:"#1A1410"}}>{p.rating}</div>
                <div><div style={{color:C.gold,fontSize:18}}>{"★".repeat(Math.floor(p.rating))}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280"}}>{p.rCount} avis</div></div>
                <div style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.violet,background:`${C.violet}12`,border:`1px solid ${C.violet}22`,borderRadius:4,padding:"2px 6px"}}>👥 Tech. Sociale · Slide 21</div>
              </div>
              {p.reviews.map((r,i)=>(
                <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #F0EDE8"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{r.n[0]}</div>
                    <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{r.n}</div><div style={{color:C.gold,fontSize:11}}>{"★".repeat(r.s)}</div></div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
                      {r.v&&<div style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:4,padding:"1px 5px",fontSize:8,color:"#059669",fontWeight:700}}>✓ Vérifié</div>}
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

/* ══ COMPARE MODAL ═══════════════════════════════════════════ */
function CompareModal({products,onClose,fx}) {
  const rows=[["Prix",p=>fx(p.price)],["Note",p=>`${"★".repeat(Math.floor(p.rating))} ${p.rating}`],["Avis",p=>`${p.rCount}`],["Stock",p=>`${p.stock} u.`],["Catégorie",p=>p.cat],["Couleurs",p=>`${p.colors.length} opts`]];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{background:C.cream,borderRadius:20,maxWidth:"92vw",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"13px 20px",background:C.dark,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#FAFAF7"}}>Comparateur</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,marginLeft:10}}>📊 Densité d'information · Slide 20</span></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"#FAFAF7",fontSize:13}}>✕</button>
        </div>
        <div style={{padding:18,overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",width:"100%",fontFamily:"'Outfit',sans-serif"}}>
            <thead><tr><th style={{padding:"8px 14px",textAlign:"left",fontSize:11,color:"#6B7280",fontWeight:600,borderBottom:"2px solid #E5E7EB"}}></th>
              {products.map(p=><th key={p.id} style={{padding:"8px 18px",textAlign:"center",borderBottom:"2px solid #E5E7EB",minWidth:120}}><div style={{fontSize:30,marginBottom:3}}>{p.emoji}</div><div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:11,color:"#1A1410"}}>{p.name}</div></th>)}
            </tr></thead>
            <tbody>{rows.map(([label,render])=>(
              <tr key={label} style={{borderBottom:"1px solid #F0EDE8"}}>
                <td style={{padding:"9px 14px",fontWeight:600,fontSize:12,color:"#374151"}}>{label}</td>
                {products.map(p=><td key={p.id} style={{padding:"9px 18px",textAlign:"center",fontSize:12,color:"#1A1410",fontFamily:label==="Prix"?"'Syne',sans-serif":"'Outfit',sans-serif",fontWeight:label==="Prix"?800:400}}>{render(p)}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══ CART DRAWER — 4 étapes ══════════════════════════════════ */
function CartDrawer({cart,total,onClose,onRemove,onQty,onOrder,fx,toast}) {
  const [step,setStep]=useState(0);
  const [info,setInfo]=useState({name:"",email:"",phone:"",address:"",city:"Casablanca",delivery:"standard"});
  const [payment,setPayment]=useState("CMI");
  const [promo,setPromo]=useState("");
  const [promoApplied,setPromoApplied]=useState(null);
  const [confirmed,setConfirmed]=useState(null);
  const [paying,setPaying]=useState(false);
  const [trackStep,setTrackStep]=useState(0);

  const disc=promoApplied?PROMOS[promoApplied]:0;
  const dFee=info.delivery==="express"?50:total>=500?0:30;
  const dAmt=Math.round(total*disc/100);
  const finalTotal=total-dAmt+dFee;

  const applyPromo=()=>{
    if(PROMOS[promo.toUpperCase()]){setPromoApplied(promo.toUpperCase());toast(`Code ${promo.toUpperCase()} — -${PROMOS[promo.toUpperCase()]}% appliqué !`,"success","🏷️");}
    else toast("Code promo invalide","error","✕");
  };

  const handlePay=()=>{
    setPaying(true);
    setTimeout(()=>{
      const o=onOrder({...info,payment},disc);
      setConfirmed(o);setStep(3);setPaying(false);
      [1,2,3].forEach((v,idx)=>setTimeout(()=>setTrackStep(v),3000+idx*4000));
    },2200);
  };

  const SLABELS=["Panier","Livraison","Paiement","Confirmation"];
  const FLOW=["En attente","En traitement","Expédiée","Livrée"];

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={step<3?onClose:undefined} style={{flex:1,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(3px)"}}/>
      <div className="fi" style={{width:420,background:C.cream,display:"flex",flexDirection:"column",boxShadow:"-8px 0 48px rgba(0,0,0,0.25)",position:"relative"}}>
        <div style={{padding:"14px 18px",background:C.dark,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:step<3?10:0}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#FAFAF7"}}>{SLABELS[step]}</div>
            {step<3&&<button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#FAFAF7",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
          </div>
          {step<3&&(
            <div style={{display:"flex",gap:4}}>
              {["Panier","Livraison","Paiement"].map((s,i)=>(
                <div key={s} style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{height:3,borderRadius:2,background:i<=step?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.2)",transition:"all .4s"}}/>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:i===step?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)",fontWeight:i===step?700:400}}>{s}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 18px",position:"relative"}}>
          {/* STEP 0 — Panier */}
          {step===0&&(cart.length===0
            ?<div style={{textAlign:"center",padding:"40px",color:"#9B8A6E",fontFamily:"'Outfit',sans-serif"}}><div style={{fontSize:40,marginBottom:12}}>🛒</div>Panier vide</div>
            :<>
              {cart.map(item=>(
                <div key={item.key} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0EDE8"}}>
                  <div style={{width:44,height:44,background:"#F7F3ED",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#1A1410",marginBottom:1}}>{item.name}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E"}}>{item.color}{item.size?` · ${item.size}`:""}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{fx(item.price)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>onQty(item.key,-1)} style={{width:22,height:22,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:13,color:"#4B5563",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>onQty(item.key,1)} style={{width:22,height:22,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:13,color:"#4B5563",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#1A1410",minWidth:60,textAlign:"right"}}>{fx(item.price*item.qty)}</div>
                  <button onClick={()=>onRemove(item.key)} style={{background:"transparent",border:"none",cursor:"pointer",color:"#D1D5DB",fontSize:14,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#EF4444"} onMouseLeave={e=>e.currentTarget.style.color="#D1D5DB"}>✕</button>
                </div>
              ))}
              <div style={{marginTop:12,padding:"12px 14px",background:"#FFF8F0",border:"1px solid #FDE8C0",borderRadius:10}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:"#92400E",marginBottom:7}}>🏷️ Code promo</div>
                {promoApplied?<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#059669"}}>✓ {promoApplied} — -{disc}% appliqué !</div>:
                  <div style={{display:"flex",gap:6}}>
                    <input value={promo} onChange={e=>setPromo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyPromo()} placeholder="Ex: ENCG2025" style={{flex:1,border:"1px solid #FDE8C0",borderRadius:7,padding:"6px 9px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff"}}/>
                    <button onClick={applyPromo} style={{background:"#92400E",border:"none",borderRadius:7,padding:"6px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>OK</button>
                  </div>}
              </div>
              <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563"}}><span>Sous-total</span><span>{fx(total)}</span></div>
                {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#059669"}}><span>Remise -{disc}%</span><span>-{fx(dAmt)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"2px solid #1A1410",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#1A1410",marginTop:4}}><span>Total estimé</span><span>{fx(total-dAmt)}</span></div>
                {total<500&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>💡 Encore {fx(500-total)} pour la livraison gratuite</div>}
              </div>
            </>
          )}
          {/* STEP 1 — Livraison */}
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["Nom complet","name","text","👤"],["Email","email","email","✉️"],["Téléphone","phone","tel","📱"],["Adresse","address","text","🏠"]].map(([label,field,type,ico])=>(
                <div key={field}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>{ico} {label}</div>
                  <input type={type} value={info[field]} onChange={e=>setInfo(p=>({...p,[field]:e.target.value}))} style={{width:"100%",border:`1px solid ${info[field]?"#1A1410":"#E5E7EB"}`,borderRadius:8,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",outline:"none",transition:"border-color .2s"}}/>
                </div>
              ))}
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>🏙️ Ville</div>
                <select value={info.city} onChange={e=>setInfo(p=>({...p,city:e.target.value}))} style={{width:"100%",border:"1px solid #1A1410",borderRadius:8,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",background:"#fff",outline:"none"}}>
                  {["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Meknès","Kénitra"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>🚚 Livraison — Portée mondiale · Slide 15</div>
                {[["standard","Standard","3–5 jours","Gratuite dès 500 MAD",30],["express","Express","24–48h","Priorité absolue",50]].map(([val,label,time,note,fee])=>(
                  <div key={val} onClick={()=>setInfo(p=>({...p,delivery:val}))} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",border:`1px solid ${info.delivery===val?"#1A1410":"#E5E7EB"}`,borderRadius:9,marginBottom:6,cursor:"pointer",background:info.delivery===val?"rgba(26,20,16,0.04)":"transparent",transition:"all .2s"}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${info.delivery===val?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{info.delivery===val&&<div style={{width:8,height:8,borderRadius:"50%",background:"#1A1410"}}/>}</div>
                    <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>{time} · {note}</div></div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:total>=500&&val==="standard"?"#059669":"#1A1410"}}>{total>=500&&val==="standard"?"Gratuite":`+${fee} MAD`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* STEP 2 — Paiement */}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:8}}>💳 Paiement — Standards Universels · Slide 16</div>
                {[["CMI","💳","Carte marocaine","TLS 1.3 + 3D Secure"],["Stripe","🌍","Carte internationale","PCI DSS Level 1"],["PayPal","🏧","Compte PayPal","Protection 180 jours"],["Cash","💵","Cash à la livraison","Paiement à réception"]].map(([val,ico,label,note])=>(
                  <div key={val} onClick={()=>setPayment(val)} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 13px",border:`1px solid ${payment===val?"#1A1410":"#E5E7EB"}`,borderRadius:9,marginBottom:6,cursor:"pointer",background:payment===val?"rgba(26,20,16,0.04)":"transparent",transition:"all .2s"}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ico}</span>
                    <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:"#1A1410"}}>{label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#6B7280"}}>{note}</div></div>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${payment===val?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{payment===val&&<div style={{width:8,height:8,borderRadius:"50%",background:"#1A1410"}}/>}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:11,color:"#374151",marginBottom:8}}>Récapitulatif</div>
                {cart.map(i=>(
                  <div key={i.key} style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563",marginBottom:4}}>
                    <span>{i.emoji} {i.name} ×{i.qty}</span><span style={{fontWeight:600}}>{fx(i.price*i.qty)}</span>
                  </div>
                ))}
                <div style={{borderTop:"1px solid #E5E7EB",marginTop:8,paddingTop:8,display:"flex",flexDirection:"column",gap:4}}>
                  {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#059669"}}><span>Remise {disc}%</span><span>-{fx(dAmt)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563"}}><span>Livraison</span><span>{dFee===0?"Gratuite":`+${dFee} MAD`}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#1A1410",paddingTop:4,borderTop:"1px solid #E5E7EB"}}><span>Total</span><span>{fx(finalTotal)}</span></div>
                </div>
              </div>
              <div style={{background:"#FFF8F0",border:"1px solid #FDE8C0",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.1em",marginBottom:3}}>⚡ SIMULATION X-RAY</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#92400E",lineHeight:1.6}}>En production : TLS 1.3 → Stripe tokenise → Webhook → DB → Email. Voir ◈ X-Ray.</div>
              </div>
            </div>
          )}
          {/* STEP 3 — Confirmation */}
          {step===3&&confirmed&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:60,marginBottom:10,animation:"checkPop .6s ease"}}>✅</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1A1410",marginBottom:4}}>Merci {confirmed.customer.name.split(" ")[0]} !</h3>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.gold,marginBottom:6}}>{confirmed.id}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B7280",marginBottom:14}}>Confirmation envoyée à {confirmed.customer.email}</div>
              <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFFBF5)",border:"1px solid #FDE8C0",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>⭐</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#92400E"}}>+{Math.round(confirmed.total/10)} points fidélité !</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#B45309"}}>Programme fidélité NouaSell</div>
                </div>
              </div>
              {/* Tracking */}
              <div style={{background:"#F9FAFB",border:"1px solid #F0EDE8",borderRadius:12,padding:"14px 16px",marginBottom:14,textAlign:"left"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:"#1A1410",marginBottom:12}}>📦 Suivi temps réel — Slide 94</div>
                {["Confirmée","En préparation","Expédiée","Livrée"].map((label,idx)=>{
                  const done=idx<=trackStep,active=idx===trackStep&&idx>0;
                  return (
                    <div key={label} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:idx<3?12:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:done?"#1A1410":"#E5E7EB",border:`2px solid ${done?"#1A1410":"#D1D5DB"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done?"#FAFAF7":"#9CA3AF",transition:"all .5s",boxShadow:active?"0 0 0 3px rgba(26,20,16,0.15)":"none"}}>{done?"✓":idx+1}</div>
                        {idx<3&&<div style={{width:2,height:16,background:done&&idx<trackStep?"#1A1410":"#E5E7EB",transition:"all .5s",marginTop:2}}/>}
                      </div>
                      <div style={{paddingTop:1}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:done?600:400,color:done?"#1A1410":"#9CA3AF",transition:"all .5s"}}>{label}</div>
                        {active&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.amber}}>⟳ En cours...</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {paying&&(
            <div style={{position:"absolute",inset:0,background:"rgba(250,250,247,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,zIndex:10}}>
              <div style={{width:60,height:60,border:`3px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:"#1A1410",fontWeight:600}}>Traitement du paiement...</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>🔒 Connexion TLS 1.3 sécurisée</div>
            </div>
          )}
        </div>
        {/* Actions bas */}
        <div style={{padding:"12px 18px",borderTop:"1px solid #E5E7EB",background:C.cream,flexShrink:0}}>
          {step===0&&cart.length>0&&<button onClick={()=>setStep(1)} style={{width:"100%",background:C.dark,border:"none",borderRadius:10,padding:"12px",color:"#FAFAF7",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#2C1F0E"} onMouseLeave={e=>e.currentTarget.style.background=C.dark}>Continuer — {fx(total)} →</button>}
          {step===1&&<div style={{display:"flex",gap:7}}>
            <button onClick={()=>setStep(0)} style={{flex:1,background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← Retour</button>
            <button onClick={()=>setStep(2)} disabled={!info.name||!info.email||!info.address} style={{flex:2,background:info.name&&info.email&&info.address?C.dark:"#E5E7EB",border:"none",borderRadius:10,padding:"11px",color:info.name&&info.email&&info.address?"#FAFAF7":"#9CA3AF",fontSize:12,fontWeight:700,cursor:info.name&&info.email&&info.address?"pointer":"not-allowed",fontFamily:"'Outfit',sans-serif",transition:"all .3s"}}>Choisir paiement →</button>
          </div>}
          {step===2&&<div style={{display:"flex",gap:7}}>
            <button onClick={()=>setStep(1)} style={{flex:1,background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← Retour</button>
            <button onClick={handlePay} style={{flex:2,background:C.dark,border:"none",borderRadius:10,padding:"11px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔒 Payer {fx(finalTotal)}</button>
          </div>}
          {step===3&&<button onClick={onClose} style={{width:"100%",background:"transparent",border:"1px solid #E5E7EB",borderRadius:10,padding:"11px",color:"#4B5563",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Continuer mes achats</button>}
        </div>
      </div>
    </div>
  );
}

/* ══ ADMIN VIEW ══════════════════════════════════════════════ */
function AdminView({orders,setOrders,products,loyaltyPts}) {
  const [tab,setTab]=useState("overview");
  const totalRev=orders.reduce((s,o)=>s+o.total,0);
  const SC={"En attente":C.amber,"En traitement":C.cyan,"Expédiée":C.violet,"Livrée":C.green};
  const FLOW=["En attente","En traitement","Expédiée","Livrée"];
  const advance=id=>setOrders(p=>p.map(o=>{if(o.id!==id)return o;const i=FLOW.indexOf(o.status);return{...o,status:i<FLOW.length-1?FLOW[i+1]:o.status};}));

  const ANALYTICS=[
    {d:"Lun",r:8400,o:12},{d:"Mar",r:14200,o:18},{d:"Mer",r:6300,o:9},
    {d:"Jeu",r:19800,o:24},{d:"Ven",r:26500,o:31},{d:"Sam",r:23100,o:28},{d:"Dim",r:12400,o:15},
  ];
  const mxR=Math.max(...ANALYTICS.map(a=>a.r));

  const TABS=[["overview","📊","Tableau de bord"],["orders","📋","Commandes"],["products","📦","Produits"],["analytics","📈","Analytics"],["reviews","⭐","Avis clients"]];

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{width:175,background:C.s1,borderRight:`1px solid ${C.b}`,padding:"14px 0",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0 14px",marginBottom:12}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.15em"}}>BACK-OFFICE</div></div>
        {TABS.map(([id,ico,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{width:"100%",background:tab===id?C.s2:"transparent",border:"none",borderLeft:`2px solid ${tab===id?C.cyan:"transparent"}`,padding:"9px 14px",color:tab===id?C.text:C.sub,cursor:"pointer",textAlign:"left",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?600:400,display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}>{ico} {label}</button>
        ))}
        {loyaltyPts>0&&<div style={{margin:"auto 0 14px",padding:"0 14px"}}>
          <div style={{background:`${C.gold}15`,border:`1px solid ${C.gold}33`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:3}}>⭐</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.gold,fontWeight:700}}>{loyaltyPts} pts</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim}}>Fidélité clients</div>
          </div>
        </div>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>
        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Tableau de bord</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 108 · KPIs temps réel</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[{l:"Commandes",v:orders.length,i:"📋",c:C.cyan},{l:"Revenus",v:`${totalRev.toLocaleString()} MAD`,i:"💰",c:C.green},{l:"Produits",v:products.length,i:"📦",c:C.amber},{l:"Livrées",v:orders.filter(o=>o.status==="Livrée").length,i:"✅",c:C.violet}].map(k=>(
                <div key={k.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"14px 15px",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${k.c}44`;e.currentTarget.style.boxShadow=`0 4px 16px ${k.c}22`;}}
                  onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.b}`;e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{k.l}</div><span style={{fontSize:16}}>{k.i}</span>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:k.c}}>{k.v}</div>
                </div>
              ))}
            </div>
            {orders.length===0
              ?<div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>🛒</div>Passez une commande depuis la Boutique !</div>
              :<div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.b}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text}}>Commandes récentes</div>
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:`1px solid ${C.b}44`,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.s2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.cyan,minWidth:85}}>{o.id}</div>
                    <div style={{flex:1,fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{o.customer?.name||"—"}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                    <div style={{background:`${SC[o.status]||C.sub}20`,border:`1px solid ${SC[o.status]||C.sub}44`,borderRadius:4,padding:"1px 7px",fontSize:9,color:SC[o.status]||C.sub,fontFamily:"'JetBrains Mono',monospace"}}>{o.status}</div>
                  </div>
                ))}
              </div>}
          </div>
        )}
        {/* ORDERS */}
        {tab==="orders"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Commandes — O2C</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 86 · Order to Cash</div>
            {orders.length===0
              ?<div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>🛒</div>Passez une commande depuis la Boutique !</div>
              :orders.map(o=>(
                <div key={o.id} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:14,marginBottom:10,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.border=`1px solid ${C.b2}`} onMouseLeave={e=>e.currentTarget.style.border=`1px solid ${C.b}`}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.cyan,marginBottom:2}}>{o.id}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text,fontWeight:600}}>{o.customer?.name} · {o.customer?.city}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{o.date} · {o.customer?.payment}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                      {o.discount>0&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.green}}>Code -{o.discount}%</div>}
                      <div style={{background:`${SC[o.status]}20`,border:`1px solid ${SC[o.status]}44`,borderRadius:5,padding:"2px 8px",fontSize:9,color:SC[o.status],fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:10}}>{FLOW.map((s,i)=>{const cur=FLOW.indexOf(o.status);return<div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=cur?SC[s]:C.b,transition:"all .5s"}}/>;})}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                    {o.status!=="Livrée"&&<button onClick={()=>advance(o.id)} style={{background:`${C.green}15`,border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 11px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=`${C.green}25`} onMouseLeave={e=>e.currentTarget.style.background=`${C.green}15`}>▶ → {FLOW[Math.min(FLOW.indexOf(o.status)+1,3)]}</button>}
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>📦 {o.items.length} art. · {o.items.map(i=>i.emoji).join(" ")}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* PRODUCTS */}
        {tab==="products"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Catalogue Produits</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 69 · Table products en PostgreSQL</div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
                <thead><tr style={{background:C.bg}}>{["Produit","Cat.","Prix MAD","Stock","Note","Statut"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,color:C.dim,letterSpacing:"0.1em",fontWeight:700,borderBottom:`1px solid ${C.b}`}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>{products.map(p=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.b}44`,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.s2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{p.emoji}</span><span style={{fontWeight:600,color:C.text}}>{p.name}</span></div></td>
                    <td style={{padding:"9px 12px",color:C.sub,fontSize:10}}>{p.cat}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:C.amber,fontWeight:600,fontSize:11}}>{p.price.toLocaleString()}</td>
                    <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:p.stock<5?C.red:p.stock<20?C.amber:C.green,fontSize:11,fontWeight:700}}>{p.stock}</span></td>
                    <td style={{padding:"9px 12px"}}><span style={{color:C.gold,fontSize:11}}>{"★".repeat(Math.floor(p.rating))}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub,marginLeft:3}}>{p.rating}</span></td>
                    <td style={{padding:"9px 12px"}}><span style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"1px 7px",fontSize:9,color:C.green}}>actif</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        {/* ANALYTICS */}
        {tab==="analytics"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Analytics</h2>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.cyan,background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:4,padding:"2px 7px"}}>📊 Densité d'info · Slide 20</span>
            </div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>KPIs temps réel pour décisions stratégiques</div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:14,padding:18,marginBottom:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:14}}>REVENUS HEBDOMADAIRES (MAD)</div>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
                {ANALYTICS.map((a,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.green}}>{(a.r/1000).toFixed(1)}k</div>
                    <div style={{width:"100%",background:C.green,borderRadius:"3px 3px 0 0",height:`${(a.r/mxR)*90}px`,minHeight:4,transition:"height .8s ease",boxShadow:`0 0 8px ${C.green}33`}}/>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{a.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
              {[{l:"Taux de conversion",v:"3.4%",t:"↑ +0.8%",c:C.green,d:"Visiteurs → Acheteurs"},{l:"Panier moyen",v:"847 MAD",t:"↑ +12%",c:C.amber,d:"Par commande"},{l:"Taux de rebond",v:"38%",t:"↓ -5%",c:C.cyan,d:"Pages / session"}].map(m=>(
                <div key={m.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"13px 15px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:5}}>{m.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:m.c,marginBottom:2}}>{m.v}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green,marginBottom:3}}>{m.t}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim}}>{m.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* REVIEWS */}
        {tab==="reviews"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Modération des Avis</h2>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#4ADE80",background:"#4ADE8015",border:"1px solid #4ADE8033",borderRadius:4,padding:"2px 7px"}}>👥 Tech. Sociale · Slide 21</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
              {[{l:"Total",v:PRODUCTS.reduce((s,p)=>s+p.reviews.length,0),c:C.cyan},{l:"Vérifiés",v:PRODUCTS.reduce((s,p)=>s+p.reviews.filter(r=>r.v).length,0),c:C.green},{l:"Note moy.",v:(PRODUCTS.reduce((s,p)=>s+p.rating,0)/PRODUCTS.length).toFixed(1)+"★",c:C.amber}].map(m=>(
                <div key={m.l} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"14px 16px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:6}}>{m.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:m.c}}>{m.v}</div>
                </div>
              ))}
            </div>
            {PRODUCTS.flatMap(p=>p.reviews.map(r=>({...r,product:p.name,emoji:p.emoji}))).map((r,i)=>(
              <div key={i} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`${C.gold}22`,border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.gold,flexShrink:0}}>{r.n[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{r.n}</span>
                      <span style={{color:C.amber,fontSize:11}}>{"★".repeat(r.s)}</span>
                      {r.v&&<span style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"1px 5px",fontSize:8,color:C.green,fontWeight:600}}>✓ Vérifié</span>}
                      <span style={{marginLeft:"auto",fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{r.emoji} {r.product}</span>
                    </div>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6,marginBottom:8}}>{r.t}</p>
                    <div style={{display:"flex",gap:6}}>
                      {[["✓ Approuver",C.green],["✕ Masquer",C.red],["↩ Répondre",C.cyan]].map(([label,color])=>(
                        <button key={label} style={{background:`${color}15`,border:`1px solid ${color}33`,borderRadius:5,padding:"3px 10px",fontSize:9,color,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>{label}</button>
                      ))}
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

/* ══ XRAY VIEW — 10 vues académiques complètes ══════════════ */
function XRayView() {
  const [view,setView]=useState("architecture");
  const [activeNode,setActiveNode]=useState(null);
  const [activeCarac,setActiveCarac]=useState(null);
  const [payStep,setPayStep]=useState(-1);

  useEffect(()=>{
    if(view==="payment"){
      setPayStep(-1);
      const t=setInterval(()=>setPayStep(p=>{if(p>=PAYMENT_STEPS.length-1){clearInterval(t);return p;}return p+1;}),900);
      return()=>clearInterval(t);
    }
  },[view]);

  const VIEWS=[
    {id:"architecture",icon:"🏗️",label:"Architecture"},
    {id:"characteristics",icon:"⭐",label:"8 Caractéristiques"},
    {id:"payment",icon:"💳",label:"Flux O2C"},
    {id:"database",icon:"🗄️",label:"Base de données"},
    {id:"security",icon:"🛡️",label:"Sécurité"},
    {id:"revenue",icon:"💰",label:"Modèles de revenus"},
    {id:"competitive",icon:"🏢",label:"Analyse concurrentielle"},
    {id:"rgpd",icon:"📜",label:"RGPD & Droit"},
    {id:"logistics",icon:"🚚",label:"Logistique"},
    {id:"kpis",icon:"📊",label:"KPIs e-commerce"},
  ];

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden",background:C.bg}}>
      {/* Sidebar vues */}
      <div style={{width:170,background:C.s1,borderRight:`1px solid ${C.b}`,padding:"14px 0",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"0 12px",marginBottom:10}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim,letterSpacing:"0.15em"}}>◈ X-RAY MODE</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim,marginTop:3}}>Slides 14–125</div>
        </div>
        {VIEWS.map(v=>(
          <button key={v.id} onClick={()=>setView(v.id)} style={{width:"100%",background:view===v.id?C.s2:"transparent",border:"none",borderLeft:`2px solid ${view===v.id?C.cyan:"transparent"}`,padding:"8px 12px",color:view===v.id?C.text:C.sub,cursor:"pointer",textAlign:"left",fontSize:10,fontFamily:"'Outfit',sans-serif",fontWeight:view===v.id?700:400,display:"flex",alignItems:"center",gap:7,transition:"all .2s"}}
            onMouseEnter={e=>{if(view!==v.id)e.currentTarget.style.background=C.s2+"88";}}
            onMouseLeave={e=>{if(view!==v.id)e.currentTarget.style.background="transparent";}}>
            <span style={{fontSize:13}}>{v.icon}</span>{v.label}
          </button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>

        {/* ── ARCHITECTURE ── */}
        {view==="architecture"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Architecture NouaSell</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 56–108 · Cliquez sur un nœud pour voir le code</div>
            </div>
            {LAYERS.map(layer=>(
              <div key={layer.id} style={{marginBottom:16}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:layer.color,letterSpacing:"0.18em",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{height:1,width:20,background:layer.color,opacity:.5}}/>
                  {layer.label}
                  <div style={{flex:1,height:1,background:layer.color,opacity:.2}}/>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {layer.nodes.map(node=>(
                    <div key={node.id} onClick={()=>setActiveNode(activeNode?.id===node.id?null:node)}
                      style={{background:activeNode?.id===node.id?C.s3:C.s2,border:`1px solid ${activeNode?.id===node.id?layer.color:C.b}`,borderRadius:10,padding:"11px 14px",cursor:"pointer",minWidth:145,flex:1,maxWidth:200,transition:"all .25s",boxShadow:activeNode?.id===node.id?`0 4px 16px ${layer.color}25`:"none"}}
                      onMouseEnter={e=>{if(activeNode?.id!==node.id){e.currentTarget.style.border=`1px solid ${layer.color}66`;}}}
                      onMouseLeave={e=>{if(activeNode?.id!==node.id){e.currentTarget.style.border=`1px solid ${C.b}`;}}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <span style={{fontSize:18}}>{node.icon}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:layer.color,background:`${layer.color}15`,borderRadius:3,padding:"1px 5px"}}>{node.course.split("·")[0].trim()}</span>
                      </div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:C.text,marginBottom:2}}>{node.label}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{node.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {activeNode&&(
              <div className="fu" style={{background:C.s1,border:`1px solid ${C.b2}`,borderRadius:14,padding:18,marginTop:16}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:22}}>{activeNode.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:C.text}}>{activeNode.label}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.cyan}}>{activeNode.course}</div>
                  </div>
                  <button onClick={()=>setActiveNode(null)} style={{marginLeft:"auto",background:`${C.red}15`,border:`1px solid ${C.red}33`,borderRadius:6,padding:"4px 10px",color:C.red,cursor:"pointer",fontSize:11}}>✕ Fermer</button>
                </div>
                <pre style={{background:C.bg,border:`1px solid ${C.b}`,borderRadius:8,padding:"12px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.green,lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>{activeNode.code}</pre>
              </div>
            )}
          </div>
        )}

        {/* ── 8 CARACTÉRISTIQUES ── */}
        {view==="characteristics"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>8 Caractéristiques du E-commerce</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Laudon & Traver · Slides 14–21 · Cliquez pour le code</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {CARAC.map(c=>(
                <div key={c.id} onClick={()=>setActiveCarac(activeCarac?.id===c.id?null:c)}
                  style={{background:activeCarac?.id===c.id?C.s2:C.s1,border:`1px solid ${activeCarac?.id===c.id?c.color:C.b}`,borderRadius:13,padding:"14px 16px",cursor:"pointer",transition:"all .25s",boxShadow:activeCarac?.id===c.id?`0 6px 20px ${c.color}22`:"none"}}
                  onMouseEnter={e=>{if(activeCarac?.id!==c.id){e.currentTarget.style.border=`1px solid ${c.color}55`;}}}
                  onMouseLeave={e=>{if(activeCarac?.id!==c.id){e.currentTarget.style.border=`1px solid ${C.b}`;}}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontSize:22}}>{c.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{c.label}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:c.color}}>{c.slide}</div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim}}>{activeCarac?.id===c.id?"▲":"▼"}</div>
                  </div>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6,marginBottom:6}}>{c.def}</p>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:c.color,background:`${c.color}10`,border:`1px solid ${c.color}22`,borderRadius:5,padding:"3px 8px",display:"inline-block"}}>{c.where}</div>
                  {activeCarac?.id===c.id&&(
                    <div style={{marginTop:12}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.amber,fontWeight:600,marginBottom:6}}>🛍 Dans NouaSell :</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text,lineHeight:1.6,marginBottom:10}}>{c.nouasell}</div>
                      <pre style={{background:C.bg,border:`1px solid ${C.b}`,borderRadius:8,padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.green,lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>{c.code}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FLUX PAIEMENT O2C ── */}
        {view==="payment"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Flux O2C — Order to Cash</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 81–101 · Animation temps réel</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
              {PAYMENT_STEPS.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:i<=payStep?`${s.color}20`:C.s2,border:`2px solid ${i<=payStep?s.color:C.b}`,borderRadius:12,padding:"12px 14px",textAlign:"center",minWidth:90,transition:"all .5s",boxShadow:i===payStep?`0 0 20px ${s.color}44`:"none",transform:i===payStep?"scale(1.08)":"scale(1)"}}>
                    <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:i<=payStep?C.text:C.sub,fontWeight:i===payStep?700:400,whiteSpace:"pre-line",lineHeight:1.3,marginBottom:3}}>{s.label}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:i<=payStep?s.color:C.dim}}>{s.sub}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.dim,marginTop:3}}>{s.slide}</div>
                    {i===payStep&&<div style={{width:8,height:8,borderRadius:"50%",background:s.color,margin:"6px auto 0",animation:"pulseGlow 1s ease infinite",boxShadow:`0 0 8px ${s.color}`}}/>}
                  </div>
                  {i<PAYMENT_STEPS.length-1&&<div style={{width:16,height:2,background:i<payStep?C.green:C.b,transition:"background .5s",flexShrink:0}}/>}
                </div>
              ))}
            </div>
            <button onClick={()=>{setPayStep(-1);setTimeout(()=>{const t=setInterval(()=>setPayStep(p=>{if(p>=PAYMENT_STEPS.length-1){clearInterval(t);return p;}return p+1;}),900);},100);}} style={{background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:8,padding:"8px 18px",color:C.cyan,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:700,marginBottom:16}}>↺ Rejouer l'animation</button>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub,letterSpacing:"0.1em",marginBottom:10}}>CODE — ÉTAPE 4 · STRIPE TOKENISATION</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.green,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{`// Côté client — Stripe.js\nconst {paymentMethod} = await stripe.createPaymentMethod({\n  type: 'card',\n  card: cardElement  // ← données bancaires JAMAIS envoyées à NouaSell\n})\n\n// Côté serveur — confirmation\nconst intent = await stripe.paymentIntents.confirm(\n  paymentIntentId,\n  { payment_method: paymentMethod.id }\n)\n\n// Webhook Stripe → NouaSell\nif (intent.status === 'succeeded') {\n  await db.orders.update({ status: 'paid' })\n  await sendConfirmationEmail(order)\n}`}</pre>
            </div>
          </div>
        )}

        {/* ── BASE DE DONNÉES ── */}
        {view==="database"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Schéma Base de Données</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 69 · PostgreSQL + Supabase · 5 tables liées</div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {DB_TABLES.map(t=>(
                <div key={t.name} style={{background:C.s1,border:`1px solid ${t.color}33`,borderRadius:12,overflow:"hidden",flex:"1 1 170px",maxWidth:220}}>
                  <div style={{background:`${t.color}15`,padding:"8px 12px",borderBottom:`1px solid ${t.color}33`}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:12,color:t.color}}>📋 {t.name}</div>
                  </div>
                  <div style={{padding:"8px 0"}}>
                    {t.fields.map(([fname,ftype])=>(
                      <div key={fname} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 12px",borderBottom:`1px solid ${C.b}44`}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.text,fontWeight:ftype.includes("🔑")?700:400}}>{fname}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:ftype.includes("FK")?t.color:C.sub}}>{ftype}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:"14px 16px",marginTop:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub,letterSpacing:"0.1em",marginBottom:8}}>SQL — REQUÊTE COMPLEXE AVEC JOINTURES</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.green,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{`SELECT\n  o.id,\n  p.name as customer,\n  oi.qty,\n  pr.name as product,\n  pr.price * oi.qty as subtotal\nFROM orders o\nJOIN profiles p ON o.user_id = p.id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products pr ON oi.product_id = pr.id\nWHERE o.status = 'paid'\nORDER BY o.created_at DESC;`}</pre>
            </div>
          </div>
        )}

        {/* ── SÉCURITÉ ── */}
        {view==="security"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Sécurité multicouche</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 74–78 · 5 niveaux de protection</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:700}}>
              {SEC_LAYERS.map((l,i)=>(
                <div key={l.level} className="fu" style={{background:C.s1,border:`1px solid ${l.color}33`,borderRadius:12,padding:"14px 18px",display:"flex",gap:14,alignItems:"center",animation:`fadeUp .3s ease ${i*.08}s both`}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`${l.color}15`,border:`1px solid ${l.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:16,color:l.color,flexShrink:0}}>{l.level}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{l.label}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:l.color,background:`${l.color}10`,borderRadius:3,padding:"1px 5px"}}>{l.course}</span>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:4}}>{l.desc}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:l.color}}>{l.tech}</div>
                  </div>
                  <div style={{width:8,height:8,borderRadius:"50%",background:l.color,boxShadow:`0 0 8px ${l.color}`,flexShrink:0,animation:"pulseGlow 2s ease infinite"}}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODÈLES DE REVENUS ── */}
        {view==="revenue"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Modèles de Revenus E-commerce</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 35–42 · 5 sources de revenus NouaSell</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
              {REVENUE_MODELS.map(m=>(
                <div key={m.id} style={{background:C.s1,border:`1px solid ${m.color}33`,borderRadius:14,padding:"16px 18px",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${m.color}66`;e.currentTarget.style.boxShadow=`0 6px 20px ${m.color}20`;}}
                  onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${m.color}33`;e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:24}}>{m.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text,marginBottom:2}}>{m.label}</div>
                      <div style={{display:"flex",gap:6}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:m.color,background:`${m.color}10`,borderRadius:3,padding:"1px 5px"}}>{m.slide}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,background:`${C.amber}10`,borderRadius:3,padding:"1px 5px"}}>{m.pct}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6,marginBottom:8}}>{m.desc}</p>
                  <div style={{background:`${m.color}10`,border:`1px solid ${m.color}22`,borderRadius:7,padding:"6px 10px",marginBottom:10}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:m.color,letterSpacing:"0.08em",marginBottom:2}}>EXEMPLE CONCRET</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{m.ex}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.green,letterSpacing:"0.1em",marginBottom:4}}>✓ AVANTAGES</div>
                      {m.avantages.map((a,i)=><div key={i} style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:2,paddingLeft:8,borderLeft:`2px solid ${C.green}44`}}>· {a}</div>)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.red,letterSpacing:"0.1em",marginBottom:4}}>✗ LIMITES</div>
                      {m.limites.map((l,i)=><div key={i} style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:2,paddingLeft:8,borderLeft:`2px solid ${C.red}44`}}>· {l}</div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYSE CONCURRENTIELLE ── */}
        {view==="competitive"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Analyse Concurrentielle</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 51–55 · Positionnement marché marocain</div>
            </div>
            <div style={{overflowX:"auto",marginBottom:16}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:11}}>
                <thead>
                  <tr style={{background:C.s1}}>
                    {["Acteur","Type","Modèle","Avantage","Limite","Part marché","Note"].map(h=>(
                      <th key={h} style={{padding:"10px 12px",textAlign:"left",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim,letterSpacing:"0.1em",borderBottom:`1px solid ${C.b}`,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((c,i)=>(
                    <tr key={c.name} style={{borderBottom:`1px solid ${C.b}44`,background:c.name==="NouaSell"?`${C.gold}08`:"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=C.s2} onMouseLeave={e=>e.currentTarget.style.background=c.name==="NouaSell"?`${C.gold}08`:"transparent"}>
                      <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{c.emoji}</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:c.color,fontSize:12}}>{c.name}</span>{c.name==="NouaSell"&&<span style={{background:`${C.gold}20`,border:`1px solid ${C.gold}44`,borderRadius:3,padding:"1px 5px",fontSize:8,color:C.gold}}>NOUS</span>}</div></td>
                      <td style={{padding:"10px 12px",color:C.sub,fontSize:10,maxWidth:130}}>{c.type}</td>
                      <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:c.color,background:`${c.color}10`,borderRadius:4,padding:"2px 6px"}}>{c.modele}</span></td>
                      <td style={{padding:"10px 12px",color:C.text,fontSize:10,maxWidth:150}}>{c.force}</td>
                      <td style={{padding:"10px 12px",color:C.sub,fontSize:10,maxWidth:130}}>{c.faiblesse}</td>
                      <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:c.name==="NouaSell"?C.gold:C.text}}>{c.part}</span></td>
                      <td style={{padding:"10px 12px"}}><span style={{color:"#FFD700",fontSize:11}}>{"★".repeat(Math.round(Number(c.note)))}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub,marginLeft:3}}>{c.note}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:"14px 18px"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,letterSpacing:"0.12em",marginBottom:10}}>🎯 STRATÉGIE NOUASELL — PORTER DIGITAL · SLIDE 55</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{t:"Différenciation",d:"Authenticité certifiée + artisans vérifiés = niche haut de gamme que ni Amazon ni Jumia ne peut dupliquer.",c:C.gold},{t:"Barrières à l'entrée",d:"Réseau de 340 artisans certifiés. Capital relationnel impossible à reproduire rapidement pour un concurrent.",c:C.cyan},{t:"Objectif 2026",d:"Atteindre 10% part de marché artisanat en ligne au Maroc en 18 mois via croissance organique et SEO.",c:C.green}].map(s=>(
                  <div key={s.t} style={{background:`${s.c}08`,border:`1px solid ${s.c}22`,borderRadius:9,padding:"12px 13px"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:s.c,marginBottom:5}}>{s.t}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6}}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RGPD & DROIT ── */}
        {view==="rgpd"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>RGPD & Cadre Juridique</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 113–125 · 7 articles clés implémentés</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {RGPD.map((r,i)=>(
                <div key={r.art} className="fu" style={{background:C.s1,border:`1px solid ${r.color}33`,borderRadius:12,padding:"14px 18px",display:"grid",gridTemplateColumns:"100px 1fr 1fr",gap:14,alignItems:"start",animation:`fadeUp .3s ease ${i*.06}s both`}}>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color:r.color,marginBottom:3}}>{r.art}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.dim}}>{r.slide}</div>
                    <div style={{width:8,height:8,borderRadius:"50%",background:r.color,boxShadow:`0 0 6px ${r.color}`,marginTop:6}}/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text,marginBottom:4}}>{r.title}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,lineHeight:1.6}}>{r.req}</div>
                  </div>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:r.color,letterSpacing:"0.1em",marginBottom:4}}>✓ IMPL. NOUASELL</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.text,lineHeight:1.6,background:`${r.color}08`,border:`1px solid ${r.color}15`,borderRadius:6,padding:"6px 8px"}}>{r.impl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LOGISTIQUE ── */}
        {view==="logistics"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Logistique & Fulfilment</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 89–97 · Chaîne complète de la commande à la livraison</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:700}}>
              {LOGISTIQUE.map((step,i)=>(
                <div key={i} className="fu" style={{display:"flex",gap:14,alignItems:"flex-start",animation:`fadeUp .3s ease ${i*.07}s both`}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${step.color}15`,border:`2px solid ${step.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{step.icon}</div>
                    {i<LOGISTIQUE.length-1&&<div style={{width:2,height:24,background:`${step.color}33`,marginTop:4}}/>}
                  </div>
                  <div style={{flex:1,background:C.s1,border:`1px solid ${step.color}22`,borderRadius:12,padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{step.label}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:step.color,background:`${step.color}10`,borderRadius:3,padding:"1px 5px"}}>{step.slide}</span>
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:step.color,marginBottom:4}}>{step.sub}</div>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,lineHeight:1.6}}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KPIs E-COMMERCE ── */}
        {view==="kpis"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>KPIs & Métriques E-commerce</h2>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 98–112 · Indicateurs de performance avec formules</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {[
                {name:"CAC — Coût Acquisition Client",formula:"Budget Marketing ÷ Nb nouveaux clients",val:"87 MAD",ref:"<150 MAD = bon",color:C.cyan,slide:"Slide 99",desc:"Coût moyen pour acquérir un nouveau client. À comparer avec LTV pour évaluer la rentabilité."},
                {name:"LTV — Lifetime Value",formula:"Panier moyen × Fréquence × Durée fidélité",val:"2 340 MAD",ref:"LTV/CAC > 3 = sain",color:C.green,slide:"Slide 100",desc:"Valeur totale générée par un client sur toute sa relation avec NouaSell."},
                {name:"Taux de conversion",formula:"(Commandes ÷ Visiteurs) × 100",val:"3.4%",ref:"2–4% = industrie",color:C.amber,slide:"Slide 103",desc:"% de visiteurs qui effectuent un achat. Indicateur clé de l'efficacité UX."},
                {name:"Taux de rétention",formula:"((Clients fin - Nouveaux) ÷ Clients début) × 100",val:"68%",ref:">60% = excellent",color:C.violet,slide:"Slide 104",desc:"% de clients qui reviennent acheter. Indicateur de satisfaction et fidélisation."},
                {name:"Panier moyen (AOV)",formula:"Revenu total ÷ Nombre de commandes",val:"847 MAD",ref:"Objectif : 1 000 MAD",color:C.gold,slide:"Slide 105",desc:"Valeur moyenne par commande. Améliorer via upsell et cross-sell."},
                {name:"ROI Marketing",formula:"((Revenu - Coût) ÷ Coût) × 100",val:"285%",ref:">100% = rentable",color:"#34D399",slide:"Slide 110",desc:"Retour sur investissement des dépenses marketing. NouaSell génère 2.85 MAD pour chaque MAD investi."},
              ].map(kpi=>(
                <div key={kpi.name} style={{background:C.s1,border:`1px solid ${kpi.color}33`,borderRadius:14,padding:"16px 18px",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${kpi.color}66`;e.currentTarget.style.boxShadow=`0 6px 20px ${kpi.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${kpi.color}33`;e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text,flex:1,lineHeight:1.4}}>{kpi.name}</div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:kpi.color,background:`${kpi.color}10`,borderRadius:3,padding:"1px 5px",flexShrink:0,marginLeft:6}}>{kpi.slide}</span>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:kpi.color,marginBottom:6}}>{kpi.val}</div>
                  <div style={{background:`${kpi.color}08`,border:`1px solid ${kpi.color}15`,borderRadius:7,padding:"5px 9px",marginBottom:8}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:kpi.color,letterSpacing:"0.06em"}}>FORMULE</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.text,marginTop:2}}>{kpi.formula}</div>
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,lineHeight:1.5,marginBottom:6}}>{kpi.desc}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green}}>✓ Ref : {kpi.ref}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ══ MAIN APP ════════════════════════════════════════════════ */
export default function App() {
  const [mode,setMode]=useState("store");
  const [storeTab,setStoreTab]=useState("shop");
  const [cart,setCart]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [orders,setOrders]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const [cartBounce,setCartBounce]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [currency,setCurrency]=useState("MAD");
  const [toasts,setToasts]=useState([]);
  const [loyaltyPts,setLoyaltyPts]=useState(0);
  const [user]=useState({name:"Yassine El Fassi",email:"yassine@encg.ma",city:"Kénitra",since:"Jan 2025"});

  const toast=useCallback((msg,type="success",icon="✓")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type,icon,leaving:false}]);
    setTimeout(()=>setToasts(p=>p.map(t=>t.id===id?{...t,leaving:true}:t)),2500);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),2900);
  },[]);

  const fx=useCallback((p,cur=currency)=>{
    const v=(p*RATES[cur]).toFixed(cur==="MAD"?0:2);
    return `${Number(v).toLocaleString()} ${SYM[cur]}`;
  },[currency]);

  const addToCart=useCallback((product,opts={})=>{
    const key=`${product.id}-${opts.color||""}-${opts.size||""}`;
    setCart(prev=>{const ex=prev.find(i=>i.key===key);return ex?prev.map(i=>i.key===key?{...i,qty:i.qty+1}:i):[...prev,{...product,...opts,key,qty:1}];});
    setCartBounce(true);setTimeout(()=>setCartBounce(false),600);
    toast(`${product.emoji} ${product.name} ajouté !`,"success","🛒");
  },[toast]);

  const removeFromCart=k=>setCart(p=>p.filter(i=>i.key!==k));
  const updateQty=(k,d)=>setCart(p=>p.map(i=>i.key===k?{...i,qty:Math.max(1,i.qty+d)}:i));
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const toggleWishlist=p=>{
    const has=wishlist.find(x=>x.id===p.id);
    setWishlist(prev=>has?prev.filter(x=>x.id!==p.id):[...prev,p]);
    toast(has?`${p.emoji} Retiré des favoris`:`${p.emoji} Ajouté aux favoris !`,has?"info":"success",has?"🤍":"❤️");
  };

  const placeOrder=(info,disc=0)=>{
    const dAmt=Math.round(cartTotal*disc/100);
    const dFee=info.delivery==="express"?50:cartTotal>=500?0:30;
    const total=cartTotal-dAmt+dFee;
    const pts=Math.round(total/10);
    const order={id:`CMD-${Date.now().toString().slice(-5)}`,items:[...cart],total,discount:disc,customer:info,status:"En attente",date:new Date().toLocaleString("fr-FR")};
    setOrders(p=>[order,...p]);
    setLoyaltyPts(p=>p+pts);
    setCart([]);setCartOpen(false);
    toast(`Commande ${order.id} confirmée ! +${pts} pts 🎉`,"success","✅");
    return order;
  };

  const MODES=[{id:"store",icon:"🛍",label:"Boutique"},{id:"admin",icon:"⚙️",label:"Admin"},{id:"xray",icon:"◈",label:"X-Ray"}];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}}>
      <style>{CSS}</style>
      <ToastContainer toasts={toasts}/>
      {/* TOP BAR */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.b}`,padding:"0 18px",display:"flex",alignItems:"center",gap:10,height:48,flexShrink:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginRight:6}}>
          <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${C.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#fff"}}>N</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:C.text}}>NouaSell</span>
        </div>
        <div style={{display:"flex",gap:2,background:C.s2,borderRadius:9,padding:2,border:`1px solid ${C.b}`}}>
          {MODES.map(m=>(
            <button key={m.id} onClick={()=>{setMode(m.id);setStoreTab("shop");}} style={{background:mode===m.id?C.s3:"transparent",border:`1px solid ${mode===m.id?C.b2:"transparent"}`,borderRadius:7,padding:"4px 11px",color:mode===m.id?C.text:C.sub,fontSize:11,cursor:"pointer",fontWeight:600,transition:"all .2s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:4}}>{m.icon} {m.label}</button>
          ))}
        </div>
        {loyaltyPts>0&&<div style={{background:`${C.gold}20`,border:`1px solid ${C.gold}44`,borderRadius:6,padding:"2px 8px",fontSize:9,color:C.gold,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>⭐ {loyaltyPts} pts</div>}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {mode==="store"&&(
            <>
              <div style={{display:"flex",gap:2,background:C.s2,borderRadius:6,padding:2,border:`1px solid ${C.b}`}}>
                {["MAD","EUR","USD","GBP"].map(cur=>(
                  <button key={cur} onClick={()=>setCurrency(cur)} style={{background:currency===cur?`${C.gold}33`:"transparent",border:"none",borderRadius:4,padding:"3px 6px",color:currency===cur?C.gold:C.dim,fontSize:9,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,transition:"all .2s"}}>{cur}</button>
                ))}
              </div>
              <button onClick={()=>setStoreTab("wishlist")} style={{background:wishlist.length>0?`${C.pink}15`:"transparent",border:`1px solid ${wishlist.length>0?C.pink:C.b}`,borderRadius:7,padding:"5px 9px",color:wishlist.length>0?C.pink:C.sub,cursor:"pointer",fontSize:11,transition:"all .2s",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>❤️{wishlist.length>0&&` ${wishlist.length}`}</button>
              <button onClick={()=>setStoreTab("profile")} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:7,padding:"5px 9px",color:C.sub,cursor:"pointer",fontSize:11,transition:"all .2s"}}>👤</button>
            </>
          )}
          <div style={{overflow:"hidden",width:160,background:C.s2,borderRadius:6,border:`1px solid ${C.b}`,padding:"3px 8px",fontSize:9,color:C.sub,fontFamily:"'JetBrains Mono',monospace"}}>
            <div style={{whiteSpace:"nowrap",animation:"ticker 14s linear infinite",display:"inline-block"}}>✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;</div>
          </div>
          {mode!=="xray"&&(
            <button onClick={()=>setCartOpen(true)} style={{background:cartCount>0?`${C.gold}22`:"transparent",border:`1px solid ${cartCount>0?C.gold:C.b}`,borderRadius:8,padding:"5px 11px",color:cartCount>0?C.gold:C.sub,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,transition:"all .3s",animation:cartBounce?"cartBounce .6s ease":"none"}}>
              🛒{cartCount>0&&<span style={{background:C.gold,color:"#1A1410",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{cartCount}</span>}
              {cartCount>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>{fx(cartTotal)}</span>}
            </button>
          )}
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div style={{flex:1,overflow:"hidden",display:"flex",position:"relative"}}>
        {mode==="store"&&storeTab==="shop"&&<StoreView products={PRODUCTS} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} fx={fx}/>}
        {mode==="store"&&storeTab==="wishlist"&&<WishlistView wishlist={wishlist} onAdd={addToCart} onWish={toggleWishlist} fx={fx} onBack={()=>setStoreTab("shop")}/>}
        {mode==="store"&&storeTab==="profile"&&<ProfileView user={user} orders={orders} loyaltyPts={loyaltyPts} fx={fx} onBack={()=>setStoreTab("shop")}/>}
        {mode==="admin"&&<AdminView orders={orders} setOrders={setOrders} products={PRODUCTS} loyaltyPts={loyaltyPts}/>}
        {mode==="xray"&&<XRayView/>}
      </div>
      {cartOpen&&<CartDrawer cart={cart} total={cartTotal} onClose={()=>setCartOpen(false)} onRemove={removeFromCart} onQty={updateQty} onOrder={placeOrder} fx={fx} toast={toast}/>}
      {mode==="store"&&<ChatWidget open={chatOpen} onToggle={()=>setChatOpen(o=>!o)}/>}
    </div>
  );
}
