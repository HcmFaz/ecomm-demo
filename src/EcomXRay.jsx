import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   NouaSell v4.1 · Boutique Premium Artisanat Marocain
   Dr. H. Faouzi · ENCG Kénitra 2025/2026
   UPDATE v4.1 : Narration visuelle authentique
   — Passeport visuel 3 types : Produit / Fabrication / Contexte
   — Fallback CSS artisanal (grain, pigment, texture)
   — Légendes et étiquettes sur chaque image
═══════════════════════════════════════════════════════════════ */

export const LangCtx = createContext({ lang:"fr", setLang:()=>{} });
export const useT = () => {
  const { lang } = useContext(LangCtx);
  return (key) => TRANS[lang]?.[key] || TRANS.fr[key] || key;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{background:#F5EDE0;color:#2C1F0E;font-family:'Outfit',sans-serif;overflow:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#C4A882;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(110%);opacity:0}}
@keyframes heartPop{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rotateIn{from{transform:rotate(-180deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
@keyframes pulseGlow{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes cartBounce{0%,100%{transform:scale(1)}35%{transform:scale(1.3)}70%{transform:scale(.9)}}
@keyframes checkPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes grainMove{0%{transform:translate(0,0)}25%{transform:translate(-2px,1px)}50%{transform:translate(1px,-2px)}75%{transform:translate(-1px,2px)}100%{transform:translate(0,0)}}
.fu{animation:fadeUp .4s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.skel{background:linear-gradient(90deg,#EDE0CC 25%,#E5D4BB 50%,#EDE0CC 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;}
/* Grain texture overlay */
.grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");pointer-events:none;opacity:.35;mix-blend-mode:multiply;animation:grainMove 4s steps(2) infinite;}
`;

const C = {
  bg:"#F5EDE0", bg2:"#EDE0CC", bg3:"#E5D4BB",
  border:"#DDD0BA", border2:"#C4A882",
  text:"#2C1F0E", text2:"#6B5A42", sub:"#9B8A6E",
  gold:"#C9A96E", amber:"#C17F3B", sage:"#6B7C5E",
  terra:"#C4572A", sand:"#E8D5B7", dark:"#2C1F0E",
  cream:"#FAFAF7",
  green_s:"#4A7C59",
  xbg:"#04080F", xs1:"#080F1A", xs2:"#0C1520", xs3:"#101C2A",
  xb:"#112233", xb2:"#1A3050",
  cyan:"#00D4FF", green:"#00FF88", xambr:"#FFB300",
  red:"#FF4466", violet:"#9B7FFF", pink:"#F472B6",
  xtext:"#D4E8F8", xsub:"#5A8AAA", xdim:"#2A4A66",
};

const RATES={MAD:1,EUR:0.092,USD:0.099,GBP:0.079};
const SYM={MAD:"MAD",EUR:"€",USD:"$",GBP:"£"};
const PROMOS={"ENCG2025":10,"MAROC10":10,"ARTISAN15":15};
const CATS=["Tous","Mode","Maison","Beauté","Épicerie"];
const CATS_MAP={
  fr:{all:"Tout",Mode:"Mode",Maison:"Maison",Beauté:"Beauté","Épicerie":"Épicerie"},
  en:{all:"All",Mode:"Fashion",Maison:"Home",Beauté:"Beauty","Épicerie":"Food"},
  ar:{all:"الكل",Mode:"أزياء",Maison:"منزل",Beauté:"جمال","Épicerie":"طعام"},
};

const TRANS={
  fr:{tagline:"L'artisanat marocain authentique",subtitle:"Chaque pièce raconte une histoire.\nChaque achat soutient un artisan.",discover:"Découvrir la collection",hero_badge:"ARTISANAT CERTIFIÉ MAROC",shop:"Boutique",artisan_nav:"Artisans",impact_nav:"Impact",cart:"Panier",wishlist:"Favoris",profile:"Profil",admin:"Admin",xray:"X-Ray",back:"Retour",add_to_cart:"Ajouter au panier",added:"Ajouté !",view_product:"Découvrir",by:"Par",from:"de",tradition:"Tradition",material:"Matière",technique:"Technique",the_story:"L'histoire",the_artisan:"L'artisan",traceability:"Traçabilité & origine",the_impact:"Impact",certificate:"Certificat d'authenticité",families:"familles soutenues",years:"ans de tradition",coops:"coopératives partenaires",artisans_n:"artisans certifiés",certified:"Certifié authentique",handmade:"Fait main",fair_trade:"Commerce équitable",region_l:"Région",delivery:"Livraison",free_above:"Gratuite dès 500 MAD",standard:"Standard",express:"Express",promo:"Code promo",apply:"Appliquer",subtotal:"Sous-total",total:"Total",checkout:"Passer la commande",shipping:"Informations de livraison",payment:"Paiement",confirmation:"Confirmation",confirmed:"Commande confirmée",continue:"Continuer mes achats",empty_cart:"Votre panier est vide",empty_wish:"Votre liste est vide",explore:"Explorer les produits",my_orders:"Mes commandes",loyalty:"Programme fidélité",pts:"points",no_orders:"Aucune commande pour l'instant",search:"Rechercher...",sort_pop:"Plus populaires",sort_rate:"Mieux notés",sort_asc:"Prix croissant",sort_desc:"Prix décroissant",compare:"Comparer",reviews:"Avis",verified:"Achat vérifié",qty:"Quantité",color:"Couleur",size:"Taille",stock_label:"En stock",low_stock:"Plus que",share:"Partager",send:"→",chat_ph:"Posez votre question...",chat_title:"Assistant IA NouaSell",name_f:"Nom complet",email_f:"Email",phone_f:"Téléphone",address_f:"Adresse",city_f:"Ville",pay_now:"Payer",tracking:"Suivi de commande",pts_earned:"points fidélité gagnés",overview:"Tableau de bord",products_t:"Produits",analytics_t:"Analytics",rev_t:"Avis clients",our_artisans:"Nos artisans",our_regions:"Régions du Maroc",our_impact:"Notre impact",impact_tagline:"Chaque achat a un visage.",
   img_product:"Produit",img_making:"Fabrication",img_context:"Contexte",img_detail:"Détail",passeport:"Passeport visuel"},
  en:{tagline:"Authentic Moroccan Craftsmanship",subtitle:"Every piece tells a story.\nEvery purchase supports an artisan.",discover:"Discover the collection",hero_badge:"CERTIFIED MOROCCAN CRAFTS",shop:"Shop",artisan_nav:"Artisans",impact_nav:"Impact",cart:"Cart",wishlist:"Wishlist",profile:"Profile",admin:"Admin",xray:"X-Ray",back:"Back",add_to_cart:"Add to cart",added:"Added!",view_product:"Discover",by:"By",from:"from",tradition:"Tradition",material:"Material",technique:"Technique",the_story:"The story",the_artisan:"The artisan",traceability:"Traceability & origin",the_impact:"Impact",certificate:"Certificate of authenticity",families:"families supported",years:"years of tradition",coops:"partner cooperatives",artisans_n:"certified artisans",certified:"Certified authentic",handmade:"Handmade",fair_trade:"Fair trade",region_l:"Region",delivery:"Delivery",free_above:"Free above 500 MAD",standard:"Standard",express:"Express",promo:"Promo code",apply:"Apply",subtotal:"Subtotal",total:"Total",checkout:"Proceed to checkout",shipping:"Shipping information",payment:"Payment",confirmation:"Confirmation",confirmed:"Order confirmed",continue:"Continue shopping",empty_cart:"Your cart is empty",empty_wish:"Your wishlist is empty",explore:"Explore products",my_orders:"My orders",loyalty:"Loyalty program",pts:"points",no_orders:"No orders yet",search:"Search...",sort_pop:"Most popular",sort_rate:"Best rated",sort_asc:"Price: low to high",sort_desc:"Price: high to low",compare:"Compare",reviews:"Reviews",verified:"Verified purchase",qty:"Quantity",color:"Color",size:"Size",stock_label:"In stock",low_stock:"Only",share:"Share",send:"→",chat_ph:"Ask your question...",chat_title:"NouaSell AI Assistant",name_f:"Full name",email_f:"Email",phone_f:"Phone",address_f:"Address",city_f:"City",pay_now:"Pay now",tracking:"Order tracking",pts_earned:"loyalty points earned",overview:"Dashboard",products_t:"Products",analytics_t:"Analytics",rev_t:"Customer reviews",our_artisans:"Our artisans",our_regions:"Regions of Morocco",our_impact:"Our impact",impact_tagline:"Every purchase has a face.",
   img_product:"Product",img_making:"Making of",img_context:"Context",img_detail:"Detail",passeport:"Visual passport"},
  ar:{tagline:"الحرف المغربية الأصيلة",subtitle:"كل قطعة تحكي قصة.\nكل شراء يدعم حرفياً.",discover:"اكتشف المجموعة",hero_badge:"حرف مغربية معتمدة",shop:"المتجر",artisan_nav:"الحرفيون",impact_nav:"التأثير",cart:"السلة",wishlist:"المفضلة",profile:"الملف",admin:"الإدارة",xray:"X-Ray",back:"رجوع",add_to_cart:"أضف إلى السلة",added:"تمت الإضافة!",view_product:"اكتشف",by:"بقلم",from:"من",tradition:"التقليد",material:"المادة",technique:"التقنية",the_story:"القصة",the_artisan:"الحرفي",traceability:"التتبع والأصل",the_impact:"التأثير",certificate:"شهادة الأصالة",families:"عائلة مدعومة",years:"سنة من التقليد",coops:"تعاونية شريكة",artisans_n:"حرفي معتمد",certified:"معتمد أصيل",handmade:"صنع يدوي",fair_trade:"تجارة عادلة",region_l:"المنطقة",delivery:"التوصيل",free_above:"مجاني من 500 درهم",standard:"عادي",express:"سريع",promo:"رمز الترويج",apply:"تطبيق",subtotal:"المجموع الجزئي",total:"المجموع",checkout:"إتمام الطلب",shipping:"معلومات الشحن",payment:"الدفع",confirmation:"تأكيد",confirmed:"تم تأكيد الطلب",continue:"مواصلة التسوق",empty_cart:"سلتك فارغة",empty_wish:"قائمة المفضلة فارغة",explore:"تصفح المنتجات",my_orders:"طلباتي",loyalty:"برنامج الولاء",pts:"نقطة",no_orders:"لا توجد طلبات بعد",search:"بحث...",sort_pop:"الأكثر شعبية",sort_rate:"الأعلى تقييماً",sort_asc:"السعر: من الأدنى",sort_desc:"السعر: من الأعلى",compare:"مقارنة",reviews:"التقييمات",verified:"شراء موثق",qty:"الكمية",color:"اللون",size:"المقاس",stock_label:"متوفر",low_stock:"بقي",share:"مشاركة",send:"→",chat_ph:"اطرح سؤالك...",chat_title:"مساعد NouaSell الذكي",name_f:"الاسم الكامل",email_f:"البريد الإلكتروني",phone_f:"الهاتف",address_f:"العنوان",city_f:"المدينة",pay_now:"ادفع الآن",tracking:"تتبع الطلب",pts_earned:"نقطة ولاء مكتسبة",overview:"لوحة التحكم",products_t:"المنتجات",analytics_t:"التحليلات",rev_t:"تقييمات العملاء",our_artisans:"حرفيونا",our_regions:"مناطق المغرب",our_impact:"تأثيرنا",impact_tagline:"كل عملية شراء لها وجه.",
   img_product:"المنتج",img_making:"التصنيع",img_context:"السياق",img_detail:"تفاصيل",passeport:"جواز بصري"},
};

/* ── ARTISANS ── */
const ARTISANS=[
  {id:"fatima",nameKey:"Fatima Zahra Benali",region:"Fès el-Bali",
   tradition:{fr:"Broderie fassi sur soie",en:"Fassi silk embroidery",ar:"التطريز الفاسي على الحرير"},
   years:28,coop:{fr:"Coopérative Zina · Fès",en:"Zina Cooperative · Fès",ar:"تعاونية زينة · فاس"},
   products:[1,4],
   story:{fr:"Fatima a appris à broder à l'âge de 7 ans, assise aux genoux de sa grand-mère dans la médina de Fès. Ses mains, formées à l'école des maîtresses tisseuses, exécutent aujourd'hui des motifs géométriques qui traversent les siècles.",en:"Fatima learned to embroider at age 7, sitting at her grandmother's knees in the medina of Fès. Her hands, trained by master weavers, now create geometric patterns that have crossed centuries.",ar:"تعلمت فاطمة التطريز في سن السابعة جالسةً عند ركبتَي جدتها في مدينة فاس."},
   img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=400&q=80",
   color:"#8B3A62"},
  {id:"hassan",nameKey:"Hassan Alami",region:"Marrakech · Mellah",
   tradition:{fr:"Zellige et mosaïque",en:"Zellige and mosaic",ar:"الزليج والفسيفساء"},
   years:35,coop:{fr:"Maîtres Zellij du Maroc",en:"Masters of Moroccan Zellige",ar:"أساتذة الزليج المغربي"},
   products:[8],
   story:{fr:"Hassan est maître zellij depuis 35 ans. Chaque plateau qu'il crée exige des semaines de taille à la main, pièce par pièce, selon les règles géométriques de l'art islamique classique.",en:"Hassan has been a master zellige craftsman for 35 years. Each piece requires weeks of hand-cutting, following the geometric rules of classical Islamic art.",ar:"حسان أستاذ زليج منذ 35 عاماً. كل قطعة تتطلب أسابيع من القطع اليدوي."},
   img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
   color:"#C17F3B"},
  {id:"zineb",nameKey:"Zineb Oubella",region:"Haut Atlas · Taznakht",
   tradition:{fr:"Tissage berbère laine",en:"Berber wool weaving",ar:"النسيج البربري بالصوف"},
   years:20,coop:{fr:"Coopérative Atlas Femmes",en:"Atlas Women Cooperative",ar:"تعاونية نساء الأطلس"},
   products:[6],
   story:{fr:"Dans le village de Taznakht, Zineb perpétue un art millénaire. Chaque symbole berbère tissé raconte un fragment de vie : le scorpion pour la protection, la pluie pour l'abondance.",en:"In Taznakht, Zineb perpetuates an ancient art. Each woven Berber symbol tells a fragment of life: the scorpion for protection, rain for abundance.",ar:"في تزناخت تُديم زينب فناً عريقاً. كل رمز أمازيغي يحكي جزءاً من الحياة."},
   img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
   color:"#6B7C5E"},
  {id:"omar",nameKey:"Omar Tazi",region:"Fès · Chouara",
   tradition:{fr:"Maroquinerie & tannerie",en:"Leatherwork & tannery",ar:"الجلد والدباغة"},
   years:22,coop:{fr:"Tanneurs de Fès",en:"Fès Tannery Guild",ar:"دباغو فاس"},
   products:[4],
   story:{fr:"Les cuves colorées de la tannerie Chouara sont son atelier depuis 22 ans. Omar travaille le cuir végétal selon des techniques vieilles de mille ans.",en:"The colourful vats of Chouara tannery have been his workshop for 22 years. Omar works vegetable leather using thousand-year-old techniques.",ar:"أحواض دباغة الشوارة ورشته منذ 22 عاماً. عمر يشتغل الجلد النباتي بتقنيات ألفية."},
   img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
   color:"#8B5A2B"},
];

/* ══════════════════════════════════════════════════════════════
   VISUAL_NARRATIVE — Passeport visuel 3 types par produit
   Types : produit / fabrication / contexte / detail
   Chaque image : url + caption (fr/en/ar) + couleur de fallback
══════════════════════════════════════════════════════════════ */
const VN={
  /* Type icons */
  ICONS:{produit:"📸",fabrication:"🛠",contexte:"🗺",detail:"🔍"},

  1:{ // Caftan Brodé
    fallback:["#3D1A2C","#6B2D4A"],
    produit:{
      url:"https://images.unsplash.com/photo-1617088999722-fe90c46bfd06?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Caftan en velours brodé fil d'or",en:"Gold-thread embroidered velvet caftan",ar:"قفطان مخملي مطرز بخيط ذهبي"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Geste de broderie — 80h par pièce",en:"Embroidery — 80h per piece",ar:"فن التطريز — 80 ساعة للقطعة"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1553073520-80b5ad5ec870?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Médina de Fès — berceau de l'artisanat fassi",en:"Medina of Fès — cradle of Fassi craftsmanship",ar:"مدينة فاس — مهد الحرف الفاسية"}},
    detail:{
      url:"https://images.unsplash.com/photo-1504197885203-d58b84f071a7?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Détail des entrelacs géométriques",en:"Detail of geometric interlacing",ar:"تفاصيل الأشكال الهندسية المتشابكة"}},
  },

  2:{ // Argan
    fallback:["#3A2008","#8B5E1A"],
    produit:{
      url:"https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Huile d'argan pure — or liquide du Maroc",en:"Pure argan oil — Morocco's liquid gold",ar:"زيت أركان خالص — الذهب السائل للمغرب"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Femmes de la coopérative cassant les noix à la main",en:"Cooperative women hand-cracking argan nuts",ar:"نساء التعاونية يكسرن حبات الأركان يدوياً"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1543826173-70651703c5a4?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Arganiers endémiques — Souss-Massa",en:"Endemic argan trees — Souss-Massa",ar:"أشجار الأركان المتوطنة — سوس ماسة"}},
    detail:{
      url:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Texture et pureté — pression à froid",en:"Texture and purity — cold pressed",ar:"نقاء وملمس — عصر بارد"}},
  },

  3:{ // Tajine
    fallback:["#3A1208","#8B3A1A"],
    produit:{
      url:"https://images.unsplash.com/photo-1539136788836-5699e78bdbf2?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Tajine terre cuite — cuisson directe sur flamme",en:"Earthenware tajine — direct flame cooking",ar:"طاجين فخار — طهي مباشر على النار"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Mains du potier — tour manuel à Safi",en:"Potter's hands — manual wheel in Safi",ar:"يدا الفخاري — دولاب يدوي في آسفي"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1596944924591-9e698bab7e5d?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Safi — capitale de la céramique marocaine",en:"Safi — capital of Moroccan ceramics",ar:"آسفي — عاصمة الخزف المغربي"}},
    detail:{
      url:"https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Émail turquoise — signature des potiers de Safi",en:"Turquoise glaze — signature of Safi potters",ar:"طلاء فيروزي — توقيع فخاري آسفي"}},
  },

  4:{ // Babouches
    fallback:["#2E1808","#5C3A1A"],
    produit:{
      url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Babouches cuir naturel tanné végétal",en:"Natural vegetable-tanned leather babouches",ar:"بلاغة جلد طبيعي مدبوغ نباتياً"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1571160119752-56cc37acf78d?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Tanneries de Fès — méthodes inchangées depuis le XIIe s.",en:"Fès tanneries — methods unchanged since 12th century",ar:"دباغات فاس — أساليب لم تتغير منذ القرن الثاني عشر"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1553073520-80b5ad5ec870?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Chouara — quartier des tanneurs, Fès",en:"Chouara — tanners' quarter, Fès",ar:"الشوارة — حي الدباغين، فاس"}},
    detail:{
      url:"https://images.unsplash.com/photo-1517481592723-f17e2e85de96?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Coutures à la main — finition artisanale",en:"Hand stitching — artisanal finishing",ar:"خياطة يدوية — إنهاء حرفي"}},
  },

  5:{ // Thé
    fallback:["#1A2E1A","#2A5A2A"],
    produit:{
      url:"https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Thé à la menthe — rituel de l'hospitalité",en:"Mint tea — the ritual of hospitality",ar:"الشاي بالنعناع — طقس الضيافة"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Versé de haut — technique pour créer l'écume",en:"Poured from height — technique to create foam",ar:"يُسكب من الأعلى — تقنية لتكوين الرغوة"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Plaine du Gharb — menthe nana cueillie à la main",en:"Gharb Plain — hand-picked nana mint",ar:"سهل الغرب — نعناع ناناء يُحصد يدوياً"}},
    detail:{
      url:"https://images.unsplash.com/photo-1523920290228-4f321a939b4c?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Gunpowder No 1 — feuilles roulées en perles",en:"Gunpowder No 1 — leaves rolled into pearls",ar:"جونبودر رقم 1 — أوراق ملفوفة كحبات"}},
  },

  6:{ // Coussin Berbère
    fallback:["#2A1A08","#5A3A1A"],
    produit:{
      url:"https://images.unsplash.com/photo-1547994770-a24e38af5aea?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Coussin berbère — laine du Haut Atlas",en:"Berber cushion — High Atlas wool",ar:"وسادة أمازيغية — صوف الأطلس الكبير"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Métier à bras — Zineb Oubella, Taznakht",en:"Hand loom — Zineb Oubella, Taznakht",ar:"نول يدوي — زينب أوبلة، تزناخت"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Haut Atlas — village de Taznakht",en:"High Atlas — village of Taznakht",ar:"الأطلس الكبير — قرية تزناخت"}},
    detail:{
      url:"https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Symboles tifinagh — chaque motif est un texte",en:"Tifinagh symbols — every motif is a text",ar:"رموز تيفيناغ — كل نقش نص"}},
  },

  7:{ // Savon Beldi
    fallback:["#1A1E14","#2A3A22"],
    produit:{
      url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Savon beldi noir — fermenté 6 mois minimum",en:"Black beldi soap — fermented minimum 6 months",ar:"الصابون البلدي الأسود — مخمَّر 6 أشهر على الأقل"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Pâte d'olive + ghassoul — macération artisanale",en:"Olive paste + ghassoul — artisanal maceration",ar:"عجينة زيتون + غاسول — تخمير حرفي"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Marrakech — rituel hammam traditionnel",en:"Marrakech — traditional hammam ritual",ar:"مراكش — طقس الحمام التقليدي"}},
    detail:{
      url:"https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Ghassoul de l'Atlas — argile minérale pure",en:"Atlas ghassoul — pure mineral clay",ar:"غاسول الأطلس — طين معدني خالص"}},
  },

  8:{ // Zellige
    fallback:["#0E1830","#1A3A6A"],
    produit:{
      url:"https://images.unsplash.com/photo-1551029506-0807df4e2031?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Plateau zellige doré — pièce numérotée",en:"Golden zellige plateau — numbered piece",ar:"طبق الزليج الذهبي — قطعة مرقّمة"}},
    fabrication:{
      url:"https://images.unsplash.com/photo-1583853288850-8e74c2e7a2e6?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Taille au marteau et burin — Hassan Alami",en:"Hand-cutting with hammer and chisel — Hassan Alami",ar:"قطع بالمطرقة والإزميل — حسان العلمي"}},
    contexte:{
      url:"https://images.unsplash.com/photo-1548586196-aa5803b77379?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Architecture islamique — géométrie de 1000 ans",en:"Islamic architecture — 1000-year geometry",ar:"العمارة الإسلامية — هندسة ألف سنة"}},
    detail:{
      url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      caption:{fr:"Formule géométrique islamique — Marrakech",en:"Islamic geometric formula — Marrakech",ar:"معادلة هندسية إسلامية — مراكش"}},
  },
};

/* Helper : toutes les images d'un produit en tableau ordonné */
const getImages=(id)=>{
  const v=VN[id];
  if(!v)return[];
  return[
    {type:"produit",  ...v.produit,  icon:VN.ICONS.produit},
    {type:"fabrication",...v.fabrication,icon:VN.ICONS.fabrication},
    {type:"contexte", ...v.contexte, icon:VN.ICONS.contexte},
    {type:"detail",   ...v.detail,   icon:VN.ICONS.detail},
  ];
};

/* ── PRODUCTS ── */
const PRODUCTS=[
  {id:1,artisanId:"fatima",name:{fr:"Caftan Brodé Royal",en:"Royal Embroidered Caftan",ar:"القفطان الملكي المطرز"},cat:"Mode",price:1850,rating:4.8,rCount:124,stock:3,badge:"Bestseller",region:{fr:"Fès el-Bali",en:"Fès el-Bali",ar:"فاس البالي"},tradition_tag:{fr:"Broderie fassi",en:"Fassi embroidery",ar:"التطريز الفاسي"},material:{fr:"Velours & fil d'or",en:"Velvet & gold thread",ar:"مخمل وخيط ذهبي"},technique:{fr:"Point de croix manuel",en:"Manual cross-stitch",ar:"غرز يدوية"},colors:["Bordeaux","Bleu nuit","Ivoire"],sizes:["S","M","L","XL"],story:{fr:"Ce caftan est issu d'une tradition de cour vieille de cinq siècles. Chaque motif géométrique, exécuté au fil d'or sur fond de velours, est un langage symbolique : les losanges évoquent la fertilité, les entrelacs la continuité du temps. Il faut plus de 80 heures de broderie pour achever une seule pièce.",en:"This caftan comes from a five-century-old court tradition. Each geometric pattern in gold thread on velvet is a symbolic language: diamonds evoke fertility, interlaced lines the continuity of time. More than 80 hours of embroidery per piece.",ar:"هذا القفطان من تقليد بلاطي عمره خمسة قرون. كل نقش هندسي منفَّذ بخيط ذهبي على مخمل لغة رمزية. يتطلب أكثر من 80 ساعة تطريز."},impact:{fr:"Soutient 3 brodeuses de la Coopérative Zina",en:"Supports 3 embroiderers at Zina Cooperative",ar:"يدعم 3 مطرزات في تعاونية زينة"},certif:{fr:"Pièce numérotée · Certificat d'origine Fès · Fil d'or certifié",en:"Numbered piece · Fès origin certificate · Certified gold thread",ar:"قطعة مرقّمة · شهادة منشأ فاس · خيط ذهبي معتمد"},reviews:[{n:"Salma B.",s:5,t:{fr:"Broderie parfaite, chaque fil compte.",en:"Perfect embroidery, every thread matters.",ar:"تطريز مثالي."},v:true,d:"12 jan"},{n:"Karim M.",s:5,t:{fr:"Qualité digne d'un couturier.",en:"Quality worthy of a couturier.",ar:"جودة راقية."},v:true,d:"8 jan"}]},
  {id:2,artisanId:null,name:{fr:"Argan Pur Bio 100ml",en:"Pure Organic Argan 100ml",ar:"أركان خالص بيو 100مل"},cat:"Beauté",price:280,rating:4.9,rCount:312,stock:45,badge:"Top Ventes",region:{fr:"Souss-Massa · Agadir",en:"Souss-Massa · Agadir",ar:"سوس ماسة · أكادير"},tradition_tag:{fr:"Or liquide du Maroc",en:"Morocco's liquid gold",ar:"الذهب السائل للمغرب"},material:{fr:"Graines d'argania spinosa",en:"Argania spinosa seeds",ar:"بذور شجر الأركان"},technique:{fr:"Pression à froid traditionnelle",en:"Traditional cold pressing",ar:"عصر بارد تقليدي"},colors:["Standard"],sizes:["50ml","100ml","200ml"],story:{fr:"L'arganier, arbre endémique du Maroc, pousse dans des conditions arides qui lui confèrent ses propriétés exceptionnelles. Les femmes de la coopérative Targanine récoltent les fruits à la main, concassent les noix manuellement et pressent l'huile selon une méthode transmise de génération en génération.",en:"The argan tree, endemic to Morocco, grows in arid conditions. The women of Targanine cooperative harvest fruit by hand and press the oil using methods passed down through generations.",ar:"شجرة الأركان المتوطنة في المغرب تنمو في ظروف جافة. نساء تعاونية تارغانين يحصدن الثمار يدوياً."},impact:{fr:"Soutient 47 femmes de la coopérative Targanine",en:"Supports 47 women at Targanine cooperative",ar:"يدعم 47 امرأة في تعاونية تارغانين"},certif:{fr:"Certifié ECOCERT · Première pression à froid · 100% pur",en:"ECOCERT certified · First cold press · 100% pure",ar:"معتمد ECOCERT · عصرة أولى باردة · نقي 100%"},reviews:[{n:"Leila H.",s:5,t:{fr:"Résultats visibles en une semaine.",en:"Visible results in one week.",ar:"نتائج ملموسة في أسبوع."},v:true,d:"15 jan"},{n:"Sara T.",s:5,t:{fr:"4ème commande — fidèle à vie !",en:"4th order — loyal for life!",ar:"الطلب الرابع — مخلصة إلى الأبد!"},v:true,d:"5 jan"}]},
  {id:3,artisanId:null,name:{fr:"Tajine Terre Cuite Safi",en:"Safi Earthenware Tajine",ar:"طاجين فخار آسفي"},cat:"Maison",price:420,rating:4.7,rCount:89,stock:23,badge:"Artisanat",region:{fr:"Safi · Côte Atlantique",en:"Safi · Atlantic Coast",ar:"آسفي · الساحل الأطلسي"},tradition_tag:{fr:"Poterie de Safi",en:"Safi pottery",ar:"فخار آسفي"},material:{fr:"Argile locale + oxyde de cuivre",en:"Local clay + copper oxide",ar:"طين محلي + أكسيد النحاس"},technique:{fr:"Tour manuel + cuisson bois",en:"Manual wheel + wood firing",ar:"دولاب يدوي + حرق بالخشب"},colors:["Ocre","Blanc"],sizes:["24cm","28cm","32cm"],story:{fr:"Safi est la capitale de la céramique marocaine depuis le 12ème siècle. Les maîtres potiers y développèrent un style reconnaissable : émaux turquoise et verts, formes organiques. Ce tajine peut aller directement sur la flamme.",en:"Safi has been Morocco's ceramics capital since the 12th century. Master potters developed a distinctive style: turquoise and green glazes, organic forms. This tajine can be used directly on flame.",ar:"آسفي عاصمة الخزف المغربي منذ القرن الثاني عشر. أساتذة الفخار طوّروا أسلوباً مميزاً."},impact:{fr:"Famille Bensouda · 3ème génération de potiers",en:"Bensouda family · 3rd generation potters",ar:"عائلة بنصودة · الجيل الثالث من الفخارين"},certif:{fr:"Poinçon artisan Safi · Argile certifiée · Sans plomb",en:"Safi artisan hallmark · Certified clay · Lead-free",ar:"ختم حرفي آسفي · طين معتمد · خالٍ من الرصاص"},reviews:[{n:"Youssef D.",s:5,t:{fr:"Saveurs incomparables en cuisson.",en:"Incomparable flavours when cooking.",ar:"نكهات لا مثيل لها."},v:true,d:"20 jan"},{n:"Fatima Z.",s:4,t:{fr:"Cadeau parfait.",en:"Perfect gift.",ar:"هدية مثالية."},v:true,d:"14 jan"}]},
  {id:4,artisanId:"omar",name:{fr:"Babouches Cuir Naturel",en:"Natural Leather Babouches",ar:"بلاغة جلد طبيعي"},cat:"Mode",price:350,rating:4.6,rCount:201,stock:31,badge:"",region:{fr:"Fès · Quartier Chouara",en:"Fès · Chouara Quarter",ar:"فاس · حي الشوارة"},tradition_tag:{fr:"Maroquinerie fassi",en:"Fassi leatherwork",ar:"الجلد الفاسي"},material:{fr:"Cuir végétal tanné",en:"Vegetable-tanned leather",ar:"جلد مدبوغ نباتياً"},technique:{fr:"Tannage naturel · Finitions main",en:"Natural tanning · Hand finish",ar:"دباغة طبيعية · إنهاء يدوي"},colors:["Naturel","Noir","Camel","Miel"],sizes:["38","39","40","41","42","43","44"],story:{fr:"Les tanneries de Fès sont l'une des images les plus iconiques du Maroc. Le cuir y est travaillé selon des méthodes inchangées depuis le Moyen-Âge : bains de chaux, cuves de safran. Omar tanné depuis 22 ans dans la même cuve que son père.",en:"Fès tanneries are one of Morocco's most iconic images. Leather is worked using methods unchanged since the Middle Ages. Omar has been tanning for 22 years in his father's vat.",ar:"دباغات فاس من أكثر الصور أيقونية في المغرب. الجلد يُعالَج بأساليب لم تتغير منذ العصور الوسطى."},impact:{fr:"Emploi direct · Tannerie Chouara · Fès",en:"Direct employment · Chouara Tannery · Fès",ar:"توظيف مباشر · دباغة الشوارة · فاس"},certif:{fr:"Cuir végétal non-chromé · Sans produits chimiques · Label Fassi",en:"Chrome-free vegetable leather · Chemical-free · Fassi label",ar:"جلد نباتي بدون كروم · بدون مواد كيميائية · ختم فاسي"},reviews:[{n:"Omar L.",s:5,t:{fr:"Confort incroyable, cuir exceptionnel.",en:"Incredible comfort, exceptional leather.",ar:"راحة مذهلة وجلد استثنائي."},v:true,d:"18 jan"},{n:"Rim A.",s:4,t:{fr:"Belle qualité, livraison rapide.",en:"Great quality, fast delivery.",ar:"جودة جيدة."},v:false,d:"9 jan"}]},
  {id:5,artisanId:null,name:{fr:"Thé à la Menthe Signature",en:"Signature Mint Tea",ar:"الشاي بالنعناع الأصيل"},cat:"Épicerie",price:95,rating:4.9,rCount:445,stock:120,badge:"Favori",region:{fr:"Meknes · Plaine du Gharb",en:"Meknes · Gharb Plain",ar:"مكناس · سهل الغرب"},tradition_tag:{fr:"Thé de l'hospitalité",en:"Tea of hospitality",ar:"شاي الضيافة"},material:{fr:"Gunpowder No 1 + Menthe nana",en:"Gunpowder No 1 + Nana Mint",ar:"جونبودر رقم 1 + نعناع ناناء"},technique:{fr:"Séchage naturel à l'ombre",en:"Natural shade drying",ar:"تجفيف طبيعي في الظل"},colors:["Signature"],sizes:["50g","100g","200g"],story:{fr:"Au Maroc, le thé n'est pas une boisson — c'est un rituel. Versé de haut pour créer l'écume, servi trois fois (chacune avec une saveur différente), il symbolise l'hospitalité. Notre mélange combine le Gunpowder de Chine et la menthe nana cueillie à la main.",en:"In Morocco, tea is not a drink — it is a ritual. Poured from height to create foam, served three times, it symbolises hospitality. Our blend combines Chinese Gunpowder with hand-picked nana mint.",ar:"في المغرب، الشاي طقس. يُسكب من الأعلى لتكوين الرغوة، يُقدَّم ثلاث مرات، يرمز للضيافة."},impact:{fr:"Soutient 12 familles agricoles du Gharb",en:"Supports 12 farming families from Gharb",ar:"يدعم 12 عائلة فلاحية من الغرب"},certif:{fr:"Agriculture raisonnée · Sans pesticides · Récolte manuelle",en:"Sustainable farming · Pesticide-free · Hand-harvested",ar:"زراعة مستدامة · بدون مبيدات · حصاد يدوي"},reviews:[{n:"Hassan M.",s:5,t:{fr:"Le rituel du thé retrouvé.",en:"The tea ritual rediscovered.",ar:"طقس الشاي مُستعاد."},v:true,d:"22 jan"}]},
  {id:6,artisanId:"zineb",name:{fr:"Coussin Berbère Haut Atlas",en:"High Atlas Berber Cushion",ar:"وسادة أمازيغية أطلس كبير"},cat:"Maison",price:680,rating:4.7,rCount:67,stock:14,badge:"Nouveau",region:{fr:"Haut Atlas · Taznakht",en:"High Atlas · Taznakht",ar:"الأطلس الكبير · تزناخت"},tradition_tag:{fr:"Tissage amazigh",en:"Amazigh weaving",ar:"النسيج الأمازيغي"},material:{fr:"Laine de brebis des plateaux",en:"Plateau sheep wool",ar:"صوف نعاج الهضاب"},technique:{fr:"Métier à bras traditionnel",en:"Traditional hand loom",ar:"نول يدوي تقليدي"},colors:["Naturel","Rouge Oued","Ocre Atlas"],sizes:["40×40cm","50×50cm"],story:{fr:"Les motifs sur ce coussin ne sont pas de la décoration — ce sont des textes. Chaque symbole berbère (tifinagh) raconte un fragment de vie : le scorpion pour la protection, la pluie pour l'abondance. Zineb tisse ces récits depuis l'âge de 12 ans.",en:"The patterns on this cushion are not decoration — they are texts. Each Berber symbol tells a fragment of life. Zineb has been weaving these stories since age 12.",ar:"النقوش على هذه الوسادة ليست زخرفة — إنها نصوص. كل رمز أمازيغي يحكي جزءاً من الحياة."},impact:{fr:"Coopérative Atlas Femmes · 34 tisseuses",en:"Atlas Women Cooperative · 34 weavers",ar:"تعاونية نساء الأطلس · 34 ناسجة"},certif:{fr:"Laine naturelle · Teinture végétale · Label Amazigh",en:"Natural wool · Vegetable dye · Amazigh label",ar:"صوف طبيعي · صبغ نباتي · ختم أمازيغي"},reviews:[{n:"Dounia S.",s:5,t:{fr:"Pièce vivante, chaque motif parle.",en:"A living piece, every motif speaks.",ar:"قطعة حية."},v:true,d:"11 jan"}]},
  {id:7,artisanId:null,name:{fr:"Savon Beldi Noir Hammam",en:"Black Hammam Beldi Soap",ar:"الصابون البلدي الأسود"},cat:"Beauté",price:120,rating:4.8,rCount:289,stock:78,badge:"",region:{fr:"Marrakech · Bab Doukkala",en:"Marrakech · Bab Doukkala",ar:"مراكش · باب دكالة"},tradition_tag:{fr:"Rituel hammam marocain",en:"Moroccan hammam ritual",ar:"طقس الحمام المغربي"},material:{fr:"Huile d'olive + Ghassoul Atlas",en:"Olive oil + Atlas Ghassoul",ar:"زيت زيتون + غاسول الأطلس"},technique:{fr:"Macération 6 mois",en:"6-month maceration",ar:"تخمير 6 أشهر"},colors:["Standard"],sizes:["200g","400g"],story:{fr:"Le savon beldi noir n'est pas fabriqué — il est fermenté. Une pâte d'olives pressées à froid, enrichie de ghassoul extrait des montagnes de l'Atlas, macère pendant six mois minimum. Ce processus lent crée des saponines actives qui exfolient en profondeur.",en:"Black beldi soap is not made — it is fermented. Olive paste enriched with Atlas ghassoul macerates for a minimum of six months. This slow process creates active saponins that exfoliate deeply.",ar:"الصابون البلدي الأسود لا يُصنع — يُخمَّر. عجينة زيتون مع غاسول الأطلس تتخمر ستة أشهر."},impact:{fr:"Production Dar Cherifa · Marrakech · artisan familial",en:"Dar Cherifa production · Marrakech · family artisan",ar:"إنتاج دار شريفة · مراكش · حرفي عائلي"},certif:{fr:"100% naturel · Sans conservateurs · pH équilibré",en:"100% natural · Preservative-free · Balanced pH",ar:"طبيعي 100% · بدون مواد حافظة · pH متوازن"},reviews:[{n:"Meryem B.",s:5,t:{fr:"Peau douce après la 1ère utilisation.",en:"Soft skin after first use.",ar:"بشرة ناعمة بعد الاستخدام الأول."},v:true,d:"19 jan"}]},
  {id:8,artisanId:"hassan",name:{fr:"Plateau Zellige Doré",en:"Golden Zellige Plateau",ar:"طبق الزليج الذهبي"},cat:"Maison",price:950,rating:4.9,rCount:43,stock:4,badge:"Exclusif",region:{fr:"Marrakech · Quartier des artisans",en:"Marrakech · Artisans Quarter",ar:"مراكش · حي الحرفيين"},tradition_tag:{fr:"Zellige andalou-marocain",en:"Andalusian-Moroccan Zellige",ar:"الزليج الأندلسي المغربي"},material:{fr:"Argile émaillée + oxyde d'or",en:"Glazed clay + gold oxide",ar:"طين مزجّج + أكسيد الذهب"},technique:{fr:"Taille à main · Pose mosaïque",en:"Hand cutting · Mosaic laying",ar:"قطع يدوي · تركيب فسيفسائي"},colors:["Doré","Argenté"],sizes:["30cm","40cm","50cm"],story:{fr:"Le zellige est né dans les palais andalous du 10ème siècle. Chaque pièce est taillée individuellement au marteau et au burin, puis assemblée selon des formules géométriques dérivées de la mathématique islamique. Ce plateau est une pièce numérotée.",en:"Zellige was born in 10th-century Andalusian palaces. Each piece is individually cut with hammer and chisel, then assembled using geometric formulas from Islamic mathematics.",ar:"وُلد الزليج في القصور الأندلسية في القرن العاشر. كل قطعة مقطوعة بالمطرقة والإزميل."},impact:{fr:"Hassan Alami · Maître zellij · Pièce unique numérotée",en:"Hassan Alami · Master zellige · Unique numbered piece",ar:"حسان العلمي · أستاذ زليج · قطعة فريدة مرقّمة"},certif:{fr:"Certificat N° · Signature artisan · Marque Maîtres Zellij",en:"Certificate N° · Artisan signature · Masters of Zellige brand",ar:"شهادة رقم · توقيع الحرفي · علامة أساتذة الزليج"},reviews:[{n:"Adil K.",s:5,t:{fr:"Pièce d'exception. Le certificat sublime tout.",en:"Exceptional piece. The certificate elevates everything.",ar:"قطعة استثنائية."},v:true,d:"6 jan"}]},
];

/* ══ CSS FALLBACK ARTISANAL ══════════════════════════════════
   Rendu visuel pour les images qui échouent à charger
   Chaque produit a sa propre identité texturale
══════════════════════════════════════════════════════════════ */
const FALLBACK_STYLES = {
  1: { // Caftan — velours bordeaux avec motif géométrique
    bg: "linear-gradient(135deg, #3D1A2C 0%, #6B2D4A 45%, #3D1A2C 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A96E' stroke-width='0.6' opacity='0.25'%3E%3Cpolygon points='20,2 38,11 38,29 20,38 2,29 2,11'/%3E%3Cpolygon points='20,8 32,14 32,26 20,32 8,26 8,14'/%3E%3Cline x1='20' y1='2' x2='20' y2='38'/%3E%3Cline x1='2' y1='11' x2='38' y2='11'/%3E%3Cline x1='2' y1='29' x2='38' y2='29'/%3E%3C/g%3E%3C/svg%3E")`,
    icon: "✦", label: {fr:"Broderie fassi",en:"Fassi embroidery",ar:"التطريز الفاسي"}
  },
  2: { // Argan — or liquide
    bg: "linear-gradient(160deg, #2A1404 0%, #6B3A08 40%, #C17F3B 75%, #8B5E1A 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='12' fill='none' stroke='%23FFF8E0' stroke-width='0.4' opacity='0.15'/%3E%3Ccircle cx='15' cy='15' r='6' fill='none' stroke='%23FFF8E0' stroke-width='0.4' opacity='0.2'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23FFF8E0' opacity='0.2'/%3E%3C/svg%3E")`,
    icon: "●", label: {fr:"Huile d'argan",en:"Argan oil",ar:"زيت أركان"}
  },
  3: { // Tajine — terre cuite Safi
    bg: "linear-gradient(145deg, #2A0E04 0%, #8B3A1A 50%, #C4572A 80%, #3A1208 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='22' fill='none' stroke='%23E8D5B7' stroke-width='0.5' opacity='0.2'/%3E%3Ccircle cx='25' cy='25' r='14' fill='none' stroke='%23E8D5B7' stroke-width='0.5' opacity='0.15'/%3E%3Ccircle cx='25' cy='25' r='5' fill='%23E8D5B7' opacity='0.1'/%3E%3C/svg%3E")`,
    icon: "◉", label: {fr:"Poterie de Safi",en:"Safi pottery",ar:"فخار آسفي"}
  },
  4: { // Babouches — cuir tanné
    bg: "linear-gradient(150deg, #1A0A04 0%, #5C3A1A 45%, #8B5A2B 75%, #3A2010 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='8' height='8' fill='none' stroke='%23C9A96E' stroke-width='0.4' opacity='0.2'/%3E%3Crect x='11' y='11' width='8' height='8' fill='none' stroke='%23C9A96E' stroke-width='0.4' opacity='0.2'/%3E%3C/svg%3E")`,
    icon: "▣", label: {fr:"Cuir Chouara",en:"Chouara leather",ar:"جلد الشوارة"}
  },
  5: { // Thé — vert profond
    bg: "linear-gradient(145deg, #0A1A0A 0%, #1A4A1A 40%, #2A7A2A 70%, #143014 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='12.5' cy='12.5' rx='10' ry='5' fill='none' stroke='%2390EE90' stroke-width='0.4' opacity='0.18' transform='rotate(30,12.5,12.5)'/%3E%3Cellipse cx='12.5' cy='12.5' rx='10' ry='5' fill='none' stroke='%2390EE90' stroke-width='0.4' opacity='0.18' transform='rotate(-30,12.5,12.5)'/%3E%3C/svg%3E")`,
    icon: "✿", label: {fr:"Menthe nana",en:"Nana mint",ar:"نعناع ناناء"}
  },
  6: { // Coussin berbère — laine chaleureuse
    bg: "linear-gradient(135deg, #1A0E04 0%, #5A3A1A 30%, #8B6030 55%, #C17F3B 75%, #3A2010 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,15 L15,0 L30,15 L15,30 Z' fill='none' stroke='%23E8D5B7' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M7,15 L15,7 L23,15 L15,23 Z' fill='none' stroke='%23E8D5B7' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`,
    icon: "◇", label: {fr:"Tifinagh",en:"Tifinagh",ar:"تيفيناغ"}
  },
  7: { // Savon beldi — noir profond
    bg: "linear-gradient(150deg, #080C06 0%, #1A2614 40%, #2A3A20 70%, #0E120A 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='7.5' cy='7.5' r='1.5' fill='%23FFFFFF' opacity='0.06'/%3E%3Ccircle cx='0' cy='0' r='1' fill='%23FFFFFF' opacity='0.04'/%3E%3Ccircle cx='15' cy='15' r='1' fill='%23FFFFFF' opacity='0.04'/%3E%3C/svg%3E")`,
    icon: "●", label: {fr:"Ghassoul Atlas",en:"Atlas ghassoul",ar:"غاسول الأطلس"}
  },
  8: { // Zellige — géométrie islamique bleue
    bg: "linear-gradient(135deg, #060E1C 0%, #0E2240 40%, #1A3A6A 65%, #0A1830 100%)",
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A96E' stroke-width='0.5' opacity='0.3'%3E%3Crect x='5' y='5' width='30' height='30' transform='rotate(45,20,20)'/%3E%3Crect x='10' y='10' width='20' height='20' transform='rotate(45,20,20)'/%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Cline x1='20' y1='0' x2='20' y2='40'/%3E%3Cline x1='0' y1='20' x2='40' y2='20'/%3E%3C/g%3E%3C/svg%3E")`,
    icon: "✦", label: {fr:"Géométrie islamique",en:"Islamic geometry",ar:"هندسة إسلامية"}
  },
};

/* ══ PRODUCT IMAGE — avec fallback CSS artisanal ═════════════ */
function ProductImage({ productId, imageObj, type="produit", style={}, showLabel=false, lang="fr" }) {
  const [state, setState] = useState("loading"); // loading | loaded | failed
  const fs = FALLBACK_STYLES[productId] || FALLBACK_STYLES[1];
  const imgs = getImages(productId);
  const img = imageObj || imgs.find(i => i.type === type) || imgs[0];

  return (
    <div style={{ position:"relative", overflow:"hidden", ...style }}>
      {/* CSS Fallback — toujours rendu, caché si image chargée */}
      <div className="grain" style={{
        position:"absolute", inset:0,
        background: fs.bg,
        backgroundImage: `${fs.bg}, ${fs.pattern}`,
        backgroundSize: "cover, 40px 40px",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        opacity: state === "loaded" ? 0 : 1,
        transition: "opacity .6s ease",
        zIndex: 1,
      }}>
        <div style={{ fontSize: style.height > 150 ? 48 : 28, color:"rgba(250,250,247,0.3)", marginBottom: 8 }}>{fs.icon}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: style.height > 150 ? 13 : 9, color:"rgba(250,250,247,0.35)", textAlign:"center", padding:"0 12px", lineHeight:1.4 }}>
          {fs.label[lang] || fs.label.fr}
        </div>
        {state === "loading" && <div style={{ position:"absolute", bottom: 8, right: 8, width:16, height:16, border:`1px solid rgba(255,255,255,0.2)`, borderTopColor:"rgba(255,255,255,0.6)", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>}
      </div>

      {/* Vraie image */}
      {img?.url && (
        <img
          src={img.url}
          alt={img.caption?.[lang] || ""}
          onLoad={() => setState("loaded")}
          onError={() => setState("failed")}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity: state === "loaded" ? 1 : 0, transition:"opacity .6s ease", zIndex: 2 }}
        />
      )}

      {/* Étiquette type image */}
      {showLabel && img && state === "loaded" && (
        <div style={{ position:"absolute", top: 8, left: 8, zIndex: 4, background:"rgba(44,31,14,0.72)", backdropFilter:"blur(4px)", borderRadius: 4, padding:"3px 8px", display:"flex", alignItems:"center", gap: 5 }}>
          <span style={{ fontSize: 10 }}>{img.icon}</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize: 7, color:"rgba(250,250,247,0.8)", letterSpacing:"0.12em" }}>
            {TRANS[lang]?.[`img_${img.type}`] || img.type.toUpperCase()}
          </span>
        </div>
      )}

      {/* Caption au survol */}
      {img?.caption && state === "loaded" && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex: 4, padding:"18px 12px 10px", background:"linear-gradient(transparent, rgba(44,31,14,0.65))", opacity:0, transition:"opacity .3s", pointerEvents:"none" }}
          className="img-caption">
          <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:10, color:"rgba(250,250,247,0.85)", lineHeight:1.4 }}>{img.caption[lang] || img.caption.fr}</div>
        </div>
      )}
    </div>
  );
}

/* ══ VISUAL PASSPORT — galerie 4 images + légendes ══════════ */
function VisualPassport({ productId, lang }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const imgs = getImages(productId);
  const current = imgs[active];

  return (
    <div>
      {/* Main image */}
      <div style={{ position:"relative", height: 260, marginBottom: 8 }}
        onMouseEnter={e => { const cap = e.currentTarget.querySelector('.img-caption'); if(cap) cap.style.opacity = "1"; }}
        onMouseLeave={e => { const cap = e.currentTarget.querySelector('.img-caption'); if(cap) cap.style.opacity = "0"; }}>
        <ProductImage productId={productId} imageObj={current} type={current?.type} style={{ width:"100%", height:"100%" }} showLabel lang={lang}/>
        {/* Caption overlay */}
        {current?.caption && (
          <div className="img-caption" style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:4, padding:"20px 12px 10px", background:"linear-gradient(transparent,rgba(44,31,14,0.7))", opacity:0, transition:"opacity .3s" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:10, color:"rgba(250,250,247,0.88)", lineHeight:1.4 }}>{current.caption[lang] || current.caption.fr}</div>
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      <div style={{ display:"flex", gap: 6 }}>
        {imgs.map((img, i) => (
          <div key={i} onClick={() => setActive(i)}
            style={{ flex:1, height: 58, position:"relative", cursor:"pointer", border:`2px solid ${active===i ? C.dark : "transparent"}`, borderRadius: 4, overflow:"hidden", transition:"border-color .2s" }}>
            <ProductImage productId={productId} imageObj={img} style={{ width:"100%", height:"100%" }} lang={lang}/>
            {/* Type label */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(44,31,14,0.6)", padding:"2px 4px", display:"flex", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:8 }}>{img.icon}</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:6, color:"rgba(250,250,247,0.7)", letterSpacing:"0.08em" }}>
                {TRANS[lang]?.[`img_${img.type}`] || img.type.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Passeport label */}
      <div style={{ marginTop: 8, display:"flex", alignItems:"center", gap: 6 }}>
        <div style={{ width: 4, height: 4, background: C.sage, borderRadius:"50%" }}/>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize: 8, color: C.sub, letterSpacing:"0.1em" }}>
          {(t("passeport") || "PASSEPORT VISUEL").toUpperCase()} · 4 VUES AUTHENTIQUES
        </span>
      </div>
    </div>
  );
}

/* ══ TOAST ═══════════════════════════════════════════════════ */
function ToastContainer({toasts}) {
  return (
    <div style={{position:"fixed",top:60,right:16,zIndex:1000,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.type==="success"?"#1A2E1A":t.type==="error"?"#2E1A1A":C.dark,border:`1px solid ${t.type==="success"?C.green:t.type==="error"?C.red:C.gold}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,minWidth:240,boxShadow:"0 8px 24px rgba(0,0,0,0.2)",animation:`${t.leaving?"slideOutRight":"slideInRight"} .3s ease forwards`}}>
          <span style={{fontSize:16}}>{t.icon}</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.cream,fontWeight:600}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ══ LANGUAGE SWITCHER ═══════════════════════════════════════ */
function LangSwitcher() {
  const {lang,setLang}=useContext(LangCtx);
  return (
    <div style={{display:"flex",gap:2,background:"rgba(44,31,14,0.08)",borderRadius:7,padding:2,border:`1px solid ${C.border}`}}>
      {[["FR","fr"],["EN","en"],["ع","ar"]].map(([label,code])=>(
        <button key={code} onClick={()=>setLang(code)} style={{background:lang===code?C.dark:"transparent",border:"none",borderRadius:5,padding:"4px 8px",color:lang===code?C.cream:C.text2,fontSize:10,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:lang===code?700:400,transition:"all .2s",minWidth:26}}>{label}</button>
      ))}
    </div>
  );
}

/* ══ CHAT IA ═════════════════════════════════════════════════ */
function ChatWidget({open,onToggle,lang}) {
  const t=useT();
  const [msgs,setMsgs]=useState([{from:"bot",text:"👋 Bienvenue chez NouaSell. Je suis votre guide — posez-moi n'importe quelle question sur nos artisans, nos créations, ou l'histoire derrière chaque pièce."}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{if(open)setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);},[msgs,open]);

  const send=async()=>{
    if(!input.trim()||loading)return;
    const q=input;
    setMsgs(p=>[...p,{from:"user",text:q}]);
    setInput("");setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          system:`Tu es le guide expert de NouaSell, boutique premium d'artisanat marocain authentique. Réponds en ${lang==="ar"?"arabe":lang==="en"?"anglais":"français"}, ton chaleureux et expert (3 phrases max). Tu connais nos artisans : Fatima (broderie Fès), Hassan (zellige Marrakech), Zineb (tissage Atlas), Omar (cuir Fès). Code promo ENCG2025 = -10%.`,
          messages:[...msgs.slice(-4).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text})),{role:"user",content:q}]})});
      const data=await res.json();
      setMsgs(p=>[...p,{from:"bot",text:data.content?.[0]?.text||"Désolé, réessayez."}]);
    } catch {
      setMsgs(p=>[...p,{from:"bot",text:"⚠️ Connexion indisponible."}]);
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={onToggle} style={{position:"fixed",bottom:20,right:20,width:50,height:50,borderRadius:"50%",background:C.dark,border:`2px solid ${C.gold}`,cursor:"pointer",fontSize:18,zIndex:200,boxShadow:`0 4px 20px rgba(44,31,14,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open?"✕":"💬"}
      </button>
      {open&&(
        <div className="fu" style={{position:"fixed",bottom:82,right:20,width:316,height:400,background:C.cream,borderRadius:16,boxShadow:"0 16px 48px rgba(44,31,14,0.18)",zIndex:200,display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${C.border}`}}>
          <div style={{background:C.dark,padding:"11px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulseGlow 2s ease infinite"}}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:C.cream}}>{t("chat_title")}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.gold,marginLeft:"auto"}}>IA · Slide 18</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:7}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",background:m.from==="user"?C.dark:C.bg2,borderRadius:10,padding:"8px 11px",fontFamily:"'Outfit',sans-serif",fontSize:11,color:m.from==="user"?C.cream:C.text,lineHeight:1.5}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:3,padding:"8px 12px",background:C.bg2,borderRadius:10,width:52}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.sub,animation:`ping .9s ease ${i*.2}s infinite`}}/>)}
            </div>}
            <div ref={endRef}/>
          </div>
          <div style={{display:"flex",gap:6,padding:"9px 10px",borderTop:`1px solid ${C.border}`}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t("chat_ph")} dir={lang==="ar"?"rtl":"ltr"} style={{flex:1,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff",color:C.text}}/>
            <button onClick={send} disabled={loading} style={{background:loading?C.sub:C.dark,border:"none",borderRadius:8,padding:"7px 12px",color:C.cream,cursor:loading?"not-allowed":"pointer",fontSize:13,transition:"all .2s"}}>{t("send")}</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ══ HERO ════════════════════════════════════════════════════ */
function HeroSection({onDiscover,lang}) {
  const t=useT();
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),100);},[]);
  const dir=lang==="ar"?"rtl":"ltr";
  return (
    <div style={{height:"100%",position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#2C1F0E 0%,#4A2E1A 30%,#3A2812 60%,#2C1F0E 100%)"}} dir={dir}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 20% 50%,rgba(201,169,110,0.15),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(107,124,94,0.1),transparent 50%)",pointerEvents:"none"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05}} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[10,20,30,40,50,60,70,80,90].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#C9A96E" strokeWidth="0.3"/>)}
        {[10,20,30,40,50,60,70,80,90].map(x=><line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#C9A96E" strokeWidth="0.3"/>)}
      </svg>
      <div style={{position:"relative",height:"100%",display:"flex",alignItems:"center",padding:"0 8%",maxWidth:1200,margin:"0 auto",width:"100%"}}>
        <div style={{flex:1,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all .9s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,169,110,0.12)",border:"1px solid rgba(201,169,110,0.3)",borderRadius:4,padding:"5px 12px",marginBottom:20}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,boxShadow:`0 0 6px ${C.gold}`}}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,letterSpacing:"0.22em"}}>{t("hero_badge")}</span>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(32px,5vw,64px)",color:C.cream,lineHeight:1.15,marginBottom:16}}>{t("tagline")}</h1>
          <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:300,fontSize:"clamp(13px,1.6vw,17px)",color:"rgba(250,250,247,0.65)",lineHeight:1.8,marginBottom:32,maxWidth:500,whiteSpace:"pre-line"}}>{t("subtitle")}</p>
          <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
            <button onClick={onDiscover} style={{background:C.gold,border:"none",borderRadius:0,padding:"14px 32px",color:C.dark,fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:"pointer",letterSpacing:"0.1em",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.cream;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.gold;}}>
              {t("discover").toUpperCase()}
            </button>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"rgba(250,250,247,0.45)"}}>340 {t("artisans_n")} · 47 pays</div>
          </div>
          <div style={{display:"flex",gap:28,marginTop:48,paddingTop:28,borderTop:"1px solid rgba(201,169,110,0.2)"}}>
            {[["340",t("artisans_n")],["12k+","commandes"],["47","pays"],["8","ans"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:C.gold,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"rgba(250,250,247,0.4)",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{width:"38%",flexShrink:0,display:"flex",justifyContent:"center",alignItems:"center",opacity:loaded?1:0,transition:"opacity 1.2s ease .3s"}}>
          <div style={{position:"relative",width:280,height:280}}>
            <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.15)"}}/>
            <div style={{position:"absolute",inset:20,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.1)"}}/>
            <div style={{position:"absolute",inset:40,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,169,110,0.08),transparent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:80,color:"rgba(201,169,110,0.6)",lineHeight:1,userSelect:"none"}}>ن</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ STORE VIEW ══════════════════════════════════════════════ */
function StoreView({products,onAdd,wishlist,onWish,fx,lang}) {
  const t=useT();
  const [cat,setCat]=useState("Tous");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("popular");
  const [selected,setSelected]=useState(null);
  const [loading,setLoading]=useState(true);
  const [compare,setCompare]=useState([]);
  const [showCmp,setShowCmp]=useState(false);
  const [view,setView]=useState("shop");
  const dir=lang==="ar"?"rtl":"ltr";
  const catsMap=CATS_MAP[lang]||CATS_MAP.fr;
  useEffect(()=>{setTimeout(()=>setLoading(false),700);},[]);

  const filtered=products
    .filter(p=>(cat==="Tous"||p.cat===cat)&&(p.name[lang]?.toLowerCase().includes(search.toLowerCase())||p.name.fr.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>sort==="price_asc"?a.price-b.price:sort==="price_desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:b.rCount-a.rCount);

  const toggleCmp=p=>setCompare(prev=>prev.find(x=>x.id===p.id)?prev.filter(x=>x.id!==p.id):prev.length<3?[...prev,p]:prev);

  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg}} dir={dir}>
      {/* Sub-nav */}
      <div style={{background:C.dark,padding:"0 40px",display:"flex",alignItems:"center",gap:2,height:42,flexShrink:0}}>
        {[["shop",t("shop")],["artisans",t("artisan_nav")],["impact",t("impact_nav")]].map(([id,label])=>(
          <button key={id} onClick={()=>setView(id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${view===id?C.gold:"transparent"}`,padding:"0 16px",height:"100%",color:view===id?C.gold:"rgba(250,250,247,0.5)",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:view===id?600:400,transition:"all .2s",letterSpacing:"0.04em"}}>{label}</button>
        ))}
      </div>

      {view==="shop"&&(
        <>
          {/* Filters */}
          <div style={{background:C.cream,borderBottom:`1px solid ${C.border}`,padding:"10px 40px",display:"flex",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(44,31,14,0.06)"}}>
            <div style={{position:"relative",marginRight:8}}>
              <input placeholder={t("search")} value={search} onChange={e=>setSearch(e.target.value)} dir={dir}
                style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 32px 7px 12px",fontSize:11,fontFamily:"'Outfit',sans-serif",color:C.text,outline:"none",width:180}}/>
              <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:C.sub,fontSize:12}}>🔍</span>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {CATS.map(c=>(
                <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?C.dark:"transparent",border:`1px solid ${cat===c?C.dark:C.border}`,borderRadius:20,padding:"5px 13px",fontSize:11,fontWeight:600,cursor:"pointer",color:cat===c?C.cream:C.text2,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>
                  {c==="Tous"?catsMap.all:catsMap[c]||c}
                </button>
              ))}
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 10px",fontSize:11,fontFamily:"'Outfit',sans-serif",color:C.text,background:C.cream,outline:"none",cursor:"pointer"}}>
                <option value="popular">{t("sort_pop")}</option>
                <option value="rating">{t("sort_rate")}</option>
                <option value="price_asc">{t("sort_asc")}</option>
                <option value="price_desc">{t("sort_desc")}</option>
              </select>
              {compare.length>0&&<button onClick={()=>setShowCmp(true)} style={{background:C.dark,border:"none",borderRadius:7,padding:"5px 11px",color:C.cream,fontSize:10,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700}}>{t("compare")} ({compare.length})</button>}
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub}}>{filtered.length}</div>
            </div>
          </div>

          {/* Grid */}
          <div style={{padding:"24px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
            {loading?(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18}}>
                {[...Array(8)].map((_,i)=>(
                  <div key={i} style={{background:C.cream,borderRadius:12,overflow:"hidden"}}>
                    <div className="skel" style={{height:260,width:"100%"}}/>
                    <div style={{padding:14,display:"flex",flexDirection:"column",gap:8}}>
                      <div className="skel" style={{height:9,borderRadius:4,width:"45%"}}/>
                      <div className="skel" style={{height:15,borderRadius:4,width:"80%"}}/>
                      <div style={{display:"flex",justifyContent:"space-between"}}><div className="skel" style={{height:20,borderRadius:4,width:"35%"}}/><div className="skel" style={{height:32,borderRadius:6,width:"35%"}}/></div>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18}}>
                {filtered.map((p,i)=>{
                  const inW=!!wishlist.find(x=>x.id===p.id);
                  const inC=!!compare.find(x=>x.id===p.id);
                  const artisan=ARTISANS.find(a=>a.id===p.artisanId);
                  const low=p.stock<=5;
                  return (
                    <div key={p.id} style={{background:C.cream,border:`1px solid ${inC?C.dark:C.border}`,borderRadius:12,overflow:"hidden",transition:"all .3s",boxShadow:inC?"0 0 0 2px "+C.dark:"0 1px 6px rgba(44,31,14,0.07)",animation:`fadeUp .35s ease ${i*.04}s both`}}
                      onMouseEnter={e=>{if(!inC){e.currentTarget.style.boxShadow="0 12px 32px rgba(44,31,14,0.14)";e.currentTarget.style.transform="translateY(-4px)";}}}
                      onMouseLeave={e=>{if(!inC){e.currentTarget.style.boxShadow="0 1px 6px rgba(44,31,14,0.07)";e.currentTarget.style.transform="none";}}}>
                      {/* Image — type "produit" en carte */}
                      <div style={{height:256,position:"relative",overflow:"hidden",cursor:"pointer"}}
                        onClick={()=>setSelected(p)}
                        onMouseEnter={e=>{const cap=e.currentTarget.querySelector('.img-caption');if(cap)cap.style.opacity="1";}}
                        onMouseLeave={e=>{const cap=e.currentTarget.querySelector('.img-caption');if(cap)cap.style.opacity="0";}}>
                        <ProductImage productId={p.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                        {/* Caption overlay */}
                        {VN[p.id]?.produit?.caption && (
                          <div className="img-caption" style={{position:"absolute",bottom:0,left:0,right:0,zIndex:4,padding:"22px 10px 8px",background:"linear-gradient(transparent,rgba(44,31,14,0.65))",opacity:0,transition:"opacity .3s"}}>
                            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.85)",lineHeight:1.4}}>{VN[p.id].produit.caption[lang]||VN[p.id].produit.caption.fr}</div>
                          </div>
                        )}
                        {p.badge&&<div style={{position:"absolute",top:10,left:10,background:p.badge==="Exclusif"?C.gold:C.dark,color:p.badge==="Exclusif"?C.dark:C.cream,fontSize:8,fontWeight:700,padding:"3px 8px",letterSpacing:"0.1em",fontFamily:"'Syne',sans-serif"}}>{p.badge.toUpperCase()}</div>}
                        {low&&<div style={{position:"absolute",top:10,right:10,background:"rgba(196,87,42,0.9)",color:"#fff",fontSize:8,fontWeight:700,padding:"3px 8px"}}>⚡ {p.stock}</div>}
                        {artisan&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 10px 8px",background:"linear-gradient(transparent,rgba(44,31,14,0.55))",fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.8)",zIndex:3}}>{t("by")} {artisan.nameKey}</div>}
                        <button onClick={e=>{e.stopPropagation();onWish(p);}} style={{position:"absolute",bottom:8,right:8,background:"rgba(250,250,247,0.88)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",zIndex:5,animation:inW?"heartPop .3s ease":"none"}}>{inW?"❤️":"🤍"}</button>
                      </div>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.amber,letterSpacing:"0.12em",fontWeight:600}}>{p.region[lang]||p.region.fr}</span>
                          <span style={{color:C.border2,fontSize:8}}>·</span>
                          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.sub}}>{p.tradition_tag[lang]||p.tradition_tag.fr}</span>
                        </div>
                        <div onClick={()=>setSelected(p)} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:C.text,marginBottom:4,lineHeight:1.3,cursor:"pointer"}}>{p.name[lang]||p.name.fr}</div>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
                          <span style={{color:C.gold,fontSize:10}}>{"★".repeat(Math.floor(p.rating))}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.sub}}>{p.rating} ({p.rCount})</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                          <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text}}>{fx(p.price)}</span>
                          <div style={{display:"flex",gap:4}}>
                            <button onClick={()=>toggleCmp(p)} style={{background:inC?C.dark:"transparent",border:`1px solid ${inC?C.dark:C.border}`,borderRadius:5,padding:"6px 7px",cursor:"pointer",fontSize:10,color:inC?C.cream:C.sub,transition:"all .2s"}} title={t("compare")}>⚖️</button>
                            <button onClick={()=>setSelected(p)} style={{background:C.dark,border:"none",borderRadius:6,padding:"7px 14px",color:C.cream,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em",transition:"all .2s"}}
                              onMouseEnter={e=>e.currentTarget.style.background=C.amber}
                              onMouseLeave={e=>e.currentTarget.style.background=C.dark}>
                              {t("view_product")} →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      {view==="artisans"&&<ArtisanSection lang={lang}/>}
      {view==="impact"&&<ImpactSection lang={lang}/>}
      {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} fx={fx} lang={lang}/>}
      {showCmp&&compare.length>0&&<CompareModal products={compare} onClose={()=>setShowCmp(false)} fx={fx} lang={lang}/>}
    </div>
  );
}

/* ══ WISHLIST VIEW ═══════════════════════════════════════════ */
function WishlistView({wishlist,onAdd,onWish,fx,lang,onBack}) {
  const t=useT();
  const [selected,setSelected]=useState(null);
  const dir=lang==="ar"?"rtl":"ltr";
  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg}} dir={dir}>
      <div style={{background:C.dark,padding:"20px 40px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,padding:"7px 12px",color:C.cream,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>← {t("back")}</button>
        <div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:24,color:C.cream}}>❤️ {t("wishlist")}</h1>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.gold}}>{wishlist.length} article(s)</div>
        </div>
      </div>
      <div style={{padding:"28px 40px",maxWidth:1060,margin:"0 auto"}}>
        {wishlist.length===0?(
          <div style={{textAlign:"center",padding:"70px 20px",background:C.cream,borderRadius:12,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,color:C.sub,marginBottom:14}}>🤍</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:C.text2,marginBottom:8}}>{t("empty_wish")}</div>
            <button onClick={onBack} style={{background:C.dark,border:"none",borderRadius:0,padding:"12px 28px",color:C.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:"0.08em",marginTop:8}}>{t("explore").toUpperCase()}</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18}}>
            {wishlist.map((p,i)=>(
              <div key={p.id} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",animation:`fadeUp .3s ease ${i*.05}s both`,transition:"all .25s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 10px 28px rgba(44,31,14,0.12)";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                <div style={{height:220,position:"relative",overflow:"hidden",cursor:"pointer"}}
                  onClick={()=>setSelected(p)}
                  onMouseEnter={e=>{const cap=e.currentTarget.querySelector('.img-caption');if(cap)cap.style.opacity="1";}}
                  onMouseLeave={e=>{const cap=e.currentTarget.querySelector('.img-caption');if(cap)cap.style.opacity="0";}}>
                  <ProductImage productId={p.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                  <div className="img-caption" style={{position:"absolute",bottom:0,left:0,right:0,zIndex:4,padding:"20px 10px 8px",background:"linear-gradient(transparent,rgba(44,31,14,0.65))",opacity:0,transition:"opacity .3s"}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.85)"}}>{VN[p.id]?.produit?.caption?.[lang]||""}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();onWish(p);}} style={{position:"absolute",top:10,right:10,background:"rgba(250,250,247,0.9)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>❤️</button>
                </div>
                <div style={{padding:"12px 14px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.amber,letterSpacing:"0.1em",marginBottom:4}}>{p.region[lang]||p.region.fr}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:C.text,marginBottom:8,lineHeight:1.3}}>{p.name[lang]||p.name.fr}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text}}>{fx(p.price)}</span>
                    <button onClick={()=>onAdd(p,{color:p.colors[0],size:p.sizes?.[0]})} style={{background:C.dark,border:"none",borderRadius:6,padding:"7px 14px",color:C.cream,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>+ {t("cart")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} fx={fx} lang={lang}/>}
    </div>
  );
}

/* ══ COMPARE MODAL ═══════════════════════════════════════════ */
function CompareModal({products,onClose,fx,lang}) {
  const t=useT();
  const rows=[[t("price")||"Prix",p=>fx(p.price)],[t("reviews")||"Avis",p=>`${"★".repeat(Math.floor(p.rating))} ${p.rating} (${p.rCount})`],[t("region_l")||"Région",p=>p.region[lang]||p.region.fr],[t("tradition")||"Tradition",p=>p.tradition_tag[lang]||p.tradition_tag.fr],[t("material")||"Matière",p=>p.material[lang]||p.material.fr],[t("stock_label")||"Stock",p=>`${p.stock} u.`]];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(44,31,14,0.5)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{background:C.cream,borderRadius:12,maxWidth:"92vw",overflow:"hidden",boxShadow:"0 24px 80px rgba(44,31,14,0.25)"}}>
        <div style={{padding:"14px 20px",background:C.dark,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:18,color:C.cream}}>{t("compare")}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:C.cream,fontSize:13}}>✕</button>
        </div>
        <div style={{padding:18,overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",width:"100%",fontFamily:"'Outfit',sans-serif"}}>
            <thead><tr><th style={{padding:"8px 14px",textAlign:"left",fontSize:11,color:C.sub,fontWeight:600,borderBottom:`2px solid ${C.border}`}}></th>
              {products.map(p=><th key={p.id} style={{padding:"8px 18px",textAlign:"center",borderBottom:`2px solid ${C.border}`,minWidth:140}}>
                <div style={{height:80,borderRadius:8,overflow:"hidden",marginBottom:8}}><ProductImage productId={p.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/></div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:13,color:C.text}}>{p.name[lang]||p.name.fr}</div>
              </th>)}
            </tr></thead>
            <tbody>{rows.map(([label,render])=>(
              <tr key={label} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"9px 14px",fontWeight:600,fontSize:12,color:C.text2}}>{label}</td>
                {products.map(p=><td key={p.id} style={{padding:"9px 18px",textAlign:"center",fontSize:12,color:C.text}}>{render(p)}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══ PRODUCT MODAL — VisualPassport intégré ══════════════════ */
function ProductModal({product:p,onClose,onAdd,onWish,wishlist,fx,lang}) {
  const t=useT();
  const [tab,setTab]=useState("story");
  const [qty,setQty]=useState(1);
  const [color,setColor]=useState(p.colors[0]);
  const [size,setSize]=useState(p.sizes?.[0]||null);
  const [adding,setAdding]=useState(false);
  const [showCertif,setShowCertif]=useState(false);
  const inW=!!wishlist.find(x=>x.id===p.id);
  const artisan=ARTISANS.find(a=>a.id===p.artisanId);
  const dir=lang==="ar"?"rtl":"ltr";

  const handleAdd=()=>{
    setAdding(true);
    for(let i=0;i<qty;i++)onAdd(p,{color,size});
    setTimeout(()=>{setAdding(false);onClose();},800);
  };

  const TABS=[["story",t("the_story")],["artisan",t("the_artisan")],["trace",t("traceability")],["reviews",`${t("reviews")} (${p.reviews.length})`]];

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(44,31,14,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu" dir={dir}
        style={{background:C.cream,width:780,maxWidth:"96vw",maxHeight:"94vh",overflow:"hidden",boxShadow:"0 30px 90px rgba(44,31,14,0.3)",display:"flex",flexDirection:"column"}}>

        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          {/* Left — Visual Passport */}
          <div style={{width:310,flexShrink:0,display:"flex",flexDirection:"column",background:C.bg3,padding:12,gap:0}}>
            <VisualPassport productId={p.id} lang={lang}/>
            {/* Wish button */}
            <button onClick={()=>onWish(p)} style={{marginTop:10,width:"100%",background:inW?`${C.terra}15`:"transparent",border:`1px solid ${inW?C.terra:C.border}`,borderRadius:0,padding:"8px",color:inW?C.terra:C.sub,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .2s"}}>
              {inW?"❤️ Retirer des favoris":"🤍 Ajouter aux favoris"}
            </button>
          </div>

          {/* Right — content */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Header */}
            <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.amber,letterSpacing:"0.15em",fontWeight:600}}>{p.region[lang]||p.region.fr}</span>
                    <span style={{color:C.border2,fontSize:8}}>·</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.sub}}>{p.tradition_tag[lang]||p.tradition_tag.fr}</span>
                    {artisan&&<><span style={{color:C.border2,fontSize:8}}>·</span><span style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.sage}}>{t("by")} {artisan.nameKey}</span></>}
                  </div>
                  <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:C.text,lineHeight:1.2}}>{p.name[lang]||p.name.fr}</h2>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                    <span style={{color:C.gold,fontSize:12}}>{"★".repeat(Math.floor(p.rating))}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>{p.rating}/5 · {p.rCount} {t("reviews")}</span>
                    <span style={{background:"#E8F5EC",border:"1px solid #C3E6CB",borderRadius:3,padding:"1px 6px",fontSize:8,color:C.sage,fontWeight:700}}>✓ {t("verified")}</span>
                  </div>
                </div>
                <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:"50%",width:28,height:28,cursor:"pointer",color:C.sub,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              {TABS.filter(([id])=>id!=="artisan"||artisan).map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"9px 4px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?C.dark:"transparent"}`,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:tab===id?700:400,color:tab===id?C.text:C.sub,transition:"all .2s"}}>{label}</button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
              {tab==="story"&&(
                <div>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.text,lineHeight:1.9,marginBottom:16}}>{p.story[lang]||p.story.fr}</p>
                  <div style={{display:"flex",gap:10}}>
                    {[[t("material"),p.material[lang]||p.material.fr,"🧵"],[t("technique"),p.technique[lang]||p.technique.fr,"🛠"]].map(([label,val,ico])=>(
                      <div key={label} style={{flex:1,background:C.bg2,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:4}}>{ico} {label.toUpperCase()}</div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text,fontWeight:600}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:12,background:"#EBF4EE",border:"1px solid #C3E6CB",borderRadius:8,padding:"10px 13px",display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20,flexShrink:0}}>🌱</span>
                    <div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sage,fontWeight:700,letterSpacing:"0.08em",marginBottom:2}}>{t("the_impact").toUpperCase()}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"#2D5A3D",lineHeight:1.5}}>{p.impact[lang]||p.impact.fr}</div>
                    </div>
                  </div>
                </div>
              )}
              {tab==="artisan"&&artisan&&(
                <div>
                  <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                    <div style={{width:64,height:64,overflow:"hidden",flexShrink:0}}>
                      <img src={artisan.img} alt={artisan.nameKey} onError={e=>{e.target.style.display="none";}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:18,color:C.text,marginBottom:3}}>{artisan.nameKey}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.amber,fontWeight:600,marginBottom:2}}>{artisan.tradition[lang]||artisan.tradition.fr}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{artisan.region} · {artisan.years} {t("years")}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sage,marginTop:3}}>{artisan.coop[lang]||artisan.coop.fr}</div>
                    </div>
                  </div>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.text,lineHeight:1.9}}>{artisan.story[lang]||artisan.story.fr}</p>
                  {/* Image fabrication de l'artisan */}
                  <div style={{marginTop:14,height:140,position:"relative",overflow:"hidden",borderRadius:4}}>
                    <ProductImage productId={p.id} type="fabrication" style={{width:"100%",height:"100%"}} showLabel lang={lang}/>
                  </div>
                </div>
              )}
              {tab==="trace"&&(
                <div>
                  {/* Image contexte géographique */}
                  <div style={{height:110,position:"relative",overflow:"hidden",borderRadius:4,marginBottom:14}}>
                    <ProductImage productId={p.id} type="contexte" style={{width:"100%",height:"100%"}} showLabel lang={lang}/>
                    {VN[p.id]?.contexte?.caption&&(
                      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 10px 7px",background:"linear-gradient(transparent,rgba(44,31,14,0.7))"}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.85)"}}>{VN[p.id].contexte.caption[lang]||VN[p.id].contexte.caption.fr}</div>
                      </div>
                    )}
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.12em",marginBottom:8}}>📍 {t("region_l").toUpperCase()}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,fontWeight:600,marginBottom:4}}>{p.region[lang]||p.region.fr}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text2,lineHeight:1.6}}>{p.tradition_tag[lang]||p.tradition_tag.fr}</div>
                  </div>
                  <div style={{background:C.bg2,borderRadius:8,padding:"13px 14px",marginBottom:12,border:`1px solid ${C.border}`}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.12em",marginBottom:10}}>🏅 {t("certificate").toUpperCase()}</div>
                    {(p.certif[lang]||p.certif.fr).split("·").map((item,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,paddingBottom:6,borderBottom:i<(p.certif[lang]||p.certif.fr).split("·").length-1?`1px solid ${C.border}`:"none"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:C.sage,flexShrink:0}}/>
                        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text}}>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setShowCertif(true)} style={{width:"100%",background:C.dark,border:"none",borderRadius:0,padding:"11px",color:C.cream,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:"0.1em",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    🏅 {t("certificate").toUpperCase()}
                  </button>
                </div>
              )}
              {tab==="reviews"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"10px 14px",background:C.bg2,borderRadius:8}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:36,color:C.text}}>{p.rating}</div>
                    <div><div style={{color:C.gold,fontSize:18}}>{"★".repeat(Math.floor(p.rating))}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>{p.rCount} {t("reviews")}</div></div>
                  </div>
                  {p.reviews.map((r,i)=>(
                    <div key={i} style={{padding:"13px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.dark,flexShrink:0}}>{r.n[0]}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{r.n}</span>
                            <span style={{color:C.gold,fontSize:11}}>{"★".repeat(r.s)}</span>
                            {r.v&&<span style={{background:"#E8F5EC",border:"1px solid #C3E6CB",borderRadius:3,padding:"1px 5px",fontSize:8,color:C.sage,fontWeight:700}}>✓ {t("verified")}</span>}
                            <span style={{marginLeft:"auto",fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{r.d}</span>
                          </div>
                          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text2,lineHeight:1.7}}>{r.t[lang]||r.t.fr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buy zone */}
            <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,flexShrink:0,background:C.cream}}>
              <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                {p.colors.length>1&&(
                  <div style={{flex:1,minWidth:120}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:4}}>{t("color").toUpperCase()} — <span style={{color:C.text,fontWeight:600}}>{color}</span></div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {p.colors.map(c=><button key={c} onClick={()=>setColor(c)} style={{background:color===c?C.dark:"transparent",border:`1px solid ${color===c?C.dark:C.border}`,borderRadius:0,padding:"4px 10px",fontSize:10,cursor:"pointer",color:color===c?C.cream:C.text2,transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{c}</button>)}
                    </div>
                  </div>
                )}
                {size&&(
                  <div style={{flex:1,minWidth:120}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:4}}>{t("size").toUpperCase()} — <span style={{color:C.text,fontWeight:600}}>{size}</span></div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {p.sizes.map(s=><button key={s} onClick={()=>setSize(s)} style={{background:size===s?C.dark:"transparent",border:`1px solid ${size===s?C.dark:C.border}`,borderRadius:0,padding:"4px 9px",fontSize:10,cursor:"pointer",color:size===s?C.cream:C.text2,transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{s}</button>)}
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:C.text}}>{fx(p.price*qty)}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{t("handmade")} · {t("fair_trade")}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,padding:"6px 10px"}}>
                    <button onClick={()=>setQty(Math.max(1,qty-1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:C.text2,width:20}}>−</button>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.text,minWidth:18,textAlign:"center"}}>{qty}</span>
                    <button onClick={()=>setQty(Math.min(p.stock,qty+1))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:C.text2,width:20}}>+</button>
                  </div>
                  <button onClick={handleAdd} style={{background:adding?C.sage:C.dark,border:"none",padding:"12px 22px",color:C.cream,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:"0.08em",transition:"all .3s",display:"flex",alignItems:"center",gap:6}}>
                    {adding?<><span style={{animation:"rotateIn .4s ease"}}>✓</span>{t("added")}</>:t("add_to_cart").toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCertif&&<CertificatModal product={p} onClose={()=>setShowCertif(false)} lang={lang}/>}
    </div>
  );
}

/* ══ CERTIFICAT MODAL ════════════════════════════════════════ */
function CertificatModal({product:p,onClose,lang}) {
  const t=useT();
  const artisan=ARTISANS.find(a=>a.id===p.artisanId);
  const certifNum=`NS-${p.id.toString().padStart(3,"0")}-${Date.now().toString().slice(-4)}`;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(44,31,14,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{background:"linear-gradient(135deg,#FAFAF7 0%,#F5EDE0 40%,#EDE0CC 100%)",width:480,maxWidth:"94vw",boxShadow:"0 30px 80px rgba(44,31,14,0.35)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:10,border:`1px solid ${C.gold}`,pointerEvents:"none",opacity:.4}}/>
        <div style={{position:"absolute",inset:14,border:`1px solid ${C.gold}`,pointerEvents:"none",opacity:.15}}/>
        <div style={{padding:"36px 40px",textAlign:"center"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,letterSpacing:"0.3em",marginBottom:8}}>CERTIFICAT D'AUTHENTICITÉ</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:28,color:C.dark,marginBottom:4}}>NouaSell</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.12em",marginBottom:24}}>ARTISANAT MAROCAIN CERTIFIÉ</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${C.gold})`}}/>
            <div style={{color:C.gold,fontSize:18}}>✦</div>
            <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,${C.gold})`}}/>
          </div>
          {/* Product image — détail */}
          <div style={{height:80,width:80,margin:"0 auto 16px",position:"relative",overflow:"hidden"}}>
            <ProductImage productId={p.id} type="detail" style={{width:"100%",height:"100%"}} lang={lang}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.12em",marginBottom:6}}>PIÈCE CERTIFIÉE</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:C.dark,marginBottom:4}}>{p.name[lang]||p.name.fr}</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.amber}}>N° {certifNum}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20,textAlign:"left"}}>
            {[[t("region_l"),p.region[lang]||p.region.fr],[t("tradition"),p.tradition_tag[lang]||p.tradition_tag.fr],[t("material"),p.material[lang]||p.material.fr],[t("technique"),p.technique[lang]||p.technique.fr]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(44,31,14,0.04)",border:`1px solid ${C.border}`,borderRadius:4,padding:"8px 10px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.sub,letterSpacing:"0.1em",marginBottom:3}}>{k.toUpperCase()}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          {artisan&&(
            <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:"rgba(44,31,14,0.04)",border:`1px solid ${C.border}`,marginBottom:20}}>
              <img src={artisan.img} alt={artisan.nameKey} onError={e=>{e.target.style.display="none";}} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub,letterSpacing:"0.1em",marginBottom:2}}>RÉALISÉ PAR</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:C.dark}}>{artisan.nameKey}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.amber}}>{artisan.region} · {artisan.years} ans</div>
              </div>
              <div style={{marginLeft:"auto",fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:C.gold,opacity:.6,fontStyle:"italic"}}>{artisan.nameKey.split(" ")[0][0]}.</div>
            </div>
          )}
          <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
            {[t("certified"),t("handmade"),t("fair_trade")].map(badge=>(
              <div key={badge} style={{background:"transparent",border:`1px solid ${C.gold}`,padding:"4px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.amber,letterSpacing:"0.12em"}}>{badge.toUpperCase()}</div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${C.gold})`}}/>
            <div style={{color:C.gold,fontSize:14}}>✦</div>
            <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,${C.gold})`}}/>
          </div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:C.sub,letterSpacing:"0.08em"}}>NouaSell · Kénitra, Maroc · {new Date().getFullYear()}</div>
          <button onClick={onClose} style={{marginTop:20,background:"transparent",border:`1px solid ${C.border}`,padding:"10px 28px",color:C.text2,fontSize:11,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em"}}>✕ Fermer</button>
        </div>
      </div>
    </div>
  );
}

/* ══ ARTISAN SECTION ═════════════════════════════════════════ */
function ArtisanSection({lang}) {
  const t=useT();
  const [selected,setSelected]=useState(null);
  const dir=lang==="ar"?"rtl":"ltr";
  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg,padding:"40px"}} dir={dir}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{marginBottom:32}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.2em",marginBottom:10}}>✦ {t("our_artisans").toUpperCase()}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:36,color:C.text,marginBottom:8}}>{t("our_artisans")}</h2>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:C.text2,lineHeight:1.8,maxWidth:560}}>{t("impact_tagline")}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20,marginBottom:40}}>
          {ARTISANS.map((a,i)=>(
            <div key={a.id} onClick={()=>setSelected(selected?.id===a.id?null:a)}
              style={{background:C.cream,border:`1px solid ${selected?.id===a.id?C.dark:C.border}`,overflow:"hidden",cursor:"pointer",transition:"all .3s",animation:`fadeUp .35s ease ${i*.08}s both`,boxShadow:selected?.id===a.id?"0 12px 40px rgba(44,31,14,0.15)":"0 2px 8px rgba(44,31,14,0.06)"}}
              onMouseEnter={e=>{if(selected?.id!==a.id)e.currentTarget.style.boxShadow="0 10px 30px rgba(44,31,14,0.12)";}}
              onMouseLeave={e=>{if(selected?.id!==a.id)e.currentTarget.style.boxShadow="0 2px 8px rgba(44,31,14,0.06)";}}>
              <div style={{height:200,overflow:"hidden",position:"relative"}}>
                <img src={a.img} alt={a.nameKey} onError={e=>{e.target.style.background=C.bg3;e.target.style.display="none";}}
                  style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",transition:"transform .5s"}}
                  onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
                  onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 14px 10px",background:"linear-gradient(transparent,rgba(44,31,14,0.75))"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:17,color:C.cream}}>{a.nameKey}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.gold}}>{a.tradition[lang]||a.tradition.fr}</div>
                </div>
              </div>
              <div style={{padding:"12px 14px",background:selected?.id===a.id?C.bg2:C.cream}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:a.color,flexShrink:0}}/>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.amber}}>{a.region}</div>
                </div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginBottom:4}}>{a.coop[lang]||a.coop.fr}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.text2}}>{a.years} {t("years")}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sage}}>{a.products.length} produit(s)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selected&&(
          <div className="fu" style={{background:C.cream,border:`1px solid ${C.border}`,padding:"28px 32px",marginBottom:24,boxShadow:"0 8px 32px rgba(44,31,14,0.1)"}}>
            <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}>
              <img src={selected.img} alt={selected.nameKey} onError={e=>{e.target.style.display="none";}} style={{width:100,height:100,objectFit:"cover",objectPosition:"center top",flexShrink:0}}/>
              <div style={{flex:1,minWidth:260}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.15em",marginBottom:8}}>✦ ARTISAN EN VEDETTE</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:C.text,marginBottom:4}}>{selected.nameKey}</h3>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.amber,marginBottom:4}}>{selected.tradition[lang]||selected.tradition.fr}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub,marginBottom:14}}>{selected.region} · {selected.coop[lang]||selected.coop.fr}</div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.text,lineHeight:1.9}}>{selected.story[lang]||selected.story.fr}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ MAP MAROC ═══════════════════════════════════════════════ */
function MapMaroc({lang}) {
  const t=useT();
  const [hovered,setHovered]=useState(null);
  const REGIONS=[
    {id:"fes",name:"Fès el-Bali",x:62,y:34,tradition:{fr:"Broderie, maroquinerie, poterie",en:"Embroidery, leatherwork, pottery",ar:"تطريز، جلد، فخار"},artisans:2,color:C.amber},
    {id:"marra",name:"Marrakech",x:44,y:62,tradition:{fr:"Zellige, cuivre, tapis",en:"Zellige, copper, rugs",ar:"زليج، نحاس، سجاد"},artisans:1,color:C.terra},
    {id:"atlas",name:"Haut Atlas",x:52,y:72,tradition:{fr:"Tissage berbère, laine",en:"Berber weaving, wool",ar:"نسيج أمازيغي، صوف"},artisans:1,color:C.sage},
    {id:"souss",name:"Souss-Massa",x:30,y:80,tradition:{fr:"Argan, vannerie, bijoux",en:"Argan, basketry, jewellery",ar:"أركان، سلال، مجوهرات"},artisans:0,color:C.green_s},
    {id:"safi",name:"Safi",x:22,y:57,tradition:{fr:"Céramique, poterie",en:"Ceramics, pottery",ar:"خزف، فخار"},artisans:0,color:C.gold},
    {id:"meknes",name:"Meknès-Gharb",x:52,y:30,tradition:{fr:"Thé, olives, broderie",en:"Tea, olives, embroidery",ar:"شاي، زيتون، تطريز"},artisans:0,color:"#6B7C5E"},
  ];
  return (
    <div style={{padding:"40px",background:C.bg,flex:1,overflowY:"auto"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.amber,letterSpacing:"0.2em",marginBottom:10}}>✦ {t("our_regions").toUpperCase()}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:36,color:C.text,marginBottom:8}}>{t("our_regions")}</h2>
        </div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <div style={{background:C.cream,border:`1px solid ${C.border}`,padding:16,flex:"1 1 340px",minHeight:320,position:"relative"}}>
            <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",maxHeight:360}}>
              <path d="M20,10 L70,8 L85,15 L90,35 L88,55 L75,75 L65,90 L45,95 L25,88 L10,70 L8,45 L10,25 Z" fill={C.bg3} stroke={C.border2} strokeWidth="0.8"/>
              {REGIONS.map(r=>(
                <g key={r.id} onClick={()=>setHovered(hovered?.id===r.id?null:r)} style={{cursor:"pointer"}}>
                  <circle cx={r.x} cy={r.y} r={hovered?.id===r.id?5:3.5} fill={r.color} stroke={C.cream} strokeWidth="1" style={{transition:"r .2s"}}/>
                  {hovered?.id===r.id&&<circle cx={r.x} cy={r.y} r="8" fill={r.color} opacity="0.15"/>}
                  <text x={r.x+(r.x>55?-2:2)} y={r.y-5} textAnchor={r.x>55?"end":"start"} fontSize="3.5" fill={C.text} fontFamily="Outfit,sans-serif" fontWeight="600">{r.name.split(" ")[0]}</text>
                </g>
              ))}
              <text x="90" y="10" fontSize="5" fill={C.sub} fontFamily="Outfit,sans-serif" opacity=".5">N</text>
            </svg>
          </div>
          <div style={{flex:"1 1 260px",display:"flex",flexDirection:"column",gap:10}}>
            {REGIONS.map(r=>(
              <div key={r.id} onClick={()=>setHovered(hovered?.id===r.id?null:r)}
                style={{background:hovered?.id===r.id?C.bg2:C.cream,border:`1px solid ${hovered?.id===r.id?r.color:C.border}`,padding:"12px 14px",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{if(hovered?.id!==r.id)e.currentTarget.style.borderColor=r.color;}}
                onMouseLeave={e=>{if(hovered?.id!==r.id)e.currentTarget.style.borderColor=C.border;}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:r.color,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:15,color:C.text}}>{r.name}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub,marginTop:2}}>{r.tradition[lang]||r.tradition.fr}</div>
                  </div>
                  {r.artisans>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:r.color,background:`${r.color}15`,padding:"2px 7px"}}>{r.artisans} art.</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ IMPACT SECTION ══════════════════════════════════════════ */
function ImpactSection({lang}) {
  const t=useT();
  const STATS=[{n:"340",l:{fr:"artisans certifiés",en:"certified artisans",ar:"حرفياً معتمداً"},icon:"👐"},{n:"12",l:{fr:"coopératives",en:"cooperatives",ar:"تعاونية"},icon:"🤝"},{n:"1 200+",l:{fr:"familles",en:"families",ar:"عائلة"},icon:"🏡"},{n:"100%",l:{fr:"matières naturelles",en:"natural materials",ar:"مواد طبيعية"},icon:"🌿"},{n:"8",l:{fr:"ans de tradition",en:"years tradition",ar:"سنوات"},icon:"🕰️"},{n:"47",l:{fr:"pays livrés",en:"countries",ar:"دولة"},icon:"🌍"}];
  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,#2C1F0E,#4A2E1A)`,padding:"48px 60px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 30% 50%,rgba(107,124,94,0.15),transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:700}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,letterSpacing:"0.22em",marginBottom:12}}>✦ {t("our_impact").toUpperCase()}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:38,color:C.cream,marginBottom:12,lineHeight:1.2}}>{t("impact_tagline")}</h2>
          <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:300,fontSize:14,color:"rgba(250,250,247,0.65)",lineHeight:1.8,maxWidth:500}}>NouaSell n'est pas une marketplace. C'est un pont entre des mains qui créent et des maisons qui accueillent.</p>
        </div>
      </div>
      <div style={{padding:"40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,marginBottom:40}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{background:C.cream,border:`1px solid ${C.border}`,padding:"20px 16px",textAlign:"center",animation:`fadeUp .35s ease ${i*.07}s both`,transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(44,31,14,0.1)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:30,color:C.amber,marginBottom:4}}>{s.n}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.text2,lineHeight:1.5}}>{s.l[lang]||s.l.fr}</div>
            </div>
          ))}
        </div>
        {/* Témoignages avec photos produit */}
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:C.text,marginBottom:20}}>Ce que dit notre communauté</h3>
        <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:8}}>
          {PRODUCTS.flatMap(p=>p.reviews.map(r=>({...r,pid:p.id,product:p.name[lang]||p.name.fr}))).filter(r=>r.v).slice(0,5).map((r,i)=>(
            <div key={i} style={{background:C.cream,border:`1px solid ${C.border}`,padding:"16px 18px",minWidth:220,flexShrink:0}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.dark,flexShrink:0}}>{r.n[0]}</div>
                <div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{r.n}</div><div style={{color:C.gold,fontSize:11}}>{"★".repeat(r.s)}</div></div>
              </div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text2,lineHeight:1.7,marginBottom:10}}>"{r.t[lang]||r.t.fr}"</p>
              {/* Mini photo produit */}
              <div style={{height:44,position:"relative",overflow:"hidden",borderRadius:4}}>
                <ProductImage productId={r.pid} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                <div style={{position:"absolute",inset:0,background:"rgba(44,31,14,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.9)",fontWeight:600,textAlign:"center",padding:"0 6px",lineHeight:1.3}}>{r.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ PROFILE VIEW ════════════════════════════════════════════ */
function ProfileView({user,orders,loyaltyPts,fx,lang,onBack}) {
  const t=useT();
  const [tab,setTab]=useState("orders");
  const totalSpent=orders.reduce((s,o)=>s+o.total,0);
  const LEVEL=loyaltyPts<100?"Bronze":loyaltyPts<300?"Argent":loyaltyPts<600?"Or":"Platine";
  const LC={"Bronze":"#CD7F32","Argent":"#C0C0C0","Or":C.gold,"Platine":"#E5E4E2"};
  const dir=lang==="ar"?"rtl":"ltr";
  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg}} dir={dir}>
      <div style={{background:C.dark,padding:"20px 40px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 80% 50%,rgba(201,169,110,0.08),transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:960,margin:"0 auto"}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:4,padding:"7px 12px",color:C.cream,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",marginBottom:16}}>← {t("back")}</button>
          <div style={{display:"flex",gap:18,alignItems:"flex-start",paddingBottom:20,flexWrap:"wrap"}}>
            <div style={{width:58,height:58,background:`linear-gradient(135deg,${C.gold},${C.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:C.dark,flexShrink:0,fontFamily:"'Cormorant Garamond',serif"}}>{user.name[0]}</div>
            <div style={{flex:1}}>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:C.cream,marginBottom:3}}>{user.name}</h1>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.gold,marginBottom:12}}>{user.email} · {user.city}</div>
              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                {[{l:t("my_orders"),v:orders.length},{l:"Dépensé",v:`${totalSpent.toLocaleString()} MAD`},{l:t("pts"),v:`⭐ ${loyaltyPts}`},{l:t("loyalty"),v:`🏅 ${LEVEL}`}].map(k=>(
                  <div key={k.l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:k.l===t("loyalty")?LC[LEVEL]:C.gold}}>{k.v}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"rgba(250,250,247,0.4)"}}>{k.l}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:2}}>
            {[[t("my_orders"),"orders"],[t("loyalty"),"loyalty"]].map(([label,id])=>(
              <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"rgba(201,169,110,0.8)":"transparent"}`,padding:"8px 16px",color:tab===id?"rgba(250,250,247,0.9)":"rgba(250,250,247,0.35)",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?700:400,transition:"all .2s"}}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"28px 40px",maxWidth:960,margin:"0 auto"}}>
        {tab==="orders"&&(
          <div>
            {orders.length===0?(
              <div style={{textAlign:"center",padding:"50px",background:C.cream,border:`1px solid ${C.border}`}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:C.sub,marginBottom:12}}>📋</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text2}}>{t("no_orders")}</div>
              </div>
            ):orders.map((o,i)=>(
              <div key={o.id} style={{background:C.cream,border:`1px solid ${C.border}`,padding:"16px 20px",marginBottom:10,animation:`fadeUp .3s ease ${i*.05}s both`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.amber,marginBottom:2}}>{o.id}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sub}}>{o.date}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text}}>{fx(o.total)}</div>
                    <div style={{background:o.status==="Livrée"?"#E8F5EC":"#FEF9C3",border:`1px solid ${o.status==="Livrée"?"#C3E6CB":"#FDE68A"}`,padding:"2px 8px",fontSize:9,color:o.status==="Livrée"?C.sage:"#92400E",fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                  </div>
                </div>
                {/* Order items avec miniatures visuelles */}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {o.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"center",gap:6,background:C.bg2,border:`1px solid ${C.border}`,padding:"4px 8px 4px 4px"}}>
                      <div style={{width:28,height:28,flexShrink:0,overflow:"hidden"}}>
                        <ProductImage productId={item.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                      </div>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.text}}>{item.name[lang]||item.name.fr||item.name} ×{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="loyalty"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {[{title:"🎯 Offres personnalisées",desc:"Sélection basée sur vos achats et vos favoris.",slide:"Personnalisation · Slide 19",color:C.amber},{title:"🔔 Alertes de prix",desc:"Notification quand un article de vos favoris baisse.",slide:"Densité d'info · Slide 20",color:C.sage},{title:"📦 Livraison prioritaire",desc:"File prioritaire dès le niveau Argent.",slide:"Portée mondiale · Slide 15",color:C.gold},{title:"🏅 Points doublés",desc:"×2 points sur les achats depuis la wishlist.",slide:"Tech. Sociale · Slide 21",color:C.amber}].map(card=>(
              <div key={card.title} style={{background:C.cream,border:`1px solid ${C.border}`,padding:"18px 20px"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:17,color:C.text,marginBottom:6}}>{card.title}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text2,lineHeight:1.7,marginBottom:8}}>{card.desc}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:card.color,background:`${card.color}12`,border:`1px solid ${card.color}25`,padding:"2px 7px",display:"inline-block"}}>{card.slide}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ CART DRAWER ═════════════════════════════════════════════ */
function CartDrawer({cart,total,onClose,onRemove,onQty,onOrder,fx,toast,lang}) {
  const t=useT();
  const [step,setStep]=useState(0);
  const [info,setInfo]=useState({name:"",email:"",phone:"",address:"",city:"Casablanca",delivery:"standard"});
  const [payment,setPayment]=useState("CMI");
  const [promo,setPromo]=useState("");
  const [promoApplied,setPromoApplied]=useState(null);
  const [confirmed,setConfirmed]=useState(null);
  const [paying,setPaying]=useState(false);
  const [trackStep,setTrackStep]=useState(0);
  const dir=lang==="ar"?"rtl":"ltr";

  const disc=promoApplied?PROMOS[promoApplied]:0;
  const dFee=info.delivery==="express"?50:total>=500?0:30;
  const dAmt=Math.round(total*disc/100);
  const finalTotal=total-dAmt+dFee;

  const applyPromo=()=>{
    if(PROMOS[promo.toUpperCase()]){setPromoApplied(promo.toUpperCase());toast(`Code ${promo.toUpperCase()} — -${PROMOS[promo.toUpperCase()]}%`,"success","🏷️");}
    else toast("Code invalide","error","✕");
  };

  const handlePay=()=>{
    setPaying(true);
    setTimeout(()=>{
      const o=onOrder({...info,payment},disc);
      setConfirmed(o);setStep(3);setPaying(false);
      [1,2,3].forEach((_,idx)=>setTimeout(()=>setTrackStep(v=>v+1),3000+idx*4000));
    },2200);
  };

  const SLABELS=[t("cart"),t("shipping"),t("payment"),t("confirmation")];
  const FLOW=["En attente","En traitement","Expédiée","Livrée"];

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={step<3?onClose:undefined} style={{flex:1,background:"rgba(44,31,14,0.4)",backdropFilter:"blur(3px)"}}/>
      <div className="fi" style={{width:430,background:C.cream,display:"flex",flexDirection:"column",boxShadow:"-8px 0 48px rgba(44,31,14,0.2)"}} dir={dir}>
        <div style={{padding:"14px 18px",background:C.dark,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:step<3?10:0}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:18,color:C.cream}}>{SLABELS[step]}</div>
            {step<3&&<button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",width:28,height:28,cursor:"pointer",color:C.cream,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
          </div>
          {step<3&&(
            <div style={{display:"flex",gap:4}}>
              {[t("cart"),t("shipping"),t("payment")].map((s,i)=>(
                <div key={s} style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{height:2,background:i<=step?"rgba(201,169,110,0.8)":"rgba(255,255,255,0.15)",transition:"all .4s"}}/>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:8,color:i===step?"rgba(250,250,247,0.85)":"rgba(255,255,255,0.3)",fontWeight:i===step?700:400}}>{s}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 18px",position:"relative"}}>
          {step===0&&(cart.length===0
            ?<div style={{textAlign:"center",padding:"50px",color:C.sub,fontFamily:"'Outfit',sans-serif"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,marginBottom:12}}>🛒</div><div style={{fontSize:16,fontWeight:600,color:C.text2}}>{t("empty_cart")}</div></div>
            :<>
              {cart.map(item=>(
                <div key={item.key} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:52,height:52,flexShrink:0,overflow:"hidden"}}>
                    <ProductImage productId={item.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:13,color:C.text,marginBottom:1}}>{item.name[lang]||item.name.fr||item.name}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.sub}}>{item.color}{item.size?` · ${item.size}`:""}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub}}>{fx(item.price)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <button onClick={()=>onQty(item.key,-1)} style={{width:22,height:22,border:`1px solid ${C.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>onQty(item.key,1)} style={{width:22,height:22,border:`1px solid ${C.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:14,color:C.text,minWidth:60,textAlign:"right"}}>{fx(item.price*item.qty)}</div>
                  <button onClick={()=>onRemove(item.key)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.border2,fontSize:14,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.terra} onMouseLeave={e=>e.currentTarget.style.color=C.border2}>✕</button>
                </div>
              ))}
              <div style={{marginTop:12,padding:"12px 14px",background:C.bg2,border:`1px solid ${C.border}`}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:600,color:C.text2,marginBottom:7}}>🏷️ {t("promo")}</div>
                {promoApplied?<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.sage}}>✓ {promoApplied} — -{disc}%</div>:
                  <div style={{display:"flex",gap:6}}>
                    <input value={promo} onChange={e=>setPromo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyPromo()} placeholder="Ex: ENCG2025" style={{flex:1,border:`1px solid ${C.border}`,padding:"6px 9px",fontSize:11,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff",color:C.text}}/>
                    <button onClick={applyPromo} style={{background:C.dark,border:"none",padding:"6px 12px",color:C.cream,fontSize:11,fontWeight:700,cursor:"pointer"}}>{t("apply")}</button>
                  </div>}
              </div>
              <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.text2}}><span>{t("subtotal")}</span><span>{fx(total)}</span></div>
                {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.sage}}><span>-{disc}%</span><span>-{fx(dAmt)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${C.dark}`,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text,marginTop:4}}><span>{t("total")}</span><span>{fx(total-dAmt)}</span></div>
              </div>
            </>
          )}
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[[t("name_f"),"name","text"],[t("email_f"),"email","email"],[t("phone_f"),"phone","tel"],[t("address_f"),"address","text"]].map(([label,field,type])=>(
                <div key={field}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:C.text2,marginBottom:4}}>{label}</div>
                  <input type={type} value={info[field]} onChange={e=>setInfo(p=>({...p,[field]:e.target.value}))} dir={dir} style={{width:"100%",border:`1px solid ${info[field]?C.dark:C.border}`,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:C.text,outline:"none",transition:"border-color .2s",background:"#fff"}}/>
                </div>
              ))}
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:C.text2,marginBottom:4}}>{t("city_f")}</div>
                <select value={info.city} onChange={e=>setInfo(p=>({...p,city:e.target.value}))} style={{width:"100%",border:`1px solid ${C.dark}`,padding:"9px 11px",fontSize:12,fontFamily:"'Outfit',sans-serif",color:C.text,background:"#fff",outline:"none"}}>
                  {["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Meknès","Kénitra"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:C.text2,marginBottom:8}}>{t("delivery")}</div>
                {[["standard",t("standard"),"3–5j",t("free_above"),30],["express",t("express"),"24–48h","Priorité",50]].map(([val,label,time,note,fee])=>(
                  <div key={val} onClick={()=>setInfo(p=>({...p,delivery:val}))} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",border:`1px solid ${info.delivery===val?C.dark:C.border}`,marginBottom:6,cursor:"pointer",background:info.delivery===val?C.bg2:"transparent",transition:"all .2s"}}>
                    <div style={{width:14,height:14,border:`2px solid ${info.delivery===val?C.dark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{info.delivery===val&&<div style={{width:7,height:7,background:C.dark}}/>}</div>
                    <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{time} · {note}</div></div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:14,color:total>=500&&val==="standard"?C.sage:C.text}}>{total>=500&&val==="standard"?"Gratuite":`+${fee} MAD`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:11,color:C.text2,marginBottom:8}}>{t("payment")}</div>
                {[["CMI","💳","Carte marocaine","TLS 1.3 + 3D Secure"],["Stripe","🌍","Carte internationale","PCI DSS Level 1"],["PayPal","🏧","Compte PayPal","Protection 180 jours"],["Cash","💵","Cash livraison","Paiement à réception"]].map(([val,ico,label,note])=>(
                  <div key={val} onClick={()=>setPayment(val)} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 13px",border:`1px solid ${payment===val?C.dark:C.border}`,marginBottom:6,cursor:"pointer",background:payment===val?C.bg2:"transparent",transition:"all .2s"}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ico}</span>
                    <div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:C.text}}>{label}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.sub}}>{note}</div></div>
                    <div style={{width:14,height:14,border:`2px solid ${payment===val?C.dark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{payment===val&&<div style={{width:7,height:7,background:C.dark}}/>}</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,padding:"12px 14px"}}>
                {cart.map(i=>(
                  <div key={i.key} style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text2,marginBottom:4}}>
                    <span>{i.name[lang]||i.name.fr||i.name} ×{i.qty}</span><span style={{fontWeight:600}}>{fx(i.price*i.qty)}</span>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8,display:"flex",flexDirection:"column",gap:4}}>
                  {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.sage}}><span>-{disc}%</span><span>-{fx(dAmt)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.text2}}><span>{t("delivery")}</span><span>{dFee===0?"Gratuite":`+${dFee} MAD`}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,color:C.text,paddingTop:4,borderTop:`1px solid ${C.border}`}}><span>{t("total")}</span><span>{fx(finalTotal)}</span></div>
                </div>
              </div>
            </div>
          )}
          {step===3&&confirmed&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:60,marginBottom:12,animation:"checkPop .6s ease"}}>✅</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:24,color:C.text,marginBottom:4}}>{t("confirmed")}</h3>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.amber,marginBottom:6}}>{confirmed.id}</div>
              <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFFBF5)",border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>⭐</span>
                <div style={{textAlign:"left"}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.amber}}>+{Math.round(confirmed.total/10)} {t("pts_earned")}</div></div>
              </div>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,padding:"14px 16px",textAlign:"left"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:C.text,marginBottom:12}}>📦 {t("tracking")}</div>
                {["Confirmée","En préparation","Expédiée","Livrée"].map((label,idx)=>{
                  const done=idx<=trackStep,active=idx===trackStep&&idx>0;
                  return (
                    <div key={label} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:idx<3?12:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                        <div style={{width:20,height:20,border:`2px solid ${done?C.dark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done?C.cream:C.sub,background:done?C.dark:"transparent",transition:"all .5s"}}>{done?"✓":idx+1}</div>
                        {idx<3&&<div style={{width:2,height:16,background:done&&idx<trackStep?C.dark:C.border,transition:"all .5s",marginTop:2}}/>}
                      </div>
                      <div style={{paddingTop:2}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:done?600:400,color:done?C.text:C.sub,transition:"all .5s"}}>{label}</div>
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
              <div style={{width:56,height:56,border:`2px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:C.text,fontWeight:600}}>Traitement en cours...</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.sub}}>🔒 TLS 1.3</div>
            </div>
          )}
        </div>
        <div style={{padding:"12px 18px",borderTop:`1px solid ${C.border}`,background:C.cream,flexShrink:0}}>
          {step===0&&cart.length>0&&<button onClick={()=>setStep(1)} style={{width:"100%",background:C.dark,border:"none",padding:"13px",color:C.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:"0.08em",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.amber} onMouseLeave={e=>e.currentTarget.style.background=C.dark}>{t("checkout").toUpperCase()} — {fx(total)} →</button>}
          {step===1&&<div style={{display:"flex",gap:7}}>
            <button onClick={()=>setStep(0)} style={{flex:1,background:"transparent",border:`1px solid ${C.border}`,padding:"11px",color:C.text2,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← {t("back")}</button>
            <button onClick={()=>setStep(2)} disabled={!info.name||!info.email||!info.address} style={{flex:2,background:info.name&&info.email&&info.address?C.dark:C.border,border:"none",padding:"11px",color:info.name&&info.email&&info.address?C.cream:C.sub,fontSize:12,fontWeight:600,cursor:info.name&&info.email&&info.address?"pointer":"not-allowed",fontFamily:"'Syne',sans-serif",letterSpacing:"0.06em",transition:"all .3s"}}>{t("payment").toUpperCase()} →</button>
          </div>}
          {step===2&&<div style={{display:"flex",gap:7}}>
            <button onClick={()=>setStep(1)} style={{flex:1,background:"transparent",border:`1px solid ${C.border}`,padding:"11px",color:C.text2,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>← {t("back")}</button>
            <button onClick={handlePay} style={{flex:2,background:C.dark,border:"none",padding:"11px",color:C.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:"0.06em",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔒 {t("pay_now")} {fx(finalTotal)}</button>
          </div>}
          {step===3&&<button onClick={onClose} style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,padding:"11px",color:C.text2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{t("continue")}</button>}
        </div>
      </div>
    </div>
  );
}

/* ══ ADMIN VIEW ══════════════════════════════════════════════ */
function AdminView({orders,setOrders,products,loyaltyPts,lang}) {
  const [tab,setTab]=useState("overview");
  const totalRev=orders.reduce((s,o)=>s+o.total,0);
  const SC={"En attente":C.xambr,"En traitement":C.cyan,"Expédiée":C.violet,"Livrée":C.green};
  const FLOW=["En attente","En traitement","Expédiée","Livrée"];
  const advance=id=>setOrders(p=>p.map(o=>{if(o.id!==id)return o;const i=FLOW.indexOf(o.status);return{...o,status:i<FLOW.length-1?FLOW[i+1]:o.status};}));
  const ANALYTICS=[{d:"Lun",r:8400},{d:"Mar",r:14200},{d:"Mer",r:6300},{d:"Jeu",r:19800},{d:"Ven",r:26500},{d:"Sam",r:23100},{d:"Dim",r:12400}];
  const mxR=Math.max(...ANALYTICS.map(a=>a.r));
  const TABS=[["overview","📊","Dashboard"],["orders","📋","Commandes"],["products","📦","Produits"],["analytics","📈","Analytics"]];
  return (
    <div style={{flex:1,display:"flex",overflow:"hidden",background:C.xbg}}>
      <div style={{width:175,background:C.xs1,borderRight:`1px solid ${C.xb}`,padding:"14px 0",flexShrink:0}}>
        <div style={{padding:"0 14px",marginBottom:12}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.xdim,letterSpacing:"0.15em"}}>BACK-OFFICE</div></div>
        {TABS.map(([id,ico,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{width:"100%",background:tab===id?C.xs2:"transparent",border:"none",borderLeft:`2px solid ${tab===id?C.cyan:"transparent"}`,padding:"9px 14px",color:tab===id?C.xtext:C.xsub,cursor:"pointer",textAlign:"left",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:tab===id?600:400,display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}>{ico} {label}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>
        {tab==="overview"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.xtext,marginBottom:3}}>Dashboard</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>KPIs temps réel · Slides 99–112</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[{l:"Commandes",v:orders.length,c:C.cyan},{l:"Revenus",v:`${totalRev.toLocaleString()} MAD`,c:C.green},{l:"Produits",v:products.length,c:C.xambr},{l:"Pts fidélité",v:loyaltyPts,c:C.violet}].map(k=>(
                <div key={k.l} style={{background:C.xs2,border:`1px solid ${C.xb}`,borderRadius:11,padding:"14px 15px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xsub,marginBottom:8}}>{k.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:k.c}}>{k.v}</div>
                </div>
              ))}
            </div>
            {orders.length===0
              ?<div style={{background:C.xs2,border:`1px solid ${C.xb}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.xsub,fontFamily:"'Outfit',sans-serif",fontSize:12}}>Passez une commande depuis la Boutique 🛒</div>
              :<div style={{background:C.xs1,border:`1px solid ${C.xb}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.xb}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.xtext}}>Commandes récentes</div>
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderBottom:`1px solid ${C.xb}44`,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.xs2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.cyan,minWidth:90}}>{o.id}</div>
                    <div style={{flex:1,fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xtext}}>{o.customer?.name||"—"}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:C.xtext}}>{o.total.toLocaleString()} MAD</div>
                    <div style={{background:`${SC[o.status]||C.xsub}20`,border:`1px solid ${SC[o.status]||C.xsub}44`,borderRadius:4,padding:"1px 7px",fontSize:9,color:SC[o.status]||C.xsub,fontFamily:"'JetBrains Mono',monospace"}}>{o.status}</div>
                  </div>
                ))}
              </div>}
          </div>
        )}
        {tab==="orders"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.xtext,marginBottom:18}}>Commandes O2C · Slides 86–97</h2>
            {orders.length===0
              ?<div style={{background:C.xs2,border:`1px solid ${C.xb}`,borderRadius:11,padding:"32px",textAlign:"center",color:C.xsub,fontFamily:"'Outfit',sans-serif"}}>Aucune commande</div>
              :orders.map(o=>(
                <div key={o.id} style={{background:C.xs2,border:`1px solid ${C.xb}`,borderRadius:11,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.cyan,marginBottom:2}}>{o.id}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.xtext,fontWeight:600}}>{o.customer?.name} · {o.customer?.city}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xsub}}>{o.date}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.xtext}}>{o.total.toLocaleString()} MAD</div>
                      <div style={{background:`${SC[o.status]}20`,border:`1px solid ${SC[o.status]}44`,borderRadius:5,padding:"2px 8px",fontSize:9,color:SC[o.status],fontFamily:"'JetBrains Mono',monospace",display:"inline-block",marginTop:3}}>{o.status}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:10}}>{FLOW.map((s,i)=>{const cur=FLOW.indexOf(o.status);return<div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=cur?SC[s]:C.xb,transition:"all .5s"}}/>;})}</div>
                  {o.status!=="Livrée"&&<button onClick={()=>advance(o.id)} style={{background:`${C.green}15`,border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 11px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>▶ → {FLOW[Math.min(FLOW.indexOf(o.status)+1,3)]}</button>}
                </div>
              ))}
          </div>
        )}
        {tab==="products"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.xtext,marginBottom:18}}>Catalogue · Slides 69–85</h2>
            <div style={{background:C.xs1,border:`1px solid ${C.xb}`,borderRadius:12,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
                <thead><tr style={{background:C.xbg}}>{["","Produit","Région","Prix","Stock","Note"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,color:C.xdim,letterSpacing:"0.1em",fontWeight:700,borderBottom:`1px solid ${C.xb}`}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>{products.map(p=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.xb}44`,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.xs2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"6px 8px",width:40}}>
                      <div style={{width:34,height:34,overflow:"hidden",borderRadius:4}}>
                        <ProductImage productId={p.id} type="produit" style={{width:"100%",height:"100%"}} lang={lang}/>
                      </div>
                    </td>
                    <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,color:C.xtext}}>{p.name[lang]||p.name.fr}</span></td>
                    <td style={{padding:"9px 12px",color:C.xsub,fontSize:10}}>{p.region[lang]||p.region.fr}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:C.xambr,fontWeight:600,fontSize:11}}>{p.price.toLocaleString()}</td>
                    <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:p.stock<5?C.red:p.stock<20?C.xambr:C.green,fontSize:11,fontWeight:700}}>{p.stock}</span></td>
                    <td style={{padding:"9px 12px"}}><span style={{color:"#FFD700",fontSize:11}}>{"★".repeat(Math.floor(p.rating))}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.xsub,marginLeft:3}}>{p.rating}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="analytics"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.xtext,marginBottom:18}}>Analytics · Slides 99–112</h2>
            <div style={{background:C.xs1,border:`1px solid ${C.xb}`,borderRadius:14,padding:18,marginBottom:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.xsub,letterSpacing:"0.1em",marginBottom:14}}>REVENUS HEBDOMADAIRES (MAD)</div>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
                {ANALYTICS.map((a,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.green}}>{(a.r/1000).toFixed(1)}k</div>
                    <div style={{width:"100%",background:C.green,borderRadius:"3px 3px 0 0",height:`${(a.r/mxR)*90}px`,minHeight:4,transition:"height .8s ease"}}/>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.xsub}}>{a.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {[{l:"Conversion",v:"3.4%",c:C.green},{l:"Panier moyen",v:"847 MAD",c:C.xambr},{l:"Rétention",v:"68%",c:C.cyan}].map(m=>(
                <div key={m.l} style={{background:C.xs2,border:`1px solid ${C.xb}`,borderRadius:11,padding:"14px"}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xsub,marginBottom:5}}>{m.l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:m.c}}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ XRAY VIEW — 10 vues académiques ════════════════════════ */
function XRayView() {
  const [view,setView]=useState("characteristics");
  const [activeCarac,setActiveCarac]=useState(null);
  const [payStep,setPayStep]=useState(-1);
  const [activeNode,setActiveNode]=useState(null);

  const CARAC=[
    {id:"ubiquite",icon:"🌐",label:"Ubiquité",color:"#38BDF8",slide:"Slide 14",def:"Accessible partout, à tout moment, sur tout appareil.",nouasell:"PWA installable. 24h/24. 0 installation.",code:"self.addEventListener('fetch', e => {\n  e.respondWith(\n    caches.match(e.request)\n      .then(r => r || fetch(e.request))\n  )\n})",where:"Hero → Badge devices"},
    {id:"portee",icon:"🌍",label:"Portée mondiale",color:"#34D399",slide:"Slide 15",def:"Dépasse les frontières — artisan de Fès vend à Paris sans intermédiaire.",nouasell:"47 pays. Devise auto IP. Multilingue FR/EN/AR.",code:"const {country} = await fetch('https://ipapi.co/json').then(r=>r.json())\nconst rate = RATES[country] ?? 1\nreturn (price * rate).toFixed(2)",where:"Header → Sélecteur devises"},
    {id:"standards",icon:"🔌",label:"Standards Universels",color:"#A78BFA",slide:"Slide 16",def:"Protocoles ouverts (HTTP, TCP/IP, HTML5, JSON). Barrière d'entrée réduite.",nouasell:"REST API JSON, HTTPS TLS 1.3, OAuth 2.0.",code:"GET  /api/products  → 200 JSON\nPOST /api/orders    → 201 JSON\nAuthorization: Bearer <JWT>",where:"Hero → Bandeau protocoles"},
    {id:"richesse",icon:"🎬",label:"Richesse",color:"#F472B6",slide:"Slide 17",def:"Messages riches : vidéo HD, 360°, PDF, certificat. Impossible en traditionnel.",nouasell:"Passeport visuel 4 types : Produit / Fabrication / Contexte / Détail.",code:"const VN = {\n  produit:    { url, caption },\n  fabrication:{ url, caption },\n  contexte:   { url, caption },\n  detail:     { url, caption }\n}",where:"Fiche produit → VisualPassport · 4 photos"},
    {id:"interactivite",icon:"💬",label:"Interactivité",color:"#FB923C",slide:"Slide 18",def:"Communication bidirectionnelle temps réel.",nouasell:"Chat IA Claude API. FAQ dynamique. Réponses en 3 langues.",code:"const res = await fetch('/v1/messages', {\n  body: JSON.stringify({\n    model: 'claude-sonnet-4-20250514',\n    messages: [...history, {role:'user',content:q}]\n  })\n})",where:"Bouton 💬 → Claude AI Chat"},
    {id:"personnalisation",icon:"🎯",label:"Personnalisation",color:"#FBBF24",slide:"Slide 19",def:"Personnalisation de masse sans coût marginal.",nouasell:"3 langues FR/EN/AR. Profil artisan dynamique. Recommandations fidélité.",code:"SELECT p.* FROM products p\nJOIN user_views uv ON p.category=uv.category\nWHERE uv.user_id=$1\nORDER BY p.rating DESC LIMIT 4",where:"i18n complet · Profil client"},
    {id:"densite",icon:"📊",label:"Densité d'information",color:"#60A5FA",slide:"Slide 20",def:"Asymétrie réduite. Traçabilité totale. Comparaison transparente.",nouasell:"Région, artisan, matière, certif, impact + passeport visuel sur chaque fiche.",code:"SELECT DATE_TRUNC('day',created_at) day,\n  COUNT(*) orders,\n  AVG(total) avg_basket\nFROM orders GROUP BY 1",where:"Fiche → Traçabilité / Admin Analytics"},
    {id:"social",icon:"👥",label:"Technologie Sociale",color:"#4ADE80",slide:"Slide 21",def:"Avis, partage, co-création intégrés à l'achat.",nouasell:"Avis vérifiés. Page Artisans. Section Impact. Communauté.",code:"CREATE TABLE reviews (\n  verified_purchase BOOLEAN DEFAULT FALSE,\n  rating INT CHECK (rating BETWEEN 1 AND 5),\n  helpful_votes INT DEFAULT 0\n);",where:"Section Artisans / Communauté / ❤️"},
  ];

  const PAYMENT_STEPS=[
    {icon:"🛒",label:"Client\n'Acheter'",sub:"React state",color:C.cyan,slide:"Slide 81"},
    {icon:"🔐",label:"Session\nauthentifiée",sub:"JWT vérifié",color:C.green,slide:"Slide 78"},
    {icon:"📋",label:"Commande\ncréée DB",sub:"status:pending",color:C.xambr,slide:"Slide 86"},
    {icon:"💳",label:"Stripe/CMI\nTokenisation",sub:"TLS 1.3",color:C.violet,slide:"Slide 77"},
    {icon:"✅",label:"Paiement\nconfirmé",sub:"Webhook",color:C.green,slide:"Slide 86"},
    {icon:"📦",label:"Stock\ndécrémenté",sub:"DB trigger",color:C.xambr,slide:"Slide 92"},
    {icon:"📧",label:"Email\nenvoyé",sub:"Resend API",color:C.cyan,slide:"Slide 101"},
  ];

  useEffect(()=>{
    if(view==="payment"){
      setPayStep(-1);
      const t=setInterval(()=>setPayStep(p=>{if(p>=PAYMENT_STEPS.length-1){clearInterval(t);return p;}return p+1;}),900);
      return()=>clearInterval(t);
    }
  },[view]);

  const VIEWS=[
    {id:"characteristics",icon:"⭐",label:"8 Caractéristiques"},
    {id:"payment",icon:"💳",label:"Flux O2C"},
    {id:"architecture",icon:"🏗️",label:"Architecture"},
    {id:"revenue",icon:"💰",label:"Revenus"},
    {id:"competitive",icon:"🏢",label:"Concurrence"},
    {id:"rgpd",icon:"📜",label:"RGPD & Droit"},
    {id:"logistics",icon:"🚚",label:"Logistique"},
    {id:"kpis",icon:"📊",label:"KPIs"},
  ];

  const LAYERS=[
    {id:"client",label:"COUCHE CLIENT",color:C.cyan,nodes:[
      {id:"browser",label:"Navigateur",sub:"React/Next.js",icon:"🌐",code:"export default async function Page({params}) {\n  const p = await getProduct(params.slug)\n  return <ProductView product={p}/>\n}",course:"Slides 56–59"},
      {id:"pwa",label:"PWA / Mobile",sub:"Service Worker",icon:"📱",code:'{ "display":"standalone",\n  "start_url":"/",\n  "theme_color":"#2C1F0E" }',course:"Slides 62–64"},
      {id:"cdn",label:"CDN Edge",sub:"Vercel Edge",icon:"⚡",code:"export default {\n  images:{domains:['cdn.store.ma']},\n  experimental:{ppr:true}\n}",course:"Slides 65–68"}
    ]},
    {id:"api",label:"COUCHE API",color:C.green,nodes:[
      {id:"products_api",label:"API Produits",sub:"REST JSON",icon:"📦",code:"export async function GET() {\n  const {data} = await supabase\n    .from('products').select('*')\n    .eq('status','active')\n  return Response.json(data)\n}",course:"Slides 56"},
      {id:"auth_api",label:"Auth JWT",sub:"OAuth 2.0",icon:"🔐",code:"export function middleware(req) {\n  const token = req.cookies.get('session')\n  if (!token) return redirect('/login')\n  return verifyJWT(token)\n}",course:"Slides 74–78"},
      {id:"checkout_api",label:"Checkout",sub:"Stripe·CMI",icon:"💳",code:"const session = await stripe.checkout\n  .sessions.create({\n    line_items: cartItems,\n    mode: 'payment'\n  })",course:"Slides 80–84"}
    ]},
    {id:"data",label:"COUCHE DONNÉES",color:C.xambr,nodes:[
      {id:"db",label:"PostgreSQL",sub:"Supabase RLS",icon:"🗄️",code:"CREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name TEXT NOT NULL,\n  price NUMERIC(10,2),\n  stock INT DEFAULT 0\n);\nCREATE POLICY 'read' ON products\n  FOR SELECT USING (status='active');",course:"Slides 69"},
      {id:"cache",label:"Redis Cache",sub:"Sessions·KPIs",icon:"⚡",code:"await redis.setex(\n  `cart:${userId}`, 3600,\n  JSON.stringify(cartItems)\n)",course:"Slides 98"}
    ]},
  ];

  const REVENUE_MODELS=[
    {icon:"💰",label:"Commission 8–12%",color:C.green,slide:"Slide 36",desc:"Prélèvement sur chaque vente. Alignement vendeur/plateforme.",ex:"Caftan 1850 MAD → ~148 MAD commission"},
    {icon:"🔄",label:"Abonnement Artisan",color:C.cyan,slide:"Slide 37",desc:"299 MAD/mois — analytics, boost, badge certifié.",ex:"340 artisans × 299 MAD = 101 660 MAD MRR"},
    {icon:"⭐",label:"Freemium NouaSell+",color:C.xambr,slide:"Slide 38",desc:"49 MAD/mois — livraison gratuite + retours + ventes privées.",ex:"Conv. ~3–5% de la base acheteurs"},
    {icon:"📢",label:"Sponsored CPC",color:C.violet,slide:"Slide 40",desc:"0.5–2 MAD/clic. Produits en 1ère position dans la recherche.",ex:"Revenu additionnel scalable avec le trafic"},
    {icon:"📊",label:"Data B2B",color:C.pink,slide:"Slide 42",desc:"Rapports sectoriels artisanat vendus aux marques.",ex:"Haute marge · Valorise les actifs existants"},
  ];

  const COMPETITORS=[
    {name:"NouaSell",emoji:"🏛️",modele:"Commission+Abo",force:"Authenticité certifiée · Narration visuelle",part:"2%",note:4.8,color:C.gold},
    {name:"Amazon.ma",emoji:"📦",modele:"Commission+FBA",force:"Logistique, confiance",part:"35%",note:4.3,color:"#FF9900"},
    {name:"Jumia",emoji:"🦁",modele:"Commission",force:"Présence locale",part:"28%",note:3.8,color:"#F6831E"},
    {name:"Etsy",emoji:"🎨",modele:"Commission+Listing",force:"Audience artisanat mondial",part:"5%",note:4.5,color:"#F1641E"},
    {name:"Commerce local",emoji:"🏪",modele:"Marge directe",force:"Tangibilité, relation",part:"30%",note:4.0,color:C.sage},
  ];

  const RGPD=[
    {art:"Art. 5",title:"Principes traitement",impl:"Collecte minimale : email + adresse livraison uniquement.",color:C.cyan,slide:"Slide 114"},
    {art:"Art. 7",title:"Consentement",impl:"Case explicite inscription. Opt-in newsletter séparé. Retrait profil.",color:C.green,slide:"Slide 115"},
    {art:"Art. 17",title:"Droit à l'effacement",impl:"Bouton 'Supprimer mon compte' → suppression cascade PostgreSQL.",color:C.violet,slide:"Slide 118"},
    {art:"Art. 20",title:"Portabilité",impl:"Export JSON/CSV depuis Profil > Mes données. Délai 72h.",color:C.pink,slide:"Slide 119"},
    {art:"Art. 25",title:"Privacy by Design",impl:"AES-256, RLS PostgreSQL, 0 données bancaires (Stripe), JWT 24h.",color:C.green,slide:"Slide 121"},
    {art:"Art. 32",title:"Sécurité",impl:"TLS 1.3, bcrypt, rate limiting, WAF Vercel, PCI DSS Level 1.",color:C.red,slide:"Slide 122"},
  ];

  const LOGISTIQUE=[
    {icon:"🛒",label:"Commande passée",detail:"Trigger SQL décrémente le stock. Évite la survente.",slide:"Slide 89",color:C.cyan},
    {icon:"📥",label:"Réception entrepôt",detail:"Artisan remet le colis. QR code scané → 'En préparation'.",slide:"Slide 90",color:C.xambr},
    {icon:"📦",label:"Conditionnement",detail:"Emballage éco + carte artisan manuscrite. +18% satisfaction.",slide:"Slide 91",color:C.violet},
    {icon:"🚚",label:"Expédition",detail:"API DHL/Amana/CTM. Numéro de suivi envoyé automatiquement.",slide:"Slide 93",color:C.green},
    {icon:"📡",label:"Suivi temps réel",detail:"GPS tracking. Notifications push à chaque étape.",slide:"Slide 94",color:C.cyan},
    {icon:"🏠",label:"Livraison",detail:"Photo + signature digitale. Preuve stockée en DB.",slide:"Slide 95",color:C.green},
    {icon:"↩️",label:"Retours 30j",detail:"Label prégénéré. Remboursement auto 48h via Stripe Refund API.",slide:"Slide 97",color:C.xambr},
  ];

  const KPIS=[
    {name:"CAC",formula:"Budget Marketing ÷ Nb clients",val:"87 MAD",color:C.cyan,slide:"Slide 99"},
    {name:"LTV",formula:"Panier × Fréquence × Durée",val:"2 340 MAD",color:C.green,slide:"Slide 100"},
    {name:"Conversion",formula:"(Commandes ÷ Visiteurs) × 100",val:"3.4%",color:C.xambr,slide:"Slide 103"},
    {name:"Rétention",formula:"Clients récurrents ÷ Total × 100",val:"68%",color:C.violet,slide:"Slide 104"},
    {name:"AOV",formula:"Revenus ÷ Commandes",val:"847 MAD",color:C.gold,slide:"Slide 105"},
    {name:"ROI Marketing",formula:"((Rev−Coût)÷Coût)×100",val:"285%",color:"#34D399",slide:"Slide 110"},
  ];

  return (
    <div style={{flex:1,display:"flex",overflow:"hidden",background:C.xbg}}>
      <div style={{width:172,background:C.xs1,borderRight:`1px solid ${C.xb}`,padding:"14px 0",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"0 12px",marginBottom:12}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.xdim,letterSpacing:"0.15em"}}>◈ X-RAY</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.xdim,marginTop:2}}>Slides 14–125</div>
        </div>
        {VIEWS.map(v=>(
          <button key={v.id} onClick={()=>setView(v.id)} style={{width:"100%",background:view===v.id?C.xs2:"transparent",border:"none",borderLeft:`2px solid ${view===v.id?C.cyan:"transparent"}`,padding:"8px 12px",color:view===v.id?C.xtext:C.xsub,cursor:"pointer",textAlign:"left",fontSize:10,fontFamily:"'Outfit',sans-serif",fontWeight:view===v.id?700:400,display:"flex",alignItems:"center",gap:7,transition:"all .2s"}}>{v.icon} {v.label}</button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>

        {view==="characteristics"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>8 Caractéristiques du E-commerce</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Laudon & Traver · Slides 14–21</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {CARAC.map(c=>(
                <div key={c.id} onClick={()=>setActiveCarac(activeCarac?.id===c.id?null:c)}
                  style={{background:activeCarac?.id===c.id?C.xs2:C.xs1,border:`1px solid ${activeCarac?.id===c.id?c.color:C.xb}`,borderRadius:13,padding:"14px 16px",cursor:"pointer",transition:"all .25s"}}
                  onMouseEnter={e=>{if(activeCarac?.id!==c.id)e.currentTarget.style.borderColor=c.color+"55";}}
                  onMouseLeave={e=>{if(activeCarac?.id!==c.id)e.currentTarget.style.borderColor=C.xb;}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontSize:22}}>{c.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.xtext}}>{c.label}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:c.color}}>{c.slide}</div>
                    </div>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:C.xdim}}>{activeCarac?.id===c.id?"▲":"▼"}</span>
                  </div>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,lineHeight:1.6,marginBottom:6}}>{c.def}</p>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:c.color,background:`${c.color}10`,border:`1px solid ${c.color}22`,borderRadius:4,padding:"2px 7px",display:"inline-block"}}>{c.where}</div>
                  {activeCarac?.id===c.id&&(
                    <div style={{marginTop:12}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xambr,fontWeight:600,marginBottom:5}}>🛍 NouaSell v4.1 :</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xtext,marginBottom:8}}>{c.nouasell}</div>
                      <pre style={{background:C.xbg,border:`1px solid ${C.xb}`,borderRadius:8,padding:"10px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.green,lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>{c.code}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {view==="payment"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>Flux O2C — Order to Cash</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:20}}>Slides 81–101</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:20}}>
              {PAYMENT_STEPS.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:i<=payStep?`${s.color}20`:C.xs2,border:`2px solid ${i<=payStep?s.color:C.xb}`,borderRadius:12,padding:"11px 13px",textAlign:"center",minWidth:85,transition:"all .5s",boxShadow:i===payStep?`0 0 18px ${s.color}44`:"none",transform:i===payStep?"scale(1.08)":"scale(1)"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:i<=payStep?C.xtext:C.xsub,fontWeight:i===payStep?700:400,whiteSpace:"pre-line",lineHeight:1.3,marginBottom:2}}>{s.label}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:i<=payStep?s.color:C.xdim}}>{s.sub}</div>
                  </div>
                  {i<PAYMENT_STEPS.length-1&&<div style={{width:14,height:2,background:i<payStep?C.green:C.xb,transition:"background .5s",flexShrink:0}}/>}
                </div>
              ))}
            </div>
            <button onClick={()=>{setPayStep(-1);setTimeout(()=>{const t=setInterval(()=>setPayStep(p=>{if(p>=PAYMENT_STEPS.length-1){clearInterval(t);return p;}return p+1;}),900);},100);}} style={{background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:7,padding:"8px 18px",color:C.cyan,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:700,marginBottom:16}}>↺ Rejouer</button>
            <pre style={{background:C.xs1,border:`1px solid ${C.xb}`,borderRadius:10,padding:"14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.green,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{`// Stripe — tokenisation (aucune donnée bancaire chez NouaSell)\nconst {paymentMethod} = await stripe.createPaymentMethod({\n  type: 'card', card: cardElement\n})\n// Webhook confirmation\nif (event.type === 'checkout.session.completed') {\n  await db.orders.update({ status: 'paid' })\n  await sendEmail(order)\n}`}</pre>
          </div>
        )}

        {view==="architecture"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>Architecture Technique</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 56–108 · Cliquez sur un nœud</div>
            {LAYERS.map(layer=>(
              <div key={layer.id} style={{marginBottom:16}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:layer.color,letterSpacing:"0.18em",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{height:1,width:20,background:layer.color,opacity:.5}}/>{layer.label}<div style={{flex:1,height:1,background:layer.color,opacity:.2}}/>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {layer.nodes.map(node=>(
                    <div key={node.id} onClick={()=>setActiveNode(activeNode?.id===node.id?null:node)}
                      style={{background:activeNode?.id===node.id?C.xs3:C.xs2,border:`1px solid ${activeNode?.id===node.id?layer.color:C.xb}`,borderRadius:10,padding:"11px 14px",cursor:"pointer",minWidth:140,flex:1,maxWidth:190,transition:"all .25s"}}
                      onMouseEnter={e=>{if(activeNode?.id!==node.id)e.currentTarget.style.borderColor=layer.color+"55";}}
                      onMouseLeave={e=>{if(activeNode?.id!==node.id)e.currentTarget.style.borderColor=C.xb;}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:18}}>{node.icon}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:layer.color,background:`${layer.color}15`,borderRadius:3,padding:"1px 5px"}}>{node.course}</span>
                      </div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:C.xtext,marginBottom:2}}>{node.label}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xsub}}>{node.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {activeNode&&(
              <div className="fu" style={{background:C.xs1,border:`1px solid ${C.xb2}`,borderRadius:12,padding:16,marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:20}}>{activeNode.icon}</span>
                  <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:C.xtext}}>{activeNode.label}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.cyan}}>{activeNode.course}</div></div>
                  <button onClick={()=>setActiveNode(null)} style={{marginLeft:"auto",background:`${C.red}15`,border:`1px solid ${C.red}33`,borderRadius:5,padding:"3px 9px",color:C.red,cursor:"pointer",fontSize:10}}>✕</button>
                </div>
                <pre style={{background:C.xbg,border:`1px solid ${C.xb}`,borderRadius:7,padding:"11px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.green,lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>{activeNode.code}</pre>
              </div>
            )}
          </div>
        )}

        {view==="revenue"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>Modèles de Revenus</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 35–42</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {REVENUE_MODELS.map(m=>(
                <div key={m.icon} style={{background:C.xs1,border:`1px solid ${m.color}33`,borderRadius:12,padding:"16px 18px",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"66";e.currentTarget.style.boxShadow=`0 4px 16px ${m.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=m.color+"33";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",gap:10,marginBottom:10}}>
                    <span style={{fontSize:22}}>{m.icon}</span>
                    <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.xtext,marginBottom:2}}>{m.label}</div><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:m.color,background:`${m.color}10`,borderRadius:3,padding:"1px 5px"}}>{m.slide}</span></div>
                  </div>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,lineHeight:1.6,marginBottom:8}}>{m.desc}</p>
                  <div style={{background:`${m.color}10`,border:`1px solid ${m.color}15`,borderRadius:6,padding:"6px 10px",fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xtext}}>{m.ex}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view==="competitive"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>Analyse Concurrentielle</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 51–55</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Outfit',sans-serif",fontSize:11}}>
                <thead><tr style={{background:C.xs1}}>{["Acteur","Modèle","Avantage","Part","Note"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.xdim,letterSpacing:"0.1em",borderBottom:`1px solid ${C.xb}`}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>{COMPETITORS.map(c=>(
                  <tr key={c.name} style={{borderBottom:`1px solid ${C.xb}44`,background:c.name==="NouaSell"?`${C.gold}08`:"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=C.xs2} onMouseLeave={e=>e.currentTarget.style.background=c.name==="NouaSell"?`${C.gold}08`:"transparent"}>
                    <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{c.emoji}</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:c.color,fontSize:12}}>{c.name}</span>{c.name==="NouaSell"&&<span style={{background:`${C.gold}20`,border:`1px solid ${C.gold}44`,borderRadius:3,padding:"1px 5px",fontSize:7,color:C.gold}}>NOUS</span>}</div></td>
                    <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:c.color,background:`${c.color}10`,borderRadius:3,padding:"2px 6px"}}>{c.modele}</span></td>
                    <td style={{padding:"10px 12px",color:C.xtext,fontSize:10,maxWidth:180}}>{c.force}</td>
                    <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:c.name==="NouaSell"?C.gold:C.xtext}}>{c.part}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{color:"#FFD700",fontSize:11}}>{"★".repeat(Math.round(c.note))}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.xsub,marginLeft:3}}>{c.note}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {view==="rgpd"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>RGPD & Cadre Juridique</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 113–125</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {RGPD.map((r,i)=>(
                <div key={r.art} className="fu" style={{background:C.xs1,border:`1px solid ${r.color}33`,borderRadius:11,padding:"14px 18px",display:"grid",gridTemplateColumns:"90px 1fr 1fr",gap:14,alignItems:"start",animation:`fadeUp .3s ease ${i*.06}s both`}}>
                  <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color:r.color,marginBottom:3}}>{r.art}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:C.xdim}}>{r.slide}</div></div>
                  <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:C.xtext,marginBottom:3}}>{r.title}</div></div>
                  <div style={{background:`${r.color}08`,border:`1px solid ${r.color}15`,borderRadius:6,padding:"6px 8px",fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.xtext,lineHeight:1.6}}>{r.impl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view==="logistics"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>Logistique & Fulfilment</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 89–97</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:680}}>
              {LOGISTIQUE.map((s,i)=>(
                <div key={i} className="fu" style={{display:"flex",gap:14,alignItems:"flex-start",animation:`fadeUp .3s ease ${i*.07}s both`}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                    <div style={{width:42,height:42,background:`${s.color}15`,border:`2px solid ${s.color}44`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{s.icon}</div>
                    {i<LOGISTIQUE.length-1&&<div style={{width:2,height:22,background:`${s.color}33`,marginTop:4}}/>}
                  </div>
                  <div style={{flex:1,background:C.xs1,border:`1px solid ${s.color}22`,borderRadius:10,padding:"11px 14px"}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.xtext}}>{s.label}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:s.color,background:`${s.color}10`,borderRadius:3,padding:"1px 5px"}}>{s.slide}</span></div>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,lineHeight:1.6}}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view==="kpis"&&(
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.xtext,marginBottom:4}}>KPIs E-commerce</h2>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:C.xsub,marginBottom:18}}>Slides 99–112 · Formules + valeurs NouaSell</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
              {KPIS.map(k=>(
                <div key={k.name} style={{background:C.xs1,border:`1px solid ${k.color}33`,borderRadius:12,padding:"16px 18px",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=k.color+"55";e.currentTarget.style.boxShadow=`0 4px 14px ${k.color}15`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=k.color+"33";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:C.xtext}}>{k.name}</div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:k.color,background:`${k.color}10`,borderRadius:3,padding:"1px 5px"}}>{k.slide}</span>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:30,color:k.color,marginBottom:8}}>{k.val}</div>
                  <div style={{background:`${k.color}08`,border:`1px solid ${k.color}15`,borderRadius:6,padding:"5px 9px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.xtext}}>{k.formula}</div>
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
  const [lang,setLang]=useState("fr");
  const [mode,setMode]=useState("hero");
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
    toast(`${product.name[lang]||product.name.fr} ajouté !`,"success","🛒");
  },[toast,lang]);

  const removeFromCart=k=>setCart(p=>p.filter(i=>i.key!==k));
  const updateQty=(k,d)=>setCart(p=>p.map(i=>i.key===k?{...i,qty:Math.max(1,i.qty+d)}:i));
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const toggleWishlist=p=>{
    const has=wishlist.find(x=>x.id===p.id);
    setWishlist(prev=>has?prev.filter(x=>x.id!==p.id):[...prev,p]);
    toast(has?`Retiré des favoris`:`${p.name[lang]||p.name.fr} ajouté aux favoris !`,has?"info":"success",has?"🤍":"❤️");
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

  const t=(key)=>TRANS[lang]?.[key]||TRANS.fr[key]||key;
  const MODES=[{id:"shop",icon:"🛍",label:t("shop")},{id:"admin",icon:"⚙️",label:t("admin")},{id:"xray",icon:"◈",label:t("xray")}];
  const dir=lang==="ar"?"rtl":"ltr";

  if(mode==="hero") return (
    <LangCtx.Provider value={{lang,setLang}}>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <style>{CSS}</style>
        <div style={{position:"absolute",top:16,right:20,zIndex:100,display:"flex",gap:8,alignItems:"center"}}>
          <LangSwitcher/>
        </div>
        <HeroSection onDiscover={()=>setMode("main")} lang={lang}/>
      </div>
    </LangCtx.Provider>
  );

  return (
    <LangCtx.Provider value={{lang,setLang}}>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}} dir={dir}>
        <style>{CSS}</style>
        <ToastContainer toasts={toasts}/>
        {/* TOP BAR */}
        <div style={{background:C.dark,borderBottom:`1px solid rgba(201,169,110,0.2)`,padding:"0 18px",display:"flex",alignItems:"center",gap:10,height:50,flexShrink:0,zIndex:100}}>
          <button onClick={()=>setMode("hero")} style={{display:"flex",alignItems:"center",gap:7,background:"transparent",border:"none",cursor:"pointer",marginRight:6,padding:0}}>
            <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.gold},${C.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:C.dark}}>N</div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:C.cream}}>NouaSell</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.gold,opacity:.6}}>v4.1</span>
          </button>
          <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.06)",borderRadius:8,padding:2,border:"1px solid rgba(255,255,255,0.1)"}}>
            {MODES.map(m=>(
              <button key={m.id} onClick={()=>setStoreTab(m.id)} style={{background:storeTab===m.id?"rgba(255,255,255,0.12)":"transparent",border:"1px solid transparent",borderRadius:6,padding:"4px 12px",color:C.cream,fontSize:11,cursor:"pointer",fontWeight:600,transition:"all .2s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:4,opacity:storeTab===m.id?1:0.7}}
                onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                onMouseLeave={e=>e.currentTarget.style.opacity=storeTab===m.id?"1":"0.7"}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          {loyaltyPts>0&&<div style={{background:`${C.gold}18`,border:`1px solid ${C.gold}33`,borderRadius:5,padding:"2px 8px",fontSize:9,color:C.gold,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>⭐ {loyaltyPts} pts</div>}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <LangSwitcher/>
            {storeTab!=="xray"&&storeTab!=="admin"&&(
              <>
                <div style={{display:"flex",gap:1,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:2,border:"1px solid rgba(255,255,255,0.1)"}}>
                  {["MAD","EUR","USD","GBP"].map(cur=>(
                    <button key={cur} onClick={()=>setCurrency(cur)} style={{background:currency===cur?`${C.gold}25`:"transparent",border:"none",borderRadius:4,padding:"3px 6px",color:currency===cur?C.gold:"rgba(255,255,255,0.4)",fontSize:9,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,transition:"all .2s"}}>{cur}</button>
                  ))}
                </div>
                <button onClick={()=>setStoreTab("wishlist")} style={{background:wishlist.length>0?"rgba(244,114,182,0.15)":"transparent",border:`1px solid ${wishlist.length>0?"rgba(244,114,182,0.4)":"rgba(255,255,255,0.15)"}`,borderRadius:7,padding:"5px 9px",color:wishlist.length>0?"#F472B6":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:11,transition:"all .2s",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>❤️{wishlist.length>0&&` ${wishlist.length}`}</button>
                <button onClick={()=>setStoreTab("profile")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:7,padding:"5px 9px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:11}}>👤</button>
              </>
            )}
            <div style={{overflow:"hidden",width:154,background:"rgba(255,255,255,0.05)",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",padding:"3px 7px",fontSize:8,color:"rgba(201,169,110,0.5)",fontFamily:"'JetBrains Mono',monospace"}}>
              <div style={{whiteSpace:"nowrap",animation:"ticker 14s linear infinite",display:"inline-block"}}>✦ Dr. H. Faouzi · ENCG Kénitra &nbsp;&nbsp;&nbsp;✦ Dr. H. Faouzi · ENCG Kénitra &nbsp;&nbsp;&nbsp;</div>
            </div>
            {storeTab!=="xray"&&(
              <button onClick={()=>setCartOpen(true)} style={{background:cartCount>0?`${C.gold}18`:"transparent",border:`1px solid ${cartCount>0?C.gold:"rgba(255,255,255,0.15)"}`,borderRadius:7,padding:"5px 11px",color:cartCount>0?C.gold:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,transition:"all .3s",animation:cartBounce?"cartBounce .6s ease":"none"}}>
                🛒{cartCount>0&&<><span style={{background:C.gold,color:C.dark,borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{cartCount}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.4)"}}>{fx(cartTotal)}</span></>}
              </button>
            )}
          </div>
        </div>
        {/* CONTENT */}
        <div style={{flex:1,overflow:"hidden",display:"flex",position:"relative"}}>
          {storeTab==="shop"&&<StoreView products={PRODUCTS} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} fx={fx} lang={lang}/>}
          {storeTab==="wishlist"&&<WishlistView wishlist={wishlist} onAdd={addToCart} onWish={toggleWishlist} fx={fx} lang={lang} onBack={()=>setStoreTab("shop")}/>}
          {storeTab==="profile"&&<ProfileView user={user} orders={orders} loyaltyPts={loyaltyPts} fx={fx} lang={lang} onBack={()=>setStoreTab("shop")}/>}
          {storeTab==="admin"&&<AdminView orders={orders} setOrders={setOrders} products={PRODUCTS} loyaltyPts={loyaltyPts} lang={lang}/>}
          {storeTab==="xray"&&<XRayView/>}
        </div>
        {cartOpen&&<CartDrawer cart={cart} total={cartTotal} onClose={()=>setCartOpen(false)} onRemove={removeFromCart} onQty={updateQty} onOrder={placeOrder} fx={fx} toast={toast} lang={lang}/>}
        {storeTab!=="xray"&&storeTab!=="admin"&&<ChatWidget open={chatOpen} onToggle={()=>setChatOpen(o=>!o)} lang={lang}/>}
      </div>
    </LangCtx.Provider>
  );
}
