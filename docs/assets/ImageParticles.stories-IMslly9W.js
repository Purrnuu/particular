import{j as s}from"./jsx-runtime-BO8uF4Og.js";import{r as o}from"./index-D4H_InIO.js";import{i as d,p as f}from"./ParticularWrapper-C1ZRzle7.js";import{a as B,b as U,c as y}from"./index-BAM2ysdz.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const q="data:image/svg+xml,%3csvg%20viewBox='0%200%2062%2023'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fillRule='evenodd'%20clipRule='evenodd'%20d='M35.477%2013.771c-1.09-.807-1.56-2.266-1.174-4.558.013-.073.044-.201.085-.358a2.07%202.07%200%2000-.773-.13c-2.571%200-4.003%204.347-4.003%208.386%200%202.106.82%203.167%202.046%203.167%201.7%200%203.262-2.96%203.82-6.507zm21.197-4.074s-1.229%205.928-1.229%208.12c0%201.524.708%202.046%201.582%202.046%201.105%200%202.12-.7%203.065-2.437.217-.399%201.011-.15%201.427.331.182.21-.027.632-.313%201.116-1.433%202.423-3.456%203.762-5.559%203.762-2.29%200-3.699-1.071-4.051-3.78-1.314%202.073-3.417%203.78-5.827%203.78-2.93%200-4.176-1.627-4.176-4.545%200-1.925.646-5.203.646-5.203-.858.775-1.853%201.336-2.998%201.57-1.126%205.292-4.14%208.178-8.188%208.178-3.43%200-5.785-1.808-5.785-6.144%200-5.352%203.397-10.12%208.727-10.12%203.035%200%205.238%201.633%205.432%205.435%201.248-.211%202.401-1.068%203.405-2.29a166.805%20166.805%200%20011.492-7.994c.082-.384.222-1.105.904-1.318.764-.24%201.855-.282%203.002-.053.636.127.798.723.798%201.256%200%201.416-.67%204.541-1.833%207.352-.824%203.132-1.39%206.258-1.39%208.73%200%201.786.59%202.374%201.577%202.374%201.612%200%203.485-2.246%204.386-5.29.14-1.463.51-3.818.695-4.695-.998.048-1.637.077-1.637.077-.52.019-1.023-.2-.998-.666a9.295%209.295%200%2001.221-1.619c.103-.415.34-.673.842-.682.538-.01%201.313-.003%202.11.016.27-1.544.495-2.75.712-3.751.087-.401.461-.632.846-.675.46-.052%201.833-.042%202.43.103.603.147.855.62.75%201.1-.213.977-.648%203.373-.648%203.373%202.15.096%204.018.194%204.018.194.644.03.975.393.872.962-.173.955-.882%201.262-1.883%201.285-1.142.026-2.343.063-3.424.102zm-30.9-7.643c0%206.672-3.566%2020.538-9.093%2020.538-4.17%200-5.007-4.678-5.222-10.638-2.09%204.574-3.196%206.949-4.577%209.327-.652%201.122-1.436%201.354-2.292%201.354-.754%200-2.699-.253-3.152-.535-.453-.282-.702-.536-.924-1.614-1.027-4.984-.363-11.43.658-16.57.178-.898.408-1.332%201.026-1.738.66-.434%202.121-.464%203.073-.481.506-.009.8.356.672.974-.92%204.487-1.998%2010.635-1.158%2016.973%200%200%203.181-6.323%206.478-14.195.662-1.58.81-2.1%201.44-2.24.823-.183%201.417-.183%202.247-.082.548.067.823.21.802.97-.058%202.052-.195%204.373-.195%206.783%200%204.079.436%208.663%202.002%208.663%202.103%200%203.95-9.809%203.297-18.237-.045-.582.165-1.174.785-1.238.31-.032.94-.068%201.648-.068%201.615%200%202.486.289%202.486%202.054z'%20fill='%23ffffff'%20/%3e%3c/svg%3e",V=""+new URL("viking-CvdpZzc3.png",import.meta.url).href;function x(e){return{springStrength:e.springStrength,idlePulseStrength:e.idlePulseStrength,idlePulseIntervalMin:e.idlePulseIntervalMin,idlePulseIntervalMax:e.idlePulseIntervalMax}}const _={renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},resolution:{control:{type:"number",min:20,max:500,step:10},description:"Particle grid resolution (particles along longest axis)",table:{category:"Image"}},particleShape:{control:"radio",options:["circle","square","triangle"],description:"Shape of individual particles",table:{category:"Image"}},idlePulseStrength:{control:{type:"number",min:0,max:3,step:.1},description:"Idle pulse velocity (0 = off). Particles randomly twitch and spring back.",table:{category:"Idle Animation"}},idlePulseIntervalMin:{control:{type:"number",min:60,max:1800,step:60},description:"Minimum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},idlePulseIntervalMax:{control:{type:"number",min:60,max:3600,step:60},description:"Maximum ticks between pulse waves (~60 ticks = 1 sec)",table:{category:"Idle Animation"}},springStrength:{control:{type:"number",min:.005,max:.1,step:.005},description:"Spring return force strength",table:{category:"Physics"}},mouseStrength:{control:{type:"number",min:0,max:10,step:.5},description:"Mouse push force strength",table:{category:"Mouse"}},mouseRadius:{control:{type:"number",min:20,max:200,step:10},description:"Mouse force radius",table:{category:"Mouse"}}},O={renderer:"webgl",resolution:200,particleShape:"square",idlePulseStrength:d.idlePulseStrength,idlePulseIntervalMin:d.idlePulseIntervalMin,idlePulseIntervalMax:d.idlePulseIntervalMax,springStrength:d.springStrength,mouseStrength:3,mouseRadius:80},v=({buildImage:e,background:r="#1a1a2e",...n})=>{const a=o.useRef(null),i=o.useRef(null);o.useEffect(()=>{const c=a.current;if(!c)return;const l=y({canvas:c,preset:"imageShape",renderer:n.renderer,autoResize:!0});i.current=l;const F=e();return l.imageToParticles({...F,resolution:n.resolution,shape:n.particleShape,homeConfig:x(n)}),l.addMouseForce({track:!0,strength:n.mouseStrength,radius:n.mouseRadius}),()=>{l.destroy(),i.current=null}},[n.renderer,n.resolution,n.particleShape,n.idlePulseStrength,n.idlePulseIntervalMin,n.idlePulseIntervalMax,n.springStrength,n.mouseStrength,n.mouseRadius]);const t=o.useCallback(c=>{var l;(c.key==="e"||c.key==="E")&&((l=i.current)==null||l.scatter({velocity:12}))},[]);return o.useEffect(()=>(window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)),[t]),s.jsxs("div",{style:{minHeight:"100vh",background:r},children:[s.jsx("canvas",{ref:a,style:f}),s.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},Z=e=>{const r=o.useRef(null),n=o.useRef(null);o.useEffect(()=>{const i=r.current;if(!i)return;const t=y({canvas:i,preset:"imageText",renderer:e.renderer,autoResize:!0});return n.current=t,t.textToParticles("Particular",{x:window.innerWidth/2,y:window.innerHeight/2,width:Math.min(window.innerWidth*.8,800),resolution:e.resolution,shape:e.particleShape,homeConfig:x(e)}),t.addMouseForce({track:!0,strength:e.mouseStrength,radius:e.mouseRadius}),()=>{t.destroy(),n.current=null}},[e.renderer,e.resolution,e.particleShape,e.idlePulseStrength,e.idlePulseIntervalMin,e.idlePulseIntervalMax,e.springStrength,e.mouseStrength,e.mouseRadius]);const a=o.useCallback(i=>{var t;(i.key==="e"||i.key==="E")&&((t=n.current)==null||t.scatter({velocity:12}))},[]);return o.useEffect(()=>(window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)),[a]),s.jsxs("div",{style:{minHeight:"100vh",background:"#1a1a2e"},children:[s.jsx("canvas",{ref:r,style:f}),s.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})},$={title:"Particular/Image to Particles",argTypes:_,args:O},u={render:e=>s.jsx(Z,{...e})},m={render:e=>{const r=Math.min(window.innerWidth,window.innerHeight)*.7;return s.jsx(v,{...e,buildImage:()=>({image:B(U(400)),x:window.innerWidth/2,y:window.innerHeight/2,width:r,height:r})})}},g={render:e=>{const r=Math.min(window.innerWidth*.7,700);return s.jsx(v,{...e,buildImage:()=>({image:q,x:window.innerWidth/2,y:window.innerHeight/2,width:r}),background:"#0a0a1a"})}},h={render:e=>{const r=Math.min(window.innerWidth,window.innerHeight)*.7;return s.jsx(v,{...e,buildImage:()=>({image:V,x:window.innerWidth/2,y:window.innerHeight/2,width:r,height:r}),background:"#1a1a2e"})}},p={name:"Intro — Viking",render:e=>{const r=Math.min(window.innerWidth,window.innerHeight)*.7;return s.jsx(v,{...e,buildImage:()=>({image:V,x:window.innerWidth/2,y:window.innerHeight/2,width:r,height:r,intro:{}}),background:"#1a1a2e"})}},w={name:"Intro — Text",render:e=>{const r=o.useRef(null),n=o.useRef(null);o.useEffect(()=>{const i=r.current;if(!i)return;const t=y({canvas:i,preset:"imageText",renderer:e.renderer,autoResize:!0});return n.current=t,t.textToParticles("Particular",{x:window.innerWidth/2,y:window.innerHeight/2,width:Math.min(window.innerWidth*.8,800),resolution:e.resolution,shape:e.particleShape,homeConfig:x(e),intro:{}}),t.addMouseForce({track:!0,strength:e.mouseStrength,radius:e.mouseRadius}),()=>{t.destroy(),n.current=null}},[e.renderer,e.resolution,e.particleShape,e.idlePulseStrength,e.idlePulseIntervalMin,e.idlePulseIntervalMax,e.springStrength,e.mouseStrength,e.mouseRadius]);const a=o.useCallback(i=>{var t;(i.key==="e"||i.key==="E")&&((t=n.current)==null||t.scatter({velocity:12}))},[]);return o.useEffect(()=>(window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)),[a]),s.jsxs("div",{style:{minHeight:"100vh",background:"#1a1a2e"},children:[s.jsx("canvas",{ref:r,style:f}),s.jsx("p",{style:{textAlign:"center",paddingTop:"85vh",pointerEvents:"none",userSelect:"none",opacity:.5,color:"#fff"},children:"Move mouse to push particles · Press E to scatter"})]})}};var S,P,k;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: args => <TextToParticlesDemo {...args} />
}`,...(k=(P=u.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var I,b,M;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(M=(b=m.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var R,E,H;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: args => {
    const w = Math.min(window.innerWidth * 0.7, 700);
    return <ImageDemo {...args} buildImage={() => ({
      image: woltLogoSvg,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: w
    })} background="#0a0a1a" />;
  }
}`,...(H=(E=g.parameters)==null?void 0:E.docs)==null?void 0:H.source}}};var T,W,z;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(z=(W=h.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};var L,j,D;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Intro — Viking',
  render: args => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return <ImageDemo {...args} buildImage={() => ({
      image: vikingPng,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: size,
      height: size,
      intro: {}
    })} background="#1a1a2e" />;
  }
}`,...(D=(j=p.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var C,A,K;w.parameters={...w.parameters,docs:{...(C=w.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Intro — Text',
  render: args => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const controllerRef = useRef<ParticlesController | null>(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const controller = createParticles({
        canvas,
        preset: 'imageText',
        renderer: args.renderer,
        autoResize: true
      });
      controllerRef.current = controller;
      controller.textToParticles('Particular', {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        width: Math.min(window.innerWidth * 0.8, 800),
        resolution: args.resolution,
        shape: args.particleShape,
        homeConfig: buildHomeConfig(args),
        intro: {}
      });
      controller.addMouseForce({
        track: true,
        strength: args.mouseStrength,
        radius: args.mouseRadius
      });
      return () => {
        controller.destroy();
        controllerRef.current = null;
      };
    }, [args.renderer, args.resolution, args.particleShape, args.idlePulseStrength, args.idlePulseIntervalMin, args.idlePulseIntervalMax, args.springStrength, args.mouseStrength, args.mouseRadius]);
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        controllerRef.current?.scatter({
          velocity: 12
        });
      }
    }, []);
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    return <div style={{
      minHeight: '100vh',
      background: '#1a1a2e'
    }}>
        <canvas ref={canvasRef} style={particlesBackgroundLayerStyle} />
        <p style={{
        textAlign: 'center',
        paddingTop: '85vh',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.5,
        color: '#fff'
      }}>
          Move mouse to push particles &middot; Press E to scatter
        </p>
      </div>;
  }
}`,...(K=(A=w.parameters)==null?void 0:A.docs)==null?void 0:K.source}}};const ee=["TextToParticles","Heart","WoltLogo","Viking","IntroViking","IntroText"];export{m as Heart,w as IntroText,p as IntroViking,u as TextToParticles,h as Viking,g as WoltLogo,ee as __namedExportsOrder,$ as default};
