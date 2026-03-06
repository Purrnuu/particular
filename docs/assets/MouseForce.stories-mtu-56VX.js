import{j as f}from"./jsx-runtime-BO8uF4Og.js";import{r as t}from"./index-D4H_InIO.js";import{p as j}from"./ParticularWrapper-Bsa0qoYV.js";import{c as T}from"./convenience-B8C5EWMp.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const W=({strength:i,radius:u,damping:p,maxSpeed:l,falloff:m,renderer:g})=>{const x=t.useRef(null),e=t.useRef(null),d=t.useRef(null);t.useEffect(()=>{const n=x.current;if(!n)return;const r=T({canvas:n,preset:"magic",config:{continuous:!0,maxCount:150},renderer:g,autoResize:!0});r.burst({x:window.innerWidth/2,y:window.innerHeight/2});const o=r.addMouseForce({strength:i,radius:u,damping:p,maxSpeed:l,falloff:m});return e.current=o,d.current=r,()=>{r.destroy(),d.current=null,e.current=null}},[g]),t.useEffect(()=>{e.current&&(e.current.strength=i,e.current.radius=u,e.current.damping=p,e.current.maxSpeed=l,e.current.falloff=m)},[i,u,p,l,m]);const F=n=>{const r=e.current,o=d.current;if(!r||!o)return;const h=o.engine.pixelRatio;r.updatePosition(n.clientX/h,n.clientY/h)};return f.jsxs("div",{onMouseMove:F,style:{minHeight:"100vh",cursor:"crosshair"},children:[f.jsx("canvas",{ref:x,style:j}),f.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"SWEEP MOUSE TO PUSH PARTICLES"})]})},L={title:"Particular/MouseForce",component:W,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend"},strength:{control:{type:"number",min:.1,max:10,step:.1},description:"Force strength multiplier"},radius:{control:{type:"number",min:50,max:2e3,step:10},description:"Radius of influence around the mouse"},damping:{control:{type:"number",min:.5,max:.99,step:.01},description:"Velocity damping per frame (higher = longer momentum)"},maxSpeed:{control:{type:"number",min:1,max:30,step:1},description:"Max mouse speed for force calculation"},falloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Falloff exponent: < 1 = broad wind, 1 = linear, > 1 = localized push"}},args:{renderer:"webgl",strength:1,radius:200,damping:.85,maxSpeed:10,falloff:1}},s={},a={args:{strength:5,radius:400,damping:.9,maxSpeed:10,falloff:2}},c={args:{strength:2,radius:1e3,damping:.92,maxSpeed:15,falloff:.3}};var S,y,R;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:"{}",...(R=(y=s.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};var b,v,E;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    strength: 5,
    radius: 400,
    damping: 0.9,
    maxSpeed: 10,
    falloff: 2
  }
}`,...(E=(v=a.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};var w,M,P;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    strength: 2,
    radius: 1000,
    damping: 0.92,
    maxSpeed: 15,
    falloff: 0.3
  }
}`,...(P=(M=c.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const U=["Sweep","StrongPush","Wind"];export{a as StrongPush,s as Sweep,c as Wind,U as __namedExportsOrder,L as default};
