import{j as n}from"./jsx-runtime-BO8uF4Og.js";import{r as g}from"./index-D4H_InIO.js";import{p as E}from"./ParticularWrapper-Bsa0qoYV.js";import{s as A}from"./convenience-B8C5EWMp.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const R=({renderer:a,rate:s,particleLife:i,sizeMin:o,sizeMax:c,gravity:m,maxCount:p,glowAlpha:l})=>{const u=g.useRef(null);return g.useEffect(()=>{const d=u.current;if(!d)return;const w=A({canvas:d,preset:"snow",config:{rate:s,particleLife:i,sizeMin:o,sizeMax:c,gravity:m,maxCount:p,glowAlpha:l},renderer:a,autoResize:!0});return()=>{w.destroy()}},[a,s,i,o,c,m,p,l]),n.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a1a"},children:[n.jsx("canvas",{ref:u,style:E}),n.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none",color:"rgba(255, 255, 255, 0.3)",fontWeight:300,letterSpacing:"0.1em"},children:"SCREENSAVER"})]})},O={title:"Particular/Screensaver",component:R,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend"},rate:{control:{type:"number",min:.1,max:20,step:.1},description:"Particles emitted per frame (fractional OK)"},particleLife:{control:{type:"number",min:50,max:1e3,step:10},description:"Individual particle lifetime in ticks"},sizeMin:{control:{type:"number",min:1,max:20,step:1},description:"Minimum particle size"},sizeMax:{control:{type:"number",min:1,max:30,step:1},description:"Maximum particle size"},gravity:{control:{type:"number",min:0,max:.5,step:.01},description:"Gravity pull strength"},maxCount:{control:{type:"number",min:50,max:1e3,step:10},description:"Maximum simultaneous particles"},glowAlpha:{control:{type:"number",min:0,max:1,step:.05},description:"Glow opacity"}},args:{renderer:"webgl",rate:.4,particleLife:400,sizeMin:2,sizeMax:6,gravity:.02,maxCount:200,glowAlpha:.2}},e={},r={args:{rate:1.5,maxCount:400,sizeMin:3,sizeMax:10}},t={args:{rate:.15,maxCount:80,particleLife:600,sizeMin:1,sizeMax:4,gravity:.01,glowAlpha:.15}};var x,y,f;e.parameters={...e.parameters,docs:{...(x=e.parameters)==null?void 0:x.docs,source:{originalSource:"{}",...(f=(y=e.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var v,S,b;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    rate: 1.5,
    maxCount: 400,
    sizeMin: 3,
    sizeMax: 10
  }
}`,...(b=(S=r.parameters)==null?void 0:S.docs)==null?void 0:b.source}}};var z,M,h;t.parameters={...t.parameters,docs:{...(z=t.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    rate: 0.15,
    maxCount: 80,
    particleLife: 600,
    sizeMin: 1,
    sizeMax: 4,
    gravity: 0.01,
    glowAlpha: 0.15
  }
}`,...(h=(M=t.parameters)==null?void 0:M.docs)==null?void 0:h.source}}};const P=["Snow","HeavySnow","GentleAmbient"];export{t as GentleAmbient,r as HeavySnow,e as Snow,P as __namedExportsOrder,O as default};
