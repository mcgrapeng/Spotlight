import{d as q,o as r,c as l,a as n,q as w,Z as c,X as m,F as D,v as $,e as _,a3 as X,a2 as F,a1 as Y,a4 as H,aU as J,a0 as E,aB as N,P as O,L as p,N as P,Q as U,ae as M,U as K,aV as Q,W as ee,a8 as A,u as re,f as te,w as ie,t as oe,g as G,h as ae,i as I,C as se,r as L,aW as le,x as j,T as ne}from"./index-CwTgOm_w.js";import{D as ce}from"./DataTable-HpgZ-8NV.js";import{S as de}from"./Spin-BAGix7AF.js";const ue=["id"],ge=["stop-color"],pe=["stop-color"],fe=["viewBox"],he=["d","stroke-width"],ye=["d","stroke-width"],me={success:(r(),$(H)),error:(r(),$(Y)),warning:(r(),$(F)),info:(r(),$(X))};var ve=q({name:"ProgressCircle",props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(e,{slots:h}){const f=_(()=>{const i="gradient",{fillColor:o}=e;return typeof o=="object"?`${i}-${J(JSON.stringify(o))}`:i});function y(i,o,s,t){const{gapDegree:v,viewBoxWidth:b,strokeWidth:x}=e,d=50,k=0,u=d,a=0,B=100,S=50+x/2,C=`M ${S},${S} m ${k},${u}
      a ${d},${d} 0 1 1 ${a},-100
      a ${d},${d} 0 1 1 0,${B}`,z=Math.PI*2*d;return{pathString:C,pathStyle:{stroke:t==="rail"?s:typeof e.fillColor=="object"?`url(#${f.value})`:s,strokeDasharray:`${Math.min(i,100)/100*(z-v)}px ${b*8}px`,strokeDashoffset:`-${v/2}px`,transformOrigin:o?"center":void 0,transform:o?`rotate(${o}deg)`:void 0}}}const g=()=>{const i=typeof e.fillColor=="object",o=i?e.fillColor.stops[0]:"",s=i?e.fillColor.stops[1]:"";return i&&(r(),l("defs",null,[n("linearGradient",{id:f.value,x1:"0%",y1:"100%",x2:"100%",y2:"0%"},[n("stop",{offset:"0%","stop-color":o},null,8,ge),n("stop",{offset:"100%","stop-color":s},null,8,pe)],8,ue)]))};return()=>{const{fillColor:i,railColor:o,strokeWidth:s,offsetDegree:t,status:v,percentage:b,showIndicator:x,indicatorTextColor:d,unit:k,gapOffsetDegree:u,clsPrefix:a}=e,{pathString:B,pathStyle:S}=y(100,0,o,"rail"),{pathString:C,pathStyle:z}=y(b,t,i,"fill"),R=100+s;return r(),l("div",{class:c(`${a}-progress-content`),role:"none"},[n("div",{class:c(`${a}-progress-graph`),"aria-hidden":!0},[n("div",{class:c(`${a}-progress-graph-circle`),style:w({transform:u?`rotate(${u}deg)`:void 0})},[(r(),l("svg",{viewBox:`0 0 ${R} ${R}`},[m(()=>g()),n("g",null,[n("path",{class:c(`${a}-progress-graph-circle-rail`),d:B,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:w(S)},null,14,he)]),n("g",null,[n("path",{class:c([`${a}-progress-graph-circle-fill`,b===0&&`${a}-progress-graph-circle-fill--empty`]),d:C,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:w(z)},null,14,ye)])],8,fe))],6)],2),x?(r(),l("div",{key:0},[h.default?(r(),l("div",{key:0,class:c(`${a}-progress-custom-content`),role:"none"},[m(()=>h.default())],2)):(r(),l(D,{key:1},[v!=="default"?(r(),l("div",{key:0,class:c(`${a}-progress-icon`),"aria-hidden":!0},[(r(),$(E,{clsPrefix:a},{default:()=>me[v]},1032,["clsPrefix"]))],2)):(r(),l("div",{key:1,class:c(`${a}-progress-text`),style:w({color:d}),role:"none"},[n("span",{class:c(`${a}-progress-text__percentage`)},[m(()=>b)],2),n("span",{class:c(`${a}-progress-text__unit`)},[m(()=>k)],2)],6))],64))])):m(()=>null)],2)}}});const be={success:(r(),$(H)),error:(r(),$(Y)),warning:(r(),$(F)),info:(r(),$(X))};var xe=q({name:"ProgressLine",props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:"%"},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(e,{slots:h}){const f=_(()=>N(e.height)),y=_(()=>typeof e.fillColor=="object"?`linear-gradient(to right, ${e.fillColor?.stops[0]} , ${e.fillColor?.stops[1]})`:e.fillColor),g=_(()=>e.railBorderRadius!==void 0?N(e.railBorderRadius):e.height!==void 0?N(e.height,{c:.5}):""),i=_(()=>e.fillBorderRadius!==void 0?N(e.fillBorderRadius):e.railBorderRadius!==void 0?N(e.railBorderRadius):e.height!==void 0?N(e.height,{c:.5}):"");return()=>{const{indicatorPlacement:o,railColor:s,railStyle:t,percentage:v,unit:b,indicatorTextColor:x,status:d,showIndicator:k,processing:u,clsPrefix:a}=e;return r(),l("div",{class:c(`${a}-progress-content`),role:"none"},[n("div",{class:c(`${a}-progress-graph`),"aria-hidden":!0},[n("div",{class:c([`${a}-progress-graph-line`,{[`${a}-progress-graph-line--indicator-${o}`]:!0}])},[n("div",{class:c(`${a}-progress-graph-line-rail`),style:w([{backgroundColor:s,height:f.value,borderRadius:g.value},t])},[n("div",{class:c([`${a}-progress-graph-line-fill`,u&&`${a}-progress-graph-line-fill--processing`]),style:w({maxWidth:`${e.percentage}%`,background:y.value,height:f.value,lineHeight:f.value,borderRadius:i.value})},[o==="inside"?(r(),l("div",{key:0,class:c(`${a}-progress-graph-line-indicator`),style:w({color:x})},[h.default?(r(),l(D,{key:0},[m(()=>h.default())],64)):(r(),l(D,{key:1},[m(()=>`${v}${b}`)],64))],6)):m(()=>null)],6)],6)],2)],2),k&&o==="outside"?(r(),l("div",{key:0},[h.default?(r(),l("div",{key:0,class:c(`${a}-progress-custom-content`),style:w({color:x}),role:"none"},[m(()=>h.default())],6)):(r(),l(D,{key:1},[d==="default"?(r(),l("div",{key:0,role:"none",class:c(`${a}-progress-icon ${a}-progress-icon--as-text`),style:w({color:x})},[m(()=>v),m(()=>b)],6)):(r(),l("div",{key:1,class:c(`${a}-progress-icon`),"aria-hidden":!0},[(r(),$(E,{clsPrefix:a},{default:()=>be[d]},1032,["clsPrefix"]))],2))],64))])):m(()=>null)],2)}}});const $e=["id"],ke=["stop-color"],Ce=["stop-color"],we=["d","stroke-width"],_e=["d","stroke-width"],Se=["viewBox"];function V(e,h,f=100){return`m ${f/2} ${f/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}var ze=q({name:"ProgressMultipleCircle",props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(e,{slots:h}){const f=_(()=>e.percentage.map((g,i)=>`${Math.PI*g/100*(e.viewBoxWidth/2-e.strokeWidth/2*(1+2*i)-e.circleGap*i)*2}, ${e.viewBoxWidth*8}`)),y=(g,i)=>{const o=e.fillColor[i],s=typeof o=="object"?o.stops[0]:"",t=typeof o=="object"?o.stops[1]:"";return typeof e.fillColor[i]=="object"&&(r(),l("linearGradient",{id:`gradient-${i}`,x1:"100%",y1:"0%",x2:"0%",y2:"100%"},[n("stop",{offset:"0%","stop-color":s},null,8,ke),n("stop",{offset:"100%","stop-color":t},null,8,Ce)],8,$e))};return()=>{const{viewBoxWidth:g,strokeWidth:i,circleGap:o,showIndicator:s,fillColor:t,railColor:v,railStyle:b,percentage:x,clsPrefix:d}=e;return r(),l("div",{class:c(`${d}-progress-content`),role:"none"},[n("div",{class:c(`${d}-progress-graph`),"aria-hidden":!0},[n("div",{class:c(`${d}-progress-graph-circle`)},[(r(),l("svg",{viewBox:`0 0 ${g} ${g}`},[n("defs",null,[m(()=>x.map((k,u)=>y(k,u)))]),m(()=>x.map((k,u)=>(r(),l("g",{key:u},[n("path",{class:c(`${d}-progress-graph-circle-rail`),d:V(g/2-i/2*(1+2*u)-o*u,i,g),"stroke-width":i,"stroke-linecap":"round",fill:"none",style:w([{strokeDashoffset:0,stroke:v[u]},b[u]])},null,14,we),n("path",{class:c([`${d}-progress-graph-circle-fill`,k===0&&`${d}-progress-graph-circle-fill--empty`]),d:V(g/2-i/2*(1+2*u)-o*u,i,g),"stroke-width":i,"stroke-linecap":"round",fill:"none",style:w({strokeDasharray:f.value[u],strokeDashoffset:0,stroke:typeof t[u]=="object"?`url(#gradient-${u})`:t[u]})},null,14,_e)]))))],8,Se))],2)],2),s&&h.default?(r(),l("div",{key:0},[n("div",{class:c(`${d}-progress-text`)},[m(()=>h.default())],2)])):m(()=>null)],2)}}}),Pe=O([p("progress",{display:"inline-block"},[p("progress-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `),P("line",`
 width: 100%;
 display: block;
 `,[p("progress-content",`
 display: flex;
 align-items: center;
 `,[p("progress-graph",{flex:1})]),p("progress-custom-content",{marginLeft:"14px"}),p("progress-icon",`
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `,[P("as-text",`
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]),P("circle, dashboard",{width:"120px"},[p("progress-custom-content",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `),p("progress-text",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: inherit;
 font-size: var(--n-font-size-circle);
 color: var(--n-text-color-circle);
 font-weight: var(--n-font-weight-circle);
 transition: color .3s var(--n-bezier);
 white-space: nowrap;
 `),p("progress-icon",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]),P("multiple-circle",`
 width: 200px;
 color: inherit;
 `,[p("progress-text",`
 font-weight: var(--n-font-weight-circle);
 color: var(--n-text-color-circle);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `)]),p("progress-content",{position:"relative"}),p("progress-graph",{position:"relative"},[p("progress-graph-circle",[O("svg",{verticalAlign:"bottom"}),p("progress-graph-circle-fill",`
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `,[P("empty",{opacity:0})]),p("progress-graph-circle-rail",`
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]),p("progress-graph-line",[P("indicator-inside",[p("progress-graph-line-rail",`
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `,[p("progress-graph-line-fill",`
 height: inherit;
 border-radius: 10px;
 `),p("progress-graph-line-indicator",`
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]),P("indicator-inside-label",`
 height: 16px;
 display: flex;
 align-items: center;
 `,[p("progress-graph-line-rail",`
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `),p("progress-graph-line-indicator",`
 background: var(--n-fill-color);
 font-size: 12px;
 transform: translateZ(0);
 display: flex;
 vertical-align: middle;
 height: 16px;
 line-height: 16px;
 padding: 0 10px;
 border-radius: 10px;
 position: absolute;
 white-space: nowrap;
 color: var(--n-text-color-line-inner);
 transition:
 right .2s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),p("progress-graph-line-rail",`
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `,[p("progress-graph-line-fill",`
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `,[P("processing",[O("&::after",`
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]),O("@keyframes progress-processing-animation",`
 0% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 100%;
 opacity: 1;
 }
 66% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 100% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 `)]);const Be=["aria-valuenow","role"],Re={...U.props,processing:Boolean,type:{type:String,default:"line"},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:"default"},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:"%"},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:"outside"},indicatorPlacement:{type:String,default:"outside"},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number};var Ne=q({name:"Progress",props:Re,setup(e){const h=_(()=>e.indicatorPlacement||e.indicatorPosition),f=_(()=>{if(e.gapDegree||e.gapDegree===0)return e.gapDegree;if(e.type==="dashboard")return 75}),{mergedClsPrefixRef:y,inlineThemeDisabled:g}=K(e),i=U("Progress","-progress",Pe,Q,e,y),o=_(()=>{const{status:t}=e,{common:{cubicBezierEaseInOut:v},self:{fontSize:b,fontSizeCircle:x,railColor:d,railHeight:k,iconSizeCircle:u,iconSizeLine:a,textColorCircle:B,textColorLineInner:S,textColorLineOuter:C,lineBgProcessing:z,fontWeightCircle:R,[A("iconColor",t)]:T,[A("fillColor",t)]:W}}=i.value;return{"--n-bezier":v,"--n-fill-color":W,"--n-font-size":b,"--n-font-size-circle":x,"--n-font-weight-circle":R,"--n-icon-color":T,"--n-icon-size-circle":u,"--n-icon-size-line":a,"--n-line-bg-processing":z,"--n-rail-color":d,"--n-rail-height":k,"--n-text-color-circle":B,"--n-text-color-line-inner":S,"--n-text-color-line-outer":C}}),s=g?ee("progress",_(()=>e.status[0]),o,e):void 0;return{mergedClsPrefix:y,mergedIndicatorPlacement:h,gapDeg:f,cssVars:g?void 0:o,themeClass:s?.themeClass,onRender:s?.onRender}},render(){const{type:e,cssVars:h,indicatorTextColor:f,showIndicator:y,status:g,railColor:i,railStyle:o,color:s,percentage:t,viewBoxWidth:v,strokeWidth:b,mergedIndicatorPlacement:x,unit:d,borderRadius:k,fillBorderRadius:u,height:a,processing:B,circleGap:S,mergedClsPrefix:C,gapDeg:z,gapOffsetDegree:R,themeClass:T,$slots:W,onRender:Z}=this;return Z?.(),r(),l("div",{class:c([T,`${C}-progress`,`${C}-progress--${e}`,`${C}-progress--${g}`]),style:w(h),"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":t,role:e==="circle"||e==="line"||e==="dashboard"?"progressbar":"none"},[e==="circle"||e==="dashboard"?(r(),$(ve,{key:0,clsPrefix:C,status:g,showIndicator:y,indicatorTextColor:f,railColor:i,fillColor:s,railStyle:o,offsetDegree:this.offsetDegree,percentage:t,viewBoxWidth:v,strokeWidth:b,gapDegree:z===void 0?e==="dashboard"?75:0:z,gapOffsetDegree:R,unit:d},M(W),1032,["clsPrefix","status","showIndicator","indicatorTextColor","railColor","fillColor","railStyle","offsetDegree","percentage","viewBoxWidth","strokeWidth","gapDegree","gapOffsetDegree","unit"])):(r(),l(D,{key:1},[e==="line"?(r(),$(xe,{key:0,clsPrefix:C,status:g,showIndicator:y,indicatorTextColor:f,railColor:i,fillColor:s,railStyle:o,percentage:t,processing:B,indicatorPlacement:x,unit:d,fillBorderRadius:u,railBorderRadius:k,height:a},M(W),1032,["clsPrefix","status","showIndicator","indicatorTextColor","railColor","fillColor","railStyle","percentage","processing","indicatorPlacement","unit","fillBorderRadius","railBorderRadius","height"])):(r(),l(D,{key:1},[e==="multiple-circle"?(r(),$(ze,{key:0,clsPrefix:C,strokeWidth:b,railColor:i,fillColor:s,railStyle:o,viewBoxWidth:v,percentage:t,showIndicator:y,circleGap:S},M(W),1032,["clsPrefix","strokeWidth","railColor","fillColor","railStyle","viewBoxWidth","percentage","showIndicator","circleGap"])):m(()=>null)],64))],64))],14,Be)}});const De={class:"p-8 space-y-6 max-w-[1440px] mx-auto"},We={class:"text-sm text-zinc-500 mt-1"},Ie={key:0,class:"py-20 flex justify-center"},Te=q({__name:"NodesView",setup(e){const h=re(),f=L([]),y=L(!0);async function g(){if(h.activeCluster){y.value=!0;try{f.value=await le.list(h.activeCluster)}finally{y.value=!1}}}te(g),ie(()=>h.activeCluster,g);function i(o){const s=parseFloat(o.cpu_capacity),t=parseFloat(o.cpu_allocatable);return s?Math.min(100,Math.round((s-t)/s*100)):0}return(o,s)=>(r(),l("div",De,[n("header",null,[s[0]||(s[0]=n("h1",{class:"text-2xl font-semibold tracking-tight text-zinc-50"},"Nodes",-1)),n("p",We,oe(f.value.length)+" 个节点 · 由 kubelet 上报",1)]),G(I(se),{bordered:!1},{default:ae(()=>[y.value?(r(),l("div",Ie,[G(I(de),{size:"large"})])):(r(),$(I(ce),{key:1,columns:[{title:"Name",key:"name",render:t=>j("span",{class:"font-mono text-zinc-100"},t.name)},{title:"Status",key:"status",width:110,render:t=>j(I(ne),{type:t.status==="Ready"?"success":"error",size:"small",round:!0},()=>t.status)},{title:"Roles",key:"roles",width:200,render:t=>t.roles.join(", ")||"—"},{title:"Pods",key:"pod_count",width:80},{title:"Version",key:"kubelet_version",width:140,render:t=>t.kubelet_version},{title:"CPU (allocatable)",key:"cpu",width:220,render:t=>j("div",{class:"flex items-center gap-2"},[j(I(Ne),{type:"line",percentage:i(t),color:"#6366f1",height:6,processing:!1}),j("span",{class:"text-xs text-zinc-400 font-mono whitespace-nowrap"},`${t.cpu_allocatable} / ${t.cpu_capacity}`)])},{title:"Memory (allocatable)",key:"mem",width:200,render:t=>`${t.memory_allocatable} / ${t.memory_capacity}`},{title:"Age",key:"age",width:80,render:t=>t.age??"—"}],data:f.value,size:"small",bordered:!1,pagination:{pageSize:50}},null,8,["columns","data"]))]),_:1})]))}});export{Te as default};
