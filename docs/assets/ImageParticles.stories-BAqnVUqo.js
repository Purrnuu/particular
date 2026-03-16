import{j as t}from"./jsx-runtime-BO8uF4Og.js";import{r as o}from"./index-D4H_InIO.js";import{i as m,p as O}from"./ParticularWrapper-DgNwzfkn.js";import{a as N,b as Q,c as Z}from"./index-BXGtiz1K.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const X="data:image/svg+xml,%3csvg%20viewBox='0%200%2062%2023'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fillRule='evenodd'%20clipRule='evenodd'%20d='M35.477%2013.771c-1.09-.807-1.56-2.266-1.174-4.558.013-.073.044-.201.085-.358a2.07%202.07%200%2000-.773-.13c-2.571%200-4.003%204.347-4.003%208.386%200%202.106.82%203.167%202.046%203.167%201.7%200%203.262-2.96%203.82-6.507zm21.197-4.074s-1.229%205.928-1.229%208.12c0%201.524.708%202.046%201.582%202.046%201.105%200%202.12-.7%203.065-2.437.217-.399%201.011-.15%201.427.331.182.21-.027.632-.313%201.116-1.433%202.423-3.456%203.762-5.559%203.762-2.29%200-3.699-1.071-4.051-3.78-1.314%202.073-3.417%203.78-5.827%203.78-2.93%200-4.176-1.627-4.176-4.545%200-1.925.646-5.203.646-5.203-.858.775-1.853%201.336-2.998%201.57-1.126%205.292-4.14%208.178-8.188%208.178-3.43%200-5.785-1.808-5.785-6.144%200-5.352%203.397-10.12%208.727-10.12%203.035%200%205.238%201.633%205.432%205.435%201.248-.211%202.401-1.068%203.405-2.29a166.805%20166.805%200%20011.492-7.994c.082-.384.222-1.105.904-1.318.764-.24%201.855-.282%203.002-.053.636.127.798.723.798%201.256%200%201.416-.67%204.541-1.833%207.352-.824%203.132-1.39%206.258-1.39%208.73%200%201.786.59%202.374%201.577%202.374%201.612%200%203.485-2.246%204.386-5.29.14-1.463.51-3.818.695-4.695-.998.048-1.637.077-1.637.077-.52.019-1.023-.2-.998-.666a9.295%209.295%200%2001.221-1.619c.103-.415.34-.673.842-.682.538-.01%201.313-.003%202.11.016.27-1.544.495-2.75.712-3.751.087-.401.461-.632.846-.675.46-.052%201.833-.042%202.43.103.603.147.855.62.75%201.1-.213.977-.648%203.373-.648%203.373%202.15.096%204.018.194%204.018.194.644.03.975.393.872.962-.173.955-.882%201.262-1.883%201.285-1.142.026-2.343.063-3.424.102zm-30.9-7.643c0%206.672-3.566%2020.538-9.093%2020.538-4.17%200-5.007-4.678-5.222-10.638-2.09%204.574-3.196%206.949-4.577%209.327-.652%201.122-1.436%201.354-2.292%201.354-.754%200-2.699-.253-3.152-.535-.453-.282-.702-.536-.924-1.614-1.027-4.984-.363-11.43.658-16.57.178-.898.408-1.332%201.026-1.738.66-.434%202.121-.464%203.073-.481.506-.009.8.356.672.974-.92%204.487-1.998%2010.635-1.158%2016.973%200%200%203.181-6.323%206.478-14.195.662-1.58.81-2.1%201.44-2.24.823-.183%201.417-.183%202.247-.082.548.067.823.21.802.97-.058%202.052-.195%204.373-.195%206.783%200%204.079.436%208.663%202.002%208.663%202.103%200%203.95-9.809%203.297-18.237-.045-.582.165-1.174.785-1.238.31-.032.94-.068%201.648-.068%201.615%200%202.486.289%202.486%202.054z'%20fill='%23ffffff'%20/%3e%3c/svg%3e",u=""+new URL("viking-CvdpZzc3.png",import.meta.url).href;function G(e){return{springStrength:e.springStrength,idlePulseStrength:e.idlePulseStrength,idlePulseIntervalMin:e.idlePulseIntervalMin,idlePulseIntervalMax:e.idlePulseIntervalMax}}const Y={renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},resolution:{control:{type:"number",min:20,max:500,step:10},description:"Particle grid resolution (particles along longest axis)",table:{category:"Image"}},particleShape:{control:"radio",options:["circle","square","triangle"],description:"Shape of individual particles",table:{category:"Image"}},idlePulseStrength:{control:{type:"number",min:0,max:3,step:.1},description:"Idle pulse velocity (0 = off). Particles randomly twitch and spring back.",table:{category:"Idle Animation"}},idlePulseIntervalMin:{control:{type:"number",min:60,max:1800,step:60},description:"Minimum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},idlePulseIntervalMax:{control:{type:"number",min:60,max:3600,step:60},description:"Maximum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},springStrength:{control:{type:"number",min:.005,max:.1,step:.005},description:"Spring return force strength",table:{category:"Physics"}},mouseStrength:{control:{type:"number",min:0,max:10,step:.5},description:"Mouse push force strength",table:{category:"Mouse"}},mouseRadius:{control:{type:"number",min:20,max:200,step:10},description:"Mouse force radius",table:{category:"Mouse"}}},$={renderer:"webgl",resolution:200,particleShape:"square",idlePulseStrength:m.idlePulseStrength,idlePulseIntervalMin:m.idlePulseIntervalMin,idlePulseIntervalMax:m.idlePulseIntervalMax,springStrength:m.springStrength,mouseStrength:3,mouseRadius:80},d=({buildImage:e,background:n="#1a1a2e",...r})=>{const c=o.useRef(null),a=o.useRef(null);o.useEffect(()=>{const l=c.current;if(!l)return;const s=Z({canvas:l,preset:"imageShape",renderer:r.renderer,autoResize:!0});a.current=s;const J=e();return s.imageToParticles({...J,resolution:r.resolution,shape:r.particleShape,homeConfig:G(r)}),s.addMouseForce({track:!0,strength:r.mouseStrength,radius:r.mouseRadius}),()=>{s.destroy(),a.current=null}},[r.renderer,r.resolution,r.particleShape,r.idlePulseStrength,r.idlePulseIntervalMin,r.idlePulseIntervalMax,r.springStrength,r.mouseStrength,r.mouseRadius]);const i=o.useCallback(l=>{var s;(l.key==="e"||l.key==="E")&&((s=a.current)==null||s.scatter({velocity:12}))},[]);return o.useEffect(()=>(window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)),[i]),t.jsxs("div",{style:{minHeight:"100vh",background:n},children:[t.jsx("canvas",{ref:c,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},ee=e=>{const n=o.useRef(null),r=o.useRef(null);o.useEffect(()=>{const a=n.current;if(!a)return;const i=Z({canvas:a,preset:"imageText",renderer:e.renderer,autoResize:!0});return r.current=i,i.textToParticles("Particular",{x:window.innerWidth/2,y:window.innerHeight/2,width:Math.min(window.innerWidth*.8,800),resolution:e.resolution,shape:e.particleShape,homeConfig:G(e)}),i.addMouseForce({track:!0,strength:e.mouseStrength,radius:e.mouseRadius}),()=>{i.destroy(),r.current=null}},[e.renderer,e.resolution,e.particleShape,e.idlePulseStrength,e.idlePulseIntervalMin,e.idlePulseIntervalMax,e.springStrength,e.mouseStrength,e.mouseRadius]);const c=o.useCallback(a=>{var i;(a.key==="e"||a.key==="E")&&((i=r.current)==null||i.scatter({velocity:12}))},[]);return o.useEffect(()=>(window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)),[c]),t.jsxs("div",{style:{minHeight:"100vh",background:"#1a1a2e"},children:[t.jsx("canvas",{ref:n,style:O}),t.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},se={title:"Particular/Image to Particles",argTypes:Y,args:$},g={render:e=>t.jsx(ee,{...e})},h={render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:N(Q(400)),x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n})})}},w={render:e=>{const n=Math.min(window.innerWidth*.7,700);return t.jsx(d,{...e,buildImage:()=>({image:X,x:window.innerWidth/2,y:window.innerHeight/2,width:n}),background:"#0a0a1a"})}},p={render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:u,x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n}),background:"#1a1a2e"})}},I={name:"Intro — Scatter",render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:u,x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n,intro:{mode:"scatter"}}),background:"#1a1a2e"})}},v={name:"Intro — Scale In",render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:u,x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n,intro:{mode:"scaleIn"}}),background:"#1a1a2e"})}},x={name:"Intro — Ripple",render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:u,x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n,intro:{mode:"ripple"}}),background:"#1a1a2e"})}},y={name:"Intro — Paint",render:e=>{const n=Math.min(window.innerWidth,window.innerHeight)*.7;return t.jsx(d,{...e,buildImage:()=>({image:u,x:window.innerWidth/2,y:window.innerHeight/2,width:n,height:n,intro:{mode:"paint"}}),background:"#1a1a2e"})}};var f,b,S;g.parameters={...g.parameters,docs:{...(f=g.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <TextToParticlesDemo {...args} />
}`,...(S=(b=g.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var P,k,M;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: canvasToDataURL(createHeartImage(400)),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size
    })} />;
  }
}`,...(M=(k=h.parameters)==null?void 0:k.docs)==null?void 0:M.source}}};var H,W,z;w.parameters={...w.parameters,docs:{...(H=w.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: args => {
    const w = Math.min(window.innerWidth * 0.7, 700);
    return <ImageDemo {...args} buildImage={() => ({
      image: woltLogoSvg,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: w
    })} background="#0a0a1a" />;
  }
}`,...(z=(W=w.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};var R,E,T;p.parameters={...p.parameters,docs:{...(R=p.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size
    })} background="#1a1a2e" />;
  }
}`,...(T=(E=p.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var j,D,L;I.parameters={...I.parameters,docs:{...(j=I.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Intro — Scatter',
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      intro: {
        mode: 'scatter'
      }
    })} background="#1a1a2e" />;
  }
}`,...(L=(D=I.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var C,A,U;v.parameters={...v.parameters,docs:{...(C=v.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Intro — Scale In',
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      intro: {
        mode: 'scaleIn'
      }
    })} background="#1a1a2e" />;
  }
}`,...(U=(A=v.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};var q,B,F;x.parameters={...x.parameters,docs:{...(q=x.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Intro — Ripple',
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      intro: {
        mode: 'ripple'
      }
    })} background="#1a1a2e" />;
  }
}`,...(F=(B=x.parameters)==null?void 0:B.docs)==null?void 0:F.source}}};var K,V,_;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Intro — Paint',
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      intro: {
        mode: 'paint'
      }
    })} background="#1a1a2e" />;
  }
}`,...(_=(V=y.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};const de=["TextToParticles","Heart","WoltLogo","Viking","IntroScatter","IntroScaleIn","IntroRipple","IntroPaint"];export{h as Heart,y as IntroPaint,x as IntroRipple,v as IntroScaleIn,I as IntroScatter,g as TextToParticles,p as Viking,w as WoltLogo,de as __namedExportsOrder,se as default};
