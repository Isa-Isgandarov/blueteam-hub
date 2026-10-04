// ===== ALƏT MODULU ŞABLONU (core/tool-module.js) =====
// Nə edir: Wazuh, Grafana, Zabbix kimi "URL + istifadəçi + parol" saxlayan menyular üçün ortaq backend.
// Hər alətin öz qovluğu bu şablonu çağırır. Bu faylı dəyişmək lazım deyil.
const express=require('express'),{db,save,enc,dec}=require('./storage'),ping=require('./ping');
module.exports=({id,title,order})=>{
  const r=express.Router(),get=()=>db.tools[id]=db.tools[id]||{url:'',user:'',pass:'',note:''};
  r.get('/',(q,s)=>{const t=get();s.json({title,url:t.url,user:t.user,note:t.note,hasPass:!!t.pass})});
  r.put('/',(q,s)=>{const t=get();for(const k of['url','user','note'])if(typeof q.body[k]==='string')t[k]=q.body[k];
    if(q.body.pass)t.pass=enc(q.body.pass);save();s.json({ok:1})});
  r.get('/secret',(q,s)=>s.json({pass:dec(get().pass)}));
  r.get('/ping',async(q,s)=>s.json(await ping(get().url)));
  return{id,title,order,tool:true,router:r};
};
