/* Factory Engineer v2.0 Phase 2 – process learning and role academy extension */
const processV2=[
["📋","Kế hoạch & BOM","PMC / NPI","Đơn hàng, bản thiết kế, BOM","Kế hoạch vật tư và lịch sản xuất","Xác nhận phiên bản BOM; kiểm tồn kho, công suất, lịch giao; chốt model và kế hoạch pilot/mass production.","Sai BOM; thiếu linh kiện","Plan attainment / shortage","PMC ↔ NPI ↔ Purchasing ↔ Production"],
["🚛","Nhận vật tư","Warehouse / Purchasing","Linh kiện và phiếu giao hàng","Vật tư được định danh, lưu kho","Kiểm số lượng và mã vật tư; quét lot; kiểm nhãn ESD; phân khu, cập nhật tồn kho.","Sai mã; thiếu số lượng; hư bao bì","Inventory accuracy","Warehouse ↔ Purchasing ↔ IQC"],
["🔎","IQC đầu vào","IQC / SQE","Lô linh kiện, tiêu chuẩn kiểm tra","Lô được chấp nhận hoặc HOLD","Lấy mẫu theo kế hoạch; kiểm ngoại quan, thông số, chứng từ; xử lý NG và truy xuất lot.","Chân connector cong; sai thông số","Incoming acceptance rate","IQC ↔ SQE ↔ Warehouse ↔ PMC"],
["🦾","SMT / PCBA","Production / PE / ME","PCB, solder paste, chip SMD, chương trình máy","PCBA đã hàn linh kiện","Chuẩn bị ESD; in kem hàn; kiểm SPI; gắn chip bằng pick & place; reflow; lưu log và lot.","Solder bridge; missing component; tombstone","SMT FPY / downtime","Production ↔ PE ↔ ME ↔ Quality"],
["🔬","AOI / X-ray","Quality / Production / PE","PCBA sau in/hàn","Lỗi được phát hiện, phân loại và cách ly","Kiểm ảnh SPI/AOI, kiểm mối hàn bằng X-ray khi cần; xác nhận false call, gắn mã lỗi và phản hồi.","Bridge; offset; mối hàn BGA nghi vấn","Defect rate / escape rate","Quality ↔ PE ↔ ME"],
["⚡","Mainboard Test","TE / Production","PCBA được phê duyệt để kiểm","Mainboard PASS hoặc NG có log","Nạp firmware cần thiết; ICT/FCT theo thiết kế; xác nhận nguồn, boot và tín hiệu; phân tích lỗi.","No power; boot fail; fixture false fail","Test FPY / retest rate","TE ↔ Production ↔ QE"],
["🔧","Lắp ráp cơ khí","Production / PE / IE","Mainboard, vỏ, tản nhiệt, màn hình, pin","Laptop lắp cơ bản","Lắp mainboard; dán vật liệu nhiệt; lắp cáp, pin, màn hình; siết vít theo torque; quét serial.","Thiếu vít; lỏng cáp; trầy xước","Cycle time / assembly FPY","Production ↔ PE ↔ IE ↔ Quality"],
["💻","Lắp ráp hoàn thiện","Production / Quality","Laptop lắp cơ bản, linh kiện bổ sung","Laptop cấu hình hoàn chỉnh","Lắp hoàn thiện cover, bàn phím, trackpad, anten; kiểm ngoại quan và truy vết cấu hình.","Sai cấu hình; hở khe; thiếu linh kiện","Assembly yield","Production ↔ PE ↔ Quality"],
["🧩","Nạp phần mềm","TE / IT / Production","Laptop phần cứng hoàn thiện","Máy có image và cấu hình đúng","Flash image, driver, firmware; đối chiếu phiên bản, serial và cấu hình theo model.","Flash fail; version mismatch","Provisioning FPY","TE ↔ IT ↔ Production"],
["🧪","Final Functional Test","TE / Production / QE","Máy đã nạp phần mềm","Máy đạt / không đạt bộ kiểm tra","Test màn hình, bàn phím, trackpad, Wi-Fi, camera, loa, pin, sạc và I/O; lưu test log.","No display; Wi-Fi fail; battery fail","Final test FPY","TE ↔ Production ↔ QE ↔ PE"],
["🌡️","Reliability / OQC","Quality / Reliability","Thành phẩm và lịch sử test","Quyết định release / hold lô","Chạy độ tin cậy theo kế hoạch mẫu, kiểm ngoại quan cuối, rà soát nhãn, hồ sơ và quyết định chất lượng.","Overheat; lỗi gián đoạn; cosmetic NG","OQC acceptance / reliability fail","QE ↔ Reliability ↔ TE ↔ Production"],
["📦","Đóng gói & xuất hàng","Packing / Logistics / PMC","Máy đạt kiểm tra, phụ kiện và đơn hàng","Kiện hàng và chứng từ giao nhận","Quét serial/carton; đối chiếu cấu hình và phụ kiện; đóng gói, pallet, booking vận tải.","Sai nhãn; thiếu phụ kiện; giao trễ","OTD / packing accuracy","Packing ↔ Logistics ↔ PMC"]
];
let processChosen=3;
let processQuizAnswer=null;
const quizV2=[
["Bộ phận nào chủ trì xử lý thiếu vật tư trước khi chạy chuyền?",["PMC phối hợp Warehouse và Purchasing","Chỉ TE","Chỉ OQC"],0],
["Lỗi solder bridge thường được phát hiện trong khu vực nào?",["Đóng gói","AOI sau công đoạn hàn SMT","Xuất kho"],1],
["Khi test xuất hiện No Power, bước phù hợp là gì?",["Xuất hàng vì chưa thấy lỗi ngoài vỏ","Xóa log","TE xác nhận triệu chứng, kiểm fixture và thu thập log"],2],
["Ai có thể quyết định release lô bị HOLD theo hệ thống chất lượng giả lập?",["Người vận chuyển","Người có thẩm quyền Quality theo quy trình","Bất cứ ai đang trực"],1]
];
let quizV2Index=0,quizV2Correct=0,quizV2Feedback=null;
function processViewV2(){
 const p=processV2[processChosen];
 return '<div class="callout"><b>FACTORY TOUR · NOVABOOK PRO</b> — Học luồng sản xuất 12 công đoạn, người phụ trách, dữ liệu bàn giao và KPI. Quy trình mang tính giáo dục, không phải quy trình nội bộ độc quyền của hãng.</div>'+
 '<div class="processrail">'+processV2.map((x,i)=>'<button data-process="'+i+'" class="'+(processChosen===i?'chosen':'')+'"><b>'+(i+1)+'. '+x[0]+'</b><span>'+esc(x[1])+'</span></button>').join('')+'</div>'+
 '<div class="grid2"><div class="panel"><span class="tag">CÔNG ĐOẠN '+(processChosen+1)+'/12</span><h2>'+p[0]+' '+esc(p[1])+'</h2><p><b>Đầu vào:</b> '+esc(p[3])+'</p><p><b>Đầu ra / bàn giao:</b> '+esc(p[4])+'</p><h3>📋 Tác vụ cụ thể</h3><p>'+esc(p[5])+'</p><h3>🚨 Lỗi thường gặp</h3><p>'+esc(p[6])+'</p></div><div class="panel"><h3>👥 Bộ phận chịu trách nhiệm</h3><p>'+esc(p[2])+'</p><h3>🔁 Phối hợp liên phòng ban</h3><p>'+esc(p[8])+'</p><h3>📈 KPI liên quan</h3><p>'+esc(p[7])+'</p><div class="callout">Quan sát công đoạn → phân tích dữ liệu → báo cho đúng nhóm → thực hiện theo SOP → xác minh chất lượng bàn giao.</div><div class="btnrow"><button class="btn ghost" data-process="'+Math.max(0,processChosen-1)+'" '+(processChosen===0?'disabled':'')+'>← Trước</button><button class="btn" data-process="'+Math.min(11,processChosen+1)+'" '+(processChosen===11?'disabled':'')+'>Tiếp →</button></div></div></div>'+
 '<div class="section"><h2>🎯 Kiểm tra hiểu quy trình</h2></div>'+quizPanelV2();
}
function quizPanelV2(){
 const q=quizV2[quizV2Index];
 return '<div class="panel"><span class="tag">CÂU '+(quizV2Index+1)+'/'+quizV2.length+'</span><h3 style="margin-top:15px">'+esc(q[0])+'</h3>'+q[1].map((x,i)=>'<button class="choice" data-process-answer="'+i+'" '+(quizV2Feedback!==null?'disabled':'')+'>'+esc(x)+'</button>').join('')+
 (quizV2Feedback!==null?'<div class="callout">'+(quizV2Feedback?'✅ Chính xác.':'🔎 Chưa chính xác. Đáp án phù hợp: '+esc(q[1][q[2]])+'.')+'</div><button class="btn" data-process-next>'+(quizV2Index===quizV2.length-1?'Xem kết quả':'Tiếp tục →')+'</button>':'')+'</div>';
}
function roleExtendedV2(){
 let extra={Production:['Đọc kế hoạch và SOP, kiểm manpower','Theo dõi output, WIP, NG theo giờ','Escalate downtime và phối hợp PE/ME/QE'],Warehouse:['Nhận/xuất vật tư đúng lot','Đối chiếu số lượng, FIFO và truy xuất','Báo thiếu hàng cho PMC'],IQC:['Lấy mẫu incoming theo tiêu chuẩn','Phân loại OK/NG/HOLD và truy xuất lot','Phối hợp SQE xử lý nhà cung cấp'],Logistics:['Chuẩn bị chứng từ và booking','Đối chiếu serial, carton, pallet','Theo dõi giao hàng OTD'],Purchasing:['Theo dõi PO và ETA vật tư','Làm việc nhà cung cấp khi shortage','Đồng bộ với PMC và IQC']};
 return '<div class="callout"><b>CAREER ACADEMY v2.0</b> · Vai trò kỹ sư và bộ phận vận hành được xem theo nhiệm vụ hằng ngày, công cụ, điểm bàn giao và phạm vi trách nhiệm. Phân bậc E1–E4 và quản lý là hai ngạch độc lập.</div>'+oldAcademyV2()+'<div class="section"><h2>Nhóm vận hành và hỗ trợ</h2></div><div class="rolegrid">'+Object.entries(extra).map(([k,v])=>'<div class="panel"><h3>'+k+'</h3><ul class="tasklist">'+v.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></div>').join('')+'</div>';
}
nav.splice(1,0,['process','🗺️ Quy trình']);
const oldAcademyV2=academy;
academy=function(){return roleExtendedV2()};
const oldFactoryV2=factory;
factory=function(){return '<div class="callout"><b>🗺️ MỚI: FACTORY TOUR v2.0</b> · Khám phá chi tiết 12 công đoạn laptop, ai làm gì, lỗi và KPI. <button class="btn secondary" data-nav="process">Mở quy trình →</button></div>'+oldFactoryV2()};
const oldShellV2=shell;
shell=function(content){return oldShellV2(content).replace('<h1>undefined</h1>','<h1>Factory Tour · Quy trình laptop</h1>').replaceAll('BETA 1.0','BETA v2.0')};
const previousRenderV2=render;
render=function(){if(!S.mission && S.tab==='process'){$('#app').innerHTML=shell(processViewV2());return;}previousRenderV2()};
document.addEventListener('click',function(e){
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-process')){processChosen=Number(b.dataset.process);render();return}
 if(b.hasAttribute('data-process-answer') && quizV2Feedback===null){quizV2Feedback=Number(b.dataset.processAnswer)===quizV2[quizV2Index][2];if(quizV2Feedback)quizV2Correct++;render();return}
 if(b.hasAttribute('data-process-next')){if(quizV2Index===quizV2.length-1){S.notice='Factory Tour: '+quizV2Correct+'/'+quizV2.length+' câu đúng. Có thể ôn tập bất kỳ công đoạn nào.';quizV2Index=0;quizV2Correct=0;}else quizV2Index++;quizV2Feedback=null;render();return}
},true);
render();
