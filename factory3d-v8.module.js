import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
/* Real 3D factory foundation. All objects are three-dimensional geometry (not a background image). */
let live=null;
const zoneNames=["Planning","Warehouse","IQC","SMT","AOI / X-Ray","PCB Test","Mechanical","Assembly","Software","Final Test","OQC","Shipping"];
const colors=[0x477eac,0x9a794c,0x388f98,0x2b94bb,0x6267b7,0x347eb5,0x42937b,0x478d9f,0x7265b5,0x348aaa,0x98815a,0x4f987d];
const zoneCenters=Array.from({length:12},(_,i)=>new THREE.Vector3((i%4-1.5)*12,0,(Math.floor(i/4)-1)*13));
function block(w,h,d,color,x=0,y=0,z=0,mat=null){const obj=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat||new THREE.MeshStandardMaterial({color,roughness:.67,metalness:.09}));obj.position.set(x,y,z);obj.castShadow=true;obj.receiveShadow=true;return obj;}
function label(txt,w=512){const c=document.createElement("canvas");c.width=w;c.height=96;const x=c.getContext("2d");x.fillStyle="#0b2942";x.fillRect(0,0,w,96);x.strokeStyle="#5bc7d1";x.lineWidth=5;x.strokeRect(3,3,w-6,90);x.font="bold 48px Arial";x.textAlign="center";x.textBaseline="middle";x.fillStyle="#e8faff";x.fillText(txt,w/2,50,w-26);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(7.9,1.47),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide,depthWrite:false}));mesh.rotation.x=-Math.PI/2;return mesh;}
function conveyor(group,x,z,length=7,axis="x"){group.add(block(axis==="x"?length:1.3,.65,axis==="x"?1.3:length,0x31556c,x,.55,z));for(let n=-Math.floor(length*3/2);n<Math.floor(length*3/2);n++){const step=n*.32;group.add(block(axis==="x"?.07:1,.05,axis==="x"?1:.07,0x779aaa,x+(axis==="x"?step:0),.91,z+(axis==="x"?0:step)));}for(let k of [-1,1]){group.add(block(axis==="x"?length:0.1,.5,axis==="x"?.1:length,0x8fcad2,x+(axis==="x"?0:k*.7),.8,z+(axis==="x"?k*.7:0)));}}
function machine(group,x,z,w=2.2,h=2.2,d=1.6,color=0x4e91ad){group.add(block(w,h,d,color,x,h/2+.13,z));group.add(block(w*.72,.56,.06,0x133349,x,h*.72,z+d/2+.04));group.add(block(.42,.23,.1,0x5effc7,x-w*.25,h*.7,z+d/2+.11));group.add(block(w+.35,.13,d+.35,0x92a9b7,x,.15,z));group.add(block(.18,.5,.18,0x38ee9e,x+w*.38,h+.34,z));}
function rack(g,x,z){for(let h of [.6,1.65,2.7])g.add(block(2.3,.13,1.25,0x58778a,x,h,z));for(let a of [-1,1])for(let b of [-1,1])g.add(block(.12,3,.12,0x83afbf,x+a*1.04,1.55,z+b*.53));for(let h of [.9,1.95,3])for(let b of [-.3,.35])g.add(block(.55,.55,.55,0xa98c60,x+(b>0?.58:-.58),h,z+b));}
function addStation(g,id){
 const blue=0x4c91aa;
 if(id===1||id===11){rack(g,-2.7,-1.7);rack(g,.6,-1.7);rack(g,-2.7,2);rack(g,.6,2);conveyor(g,2.3,0,4,"z");return;}
 if(id===0){for(let k=-1;k<=1;k++){g.add(block(2.1,.2,1.2,0x856c55,k*2.8,1,-1));g.add(block(.9,.75,.07,0x163651,k*2.8,1.55,-1.5));g.add(block(.7,1,.7,0x426b86,k*2.8,.5,.2));}return;}
 if(id===3){conveyor(g,0,0,8);for(let i=0;i<5;i++)machine(g,-3.5+i*1.78,-1.6,1.35,1.95,1.25,[0x3998ae,0x547f9d,0x37788e,0xb08957,0x597ba0][i]);return;}
 if(id===4){conveyor(g,0,1.4,7);machine(g,-2.3,-1.5,2.3,2.8,2.3,0x557db3);machine(g,2,-1.5,2.5,2.7,2.3,0x667a9b);return;}
 if(id===5||id===9){for(let i=-1;i<=1;i++){machine(g,i*2.65,-1.2,2,1.7,1.8,blue);g.add(block(1.8,.1,1.2,0x5d7d91,i*2.65,1.25,1));}return;}
 if(id===6||id===7){conveyor(g,0,0,8);for(let i=-1;i<=1;i++){g.add(block(1.7,.12,2,0x8ba8b4,i*2.6,.9,-1.4));g.add(block(.8,.12,.55,0x368c83,i*2.6,1,-1.3));g.add(block(.25,1,.25,0xefb95b,i*2.6+0.6,1.5,-1.4));}return;}
 if(id===8){for(let i=-1;i<=1;i++){rack(g,i*2.7,-2);machine(g,i*2.7,1.5,1.6,1.8,1.5,0x5b6da3);}return;}
 if(id===10){for(let i=-1;i<=1;i++)machine(g,i*2.6,0,2,2.8,2.5,0x8f8170);return;}
 conveyor(g,0,1.5,7);for(let i=-1;i<=1;i++)machine(g,i*2.6,-1.1,1.8,1.9,1.6,blue);
}
function createZone(scene,id,zoneRoots,pickables){
 const center=zoneCenters[id],g=new THREE.Group();g.position.copy(center);scene.add(g);zoneRoots[id]=g;
 const floor=block(10.8,.32,11.4,colors[id],0,.1,0);floor.material.transparent=true;floor.material.opacity=.52;floor.userData.zone=id;g.add(floor);pickables.push(floor);
 const back=block(10.8,2.4,.18,0x42647b,0,1.35,-5.6);back.material.transparent=true;back.material.opacity=.47;g.add(back);
 const side=block(.18,2.4,11.4,0x46728b,-5.35,1.35,0);side.material.transparent=true;side.material.opacity=.38;g.add(side);
 addStation(g,id);const sign=label(String(id+1).padStart(2,"0")+" "+zoneNames[id]);sign.position.set(0,4.25,-5);g.add(sign);
 for(const obj of g.children){obj.traverse?.(m=>{if(m.isMesh&&!m.userData.zone&&m!==sign){m.userData.zone=id;pickables.push(m);}});}
}
function init(){
 const mount=document.getElementById("f3d-wrap");if(!mount||live?.mount===mount)return;
 dispose();
 const loading=mount.querySelector("#f3d-loading");
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});}catch(e){if(loading)loading.textContent="Thiết bị/trình duyệt không hỗ trợ WebGL: "+e.message;return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));renderer.setSize(mount.clientWidth,mount.clientHeight);renderer.shadowMap.enabled=false;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x10283d);mount.appendChild(renderer.domElement);if(loading)loading.remove();
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x10283d);scene.fog=new THREE.Fog(0x10283d,65,118);
 const camera=new THREE.PerspectiveCamera(48,mount.clientWidth/mount.clientHeight,.1,150);camera.position.set(39,38,47);
 const control=new OrbitControls(camera,renderer.domElement);control.target.set(0,0,0);control.enableDamping=true;control.dampingFactor=.085;control.maxPolarAngle=Math.PI*.47;control.minDistance=10;control.maxDistance=92;control.update();
 scene.add(new THREE.HemisphereLight(0xc6eaff,0x355168,2.15));const sun=new THREE.DirectionalLight(0xffffff,2.1);sun.position.set(-20,42,21);scene.add(sun);
 const zoneRoots=[],pickables=[];scene.add(block(53,.36,43,0x23445e,0,-.23,0));
 const grid=new THREE.GridHelper(53,42,0x446b81,0x325269);grid.position.y=.01;scene.add(grid);
 for(let i=0;i<12;i++)createZone(scene,i,zoneRoots,pickables);
 // Main logistics aisles between rows and columns.
 for(let x of [-18,-6,6,18])scene.add(block(.3,.025,40,0x52829a,x,.02,0));
 const board=block(.85,.12,.55,0x26c48a,0,1.08,0);scene.add(board);
 const belt=block(8,.3,1.4,0x46788a,zoneCenters[3].x,0.55,zoneCenters[3].z+1.7);scene.add(belt);
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),clock=new THREE.Clock();
 let pointerDown=null,focus=null,raf=0,lastPick=null;
 function choose(i){window.factory3dChooseZone?.(i);lastPick=i;zoneRoots.forEach((g,k)=>{const floor=g.children[0];floor.material.opacity=k===i?.94:.52;});}
 const down=e=>{pointerDown=[e.clientX,e.clientY];};
 const up=e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>7)return;const bounds=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pickables,false).find(h=>Number.isInteger(h.object.userData.zone));if(hit)choose(hit.object.userData.zone);};
 renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",up);
 let resizeObserver=new ResizeObserver(()=>{if(!mount.isConnected)return;const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);});resizeObserver.observe(mount);
 function animate(){raf=requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.04);if(focus){const t=1-Math.exp(-3.5*d);control.target.lerp(focus.target,t);camera.position.lerp(focus.position,t);if(camera.position.distanceTo(focus.position)<.12)focus=null;}board.position.x=zoneCenters[3].x-3.2+(performance.now()/1100%1)*6.4;control.update();renderer.render(scene,camera);}
 live={mount,renderer,scene,camera,control,zoneRoots,resizeObserver,down,up,get raf(){return raf},setFocus(v){focus=v;}};choose(window.factory3dSelected??3);animate();
}
function dispose(){if(!live)return;const v=live;live=null;cancelAnimationFrame(v.raf);v.resizeObserver.disconnect();v.renderer.domElement.removeEventListener("pointerdown",v.down);v.renderer.domElement.removeEventListener("pointerup",v.up);v.control.dispose();v.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(m.map)m.map.dispose();m.dispose();}}});v.renderer.dispose();v.renderer.domElement.remove();}
function focusZone(i){if(!live)return;const p=zoneCenters[i];live.setFocus({target:new THREE.Vector3(p.x,1,p.z),position:new THREE.Vector3(p.x+11,13,p.z+15)});}
function home(){if(!live)return;live.setFocus({target:new THREE.Vector3(0,0,0),position:new THREE.Vector3(39,38,47)});}
window.factory3dInit=init;window.factory3dDispose=dispose;window.factory3dFocus=focusZone;window.factory3dHome=home;
if(document.getElementById("f3d-wrap"))init();
