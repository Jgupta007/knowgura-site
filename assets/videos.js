/* Knowgura video catalogue: latest three + keyword-based editorial shelves. */
(() => {
 const fallback=[
  {id:'UvzIOfuBZJA',title:'How America Keeps Donald Trump Alive',description:'A Knowgura documentary'},
  {id:'EoSKI39989w',title:'SHAME! SHAME! SHAME! Binance',description:'A Knowgura documentary'},
  {id:'c0FlK_MiQCE',title:"The World's Hardest Man to Kill - Kim Jong Un",description:'A Knowgura documentary'},
  {id:'zu3cKL-vAVU',title:"Why It's (Almost) Impossible to Kill Benjamin Netanyahu",description:'A Knowgura documentary'},
  {id:'-PRT_DBazIo',title:'The Cult That Poisoned a Town | Osho | Oregon',description:'A Knowgura documentary'},
  {id:'amO4p6DMRYU',title:'Theranos: The $9 Billion Lie | Elizabeth Holmes',description:'A Knowgura documentary'},
  {id:'coaAsEGHxzg',title:'D.B. Cooper: The $200,000 Mystery',description:'A Knowgura documentary'},
  {id:'R4tJCOftFhY',title:'Does Quantum Physics Explain God?',description:'A Knowgura documentary'},
  {id:'RSE9tTpjWFc',title:'The Company That Knows Almost Everything About You',description:'A Knowgura documentary'}
 ];
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const classify=v=>{const s=(v.title+' '+(v.description||'')).toLowerCase();
  if(/trump|president|prime minister|politic|government|kim jong|netanyahu|modi|leader|election|war|india protects|america protects|white house|power/.test(s))return 'Power & Politics';
  if(/crime|heist|hack|fraud|scam|murder|killer|poison|cult|robbery|theft|bank|cooper|investigation|criminal/.test(s))return 'Crime';
  if(/tech|technology|quantum|ai\b|artificial intelligence|internet|data|cyber|crypto|bitcoin|binance|money|billion|company|business|econom|theranos|finance|startup|software/.test(s))return 'Tech & Money';
  if(/mystery|mysterious|unexplained|secret|unknown|unsolved|disappear|god|ancient|paranormal|strange/.test(s))return 'Mysteries';
  return 'Mysteries';
 };
 const image=id=>'https://i.ytimg.com/vi/'+encodeURIComponent(id)+'/hqdefault.jpg';
 const card=v=>{const cat=classify(v);return '<article class="card" data-search="'+esc((v.title+' '+(v.description||'')+' '+cat).toLowerCase())+'"><div class="thumb" data-video="'+esc(v.id)+'"><img loading="lazy" src="'+image(v.id)+'" alt="'+esc(v.title)+' thumbnail"><span class="play">▶</span></div><div class="tag">'+cat+'</div><h3>'+esc(v.title)+'</h3><p>'+(esc(v.published)||'KNOWGURA ORIGINAL')+'</p></article>'};
 const latest=v=>'<article class="latest-card" data-video="'+esc(v.id)+'"><img loading="lazy" src="'+image(v.id)+'" alt="'+esc(v.title)+' thumbnail"><div class="latest-info"><div class="tag">'+classify(v)+'</div><h3>'+esc(v.title)+'</h3><span>▶ &nbsp; WATCH NOW</span></div></article>';
 async function load(){let videos=fallback;try{const r=await fetch('/videos.json?updated='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('catalogue');const d=await r.json();if(Array.isArray(d)&&d.length){const valid=d.filter(v=>v&&/^[A-Za-z0-9_-]{11}$/.test(v.id)&&v.title);if(valid.length)videos=valid}}catch(e){console.warn('Using saved Knowgura catalogue',e)}
  const latestTrack=document.getElementById('latestTrack');latestTrack.innerHTML=videos.slice(0,3).map(latest).join('');
  const groups=[['politicsGrid','Power & Politics'],['crimeGrid','Crime'],['techGrid','Tech & Money'],['mysteryGrid','Mysteries']];
  groups.forEach(([id,cat])=>{const el=document.getElementById(id);const rows=videos.filter(v=>classify(v)===cat);el.innerHTML=rows.length?rows.map(card).join(''):'<p class="category-empty">More stories coming soon.</p>'});
  document.querySelectorAll('[data-video]').forEach(el=>el.addEventListener('click',()=>window.openKnowguraVideo(el.dataset.video)));
  const search=document.getElementById('search');search?.addEventListener('input',()=>{const q=search.value.toLowerCase();document.querySelectorAll('.card,.latest-card').forEach(el=>{el.style.display=(el.innerText+' '+(el.dataset.search||'')).toLowerCase().includes(q)?'':'none'})});
  const rotate=(dir)=>{const track=document.getElementById('latestTrack');const cards=[...track.children];if(cards.length<2)return;const shift=dir>0?1:cards.length-1;const next=cards.map((_,i)=>cards[(i+shift)%cards.length]);track.replaceChildren(...next)};
  document.getElementById('nextLatest')?.addEventListener('click',()=>rotate(1));document.getElementById('prevLatest')?.addEventListener('click',()=>rotate(-1));
 }
 document.addEventListener('DOMContentLoaded',load);
})();