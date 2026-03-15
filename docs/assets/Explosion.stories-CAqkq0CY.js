import{j as e}from"./jsx-runtime-BO8uF4Og.js";import{r as n}from"./index-D4H_InIO.js";import{p as f}from"./ParticularWrapper-CJPU0Jac.js";import{c as x}from"./convenience-Dd2N-Eme.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const E=({renderer:t})=>{const a=n.useRef(null),o=n.useRef(null);n.useEffect(()=>{const r=a.current;if(!r)return;const c=x({canvas:r,preset:"magic",renderer:t,autoResize:!0,autoClick:!0});return o.current=c,()=>{c.destroy(),o.current=null}},[t]);const s=n.useCallback(r=>{var c;(r.key==="e"||r.key==="E")&&((c=o.current)==null||c.explode())},[]);return n.useEffect(()=>(window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)),[s]),e.jsxs("div",{style:{minHeight:"100vh",cursor:"pointer"},children:[e.jsx("canvas",{ref:a,style:f}),e.jsx("h1",{style:{textAlign:"center",paddingTop:"40vh",pointerEvents:"none",userSelect:"none"},children:"CLICK TO BURST, PRESS E TO EXPLODE"}),e.jsx("p",{style:{textAlign:"center",pointerEvents:"none",userSelect:"none",opacity:.6},children:"Burst some particles first, then press E to explode them into sub-bursts"})]})},j={title:"Particular/Explosion",component:E,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"}},i={},v=({renderer:t})=>{const a=n.useRef(null),o=n.useRef(null);return n.useEffect(()=>{const s=a.current;if(!s)return;const r=x({canvas:s,preset:"fireworksDetonation",renderer:t,autoResize:!0,autoClick:!0});return o.current=r,()=>{r.destroy(),o.current=null}},[t]),e.jsxs("div",{style:{minHeight:"100vh",cursor:"pointer"},children:[e.jsx("canvas",{ref:a,style:f}),e.jsx("h1",{style:{textAlign:"center",paddingTop:"40vh",pointerEvents:"none",userSelect:"none"},children:"CLICK TO LAUNCH FIREWORKS"}),e.jsx("p",{style:{textAlign:"center",pointerEvents:"none",userSelect:"none",opacity:.6},children:"Particles rise, then auto-detonate into bursts"})]})},l={argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"},render:t=>e.jsx(v,{...t})};var u,d,p;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var g,m,y;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(y=(m=l.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const D=["Explosion","FireworksDetonation"];export{i as Explosion,l as FireworksDetonation,D as __namedExportsOrder,j as default};
