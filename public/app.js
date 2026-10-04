// ===== BRAUZER ÇƏRÇİVƏSİ (public/app.js) =====
// Nə edir: giriş ekranı, sol menyunu qurur, hər menyunun page.js faylını yükləyir.
// Menyuların öz kodu modules/<ad>/page.js faylındadır. Bu faylı dəyişmək lazım deyil.
const BT=window.BT={mods:{},register(id,p){this.mods[id]=p},esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 async api(u,m='GET',b){const r=await fetch('/api'+u,{method:m,headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined});if(r.status===401){init();throw 0}return r.json()},
 // Ortaq "alət" səhifəsi: URL / istifadəçi / parol / qeyd formu
 toolPage:id=>({async render(el){const t=await BT.api('/m/'+id),e=BT.esc;
  el.innerHTML=`<h2>${e(t.title)}</h2><label>URL</label><input id=u value="${e(t.url)}" placeholder="https://host:port"><label>İstifadəçi</label><input id=us value="${e(t.user)}"><label>Parol / API açarı ${t.hasPass?'(saxlanılıb — dəyişmək üçün yazın)':''}</label><input id=p type=password autocomplete=new-password><label>Qeyd</label><textarea id=no rows=2>${e(t.note)}</textarea><button id=sv>Saxla</button><button class=g id=op>Yeni tabda aç</button><button class=g id=fr>Burada aç (iframe)</button><button class=g id=cp>Parolu kopyala</button><span id=ms></span><div id=fx></div>`;
  const $=s=>el.querySelector(s);
  $('#sv').onclick=async()=>{await BT.api('/m/'+id,'PUT',{url:$('#u').value,user:$('#us').value,pass:$('#p').value,note:$('#no').value});$('#ms').textContent='Saxlanıldı ✅';setTimeout(()=>BT.show(id),600)};
  $('#op').onclick=()=>t.url&&window.open(t.url,'_blank','noopener');
  $('#fr').onclick=()=>$('#fx').innerHTML=`<iframe src="${e(t.url)}"></iframe><small>Boş görünürsə sayt iframe-i bloklayır — "Yeni tabda aç" istifadə edin.</small>`;
  $('#cp').onclick=async()=>navigator.clipboard.writeText((await BT.api(`/m/${id}/secret`)).pass)}}),
 async show(k){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.k===k));
  if(k==='out'){await BT.api('/logout','POST');return init()}
  const m=document.querySelector('#m');try{await BT.mods[k].render(m)}catch(e){m.innerHTML='<p class=dn>Xəta: '+BT.esc(e.message||e)+'</p>'}}};
const load=id=>new Promise(r=>{const s=document.createElement('script');s.src=`/m/${id}/page.js`;s.onload=s.onerror=r;document.head.appendChild(s)});
async function init(){const s=await(await fetch('/api/state')).json(),app=document.querySelector('#app');
 if(!s.auth){app.innerHTML=`<div id=login><h2>🛡️ BlueTeam Hub</h2><p>${s.setup?'İlk quraşdırma: admin parolu yaradın (min 10 simvol)':'Daxil olun'}</p><input id=pw type=password placeholder="Parol"><button id=lg>${s.setup?'Yarat':'Daxil ol'}</button><p id=er class=dn></p></div>`;
  const go=async()=>{const r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:document.querySelector('#pw').value})});r.ok?init():document.querySelector('#er').textContent=(await r.json()).error};
  document.querySelector('#lg').onclick=go;document.querySelector('#pw').onkeydown=e=>{if(e.key==='Enter')go()};return}
 const L=await BT.api('/modules');await Promise.all(L.map(m=>load(m.id)));
 app.innerHTML=`<nav><h1>🛡️ BlueTeam Hub</h1>${L.map(m=>`<a data-k="${m.id}">${BT.esc(m.title)}</a>`).join('')}<hr><a data-k=out>Çıxış</a></nav><main id=m></main>`;
 app.querySelectorAll('nav a').forEach(a=>a.onclick=()=>BT.show(a.dataset.k));BT.show('dashboard')}
init();
