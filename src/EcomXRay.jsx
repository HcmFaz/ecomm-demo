import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{background:#04080F;color:#D4E8F8;font-family:'Outfit',sans-serif;overflow:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#112233;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes flow{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes cartBounce{0%,100%{transform:scale(1)}40%{transform:scale(1.3)}70%{transform:scale(.9)}}
.fu{animation:fadeUp .35s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.flowing path{stroke-dasharray:8 4;animation:flow 1.2s linear infinite}
`;

const C={
  bg:"#04080F",s1:"#080F1A",s2:"#0C1520",s3:"#101C2A",
  b:"#112233",b2:"#1A3050",
  cyan:"#00D4FF",cyanD:"#0099BB",
  green:"#00FF88",greenD:"#00BB66",
  amber:"#FFB300",amberD:"#CC8800",
  red:"#FF4466",violet:"#9B7FFF",
  text:"#D4E8F8",sub:"#5A8AAA",dim:"#2A4A66",
  shopAccent:"#C9A96E",shopDark:"#1A1410",
};

/* ── XRAY DATA ── */
const LAYERS=[
  {id:"client",label:"COUCHE CLIENT",color:C.cyan,nodes:[
    {id:"browser",label:"Navigateur Web",sub:"React / Next.js",icon:"🌐",code:`export default async function ProductPage({ params }) {\n  const product = await getProduct(params.slug)\n  return <ProductView product={product} />\n}`,course:"Slides 56–59 · Web & HTTP"},
    {id:"mobile",label:"App Mobile",sub:"React Native / PWA",icon:"📱",code:`// manifest.json\n{\n  "display": "standalone",\n  "start_url": "/",\n  "theme_color": "#04080F"\n}`,course:"Slides 62–64 · M-Commerce"},
    {id:"cdn",label:"CDN / Edge",sub:"Vercel Edge Network",icon:"⚡",code:`export default {\n  images: { domains: ['cdn.store.ma'] },\n  experimental: { ppr: true }\n}`,course:"Slides 65–68 · Cloud Computing"},
  ]},
  {id:"api",label:"COUCHE API",color:C.green,nodes:[
    {id:"products_api",label:"API Produits",sub:"REST / GET · POST · PUT",icon:"📦",code:`export async function GET(req) {\n  const { data } = await supabase\n    .from('products').select('*')\n    .eq('status', 'active')\n  return Response.json(data)\n}`,course:"Slides 56 · Infrastructure"},
    {id:"auth_api",label:"Auth API",sub:"JWT · Sessions · OAuth",icon:"🔐",code:`export function middleware(req) {\n  const token = req.cookies.get('session')\n  if (!token) return redirect('/login')\n  return verifyJWT(token)\n}`,course:"Slides 74–78 · Sécurité"},
    {id:"checkout_api",label:"Checkout API",sub:"Stripe · CMI · PayPal",icon:"💳",code:`const session = await stripe.checkout.sessions.create({\n  line_items: cartItems,\n  mode: 'payment',\n  success_url: '/merci',\n})`,course:"Slides 80–84 · Paiements"},
    {id:"webhook",label:"Webhook",sub:"Events Stripe → DB",icon:"🔄",code:`switch (event.type) {\n  case 'checkout.session.completed':\n    await updateOrderStatus({ id: orderId, status: 'paid' })\n    await sendConfirmEmail()\n    break\n}`,course:"Slides 86 · Chaîne O2C"},
  ]},
  {id:"data",label:"COUCHE DONNÉES",color:C.amber,nodes:[
    {id:"db",label:"Base de Données",sub:"PostgreSQL / Supabase",icon:"🗄️",code:`CREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name TEXT NOT NULL,\n  price NUMERIC(10,2),\n  stock INT DEFAULT 0\n);\nCREATE POLICY "public_read" ON products\n  FOR SELECT USING (status = 'active');`,course:"Slides 69 · Big Data"},
    {id:"storage",label:"Stockage Fichiers",sub:"Images · Médias · Docs",icon:"🗂️",code:`const { data } = await supabase.storage\n  .from('product-images')\n  .upload(fileName, file, {\n    contentType: 'image/webp', upsert: true\n  })`,course:"Slides 65–68 · Cloud"},
    {id:"cache",label:"Cache / Redis",sub:"Sessions · Panier · KPIs",icon:"⚡",code:`await redis.setex(\`cart:\${userId}\`, 3600,\n  JSON.stringify(cartItems)\n)\nconst cart = await redis.get(\`cart:\${userId}\`)`,course:"Slides 98 · Performance"},
  ]},
  {id:"infra",label:"COUCHE INFRASTRUCTURE",color:C.violet,nodes:[
    {id:"cicd",label:"CI/CD Pipeline",sub:"GitHub Actions → Vercel",icon:"🔧",code:`on:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    steps:\n      - run: npm test\n      - run: vercel --prod`,course:"Slides 92 · Alignement Tech"},
    {id:"monitoring",label:"Monitoring",sub:"Logs · Alertes · Uptime",icon:"📊",code:`import { track } from '@vercel/analytics'\ntrack('purchase', {\n  amount: order.total,\n  currency: 'MAD',\n  products: order.items.length\n})`,course:"Slides 108 · KPIs Scaling"},
    {id:"security",label:"Sécurité",sub:"SSL · WAF · PCI DSS",icon:"🛡️",code:`const securityHeaders = [\n  { key: 'X-Frame-Options', value: 'DENY' },\n  { key: 'Content-Security-Policy',\n    value: "default-src 'self'" },\n  { key: 'Strict-Transport-Security',\n    value: 'max-age=63072000' }\n]`,course:"Slides 77 · Sécurité E-commerce"},
  ]},
];

const CONNECTIONS=[
  {from:"browser",to:"products_api",color:C.cyan},{from:"mobile",to:"checkout_api",color:C.cyan},
  {from:"cdn",to:"auth_api",color:C.cyan},{from:"products_api",to:"db",color:C.green},
  {from:"auth_api",to:"cache",color:C.green},{from:"checkout_api",to:"db",color:C.green},
  {from:"webhook",to:"db",color:C.green},{from:"db",to:"cicd",color:C.amber},
  {from:"storage",to:"monitoring",color:C.amber},{from:"cache",to:"security",color:C.amber},
];

const PAYMENT_STEPS=[
  {icon:"🛒",label:"Client clique\n'Acheter'",sub:"React state update",color:C.cyan,slide:"Slide 81"},
  {icon:"🔐",label:"Session\nauthentifiée",sub:"JWT vérifié",color:C.green,slide:"Slide 78"},
  {icon:"📋",label:"Commande créée\nen DB",sub:"status: 'pending'",color:C.amber,slide:"Slide 86"},
  {icon:"💳",label:"Redirigé vers\nStripe / CMI",sub:"TLS 1.3 + AES-256",color:C.violet,slide:"Slide 77"},
  {icon:"✅",label:"Paiement\nconfirmé",sub:"Webhook reçu",color:C.green,slide:"Slide 86"},
  {icon:"📦",label:"Stock\ndécrémenté",sub:"DB trigger SQL",color:C.amber,slide:"Slides 92"},
  {icon:"📧",label:"Email de\nconfirmation",sub:"Resend API",color:C.cyan,slide:"Slide 101"},
];

const DB_TABLES=[
  {name:"products",color:C.amber,fields:[["id","UUID 🔑"],["name","TEXT"],["price","NUMERIC"],["stock","INT"],["status","ENUM"],["images","JSONB"]]},
  {name:"orders",color:C.cyan,fields:[["id","UUID 🔑"],["user_id","FK →"],["total","NUMERIC"],["status","ENUM"],["stripe_id","TEXT"],["created_at","TIMESTAMP"]]},
  {name:"order_items",color:C.green,fields:[["id","UUID 🔑"],["order_id","FK →"],["product_id","FK →"],["qty","INT"],["price","NUMERIC"]]},
  {name:"profiles",color:C.violet,fields:[["id","UUID 🔑"],["email","TEXT"],["role","ENUM"],["stripe_customer","TEXT"]]},
  {name:"cart_items",color:C.red,fields:[["session_id","TEXT"],["product_id","FK →"],["qty","INT"],["created_at","TIMESTAMP"]]},
];

const SECURITY_LAYERS=[
  {level:1,label:"HTTPS / TLS 1.3",desc:"Chiffrement de toutes les communications",tech:"Certificat SSL automatique — Vercel",course:"Slide 77",color:C.cyan},
  {level:2,label:"Authentification JWT",desc:"Tokens signés, expiration 24h, rotation automatique",tech:"Supabase Auth / NextAuth.js",course:"Slide 78",color:C.green},
  {level:3,label:"Row Level Security",desc:"Chaque utilisateur ne voit que ses données",tech:"PostgreSQL RLS Policies",course:"Slide 122",color:C.amber},
  {level:4,label:"PCI DSS Level 1",desc:"Données bancaires jamais stockées sur nos serveurs",tech:"Stripe Tokenisation + AES-256",course:"Slide 77",color:C.violet},
  {level:5,label:"Rate Limiting",desc:"Protection contre les attaques par force brute",tech:"Vercel Edge Middleware",course:"Slide 76",color:C.red},
];

/* ── STORE DATA ── */
const PRODUCTS=[
  {id:1,name:"Caftan Brodé Royal",category:"Mode",price:1850,rating:4.8,reviews:124,stock:8,badge:"Bestseller",emoji:"👘",desc:"Caftan en velours brodé à la main, motifs géométriques traditionnels.",tags:["Artisanat","Broderie","Occasion"]},
  {id:2,name:"Argan Pur Bio 100ml",category:"Beauté",price:280,rating:4.9,reviews:312,stock:45,badge:"Top Ventes",emoji:"🫙",desc:"Huile d'argan 100% pure, première pression à froid, certifiée bio.",tags:["Bio","Naturel","Certifié"]},
  {id:3,name:"Tajine en Terre Cuite",category:"Maison",price:420,rating:4.7,reviews:89,stock:23,badge:"Artisanat",emoji:"🍲",desc:"Tajine authentique de Safi, peint à la main par des artisans locaux.",tags:["Safi","Fait main","Céramique"]},
  {id:4,name:"Babouches Cuir Naturel",category:"Mode",price:350,rating:4.6,reviews:201,stock:31,badge:"",emoji:"🥿",desc:"Babouches en cuir végétal tanné, finitions cousues main.",tags:["Cuir","Fès","Confort"]},
  {id:5,name:"Thé à la Menthe Premium",category:"Épicerie",price:95,rating:4.9,reviews:445,stock:120,badge:"Favori",emoji:"🍵",desc:"Mélange signature gunpowder et menthe fraîche séchée. Coffret 100g.",tags:["Premium","Coffret","Cadeau"]},
  {id:6,name:"Coussin Berbère Tissé",category:"Maison",price:680,rating:4.7,reviews:67,stock:14,badge:"Nouveau",emoji:"🛋️",desc:"Coussin en laine berbère tissé à la main dans le Haut Atlas.",tags:["Atlas","Laine","Décoration"]},
  {id:7,name:"Savon Beldi Noir",category:"Beauté",price:120,rating:4.8,reviews:289,stock:78,badge:"",emoji:"🫧",desc:"Savon beldi naturel au ghassoul et huile d'olive, idéal hammam.",tags:["Hammam","Naturel","Ghassoul"]},
  {id:8,name:"Plateau Zellige Doré",category:"Maison",price:950,rating:4.9,reviews:43,stock:6,badge:"Exclusif",emoji:"✨",desc:"Plateau décoratif en zellige doré. Pièce unique numérotée.",tags:["Zellige","Fès","Unique"]},
];
const CATEGORIES=["Tous","Mode","Maison","Beauté","Épicerie"];

/* ════ MAIN APP ════ */
export default function App() {
  const [mode,setMode]=useState("store");
  const [cart,setCart]=useState([]);
  const [orders,setOrders]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const [cartBounce,setCartBounce]=useState(false);

  const addToCart=(product)=>{
    setCart(prev=>{
      const ex=prev.find(i=>i.id===product.id);
      return ex?prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i):[...prev,{...product,qty:1}];
    });
    setCartBounce(true);
    setTimeout(()=>setCartBounce(false),600);
  };
  const removeFromCart=(id)=>setCart(prev=>prev.filter(i=>i.id!==id));
  const updateQty=(id,delta)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const placeOrder=(info)=>{
    const order={
      id:`CMD-${Date.now().toString().slice(-5)}`,
      items:[...cart],total:cartTotal,
      customer:info,status:"En attente",
      date:new Date().toLocaleString('fr-FR')
    };
    setOrders(prev=>[order,...prev]);
    setCart([]);
    setCartOpen(false);
    return order;
  };

  const MODES=[{id:"store",icon:"🛍",label:"Boutique"},{id:"admin",icon:"⚙️",label:"Admin"},{id:"xray",icon:"◈",label:"X-Ray"}];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}}>
      <style>{CSS}</style>
      {/* TOP BAR */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.b}`,padding:"0 20px",display:"flex",alignItems:"center",gap:12,height:48,flexShrink:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${C.shopAccent},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#fff"}}>N</div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:C.text}}>NouaSell</span>
        </div>
        <div style={{display:"flex",gap:2,background:C.s2,borderRadius:9,padding:2,border:`1px solid ${C.b}`}}>
          {MODES.map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{background:mode===m.id?C.s3:"transparent",border:`1px solid ${mode===m.id?C.b2:"transparent"}`,borderRadius:7,padding:"4px 12px",color:mode===m.id?C.text:C.sub,fontSize:11,cursor:"pointer",fontWeight:600,transition:"all .2s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.15em"}}>
          {mode==="store"?"VITRINE PUBLIQUE":mode==="admin"?"BACK-OFFICE":"ANATOMIE TECHNIQUE"}
        </div>
        {mode==="store"&&<div style={{fontSize:10,color:C.sub,fontFamily:"'Outfit',sans-serif",background:C.s2,borderRadius:5,padding:"3px 8px",border:`1px solid ${C.b}`}}>◈ X-Ray explique ce qui se passe derrière</div>}
        {mode==="xray"&&<div style={{fontSize:10,color:C.sub,fontFamily:"'Outfit',sans-serif",background:C.s2,borderRadius:5,padding:"3px 8px",border:`1px solid ${C.b}`}}>🛍 Boutique montre le résultat visible</div>}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{overflow:"hidden",width:200,background:C.s2,borderRadius:6,border:`1px solid ${C.b}`,padding:"3px 8px",fontSize:9,color:C.sub,fontFamily:"'JetBrains Mono',monospace"}}>
            <div style={{whiteSpace:"nowrap",animation:"ticker 14s linear infinite",display:"inline-block"}}>✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;✦ Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;</div>
          </div>
          {mode!=="xray"&&(
            <button onClick={()=>setCartOpen(true)} style={{background:cartCount>0?`${C.shopAccent}20`:"transparent",border:`1px solid ${cartCount>0?C.shopAccent:C.b}`,borderRadius:8,padding:"5px 12px",color:cartCount>0?C.shopAccent:C.sub,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:600,transition:"all .3s",animation:cartBounce?"cartBounce .6s ease":"none"}}>
              🛒 <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{cartCount}</span>
              {cartCount>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub}}>{cartTotal.toLocaleString()} MAD</span>}
            </button>
          )}
        </div>
      </div>
      {/* MAIN */}
      <div style={{flex:1,overflow:"hidden",display:"flex",position:"relative"}}>
        {mode==="store"&&<StoreView products={PRODUCTS} onAdd={addToCart}/>}
        {mode==="admin"&&<AdminView orders={orders} products={PRODUCTS} setOrders={setOrders}/>}
        {mode==="xray"&&<XRayView/>}
      </div>
      {cartOpen&&<CartDrawer cart={cart} total={cartTotal} onClose={()=>setCartOpen(false)} onRemove={removeFromCart} onQty={updateQty} onOrder={placeOrder}/>}
    </div>
  );
}

/* ════ STORE VIEW ════ */
function StoreView({products,onAdd}) {
  const [category,setCategory]=useState("Tous");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [added,setAdded]=useState(null);
  const filtered=products.filter(p=>(category==="Tous"||p.category===category)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))));
  const handleAdd=(p)=>{onAdd(p);setAdded(p.id);setTimeout(()=>setAdded(null),1200);};
  return (
    <div style={{flex:1,overflowY:"auto",background:"#F7F5F0"}}>
      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,#1A1410 0%,#2C1F0E 50%,#1A1410 100%)`,padding:"40px 40px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.shopAccent}15,transparent 70%)`}}/>
        <div style={{position:"relative",maxWidth:900,margin:"0 auto"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.shopAccent,letterSpacing:"0.2em",marginBottom:10}}>✦ L'ARTISANAT MAROCAIN EN LIGNE</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:34,color:"#FAFAF7",lineHeight:1.2,marginBottom:12}}>Découvrez <em style={{fontStyle:"italic",color:C.shopAccent}}>l'authenticité</em> marocaine</h1>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:"#9B8A6E",maxWidth:480,lineHeight:1.7,marginBottom:20}}>Produits artisanaux sélectionnés directement auprès des artisans de Fès, Marrakech et Essaouira.</p>
          <div style={{display:"flex",gap:24}}>
            {[["12k+","Commandes livrées"],["340","Artisans partenaires"],["99.2%","Satisfaction client"]].map(([v,l])=>(
              <div key={l}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.shopAccent}}>{v}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#6B5A42"}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
      {/* Filters */}
      <div style={{background:"#FAFAF7",borderBottom:"1px solid #E5E7EB",padding:"12px 40px",display:"flex",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",gap:6}}>
          {CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat)} style={{background:category===cat?"#1A1410":"transparent",border:`1px solid ${category===cat?"#1A1410":"#D1D5DB"}`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,cursor:"pointer",color:category===cat?"#FAFAF7":"#4B5563",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>{cat}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{background:"#F3F4F6",border:"1px solid #E5E7EB",borderRadius:8,padding:"6px 12px 6px 30px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",outline:"none",width:180}}/>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#9CA3AF"}}>🔍</span>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9CA3AF"}}>{filtered.length} produits</div>
      </div>
      {/* Grid */}
      <div style={{padding:"24px 40px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:18}}>
          {filtered.map((p,i)=>(
            <div key={p.id} style={{background:"#FFFFFF",border:"1px solid #F0EDE8",borderRadius:16,overflow:"hidden",transition:"all .25s",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",animation:`fadeUp .3s ease ${i*.05}s both`}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";e.currentTarget.style.transform="translateY(0)";}}>
              <div onClick={()=>setSelected(p)} style={{height:150,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <span style={{fontSize:58}}>{p.emoji}</span>
                {p.badge&&<div style={{position:"absolute",top:8,left:8,background:p.badge==="Bestseller"?"#1A1410":p.badge==="Nouveau"?C.cyan:p.badge==="Exclusif"?C.shopAccent:"#059669",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,fontFamily:"'Outfit',sans-serif"}}>{p.badge}</div>}
                <div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",borderRadius:4,padding:"2px 6px",fontSize:9,color:"#6B5A42",fontFamily:"'JetBrains Mono',monospace"}}>Stock:{p.stock}</div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:3}}>{p.category.toUpperCase()}</div>
                <div onClick={()=>setSelected(p)} style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:"#1A1410",marginBottom:5,lineHeight:1.3}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
                  <span style={{color:C.shopAccent,fontSize:10}}>{"★".repeat(Math.floor(p.rating))}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#9B8A6E"}}>{p.rating} ({p.reviews})</span>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#1A1410"}}>{p.price.toLocaleString()} <span style={{fontSize:10,color:"#9B8A6E"}}>MAD</span></span>
                  <button onClick={()=>handleAdd(p)} style={{background:added===p.id?"#059669":"#1A1410",border:"none",borderRadius:7,padding:"6px 12px",color:"#FAFAF7",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s"}}>{added===p.id?"✓ Ajouté":"+ Panier"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={()=>{handleAdd(selected);setSelected(null);}}/>}
    </div>
  );
}

function ProductModal({product:p,onClose,onAdd}) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{background:"#FAFAF7",borderRadius:20,width:460,maxWidth:"90vw",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}}>
        <div style={{height:180,background:"linear-gradient(135deg,#F7F3ED,#EDE8E0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,position:"relative"}}>
          {p.emoji}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.15)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"#4B5563",fontSize:13}}>✕</button>
        </div>
        <div style={{padding:22}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"#9B8A6E",letterSpacing:"0.12em",marginBottom:5}}>{p.category.toUpperCase()} · {p.tags.join(" · ")}</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1A1410",marginBottom:7}}>{p.name}</h2>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{color:C.shopAccent,fontSize:13}}>{"★".repeat(Math.floor(p.rating))}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{p.rating}/5 · {p.reviews} avis</span>
          </div>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#4B5563",lineHeight:1.7,marginBottom:18}}>{p.desc}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#1A1410"}}>{p.price.toLocaleString()} MAD</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#9B8A6E"}}>Stock: {p.stock} unités</div>
            </div>
            <button onClick={onAdd} style={{background:"#1A1410",border:"none",borderRadius:10,padding:"11px 22px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════ CART DRAWER ════ */
function CartDrawer({cart,total,onClose,onRemove,onQty,onOrder}) {
  const [step,setStep]=useState("cart");
  const [info,setInfo]=useState({name:"",email:"",address:"",city:"Casablanca",payment:"CMI"});
  const [confirmed,setConfirmed]=useState(null);
  const handleOrder=()=>{const o=onOrder(info);setConfirmed(o);setStep("confirm");};
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(2px)"}}/>
      <div className="fi" style={{width:400,background:"#FAFAF7",display:"flex",flexDirection:"column",boxShadow:"-8px 0 40px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"16px 18px",borderBottom:"1px solid #E5E7EB",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#1A1410"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#FAFAF7"}}>{step==="cart"?"Votre Panier":step==="info"?"Informations":"✅ Commande confirmée"}</div>
            {step==="cart"&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#9B8A6E"}}>{cart.length} article(s)</div>}
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#FAFAF7",fontSize:13}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:18}}>
          {step==="cart"&&(
            cart.length===0
              ?<div style={{textAlign:"center",padding:"40px 20px",color:"#9B8A6E",fontFamily:"'Outfit',sans-serif"}}><div style={{fontSize:36,marginBottom:10}}>🛒</div>Votre panier est vide</div>
              :<>
                {cart.map(item=>(
                  <div key={item.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0EDE8"}}>
                    <div style={{width:44,height:44,background:"#F7F3ED",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:12,color:"#1A1410",marginBottom:1}}>{item.name}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9B8A6E"}}>{item.price.toLocaleString()} MAD</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <button onClick={()=>onQty(item.id,-1)} style={{width:20,height:20,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:11,color:"#4B5563"}}>−</button>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                      <button onClick={()=>onQty(item.id,1)} style={{width:20,height:20,borderRadius:"50%",border:"1px solid #E5E7EB",background:"transparent",cursor:"pointer",fontSize:11,color:"#4B5563"}}>+</button>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#1A1410",minWidth:65,textAlign:"right"}}>{(item.price*item.qty).toLocaleString()} MAD</div>
                    <button onClick={()=>onRemove(item.id)} style={{background:"transparent",border:"none",cursor:"pointer",color:"#D1D5DB",fontSize:13}}>✕</button>
                  </div>
                ))}
                <div style={{padding:"12px 0",borderTop:"2px solid #1A1410",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#1A1410"}}>Total</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#1A1410"}}>{total.toLocaleString()} MAD</span>
                </div>
              </>
          )}
          {step==="info"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["Nom complet","name","text"],["Email","email","email"],["Adresse","address","text"]].map(([label,field,type])=>(
                <div key={field}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>{label}</div>
                  <input type={type} value={info[field]} onChange={e=>setInfo(p=>({...p,[field]:e.target.value}))} style={{width:"100%",border:"1px solid #E5E7EB",borderRadius:7,padding:"8px 10px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",outline:"none"}}/>
                </div>
              ))}
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:4}}>Ville</div>
                <select value={info.city} onChange={e=>setInfo(p=>({...p,city:e.target.value}))} style={{width:"100%",border:"1px solid #E5E7EB",borderRadius:7,padding:"8px 10px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:"#1A1410",background:"#fff",outline:"none"}}>
                  {["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:"#374151",marginBottom:6}}>Mode de paiement</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[["💳","CMI"],["🌍","Stripe"],["🏧","PayPal"],["💵","Cash"]].map(([ico,method])=>(
                    <button key={method} onClick={()=>setInfo(p=>({...p,payment:method}))} style={{background:info.payment===method?"#1A1410":"transparent",border:`1px solid ${info.payment===method?"#1A1410":"#E5E7EB"}`,borderRadius:7,padding:"7px 12px",cursor:"pointer",color:info.payment===method?"#FAFAF7":"#4B5563",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,transition:"all .2s"}}>{ico} {method}</button>
                  ))}
                </div>
              </div>
              <div style={{background:"#FFF8F0",border:"1px solid #FDE8C0",borderRadius:8,padding:10}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.amber,letterSpacing:"0.1em",marginBottom:3}}>⚡ SIMULATION · X-RAY</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#92400E",lineHeight:1.6}}>En production : TLS 1.3 → Stripe/CMI → tokenisation PCI DSS → webhook → DB. Voir ◈ X-Ray pour l'anatomie complète.</div>
              </div>
            </div>
          )}
          {step==="confirm"&&confirmed&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:"#1A1410",marginBottom:6}}>Commande confirmée !</h3>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.shopAccent,marginBottom:16}}>{confirmed.id}</div>
              {confirmed.items.map(i=>(
                <div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F0EDE8",fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#4B5563"}}>
                  <span>{i.emoji} {i.name} ×{i.qty}</span>
                  <span style={{fontWeight:600,color:"#1A1410"}}>{(i.price*i.qty).toLocaleString()} MAD</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#1A1410"}}>
                <span>Total</span><span>{confirmed.total.toLocaleString()} MAD</span>
              </div>
              <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:10,textAlign:"left",marginTop:6}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#059669",letterSpacing:"0.1em",marginBottom:3}}>📧 SIMULATION</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"#065F46",lineHeight:1.6}}>Webhook Stripe → DB mise à jour → email envoyé via Resend API (Slide 101). Voir Admin → Commandes.</div>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid #E5E7EB"}}>
          {step==="cart"&&cart.length>0&&<button onClick={()=>setStep("info")} style={{width:"100%",background:"#1A1410",border:"none",borderRadius:9,padding:"11px",color:"#FAFAF7",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Passer la commande — {total.toLocaleString()} MAD →</button>}
          {step==="info"&&<div style={{display:"flex",gap:7}}>
            <button onClick={()=>setStep("cart")} style={{flex:1,background:"transparent",border:"1px solid #E5E7EB",borderRadius:9,padding:"10px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← Retour</button>
            <button onClick={handleOrder} disabled={!info.name||!info.email} style={{flex:2,background:info.name&&info.email?"#1A1410":"#E5E7EB",border:"none",borderRadius:9,padding:"10px",color:info.name&&info.email?"#FAFAF7":"#9CA3AF",fontSize:12,fontWeight:700,cursor:info.name&&info.email?"pointer":"not-allowed",fontFamily:"'Outfit',sans-serif"}}>✓ Confirmer</button>
          </div>}
          {step==="confirm"&&<button onClick={onClose} style={{width:"100%",background:"transparent",border:"1px solid #E5E7EB",borderRadius:9,padding:"10px",color:"#4B5563",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Fermer</button>}
        </div>
      </div>
    </div>
  );
}

/* ════ ADMIN VIEW ════ */
function AdminView({orders,products,setOrders}) {
  const [tab,setTab]=useState("overview");
  const totalRev=orders.filter(o=>o.status!=="Annulé").reduce((s,o)=>s+o.total,0);
  const STATUS_COLOR={"En attente":C.amber,"En traitement":C.cyan,"Expédiée":C.violet,"Livrée":C.green,"Annulé":C.red};
  const FLOW=["En attente","En traitement","Expédiée","Livrée"];
  const advanceStatus=(id)=>setOrders(prev=>prev.map(o=>{if(o.id!==id)return o;const i=FLOW.indexOf(o.status);return{...o,status:i<FLOW.length-1?FLOW[i+1]:o.status};}));
  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{width:170,background:C.s1,borderRight:`1px solid ${C.b}`,padding:"14px 0",flexShrink:0}}>
        <div style={{padding:"0 12px",marginBottom:12}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.15em"}}>BACK-OFFICE</div></div>
        {[["overview","📊","Vue d'ensemble"],["orders","📋","Commandes"],["products","📦","Produits"]].map(([id,icon,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{width:"100%",background:tab===id?C.s2:"transparent",border:"none",borderLeft:`2px solid ${tab===id?C.cyan:"transparent"}`,padding:"8px 14px",color:tab===id?C.text:C.sub,cursor:"pointer",textAlign:"left",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?600:400,display:"flex",alignItems:"center",gap:7,transition:"all .2s"}}>{icon} {label}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>
        {tab==="overview"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Vue d'ensemble</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 108 · KPIs en temps réel</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[{label:"Commandes",value:orders.length,icon:"📋",color:C.cyan},{label:"Revenus",value:`${totalRev.toLocaleString()} MAD`,icon:"💰",color:C.green},{label:"Produits",value:products.length,icon:"📦",color:C.amber},{label:"Livrées",value:orders.filter(o=>o.status==="Livrée").length,icon:"✅",color:C.violet}].map(kpi=>(
                <div key={kpi.label} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{kpi.label}</div><span style={{fontSize:16}}>{kpi.icon}</span></div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:kpi.color}}>{kpi.value}</div>
                </div>
              ))}
            </div>
            {orders.length===0
              ?<div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"36px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>📋</div>Aucune commande — passez une commande depuis la Boutique !</div>
              :<div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.b}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.text}}>Commandes récentes</div>
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:`1px solid ${C.b}44`}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.cyan,minWidth:85}}>{o.id}</div>
                    <div style={{flex:1,fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{o.customer?.name||"—"}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                    <div style={{background:`${STATUS_COLOR[o.status]||C.sub}20`,border:`1px solid ${STATUS_COLOR[o.status]||C.sub}44`,borderRadius:4,padding:"1px 7px",fontSize:9,color:STATUS_COLOR[o.status]||C.sub,fontFamily:"'JetBrains Mono',monospace"}}>{o.status}</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}
        {tab==="orders"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Gestion des Commandes</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 86 · Chaîne O2C — Order to Cash</div>
            {orders.length===0
              ?<div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:"36px",textAlign:"center",color:C.sub,fontFamily:"'Outfit',sans-serif",fontSize:12}}><div style={{fontSize:28,marginBottom:10}}>🛒</div>Passez une commande depuis la Boutique pour voir le cycle O2C !</div>
              :orders.map(o=>(
                <div key={o.id} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:11,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.cyan,marginBottom:2}}>{o.id}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text,fontWeight:600}}>{o.customer?.name} · {o.customer?.city}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{o.date} · {o.customer?.payment}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text}}>{o.total.toLocaleString()} MAD</div>
                      <div style={{background:`${STATUS_COLOR[o.status]}20`,border:`1px solid ${STATUS_COLOR[o.status]}44`,borderRadius:5,padding:"2px 8px",fontSize:9,color:STATUS_COLOR[o.status],fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {FLOW.map((s,i)=>{const cur=FLOW.indexOf(o.status);return<div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=cur?STATUS_COLOR[s]:C.b,transition:"all .4s"}}/>;} )}
                  </div>
                  {o.status!=="Livrée"&&<button onClick={()=>advanceStatus(o.id)} style={{background:`${C.green}15`,border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 12px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>▶ Avancer → {FLOW[Math.min(FLOW.indexOf(o.status)+1,3)]}</button>}
                </div>
              ))
            }
          </div>
        )}
        {tab==="products"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:3}}>Catalogue Produits</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 69 · Table products en base de données</div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
                <thead><tr style={{background:C.bg}}>{["Produit","Catégorie","Prix","Stock","Statut"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,color:C.dim,letterSpacing:"0.12em",fontWeight:700,borderBottom:`1px solid ${C.b}`}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>{products.map(p=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.b}44`}}>
                    <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{p.emoji}</span><span style={{fontWeight:600,color:C.text}}>{p.name}</span></div></td>
                    <td style={{padding:"9px 12px",color:C.sub,fontSize:11}}>{p.category}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:C.amber,fontWeight:600,fontSize:11}}>{p.price.toLocaleString()}</td>
                    <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:p.stock<10?C.red:p.stock<30?C.amber:C.green,fontSize:11}}>{p.stock}</span></td>
                    <td style={{padding:"9px 12px"}}><span style={{background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"1px 7px",fontSize:9,color:C.green}}>actif</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════ XRAY VIEW ════ */
function XRayView() {
  const [view,setView]=useState("architecture");
  const [selected,setSelected]=useState(null);
  const [payStep,setPayStep]=useState(-1);
  const [autoPlay,setAutoPlay]=useState(false);
  const timerRef=useRef(null);
  useEffect(()=>{
    if(autoPlay&&view==="payment"){
      if(payStep<PAYMENT_STEPS.length-1){timerRef.current=setTimeout(()=>setPayStep(s=>s+1),1200);}
      else{setAutoPlay(false);}
    }
    return()=>clearTimeout(timerRef.current);
  },[autoPlay,payStep,view]);
  const XVIEWS=[{id:"architecture",icon:"◈",label:"Architecture"},{id:"payment",icon:"◎",label:"Flux Paiement"},{id:"database",icon:"⊞",label:"Base de Données"},{id:"security",icon:"🛡",label:"Sécurité"},{id:"deploy",icon:"⟶",label:"Déploiement"}];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:C.s2,borderBottom:`1px solid ${C.b}`,padding:"0 18px",display:"flex",gap:2,height:38,alignItems:"center",flexShrink:0}}>
        {XVIEWS.map(v=>(
          <button key={v.id} onClick={()=>{setView(v.id);setSelected(null);}} style={{background:view===v.id?C.s3:"transparent",border:`1px solid ${view===v.id?C.b:"transparent"}`,borderRadius:6,padding:"3px 11px",color:view===v.id?C.text:C.sub,fontSize:10,cursor:"pointer",fontWeight:600,letterSpacing:"0.06em",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{v.icon} {v.label}</button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {view==="architecture"&&<ArchView selected={selected} setSelected={setSelected}/>}
        {view==="payment"&&<PayView payStep={payStep} autoPlay={autoPlay} onStart={()=>{setPayStep(0);setAutoPlay(true);}} onReset={()=>{setPayStep(-1);setAutoPlay(false);}}/>}
        {view==="database"&&<DBView/>}
        {view==="security"&&<SecView/>}
        {view==="deploy"&&<DeployView/>}
      </div>
    </div>
  );
}

function ArchView({selected,setSelected}) {
  const sel=selected?LAYERS.flatMap(l=>l.nodes).find(n=>n.id===selected):null;
  const np={browser:{x:170,y:90},mobile:{x:370,y:90},cdn:{x:570,y:90},products_api:{x:130,y:230},auth_api:{x:310,y:230},checkout_api:{x:490,y:230},webhook:{x:650,y:230},db:{x:150,y:370},storage:{x:350,y:370},cache:{x:540,y:370},cicd:{x:140,y:490},monitoring:{x:330,y:490},security:{x:520,y:490}};
  return (
    <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 320px",overflow:"hidden"}}>
      <div style={{overflowY:"auto",padding:"18px 14px",position:"relative"}}>
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>Architecture en couches</h2>
          <span style={{fontSize:10,color:C.sub}}>Cliquez pour voir le code</span>
        </div>
        <svg style={{position:"absolute",top:65,left:0,width:"100%",height:600,pointerEvents:"none",zIndex:0}} className="flowing">
          {CONNECTIONS.map((c,i)=>{const f=np[c.from],t=np[c.to];if(!f||!t)return null;const my=(f.y+t.y)/2;return<g key={i}><path d={`M${f.x},${f.y} C${f.x},${my} ${t.x},${my} ${t.x},${t.y}`} stroke={c.color} strokeWidth={1.5} fill="none" opacity={0.35} strokeDasharray="6 3"/><circle cx={t.x} cy={t.y} r={3} fill={c.color} opacity={0.6}/></g>;})}
        </svg>
        {LAYERS.map((layer,li)=>(
          <div key={layer.id} style={{marginBottom:18,animation:`fadeUp .4s ease ${li*.1}s both`,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,${layer.color}44,transparent)`}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:600,color:layer.color,letterSpacing:"0.18em"}}>{layer.label}</span>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,transparent,${layer.color}44)`}}/>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {layer.nodes.map(node=>(
                <div key={node.id} onClick={()=>setSelected(selected===node.id?null:node.id)} style={{background:selected===node.id?`${layer.color}18`:C.s2,border:`1px solid ${selected===node.id?layer.color:C.b}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",transition:"all .2s",minWidth:140,flex:1,maxWidth:190,position:"relative",overflow:"hidden"}}>
                  {selected===node.id&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:layer.color}}/>}
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
        {sel?(
          <div style={{flex:1,overflowY:"auto",padding:18}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:14}}><span style={{fontSize:26}}>{sel.icon}</span><div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text,marginBottom:1}}>{sel.label}</h3><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.cyan}}>{sel.sub}</div></div></div>
            <div style={{background:"#020609",border:`1px solid ${C.b}`,borderRadius:9,padding:12,marginBottom:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:7}}>CODE RÉEL</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#C8E6FF",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{sel.code}</pre>
            </div>
            <div style={{background:`${C.cyan}10`,border:`1px solid ${C.cyan}30`,borderRadius:7,padding:10}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.cyan,letterSpacing:"0.1em",marginBottom:3}}>RÉFÉRENCE COURS</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{sel.course}</div>
            </div>
          </div>
        ):(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10,opacity:.3}}>◈</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub,lineHeight:1.7}}>Cliquez sur un composant pour explorer son code et sa référence cours</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PayView({payStep,autoPlay,onStart,onReset}) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div><h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Flux de paiement — Anatomie d'une transaction</h2><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 80–86 · Ce qui se passe en 3 secondes quand un client clique "Acheter"</div></div>
          <div style={{display:"flex",gap:7}}>{payStep===-1?<Btn onClick={onStart} color={C.green}>▶ Lancer</Btn>:<Btn onClick={onReset} color={C.sub} outline>↺ Reset</Btn>}</div>
        </div>
        <div style={{display:"flex",gap:0,alignItems:"flex-start",marginBottom:32,overflowX:"auto",paddingBottom:6}}>
          {PAYMENT_STEPS.map((step,i)=>{const active=i===payStep,done=i<payStep,waiting=i>payStep;return(
            <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <div style={{textAlign:"center",width:100,opacity:waiting?0.3:1,transition:"all .5s"}}>
                <div style={{position:"relative",width:50,height:50,margin:"0 auto 7px",borderRadius:"50%",background:active?`${step.color}30`:done?`${step.color}20`:C.s2,border:`2px solid ${active||done?step.color:C.b}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"all .5s",boxShadow:active?`0 0 18px ${step.color}55`:"none"}}>
                  {done?<span style={{fontSize:16,color:step.color}}>✓</span>:step.icon}
                  {active&&<div style={{position:"absolute",inset:-4,borderRadius:"50%",border:`1px solid ${step.color}`,animation:"ping 1s ease infinite"}}/>}
                </div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:10,color:active?step.color:done?C.text:C.dim,whiteSpace:"pre-line",lineHeight:1.4,marginBottom:3}}>{step.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub}}>{step.sub}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:step.color,marginTop:3,background:`${step.color}12`,borderRadius:3,padding:"1px 5px",display:"inline-block"}}>{step.slide}</div>
              </div>
              {i<PAYMENT_STEPS.length-1&&<div style={{width:20,height:2,background:i<payStep?PAYMENT_STEPS[i].color:C.b,transition:"all .6s",flexShrink:0,position:"relative",top:-16}}/>}
            </div>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{title:"Pourquoi TLS/SSL ?",body:"Chaque octet échangé est chiffré. Sans SSL, les données bancaires transitent en clair — interceptables. (Slide 77)",color:C.cyan},{title:"Qu'est-ce qu'un Webhook ?",body:"Stripe appelle automatiquement notre API quand le paiement réussit. Sans webhook, on ne saurait jamais si le client a payé. (Slide 86)",color:C.green},{title:"Tokenisation bancaire",body:"Le numéro de carte n'est jamais stocké sur nos serveurs. Stripe génère un token unique. Conformité PCI DSS Level 1. (Slide 77)",color:C.amber},{title:"Idempotence",body:"Si le webhook est reçu deux fois, la commande ne doit pas être créée deux fois. On vérifie l'ID Stripe avant chaque insertion. (Slide 86)",color:C.violet}].map(card=>(
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

function DBView() {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Schéma de la Base de Données</h2>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 69 · Big Data — Les tables qui stockent TOUTE la logique métier</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
          {DB_TABLES.map(table=>(
            <div key={table.name} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,overflow:"hidden",minWidth:155,flex:1,maxWidth:195}}>
              <div style={{background:`${table.color}18`,padding:"7px 12px",borderBottom:`1px solid ${table.color}33`,display:"flex",alignItems:"center",gap:7}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim}}>TABLE</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:11,color:table.color}}>{table.name}</span></div>
              {table.fields.map(([field,type])=>(
                <div key={field} style={{padding:"4px 12px",borderBottom:`1px solid ${C.b}44`,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:field==="id"?table.color:C.text}}>{field}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub}}>{type}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[{icon:"📊",label:"Volume",value:"Millions de lignes",desc:"Chaque visite, clic, commande = 1 ligne"},{icon:"⚡",label:"Vélocité",value:"Temps réel",desc:"Stock mis à jour à chaque achat"},{icon:"🔀",label:"Variété",value:"SQL + JSON + Fichiers",desc:"Texte, images, événements, logs"}].map(v=>(
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

function SecView() {
  const [expanded,setExpanded]=useState(null);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Modèle de Sécurité en Oignon</h2>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:18}}>Slides 74–78 · 5 couches de protection superposées</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {SECURITY_LAYERS.map((layer,i)=>(
            <div key={layer.level} onClick={()=>setExpanded(expanded===i?null:i)} style={{background:expanded===i?`${layer.color}10`:C.s2,border:`1px solid ${expanded===i?layer.color:C.b}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",transition:"all .25s",marginLeft:`${i*18}px`,marginRight:`${i*18}px`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:`${layer.color}22`,border:`2px solid ${layer.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:layer.color,flexShrink:0}}>{layer.level}</div>
                <div style={{flex:1}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:layer.color}}>{layer.label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{layer.desc}</div></div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.dim,background:C.s1,borderRadius:3,padding:"2px 7px"}}>{layer.course}</div>
                <span style={{color:C.dim,fontSize:11}}>{expanded===i?"▲":"▼"}</span>
              </div>
              {expanded===i&&<div className="fu" style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${layer.color}22`}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub}}>TECHNOLOGIE : </span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:layer.color}}>{layer.tech}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeployView() {
  const [step,setStep]=useState(-1);
  const [running,setRunning]=useState(false);
  const PIPELINE=[
    {icon:"👨‍💻",label:"git push origin main",sub:"Le développeur pousse le code",color:C.cyan,log:["[git] Compressing objects: 100%","[git] Writing objects: 100% (12/12)","[git] ✓ To github.com:store/repo.git"]},
    {icon:"⚙️",label:"GitHub Actions déclenché",sub:"Tests automatiques lancés",color:C.amber,log:["[CI] Running: npm install","[CI] Running: npm test","[CI] ✓ 47 tests passed in 8.2s","[CI] ✓ Build successful (2.1MB)"]},
    {icon:"🔍",label:"Vérifications qualité",sub:"Lint · Types · Sécurité",color:C.violet,log:["[lint] ESLint: 0 errors","[types] TypeScript: no errors","[audit] 0 vulnerabilities","[lighthouse] Performance: 94/100"]},
    {icon:"🌍",label:"Déploiement Vercel",sub:"Edge Network mondial",color:C.green,log:["[vercel] Building...","[vercel] ✓ Casablanca — ready","[vercel] ✓ Paris — ready","[vercel] 🎉 https://store.vercel.app"]},
    {icon:"🗄️",label:"Migration DB Supabase",sub:"Nouvelles colonnes / tables",color:C.amber,log:["[db] Running migration 002","[db] ALTER TABLE products...","[db] ✓ Migration complete"]},
    {icon:"✅",label:"Boutique en production",sub:"0 downtime",color:C.green,log:["[health] GET / → 200 OK (43ms)","[health] /api/products → 200 (12ms)","[monitor] Uptime: 99.97%","🚀 Deployment complete! Cost: $0.00"]},
  ];
  const run=()=>{setStep(0);setRunning(true);PIPELINE.forEach((_,i)=>setTimeout(()=>{setStep(i);if(i===PIPELINE.length-1)setRunning(false);},i*1400));};
  return (
    <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div><h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text,marginBottom:3}}>Pipeline CI/CD — De l'IDE à la Production</h2><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>Slides 92 · Chaque commit déclenche un déploiement automatique</div></div>
          <div style={{display:"flex",gap:7}}>
            {!running&&<Btn onClick={run} color={C.green}>▶ Simuler</Btn>}
            {(step>=0||running)&&<Btn onClick={()=>{setStep(-1);setRunning(false);}} color={C.sub} outline>↺ Reset</Btn>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {PIPELINE.map((p,i)=>{const done=i<step,active=i===step,future=i>step;return(
            <div key={i} style={{background:active?`${p.color}15`:done?C.s2:C.s1,border:`1px solid ${active?p.color:done?C.b2:C.b}`,borderRadius:10,padding:12,transition:"all .4s",opacity:future&&step>=0?0.4:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:done||active?`${p.color}20`:C.s3,border:`2px solid ${done||active?p.color:C.b}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,transition:"all .4s",boxShadow:active?`0 0 14px ${p.color}55`:"none"}}>{done?"✓":p.icon}</div>
                <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:active?p.color:done?C.green:C.dim}}>{p.label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{p.sub}</div></div>
              </div>
              {(active||done)&&<div className="fu" style={{background:"#010508",borderRadius:6,padding:"7px 9px",maxHeight:80,overflow:"hidden"}}>{p.log.map((l,j)=><div key={j} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:l.includes("✓")||l.includes("🎉")||l.includes("🚀")?C.green:C.sub,lineHeight:1.6}}>{l}</div>)}</div>}
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function Btn({children,onClick,color=C.cyan,outline=false}) {
  return <button onClick={onClick} style={{background:outline?"transparent":`${color}22`,border:`1px solid ${outline?C.b:color}`,borderRadius:7,padding:"6px 14px",color:outline?C.sub:color,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.05em",transition:"all .2s"}}>{children}</button>;
}
