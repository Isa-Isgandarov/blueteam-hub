// ===== MENYU: Dashboard (backend) =====
// Nə edir: bütün alətlərin URL-lərini yoxlayıb online/offline statusunu qaytarır.
const express=require('express'),{db}=require('../../core/storage'),ping=require('../../core/ping');
const r=express.Router();
r.get('/status',async(q,s)=>{const L=q.app.locals.modules.filter(m=>m.tool);
  s.json(await Promise.all(L.map(async m=>({id:m.id,title:m.title,url:(db.tools[m.id]||{}).url||'',...await ping((db.tools[m.id]||{}).url)}))))});
module.exports={id:'dashboard',title:'Dashboard',order:1,router:r};
