// ===== YADDAŞ (core/storage.js) =====
// Nə edir: bütün məlumatı data/store.json faylında saxlayır.
// Parollar AES-256-GCM ilə şifrələnir, açar data/.key faylındadır (bu faylı itirməyin!).
// Bu faylı dəyişmək lazım deyil.
const crypto=require('crypto'),fs=require('fs'),path=require('path');
const D=path.join(__dirname,'..','data'),F=D+'/store.json',K=D+'/.key';
fs.mkdirSync(D,{recursive:true,mode:0o700});
if(!fs.existsSync(K))fs.writeFileSync(K,crypto.randomBytes(32).toString('hex'),{mode:0o600});
const key=Buffer.from(fs.readFileSync(K,'utf8'),'hex');
const db=fs.existsSync(F)?JSON.parse(fs.readFileSync(F)):{};
db.admin=db.admin||null;db.tools=(db.tools&&!Array.isArray(db.tools))?db.tools:{};db.notify=db.notify||{};db.titles=db.titles||{};
const save=()=>fs.writeFileSync(F,JSON.stringify(db),{mode:0o600});
const enc=t=>{if(!t)return'';const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',key,iv),e=Buffer.concat([c.update(t,'utf8'),c.final()]);return[iv,c.getAuthTag(),e].map(b=>b.toString('base64')).join('.')};
const dec=s=>{if(!s)return'';const[iv,tag,e]=s.split('.').map(x=>Buffer.from(x,'base64')),d=crypto.createDecipheriv('aes-256-gcm',key,iv);d.setAuthTag(tag);return Buffer.concat([d.update(e),d.final()]).toString('utf8')};
module.exports={db,save,enc,dec};
