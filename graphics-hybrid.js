/* NET FORGE v0.32.0 — optional WebGL2 particle layer, DOM/SVG remains authoritative. */
(()=>{'use strict';
 const KEY='netforge.graphics.v032';
 const $=s=>document.querySelector(s);
 const quality={off:{fps:0,particles:0},low:{fps:20,particles:1},medium:{fps:35,particles:2},high:{fps:50,particles:4}};
 const board=$('#board'); if(!board)return;
 let mode='medium'; try{const saved=localStorage.getItem(KEY);if(saved in quality)mode=saved;}catch{}
 const canvas=document.createElement('canvas');canvas.id='nf32Canvas';canvas.setAttribute('aria-hidden','true');board.insertBefore(canvas,board.firstChild.nextSibling);
 const hud=document.createElement('div');hud.id='nf32Hud';hud.textContent='GPU: initializing';
 const header=$('.workspace-panel .panelhead')||board.parentElement;
 const select=document.createElement('select');select.id='nf32Graphics';select.setAttribute('aria-label','Kualitas grafis GPU');
 select.innerHTML='<option value="off">FX: SVG saja</option><option value="low">GPU: Low</option><option value="medium">GPU: Medium</option><option value="high">GPU: High</option>';
 select.value=mode;
 const tools=document.createElement('div');tools.className='nf32-tools';tools.append(select,hud);header.appendChild(tools);
 const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 let program=null, buffer=null,loc=null,enabled=!!gl,raf=0,lastFrame=0,fpsAvg=0,frames=0,lastFpsStamp=performance.now(),paused=false;
 const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
 try{if(gl){program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,`#version 300 es
 in vec2 p; uniform vec2 size; uniform float diameter;
 void main(){ gl_Position=vec4((p/size)*vec2(2.,-2.)+vec2(-1.,1.),0.,1.); gl_PointSize=diameter; }`);
 const fs=shader(gl.FRAGMENT_SHADER,`#version 300 es
 precision mediump float; out vec4 color;
 void main(){float r=length(gl_PointCoord-vec2(.5));float a=smoothstep(.5,.1,r);color=vec4(.35,.99,.83,a*.88);}`);
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 loc={p:gl.getAttribLocation(program,'p'),size:gl.getUniformLocation(program,'size'),diameter:gl.getUniformLocation(program,'diameter')};buffer=gl.createBuffer();
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
 }}catch(e){enabled=false;hud.textContent='GPU fallback: '+String(e.message).slice(0,65);}
 function resize(){const box=board.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);const w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}return {box,dpr};}
 function draw(time){raf=requestAnimationFrame(draw);if(paused||document.hidden||mode==='off')return;
 if(!enabled){hud.textContent='SVG fallback · GPU tidak tersedia';return;}
 const q=quality[mode];if(time-lastFrame<1000/q.fps)return;lastFrame=time;
 if(time-lastFpsStamp>=1000){fpsAvg=frames*1000/(time-lastFpsStamp);frames=0;lastFpsStamp=time;}frames++;
 const {box,dpr}=resize();const paths=[...document.querySelectorAll('#wires .wire:not(.down)')];
 const pts=[];
 for(const path of paths.slice(0,120)){
  try{const len=path.getTotalLength(),ctm=path.getScreenCTM();if(!ctm||len<=0)continue;
   for(let i=0;i<q.particles;i++){
    const ratio=((time*.00016+i/q.particles)%1);const point=path.getPointAtLength(len*ratio);const p=new DOMPoint(point.x,point.y).matrixTransform(ctm);
    pts.push((p.x-box.left)*dpr,(p.y-box.top)*dpr);
   }
  }catch{}
 }
 gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 if(pts.length){gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc.p);gl.vertexAttribPointer(loc.p,2,gl.FLOAT,false,0,0);gl.uniform2f(loc.size,canvas.width,canvas.height);gl.uniform1f(loc.diameter,Math.min(15,7*dpr));gl.drawArrays(gl.POINTS,0,pts.length/2);}
 hud.textContent=`WebGL2 · ${Math.round(fpsAvg||q.fps)} FPS · ${pts.length/2} packets`;
 }
 const listener=()=>{mode=select.value;try{localStorage.setItem(KEY,mode)}catch{}canvas.style.display=(enabled&&mode!=='off')?'block':'none';hud.textContent=mode==='off'?'SVG only':enabled?'WebGL2 active':'SVG fallback';};
 select.addEventListener('change',listener);listener();
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();enabled=false;canvas.style.display='none';hud.textContent='GPU context lost · SVG fallback';});
 document.addEventListener('visibilitychange',()=>{paused=document.hidden;});
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){select.value='off';listener();}
 raf=requestAnimationFrame(draw);
 window.NetForgeGraphics={getMode:()=>mode,setMode:value=>{if(value in quality){select.value=value;listener()}},getStatus:()=>({webgl2:!!gl,active:enabled&&mode!=='off',fps:Math.round(fpsAvg)})};
})();
