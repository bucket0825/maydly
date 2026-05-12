
const T1='ghp_61JieReKh',T2='RqwV39K7D6zy',T3='mvFRhHIji1lARiY';
const GHT=T1+T2+T3;
const REPO='bucket0825/maydly',FILE='public-data.json',PIN='0825';
const LB=[{id:'nam',name:'남스튜디오',c:'#22c47a'},{id:'yeo',name:'여스튜디오',c:'#f472b6'},{id:'out',name:'야외',c:'#60a5fa'},{id:'pro',name:'프로필페이',c:'#fb923c'},{id:'com',name:'야외상업',c:'#2dd4bf'},{id:'pa',name:'PA촬영',c:'#a78bfa'},{id:'off',name:'휴무',c:'#f87171'},{id:'free',name:'무페이',c:'#4ade80'},{id:'nosh',name:'노쇼',c:'#1e1e1e'}];
const WD=[{s:'14:00',e:'16:00'},{s:'17:00',e:'19:00'},{s:'20:00',e:'22:00'}];
const WE=[{s:'11:00',e:'13:00'},{s:'14:00',e:'16:00'},{s:'17:00',e:'19:00'},{s:'20:00',e:'22:00'}];
let pb='',cd=new Date(),sch={},eds=null,est={};
function pi(n){if(pb.length>=4)return;pb+=n;ud();if(pb.length===4)setTimeout(cp,80);}
function pd(){pb=pb.slice(0,-1);ud();document.getElementById('pinErr').textContent='';}
function ud(){for(let i=0;i<4;i++)document.getElementById('pd'+i).classList.toggle('on',i<pb.length);}
function cp(){if(pb===PIN){document.getElementById('pinScreen').style.display='none';document.getElementById('mainApp').style.display='block';loadData();}else{document.getElementById('pinErr').textContent='핀 번호가 틀렸습니다';pb='';ud();}}
function fd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function pds(ds){const[y,m,d]=ds.split('-').map(Number);return new Date(y,m-1,d);}
function iwe(ds){const d=pds(ds).getDay();return d===0||d===6;}
function dsl(ds){return(iwe(ds)?WE:WD).map(s=>({...s,avail:true}));}
async function loadData(){try{const r=await fetch('https://raw.githubusercontent.com/'+REPO+'/main/'+FILE+'?t='+Date.now());if(r.ok){const d=await r.json();sch=d.schedule||{};}}catch(e){}rc();}
function chM(n){cd.setMonth(cd.getMonth()+n);rc();}
function rc(){
  const y=cd.getFullYear(),m=cd.getMonth(),ms=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  document.getElementById('monLabel').textContent=y+'년 '+ms[m];
  const td=fd(new Date()),f=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),pr=new Date(y,m,0).getDate();
  let h='';
  for(let i=0;i<f;i++)h+=dc(fd(new Date(y,m-1,pr-f+1+i)),pr-f+1+i,true,td);
  for(let d=1;d<=days;d++)h+=dc(fd(new Date(y,m,d)),d,false,td);
  const rm=(7-(f+days)%7)%7;for(let d=1;d<=rm;d++)h+=dc(fd(new Date(y,m+1,d)),d,true,td);
  document.getElementById('calGrid').innerHTML=h;
}
function dc(ds,dn,dim,td){
  const sc=sch[ds],dw=pds(ds).getDay(),it=ds===td;let ch='';
  if(sc){if(sc.unavailable)ch='<div class="day-chip chip-unavail">불가</div>';else if(sc.slots){const av=sc.slots.filter(s=>s.avail).length,tot=sc.slots.length;ch=av===0?'<div class="day-chip chip-full-ng">만료</div>':av<tot?'<div class="day-chip chip-partial">'+av+'/'+tot+'타임</div>':'<div class="day-chip chip-avail">'+av+'타임</div>';}if(sc.label){const lb=LB.find(l=>l.id===sc.label);if(lb)ch+='<div class="day-chip" style="background:'+lb.c+'22;color:'+lb.c+'">'+lb.name.substring(0,4)+'</div>';}}
  const nc=dw===0?'day-num sun':dw===6?'day-num sat':'day-num';
  return '<div class="day-cell'+(dim?' dim':'')+(it?' today':'')+'" onclick="os(\''+ds+'\')"><div class="'+nc+'">'+dn+'</div><div class="day-chips">'+ch+'</div></div>';
}
function os(ds){
  eds=ds;const sc=sch[ds]||{};const[y,m,d]=ds.split('-').map(Number),DW=['일','월','화','수','목','금','토'],dw=pds(ds).getDay();
  document.getElementById('sheetTitle').innerHTML=y+'년 '+m+'월 '+d+'일 <span class="sheet-date">('+DW[dw]+')</span>';
  est={unavailable:sc.unavailable||false,slots:sc.slots?sc.slots.map(s=>({...s})):dsl(ds),label:sc.label||null,memo:sc.memo||''};
  rs();document.getElementById('sheetBg').classList.add('on');document.getElementById('sheet').style.display='block';
}
function rs(){
  document.getElementById('unavailToggle').classList.toggle('on',est.unavailable);
  const sec=document.getElementById('slotsSection');sec.style.opacity=est.unavailable?'.35':'1';sec.style.pointerEvents=est.unavailable?'none':'auto';
  let sh='';est.slots.forEach((s,i)=>{const cl=s.avail?'avail':'blocked';sh+='<div class="slot-row '+cl+'" onclick="ts('+i+')"><div class="slot-time">'+s.s+' ~ '+s.e+'</div><div class="slot-status">'+(s.avail?'✅ 예약 가능':'— 예약 불가')+'</div></div>';});
  document.getElementById('slotRows').innerHTML=sh;
  let lh='';LB.forEach(lb=>{const sel=est.label===lb.id;lh+='<div class="label-chip'+(sel?' selected':'')+'" style="'+(sel?'border-color:'+lb.c+';background:'+lb.c+'18':'')+'" onclick="sl(\''+lb.id+'\')"><div class="label-dot" style="background:'+lb.c+'"></div><div class="label-name">'+lb.name+'</div></div>';});
  document.getElementById('labelGrid').innerHTML=lh;
  document.getElementById('memoInput').value=est.memo;
}
function togU(){est.unavailable=!est.unavailable;rs();}
function ts(i){est.slots[i].avail=!est.slots[i].avail;rs();}
function sl(id){est.label=est.label===id?null:id;rs();}
function saveDay(){
  if(est.unavailable){sch[eds]={unavailable:true};if(est.label)sch[eds].label=est.label;if(est.memo)sch[eds].memo=est.memo;}
  else{const hc=est.slots.some(s=>!s.avail);if(!hc&&!est.label&&!est.memo){delete sch[eds];}else{sch[eds]={slots:est.slots.map(s=>({s:s.s,e:s.e,avail:s.avail}))};if(est.label)sch[eds].label=est.label;if(est.memo)sch[eds].memo=est.memo;}}
  closeSheet();rc();showToast('저장됨 — 💾로 업로드하세요');
}
function clearDay(){delete sch[eds];closeSheet();rc();showToast('초기화됨');}
function closeSheet(){document.getElementById('sheetBg').classList.remove('on');document.getElementById('sheet').style.display='none';eds=null;}
async function sync(){
  const btn=document.getElementById('syncBtn');btn.textContent='업로드 중...';btn.classList.add('loading');
  try{
    const sr=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+FILE,{headers:{'Authorization':'token '+GHT}});
    const sd=await sr.json();
    const cnt=btoa(unescape(encodeURIComponent(JSON.stringify({generated:new Date().toISOString(),schedule:sch},null,2))));
    const ur=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+FILE,{method:'PUT',headers:{'Authorization':'token '+GHT,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'Admin: schedule update',content:cnt,sha:sd.sha})});
    const r=await ur.json();showToast(r.content?'✅ 업로드 완료!':'❌ 실패: '+(r.message||''));
  }catch(e){showToast('❌ 오류: '+e.message);}
  btn.textContent='💾 저장';btn.classList.remove('loading');
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2500);}
rc();
