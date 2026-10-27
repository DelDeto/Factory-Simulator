/* Factory 3D v8.0.1 – legacy UI bridge; three scene lives in ES module. */
nav.splice(1,0,["factory3d","🏗️ Nhà máy 3D"]);
window.factory3dSelected=3;
window.factory3dBuildPage=function(){
 const name=mapStations[window.factory3dSelected].name;
 return '<div class="f3d-head"><div><span class="tag">V8.0.1 · REAL THREE.JS · LOW POLY</span><h2>Nhà máy 3D – Nova Electronics</h2><p>Xoay camera · Zoom · Kéo bản đồ · Chọn khu vực trực tiếp trên mô hình 3D</p></div><button class="btn secondary" data-nav="map3d">Bản đồ 2D cũ</button></div>'+
 '<div class="f3d-layout"><section class="f3d-stage"><div class="f3d-toolbar"><b>FACTORY WORLD</b><div><button class="btn ghost" data-f3d-home>⌖ Toàn cảnh</button><button class="btn secondary" data-f3d-focus>🔎 Đến khu đã chọn</button></div></div><div class="f3d-canvas-wrap" id="f3d-wrap"><div id="f3d-loading">Đang tải mô hình 3D…</div></div><div class="f3d-hint">🖱️ Kéo để xoay · Con lăn để zoom · Chuột phải để pan · Chạm khu xưởng để xem nội dung</div><div class="f3d-zone-picker">'+mapStations.map((x,i)=>'<button data-f3d-zone="'+i+'" class="'+(i===window.factory3dSelected?'active':'')+'">'+(i+1)+'. '+esc(x.name)+'</button>').join('')+'</div></section><div id="f3d-info">'+window.factory3dPanel()+'</div></div>';
};
window.factory3dPanel=function(){mapSelection=window.factory3dSelected;mapPane="overview";return mapPanel()};
window.factory3dChooseZone=function(i){i=Math.max(0,Math.min(11,Number(i)));window.factory3dSelected=i;mapSelection=i;mapPane="overview";const panel=document.querySelector("#f3d-info");if(panel)panel.innerHTML=mapPanel();document.querySelectorAll("[data-f3d-zone]").forEach(b=>b.classList.toggle("active",Number(b.dataset.f3dZone)===i));};
const f3dOldRender=render;
render=function(){
 if(!S.mission&&S.tab==="factory3d"){
  $("#app").innerHTML=shell(window.factory3dBuildPage());
  if(typeof window.factory3dInit==="function")requestAnimationFrame(()=>window.factory3dInit());
  return;
 }
 if(typeof window.factory3dDispose==="function")window.factory3dDispose();
 f3dOldRender();
};
document.addEventListener("click",e=>{
 const b=e.target.closest("button");
 if(!b||S.tab!=="factory3d"||S.mission)return;
 if(b.hasAttribute("data-f3d-zone")){window.factory3dChooseZone(b.dataset.f3dZone);window.factory3dFocus?.(Number(b.dataset.f3dZone));}
 if(b.hasAttribute("data-f3d-home"))window.factory3dHome?.();
 if(b.hasAttribute("data-f3d-focus"))window.factory3dFocus?.(window.factory3dSelected);
},true);
render();
