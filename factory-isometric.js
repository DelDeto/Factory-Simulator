/* v5 – Unified isometric factory floor. Reuses existing data, missions & laptop journey. */
const isoZones=[[70,55],[370,55],[670,55],[70,220],[370,220],[670,220],[70,385],[370,385],[670,385],[70,550],[370,550],[670,550]];
mapView=function(){
 const zones=mapStations.map((x,i)=>{
 const [xx,yy]=isoZones[i];
 return '<button class="iso-hotspot '+(i===mapSelection?'active ':'')+(followMode&&followStep===i?'following':'')+'" style="left:'+((xx+130)/980*100).toFixed(2)+'%;top:'+((yy+66)/745*100).toFixed(2)+'%" data-map-zone="'+i+'" aria-label="Khám phá '+esc(x.name)+'" title="'+esc(x.name)+'"><span>'+String(i+1).padStart(2,"0")+'</span></button>';
 }).join('');
 const x=mapStations[mapSelection];
 return '<div class="map-intro"><div><span class="tag">ISOMETRIC FACTORY WORLD · NOVABOOK PRO · v5.0</span><h2>Nhà máy điện tử – sơ đồ isometric</h2><p>Chọn các khu nhà xưởng trên một mặt bằng thống nhất để xem công việc, máy móc, bộ phận phụ trách, KPI, lỗi và bài học.</p></div><div class="map-legend"><span>🟢 Hoạt động giả lập</span><span>🟡 Theo dõi</span><span>🔴 Sự cố</span></div></div>'+
 '<div class="map-layout isometric-layout"><section class="iso-map-card"><div class="iso-map-toolbar"><b>🏭 NOVA ELECTRONICS · FACTORY FLOOR</b><div class="iso-controls"><button class="btn secondary" data-follow-start>🚀 Theo chân laptop</button><button class="btn ghost" data-iso-reset>⌖ Toàn cảnh</button></div></div><div class="iso-map-frame"><img src="assets/isometric-factory.svg" alt="Sơ đồ nhà máy isometric gồm 12 khu: kế hoạch, kho, IQC, SMT, AOI, PCB test, lắp ráp, phần mềm, kiểm tra và đóng gói" draggable="false">'+zones+'</div>'+(followMode?productJourney():'')+'<div class="iso-bottom"><span>◉ Đang chọn: <strong>'+esc(x.name)+'</strong></span><span>Dữ liệu mô phỏng, không phải nhà máy cụ thể</span></div></section>'+mapPanel()+'</div>';
};
document.addEventListener("click",function(e){const b=e.target.closest("button");if(b&&b.hasAttribute("data-iso-reset")&&S.tab==="map3d"){stopFollowTimer();followMode=false;mapSelection=3;mapPane="overview";render()}},true);
const isoPrevShell=shell;
shell=function(content){return isoPrevShell(content).replaceAll("BETA v4.0","BETA v5.0").replace("<h1>Isometric Factory Map</h1>","<h1>Isometric Factory World</h1>")};
render();
