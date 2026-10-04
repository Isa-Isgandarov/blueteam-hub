// ===== MENYU: Notification (backend) =====
// Nə edir: Telegram bot token və chat ID saxlayır, test mesajı göndərir.
// Başqa modullar bildiriş göndərmək üçün bu faylın notify() funksiyasından istifadə edə bilər.
const express=require('express'),{db,save,enc,dec}=require('../../core/storage');
const r=express.Router();
const notify=async text=>{const r=await fetch(`https://api.telegram.org/bot${dec(db.notify.token)}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:db.notify.chat,text})});return r.ok};
r.get('/',(q,s)=>s.json({chat:db.notify.chat||'',hasToken:!!db.notify.token}));
r.put('/',(q,s)=>{if(q.body.token)db.notify.token=enc(q.body.token);if(typeof q.body.chat==='string')db.notify.chat=q.body.chat;save();s.json({ok:1})});
r.post('/test',async(q,s)=>{try{s.json({ok:await notify('BlueTeam Hub: test mesajı ✅')})}catch(e){s.status(500).json({error:e.message})}});
module.exports={id:'notification',title:'Notification (Telegram)',order:40,router:r,notify};
