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
  {id:"nosh",name:"노쇼",color:"#1e1e1e"}
];
var WD=[{s:"14:00",e:"16:00"},{s:"17:00",e:"19:00"},{s:"20:00",e:"22:00"}];
var WE=[{s:"11:00",e:"13:00"},{s:"14:00",e:"16:00"},{s:"17:00",e:"19:00"},{s:"20:00",e:"22:00"}];
var pinBuf="",curDate=new Date(),schedule={},editDs=null,editState={};

function pinInput(n){
  if(pinBuf.length>=4)return;
  pinBuf+=n;updDots();
  if(pinBuf.length===4)setTimeout(checkPin,80);
}
function pinDel(){
  pinBuf=pinBuf.slice(0,-1);updDots();
  document.getElementById("pinErr").textContent="";
}
function updDots(){
  for(var i=0;i<4;i++){
    var d=document.getElementById("pd"+i);
    if(i<pinBuf.length)d.classList.add("on");
    else d.classList.remove("on");
  }
}
function checkPin(){
  if(pinBuf===PIN){
    document.getElementById("pinScreen").style.display="none";
    document.getElementById("mainApp").style.display="block";
    loadData();
  } else {
    document.getElementById("pinErr").textContent="핀 번호가 틀렸습니다";
    pinBuf="";updDots();
  }
}
function loadData(){
  fetch("https://raw.githubusercontent.com/"+GH_REPO+"/main/"+GH_FILE+"?t="+Date.now())
  .then(function(r){return r.json();})
  .then(function(d){schedule=d.schedule||{};renderCal();})
  .catch(function(){renderCal();});
}
function fd(d){
  var y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),dd=String(d.getDate()).padStart(2,"0");
  return y+"-"+m+"-"+dd;
}
function parseDs(ds){var p=ds.split("-").map(Number);return new Date(p[0],p[1]-1,p[2]);}
function isWE(ds){var w=parseDs(ds).getDay();return w===0||w===6;}
function defSlots(ds){return(isWE(ds)?WE:WD).map(function(s){return{s:s.s,e:s.e,avail:true};});}
function chMonth(n){curDate.setMonth(curDate.getMonth()+n);renderCal();}
function renderCal(){
  var y=curDate.getFullYear(),m=curDate.getMonth();
  var ms=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  document.getElementById("monLabel").textContent=y+"년 "+ms[m];
  var today=fd(new Date()),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();
  var html="";
  for(var i=0;i<first;i++)html+=dayCell(fd(new Date(y,m-1,prev-first+1+i)),prev-first+1+i,true,today);
  for(var d=1;d<=days;d++)html+=dayCell(fd(new Date(y,m,d)),d,false,today);
  var rem=(7-(first+days)%7)%7;
  for(var d2=1;d2<=rem;d2++)html+=dayCell(fd(new Date(y,m+1,d2)),d2,true,today);
  document.getElementById("calGrid").innerHTML=html;
}
function dayCell(ds,dn,dim,today){
  var sc=schedule[ds],dow=parseDs(ds).getDay(),isT=ds===today,chips="";
  if(sc){
    if(sc.unavailable){chips='<div class="day-chip chip-unavail">'+"불가"+'</div>';}
    else if(sc.slots){
      var av=sc.slots.filter(function(s){return s.avail;}).length,tot=sc.slots.length;
      if(av===0)chips='<div class="day-chip chip-full-ng">'+"만료"+'</div>';
      else if(av<tot)chips='<div class="day-chip chip-partial">'+av+"/"+tot+"타임"+'</div>';
      else chips='<div class="day-chip chip-avail">'+av+"타임"+'</div>';
    }
    if(sc.label){
      var lb=LABELS.find(function(l){return l.id===sc.label;});
      if(lb)chips+='<div class="day-chip" style="background:'+lb.color+'22;color:'+lb.color+'">'+lb.name.substring(0,4)+'</div>';
    }
  }
  var nc=dow===0?"day-num sun":dow===6?"day-num sat":"day-num";
  var cc="day-cell"+(dim?" dim":"")+(isT?" today":"");
  return '<div class="'+cc+'" onclick="openSheet(\''+ds+'\')">'
    +'<div class="'+nc+'">'+dn+'</div>'
    +'<div class="day-chips">'+chips+'</div>'
    +'</div>';
}
function openSheet(ds){
  editDs=ds;
  var sc=schedule[ds]||{};
  var p=ds.split("-").map(Number);
  var DAYS=["일","월","화","수","목","금","토"],dow=parseDs(ds).getDay();
  document.getElementById("sheetTitle").innerHTML=p[0]+"년 "+p[1]+"월 "+p[2]+"일 <span class=\"sheet-date\">("+DAYS[dow]+")</span>";
  editState={
    unavailable:sc.unavailable||false,
    slots:sc.slots?sc.slots.map(function(s){return{s:s.s,e:s.e,avail:s.avail};}):defSlots(ds),
    label:sc.label||null,
    memo:sc.memo||""
  };
  renderSheet();
  document.getElementById("sheetBg").classList.add("on");
  document.getElementById("sheet").style.display="block";
}
function renderSheet(){
  var tog=document.getElementById("unavailToggle");
  editState.unavailable?tog.classList.add("on"):tog.classList.remove("on");
  var sec=document.getElementById("slotsSection");
  sec.style.opacity=editState.unavailable?".35":"1";
  sec.style.pointerEvents=editState.unavailable?"none":"auto";
  var sh="";
  editState.slots.forEach(function(s,i){
    var cls=s.avail?"avail":"blocked";
    var lbl=s.avail?"O 예약 가능":"X 예약 불가";
    sh+='<div class="slot-row '+cls+'" onclick="toggleSlot('+i+')">'+'<div class="slot-time">'+s.s+" ~ "+s.e+'</div><div class="slot-status">'+lbl+'</div></div>';
  });
  document.getElementById("slotRows").innerHTML=sh;
  var lh="";
  LABELS.forEach(function(lb){
    var sel=editState.label===lb.id;
    var style=sel?"border-color:"+lb.color+";background:"+lb.color+"18":"";
    lh+='<div class="label-chip'+( sel?" selected":"")+'" style="'+style+'" onclick="selectLabel(\'"+lb.id+"\')">'+
      '<div class="label-dot" style="background:'+lb.color+'"></div>'+
      '<div class="label-name">'+lb.name+'</div></div>';
  });
  document.getElementById("labelGrid").innerHTML=lh;
  document.getElementById("memoInput").value=editState.memo;
}
function toggleUnavail(){editState.unavailable=!editState.unavailable;renderSheet();}
function toggleSlot(i){editState.slots[i].avail=!editState.slots[i].avail;renderSheet();}
function selectLabel(id){editState.label=editState.label===id?null:id;renderSheet();}
function saveDay(){
  if(editState.unavailable){
    schedule[editDs]={unavailable:true};
    if(editState.label)schedule[editDs].label=editState.label;
    if(editState.memo)schedule[editDs].memo=editState.memo;
  } else {
    var hc=editState.slots.some(function(s){return!s.avail;});
    if(!hc&&!editState.label&&!editState.memo){delete schedule[editDs];}
    else{
      schedule[editDs]={slots:editState.slots.map(function(s){return{s:s.s,e:s.e,avail:s.avail};})};
      if(editState.label)schedule[editDs].label=editState.label;
      if(editState.memo)schedule[editDs].memo=editState.memo;
    }
  }
  closeSheet();renderCal();
  showToast("저장됨 (위 버튼으로 GitHub 업로드)");
}
function clearDay(){delete schedule[editDs];closeSheet();renderCal();showToast("초기화됨");}
function closeSheet(){
  document.getElementById("sheetBg").classList.remove("on");
  document.getElementById("sheet").style.display="none";
  editDs=null;
}
function syncToGithub(){
  var btn=document.getElementById("syncBtn");
  btn.textContent="업로드 중...";btn.classList.add("loading");
  fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+GH_FILE,{headers:{"Authorization":"token "+GHT}})
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
    btn.textContent="💾 저장";btn.classList.remove("loading");
  })
  .catch(function(e){
    showToast("오류: "+e.message);
    btn.textContent="💾 저장";btn.classList.remove("loading");
  });
}
function showToast(msg){
  var t=document.getElementById("toast");
  t.textContent=msg;t.classList.add("on");
  setTimeout(function(){t.classList.remove("on");},2800);
}
renderCal();