import{j as s}from"./jsx-runtime-BO8uF4Og.js";import{r as w}from"./index-D4H_InIO.js";import{b as R,d as T,c as a,p as D}from"./ParticularWrapper-B79tWvF0.js";import{s as B}from"./screensaver-CdzQqlqN.js";import{p as H,r as k,a as N}from"./storyArgs-BFoYSCCx.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";import"./index-FU1arHEz.js";const e={...T,...R.Ambient.snow},G=l=>{const{renderer:c,rate:d,windStrength:F,windRadius:E,windDamping:O,windMaxSpeed:P,windFalloff:W}=l,m=N(l),p=w.useRef(null),g={strength:F,radius:E,damping:O,maxSpeed:P,falloff:W};return w.useEffect(()=>{const f=p.current;if(!f)return;const j=B({canvas:f,preset:"snow",config:{rate:d,...m},renderer:c,autoResize:!0,mouseWind:g});return()=>{j.destroy()}},[c,d,JSON.stringify(m),JSON.stringify(g)]),s.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a1a"},children:[s.jsx("canvas",{ref:p,style:D}),s.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none",color:"rgba(255, 255, 255, 0.3)",fontWeight:300,letterSpacing:"0.1em"},children:"SCREENSAVER"})]})},Q={title:"Particular/Screensaver",component:G,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...H,rate:{control:{type:"number",min:.1,max:20,step:.1},description:"Particles emitted per frame (fractional OK)",table:{category:"Screensaver"}},windStrength:{control:{type:"number",min:0,max:2,step:.01},description:"Mouse wind force strength",table:{category:"Mouse Wind"}},windRadius:{control:{type:"number",min:10,max:1e3,step:10},description:"Mouse wind effect radius (px)",table:{category:"Mouse Wind"}},windDamping:{control:{type:"number",min:.5,max:1,step:.01},description:"Mouse wind velocity damping per frame",table:{category:"Mouse Wind"}},windMaxSpeed:{control:{type:"number",min:1,max:50,step:1},description:"Mouse wind max speed cap",table:{category:"Mouse Wind"}},windFalloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Mouse wind falloff exponent (<1 broad, >1 localized)",table:{category:"Mouse Wind"}}},args:{colorPalette:k(e.colors),renderer:"webgl",shape:e.shape,blendMode:e.blendMode,glow:e.glow,glowSize:e.glowSize,glowColor:e.glowColor,glowAlpha:e.glowAlpha,trail:e.trail,trailLength:e.trailLength,trailFade:e.trailFade,trailShrink:e.trailShrink,shadow:e.shadow,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,shadowColor:e.shadowColor,shadowAlpha:e.shadowAlpha,rate:e.rate,sizeMin:e.sizeMin,sizeMax:e.sizeMax,gravity:e.gravity,acceleration:e.acceleration,accelerationSize:e.accelerationSize,friction:e.friction,frictionSize:e.frictionSize,particleLife:e.particleLife,fadeTime:e.fadeTime,maxCount:e.maxCount,windStrength:a.strength,windRadius:a.radius,windDamping:a.damping,windMaxSpeed:a.maxSpeed,windFalloff:a.falloff}},t={},o={args:{rate:1.5,maxCount:400,sizeMin:3,sizeMax:10}},i={args:{rate:.15,maxCount:80,particleLife:600,sizeMin:1,sizeMax:4,gravity:.01,glowAlpha:.15}},r={...T,...R.Ambient.meteors},n={args:{colorPalette:k(r.colors),shape:r.shape,blendMode:r.blendMode,glow:r.glow,glowSize:r.glowSize,glowColor:r.glowColor,glowAlpha:r.glowAlpha,trail:r.trail,trailLength:r.trailLength,trailFade:r.trailFade,trailShrink:r.trailShrink,shadow:r.shadow,rate:r.rate,sizeMin:r.sizeMin,sizeMax:r.sizeMax,gravity:r.gravity,acceleration:r.acceleration,accelerationSize:r.accelerationSize,friction:r.friction,frictionSize:r.frictionSize,particleLife:r.particleLife,fadeTime:r.fadeTime,maxCount:r.maxCount}};var u,h,S;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(S=(h=t.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var x,M,z;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    rate: 1.5,
    maxCount: 400,
    sizeMin: 3,
    sizeMax: 10
  }
}`,...(z=(M=o.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var y,b,v;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    rate: 0.15,
    maxCount: 80,
    particleLife: 600,
    sizeMin: 1,
    sizeMax: 4,
    gravity: 0.01,
    glowAlpha: 0.15
  }
}`,...(v=(b=i.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var C,A,L;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    colorPalette: resolveColorPalette(meteor.colors),
    shape: meteor.shape,
    blendMode: meteor.blendMode,
    glow: meteor.glow,
    glowSize: meteor.glowSize,
    glowColor: meteor.glowColor,
    glowAlpha: meteor.glowAlpha,
    trail: meteor.trail,
    trailLength: meteor.trailLength,
    trailFade: meteor.trailFade,
    trailShrink: meteor.trailShrink,
    shadow: meteor.shadow,
    rate: meteor.rate,
    sizeMin: meteor.sizeMin,
    sizeMax: meteor.sizeMax,
    gravity: meteor.gravity,
    acceleration: meteor.acceleration,
    accelerationSize: meteor.accelerationSize,
    friction: meteor.friction,
    frictionSize: meteor.frictionSize,
    particleLife: meteor.particleLife,
    fadeTime: meteor.fadeTime,
    maxCount: meteor.maxCount
  }
}`,...(L=(A=n.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};const U=["Snow","HeavySnow","GentleAmbient","Meteors"];export{i as GentleAmbient,o as HeavySnow,n as Meteors,t as Snow,U as __namedExportsOrder,Q as default};
