/* v7 Production Line Lab – isolated simulation, no backend. */
nav.splice(2,0,["production","⚙️ Dây chuyền"]);
let lineMode="smt",lineRun=false,lineFault=false,lineTime=0,lineGood=0,lineReject=0,linePos=0,lineSelected=0,lineClock=null;
const lineDefs={
 smt:{name:"SMT · PCBA",input:"PCB trần",output:"PCBA",owner:"PE / ME / QE / Production",steps:[
 ["Solder Printer","In kem hàn đúng stencil, kiểm căn chỉnh.","PE"],["SPI","Kiểm thể tích, vị trí kem hàn; cảnh báo sai lệch.","QE / PE"],["Pick & Place","Gắn linh kiện SMD theo chương trình và feeder.","ME / PE"],["Reflow","Gia nhiệt theo profile đã được xác nhận.","PE / ME"],["AOI","Phát hiện bridge, missing, offset; xác nhận NG.","QE / PE"]]},
 assembly:{name:"Assembly · Laptop",input:"PCBA đạt kiểm",output:"Laptop lắp ráp",owner:"Production / PE / IE",steps:[
 ["Kitting","Cấp đủ linh kiện, xác nhận BOM/serial.","Warehouse / PMC"],["Mainboard","Lắp bo mạch vào chassis.","Production"],["Thermal","Lắp tản nhiệt và vật liệu nhiệt.","PE"],["Display & Cables","Đấu cáp, pin, màn hình theo WI.","Production / PE"],["Torque Check","Xác nhận lực siết và ngoại quan.","Quality / IE"]]},
 test:{name:"Final Functional Test",input:"Laptop hoàn thiện",output:"Máy PASS/NG",owner:"TE / QE / Production",steps:[
 ["Provision","Kiểm firmware và cấu hình.","TE"],["Power & Boot","Xác nhận nguồn và quá trình khởi động.","TE"],["Display / Input","Kiểm màn hình, phím, trackpad.","Production / TE"],["Wi-Fi & I/O","Kiểm kết nối và cổng giao tiếp.","TE"],["Quality Gate","Phân loại, giữ NG và lưu test log.","QE"]]}
};
const lineDef=()=>lineDefs[lineMode];
const lineFmt=n=>Math.round(n*10)/10;
function lineStop(){if(lineClock!==null){clearInterval(lineClock);lineClock=null;}lineRun=false;}
function lineReset(){lineStop();lineTime=0;lineGood=0;lineReject=0;linePos=0;lineFault=false;lineSelected=0;}
function lineTick(){if(S.tab!=="production"){lineStop();return;}if(lineFault)return;lineTime++;linePos=(linePos+1)%100;if(linePos===0){if((lineGood+lineReject+1)%12===0)lineReject++;else lineGood++;}render();}
function lineLayout(){
 const d=lineDef(),total=lineGood+lineReject,yieldPct=total?lineFmt(lineGood/total*100):100;
 return '<div class="line-heading"><div><span class="tag">PRODUCTION LINE SIMULATOR · v7.0</span><h2>'+esc(d.name)+'</h2><p>Quan sát vật tư đi qua máy, mô phỏng dừng máy và học vai trò kỹ sư trong từng công đoạn.</p></div><span class="tag">'+(lineFault?"🔴 FAULT":lineRun?"🟢 RUNNING":"⏸ PAUSED")+'</span></div>'+
 '<div class="line-switch">'+Object.keys(lineDefs).map(k=>'<button class="btn '+(k===lineMode?'':'secondary')+'" data-line-select="'+k+'">'+esc(lineDefs[k].name)+'</button>').join('')+'</div>'+
 '<div class="line-stats">'+[['Good output',lineGood],['NG',lineReject],['FPY giả lập',yieldPct+"%"],['Simulation time',lineTime+" s"]].map(a=>'<div><small>'+a[0]+'</small><strong>'+a[1]+'</strong></div>').join('')+'</div>'+
 '<div class="line-scene"><div class="line-path"><span>IN: '+esc(d.input)+'</span><span>⬇</span><span>OUT: '+esc(d.output)+'</span></div><div class="line-machines">'+d.steps.map((step,i)=>'<button class="line-machine '+(lineSelected===i?'selected':'')+'" data-line-machine="'+i+'"><span class="line-machine-icon">'+(["🖨️","🔬","🦾","🔥","📷"][i])+'</span><b>'+(i+1)+'. '+esc(step[0])+'</b><small>'+esc(step[2])+'</small></button>').join('<span class="line-arrow">➜</span>')+'</div><div class="line-belt"><div class="line-belt-rollers"></div><span class="line-board" style="left:'+linePos+'%">'+(lineMode==="smt"?"🟩":"💻")+'</span></div><div class="line-timeline"><span>Vật tư</span><span>Quy trình</span><span>Kiểm tra</span></div></div>'+
 '<div class="line-actions"><button class="btn" data-line-play>'+(lineRun?'⏸ Dừng':'▶ Chạy dây chuyền')+'</button><button class="btn secondary" data-line-fault>⚠️ Phát sinh sự cố</button><button class="btn ghost" data-line-reset>↻ Reset ca</button><button class="btn secondary" data-nav="map3d">🏭 Về bản đồ</button></div>'+
 (lineFault?'<div class="callout warnbox"><b>Máy dừng – chất lượng cần kiểm soát</b><p>Cách ly WIP nghi vấn, gọi đúng PE/ME/QE, điều tra theo dữ liệu trước khi cho phép chạy tiếp.</p><button class="btn" data-line-recover>✓ Xác nhận xử lý giả lập & khởi động lại</button><button class="btn secondary" data-nav="incidents">Mở Incident Lab →</button></div>':'')+
 '<div class="grid2 line-learning"><div class="panel"><h3>🔧 '+esc(d.steps[lineSelected][0])+'</h3><p>'+esc(d.steps[lineSelected][1])+'</p><p><b>Chịu trách nhiệm:</b> '+esc(d.steps[lineSelected][2])+'</p><button class="btn secondary" data-line-lesson>📖 Học công đoạn này</button></div><div class="panel"><h3>Phối hợp & nhiệm vụ</h3><p>'+esc(d.owner)+'</p><p>Giải quyết sự cố bằng log, 5 Why và kiểm chứng hiệu quả theo tiêu chuẩn đã phê duyệt.</p><button class="btn" data-line-mission>🎯 Mission liên quan</button></div></div><p class="small">Dữ liệu và tốc độ chỉ mang tính mô phỏng đào tạo. Chưa phải digital twin hoặc đo lường nhà máy thực.</p>';
}
const oldLineRender=render;
render=function(){if(!S.mission&&S.tab==="production"){$("#app").innerHTML=shell(lineLayout());return;}oldLineRender();};
const oldLineFactory=factory;
factory=function(){return '<div class="callout"><b>⚙️ V7 – DÂY CHUYỀN CHUYỂN ĐỘNG</b> · Quan sát PCB qua máy, xử lý dừng máy và KPI. <button class="btn secondary" data-nav="production">Vào dây chuyền →</button></div>'+oldLineFactory();};
const oldLineShell=shell;
shell=function(content){return oldLineShell(content).replace('BETA v6.0','BETA v7.0').replace('<h1>undefined</h1>','<h1>Production Line Simulator</h1>');};
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b||S.tab!=="production"||S.mission)return;
 if(b.hasAttribute("data-line-select")){lineReset();lineMode=b.dataset.lineSelect;render();return;}
 if(b.hasAttribute("data-line-play")){if(lineFault)return;if(lineRun){lineStop()}else{lineRun=true;lineClock=setInterval(lineTick,160)}render();return;}
 if(b.hasAttribute("data-line-machine")){lineSelected=Number(b.dataset.lineMachine);render();return;}
 if(b.hasAttribute("data-line-fault")){lineStop();lineFault=true;render();return;}
 if(b.hasAttribute("data-line-recover")){lineFault=false;lineRun=false;render();return;}
 if(b.hasAttribute("data-line-reset")){lineReset();render();return;}
 if(b.hasAttribute("data-line-lesson")){processChosen=lineMode==="smt"?3:lineMode==="assembly"?6:9;update({tab:"process"});return;}
 if(b.hasAttribute("data-line-mission")){incidentId=lineMode==="smt"?"smt":"boot";resetIncident();update({tab:"incidents"});return;}
},true);
render();
