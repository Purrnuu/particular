import{j as n}from"./jsx-runtime-BO8uF4Og.js";import{r as t}from"./index-D4H_InIO.js";import{p as f}from"./canvasStyles-Dq_me5Kf.js";import{c as x}from"./index-B1xL92ey.js";const E=({renderer:e})=>{const a=t.useRef(null),o=t.useRef(null);t.useEffect(()=>{const r=a.current;if(!r)return;const c=x({canvas:r,preset:"magic",renderer:e,autoResize:!0,autoClick:!0});return o.current=c,()=>{c.destroy(),o.current=null}},[e]);const s=t.useCallback(r=>{var c;(r.key==="e"||r.key==="E")&&((c=o.current)==null||c.explode())},[]);return t.useEffect(()=>(window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)),[s]),n.jsxs("div",{style:{minHeight:"100vh",cursor:"pointer"},children:[n.jsx("canvas",{ref:a,style:f},e),n.jsx("h1",{style:{textAlign:"center",paddingTop:"40vh",pointerEvents:"none",userSelect:"none"},children:"CLICK TO BURST, PRESS E TO EXPLODE"}),n.jsx("p",{style:{textAlign:"center",pointerEvents:"none",userSelect:"none",opacity:.6},children:"Burst some particles first, then press E to explode them into sub-bursts"})]})},k={title:"Particular/Explosion",component:E,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"}},i={},v=({renderer:e})=>{const a=t.useRef(null),o=t.useRef(null);return t.useEffect(()=>{const s=a.current;if(!s)return;const r=x({canvas:s,preset:"fireworksDetonation",renderer:e,autoResize:!0,autoClick:!0});return o.current=r,()=>{r.destroy(),o.current=null}},[e]),n.jsxs("div",{style:{minHeight:"100vh",cursor:"pointer"},children:[n.jsx("canvas",{ref:a,style:f},e),n.jsx("h1",{style:{textAlign:"center",paddingTop:"40vh",pointerEvents:"none",userSelect:"none"},children:"CLICK TO LAUNCH FIREWORKS"}),n.jsx("p",{style:{textAlign:"center",pointerEvents:"none",userSelect:"none",opacity:.6},children:"Particles rise, then auto-detonate into bursts"})]})},l={argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"},render:e=>n.jsx(v,{...e})};var u,d,p;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var g,m,y;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
  render: args => <DetonationDemo {...args as unknown as DetonationStoryArgs} />
}`,...(y=(m=l.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const S=["Explosion","FireworksDetonation"];export{i as Explosion,l as FireworksDetonation,S as __namedExportsOrder,k as default};
