// ===== MENYU: Notification (ekran) =====
// Nə edir: Telegram bot token və chat ID daxil etmə formu və test düyməsi. (Mail — sonrakı versiyada.)
BT.register('notification',{async render(el){
  const n=await BT.api('/m/notification');
  el.innerHTML=`<h2>Notification (Telegram)</h2><label>Bot token ${n.hasToken?'(saxlanılıb — dəyişmək üçün yazın)':''}</label><input id=tk type=password><label>Chat ID</label><input id=ch value="${BT.esc(n.chat)}"><button id=sv>Saxla</button><button class=g id=ts>Test mesajı</button><p id=nr></p>`;
  el.querySelector('#sv').onclick=async()=>{await BT.api('/m/notification','PUT',{token:el.querySelector('#tk').value,chat:el.querySelector('#ch').value});el.querySelector('#nr').textContent='Saxlanıldı'};
  el.querySelector('#ts').onclick=async()=>{const r=await BT.api('/m/notification/test','POST',{});el.querySelector('#nr').textContent=r.ok?'Göndərildi ✅':'Xəta: '+(r.error||'göndərilmədi')}}});
