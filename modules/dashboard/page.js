// ===== MENYU: Dashboard (ekran) =====
// Nə edir: bütün alətləri kart şəklində göstərir; yaşıl = işləyir, qırmızı = əlçatmaz. Karta basanda həmin menyuya keçir.
BT.register('dashboard',{async render(el){
  el.innerHTML='<h2>Dashboard</h2><p>Yoxlanılır…</p>';const L=await BT.api('/m/dashboard/status');
  el.innerHTML='<h2>Dashboard</h2><div class=grid>'+L.map(t=>`<div class=card data-k="${t.id}"><b>${BT.esc(t.title)}</b><div class="${t.up?'up':'dn'}">${t.up?`● Online (${t.code}, ${t.ms}ms)`:'● Offline / URL yoxdur'}</div><small>${BT.esc(t.url)}</small></div>`).join('')+'</div>';
  el.querySelectorAll('.card').forEach(c=>c.onclick=()=>BT.show(c.dataset.k))}});
