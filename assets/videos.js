/* Knowgura: dynamic three-title hero carousel + two editorial tags per film. */
(() => {
 const fallback=[
  {id:"UvzIOfuBZJA",title:"How America Keeps Donald Trump Alive",description:"Inside the layered security system designed to keep the most powerful man in America alive."},
  {id:"EoSKI39989w",title:"SHAME! SHAME! SHAME! Binance",description:"The crypto empire that shook the financial world—and the controversy behind its rise."},
  {id:"c0FlK_MiQCE",title:"The World's Hardest Man to Kill - Kim Jong Un",description:"How North Korea’s most guarded leader stays protected from threats at every turn."},
  {id:"zu3cKL-vAVU",title:"Why It's (Almost) Impossible to Kill Benjamin Netanyahu",description:"Inside the security network built around one of the world's most threatened leaders."},
  {id:"-PRT_DBazIo",title:"The Cult That Poisoned a Town | Osho | Oregon",description:"How a spiritual commune in Oregon spiralled into one of America's most shocking scandals."},
  {id:"amO4p6DMRYU",title:"Theranos: The $9 Billion Lie | Elizabeth Holmes | You Can See Everything",description:"How a billion-dollar blood-testing dream fooled investors—and what brought it crashing down."},
  {id:"coaAsEGHxzg",title:"D.B. Cooper: The $200,000 Mystery",description:"He hijacked a plane, took $200,000, and vanished—leaving a mystery unsolved for decades."},
  {id:"R4tJCOftFhY",title:"Does Quantum Physics Explains God?",description:"Where quantum physics meets the biggest question of all: could science explain God?"},
  {id:"RSE9tTpjWFc",title:"The Company That Knows Almost Everything About You",description:"How a data giant can map your life from the digital clues you leave behind."}
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
  if(/cooper|quantum physics|explain(?:s)? god|god/.test(s))sub='UNSOLVED MYSTERY';
  else if(/trump|president|prime minister|politic|government|kim jong|netanyahu|modi|leader|election|white house/.test(s))sub='WORLD LEADERS';
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
  const paint=()=>{const v=featured[active];if(!v)return;hero.style.backgroundImage="linear-gradient(90deg,#080808 0%,rgba(8,8,8,.86) 31%,rgba(8,8,8,.12) 82%),linear-gradient(0deg,#080808 0%,transparent 53%),url('https://i.ytimg.com/vi/"+encodeURIComponent(v.id)+"/maxresdefault.jpg')";title.textContent=v.title;description.textContent=v.description||'Discover the story behind the headlines.';tagBox.innerHTML=tagMarkup(v);watch.onclick=()=>window.openKnowguraVideo(v.id);[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===active));};
  dots.innerHTML=featured.map((_,i)=>'<button class="hero-dot'+(i===0?' active':'')+'" aria-label="Show featured documentary '+(i+1)+'" data-slide="'+i+'"></button>').join('');
  dots.querySelectorAll('[data-slide]').forEach(d=>d.addEventListener('click',()=>{active=Number(d.dataset.slide);paint()}));
  const move=step=>{if(featured.length<2)return;active=(active+step+featured.length)%featured.length;paint()};
  document.getElementById('heroNext')?.addEventListener('click',()=>move(1));document.getElementById('heroPrev')?.addEventListener('click',()=>move(-1));
  // Mobile: swipe horizontally across the hero to change featured documentaries.
  let touchStartX=0,touchStartY=0;
  hero.addEventListener('touchstart',e=>{if(!e.touches||e.touches.length!==1)return;touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;},{passive:true});
  hero.addEventListener('touchend',e=>{if(!e.changedTouches||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touchStartX;const dy=e.changedTouches[0].clientY-touchStartY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1);},{passive:true});
  paint();
  if(featured.length>1)setInterval(()=>move(1),8000);
  const groups=[['politicsGrid','Power & Politics'],['crimeGrid','Crime'],['techGrid','Tech & Money'],['mysteryGrid','Mysteries']];
  groups.forEach(([id,cat])=>{const el=document.getElementById(id);const rows=videos.filter(v=>classify(v)===cat);el.innerHTML=rows.length?rows.map(card).join(''):'<p class="category-empty">More stories coming soon.</p>'});
  document.querySelectorAll('.card [data-video]').forEach(el=>el.addEventListener('click',()=>window.openKnowguraVideo(el.dataset.video)));
  const search=document.getElementById('search');
  const searchButton=document.getElementById('searchButton');
  const applySearch=()=>{const q=(search?.value||'').trim().toLowerCase();let count=0;
   document.querySelectorAll('.category-row').forEach(section=>{let visible=0;section.querySelectorAll('.card').forEach(el=>{const match=!q||(el.dataset.search||'').includes(q);el.style.display=match?'':'none';if(match){visible++;count++}});section.style.display=(!q||visible>0)?'':'none'});
   if(q&&count===0){let note=document.getElementById('searchEmpty');if(!note){note=document.createElement('p');note.id='searchEmpty';note.className='empty';note.style.cssText='padding:0 5%;color:#bbb';document.querySelector('main').insertBefore(note,document.querySelector('.category-row'))}note.textContent='No documentaries found for “'+(search.value.trim())+'”. Try another keyword.'}else{document.getElementById('searchEmpty')?.remove()}
  };
  search?.addEventListener('input',applySearch);
  search?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applySearch();const first=document.querySelector('.category-row:not([style*="display: none"]) .card:not([style*="display: none"])');first?.scrollIntoView({behavior:'smooth',block:'center'})}});
  searchButton?.addEventListener('click',()=>{search?.focus();applySearch()});
 }
 document.addEventListener('DOMContentLoaded',load);
})();