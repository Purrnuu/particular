import{j as f}from"./jsx-runtime-BO8uF4Og.js";import{r as n}from"./index-D4H_InIO.js";import{d as A,p as C,a as O,b as W}from"./storyArgs-D-Zr4-3w.js";import{c as H}from"./convenience-Dzh7LLDr.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const k=g=>{const{strength:i,radius:u,damping:l,maxSpeed:p,falloff:d,renderer:x}=g,h=O(g),y=n.useRef(null),e=n.useRef(null),m=n.useRef(null);n.useEffect(()=>{const t=y.current;if(!t)return;const r=H({canvas:t,preset:"magic",config:{continuous:!0,...h},renderer:x,autoResize:!0});r.burst({x:window.innerWidth/2,y:window.innerHeight/2});const o=r.addMouseForce({strength:i,radius:u,damping:l,maxSpeed:p,falloff:d});return e.current=o,m.current=r,()=>{r.destroy(),m.current=null,e.current=null}},[x,JSON.stringify(h)]),n.useEffect(()=>{e.current&&(e.current.strength=i,e.current.radius=u,e.current.damping=l,e.current.maxSpeed=p,e.current.falloff=d)},[i,u,l,p,d]);const j=t=>{const r=e.current,o=m.current;if(!r||!o)return;const S=o.engine.pixelRatio;r.updatePosition(t.clientX/S,t.clientY/S)};return f.jsxs("div",{onMouseMove:j,style:{minHeight:"100vh",cursor:"crosshair"},children:[f.jsx("canvas",{ref:y,style:W}),f.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"SWEEP MOUSE TO PUSH PARTICLES"})]})},I={title:"Particular/MouseForce",component:k,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...C,strength:{control:{type:"number",min:.1,max:10,step:.1},description:"Force strength multiplier",table:{category:"Mouse Force"}},radius:{control:{type:"number",min:50,max:2e3,step:10},description:"Radius of influence around the mouse",table:{category:"Mouse Force"}},damping:{control:{type:"number",min:.5,max:.99,step:.01},description:"Velocity damping per frame (higher = longer momentum)",table:{category:"Mouse Force"}},maxSpeed:{control:{type:"number",min:1,max:30,step:1},description:"Max mouse speed for force calculation",table:{category:"Mouse Force"}},falloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Falloff exponent: < 1 = broad wind, 1 = linear, > 1 = localized push",table:{category:"Mouse Force"}}},args:{...A,maxCount:150,renderer:"webgl",strength:1,radius:200,damping:.85,maxSpeed:10,falloff:1}},s={},a={args:{strength:5,radius:400,damping:.9,maxSpeed:10,falloff:2}},c={args:{strength:2,radius:1e3,damping:.92,maxSpeed:15,falloff:.3}};var b,M,R;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:"{}",...(R=(M=s.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};var F,v,E;a.parameters={...a.parameters,docs:{...(F=a.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    strength: 5,
    radius: 400,
    damping: 0.9,
    maxSpeed: 10,
    falloff: 2
  }
}`,...(E=(v=a.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};var w,P,T;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    strength: 2,
    radius: 1000,
    damping: 0.92,
    maxSpeed: 15,
    falloff: 0.3
  }
}`,...(T=(P=c.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};const J=["Sweep","StrongPush","Wind"];export{a as StrongPush,s as Sweep,c as Wind,J as __namedExportsOrder,I as default};
