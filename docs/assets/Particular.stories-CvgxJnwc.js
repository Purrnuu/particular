import{j as a}from"./jsx-runtime-BO8uF4Og.js";import{p as F,i as V,c as m,j as E,V as X,k as r}from"./storyArgs-D-Zr4-3w.js";import"./index-D4H_InIO.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const Y=""+new URL("smiley_sad-B3ElhsNA.png",import.meta.url).href,U=""+new URL("smiley_cry-yostEIDu.png",import.meta.url).href,_=""+new URL("smiley_sad_2-DV5sZIM6.png",import.meta.url).href,R=[Y,U,_],N=({burst:o})=>a.jsx("div",{onClick:e=>o({clientX:e.clientX,clientY:e.clientY}),style:{minHeight:"100vh",cursor:"pointer"},children:a.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CLICK FOR PARTICLES"})}),W=()=>a.jsx("div",{style:{minHeight:"100vh"},children:a.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CONTINUOUS AUTO-START"})});function n(o){const e={...E,...m,...o},t=e.velocity??m.velocity;return{renderer:e.renderer??"webgl",shape:e.shape,blendMode:e.blendMode,glow:e.glow,glowSize:e.glowSize,glowColor:e.glowColor,glowAlpha:e.glowAlpha,trail:e.trail,trailLength:e.trailLength,trailFade:e.trailFade,trailShrink:e.trailShrink,shadow:e.shadow,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,shadowColor:e.shadowColor,shadowAlpha:e.shadowAlpha,rate:e.rate,life:e.life,sizeMin:e.sizeMin,sizeMax:e.sizeMax,velocityMultiplier:e.velocityMultiplier,gravity:e.gravity,particleLife:e.particleLife,fadeTime:e.fadeTime,maxCount:e.maxCount,continuous:e.continuous,autoStart:e.autoStart,velocityAngle:t.getAngle()*180/Math.PI,velocityMagnitude:t.getMagnitude(),spread:e.spread/Math.PI,webglMaxInstances:e.webglMaxInstances}}function D(o,e){const t={...E,...m,...o},i=t.velocity??m.velocity,w=e.velocityAngle??i.getAngle()*180/Math.PI,j=e.velocityMagnitude??i.getMagnitude();return{...t,renderer:e.renderer??t.renderer??"webgl",shape:e.shape??t.shape,blendMode:e.blendMode??t.blendMode,glow:e.glow??t.glow,glowSize:e.glowSize??t.glowSize,glowColor:e.glowColor??t.glowColor,glowAlpha:e.glowAlpha??t.glowAlpha,trail:e.trail??t.trail,trailLength:e.trailLength??t.trailLength,trailFade:e.trailFade??t.trailFade,trailShrink:e.trailShrink??t.trailShrink,shadow:e.shadow??t.shadow,shadowBlur:e.shadowBlur??t.shadowBlur,shadowOffsetX:e.shadowOffsetX??t.shadowOffsetX,shadowOffsetY:e.shadowOffsetY??t.shadowOffsetY,shadowColor:e.shadowColor??t.shadowColor,shadowAlpha:e.shadowAlpha??t.shadowAlpha,rate:e.rate??t.rate,life:e.life??t.life,sizeMin:e.sizeMin??t.sizeMin,sizeMax:e.sizeMax??t.sizeMax,velocityMultiplier:e.velocityMultiplier??t.velocityMultiplier,gravity:e.gravity??t.gravity,particleLife:e.particleLife??t.particleLife,fadeTime:e.fadeTime??t.fadeTime,maxCount:e.maxCount??t.maxCount,continuous:e.continuous??t.continuous,autoStart:e.autoStart??t.autoStart,velocity:X.fromAngle(w*Math.PI/180,j),spread:(e.spread??t.spread/Math.PI)*Math.PI,webglMaxInstances:e.webglMaxInstances??t.webglMaxInstances}}const q={title:"Particular/Burst",component:()=>null,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...F,rate:{control:{type:"number",min:1,max:100},description:"Particles per burst",table:{category:"Emission"}},life:{control:{type:"number",min:8,max:200},description:"Emitter life (ticks)",table:{category:"Emission"}},continuous:{control:"boolean",description:"Continuous emission",table:{category:"Emission"}},autoStart:{control:"boolean",description:"Auto-start on mount",table:{category:"Emission"}},velocityAngle:{control:{type:"number",min:-180,max:180},description:"Velocity angle (degrees)",table:{category:"Size & Physics"}},velocityMagnitude:{control:{type:"number",min:1,max:15},description:"Velocity magnitude",table:{category:"Size & Physics"}},velocityMultiplier:{control:{type:"number",min:1,max:15},description:"Velocity multiplier",table:{category:"Size & Physics"}},spread:{control:{type:"number",min:.2,max:2,step:.1},description:"Spread (× π)",table:{category:"Size & Physics"}},webglMaxInstances:{control:{type:"number",min:1024,max:65536},description:"WebGL max instances per draw",table:{category:"Advanced"}}},args:n({...r.Burst.magic,renderer:"webgl"})},s=o=>e=>{const t=D(o,e),i=e.continuous?W:N,w=V(t)(i);return a.jsx(w,{burst:()=>{}},JSON.stringify(e))},l={args:n({...r.Burst.confetti,renderer:"webgl"}),render:s(r.Burst.confetti)},c={args:n({...r.Burst.magic,renderer:"webgl"}),render:s(r.Burst.magic)},u={args:n({...r.Images.showcase,renderer:"webgl"}),render:s({...r.Images.showcase,icons:R})},d={args:n({...r.Burst.fireworks,renderer:"webgl"}),render:s(r.Burst.fireworks)},g={args:n({...r.Burst.magic,renderer:"webgl",continuous:!0,autoStart:!0}),render:s({...r.Burst.magic,icons:R,continuous:!0,autoStart:!0})},p={args:n({...r.Burst.fireworks,renderer:"webgl",rate:220,life:120,maxCount:5e3,webglMaxInstances:16384,continuous:!0,autoStart:!0,glow:!1,shadow:!1}),render:s({...r.Burst.fireworks,rate:220,life:120,maxCount:5e3,continuous:!0,autoStart:!0,glow:!1,shadow:!1})};var h,f,y;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.confetti,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.confetti)
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var b,S,M;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.magic)
}`,...(M=(S=c.parameters)==null?void 0:S.docs)==null?void 0:M.source}}};var x,C,B;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Images.showcase,
    renderer: 'webgl'
  }),
  render: withBaseConfig({
    ...presets.Images.showcase,
    icons: customIcons
  })
}`,...(B=(C=u.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};var v,A,I;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.fireworks,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.fireworks)
}`,...(I=(A=d.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var k,z,P;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl',
    continuous: true,
    autoStart: true
  }),
  render: withBaseConfig({
    ...presets.Burst.magic,
    icons: customIcons,
    continuous: true,
    autoStart: true
  })
}`,...(P=(z=g.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var L,O,T;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.fireworks,
    renderer: 'webgl',
    rate: 220,
    life: 120,
    maxCount: 5000,
    webglMaxInstances: 16384,
    continuous: true,
    autoStart: true,
    glow: false,
    shadow: false
  }),
  render: withBaseConfig({
    ...presets.Burst.fireworks,
    rate: 220,
    life: 120,
    maxCount: 5000,
    continuous: true,
    autoStart: true,
    glow: false,
    shadow: false
  })
}`,...(T=(O=p.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};const Q=["Confetti","Magic","Images","Fireworks","Continuous","Performance5000"];export{l as Confetti,g as Continuous,d as Fireworks,u as Images,c as Magic,p as Performance5000,Q as __namedExportsOrder,q as default};
