import{j as t}from"./jsx-runtime-BO8uF4Og.js";import{r as n}from"./index-D4H_InIO.js";import{f as m,p as O}from"./canvasStyles-v6EDBSjQ.js";import{v as u,w as Q}from"./viking-DzcfF5MU.js";import{a as X,b as Y,c as G}from"./index-BUcnqCad.js";function J(e){return{springStrength:e.springStrength,idlePulseStrength:e.idlePulseStrength,idlePulseIntervalMin:e.idlePulseIntervalMin,idlePulseIntervalMax:e.idlePulseIntervalMax}}const Z={renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},resolution:{control:{type:"number",min:20,max:500,step:10},description:"Particle grid resolution (particles along longest axis)",table:{category:"Image"}},particleShape:{control:"radio",options:["circle","square","triangle"],description:"Shape of individual particles",table:{category:"Image"}},idlePulseStrength:{control:{type:"number",min:0,max:3,step:.1},description:"Idle pulse velocity (0 = off). Particles randomly twitch and spring back.",table:{category:"Idle Animation"}},idlePulseIntervalMin:{control:{type:"number",min:60,max:1800,step:60},description:"Minimum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},idlePulseIntervalMax:{control:{type:"number",min:60,max:3600,step:60},description:"Maximum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},springStrength:{control:{type:"number",min:.005,max:.1,step:.005},description:"Spring return force strength",table:{category:"Physics"}},mouseStrength:{control:{type:"number",min:0,max:10,step:.5},description:"Mouse push force strength",table:{category:"Mouse"}},mouseRadius:{control:{type:"number",min:20,max:200,step:10},description:"Mouse force radius",table:{category:"Mouse"}}},$={renderer:"webgl",resolution:200,particleShape:"square",idlePulseStrength:m.idlePulseStrength,idlePulseIntervalMin:m.idlePulseIntervalMin,idlePulseIntervalMax:m.idlePulseIntervalMax,springStrength:m.springStrength,mouseStrength:3,mouseRadius:80},i=({buildImage:e,background:d="#1a1a2e",...r})=>{const c=n.useRef(null),o=n.useRef(null);n.useEffect(()=>{const l=c.current;if(!l)return;const s=G({canvas:l,preset:"imageShape",renderer:r.renderer,autoResize:!0});o.current=s;const N=e();return s.imageToParticles({...N,resolution:r.resolution,shape:r.particleShape,homeConfig:J(r)}),s.addMouseForce({track:!0,strength:r.mouseStrength,radius:r.mouseRadius}),()=>{s.destroy(),o.current=null}},[r.renderer,r.resolution,r.particleShape,r.idlePulseStrength,r.idlePulseIntervalMin,r.idlePulseIntervalMax,r.springStrength,r.mouseStrength,r.mouseRadius]);const a=n.useCallback(l=>{var s;(l.key==="e"||l.key==="E")&&((s=o.current)==null||s.scatter({velocity:12}))},[]);return n.useEffect(()=>(window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)),[a]),t.jsxs("div",{style:{minHeight:"100vh",background:d},children:[t.jsx("canvas",{ref:c,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},ee=e=>{const d=n.useRef(null),r=n.useRef(null);n.useEffect(()=>{const o=d.current;if(!o)return;const a=G({canvas:o,preset:"imageText",renderer:e.renderer,autoResize:!0});return r.current=a,a.textToParticles("Particular",{resolution:e.resolution,shape:e.particleShape,homeConfig:J(e)}),a.addMouseForce({track:!0,strength:e.mouseStrength,radius:e.mouseRadius}),()=>{a.destroy(),r.current=null}},[e.renderer,e.resolution,e.particleShape,e.idlePulseStrength,e.idlePulseIntervalMin,e.idlePulseIntervalMax,e.springStrength,e.mouseStrength,e.mouseRadius]);const c=n.useCallback(o=>{var a;(o.key==="e"||o.key==="E")&&((a=r.current)==null||a.scatter({velocity:12}))},[]);return n.useEffect(()=>(window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)),[c]),t.jsxs("div",{style:{minHeight:"100vh",background:"#1a1a2e"},children:[t.jsx("canvas",{ref:d,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},se={title:"Particular/Image to Particles",argTypes:Z,args:$},g={args:{resolution:300},render:e=>t.jsx(ee,{...e})},p={render:e=>t.jsx(i,{...e,buildImage:()=>({image:X(Y(400))})})},I={args:{particleShape:"triangle"},render:e=>t.jsx(i,{...e,buildImage:()=>({image:Q}),background:"#0a0a1a"})},h={render:e=>t.jsx(i,{...e,buildImage:()=>({image:u}),background:"#1a1a2e"})},v={name:"Intro — Scatter",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"scatter"}}),background:"#1a1a2e"})},b={name:"Intro — Scale In",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"scaleIn"}}),background:"#1a1a2e"})},S={name:"Intro — Ripple",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"ripple"}}),background:"#1a1a2e"})},f={name:"Intro — Paint",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"paint"}}),background:"#1a1a2e"})};var P,y,x;g.parameters={...g.parameters,docs:{...(P=g.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    resolution: 300
  },
  render: args => <TextToParticlesDemo {...args} />
}`,...(x=(y=g.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var k,R,w;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: canvasToDataURL(createHeartImage(400))
  })} />
}`,...(w=(R=p.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};var M,E,T;I.parameters={...I.parameters,docs:{...(M=I.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    particleShape: 'triangle'
  },
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: woltLogoSvg
  })} background="#0a0a1a" />
}`,...(T=(E=I.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var j,D,L;h.parameters={...h.parameters,docs:{...(j=h.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng
  })} background="#1a1a2e" />
}`,...(L=(D=h.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var H,A,C;v.parameters={...v.parameters,docs:{...(H=v.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Intro — Scatter',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'scatter'
    }
  })} background="#1a1a2e" />
}`,...(C=(A=v.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var q,z,F;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Intro — Scale In',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'scaleIn'
    }
  })} background="#1a1a2e" />
}`,...(F=(z=b.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var K,U,V;S.parameters={...S.parameters,docs:{...(K=S.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Intro — Ripple',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'ripple'
    }
  })} background="#1a1a2e" />
}`,...(V=(U=S.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var W,_,B;f.parameters={...f.parameters,docs:{...(W=f.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Intro — Paint',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'paint'
    }
  })} background="#1a1a2e" />
}`,...(B=(_=f.parameters)==null?void 0:_.docs)==null?void 0:B.source}}};const ie=["TextToParticles","Heart","WoltLogo","Viking","IntroScatter","IntroScaleIn","IntroRipple","IntroPaint"];export{p as Heart,f as IntroPaint,S as IntroRipple,b as IntroScaleIn,v as IntroScatter,g as TextToParticles,h as Viking,I as WoltLogo,ie as __namedExportsOrder,se as default};
