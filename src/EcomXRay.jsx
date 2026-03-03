import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#04080F;color:#D4E8F8;font-family:'Outfit',sans-serif;overflow:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#112233;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes flow{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
@keyframes glow{0%,100%{box-shadow:0 0 8px #00D4FF33}50%{box-shadow:0 0 24px #00D4FF88}}
@keyframes slideRight{from{transform:translateX(-8px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.fu{animation:fadeUp .35s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.glow{animation:glow 2s ease infinite}
.flowing path{stroke-dasharray:8 4;animation:flow 1.2s linear infinite}
.pulse-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:inherit;animation:ping 1.5s ease infinite;}
`;

/* ── DESIGN TOKENS ── */
const C = {
  bg:"#04080F", s1:"#080F1A", s2:"#0C1520", s3:"#101C2A",
  b:"#112233", b2:"#1A3050",
  cyan:"#00D4FF", cyanD:"#0099BB",
  green:"#00FF88", greenD:"#00BB66",
  amber:"#FFB300", amberD:"#CC8800",
  red:"#FF4466", violet:"#9B7FFF",
  text:"#D4E8F8", sub:"#5A8AAA", dim:"#2A4A66",
};

const LAYERS = [
  {
    id:"client", y:0, label:"COUCHE CLIENT", color:C.cyan,
    nodes:[
      {id:"browser",x:120,label:"Navigateur Web",sub:"React / Next.js",icon:"🌐",code:`// Page produit — Server Component\nexport default async function ProductPage({ params }) {\n  const product = await getProduct(params.slug)\n  return <ProductView product={product} />\n}`,course:"Slides 56–59 · Web & HTTP"},
      {id:"mobile",x:320,label:"App Mobile",sub:"React Native / PWA",icon:"📱",code:`// Progressive Web App\n// manifest.json\n{\n  "display": "standalone",\n  "start_url": "/",\n  "theme_color": "#04080F"\n}`,course:"Slides 62–64 · M-Commerce"},
      {id:"cdn",x:520,label:"CDN / Edge",sub:"Vercel Edge Network",icon:"⚡",code:`// next.config.js\nexport default {\n  images: { domains: ['cdn.store.ma'] },\n  experimental: { ppr: true } // Partial Pre-Rendering\n}`,course:"Slides 65–68 · Cloud Computing"},
    ]
  },
  {
    id:"api", y:1, label:"COUCHE API", color:C.green,
    nodes:[
      {id:"products_api",x:80,label:"API Produits",sub:"REST / GET · POST · PUT",icon:"📦",code:`// GET /api/products\nexport async function GET(req) {\n  const { data } = await supabase\n    .from('products')\n    .select('*')\n    .eq('status', 'active')\n  return Response.json(data)\n}`,course:"Slides 56 · Infrastructure"},
      {id:"auth_api",x:260,label:"Auth API",sub:"JWT · Sessions · OAuth",icon:"🔐",code:`// Middleware d'authentification\nexport function middleware(req) {\n  const token = req.cookies.get('session')\n  if (!token) return redirect('/login')\n  return verifyJWT(token)\n}`,course:"Slides 74–78 · Sécurité"},
      {id:"checkout_api",x:440,label:"Checkout API",sub:"Stripe · CMI · PayPal",icon:"💳",code:`// POST /api/checkout\nconst session = await stripe.checkout\n  .sessions.create({\n    line_items: cartItems,\n    mode: 'payment',\n    success_url: '/merci',\n  })`,course:"Slides 80–84 · Paiements"},
      {id:"webhook",x:600,label:"Webhook",sub:"Events Stripe → DB",icon:"🔄",code:`// POST /api/webhook\nswitch (event.type) {\n  case 'checkout.session.completed':\n    await updateOrderStatus({\n      id: orderId, status: 'paid'\n    })\n    await sendConfirmEmail()\n    break\n}`,course:"Slides 86 · Chaîne O2C"},
    ]
  },
  {
    id:"data", y:2, label:"COUCHE DONNÉES", color:C.amber,
    nodes:[
      {id:"db",x:100,label:"Base de Données",sub:"PostgreSQL / Supabase",icon:"🗄️",code:`-- Table produits avec RLS\nCREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name TEXT NOT NULL,\n  price NUMERIC(10,2),\n  stock INT DEFAULT 0\n);\n-- Sécurité : lecture publique\nCREATE POLICY "public_read"\n  ON products FOR SELECT\n  USING (status = 'active');`,course:"Slides 69 · Big Data"},
      {id:"storage",x:300,label:"Stockage Fichiers",sub:"Images · Médias · Docs",icon:"🗂️",code:`// Upload image produit\nconst { data } = await supabase\n  .storage\n  .from('product-images')\n  .upload(fileName, file, {\n    contentType: 'image/webp',\n    upsert: true\n  })`,course:"Slides 65–68 · Cloud"},
      {id:"cache",x:490,label:"Cache / Redis",sub:"Sessions · Panier · KPIs",icon:"⚡",code:`// Cache du panier utilisateur\nawait redis.setex(\n  \`cart:\${userId}\`,\n  3600, // TTL: 1 heure\n  JSON.stringify(cartItems)\n)\n// Lecture instantanée\nconst cart = await redis.get(\`cart:\${userId}\`)`,course:"Slides 98 · Performance"},
    ]
  },
  {
    id:"infra", y:3, label:"COUCHE INFRASTRUCTURE", color:C.violet,
    nodes:[
      {id:"cicd",x:90,label:"CI/CD Pipeline",sub:"GitHub Actions → Vercel",icon:"🔧",code:`# .github/workflows/deploy.yml\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    steps:\n      - run: npm test\n      - run: vercel --prod`,course:"Slides 92 · Alignement Tech"},
      {id:"monitoring",x:280,label:"Monitoring",sub:"Logs · Alertes · Uptime",icon:"📊",code:`// Vercel Analytics\nimport { track } from '@vercel/analytics'\n\n// Événement personnalisé\ntrack('purchase', {\n  amount: order.total,\n  currency: 'MAD',\n  products: order.items.length\n})`,course:"Slides 108 · KPIs Scaling"},
      {id:"security",x:470,label:"Sécurité",sub:"SSL · WAF · PCI DSS",icon:"🛡️",code:`// En-têtes de sécurité HTTP\nconst securityHeaders = [\n  { key: 'X-Frame-Options',\n    value: 'DENY' },\n  { key: 'Content-Security-Policy',\n    value: "default-src 'self'" },\n  { key: 'Strict-Transport-Security',\n    value: 'max-age=63072000' }\n]`,course:"Slides 77 · Sécurité E-commerce"},
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
  {icon:"📦",label:"Stock\ndécrémenté",sub:"DB trigger SQL",color:C.amber,slide:"Slides 92"},
  {icon:"📧",label:"Email de\nconfirmation",sub:"Resend API",color:C.cyan,slide:"Slide 101"},
];

const DB_TABLES = [
  {name:"products",color:C.amber,fields:[["id","UUID 🔑"],["name","TEXT"],["price","NUMERIC"],["stock","INT"],["status","ENUM"],["images","JSONB"]]},
  {name:"orders",color:C.cyan,fields:[["id","UUID 🔑"],["user_id","FK →"],["total","NUMERIC"],["status","ENUM"],["stripe_id","TEXT"],["created_at","TIMESTAMP"]]},
  {name:"order_items",color:C.green,fields:[["id","UUID 🔑"],["order_id","FK →"],["product_id","FK →"],["qty","INT"],["price","NUMERIC"]]},
  {name:"profiles",color:C.violet,fields:[["id","UUID 🔑"],["email","TEXT"],["role","ENUM"],["stripe_customer","TEXT"]]},
  {name:"cart_items",color:C.red,fields:[["session_id","TEXT"],["product_id","FK →"],["qty","INT"],["created_at","TIMESTAMP"]]},
];

const SECURITY_LAYERS = [
  {level:1,label:"HTTPS / TLS 1.3",desc:"Chiffrement de toutes les communications",tech:"Certificat SSL automatique — Vercel",course:"Slide 77",color:C.cyan},
  {level:2,label:"Authentification JWT",desc:"Tokens signés, expiration 24h, rotation automatique",tech:"Supabase Auth / NextAuth.js",course:"Slide 78",color:C.green},
  {level:3,label:"Row Level Security",desc:"Chaque utilisateur ne voit que ses données",tech:"PostgreSQL RLS Policies",course:"Slide 122",color:C.amber},
  {level:4,label:"PCI DSS Level 1",desc:"Données bancaires jamais stockées sur nos serveurs",tech:"Stripe Tokenisation + AES-256",course:"Slide 77",color:C.violet},
  {level:5,label:"Rate Limiting",desc:"Protection contre les attaques par force brute",tech:"Vercel Edge Middleware",course:"Slide 76",color:C.red},
];

/* ── VIEWS ── */
const VIEWS = [
  {id:"architecture",icon:"◈",label:"Architecture"},
  {id:"payment",icon:"◎",label:"Flux Paiement"},
  {id:"database",icon:"⊞",label:"Base de Données"},
  {id:"security",icon:"🛡",label:"Sécurité"},
  {id:"deploy",icon:"⟶",label:"Déploiement"},
];

/* ════ MAIN APP ════ */
export default function EcomXRay() {
  const [view, setView] = useState("architecture");
  const [selected, setSelected] = useState(null);
  const [payStep, setPayStep] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);

  // Auto-advance payment flow
  useEffect(() => {
    if (autoPlay && view === "payment") {
      if (payStep < PAYMENT_STEPS.length - 1) {
        timerRef.current = setTimeout(() => setPayStep(s => s + 1), 1200);
      } else {
        setAutoPlay(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [autoPlay, payStep, view]);

  const startPayFlow = () => { setPayStep(0); setAutoPlay(true); };
  const resetPayFlow = () => { setPayStep(-1); setAutoPlay(false); };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}}>
      <style>{CSS}</style>

      {/* ── TOP BAR ── */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.b}`,padding:"0 20px",display:"flex",alignItems:"center",gap:16,height:50,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:6,background:`linear-gradient(135deg,${C.cyan},${C.cyanD})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:12,color:C.bg}}>X</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,letterSpacing:"0.04em"}}>E-commerce X-Ray</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,letterSpacing:"0.06em"}}>— Anatomie d'une plateforme réelle</span>
        </div>

        {/* View switcher */}
        <div style={{display:"flex",gap:3,marginLeft:"auto"}}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => { setView(v.id); setSelected(null); }}
              style={{background:view===v.id?C.s3:"transparent",border:`1px solid ${view===v.id?C.b:"transparent"}`,borderRadius:7,padding:"4px 12px",color:view===v.id?C.text:C.sub,fontSize:11,cursor:"pointer",fontWeight:600,letterSpacing:"0.06em",transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* Live ticker */}
        <div style={{overflow:"hidden",width:220,background:C.s2,borderRadius:6,border:`1px solid ${C.b}`,padding:"3px 8px",fontSize:10,color:C.sub,fontFamily:"'JetBrains Mono',monospace"}}>
          <div style={{whiteSpace:"nowrap",animation:"ticker 14s linear infinite",display:"inline-block"}}>
            ✦ Cours Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;✦ Cours Dr. H. Faouzi · ENCG Kénitra 2025/2026 &nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {view === "architecture" && <ArchitectureView selected={selected} setSelected={setSelected}/>}
        {view === "payment" && <PaymentView payStep={payStep} autoPlay={autoPlay} onStart={startPayFlow} onReset={resetPayFlow}/>}
        {view === "database" && <DatabaseView/>}
        {view === "security" && <SecurityView/>}
        {view === "deploy" && <DeployView/>}
      </div>
    </div>
  );
}

/* ════ ARCHITECTURE VIEW ════ */
function ArchitectureView({selected,setSelected}) {
  const sel = selected ? LAYERS.flatMap(l=>l.nodes).find(n=>n.id===selected) : null;

  // Node positions for SVG connections (approximate, fixed layout)
  const nodePos = {
    browser:{x:170,y:90}, mobile:{x:370,y:90}, cdn:{x:570,y:90},
    products_api:{x:130,y:230}, auth_api:{x:310,y:230}, checkout_api:{x:490,y:230}, webhook:{x:650,y:230},
    db:{x:150,y:370}, storage:{x:350,y:370}, cache:{x:540,y:370},
    cicd:{x:140,y:490}, monitoring:{x:330,y:490}, security:{x:520,y:490},
  };

  return (
    <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 340px",overflow:"hidden"}}>
      {/* Main diagram */}
      <div style={{overflowY:"auto",padding:"20px 16px",position:"relative"}}>
        <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.text}}>Architecture en couches</h2>
          <span style={{fontSize:10,color:C.sub,fontFamily:"'Outfit',sans-serif"}}>Cliquez sur un composant pour voir son code</span>
        </div>

        {/* SVG connections */}
        <svg style={{position:"absolute",top:70,left:0,width:"100%",height:600,pointerEvents:"none",zIndex:0}} className="flowing">
          {CONNECTIONS.map((c,i) => {
            const f=nodePos[c.from], t=nodePos[c.to];
            if(!f||!t) return null;
            const mx=(f.x+t.x)/2, my=(f.y+t.y)/2;
            return (
              <g key={i}>
                <path d={`M${f.x},${f.y} C${f.x},${my} ${t.x},${my} ${t.x},${t.y}`}
                  stroke={c.color} strokeWidth={1.5} fill="none" opacity={0.35}
                  strokeDasharray="6 3"/>
                <circle cx={t.x} cy={t.y} r={3} fill={c.color} opacity={0.6}/>
              </g>
            );
          })}
        </svg>

        {/* Layers */}
        {LAYERS.map((layer,li) => (
          <div key={layer.id} className="fu" style={{marginBottom:20,animation:`fadeUp .4s ease ${li*.1}s both`,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,${layer.color}44,transparent)`}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:600,color:layer.color,letterSpacing:"0.18em"}}>{layer.label}</span>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,transparent,${layer.color}44)`}}/>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {layer.nodes.map(node => (
                <div key={node.id} onClick={()=>setSelected(selected===node.id?null:node.id)}
                  style={{background:selected===node.id?`${layer.color}18`:C.s2,border:`1px solid ${selected===node.id?layer.color:C.b}`,borderRadius:12,padding:"12px 16px",cursor:"pointer",transition:"all .2s",minWidth:150,flex:1,maxWidth:200,position:"relative",overflow:"hidden"}}>
                  {selected===node.id && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:layer.color,borderRadius:"12px 12px 0 0"}}/>}
                  <div style={{fontSize:22,marginBottom:6}}>{node.icon}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,color:C.text,marginBottom:2}}>{node.label}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:layer.color,marginBottom:4}}>{node.sub}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.dim,background:C.s1,borderRadius:4,padding:"2px 6px",display:"inline-block"}}>{node.course}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{background:C.s1,borderLeft:`1px solid ${C.b}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {sel ? (
          <div className="si" style={{flex:1,overflowY:"auto",padding:20}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:16}}>
              <span style={{fontSize:28}}>{sel.icon}</span>
              <div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text,marginBottom:2}}>{sel.label}</h3>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.cyan}}>{sel.sub}</div>
              </div>
            </div>
            <div style={{background:"#020609",border:`1px solid ${C.b}`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.dim,letterSpacing:"0.1em",marginBottom:8}}>CODE RÉEL</div>
              <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#C8E6FF",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                <CodeHighlight code={sel.code}/>
              </pre>
            </div>
            <div style={{background:`${C.cyan}10`,border:`1px solid ${C.cyan}30`,borderRadius:8,padding:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.cyan,letterSpacing:"0.1em",marginBottom:4}}>RÉFÉRENCE COURS</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text}}>{sel.course}</div>
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12,opacity:.4}}>◈</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:C.sub,lineHeight:1.7}}>Cliquez sur un composant pour explorer son code source et sa référence dans le cours</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Code Highlighter (simple) ── */
function CodeHighlight({code}) {
  const lines = code.split('\n');
  return lines.map((line,i) => {
    const isComment = line.trim().startsWith('//') || line.trim().startsWith('--') || line.trim().startsWith('#');
    const isKeyword = /\b(const|let|await|async|return|export|default|function|import|from|if|switch|case|break|CREATE|TABLE|POLICY|ON|FOR|USING|SELECT|INSERT|UPDATE)\b/.test(line);
    const isString = line.includes("'") || line.includes('"') || line.includes('`');
    return (
      <div key={i} style={{color: isComment?"#4A7A6A": isKeyword?"#80CFFF":"#C8E6FF",lineHeight:1.7}}>
        {line || ' '}
      </div>
    );
  });
}

/* ════ PAYMENT FLOW VIEW ════ */
function PaymentView({payStep,autoPlay,onStart,onReset}) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.text,marginBottom:4}}>Flux de paiement — Anatomie d'une transaction</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub}}>Slides 80–86 · Ce qui se passe en 3 secondes quand un client clique "Acheter"</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {payStep===-1
              ? <Btn onClick={onStart} color={C.green}>▶ Lancer la simulation</Btn>
              : <>
                  {!autoPlay && payStep<PAYMENT_STEPS.length-1 && <Btn onClick={()=>onStart()} color={C.cyan}>▶ Reprendre</Btn>}
                  <Btn onClick={onReset} color={C.sub} outline>↺ Recommencer</Btn>
                </>
            }
          </div>
        </div>

        {/* Flow steps */}
        <div style={{display:"flex",gap:0,alignItems:"flex-start",marginBottom:36,overflowX:"auto",paddingBottom:8}}>
          {PAYMENT_STEPS.map((step,i) => {
            const active = i === payStep;
            const done = i < payStep;
            const waiting = i > payStep;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{textAlign:"center",width:110,opacity:waiting?0.3:1,transition:"all .5s"}}>
                  <div style={{position:"relative",width:56,height:56,margin:"0 auto 8px",borderRadius:"50%",
                    background:active?`${step.color}30`:done?`${step.color}20`:C.s2,
                    border:`2px solid ${active||done?step.color:C.b}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                    transition:"all .5s",
                    boxShadow:active?`0 0 20px ${step.color}55`:"none"}}>
                    {done ? <span style={{fontSize:18,color:step.color}}>✓</span> : step.icon}
                    {active && <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:`1px solid ${step.color}`,animation:"ping 1s ease infinite"}}/>}
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:active?step.color:done?C.text:C.dim,whiteSpace:"pre-line",lineHeight:1.4,marginBottom:4}}>{step.label}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>{step.sub}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:step.color,marginTop:4,background:`${step.color}12`,borderRadius:4,padding:"1px 6px",display:"inline-block"}}>{step.slide}</div>
                </div>
                {i < PAYMENT_STEPS.length-1 && (
                  <div style={{width:24,height:2,background:i<payStep?PAYMENT_STEPS[i].color:C.b,transition:"all .6s",flexShrink:0,position:"relative",top:-18}}>
                    {i<payStep && <div style={{position:"absolute",right:-4,top:-2,width:6,height:6,borderRadius:"50%",background:PAYMENT_STEPS[i].color}}/>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active step detail */}
        {payStep >= 0 && (
          <div className="fu" style={{background:C.s2,border:`1px solid ${PAYMENT_STEPS[Math.min(payStep,PAYMENT_STEPS.length-1)].color}44`,borderRadius:14,padding:20,marginBottom:24}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              <DetailBox label="Protocole actif" value="TLS 1.3 + HTTPS" color={C.cyan}/>
              <DetailBox label="Durée de l'étape" value={["0ms","~80ms","~120ms","~200ms","~50ms","~30ms","~400ms"][payStep]||"—"} color={C.green}/>
              <DetailBox label="Référence" value={PAYMENT_STEPS[Math.min(payStep,PAYMENT_STEPS.length-1)]?.slide} color={C.amber}/>
            </div>
          </div>
        )}

        {/* Key concepts grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {title:"Pourquoi TLS/SSL ?",body:"Chaque octet échangé entre le navigateur et le serveur est chiffré. Sans SSL, les données bancaires transitent en clair — interceptables. (Slide 77)",color:C.cyan},
            {title:"Qu'est-ce qu'un Webhook ?",body:"Stripe appelle automatiquement notre API quand le paiement réussit. Sans webhook, on ne saurait jamais si le client a vraiment payé. (Slide 86)",color:C.green},
            {title:"Tokenisation bancaire",body:"Le numéro de carte n'est jamais stocké sur nos serveurs. Stripe génère un token unique (ex: tok_1ABc2D). Conformité PCI DSS Level 1. (Slide 77)",color:C.amber},
            {title:"Idempotence des paiements",body:"Si le webhook est reçu deux fois, la commande ne doit pas être créée deux fois. On vérifie l'ID Stripe avant chaque insertion. (Slide 86)",color:C.violet},
          ].map(card => (
            <div key={card.title} style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:12,padding:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:card.color,marginBottom:6}}>{card.title}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub,lineHeight:1.7}}>{card.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════ DATABASE VIEW ════ */
function DatabaseView() {
  const [hoveredTable, setHoveredTable] = useState(null);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{marginBottom:24}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.text,marginBottom:4}}>Schéma de la Base de Données</h2>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub}}>Slides 69 · Big Data — Les tables qui stockent TOUTE la logique métier</div>
        </div>

        {/* ERD visual */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:28}}>
          {DB_TABLES.map(table => (
            <div key={table.name} onMouseEnter={()=>setHoveredTable(table.name)} onMouseLeave={()=>setHoveredTable(null)}
              style={{background:C.s2,border:`1px solid ${hoveredTable===table.name?table.color:C.b}`,borderRadius:12,overflow:"hidden",transition:"all .2s",minWidth:160,flex:1,maxWidth:200,boxShadow:hoveredTable===table.name?`0 0 20px ${table.color}22`:"none"}}>
              <div style={{background:`${table.color}18`,padding:"8px 14px",borderBottom:`1px solid ${table.color}33`,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.dim}}>TABLE</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:12,color:table.color}}>{table.name}</span>
              </div>
              {table.fields.map(([field,type]) => (
                <div key={field} style={{padding:"5px 14px",borderBottom:`1px solid ${C.b}44`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:field==="id"?table.color:C.text}}>{field}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>{type}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Relationships */}
        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub,letterSpacing:"0.14em",marginBottom:14}}>RELATIONS ENTRE TABLES</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              ["orders","→","profiles","1 client peut avoir plusieurs commandes",C.cyan],
              ["order_items","→","orders","1 commande contient plusieurs articles",C.green],
              ["order_items","→","products","1 article référence 1 produit",C.amber],
              ["cart_items","→","products","Le panier temporaire référence les produits",C.violet],
            ].map(([t1,arr,t2,desc,color])=>(
              <div key={t1+t2} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:C.s2,borderRadius:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color}}>{t1}</span>
                <span style={{color:C.dim,fontSize:14}}>{arr}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color}}>{t2}</span>
                <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginLeft:8}}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Big Data concept */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {icon:"📊",label:"Volume",value:"Millions de lignes",desc:"Chaque visite, clic, commande = 1 ligne"},
            {icon:"⚡",label:"Vélocité",value:"Temps réel",desc:"Stock mis à jour à chaque achat"},
            {icon:"🔀",label:"Variété",value:"SQL + JSON + Fichiers",desc:"Texte, images, événements, logs"},
          ].map(v=>(
            <div key={v.label} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:12,padding:16}}>
              <div style={{fontSize:24,marginBottom:6}}>{v.icon}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.amber,letterSpacing:"0.12em",marginBottom:2}}>{v.label.toUpperCase()}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{v.value}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════ SECURITY VIEW ════ */
function SecurityView() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{marginBottom:24}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.text,marginBottom:4}}>Modèle de Sécurité en Oignon</h2>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub}}>Slides 74–78 · 5 couches de protection superposées</div>
        </div>

        {/* Onion layers */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
          {SECURITY_LAYERS.map((layer,i) => (
            <div key={layer.level} onClick={()=>setExpanded(expanded===i?null:i)}
              style={{background:expanded===i?`${layer.color}10`:C.s2,border:`1px solid ${expanded===i?layer.color:C.b}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",transition:"all .25s",marginLeft:`${i*20}px`,marginRight:`${i*20}px`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${layer.color}22`,border:`2px solid ${layer.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:layer.color,flexShrink:0}}>{layer.level}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:layer.color}}>{layer.label}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>{layer.desc}</div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,background:C.s1,borderRadius:4,padding:"2px 8px"}}>{layer.course}</div>
                <span style={{color:C.dim,fontSize:12}}>{expanded===i?"▲":"▼"}</span>
              </div>
              {expanded===i && (
                <div className="fu" style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${layer.color}22`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.sub}}>TECHNOLOGIE : </span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:layer.color}}>{layer.tech}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Threat matrix */}
        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.b}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.text}}>Matrice des Menaces (Slide 76)</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
            <thead><tr style={{background:C.bg}}>
              {["Menace","Exemple","Couche de protection","Risque si ignoré"].map(h=>(
                <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:9,color:C.dim,letterSpacing:"0.12em",fontWeight:700,borderBottom:`1px solid ${C.b}`}}>{h.toUpperCase()}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                ["Phishing","Faux email Amazon","Éducation + MFA",C.red,"Comptes volés"],
                ["Fuite de données","Mauvais paramètre SQL","RLS + Validation",C.amber,"Amendes RGPD"],
                ["MITM","Réseau Wi-Fi public","TLS 1.3",C.cyan,"Données interceptées"],
                ["Brute Force","10k tentatives/sec","Rate Limiting",C.violet,"Comptes compromis"],
                ["Fraude paiement","Carte volée","PCI DSS + 3DS2",C.green,"Chargebacks"],
              ].map(([threat,ex,prot,color,risk])=>(
                <tr key={threat} style={{borderBottom:`1px solid ${C.b}44`}}>
                  <td style={{padding:"9px 14px",fontWeight:600,color}}>{threat}</td>
                  <td style={{padding:"9px 14px",color:C.sub,fontSize:11}}>{ex}</td>
                  <td style={{padding:"9px 14px"}}><span style={{background:`${color}15`,border:`1px solid ${color}33`,borderRadius:4,padding:"2px 8px",fontSize:10,color}}>{prot}</span></td>
                  <td style={{padding:"9px 14px",color:C.sub,fontSize:11}}>{risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ════ DEPLOY VIEW ════ */
function DeployView() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const PIPELINE = [
    {icon:"👨‍💻",label:"git push origin main",sub:"Le développeur pousse le code",color:C.cyan,log:["[git] Compressing objects: 100%","[git] Writing objects: 100% (12/12)","[git] To github.com:store/repo.git","[git]    abc123..def456  main → main"]},
    {icon:"⚙️",label:"GitHub Actions déclenché",sub:"Tests automatiques lancés",color:C.amber,log:["[CI] Triggered by push to main","[CI] Running: npm install","[CI] Running: npm test","[CI] ✓ 47 tests passed in 8.2s","[CI] Running: npm run build","[CI] ✓ Build successful (2.1MB)"]},
    {icon:"🔍",label:"Vérifications qualité",sub:"Lint · Types · Sécurité",color:C.violet,log:["[lint] ESLint: 0 errors, 2 warnings","[types] TypeScript: no errors","[audit] 0 vulnerabilities found","[lighthouse] Performance: 94/100","[lighthouse] SEO: 100/100"]},
    {icon:"🌍",label:"Déploiement Vercel",sub:"Edge Network mondial",color:C.green,log:["[vercel] Building application...","[vercel] Deploying to 42 edge regions","[vercel] ✓ Casablanca — ready","[vercel] ✓ Paris — ready","[vercel] ✓ New York — ready","[vercel] 🎉 https://store.vercel.app"]},
    {icon:"🗄️",label:"Migration DB Supabase",sub:"Nouvelles colonnes / tables",color:C.amber,log:["[db] Connecting to PostgreSQL...","[db] Running migration 002_add_reviews","[db] ALTER TABLE products ADD COLUMN...","[db] CREATE INDEX idx_reviews_product","[db] ✓ Migration complete"]},
    {icon:"✅",label:"Boutique en production",sub:"0 downtime — utilisateurs non impactés",color:C.green,log:["[health] GET / → 200 OK (43ms)","[health] GET /api/products → 200 (12ms)","[health] POST /api/checkout → 200 (89ms)","[monitor] Uptime: 99.97% (30 days)","[alert] 0 errors in last 5 minutes","🚀 Deployment complete! Cost: $0.00"]},
  ];

  const runPipeline = () => {
    setStep(0); setRunning(true);
    PIPELINE.forEach((_,i) => setTimeout(()=>{
      setStep(i);
      if(i===PIPELINE.length-1) setRunning(false);
    }, i*1400));
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:C.text,marginBottom:4}}>Pipeline CI/CD — De l'IDE à la Production</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sub}}>Slides 92 · Chaque commit déclenche un déploiement automatique et sécurisé</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {!running && <Btn onClick={runPipeline} color={C.green}>▶ Simuler un déploiement</Btn>}
            {(step>=0||running) && <Btn onClick={()=>{setStep(-1);setRunning(false);}} color={C.sub} outline>↺ Reset</Btn>}
          </div>
        </div>

        {/* Pipeline stages */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
          {PIPELINE.map((p,i) => {
            const done=i<step, active=i===step, future=i>step;
            return (
              <div key={i} style={{background:active?`${p.color}15`:done?C.s2:C.s1,border:`1px solid ${active?p.color:done?C.b2:C.b}`,borderRadius:12,padding:14,transition:"all .4s",opacity:future&&step>=0?0.4:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:done||active?`${p.color}20`:C.s3,border:`2px solid ${done||active?p.color:C.b}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,transition:"all .4s",boxShadow:active?`0 0 16px ${p.color}55`:"none"}}>
                    {done?"✓":p.icon}
                  </div>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:active?p.color:done?C.green:C.dim}}>{p.label}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{p.sub}</div>
                  </div>
                </div>
                {(active||done) && (
                  <div className="fu" style={{background:"#010508",borderRadius:8,padding:"8px 10px",maxHeight:90,overflow:"hidden"}}>
                    {p.log.map((l,j)=>(
                      <div key={j} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:l.includes("✓")||l.includes("🎉")||l.includes("🚀")?C.green:l.includes("error")||l.includes("FAIL")?C.red:C.sub,lineHeight:1.6,animation:`fadeUp .2s ease ${j*.08}s both`}}>{l}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cost breakdown */}
        <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.b}`,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.text}}>Coût réel de la stack</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.green,background:`${C.green}12`,borderRadius:4,padding:"2px 8px"}}>FREE TIER = 0 MAD/mois</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
            <thead><tr style={{background:C.bg}}>
              {["Service","Rôle","Limite gratuite","Au-delà"].map(h=>(
                <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:9,color:C.dim,letterSpacing:"0.1em",fontWeight:700,borderBottom:`1px solid ${C.b}`}}>{h.toUpperCase()}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                ["Vercel","Hébergement + CDN","100 GB bande passante","$20/mois",C.cyan],
                ["Supabase","DB + Auth + Storage","500 MB DB · 1 GB storage","$25/mois",C.green],
                ["Stripe","Paiements","Gratuit","2.9% + $0.30 / transaction",C.amber],
                ["GitHub","Code + CI/CD","Illimité (public)","$4/mois (privé)",C.violet],
                ["Resend","Emails transactionnels","3 000 emails/mois","$20/mois",C.sub],
              ].map(([svc,role,free,paid,color])=>(
                <tr key={svc} style={{borderBottom:`1px solid ${C.b}44`}}>
                  <td style={{padding:"9px 14px",fontWeight:700,color}}>{svc}</td>
                  <td style={{padding:"9px 14px",color:C.sub,fontSize:11}}>{role}</td>
                  <td style={{padding:"9px 14px"}}><span style={{color:C.green,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>✓ {free}</span></td>
                  <td style={{padding:"9px 14px",color:C.dim,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Shared helpers ── */
function Btn({children,onClick,color=C.cyan,outline=false,style:s={}}) {
  return (
    <button onClick={onClick} style={{background:outline?"transparent":`${color}22`,border:`1px solid ${outline?C.b:color}`,borderRadius:8,padding:"7px 16px",color:outline?C.sub:color,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em",transition:"all .2s",...s}}>
      {children}
    </button>
  );
}
function DetailBox({label,value,color}) {
  return (
    <div style={{background:C.s1,border:`1px solid ${C.b}`,borderRadius:10,padding:"10px 14px"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.dim,letterSpacing:"0.12em",marginBottom:4}}>{label.toUpperCase()}</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:14,color}}>{value}</div>
    </div>
  );
}
