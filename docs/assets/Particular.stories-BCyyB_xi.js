import{j as a}from"./jsx-runtime-BO8uF4Og.js";import{d as j,e as w,f as X,V,h as r}from"./ParticularWrapper-DastDlr5.js";import"./index-D4H_InIO.js";import"./index-CZVi18Wq.js";import"./index-Dd8bRu6S.js";const L=""+new URL("smiley_sad-B3ElhsNA.png",import.meta.url).href,U=""+new URL("smiley_cry-yostEIDu.png",import.meta.url).href,_=""+new URL("smiley_sad_2-DV5sZIM6.png",import.meta.url).href,Y=[L,U,_],G=({burst:t})=>a.jsx("div",{onClick:e=>t({clientX:e.clientX,clientY:e.clientY}),style:{minHeight:"100vh",cursor:"pointer"},children:a.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CLICK FOR PARTICLES"})}),N=()=>a.jsx("div",{style:{minHeight:"100vh"},children:a.jsx("h1",{style:{textAlign:"center",paddingTop:"45vh",pointerEvents:"none",userSelect:"none"},children:"CONTINUOUS AUTO-START"})});function n(t){const e={...X,...w,...t},o=e.velocity??w.velocity;return{renderer:e.renderer??"webgl",shape:e.shape,blendMode:e.blendMode,glow:e.glow,glowSize:e.glowSize,glowColor:e.glowColor,glowAlpha:e.glowAlpha,shadow:e.shadow,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,shadowColor:e.shadowColor,shadowAlpha:e.shadowAlpha,rate:e.rate,life:e.life,sizeMin:e.sizeMin,sizeMax:e.sizeMax,velocityMultiplier:e.velocityMultiplier,gravity:e.gravity,maxCount:e.maxCount,continuous:e.continuous,autoStart:e.autoStart,velocityAngle:o.getAngle()*180/Math.PI,velocityMagnitude:o.getMagnitude(),spread:e.spread/Math.PI,webglMaxInstances:e.webglMaxInstances}}function F(t,e){const o={...X,...w,...t},i=o.velocity??w.velocity,g=e.velocityAngle??i.getAngle()*180/Math.PI,T=e.velocityMagnitude??i.getMagnitude();return{...o,renderer:e.renderer??o.renderer??"webgl",shape:e.shape??o.shape,blendMode:e.blendMode??o.blendMode,glow:e.glow??o.glow,glowSize:e.glowSize??o.glowSize,glowColor:e.glowColor??o.glowColor,glowAlpha:e.glowAlpha??o.glowAlpha,shadow:e.shadow??o.shadow,shadowBlur:e.shadowBlur??o.shadowBlur,shadowOffsetX:e.shadowOffsetX??o.shadowOffsetX,shadowOffsetY:e.shadowOffsetY??o.shadowOffsetY,shadowColor:e.shadowColor??o.shadowColor,shadowAlpha:e.shadowAlpha??o.shadowAlpha,rate:e.rate??o.rate,life:e.life??o.life,sizeMin:e.sizeMin??o.sizeMin,sizeMax:e.sizeMax??o.sizeMax,velocityMultiplier:e.velocityMultiplier??o.velocityMultiplier,gravity:e.gravity??o.gravity,maxCount:e.maxCount??o.maxCount,continuous:e.continuous??o.continuous,autoStart:e.autoStart??o.autoStart,velocity:V.fromAngle(g*Math.PI/180,T),spread:(e.spread??o.spread/Math.PI)*Math.PI,webglMaxInstances:e.webglMaxInstances??o.webglMaxInstances}}const K={title:"Particular/Burst",component:()=>null,argTypes:{renderer:{control:"radio",options:["canvas","webgl"],description:"Rendering backend"},shape:{control:"select",options:["circle","rectangle","square","roundedRectangle","triangle","star","ring","sparkle"],description:"Particle shape"},blendMode:{control:"select",options:["normal","additive","multiply","screen"],description:"Blend mode"},glow:{control:"boolean",description:"Enable glow effect"},glowSize:{control:{type:"number",min:8,max:30},description:"Glow size"},glowColor:{control:"color",description:"Glow color"},glowAlpha:{control:{type:"number",min:0,max:1,step:.05},description:"Glow opacity"},shadow:{control:"boolean",description:"Enable drop shadow"},shadowBlur:{control:{type:"number",min:0,max:40},description:"Shadow blur radius (px)"},shadowOffsetX:{control:{type:"number",min:-30,max:30},description:"Shadow X offset (px)"},shadowOffsetY:{control:{type:"number",min:-30,max:30},description:"Shadow Y offset (px)"},shadowColor:{control:"color",description:"Shadow color"},shadowAlpha:{control:{type:"number",min:0,max:1,step:.05},description:"Shadow opacity"},rate:{control:{type:"number",min:1,max:100},description:"Particles per burst"},life:{control:{type:"number",min:8,max:200},description:"Emitter life (ticks)"},sizeMin:{control:{type:"number",min:1,max:30},description:"Min particle size"},sizeMax:{control:{type:"number",min:1,max:50},description:"Max particle size"},velocityMultiplier:{control:{type:"number",min:1,max:15},description:"Velocity multiplier"},gravity:{control:{type:"number",min:0,max:.5,step:.01},description:"Gravity"},maxCount:{control:{type:"number",min:50,max:5e3},description:"Max particles"},continuous:{control:"boolean",description:"Continuous emission"},autoStart:{control:"boolean",description:"Auto-start on mount"},velocityAngle:{control:{type:"number",min:-180,max:180},description:"Velocity angle (degrees)"},velocityMagnitude:{control:{type:"number",min:1,max:15},description:"Velocity magnitude"},spread:{control:{type:"number",min:.2,max:2,step:.1},description:"Spread (× π)"},webglMaxInstances:{control:{type:"number",min:1024,max:65536},description:"WebGL max instances per draw"}},args:n({...r.Burst.magic,renderer:"webgl"})},s=t=>e=>{const o=F(t,e),i=e.continuous?N:G,g=j(o)(i);return a.jsx(g,{burst:()=>{}},JSON.stringify(e))},l={args:n({...r.Burst.confetti,renderer:"webgl"}),render:s(r.Burst.confetti)},c={args:n({...r.Burst.magic,renderer:"webgl"}),render:s(r.Burst.magic)},u={args:n({...r.Images.showcase,renderer:"webgl"}),render:s({...r.Images.showcase,icons:Y})},d={args:n({...r.Burst.fireworks,renderer:"webgl"}),render:s(r.Burst.fireworks)},p={args:n({...r.Burst.magic,renderer:"webgl",continuous:!0,autoStart:!0}),render:s({...r.Burst.magic,icons:Y,continuous:!0,autoStart:!0})},m={args:n({...r.Burst.fireworks,renderer:"webgl",rate:220,life:120,maxCount:5e3,webglMaxInstances:16384,continuous:!0,autoStart:!0,glow:!1,shadow:!1}),render:s({...r.Burst.fireworks,rate:220,life:120,maxCount:5e3,continuous:!0,autoStart:!0,glow:!1,shadow:!1})};var h,f,y;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.confetti,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.confetti)
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var b,x,M;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: toStoryArgs({
    ...presets.Burst.magic,
    renderer: 'webgl'
  }),
  render: withBaseConfig(presets.Burst.magic)
}`,...(M=(x=c.parameters)==null?void 0:x.docs)==null?void 0:M.source}}};var S,C,B;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(I=(A=d.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var z,O,P;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(P=(O=p.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var k,E,R;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(R=(E=m.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};const Z=["Confetti","Magic","Images","Fireworks","Continuous","Performance5000"];export{l as Confetti,p as Continuous,d as Fireworks,u as Images,c as Magic,m as Performance5000,Z as __namedExportsOrder,K as default};
