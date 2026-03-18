import{j as t}from"./jsx-runtime-BO8uF4Og.js";import{r as n}from"./index-D4H_InIO.js";import{k as m,p as O}from"./presets-BYd6Nl0h.js";import{v as u}from"./viking-fU6z2fo7.js";import{a as Q,b as X,c as G}from"./index-DXSM6Rq-.js";const Y="data:image/svg+xml,%3csvg%20viewBox='0%200%2062%2023'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fillRule='evenodd'%20clipRule='evenodd'%20d='M35.477%2013.771c-1.09-.807-1.56-2.266-1.174-4.558.013-.073.044-.201.085-.358a2.07%202.07%200%2000-.773-.13c-2.571%200-4.003%204.347-4.003%208.386%200%202.106.82%203.167%202.046%203.167%201.7%200%203.262-2.96%203.82-6.507zm21.197-4.074s-1.229%205.928-1.229%208.12c0%201.524.708%202.046%201.582%202.046%201.105%200%202.12-.7%203.065-2.437.217-.399%201.011-.15%201.427.331.182.21-.027.632-.313%201.116-1.433%202.423-3.456%203.762-5.559%203.762-2.29%200-3.699-1.071-4.051-3.78-1.314%202.073-3.417%203.78-5.827%203.78-2.93%200-4.176-1.627-4.176-4.545%200-1.925.646-5.203.646-5.203-.858.775-1.853%201.336-2.998%201.57-1.126%205.292-4.14%208.178-8.188%208.178-3.43%200-5.785-1.808-5.785-6.144%200-5.352%203.397-10.12%208.727-10.12%203.035%200%205.238%201.633%205.432%205.435%201.248-.211%202.401-1.068%203.405-2.29a166.805%20166.805%200%20011.492-7.994c.082-.384.222-1.105.904-1.318.764-.24%201.855-.282%203.002-.053.636.127.798.723.798%201.256%200%201.416-.67%204.541-1.833%207.352-.824%203.132-1.39%206.258-1.39%208.73%200%201.786.59%202.374%201.577%202.374%201.612%200%203.485-2.246%204.386-5.29.14-1.463.51-3.818.695-4.695-.998.048-1.637.077-1.637.077-.52.019-1.023-.2-.998-.666a9.295%209.295%200%2001.221-1.619c.103-.415.34-.673.842-.682.538-.01%201.313-.003%202.11.016.27-1.544.495-2.75.712-3.751.087-.401.461-.632.846-.675.46-.052%201.833-.042%202.43.103.603.147.855.62.75%201.1-.213.977-.648%203.373-.648%203.373%202.15.096%204.018.194%204.018.194.644.03.975.393.872.962-.173.955-.882%201.262-1.883%201.285-1.142.026-2.343.063-3.424.102zm-30.9-7.643c0%206.672-3.566%2020.538-9.093%2020.538-4.17%200-5.007-4.678-5.222-10.638-2.09%204.574-3.196%206.949-4.577%209.327-.652%201.122-1.436%201.354-2.292%201.354-.754%200-2.699-.253-3.152-.535-.453-.282-.702-.536-.924-1.614-1.027-4.984-.363-11.43.658-16.57.178-.898.408-1.332%201.026-1.738.66-.434%202.121-.464%203.073-.481.506-.009.8.356.672.974-.92%204.487-1.998%2010.635-1.158%2016.973%200%200%203.181-6.323%206.478-14.195.662-1.58.81-2.1%201.44-2.24.823-.183%201.417-.183%202.247-.082.548.067.823.21.802.97-.058%202.052-.195%204.373-.195%206.783%200%204.079.436%208.663%202.002%208.663%202.103%200%203.95-9.809%203.297-18.237-.045-.582.165-1.174.785-1.238.31-.032.94-.068%201.648-.068%201.615%200%202.486.289%202.486%202.054z'%20fill='%23ffffff'%20/%3e%3c/svg%3e";function J(e){return{springStrength:e.springStrength,idlePulseStrength:e.idlePulseStrength,idlePulseIntervalMin:e.idlePulseIntervalMin,idlePulseIntervalMax:e.idlePulseIntervalMax}}const Z={renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},resolution:{control:{type:"number",min:20,max:500,step:10},description:"Particle grid resolution (particles along longest axis)",table:{category:"Image"}},particleShape:{control:"radio",options:["circle","square","triangle"],description:"Shape of individual particles",table:{category:"Image"}},idlePulseStrength:{control:{type:"number",min:0,max:3,step:.1},description:"Idle pulse velocity (0 = off). Particles randomly twitch and spring back.",table:{category:"Idle Animation"}},idlePulseIntervalMin:{control:{type:"number",min:60,max:1800,step:60},description:"Minimum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},idlePulseIntervalMax:{control:{type:"number",min:60,max:3600,step:60},description:"Maximum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},springStrength:{control:{type:"number",min:.005,max:.1,step:.005},description:"Spring return force strength",table:{category:"Physics"}},mouseStrength:{control:{type:"number",min:0,max:10,step:.5},description:"Mouse push force strength",table:{category:"Mouse"}},mouseRadius:{control:{type:"number",min:20,max:200,step:10},description:"Mouse force radius",table:{category:"Mouse"}}},$={renderer:"webgl",resolution:200,particleShape:"square",idlePulseStrength:m.idlePulseStrength,idlePulseIntervalMin:m.idlePulseIntervalMin,idlePulseIntervalMax:m.idlePulseIntervalMax,springStrength:m.springStrength,mouseStrength:3,mouseRadius:80},i=({buildImage:e,background:d="#1a1a2e",...r})=>{const c=n.useRef(null),o=n.useRef(null);n.useEffect(()=>{const l=c.current;if(!l)return;const s=G({canvas:l,preset:"imageShape",renderer:r.renderer,autoResize:!0});o.current=s;const N=e();return s.imageToParticles({...N,resolution:r.resolution,shape:r.particleShape,homeConfig:J(r)}),s.addMouseForce({track:!0,strength:r.mouseStrength,radius:r.mouseRadius}),()=>{s.destroy(),o.current=null}},[r.renderer,r.resolution,r.particleShape,r.idlePulseStrength,r.idlePulseIntervalMin,r.idlePulseIntervalMax,r.springStrength,r.mouseStrength,r.mouseRadius]);const a=n.useCallback(l=>{var s;(l.key==="e"||l.key==="E")&&((s=o.current)==null||s.scatter({velocity:12}))},[]);return n.useEffect(()=>(window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)),[a]),t.jsxs("div",{style:{minHeight:"100vh",background:d},children:[t.jsx("canvas",{ref:c,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},ee=e=>{const d=n.useRef(null),r=n.useRef(null);n.useEffect(()=>{const o=d.current;if(!o)return;const a=G({canvas:o,preset:"imageText",renderer:e.renderer,autoResize:!0});return r.current=a,a.textToParticles("Particular",{resolution:e.resolution,shape:e.particleShape,homeConfig:J(e)}),a.addMouseForce({track:!0,strength:e.mouseStrength,radius:e.mouseRadius}),()=>{a.destroy(),r.current=null}},[e.renderer,e.resolution,e.particleShape,e.idlePulseStrength,e.idlePulseIntervalMin,e.idlePulseIntervalMax,e.springStrength,e.mouseStrength,e.mouseRadius]);const c=n.useCallback(o=>{var a;(o.key==="e"||o.key==="E")&&((a=r.current)==null||a.scatter({velocity:12}))},[]);return n.useEffect(()=>(window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)),[c]),t.jsxs("div",{style:{minHeight:"100vh",background:"#1a1a2e"},children:[t.jsx("canvas",{ref:d,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},se={title:"Particular/Image to Particles",argTypes:Z,args:$},g={args:{resolution:300},render:e=>t.jsx(ee,{...e})},p={render:e=>t.jsx(i,{...e,buildImage:()=>({image:Q(X(400))})})},I={args:{particleShape:"triangle"},render:e=>t.jsx(i,{...e,buildImage:()=>({image:Y}),background:"#0a0a1a"})},v={render:e=>t.jsx(i,{...e,buildImage:()=>({image:u}),background:"#1a1a2e"})},h={name:"Intro — Scatter",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"scatter"}}),background:"#1a1a2e"})},f={name:"Intro — Scale In",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"scaleIn"}}),background:"#1a1a2e"})},b={name:"Intro — Ripple",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"ripple"}}),background:"#1a1a2e"})},S={name:"Intro — Paint",render:e=>t.jsx(i,{...e,buildImage:()=>({image:u,intro:{mode:"paint"}}),background:"#1a1a2e"})};var x,P,y;g.parameters={...g.parameters,docs:{...(x=g.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    resolution: 300
  },
  render: args => <TextToParticlesDemo {...args} />
}`,...(y=(P=g.parameters)==null?void 0:P.docs)==null?void 0:y.source}}};var k,w,R;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: canvasToDataURL(createHeartImage(400))
  })} />
}`,...(R=(w=p.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var M,E,T;I.parameters={...I.parameters,docs:{...(M=I.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    particleShape: 'triangle'
  },
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: woltLogoSvg
  })} background="#0a0a1a" />
}`,...(T=(E=I.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var j,D,L;v.parameters={...v.parameters,docs:{...(j=v.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng
  })} background="#1a1a2e" />
}`,...(L=(D=v.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var H,A,C;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Intro — Scatter',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'scatter'
    }
  })} background="#1a1a2e" />
}`,...(C=(A=h.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var z,q,B;f.parameters={...f.parameters,docs:{...(z=f.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Intro — Scale In',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'scaleIn'
    }
  })} background="#1a1a2e" />
}`,...(B=(q=f.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var F,K,U;b.parameters={...b.parameters,docs:{...(F=b.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Intro — Ripple',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'ripple'
    }
  })} background="#1a1a2e" />
}`,...(U=(K=b.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var V,W,_;S.parameters={...S.parameters,docs:{...(V=S.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'Intro — Paint',
  render: args => <ImageDemo {...args} buildImage={() => ({
    image: vikingPng,
    intro: {
      mode: 'paint'
    }
  })} background="#1a1a2e" />
}`,...(_=(W=S.parameters)==null?void 0:W.docs)==null?void 0:_.source}}};const ie=["TextToParticles","Heart","WoltLogo","Viking","IntroScatter","IntroScaleIn","IntroRipple","IntroPaint"];export{p as Heart,S as IntroPaint,b as IntroRipple,f as IntroScaleIn,h as IntroScatter,g as TextToParticles,v as Viking,I as WoltLogo,ie as __namedExportsOrder,se as default};
