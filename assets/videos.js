/* Knowgura: dynamic three-title hero carousel + two editorial tags per film. */
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
  if(/cooper|quantum physics|explain(?:s)? god|god\\b/.test(s))return 'Mysteries';
  if(/trump|president|prime minister|politic|government|kim jong|netanyahu|modi|leader|election|war|india protects|america protects|white house|power/.test(s))return 'Power & Politics';
  if(/crime|heist|hack|fraud|scam|murder|killer|poison|cult|robbery|theft|bank|cooper|investigation|criminal/.test(s))return 'Crime';
  if(/tech|technology|quantum|ai\b|artificial intelligence|internet|data|cyber|crypto|bitcoin|binance|money|billion|company|business|econom|theranos|finance|startup|software/.test(s))return 'Tech & Money';
  if(/mystery|mysterious|unexplained|secret|unknown|unsolved|disappear|god|ancient|paranormal|strange/.test(s))return 'Mysteries';
  return 'Mysteries';
 };
 const tags=v=>{const category=classify(v);const s=(v.title+' '+(v.description||'')).toLowerCase();let sub='DOCUMENTARY';
  if(/trump|president|prime minister|politic|government|kim jong|netanyahu|modi|leader|election|white house/.test(s))sub='WORLD LEADERS';
  else if(/heist|bank|robbery|theft/.test(s))sub='HEIST';
  else if(/fraud|scam|theranos/.test(s))sub='FRAUD';
  else if(/hack|cyber|binance|crypto|bitcoin/.test(s))sub='CYBER & CRYPTO';
  else if(/murder|killer|poison|cult|crime|criminal/.test(s))sub='TRUE CRIME';
  else if(/quantum|ai\b|technology|tech|internet|data|company|software/.test(s))sub='TECHNOLOGY';
  else if(/money|billion|business|econom|finance|startup/.test(s))sub='BUSINESS & MONEY';
  else if(/mystery|mysterious|unexplained|secret|unknown|unsolved|disappear|god|ancient|paranormal|strange/.test(s))sub='MYSTERY';
  return [category,sub];
 };
 const image=id=>'https://i.ytimg.com/vi/'+encodeURIComponent(id)+'/hqdefault.jpg';
 const tagMarkup=v=>tags(v).map(t=>'<span>'+esc(t)+'</span>').join('');
 const card=v=>'<article class="card" data-search="'+esc((v.title+' '+(v.description||'')+' '+tags(v).join(' ')).toLowerCase())+'"><div class="thumb" data-video="'+esc(v.id)+'"><img loading="lazy" src="'+image(v.id)+'" alt="'+esc(v.title)+' thumbnail"><span class="play">▶</span></div><div class="video-tags">'+tagMarkup(v)+'</div><h3>'+esc(v.title)+'</h3></article>';
 async function load(){let videos=fallback;try{const r=await fetch('/videos.json?updated='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('catalogue');const d=await r.json();if(Array.isArray(d)&&d.length){const valid=d.filter(v=>v&&/^[A-Za-z0-9_-]{11}$/.test(v.id)&&v.title);if(valid.length)videos=valid}}catch(e){console.warn('Using saved Knowgura catalogue',e)}
  const featured=videos.slice(0,3);let active=0;const hero=document.getElementById('hero'),title=document.getElementById('heroTitle'),description=document.getElementById('heroDescription'),tagBox=document.getElementById('heroTags'),watch=document.getElementById('heroWatch'),dots=document.getElementById('heroDots');
  const paint=()=>{const v=featured[active];if(!v)return;hero.style.backgroundImage="linear-gradient(90deg,#080808 0%,rgba(8,8,8,.86) 31%,rgba(8,8,8,.12) 82%),linear-gradient(0deg,#080808 0%,transparent 53%),url('https://i.ytimg.com/vi/"+encodeURIComponent(v.id)+"/maxresdefault.jpg')";title.textContent=v.title;description.textContent=(v.description&&v.description!=='A Knowgura documentary')?v.description:'A Knowgura original investigation. Watch the full documentary and discover the story behind the headlines.';tagBox.innerHTML=tagMarkup(v);watch.onclick=()=>window.openKnowguraVideo(v.id);[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===active));};
  dots.innerHTML=featured.map((_,i)=>'<button class="hero-dot'+(i===0?' active':'')+'" aria-label="Show featured documentary '+(i+1)+'" data-slide="'+i+'"></button>').join('');
  dots.querySelectorAll('[data-slide]').forEach(d=>d.addEventListener('click',()=>{active=Number(d.dataset.slide);paint()}));
  const move=step=>{if(featured.length<2)return;active=(active+step+featured.length)%featured.length;paint()};
  document.getElementById('heroNext')?.addEventListener('click',()=>move(1));document.getElementById('heroPrev')?.addEventListener('click',()=>move(-1));paint();
  if(featured.length>1)setInterval(()=>move(1),8000);
  const groups=[['politicsGrid','Power & Politics'],['crimeGrid','Crime'],['techGrid','Tech & Money'],['mysteryGrid','Mysteries']];
  groups.forEach(([id,cat])=>{const el=document.getElementById(id);const rows=videos.filter(v=>classify(v)===cat);el.innerHTML=rows.length?rows.map(card).join(''):'<p class="category-empty">More stories coming soon.</p>'});
  document.querySelectorAll('.card [data-video]').forEach(el=>el.addEventListener('click',()=>window.openKnowguraVideo(el.dataset.video)));
  const search=document.getElementById('search');search?.addEventListener('input',()=>{const q=search.value.toLowerCase();document.querySelectorAll('.card').forEach(el=>{el.style.display=(el.dataset.search||'').includes(q)?'':'none'})});
 }
 document.addEventListener('DOMContentLoaded',load);
})();