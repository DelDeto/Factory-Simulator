/* Factory campus v6: interactive image map, all learning data re-used. */
const campusRegions=[[13,18,25,15],[39,8,29,22],[72,19,26,17],[1,34,37,20],[39,34,25,19],[69,35,30,20],[1,55,35,18],[38,54,29,18],[69,55,30,18],[1,73,34,17],[37,74,30,16],[69,74,30,16]];
mapView=function(){
 const selected=mapStations[mapSelection];
 const areas=mapStations.map((st,i)=>{const a=campusRegions[i];return '<button class="campus-zone '+(i===mapSelection?'selected':'')+'" data-map-zone="'+i+'" style="left:'+a[0]+'%;top:'+a[1]+'%;width:'+a[2]+'%;height:'+a[3]+'%" aria-label="'+esc(st.name)+'"><span>'+String(i+1).padStart(2,'0')+'</span></button>'}).join('');
 return '<div class="map-intro"><div><span class="tag">ISOMETRIC FACTORY CAMPUS · V6</span><h2>Khám phá nhà máy sản xuất laptop</h2><p>Chạm vào khu xưởng để xem tác vụ, KPI, lỗi, bài học và nhiệm vụ kỹ sư.</p></div></div>'+
 '<div class="map-layout campus-layout"><section class="campus-card"><div class="campus-head"><b>NOVA ELECTRONICS · FACTORY FLOOR</b><div class="iso-controls"><button class="btn secondary" data-follow-start>Theo chân laptop</button><button class="btn ghost" data-iso-reset>Toàn cảnh</button></div></div><div class="campus-image"><img src="assets/factory-campus-isometric.png" alt="Bản đồ nhà máy isometric với 12 khu sản xuất laptop">'+areas+'</div>'+(followMode?productJourney():'')+'<div class="iso-bottom">Khu đang chọn: '+esc(selected.name)+'</div></section>'+mapPanel()+'</div>';
};
const olderShell=shell;
shell=function(content){return olderShell(content).replace('BETA v5.0','BETA v6.0')};
render();
