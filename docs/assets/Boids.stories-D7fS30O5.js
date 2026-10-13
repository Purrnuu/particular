import{j as o}from"./jsx-runtime-BO8uF4Og.js";import{r as s}from"./index-D4H_InIO.js";import{c as d}from"./index-B1xL92ey.js";import{V as C}from"./canvasStyles-Dq_me5Kf.js";const z={title:"Particular/Boids"},R=({renderer:t})=>{const r=s.useRef(null);return s.useEffect(()=>{if(!r.current)return;const e=r.current.getBoundingClientRect(),n=d({container:r.current,preset:"flock",renderer:t,config:{autoStart:!1}});return n.addFlockingForce(),n.burst({x:e.left+e.width/2,y:e.top+e.height/2}),()=>n.destroy()},[t]),o.jsx("div",{ref:r,style:{width:"100%",height:"100vh",background:"#0a0a1a",position:"relative"},children:o.jsx("div",{style:{position:"absolute",top:16,left:16,color:"#666",fontFamily:"system-ui"},children:"Boids flocking — particles self-organize into swarm patterns"})})},c={args:{renderer:"webgl"},argTypes:{renderer:{control:"inline-radio",options:["canvas","webgl"]}},render:t=>o.jsx(R,{...t})},B=({renderer:t})=>{const r=s.useRef(null);return s.useEffect(()=>{if(!r.current)return;const e=r.current.getBoundingClientRect(),n=d({container:r.current,preset:"flock",config:{autoStart:!1},renderer:t,mouseForce:{mode:"repel",strength:2,radius:75,track:!0}});return n.addFlockingForce(),n.burst({x:e.left+e.width/2,y:e.top+e.height/2}),()=>n.destroy()},[t]),o.jsx("div",{ref:r,style:{width:"100%",height:"100vh",background:"#0a0a1a",position:"relative"},children:o.jsx("div",{style:{position:"absolute",top:16,left:16,color:"#666",fontFamily:"system-ui"},children:"Move mouse to scatter the flock — they regroup after"})})},a={args:{renderer:"webgl"},argTypes:{renderer:{control:"inline-radio",options:["canvas","webgl"]}},render:t=>o.jsx(B,{...t})},S=()=>{const t=s.useRef(null);return s.useEffect(()=>{if(!t.current)return;const r=t.current.getBoundingClientRect(),e=d({container:t.current,preset:"flock",config:{autoStart:!1}}),n=e.engine.pixelRatio,u=r.width/2/n,p=r.height/2/n;return e.addAttractor({x:u-100,y:p,strength:.05,radius:400,visible:!0}),e.addAttractor({x:u+100,y:p,strength:.05,radius:400,visible:!0}),e.addFlockingForce(),e.burst({x:r.left+r.width/2,y:r.top+r.height/2}),()=>e.destroy()},[]),o.jsx("div",{ref:t,style:{width:"100%",height:"100vh",background:"#0a0a1a",position:"relative"},children:o.jsx("div",{style:{position:"absolute",top:16,left:16,color:"#666",fontFamily:"system-ui"},children:"Flock orbits center attractor in swarm patterns"})})},i={render:()=>o.jsx(S,{})},A=()=>{const t=s.useRef(null);return s.useEffect(()=>{if(!t.current)return;const r=t.current.getBoundingClientRect(),e=d({container:t.current,renderer:"webgl3d",preset:"flock",config:{autoStart:!1,spawnDepth:40,velocity:C.fromAngle(0,1.5),spread3d:0,camera:{fov:60,position:{x:0,y:100,z:600},target:{x:0,y:0,z:0}}}});return e.addFlockingForce({maxSpeed:1.5,boundsScale:.5,boundsDepth:40}),e.burst({x:r.left+r.width/2,y:r.top+r.height/2}),e.enableAutoOrbit(.15),e.enableOrbitControls(),()=>e.destroy()},[]),o.jsx("div",{ref:t,style:{width:"100%",height:"100vh",background:"#0a0a1a",position:"relative",cursor:"grab"},children:o.jsx("div",{style:{position:"absolute",top:16,left:16,color:"#666",fontFamily:"system-ui"},children:"3D flock with orbit controls. Drag to rotate, scroll to zoom."})})},l={render:()=>o.jsx(A,{})};var g,f,m;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    renderer: 'webgl'
  },
  argTypes: {
    renderer: {
      control: 'inline-radio',
      options: ['canvas', 'webgl']
    }
  },
  render: args => <BasicFlockComponent {...args} />
}`,...(m=(f=c.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var h,y,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    renderer: 'webgl'
  },
  argTypes: {
    renderer: {
      control: 'inline-radio',
      options: ['canvas', 'webgl']
    }
  },
  render: args => <PredatorMouseComponent {...args} />
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var k,x,F;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <FlockAttractorComponent />
}`,...(F=(x=i.parameters)==null?void 0:x.docs)==null?void 0:F.source}}};var v,w,j;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <Flock3DComponent />
}`,...(j=(w=l.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};const T=["BasicFlock","PredatorMouse","FlockAttractor","Flock3D"];export{c as BasicFlock,l as Flock3D,i as FlockAttractor,a as PredatorMouse,T as __namedExportsOrder,z as default};
