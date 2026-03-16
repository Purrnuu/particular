import{j as s}from"./jsx-runtime-BO8uF4Og.js";import{j as V,d as m,f as E,g as X,V as Y,a as r}from"./ParticularWrapper-B6i1Uv6z.js";import"./index-D4H_InIO.js";import{p as U,r as _}from"./storyArgs-Gco32Ux_.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const N=""+new URL("smiley_sad-B3ElhsNA.png",import.meta.url).href,W=""+new URL("smiley_cry-yostEIDu.png",import.meta.url).href,D=""+new URL("smiley_sad_2-DV5sZIM6.png",import.meta.url).href,R=[N,W,D],H=({burst:o})=>s.jsx("div",{onClick:e=>o({clientX:e.clientX,clientY:e.clientY}),style:{minHeight:"100vh",cursor:"pointer"},children:s.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CLICK FOR PARTICLES"})}),G=()=>s.jsx("div",{style:{minHeight:"100vh"},children:s.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CONTINUOUS AUTO-START"})});function n(o){const e={...E,...m,...o},t=e.velocity??m.velocity;return{colorPalette:_(e.colors),renderer:e.renderer??"webgl",shape:e.shape,blendMode:e.blendMode,glow:e.glow,glowSize:e.glowSize,glowColor:e.glowColor,glowAlpha:e.glowAlpha,trail:e.trail,trailLength:e.trailLength,trailFade:e.trailFade,trailShrink:e.trailShrink,shadow:e.shadow,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,shadowColor:e.shadowColor,shadowAlpha:e.shadowAlpha,rate:e.rate,life:e.life,sizeMin:e.sizeMin,sizeMax:e.sizeMax,velocityMultiplier:e.velocityMultiplier,gravity:e.gravity,acceleration:e.acceleration,accelerationSize:e.accelerationSize,friction:e.friction,frictionSize:e.frictionSize,particleLife:e.particleLife,fadeTime:e.fadeTime,maxCount:e.maxCount,continuous:e.continuous,autoStart:e.autoStart,velocityAngle:t.getAngle()*180/Math.PI,velocityMagnitude:t.getMagnitude(),spread:e.spread/Math.PI,webglMaxInstances:e.webglMaxInstances}}function J(o,e){const t={...E,...m,...o},i=t.velocity??m.velocity,w=e.velocityAngle??i.getAngle()*180/Math.PI,j=e.velocityMagnitude??i.getMagnitude(),F=e.colorPalette!=null?e.colorPalette==="random"?[]:X[e.colorPalette]??[]:t.colors;return{...t,colors:F,renderer:e.renderer??t.renderer??"webgl",shape:e.shape??t.shape,blendMode:e.blendMode??t.blendMode,glow:e.glow??t.glow,glowSize:e.glowSize??t.glowSize,glowColor:e.glowColor??t.glowColor,glowAlpha:e.glowAlpha??t.glowAlpha,trail:e.trail??t.trail,trailLength:e.trailLength??t.trailLength,trailFade:e.trailFade??t.trailFade,trailShrink:e.trailShrink??t.trailShrink,shadow:e.shadow??t.shadow,shadowBlur:e.shadowBlur??t.shadowBlur,shadowOffsetX:e.shadowOffsetX??t.shadowOffsetX,shadowOffsetY:e.shadowOffsetY??t.shadowOffsetY,shadowColor:e.shadowColor??t.shadowColor,shadowAlpha:e.shadowAlpha??t.shadowAlpha,rate:e.rate??t.rate,life:e.life??t.life,sizeMin:e.sizeMin??t.sizeMin,sizeMax:e.sizeMax??t.sizeMax,velocityMultiplier:e.velocityMultiplier??t.velocityMultiplier,gravity:e.gravity??t.gravity,acceleration:e.acceleration??t.acceleration,accelerationSize:e.accelerationSize??t.accelerationSize,friction:e.friction??t.friction,frictionSize:e.frictionSize??t.frictionSize,particleLife:e.particleLife??t.particleLife,fadeTime:e.fadeTime??t.fadeTime,maxCount:e.maxCount??t.maxCount,continuous:e.continuous??t.continuous,autoStart:e.autoStart??t.autoStart,velocity:Y.fromAngle(w*Math.PI/180,j),spread:(e.spread??t.spread/Math.PI)*Math.PI,webglMaxInstances:e.webglMaxInstances??t.webglMaxInstances}}const te={title:"Particular/Burst",component:()=>null,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend",table:{category:"Rendering"}},...U,rate:{control:{type:"number",min:1,max:100},description:"Particles per burst",table:{category:"Emission"}},life:{control:{type:"number",min:8,max:200},description:"Emitter life (ticks)",table:{category:"Emission"}},continuous:{control:"boolean",description:"Continuous emission",table:{category:"Emission"}},autoStart:{control:"boolean",description:"Auto-start on mount",table:{category:"Emission"}},velocityAngle:{control:{type:"number",min:-180,max:180},description:"Velocity angle (degrees)",table:{category:"Size & Physics"}},velocityMagnitude:{control:{type:"number",min:1,max:15},description:"Velocity magnitude",table:{category:"Size & Physics"}},velocityMultiplier:{control:{type:"number",min:1,max:15},description:"Velocity multiplier",table:{category:"Size & Physics"}},spread:{control:{type:"number",min:.2,max:2,step:.1},description:"Spread (× π)",table:{category:"Size & Physics"}},webglMaxInstances:{control:{type:"number",min:1024,max:65536},description:"WebGL max instances per draw",table:{category:"Advanced"}}},args:n({...r.Burst.magic,renderer:"webgl"})},a=o=>e=>{const t=J(o,e),i=e.continuous?G:H,w=V(t)(i);return s.jsx(w,{burst:()=>{}},JSON.stringify(e))},l={args:n({...r.Burst.confetti,renderer:"webgl"}),render:a(r.Burst.confetti)},c={args:n({...r.Burst.magic,renderer:"webgl"}),render:a(r.Burst.magic)},u={args:n({...r.Images.showcase,renderer:"webgl"}),render:a({...r.Images.showcase,icons:R})},d={args:n({...r.Burst.fireworks,renderer:"webgl"}),render:a(r.Burst.fireworks)},p={args:n({...r.Burst.magic,renderer:"webgl",continuous:!0,autoStart:!0,trail:!1}),render:a({...r.Burst.magic,icons:R,continuous:!0,autoStart:!0,trail:!1})},g={args:n({...r.Burst.fireworks,renderer:"webgl",rate:220,life:120,maxCount:5e3,webglMaxInstances:16384,continuous:!0,autoStart:!0,glow:!1,shadow:!1,trail:!1}),render:a({...r.Burst.fireworks,rate:220,life:120,maxCount:5e3,continuous:!0,autoStart:!0,glow:!1,shadow:!1,trail:!1})};var f,h,y;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.confetti,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.confetti)
}`,...(y=(h=l.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var S,b,M;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.magic)
}`,...(M=(b=c.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var x,C,B;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Images.showcase,
    renderer: 'webgl'
  }),
  render: withBaseConfig({
    ...presets.Images.showcase,
    icons: customIcons
  })
}`,...(B=(C=u.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};var v,A,z;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.fireworks,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.fireworks)
}`,...(z=(A=d.parameters)==null?void 0:A.docs)==null?void 0:z.source}}};var I,P,k;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl',
    continuous: true,
    autoStart: true,
    trail: false
  }),
  render: withBaseConfig({
    ...presets.Burst.magic,
    icons: customIcons,
    continuous: true,
    autoStart: true,
    trail: false
  })
}`,...(k=(P=p.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var L,O,T;g.parameters={...g.parameters,docs:{...(L=g.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
    shadow: false,
    trail: false
  }),
  render: withBaseConfig({
    ...presets.Burst.fireworks,
    rate: 220,
    life: 120,
    maxCount: 5000,
    continuous: true,
    autoStart: true,
    glow: false,
    shadow: false,
    trail: false
  })
}`,...(T=(O=g.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};const re=["Confetti","Magic","Images","Fireworks","Continuous","Performance5000"];export{l as Confetti,p as Continuous,d as Fireworks,u as Images,c as Magic,g as Performance5000,re as __namedExportsOrder,te as default};
