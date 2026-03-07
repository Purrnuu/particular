import{j as t}from"./jsx-runtime-BO8uF4Og.js";import{r as l}from"./index-D4H_InIO.js";import{d as z,p as h,a as w,b as A}from"./storyArgs-D-Zr4-3w.js";import{s as M}from"./convenience-Dzh7LLDr.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const C=n=>{const{renderer:s,rate:o}=n,i=w(n),c=l.useRef(null);return l.useEffect(()=>{const p=c.current;if(!p)return;const b=M({canvas:p,preset:"snow",config:{rate:o,...i},renderer:s,autoResize:!0});return()=>{b.destroy()}},[s,o,JSON.stringify(i)]),t.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a1a"},children:[t.jsx("canvas",{ref:c,style:A}),t.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none",color:"rgba(255, 255, 255, 0.3)",fontWeight:300,letterSpacing:"0.1em"},children:"SCREENSAVER"})]})},H={title:"Particular/Screensaver",component:C,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...h,rate:{control:{type:"number",min:.1,max:20,step:.1},description:"Particles emitted per frame (fractional OK)",table:{category:"Screensaver"}}},args:{...z,renderer:"webgl",rate:.4,particleLife:400,sizeMin:2,sizeMax:6,gravity:.02,maxCount:200,glowAlpha:.2}},e={},r={args:{rate:1.5,maxCount:400,sizeMin:3,sizeMax:10}},a={args:{rate:.15,maxCount:80,particleLife:600,sizeMin:1,sizeMax:4,gravity:.01,glowAlpha:.15}};var m,g,d;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:"{}",...(d=(g=e.parameters)==null?void 0:g.docs)==null?void 0:d.source}}};var u,f,x;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    rate: 1.5,
    maxCount: 400,
    sizeMin: 3,
    sizeMax: 10
  }
}`,...(x=(f=r.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var y,S,v;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    rate: 0.15,
    maxCount: 80,
    particleLife: 600,
    sizeMin: 1,
    sizeMax: 4,
    gravity: 0.01,
    glowAlpha: 0.15
  }
}`,...(v=(S=a.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};const O=["Snow","HeavySnow","GentleAmbient"];export{a as GentleAmbient,r as HeavySnow,e as Snow,O as __namedExportsOrder,H as default};
