// ===== MENYU: Docker (ekran) =====
// Nə edir: konteynerlərin cədvəli; hər sətirdə Start / Stop / Restart / Log düymələri.
BT.register('docker',{async render(el){
  el.innerHTML='<h2>Docker</h2><p>Yüklənir…</p>';const r=await BT.api('/m/docker');
  if(r.error){el.innerHTML=`<h2>Docker</h2><p class=dn>${BT.esc(r.error)}</p><p>İpucu: bthub istifadəçisi docker qrupunda olmalıdır.</p>`;return}
  el.innerHTML=`<h2>Docker</h2><table><tr><th>Ad</th><th>İmage</th><th>Status</th><th>Əməliyyat</th></tr>${r.map(c=>`<tr><td>${BT.esc(c.Names)}</td><td>${BT.esc(c.Image)}</td><td class="${c.State==='running'?'up':'dn'}">${BT.esc(c.Status)}</td><td><button data-a=start data-n="${BT.esc(c.Names)}">Start</button><button class=r data-a=stop data-n="${BT.esc(c.Names)}">Stop</button><button class=g data-a=restart data-n="${BT.esc(c.Names)}">Restart</button><button class=g data-a=logs data-n="${BT.esc(c.Names)}">Log</button></td></tr>`).join('')}</table><div id=lg></div>`;
  el.querySelectorAll('button').forEach(b=>b.onclick=async()=>{const{a,n}=b.dataset;
    if(a==='logs'){const l=await BT.api(`/m/docker/${n}/logs`);el.querySelector('#lg').innerHTML=`<pre>${BT.esc(l.log)}</pre>`;return}
    if(a!=='start'&&!confirm(`${n}: ${a}?`))return;await BT.api(`/m/docker/${n}/${a}`,'POST');BT.show('docker')})}});
