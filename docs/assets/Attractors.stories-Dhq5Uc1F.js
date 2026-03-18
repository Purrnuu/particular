import{j as i}from"./jsx-runtime-BO8uF4Og.js";import{r as c}from"./index-D4H_InIO.js";import{p as E,c as K,E as Q,V as Z,a as $}from"./presets-BC6FlRRU.js";import{d as rr,p as tr,a as z}from"./storyArgs-RVoRYa_t.js";import{c as T}from"./index-BAseYlKp.js";const er=t=>{const{strength:l,radius:g,renderer:f}=t,n=z(t),p=c.useRef(null),e=c.useRef(null),o=c.useRef(null);c.useEffect(()=>{const u=p.current;if(!u)return;const r=T({canvas:u,preset:"magic",config:{continuous:!0,trail:!1,...n},renderer:f,autoResize:!0}),d=r.engine.pixelRatio;r.burst({x:window.innerWidth/2,y:window.innerHeight/2});const a=r.addAttractor({x:window.innerWidth/2/d,y:window.innerHeight/2/d,strength:l,radius:g});return e.current=a,o.current=r,()=>{r.destroy(),o.current=null,e.current=null}},[f,JSON.stringify(n)]),c.useEffect(()=>{e.current&&(e.current.strength=l,e.current.radius=g)},[l,g]);const h=u=>{const r=e.current,d=o.current;if(!r||!d)return;const a=d.engine.pixelRatio;r.position.x=u.clientX/a,r.position.y=u.clientY/a},m=l>=0?"MOVE MOUSE TO ATTRACT PARTICLES":"MOVE MOUSE TO REPEL PARTICLES";return i.jsxs("div",{onMouseMove:h,style:{minHeight:"100vh",cursor:"crosshair"},children:[i.jsx("canvas",{ref:p,style:E}),i.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:m})]})},ur={title:"Particular/Attractors",component:er,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...tr,strength:{control:{type:"number",min:-5,max:5,step:.1},description:"Attractor strength (negative = repulsion)",table:{category:"Attractor"}},radius:{control:{type:"number",min:50,max:800,step:10},description:"Attractor radius of influence",table:{category:"Attractor"}},attractorSize:{control:{type:"number",min:4,max:40},description:"Attractor visual size",table:{category:"Attractor"}},attractorColor:{control:"color",description:"Attractor visual color",table:{category:"Attractor"}},attractorShape:{control:"select",options:["circle","star","ring","sparkle","square","triangle"],description:"Attractor visual shape",table:{category:"Attractor"}},attractorGlow:{control:"boolean",description:"Enable attractor glow",table:{category:"Attractor"}},attractorGlowSize:{control:{type:"number",min:4,max:30},description:"Attractor glow size",table:{category:"Attractor"}},attractorGlowColor:{control:"color",description:"Attractor glow color",table:{category:"Attractor"}},attractorGlowAlpha:{control:{type:"number",min:0,max:1,step:.05},description:"Attractor glow opacity",table:{category:"Attractor"}},count:{control:{type:"number",min:1,max:10},description:"Number of random attractors",table:{category:"Attractor"}}},args:{...rr,maxCount:150,renderer:"webgl",strength:1,radius:50,attractorSize:14,attractorColor:"#adb5bd",attractorShape:"circle",attractorGlow:!0,attractorGlowSize:15,attractorGlowColor:"#adb5bd",attractorGlowAlpha:.5,count:4}},x={args:{maxCount:100}},A={args:{maxCount:100,strength:-1,radius:100}},_=t=>{const{strength:l,radius:g,renderer:f,attractorSize:n,attractorColor:p,attractorShape:e,attractorGlow:o,attractorGlowSize:h,attractorGlowColor:m,attractorGlowAlpha:u}=t,r=z(t),d=c.useRef(null),a=c.useRef(null),j=c.useRef(null);c.useEffect(()=>{const s=d.current;if(!s)return;const w=T({canvas:s,preset:"magic",config:{continuous:!0,trail:!1,...r},renderer:f,autoResize:!0}),y=w.engine.pixelRatio;w.burst({x:window.innerWidth/2,y:window.innerHeight/2});const R=w.addAttractor({x:window.innerWidth/2/y,y:window.innerHeight/2/y,strength:l,radius:g,visible:!0,size:n,color:p,shape:e,glow:o,glowSize:h,glowColor:m,glowAlpha:u});return a.current=R,j.current=w,()=>{w.destroy(),j.current=null,a.current=null}},[f,JSON.stringify(r)]),c.useEffect(()=>{const s=a.current;s&&(s.strength=l,s.radius=g,s.size=n,s.color=p,s.shape=e,s.glow=o,s.glowSize=h,s.glowColor=m,s.glowAlpha=u)},[l,g,n,p,e,o,h,m,u]);const q=s=>{const w=a.current,y=j.current;if(!w||!y)return;const R=y.engine.pixelRatio;w.position.x=s.clientX/R,w.position.y=s.clientY/R};return i.jsxs("div",{onMouseMove:q,style:{minHeight:"100vh",cursor:"crosshair"},children:[i.jsx("canvas",{ref:d,style:E}),i.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"VISIBLE ATTRACTOR — MOVE MOUSE"})]})},v={args:{strength:1.5,radius:50},render:t=>i.jsx(_,{...t})},b={args:{strength:-1,radius:50,attractorColor:"#339af0",attractorGlowColor:"#339af0",attractorShape:"circle"},render:t=>i.jsx(_,{...t})},or=t=>{const{count:l,strength:g,radius:f,renderer:n,attractorSize:p,attractorColor:e,attractorShape:o,attractorGlow:h}=t,m=z(t),u=c.useRef(null),r=c.useRef(null);return c.useEffect(()=>{const d=u.current;if(!d)return;const a=T({canvas:d,preset:"magic",config:{continuous:!0,trail:!1,...m},renderer:n,autoResize:!0});return a.burst({x:window.innerWidth/2,y:window.innerHeight/2}),a.addRandomAttractors(l,{strength:g,radius:f,visible:!0,size:p,color:e,shape:o,glow:h,glowColor:e,glowAlpha:.4}),r.current=a,()=>{a.destroy(),r.current=null}},[n,l,g,f,p,e,o,h,JSON.stringify(m)]),i.jsxs("div",{onClick:d=>{var a;(a=r.current)==null||a.burst({x:d.clientX,y:d.clientY})},style:{minHeight:"100vh",cursor:"pointer"},children:[i.jsx("canvas",{ref:u,style:E}),i.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"RANDOM ATTRACTORS — CLICK FOR PARTICLES"})]})},S={args:{maxCount:200,count:4,strength:1.5,radius:250},render:t=>i.jsx(or,{...t})},nr=({renderer:t})=>{const l=c.useRef(null),g=c.useRef(null);return c.useEffect(()=>{const f=l.current;if(!f)return;const n=T({canvas:f,preset:"river",renderer:t,autoResize:!0});g.current=n;const p=n.engine.pixelRatio,e=window.innerWidth/p,o=window.innerHeight/p,h=K($.Ambient.river),m=new Q({point:new Z(0,o/2),...h,spawnWidth:0,spawnHeight:o*.4,icons:[]});n.engine.addEmitter(m),m.isEmitting=!0,m.emit();const u=[{x:.2,y:.35},{x:.4,y:.65},{x:.6,y:.35},{x:.8,y:.65}];for(const r of u)n.addAttractor({x:e*r.x,y:o*r.y,strength:.15,radius:e*.3});for(let r=.1;r<=.9;r+=.2)n.addAttractor({x:e*r,y:o*.02,strength:-.3,radius:o*.15}),n.addAttractor({x:e*r,y:o*.98,strength:-.3,radius:o*.15});return()=>{n.destroy(),g.current=null}},[t]),i.jsxs("div",{style:{minHeight:"100vh",background:"#0a1628"},children:[i.jsx("canvas",{ref:l,style:E}),i.jsx("p",{style:{textAlign:"center",paddingTop:"90vh",pointerEvents:"none",userSelect:"none",opacity:.4,color:"#80deea"},children:"River flow — particles stream through attractor waypoints"})]})},C={argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"},render:t=>i.jsx(nr,{...t})};var M,O,G;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    maxCount: 100
  }
}`,...(G=(O=x.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var V,H,D;A.parameters={...A.parameters,docs:{...(V=A.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    maxCount: 100,
    strength: -1,
    radius: 100
  }
}`,...(D=(H=A.parameters)==null?void 0:H.docs)==null?void 0:D.source}}};var k,P,W;v.parameters={...v.parameters,docs:{...(k=v.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    strength: 1.5,
    radius: 50
  },
  render: args => <VisibleAttractorDemo {...args} />
}`,...(W=(P=v.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var L,I,N;b.parameters={...b.parameters,docs:{...(L=b.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    strength: -1,
    radius: 50,
    attractorColor: '#339af0',
    attractorGlowColor: '#339af0',
    attractorShape: 'circle'
  },
  render: args => <VisibleAttractorDemo {...args} />
}`,...(N=(I=b.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var F,J,U;S.parameters={...S.parameters,docs:{...(F=S.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    maxCount: 200,
    count: 4,
    strength: 1.5,
    radius: 250
  },
  render: args => <RandomAttractorsDemo {...args} />
}`,...(U=(J=S.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var X,Y,B;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`{
  argTypes: {
    renderer: {
      control: 'radio',
      options: ['canvas', 'webgl'],
      description: 'Rendering backend',
      table: {
        category: 'Rendering'
      }
    }
  },
  args: {
    renderer: 'webgl'
  } as any,
  render: args => <RiverDemo {...args as unknown as {
    renderer: 'canvas' | 'webgl';
  }} />
}`,...(B=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:B.source}}};const dr=["MouseFollow","Repulsion","VisibleAttractor","VisibleRepulsion","RandomAttractors","River"];export{x as MouseFollow,S as RandomAttractors,A as Repulsion,C as River,v as VisibleAttractor,b as VisibleRepulsion,dr as __namedExportsOrder,ur as default};
