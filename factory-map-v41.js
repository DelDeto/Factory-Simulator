/* v4.1: richer illustrated factory zones and compact education panel. Preserves v4 data/actions. */
const factoryScenes=[
["📋","▤","▥"],["📦","▣","▤"],["🔍","▥","⚙"],["🦾","⚙","⚙"],["🔬","▤","◉"],["⚡","▣","↯"],["🔧","⚙","▣"],["💻","▤","⚙"],["🧩","▥","▤"],["🧪","▤","◉"],["🌡️","▣","◉"],["🚚","▣","▥"]
];
function buildingScene(i){
 const [ic,m1,m2]=factoryScenes[i];
 return '<div class="scene-sky"><span class="scene-number">'+String(i+1).padStart(2,"0")+'</span><span class="scene-beacon '+(mapStations[i].status==="alert"?"red":mapStations[i].status==="watch"?"amber":"green")+'"></span></div>'+
 '<div class="scene-shell"><div class="scene-back"><span class="scene-window"></span><span class="scene-window"></span><span class="scene-window"></span></div><div class="scene-equipment"><span class="scene-machine first">'+m1+'</span><span class="scene-conveyor">▰ ▰ ▰</span><span class="scene-machine second">'+m2+'</span></div><div class="scene-floor"><span class="scene-worker">👷</span><span class="scene-item">'+ic+'</span></div></div>';
}
mapPanel=function(){
 const x=mapStations[mapSelection],p=mapPane;
 const lis=(items)=>'<div class="map-info-list">'+items.filter(Boolean).map(v=>'<div class="map-info-row"><span class="map-info-dot"></span><span>'+esc(v)+'</span></div>').join("")+'</div>';
 let inner="";
 if(p==="overview")inner='<div class="map-mini-grid"><div><small>ĐẦU VÀO</small><p>'+esc(x.input)+'</p></div><div><small>ĐẦU RA</small><p>'+esc(x.output)+'</p></div></div><h3>👥 Đầu mối phối hợp</h3><p>'+esc(x.collaboration)+'</p>';
 if(p==="tasks")inner='<h3>📋 Tác vụ tại trạm</h3>'+lis(x.tasks);
 if(p==="kpi")inner='<h3>📊 Chỉ số cần quan sát</h3>'+lis(x.kpis)+'<p class="map-fineprint">KPI mang tính học tập, không phải dữ liệu thời gian thực.</p>';
 if(p==="defects")inner='<h3>⚠️ Các lỗi thường gặp</h3>'+lis(x.defects);
 if(p==="learn")inner='<h3>🎓 Chủ đề học tập</h3>'+lis([x.lessons[0],x.lessons[1],...x.tasks.slice(0,2)]);
 return '<section class="map-details panel"><div class="map-details-head"><span class="tag">KHU '+String(mapSelection+1).padStart(2,"0")+'/12</span><span class="map-status '+x.status+'">'+(x.status==="alert"?"● SỰ CỐ":x.status==="watch"?"● THEO DÕI":"● ĐANG HOẠT ĐỘNG")+'</span></div><h2>'+x.icon+' '+esc(x.name)+'</h2><p class="map-subtitle">'+esc(x.vi)+' · '+esc(x.owner)+'</p><div class="map-tabbar">'+[["overview","Tổng quan"],["tasks","Tác vụ"],["kpi","KPI"],["defects","Lỗi"],["learn","Bài học"]].map(([id,label])=>'<button class="'+(p===id?"active":"")+'" data-map-tab="'+id+'">'+label+'</button>').join("")+'</div><div class="map-detail-content">'+inner+'</div><div class="map-actions"><button class="btn" data-map-mission>🎯 Làm nhiệm vụ</button><button class="btn secondary" data-map-process>📖 Quy trình</button><button class="btn ghost" data-map-roles>👷 Nghề nghiệp</button></div></section>';
};
mapView=function(){
 const chips=mapStations.map((x,i)=>'<button class="factory-tile '+(mapSelection===i?"selected ":"")+x.status+'" data-map-zone="'+i+'" aria-label="Mở khu '+esc(x.name)+'">'+buildingScene(i)+'<div class="factory-label"><b>'+esc(x.name)+'</b><small>'+esc(x.vi)+'</small></div></button>').join("");
 return '<div class="map-intro"><div><span class="tag">FACTORY WORLD · NOVABOOK PRO</span><h2>Nhà máy sản xuất laptop</h2><p>Khám phá 12 trạm từ kế hoạch và vật tư đến sản xuất, kiểm tra và xuất hàng. Chạm vào từng trạm để học công việc và giải quyết sự cố.</p></div><div class="map-legend"><span>🟢 Hoạt động</span><span>🟡 Theo dõi</span><span>🔴 Sự cố</span></div></div>'+
 '<div class="map-layout"><div class="map-world v41"><div class="map-world-top"><b>🏭 NOVA ELECTRONICS · FACTORY FLOOR</b><span>INTERACTIVE TRAINING MAP</span></div><div class="factory-flow"><span>📦 INCOMING</span><i>→</i><span>🦾 SMT / PCBA</span><i>→</i><span>🔧 ASSEMBLY</span><i>→</i><span>🧪 TEST</span><i>→</i><span>🚚 SHIP</span></div><div class="factory-scene-grid">'+chips+'</div><div class="map-world-bottom">Mô phỏng minh họa · không phải sơ đồ mặt bằng thực tế của một thương hiệu</div></div>'+mapPanel()+'</div>';
};
render();
