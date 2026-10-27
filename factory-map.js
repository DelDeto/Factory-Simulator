/* Factory Engineer v4 – Isometric Factory Map, data sourced from processV2. */
nav.splice(1,0,["map3d","🏭 Bản đồ 3D"]);
let mapSelection=3, mapPane="overview";
const mapNames=["Planning Office","Material Warehouse","Incoming QC","SMT Production","AOI / X-Ray","PCB Testing","Mechanical Assembly","Final Assembly","Software Lab","Functional Test","Reliability & OQC","Packing & Shipping"];
const mapIcons=["📋","📦","🔎","🦾","🔬","⚡","🔧","💻","🧩","🧪","🌡️","🚚"];
const mapLessons=[
["BOM & Capacity","PMC · Material Planning"],["Lot Traceability","FIFO / ESD / Barcode"],["Sampling & HOLD","IQC → SQE"],["SMT / Reflow","SPI · Pareto · 5 Why"],["Defect Library","AOI · False Calls"],["Fault Isolation","TE · No Power"],["Torque & SOP","PE · IE · Assembly"],["Assembly Quality","IPQC · Visual Check"],["Software Provisioning","Firmware · Version"],["Functional Test","TE · Test Coverage"],["Reliability & Release","OQC · Quality Gate"],["On-Time Delivery","PMC · Logistics"]
];
const mapMissions={0:"planning",1:"supplier",2:"supplier",3:"smt",4:"smt",5:"boot",6:"balance",7:"flow",8:"test",9:"boot",10:"spc",11:"planning"};
const mapStatuses=["ready","ready","ready","alert","watch","ready","ready","ready","ready","ready","watch","ready"];
const mapStations=processV2.map((p,i)=>({
 id:"zone-"+i,name:mapNames[i],icon:mapIcons[i],status:mapStatuses[i],
 vi:p[1],owner:p[2],input:p[3],output:p[4],tasks:p[5].split(";").map(s=>s.trim()),
 defects:p[6].split(";").map(s=>s.trim()),kpis:p[7].split("/").map(s=>s.trim()),
 collaboration:p[8],lessons:mapLessons[i],mission:mapMissions[i]
}));
function mapGoMission(){
 const x=mapStations[mapSelection],id=x.mission;
 if(["smt","boot","supplier"].includes(id)){incidentId=id;resetIncident();update({tab:"incidents",mission:null});return}
 if(modules.some(m=>m.id===id)){start(id);return}
 update({tab:"missions",mission:null});
}
function mapPanel(){
 const x=mapStations[mapSelection],p=mapPane;
 const block=(name,items)=>'<h3>'+name+'</h3><ul class="tasklist">'+items.map(v=>'<li>'+esc(v)+'</li>').join("")+'</ul>';
 let content="";
 if(p==="overview")content='<p><b>Chức năng:</b> '+esc(x.vi)+'</p><p><b>Đầu vào:</b> '+esc(x.input)+'</p><p><b>Đầu ra:</b> '+esc(x.output)+'</p><p><b>Bộ phận:</b> '+esc(x.owner)+'</p><p><b>Liên phòng ban:</b> '+esc(x.collaboration)+'</p>';
 if(p==="tasks")content=block("Các tác vụ trong công đoạn",x.tasks);
 if(p==="kpi")content=block("KPI cần theo dõi",x.kpis)+'<div class="callout">Chỉ số được giải thích trong các bài học; đây không phải KPI trực tiếp từ nhà máy thật.</div>';
 if(p==="defects")content=block("Lỗi điển hình cần nhận diện",x.defects);
 if(p==="learn")content='<div class="callout"><b>📚 '+esc(x.lessons[0])+'</b><p>'+esc(x.lessons[1])+'</p></div>'+block("Nội dung sẽ được thực hành",[x.vi,...x.tasks.slice(0,2),x.collaboration]);
 return '<section class="map-details panel"><div class="map-details-head"><span class="tag">ZONE '+String(mapSelection+1).padStart(2,"0")+' / 12</span><span class="tag">'+(x.status==="alert"?"🔴 Cảnh báo":x.status==="watch"?"🟡 Theo dõi":"🟢 Mô phỏng")+'</span></div><h2>'+x.icon+' '+esc(x.name)+'</h2><p>'+esc(x.vi)+'</p><div class="map-tabbar">'+[["overview","Tổng quan"],["tasks","Tác vụ"],["kpi","KPI"],["defects","Lỗi"],["learn","Bài học"]].map(([id,label])=>'<button class="'+(p===id?"active":"")+'" data-map-tab="'+id+'">'+label+'</button>').join("")+'</div><div class="map-detail-content">'+content+'</div><div class="map-actions"><button class="btn" data-map-mission>🎯 Vào Mission</button><button class="btn secondary" data-map-process>📖 Xem quy trình</button><button class="btn ghost" data-map-roles>👷 Xem nghề</button></div></section>';
}
function mapView(){
 return '<div class="map-intro"><div><span class="tag">FACTORY WORLD · NOVABOOK PRO</span><h2>Khám phá nhà máy</h2><p>Bấm vào một khu vực để xem tác vụ, lỗi, KPI, bài học và các vị trí phối hợp. Bản đồ 2.5D minh họa, không phải mặt bằng thực tế của Apple hoặc Foxconn.</p></div><div class="map-legend"><span>🟢 Hoạt động mô phỏng</span><span>🟡 Cần theo dõi</span><span>🔴 Sự cố bài học</span></div></div>'+
 '<div class="map-layout"><div class="map-world"><div class="map-world-top"><b>🏭 NOVA ELECTRONICS · FLOOR 01</b><span>12 KHU VỰC · CHỌN ĐỂ KHÁM PHÁ</span></div><div class="map-road">INCOMING MATERIALS <span>→</span> SMT & ASSEMBLY <span>→</span> SHIPPING</div><div class="map-canvas">'+mapStations.map((x,i)=>'<button class="map-building '+(mapSelection===i?"selected":"")+' '+(x.status==="alert"?"map-alert":"")+'" data-map-zone="'+i+'" aria-label="'+esc(x.name)+'"><span class="map-roof"><span class="map-machinery">'+x.icon+'</span><span class="map-unit">'+String(i+1).padStart(2,"0")+'</span></span><span class="map-building-name">'+esc(x.name)+'</span><span class="map-building-owner">'+esc(x.owner)+'</span></button>').join("")+'</div><div class="map-world-bottom">▰ NOVABOOK PRO · ELECTRONICS MANUFACTURING LEARNING SIMULATOR</div></div>'+mapPanel()+'</div>';
}
const mapOldRender=render;
render=function(){if(!S.mission&&S.tab==="map3d"){$("#app").innerHTML=shell(mapView());return;}mapOldRender()};
const mapOldShell=shell;
shell=function(content){return mapOldShell(content).replaceAll("BETA v3.0","BETA v4.0").replace("<h1>undefined</h1>","<h1>Isometric Factory Map</h1>")};
const mapOldFactory=factory;
factory=function(){return '<div class="callout"><b>🏭 MỚI: FACTORY MAP 2.5D</b> · Nhấp vào 12 khu sản xuất để xem tác vụ, lỗi, KPI, bài học và Mission. <button class="btn secondary" data-nav="map3d">Mở bản đồ tương tác →</button></div>'+mapOldFactory()};
document.addEventListener("click",function(e){
 const b=e.target.closest("button");if(!b||S.tab!=="map3d"||S.mission)return;
 if(b.hasAttribute("data-map-zone")){mapSelection=Number(b.dataset.mapZone);mapPane="overview";render();return}
 if(b.hasAttribute("data-map-tab")){mapPane=b.dataset.mapTab;render();return}
 if(b.hasAttribute("data-map-process")){processChosen=mapSelection;update({tab:"process"});return}
 if(b.hasAttribute("data-map-roles")){update({tab:"academy"});return}
 if(b.hasAttribute("data-map-mission")){mapGoMission();return}
},true);
render();
