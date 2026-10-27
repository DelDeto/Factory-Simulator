/* v4.2: distinctive machine scenes, animated production flow & laptop journey */
const stationArt=[
{kind:"office",objects:["🖥️","📋","📊"],label:"KẾ HOẠCH & BOM"},
{kind:"warehouse",objects:["📦","📦","🚜"],label:"GIÁ KỆ · FIFO"},
{kind:"iqc",objects:["🔍","🔬","📦"],label:"BÀN KIỂM IQC"},
{kind:"smt",objects:["🦾","⚙️","🔥"],label:"PRINTER · P&P · REFLOW"},
{kind:"aoi",objects:["🔬","📷","🖥️"],label:"SPI · AOI · X-RAY"},
{kind:"pcbtest",objects:["🔌","⚡","📟"],label:"ICT / FCT FIXTURE"},
{kind:"assembly",objects:["🔧","💻","🔩"],label:"LẮP CỤM LINH KIỆN"},
{kind:"final",objects:["💻","🪛","🖥️"],label:"HOÀN THIỆN LAPTOP"},
{kind:"software",objects:["💾","💻","🧩"],label:"FLASH IMAGE"},
{kind:"function",objects:["⌨️","💻","🎧"],label:"FUNCTIONAL TEST"},
{kind:"reliability",objects:["🌡️","🔥","✅"],label:"BURN-IN / OQC"},
{kind:"shipping",objects:["📦","🚚","📋"],label:"PACKING & SHIP"}
];
let followMode=false,followStep=0,followPlaying=false; let followTimer=null;
function stopFollowTimer(){if(followTimer!==null){clearInterval(followTimer);followTimer=null;}followPlaying=false}
function goFollow(i){followStep=Math.max(0,Math.min(11,i));mapSelection=followStep;mapPane="overview";render();}
function artScene(i){
 const a=stationArt[i];return '<div class="art-stage art-'+a.kind+'"><div class="art-top"><b>'+String(i+1).padStart(2,"0")+'</b><span class="art-led '+mapStations[i].status+'"></span></div><div class="art-backdrop"><span class="art-wall"></span><span class="art-pipe"></span></div><div class="art-machines">'+a.objects.map((o,j)=>'<span class="art-machine machine-'+j+'">'+o+'</span>').join("")+'</div><div class="art-belt"><span class="art-belt-track">▰ ▰ ▰ ▰ ▰ ▰</span><span class="art-product">'+(i<3?"📦":i<6?"🟩":i<9?"🔧":"💻")+'</span></div><div class="art-floor-label">'+a.label+'</div></div>';
}
function productJourney(){return '<div class="journey"><div class="journey-title"><b>🎓 THEO CHÂN MỘT CHIẾC LAPTOP</b><button class="btn ghost" data-follow-close>Đóng</button></div><div class="journey-progress"><div style="width:'+((followStep+1)/12*100)+'%"></div></div><div class="journey-body"><div class="journey-asset">'+(followStep<3?"📦":followStep<6?"🟩":followStep<9?"🧰":"💻")+'</div><div><strong>Bước '+(followStep+1)+'/12: '+esc(mapStations[followStep].vi)+'</strong><p><b>Công việc:</b> '+esc(mapStations[followStep].tasks.join(" → "))+'</p><p><b>Bàn giao:</b> '+esc(mapStations[followStep].output)+'</p><p><b>Phòng ban:</b> '+esc(mapStations[followStep].owner)+'</p></div></div><div class="journey-controls"><button class="btn secondary" data-follow-prev '+(followStep===0?"disabled":"")+'>← Trước</button><button class="btn" data-follow-play>'+(followPlaying?"⏸ Tạm dừng":"▶ Tự động")+'</button><button class="btn secondary" data-follow-next '+(followStep===11?"disabled":"")+'>Tiếp →</button></div></div>';}
mapView=function(){
 const cards=mapStations.map((x,i)=>'<button class="factory-tile v42 '+(mapSelection===i?"selected ":"")+x.status+'" data-map-zone="'+i+'" aria-label="Mở khu '+esc(x.name)+'">'+artScene(i)+'<div class="factory-label"><b>'+esc(x.name)+'</b><small>'+esc(x.vi)+'</small></div></button>').join("");
 return '<div class="map-intro"><div><span class="tag">FACTORY WORLD · NOVABOOK PRO · v4.2</span><h2>Khám phá nhà máy sản xuất laptop</h2><p>12 khu vực với thiết bị minh họa riêng, băng chuyền hoạt động và hành trình sản phẩm. Chọn trạm để học chức năng, lỗi, KPI và nhiệm vụ.</p></div><div class="map-legend"><span>🟢 Hoạt động</span><span>🟡 Theo dõi</span><span>🔴 Sự cố</span></div></div>'+
 '<div class="map-layout"><div class="map-world v41 v42-world"><div class="map-world-top"><b>🏭 NOVA ELECTRONICS · FACTORY FLOOR</b><button class="btn secondary" data-follow-start>🚀 Theo chân laptop</button></div><div class="factory-flow moving-flow"><span>📦 MATERIALS</span><i>➜</i><span>🦾 SMT</span><i>➜</i><span>🔧 ASSEMBLY</span><i>➜</i><span>🧪 TEST</span><i>➜</i><span>🚚 SHIPPING</span></div>'+(followMode?productJourney():'')+'<div class="factory-scene-grid">'+cards+'</div><div class="map-world-bottom">Hình minh họa phục vụ đào tạo, không đại diện quy trình độc quyền của hãng</div></div>'+mapPanel()+'</div>';
};
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b||S.tab!=="map3d")return;
 if(b.hasAttribute("data-follow-start")){stopFollowTimer();followMode=true;goFollow(0)}
 if(b.hasAttribute("data-follow-close")){stopFollowTimer();followMode=false;render()}
 if(b.hasAttribute("data-follow-next")){stopFollowTimer();goFollow(followStep+1)}
 if(b.hasAttribute("data-follow-prev")){stopFollowTimer();goFollow(followStep-1)}
 if(b.hasAttribute("data-follow-play")){
  if(followPlaying){stopFollowTimer();render();return}
  if(followStep===11)followStep=0;
  followPlaying=true;render();
  followTimer=setInterval(()=>{if(S.tab!=="map3d"||!followMode||followStep>=11){stopFollowTimer();render();return}goFollow(followStep+1)},2500);
 }
},true);
render();
