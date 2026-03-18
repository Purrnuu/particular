import{j as p}from"./jsx-runtime-BO8uF4Og.js";import{r}from"./index-D4H_InIO.js";import{p as P}from"./presets-BYd6Nl0h.js";import{d as T,p as j,a as A}from"./storyArgs-DZYEdlVm.js";import{c as C}from"./index-DXSM6Rq-.js";const O=d=>{const{strength:a,radius:s,damping:c,maxSpeed:i,falloff:u,renderer:m}=d,f=A(d),g=r.useRef(null),e=r.useRef(null);return r.useEffect(()=>{const x=g.current;if(!x)return;const l=C({canvas:x,preset:"magic",config:{continuous:!0,trail:!1,...f},renderer:m,autoResize:!0});l.burst({x:window.innerWidth/2,y:window.innerHeight/2});const v=l.addMouseForce({strength:a,radius:s,damping:c,maxSpeed:i,falloff:u,track:!0});return e.current=v,()=>{l.destroy(),e.current=null}},[m,JSON.stringify(f)]),r.useEffect(()=>{e.current&&(e.current.strength=a,e.current.radius=s,e.current.damping=c,e.current.maxSpeed=i,e.current.falloff=u)},[a,s,c,i,u]),p.jsxs("div",{style:{minHeight:"100vh",cursor:"crosshair"},children:[p.jsx("canvas",{ref:g,style:P}),p.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"SWEEP MOUSE TO PUSH PARTICLES"})]})},U={title:"Particular/MouseForce",component:O,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...j,strength:{control:{type:"number",min:.1,max:10,step:.1},description:"Force strength multiplier",table:{category:"Mouse Force"}},radius:{control:{type:"number",min:50,max:2e3,step:10},description:"Radius of influence around the mouse",table:{category:"Mouse Force"}},damping:{control:{type:"number",min:.5,max:.99,step:.01},description:"Velocity damping per frame (higher = longer momentum)",table:{category:"Mouse Force"}},maxSpeed:{control:{type:"number",min:1,max:30,step:1},description:"Max mouse speed for force calculation",table:{category:"Mouse Force"}},falloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Falloff exponent: < 1 = broad wind, 1 = linear, > 1 = localized push",table:{category:"Mouse Force"}}},args:{...T,maxCount:150,renderer:"webgl",strength:1,radius:200,damping:.85,maxSpeed:10,falloff:1}},t={},n={args:{strength:5,radius:100,damping:.9,maxSpeed:10,falloff:2}},o={args:{strength:2,radius:100,damping:.92,maxSpeed:15,falloff:.3}};var h,y,S;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:"{}",...(S=(y=t.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var b,F,E;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    strength: 5,
    radius: 100,
    damping: 0.9,
    maxSpeed: 10,
    falloff: 2
  }
}`,...(E=(F=n.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var M,R,w;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    strength: 2,
    radius: 100,
    damping: 0.92,
    maxSpeed: 15,
    falloff: 0.3
  }
}`,...(w=(R=o.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};const _=["Sweep","StrongPush","Wind"];export{n as StrongPush,t as Sweep,o as Wind,_ as __namedExportsOrder,U as default};
