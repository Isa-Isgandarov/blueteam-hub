// ===== GİRİŞ / PAROL (core/auth.js) =====
// Nə edir: panelə giriş. İlk açılışda admin parolu yaradılır (min 10 simvol).
// 5 yanlış cəhddən sonra 5 dəqiqə bloklanır. Bu faylı dəyişmək lazım deyil.
const crypto=require('crypto'),express=require('express'),{db,save}=require('./storage');
const hash=(p,s)=>crypto.scryptSync(p,s,64).toString('hex'),sess=new Map(),fails=new Map();
const tok=r=>(r.headers.cookie||'').split(';').map(c=>c.trim().split('=')).find(c=>c[0]==='sid')?.[1];
const ok=q=>{const t=tok(q);return !!(t&&sess.get(t)>Date.now())};
const requireAuth=(q,s,n)=>ok(q)?n():s.status(401).json({error:'auth'});
const r=express.Router();
r.get('/state',(q,s)=>s.json({setup:!db.admin,auth:ok(q)}));
r.post('/login',(q,s)=>{const f=fails.get(q.ip)||{n:0,t:0};
  if(f.n>=5&&Date.now()-f.t<300000)return s.status(429).json({error:'Çox cəhd. 5 dəq gözləyin'});
  const p=String(q.body.password||'');
  if(!db.admin){if(p.length<10)return s.status(400).json({error:'Parol min 10 simvol olmalıdır'});const salt=crypto.randomBytes(16).toString('hex');db.admin={salt,h:hash(p,salt)};save()}
  else if(!crypto.timingSafeEqual(Buffer.from(hash(p,db.admin.salt)),Buffer.from(db.admin.h))){fails.set(q.ip,{n:f.n+1,t:Date.now()});return s.status(401).json({error:'Yanlış parol'})}
  fails.delete(q.ip);const t=crypto.randomBytes(32).toString('hex');sess.set(t,Date.now()+8*36e5);
  s.setHeader('Set-Cookie',`sid=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`+(process.env.SECURE_COOKIE?'; Secure':''));s.json({ok:1})});
r.post('/logout',(q,s)=>{sess.delete(tok(q));s.json({ok:1})});
module.exports={router:r,requireAuth};
