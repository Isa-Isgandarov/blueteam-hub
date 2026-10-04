// ===== MENYU: Docker (backend) =====
// Nə edir: serverdəki docker konteynerlərini siyahılayır, start/stop/restart edir, log göstərir.
// Təhlükəsizlik: yalnız start, stop, restart əmrlərinə və təhlükəsiz konteyner adlarına icazə verilir.
const express=require('express'),{execFile}=require('child_process');
const r=express.Router(),OK=/^[\w][\w.-]*$/;
const dk=(a,cb)=>execFile('docker',a,{timeout:30000},(e,o,er)=>cb(e?(er||e.message):null,o));
r.get('/',(q,s)=>dk(['ps','-a','--format','{{json .}}'],(e,o)=>e?s.status(500).json({error:e}):s.json(o.trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)))));
r.post('/:name/:action',(q,s)=>{const{name,action}=q.params;if(!OK.test(name)||!['start','stop','restart'].includes(action))return s.sendStatus(400);
  dk([action,name],e=>e?s.status(500).json({error:e}):s.json({ok:1}))});
r.get('/:name/logs',(q,s)=>OK.test(q.params.name)?dk(['logs','--tail','100',q.params.name],(e,o)=>s.json({log:e||o})):s.sendStatus(400));
module.exports={id:'docker',title:'Docker',order:30,router:r};
