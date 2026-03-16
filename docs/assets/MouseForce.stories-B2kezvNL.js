import{j as l}from"./jsx-runtime-BO8uF4Og.js";import{r}from"./index-D4H_InIO.js";import{p as P}from"./ParticularWrapper-DgNwzfkn.js";import{c as T}from"./index-BXGtiz1K.js";import{d as j,p as A,a as C}from"./storyArgs-DZbc_2NB.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const O=m=>{const{strength:a,radius:s,damping:c,maxSpeed:i,falloff:u,renderer:d}=m,f=C(m),g=r.useRef(null),e=r.useRef(null);return r.useEffect(()=>{const x=g.current;if(!x)return;const p=T({canvas:x,preset:"magic",config:{continuous:!0,trail:!1,...f},renderer:d,autoResize:!0});p.burst({x:window.innerWidth/2,y:window.innerHeight/2});const v=p.addMouseForce({strength:a,radius:s,damping:c,maxSpeed:i,falloff:u,track:!0});return e.current=v,()=>{p.destroy(),e.current=null}},[d,JSON.stringify(f)]),r.useEffect(()=>{e.current&&(e.current.strength=a,e.current.radius=s,e.current.damping=c,e.current.maxSpeed=i,e.current.falloff=u)},[a,s,c,i,u]),l.jsxs("div",{style:{minHeight:"100vh",cursor:"crosshair"},children:[l.jsx("canvas",{ref:g,style:P}),l.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"SWEEP MOUSE TO PUSH PARTICLES"})]})},B={title:"Particular/MouseForce",component:O,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...A,strength:{control:{type:"number",min:.1,max:10,step:.1},description:"Force strength multiplier",table:{category:"Mouse Force"}},radius:{control:{type:"number",min:50,max:2e3,step:10},description:"Radius of influence around the mouse",table:{category:"Mouse Force"}},damping:{control:{type:"number",min:.5,max:.99,step:.01},description:"Velocity damping per frame (higher = longer momentum)",table:{category:"Mouse Force"}},maxSpeed:{control:{type:"number",min:1,max:30,step:1},description:"Max mouse speed for force calculation",table:{category:"Mouse Force"}},falloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Falloff exponent: < 1 = broad wind, 1 = linear, > 1 = localized push",table:{category:"Mouse Force"}}},args:{...j,maxCount:150,renderer:"webgl",strength:1,radius:200,damping:.85,maxSpeed:10,falloff:1}},t={},o={args:{strength:5,radius:100,damping:.9,maxSpeed:10,falloff:2}},n={args:{strength:2,radius:100,damping:.92,maxSpeed:15,falloff:.3}};var h,y,S;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:"{}",...(S=(y=t.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var b,F,E;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    strength: 5,
    radius: 100,
    damping: 0.9,
    maxSpeed: 10,
    falloff: 2
  }
}`,...(E=(F=o.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var M,R,w;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    strength: 2,
    radius: 100,
    damping: 0.92,
    maxSpeed: 15,
    falloff: 0.3
  }
}`,...(w=(R=n.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};const D=["Sweep","StrongPush","Wind"];export{o as StrongPush,t as Sweep,n as Wind,D as __namedExportsOrder,B as default};
