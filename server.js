// ===== ƏSAS SERVER (server.js) =====
// Nə edir: modules/ qovluğundakı hər alt qovluğu avtomatik menyu kimi yükləyir.
// Qovluq adı "_" ilə başlayırsa, yüklənmir (şablon üçündür). Bu faylı dəyişmək lazım deyil.
const express=require('express'),fs=require('fs'),path=require('path');
const{router:auth,requireAuth}=require('./core/auth');
const app=express();app.use(express.json());app.use(express.static(path.join(__dirname,'public')));
app.use('/api',auth);
const mods=[],MD=path.join(__dirname,'modules');
for(const d of fs.readdirSync(MD).filter(d=>!d.startsWith('_')&&fs.existsSync(`${MD}/${d}/module.js`))){
  try{const m=require(`${MD}/${d}/module.js`);mods.push(m);app.use('/api/m/'+m.id,requireAuth,m.router)}
  catch(e){console.error(`Modul xətası (${d}):`,e.message)}}
mods.sort((a,b)=>a.order-b.order);app.locals.modules=mods;
app.get('/api/modules',requireAuth,(q,s)=>s.json(mods.map(({id,title,order})=>({id,title,order}))));
app.get('/m/:id/page.js',(q,s)=>/^[\w-]+$/.test(q.params.id)?s.sendFile(`${MD}/${q.params.id}/page.js`):s.sendStatus(400));
app.listen(process.env.PORT||3000,process.env.HOST||'127.0.0.1',()=>console.log('BlueTeam Hub işləyir, modullar:',mods.map(m=>m.id).join(', ')));
