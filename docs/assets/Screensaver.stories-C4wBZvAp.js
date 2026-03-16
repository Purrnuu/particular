import{j as n}from"./jsx-runtime-BO8uF4Og.js";import{r as u}from"./index-D4H_InIO.js";import{a as x,d as D,e as l,p as B,c as G,E as J,V as K}from"./ParticularWrapper-DgNwzfkn.js";import{c as X}from"./index-CTTsPjku.js";import{s as Y}from"./screensaver-CkRe1k-l.js";import{p as _,r as N,a as I}from"./storyArgs-DZbc_2NB.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const e={...D,...x.Ambient.snow},q=t=>{const{renderer:o,rate:i,windStrength:s,windRadius:c,windDamping:d,windMaxSpeed:h,windFalloff:S}=t,a=I(t),y=u.useRef(null),M={strength:s,radius:c,damping:d,maxSpeed:h,falloff:S};return u.useEffect(()=>{const b=y.current;if(!b)return;const V=Y({canvas:b,preset:"snow",config:{rate:i,...a},renderer:o,autoResize:!0,mouseWind:M});return()=>{V.destroy()}},[o,i,JSON.stringify(a),JSON.stringify(M)]),n.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a1a"},children:[n.jsx("canvas",{ref:y,style:B}),n.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none",color:"rgba(255, 255, 255, 0.3)",fontWeight:300,letterSpacing:"0.1em"},children:"SCREENSAVER"})]})},oe={title:"Particular/Screensaver",component:q,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},..._,rate:{control:{type:"number",min:.1,max:20,step:.1},description:"Particles emitted per frame (fractional OK)",table:{category:"Screensaver"}},windStrength:{control:{type:"number",min:0,max:2,step:.01},description:"Mouse wind force strength",table:{category:"Mouse Wind"}},windRadius:{control:{type:"number",min:10,max:1e3,step:10},description:"Mouse wind effect radius (px)",table:{category:"Mouse Wind"}},windDamping:{control:{type:"number",min:.5,max:1,step:.01},description:"Mouse wind velocity damping per frame",table:{category:"Mouse Wind"}},windMaxSpeed:{control:{type:"number",min:1,max:50,step:1},description:"Mouse wind max speed cap",table:{category:"Mouse Wind"}},windFalloff:{control:{type:"number",min:.1,max:5,step:.1},description:"Mouse wind falloff exponent (<1 broad, >1 localized)",table:{category:"Mouse Wind"}}},args:{colorPalette:N(e.colors),renderer:"webgl",shape:e.shape,blendMode:e.blendMode,glow:e.glow,glowSize:e.glowSize,glowColor:e.glowColor,glowAlpha:e.glowAlpha,trail:e.trail,trailLength:e.trailLength,trailFade:e.trailFade,trailShrink:e.trailShrink,shadow:e.shadow,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,shadowColor:e.shadowColor,shadowAlpha:e.shadowAlpha,rate:e.rate,sizeMin:e.sizeMin,sizeMax:e.sizeMax,gravity:e.gravity,acceleration:e.acceleration,accelerationSize:e.accelerationSize,friction:e.friction,frictionSize:e.frictionSize,particleLife:e.particleLife,fadeTime:e.fadeTime,maxCount:e.maxCount,windStrength:l.strength,windRadius:l.radius,windDamping:l.damping,windMaxSpeed:l.maxSpeed,windFalloff:l.falloff}},m={},g={args:{rate:1.5,maxCount:400,sizeMin:3,sizeMax:10}},p={args:{rate:.15,maxCount:80,particleLife:600,sizeMin:1,sizeMax:4,gravity:.01,glowAlpha:.15}},r={...D,...x.Ambient.meteors},w={args:{colorPalette:N(r.colors),shape:r.shape,blendMode:r.blendMode,glow:r.glow,glowSize:r.glowSize,glowColor:r.glowColor,glowAlpha:r.glowAlpha,trail:r.trail,trailLength:r.trailLength,trailFade:r.trailFade,trailShrink:r.trailShrink,shadow:r.shadow,rate:r.rate,sizeMin:r.sizeMin,sizeMax:r.sizeMax,gravity:r.gravity,acceleration:r.acceleration,accelerationSize:r.accelerationSize,friction:r.friction,frictionSize:r.frictionSize,particleLife:r.particleLife,fadeTime:r.fadeTime,maxCount:r.maxCount}},Q=({renderer:t})=>{const o=u.useRef(null);return u.useEffect(()=>{const i=o.current;if(!i)return;const s=X({canvas:i,preset:"fireworksShow",renderer:t,autoResize:!0}),c=s.engine.pixelRatio,d=window.innerWidth/c,h=window.innerHeight/c,S=G(x.Ambient.fireworksShow),a=new J({point:new K(d/2,h),...S,spawnWidth:d*.8,spawnHeight:0,icons:[]});return s.engine.addEmitter(a),a.isEmitting=!0,a.emit(),()=>s.destroy()},[t]),n.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a1a"},children:[n.jsx("canvas",{ref:o,style:B}),n.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none",color:"rgba(255, 255, 255, 0.15)",fontWeight:300,letterSpacing:"0.1em"},children:"FIREWORKS SHOW"})]})},f={argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}}},args:{renderer:"webgl"},render:t=>n.jsx(Q,{...t})};var z,v,C;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:"{}",...(C=(v=m.parameters)==null?void 0:v.docs)==null?void 0:C.source}}};var R,A,k;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    rate: 1.5,
    maxCount: 400,
    sizeMin: 3,
    sizeMax: 10
  }
}`,...(k=(A=g.parameters)==null?void 0:A.docs)==null?void 0:k.source}}};var E,L,F;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    rate: 0.15,
    maxCount: 80,
    particleLife: 600,
    sizeMin: 1,
    sizeMax: 4,
    gravity: 0.01,
    glowAlpha: 0.15
  }
}`,...(F=(L=p.parameters)==null?void 0:L.docs)==null?void 0:F.source}}};var W,T,O;w.parameters={...w.parameters,docs:{...(W=w.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(O=(T=w.parameters)==null?void 0:T.docs)==null?void 0:O.source}}};var P,j,H;f.parameters={...f.parameters,docs:{...(P=f.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
  render: args => <FireworksShowDemo {...args as unknown as {
    renderer: 'canvas' | 'webgl';
  }} />
}`,...(H=(j=f.parameters)==null?void 0:j.docs)==null?void 0:H.source}}};const ie=["Snow","HeavySnow","GentleAmbient","Meteors","FireworksShow"];export{f as FireworksShow,p as GentleAmbient,g as HeavySnow,w as Meteors,m as Snow,ie as __namedExportsOrder,oe as default};
