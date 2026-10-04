// ===== BRAUZER ÇƏRÇİVƏSİ (public/app.js) =====
// Nə edir: giriş ekranı, sol menyu (adları ✎ ilə dəyişmək olar), hər menyunun page.js faylını yükləyir.
// Alət səhifəsi: "tam səhifə" seçilibsə sayt bütün ekranı tutur, ⚙ düyməsi ilə ayarlara qayıdılır.
// Menyuların öz kodu modules/<ad>/page.js faylındadır. Bu faylı dəyişmək lazım deyil.
const BT=window.BT={mods:{},L:[],edit:false,settings:{},register(id,p){this.mods[id]=p},esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 async api(u,m='GET',b){const r=await fetch('/api'+u,{method:m,headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined});if(r.status===401){init();throw 0}return r.json()},
 toolPage:id=>({async render(el){const t=await BT.api('/m/'+id),e=BT.esc,$=s=>el.querySelector(s);
  if(t.embed&&t.url&&!BT.settings[id]){ // TAM SƏHİFƏ rejimi
   el.style.padding='0';el.innerHTML=`<div class=bar><b>${e(t.title)}</b><span><button class=g id=op>↗ Yeni tabda aç</button><button class=g id=st>⚙ Ayarlar</button></span></div><iframe class=full src="${e(t.url)}"></iframe>`;
   $('#op').onclick=()=>window.open(t.url,'_blank','noopener');$('#st').onclick=()=>{BT.settings[id]=1;BT.show(id)};return}
  el.innerHTML=`<h2>${e(t.title)}</h2><label>URL</label><input id=u value="${e(t.url)}" placeholder="https://host:port"><label>İstifadəçi</label><input id=us value="${e(t.user)}"><label>Parol / API açarı ${t.hasPass?'(saxlanılıb — dəyişmək üçün yazın)':''}</label><input id=p type=password autocomplete=new-password><label>Qeyd</label><textarea id=no rows=2>${e(t.note)}</textarea><label style="display:block;margin-bottom:12px"><input type=checkbox id=em ${t.embed?'checked':''} style="width:auto;margin-right:8px">Menyuya basanda sayt tam səhifə kimi açılsın</label><button id=sv>Saxla</button><button class=g id=op>Yeni tabda aç</button><button class=g id=cp>Parolu kopyala</button><span id=ms></span>`;
  $('#sv').onclick=async()=>{await BT.api('/m/'+id,'PUT',{url:$('#u').value,user:$('#us').value,pass:$('#p').value,note:$('#no').value,embed:$('#em').checked});delete BT.settings[id];$('#ms').textContent='Saxlanıldı ✅';setTimeout(()=>BT.show(id),500)};
  $('#op').onclick=()=>t.url&&window.open(t.url,'_blank','noopener');
  $('#cp').onclick=async()=>navigator.clipboard.writeText((await BT.api(`/m/${id}/secret`)).pass)}}),
 nav(){document.querySelector('nav').innerHTML=`<h1>🛡️ BlueTeam Hub</h1>${this.L.map(m=>`<a data-k="${m.id}">${this.edit?'✎ ':''}${this.esc(m.title)}</a>`).join('')}<hr><a data-k=edit>${this.edit?'✔ Redaktəni bitir':'✎ Menyu adlarını dəyiş'}</a><a data-k=out>Çıxış</a>`;
  document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>this.click(a.dataset.k))},
 async click(k){
  if(k==='edit'){this.edit=!this.edit;return this.nav()}
  if(this.edit&&k!=='out'){const m=this.L.find(x=>x.id===k),n=prompt('Menyunun yeni adı:',m.title);
   if(n&&n.trim()){await this.api('/modules/'+k,'PUT',{title:n});m.title=n.trim().slice(0,60);this.nav()}return}
  this.show(k)},
 async show(k){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.k===k));
  if(k==='out'){await BT.api('/logout','POST');return init()}
  const m=document.querySelector('#m');m.style.padding='';try{await BT.mods[k].render(m)}catch(e){m.innerHTML='<p class=dn>Xəta: '+BT.esc(e.message||e)+'</p>'}}};
const load=id=>new Promise(r=>{const s=document.createElement('script');s.src=`/m/${id}/page.js`;s.onload=s.onerror=r;document.head.appendChild(s)});
async function init(){const s=await(await fetch('/api/state')).json(),app=document.querySelector('#app');
 if(!s.auth){app.innerHTML=`<div id=login><h2>🛡️ BlueTeam Hub</h2><p>${s.setup?'İlk quraşdırma: admin parolu yaradın (min 10 simvol)':'Daxil olun'}</p><input id=pw type=password placeholder="Parol"><button id=lg>${s.setup?'Yarat':'Daxil ol'}</button><p id=er class=dn></p></div>`;
  const go=async()=>{const r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:document.querySelector('#pw').value})});r.ok?init():document.querySelector('#er').textContent=(await r.json()).error};
  document.querySelector('#lg').onclick=go;document.querySelector('#pw').onkeydown=e=>{if(e.key==='Enter')go()};return}
 BT.L=await BT.api('/modules');await Promise.all(BT.L.map(m=>load(m.id)));
 app.innerHTML='<nav></nav><main id=m></main>';BT.nav();BT.show('dashboard')}
init();
