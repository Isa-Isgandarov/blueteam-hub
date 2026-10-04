// ===== STATUS YOXLAMA (core/ping.js) =====
// Nə edir: verilən URL-in açıq olub-olmadığını yoxlayır (self-signed sertifikat qəbul olunur).
const http=require('http'),https=require('https');
module.exports=url=>new Promise(res=>{
  if(!/^https?:\/\//.test(url||''))return res({up:false});
  const st=Date.now(),r=(url.startsWith('https')?https:http).request(url,{timeout:4000,rejectUnauthorized:false},x=>{x.resume();res({up:true,code:x.statusCode,ms:Date.now()-st})});
  r.on('error',()=>res({up:false}));r.on('timeout',()=>r.destroy());r.end()});
