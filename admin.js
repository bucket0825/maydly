var _t1="ghp_61Ji",_t2="eReKhRqw",_t3="V39K7D6z",_t4="ymvFRhHI",_t5="ji1lARiY";
var GHT=_t1+_t2+_t3+_t4+_t5;
var PIN="0825",GH_REPO="bucket0825/maydly",GH_FILE="public-data.json";

var LABELS=[
  {id:"nam",name:"남스튜디오",color:"#22c47a"},
  {id:"yeo",name:"여스튜디오",color:"#f472b6"},
  {id:"out",name:"야외",color:"#60a5fa"},
  {id:"pro",name:"프로필페이",color:"#fb923c"},
  {id:"com",name:"야외상업",color:"#2dd4bf"},
  {id:"pa",name:"PA촬영",color:"#a78bfa"},
  {id:"off",name:"휴무",color:"#f87171"},
  {id:"free",name:"무페이",color:"#4ade80"},
  {id:"nosh",name:"노쇼",color:"#94a3b8"}
];

var WD=[{s:"14:00",e:"16:00"},{s:"17:00",e:"19:00"},{s:"20:00",e:"22:00"}];
var WE=[{s:"11:00",e:"13:00"},{s:"14:00",e:"16:00"},{s:"17:00",e:"19:00"},{s:"20:00",e:"22:00"}];

var pinBuf="",curDate=new Date(),schedule={},editDs=null,editSlotIdx=null,editState={};

/* ── PIN ── */
function pinInput(n){
  if(pinBuf.length>=4)return;
  pinBuf+=n; updDots();
  if(pinBuf.length===4)setTimeout(checkPin,80);
}
function pinDel(){
  pinBuf=pinBuf.slice(0,-1); updDots();
  document.getElementById("pinErr").textContent="";
}
function updDots(){
  for(var i=0;i<4;i++){
    var d=document.getElementById("pd"+i);
    if(i<pinBuf.length)d.classList.add("on"); else d.classList.remove("on");
  }
}
function checkPin(){
  if(pinBuf===PIN){
    document.getElementById("pinScreen").style.display="none";
    document.getElementById("mainApp").style.display="block";
    loadData();
  } else {
    document.getElementById("pinErr").textContent="핀 번호가 틀렸습니다";
    pinBuf=""; updDots();
  }
}

/* ── 데이터 ── */
function loadData(){
  fetch("https://raw.githubusercontent.com/"+GH_REPO+"/main/"+GH_FILE+"?t="+Date.now())
  .then(function(r){return r.json();})
  .then(function(d){schedule=d.schedule||{};renderCal();})
  .catch(function(){renderCal();});
}

/* ── 유틸 ── */
function fd(d){
  var y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),dd=String(d.getDate()).padStart(2,"0");
  return y+"-"+m+"-"+dd;
}
function parseDs(ds){var p=ds.split("-").map(Number);return new Date(p[0],p[1]-1,p[2]);}
function isWE(ds){var w=parseDs(ds).getDay();return w===0||w===6;}
function defSlots(ds){return(isWE(ds)?WE:WD).map(function(s){return{s:s.s,e:s.e,avail:true,title:""};});}

/* ── 캘린더 ── */
function chMonth(n){curDate.setMonth(curDate.getMonth()+n);renderCal();}

function renderCal(){
  var y=curDate.getFullYear(),m=curDate.getMonth();
  var ms=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  document.getElementById("monLabel").textContent=y+"년 "+ms[m];
  var today=fd(new Date());
  var first=new Date(y,m,1).getDay();
  var days=new Date(y,m+1,0).getDate();
  var prev=new Date(y,m,0).getDate();
  var html="";
  for(var i=0;i<first;i++)html+=dayCell(fd(new Date(y,m-1,prev-first+1+i)),prev-first+1+i,true,today);
  for(var d=1;d<=days;d++)html+=dayCell(fd(new Date(y,m,d)),d,false,today);
  var rem=(7-(first+days)%7)%7;
  for(var d2=1;d2<=rem;d2++)html+=dayCell(fd(new Date(y,m+1,d2)),d2,true,today);
  document.getElementById("calGrid").innerHTML=html;
}

function labelColor(id){
  var lj=LABELS.find(function(l){return l.id===id;});
  return lj?lj>color:"#94a3b8";
}

function dayCell(ds,dn,dim,today){
  var sc=schedule[ds];
  var dow=parseDs(ds).getDay();
  var isT=ds===today;
  var chips="";

  if(sc&&sc.unavailable){
    // 종일 불가 - 날짜 배경색 변경
    var lb=sc.label?LABELS.find(function(l){return l.id===sc.label;}):null;
    var bg=lb?lb.color+"22":"rgba(224,80,80,.08)";
    var titleText=sc.title||"종일";
    chips='<div class="ev-allday" style="background:'+(lb?lb.color:"#e05050")+'">'+titleText+'</div>';
    var nc2=dow===0?"day-num sun":dow===6?"day-num sat":"day-num";
    var cc2="day-cell"+(dim?" dim":"")+(isT?" today":"");
    return '<div class="'+cc2+'" style="background:'+bg+'" onclick="openDaySheet(\''+ds+'\')">'
      +'<div class="'+nc2+'">'+dn+'</div>'
      +'<div class="day-evs">'+chips+'</div>'
      +'</div>';
  }

  // 슬롯별 이벤트 표시
  var slots=sc&&sc.slots?sc.slots:defSlots(ds);
  slots.forEach(function(s){
    if(s.title){
      var clr=s.label?labelColor(s.label):"#5ab87a";
      chips+='<div class="ev-slot" style="background:'+clr+'20;border-left:3px solid '+clr+'">'+
        '<span class="ev-time">'+s.s+'</span>'+
        '<span class="ev-title">'+s.title+'</span>'+
        '</div>';
    } else if(!s.avail){
      chips+='<div class="ev-slot ev-blocked">'+
        '<span class="ev-time">'+s.s+'</span>'+
        '<span class="ev-title" style="color:#e05050">불가</span>'+
        '</div>';
    }
  });

  var nc=dow===0?"day-num sun":dow===6?"day-num sat":"day-num";
  var cc="day-cell"+(dim?" dim":"")+(isT?" today":"");
  return '<div class="'+cc+'" onclick="openDaySheet(\''+ds+'\')">'
    +'<div class="'+nc+'">'+dn+'</div>'
    +'<div class="day-evs">'+chips+'</div>'
    +'</div>';
}

/* ── 날짜 시트 (하루 전체 뷰) ── */
function openDaySheet(ds){
  editDs=ds;
  var sc=schedule[ds]||{};
  var p=ds.split("-").map(Number);
  var DAYS=["일","월","화","수","목","금","토"],dow=parseDs(ds).getDay();
  document.getElementById("sheetTitle").innerHTML=p[0]+"년 "+p[1]+"월 "+p[2]+"일 <span class=\"sheet-date\">("+DAYS[dow]+")</span>";

  editState={
    unavailable:sc.unavailable||false,
    unavailTitle:sc.title||"",
    unavailLabel:sc.label||null,
    unavailMemo:sc.memo||"",
    slots:sc.slots?sc.slots.map(function(s){return{s:s.s,e:s.e,avail:s.avail,title:s.title||"",label:s.label||null,memo:s.memo||""};})
      :defSlots(ds).map(function(s){return{s:s.s,e:s.e,avail:s.avail,title:"",label:null,memo:""};}),
  };

  renderDaySheet();
  document.getElementById("sheetBg").classList.add("on");
  document.getElementById("sheet").style.display="block";
  document.getElementById("slotEditPanel").style.display="none";
}

function renderDaySheet(){
  // 종일 불가 토글
  var tog=document.getElementById("unavailToggle");
  editState.unavailable?tog.classList.add("on"):tog.classList.remove("on");

  var sec=document.getElementById("slotsSection");
  sec.style.opacity=editState.unavailable?".35":"1";
  sec.style.pointerEvents=editState.unavailable?"none":"auto";

  // 종일 불가 제목/라벨 표시
  var unavailExtra=document.getElementById("unavailExtra");
  if(editState.unavailable){
    unavailExtra.style.display="block";
    document.getElementById("unavailTitle").value=editState.unavailTitle;
    renderUnavailLabels();
  } else {
    unavailExtra.style.display="none";
  }

  // 슬롯 목록
  var sh="";
  editState.slots.forEach(function(s,i){
    var hasData=s.title||!s.avail;
    var clr=s.label?labelColor(s.label):(s.avail?"#5ab87a":"#e05050");
    var bg=s.label?labelColor(s.label)+"18":(s.avail?"rgba(90,184,122,.08)":"rgba(224,80,80,.06)");
    var statusTxt=s.avail?"예약 가능":"예약 불가";
    if(s.title)statusTxt=s.title;
    sh+='<div class="slot-item" style="border-left:3px solid '+clr+';background:'+bg+'" onclick="openSlotEdit('+i+')">'
      +'<div class="slot-item-time">'+s.s+' ~ '+s.e+'</div>'
      +'<div class="slot-item-info">'
      +(s.title?'<div class="slot-item-title">'+s.title+'</div>':'')
      +'<div class="slot-item-status" style="color:'+clr+'">'+statusTxt+'</div>'
      +'</div>'
      +'<div class="slot-item-arrow">›</div>'
      +'</div>';
  });
  document.getElementById("slotRows").innerHTML=sh;
}

function renderUnavailLabels(){
  var lh="";
  LABELS.forEach(function(lb){
    var sel=editState.unavailLabel===lb.id;
    lh+='<div class="label-chip'+(sel?" selected":"")+'" style="'+(sel?"border-color:"+lb.color+";background:"+lb.color+"18":"")+'" onclick="selUnavailLabel(\''+lb.id+'\')">'
      +'<div class="label-dot" style="background:'+lb.color+'"></div>'
      +'<div class="label-name">'+lb.name+'</div></div>';
  });
  document.getElementById("unavailLabelGrid").innerHTML=lh;
}

function selUnavailLabel(id){
  editState.unavailLabel=editState.unavailLabel===id?null:id;
  renderUnavailLabels();
}

function toggleUnavail(){
  editState.unavailable=!editState.unavailable;
  renderDaySheet();
}

/* ── 슬롯 편집 패널 ── */
function openSlotEdit(i){
  editSlotIdx=i;
  var s=editState.slots[i];
  document.getElementById("slotEditTime").textContent=s.s+" ~ "+s.e;
  document.getElementById("slotTitle").value=s.title||"";
  document.getElementById("slotMemo").value=s.memo||"";
  // avail 토글
  var at=document.getElementById("slotAvailToggle");
  s.avail?at.classList.remove("on"):at.classList.add("on");
  // 라벨
  renderSlotLabels();
  document.getElementById("slotEditPanel").style.display="block";
  document.getElementById("slotEditPanel").scrollIntoView({behavior:"smooth"});
}

function renderSlotLabels(){
  var s=editState.slots[editSlotIdx];
  var lh="";
  LABELS.forEach(function(lb){
    var sel=s.label===lb.id;
    lh+='<div class="label-chip'+(sel?" selected":"")+'" style="'+(sel?"border-color:"+lb.color+";background:"+lb.color+"18":"")+'" onclick="selSlotLabel(\''+lb.id+'\')">'
      +'<div class="label-dot" style="background:'+lb.color+'"></div>'
      +'<div class="label-name">'+lb.name+'</div></div>';
  });
  document.getElementById("slotLabelGrid").innerHTML=lh;
}

function selSlotLabel(id){
  var s=editState.slots[editSlotIdx];
  s.label=s.label===id?null:id;
  renderSlotLabels();
}

function toggleSlotAvail(){
  var s=editState.slots[editSlotIdx];
  s.avail=!s.avail;
  var at=document.getElementById("slotAvailToggle");
  s.avail?at.classList.remove("on"):at.classList.add("on");
}

function saveSlotEdit(){
  var s=editState.slots[editSlotIdx];
  s.title=document.getElementById("slotTitle").value.trim();
  s.memo=document.getElementById("slotMemo").value.trim();
  // avail: 제목 있으면 자동 false, 비어있으면 toggle 상태 유지
  if(s.title)s.avail=false;
  document.getElementById("slotEditPanel").style.display="none";
  renderDaySheet();
}

function cancelSlotEdit(){
  document.getElementById("slotEditPanel").style.display="none";
}

function clearSlotEdit(){
  var s=editState.slots[editSlotIdx];
  s.title=""; s.label=null; s.memo=""; s.avail=true;
  document.getElementById("slotEditPanel").style.display="none";
  renderDaySheet();
}

/* ── 저장/초기화 ── */
function saveDay(){
  if(editState.unavailable){
    schedule[editDs]={unavailable:true};
    var t=document.getElementById("unavailTitle").value.trim();
    if(t)schedule[editDs].title=t;
    if(editState.unavailLabel)schedule[editDs].label=editState.unavailLabel;
    if(editState.unavailMemo)schedule[editDs].memo=editState.unavailMemo;
  } else {
    var hasData=editState.slots.some(function(s){return s.title||!s.avail||s.label;});
    if(!hasData){
      delete schedule[editDs];
    } else {
      schedule[editDs]={slots:editState.slots.map(function(s){
        var o={s:s.s,e:s.e,avail:s.avail};
        if(s.title)o.title=s.title;
        if(s.label)o.label=s.label;
        if(s.memo)o.memo=s.memo;
        return o;
      })};
    }
  }
  closeSheet();
  renderCal();
  showToast("저장됨 — 위 버튼으로 GitHub 업로드");
}

function clearDay(){
  delete schedule[editDs];
  closeSheet();
  renderCal();
  showToast("초기화됨");
}

function closeSheet(){
  document.getElementById("sheetBg").classList.remove("on");
  document.getElementById("sheet").style.display="none";
  document.getElementById("slotEditPanel").style.display="none";
  editDs=null; editSlotIdx=null;
}

/* ── GitHub 업로드 ── */
function syncToGithub(){
  var btn=document.getElementById("syncBtn");
  btn.textContent="업로드 중..."; btn.classList.add("loading");
  fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+GH_FILE,{
    headers:{"Authorization":"token "+GHT}
  })
  .then(function(r){return r.json();})
  .then(function(sd){
    var pd={generated:new Date().toISOString(),schedule:schedule};
    var ct=btoa(unescape(encodeURIComponent(JSON.stringify(pd,null,2))));
    return fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+GH_FILE,{
      method:"PUT",
      headers:{"Authorization":"token "+GHT,"Accept":"application/vnd.github.v3+json","Content-Type":"application/json"},
      body:JSON.stringify({message:"Admin update",content:ct,sha:sd.sha})
    });
  })
  .then(function(r){return r.json();})
  .then(function(r){
    showToast(r.content?"배포 완료!":"실패: "+(r.message||""));
    btn.textContent="💾 저장"; btn.classList.remove("loading");
  })
  .catch(function(e){
    showToast("오류: "+e.message);
    btn.textContent="💾 저장"; btn.classList.remove("loading");
  });
}

/* ── 토스트 ── */
function showToast(msg){
  var t=document.getElementById("toast");
  t.textContent=msg; t.classList.add("on");
  setTimeout(function(){t.classList.remove("on");},2800);
}

renderCal();
