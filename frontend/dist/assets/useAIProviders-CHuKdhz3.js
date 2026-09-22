import{d as ae,a9 as ye,a as R,bb as xe,bc as ke,Q as N,aH as Se,o as g,c as x,F as oe,X as f,q as I,Z as u,U as de,V as Ce,e as A,bd as Be,a8 as z,be as $e,bf as w,I as ze,bg as Re,K as _e,L as ie,M as a,bh as le,P as J,N as S,aG as se,bi as Q,a5 as F,v as ce,b3 as Ve,r as D,au as Pe,W as Fe,ax as Z,aY as Ae,a6 as Me,bj as Te,a_ as ee,aA as De,aR as E}from"./index-CwTgOm_w.js";import{g as We}from"./DataTable-HpgZ-8NV.js";var Ye=ae({name:"Add",render(){return(()=>{const e=ye("b30130fbba5c5b23");return e[0]||(e[0]=R("svg",{width:"512",height:"512",viewBox:"0 0 512 512",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[R("path",{d:"M256 112V400M400 256H112",stroke:"currentColor","stroke-width":"32","stroke-linecap":"round","stroke-linejoin":"round"})],-1))})()}});function je(){return xe}const Ee={self:je};let te;function Ke(){if(!ke)return!0;if(te===void 0){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.rowGap="1px",e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e);const n=e.scrollHeight===1;return document.body.removeChild(e),te=n}return te}const Ge={...N.props,align:String,justify:{type:String,default:"start"},inline:Boolean,vertical:Boolean,reverse:Boolean,size:[String,Number,Array],wrapItem:{type:Boolean,default:!0},itemClass:String,itemStyle:[String,Object],wrap:{type:Boolean,default:!0},internalUseGap:{type:Boolean,default:void 0}};var qe=ae({name:"Space",props:Ge,setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:d,mergedComponentPropsRef:i}=de(e),s=A(()=>e.size??i?.value?.Space?.size??"medium"),h=N("Space","-space",void 0,Ee,e,n),p=Ce("Space",d,n);return{useGap:Ke(),rtlEnabled:p,mergedClsPrefix:n,margin:A(()=>{const r=s.value;if(Array.isArray(r))return{horizontal:r[0],vertical:r[1]};if(typeof r=="number")return{horizontal:r,vertical:r};const{self:{[z("gap",r)]:m}}=h.value,{row:o,col:c}=$e(m);return{horizontal:w(c),vertical:w(o)}})}},render(){const{vertical:e,reverse:n,align:d,inline:i,justify:s,itemClass:h,itemStyle:p,margin:r,wrap:m,mergedClsPrefix:o,rtlEnabled:c,useGap:b,wrapItem:l,internalUseGap:v}=this,y=Se(We(this),!1);if(!y.length)return null;const _=`${r.horizontal}px`,M=`${r.horizontal/2}px`,U=`${r.vertical}px`,C=`${r.vertical/2}px`,V=y.length-1,T=s.startsWith("space-");return g(),x("div",{role:"none",class:u([`${o}-space`,c&&`${o}-space--rtl`]),style:I({display:i?"inline-flex":"flex",flexDirection:e&&!n?"column":e&&n?"column-reverse":!e&&n?"row-reverse":"row",justifyContent:["start","end"].includes(s)?`flex-${s}`:s,flexWrap:!m||e?"nowrap":"wrap",marginTop:b||e?"":`-${C}`,marginBottom:b||e?"":`-${C}`,alignItems:d,gap:b?`${r.vertical}px ${r.horizontal}px`:""})},[!l&&(b||v)?(g(),x(oe,{key:0},[f(()=>y)],64)):(g(),x(oe,{key:1},[f(()=>y.map((W,k)=>W.type===Be?W:(g(),x("div",{key:1,role:"none",class:u(h),style:I([p,{maxWidth:"100%"},b?"":e?{marginBottom:k!==V?U:""}:c?{marginLeft:T?s==="space-between"&&k===V?"":M:k!==V?_:"",marginRight:T?s==="space-between"&&k===0?"":M:"",paddingTop:C,paddingBottom:C}:{marginRight:T?s==="space-between"&&k===V?"":M:k!==V?_:"",marginLeft:T?s==="space-between"&&k===0?"":M:"",paddingTop:C,paddingBottom:C}])},[f(()=>W)],6))))],64))],6)}});function He(e){const{primaryColor:n,opacityDisabled:d,borderRadius:i,textColor3:s}=e;return{...Re,iconColor:s,textColor:"white",loadingColor:n,opacityDisabled:d,railColor:"rgba(0, 0, 0, .14)",railColorActive:n,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:i,railBorderRadiusMedium:i,railBorderRadiusLarge:i,buttonBorderRadiusSmall:i,buttonBorderRadiusMedium:i,buttonBorderRadiusLarge:i,boxShadowFocus:`0 0 0 2px ${_e(n,{alpha:.2})}`}}const Ie={common:ze,self:He};var Ne=ie("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[a("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),a("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),a("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),ie("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[le({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),a("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),a("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),a("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),J("&:focus",[a("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),S("round",[a("rail","border-radius: calc(var(--n-rail-height) / 2);",[a("button","border-radius: calc(var(--n-button-height) / 2);")])]),se("disabled",[se("icon",[S("rubber-band",[S("pressed",[a("rail",[a("button","max-width: var(--n-button-width-pressed);")])]),a("rail",[J("&:active",[a("button","max-width: var(--n-button-width-pressed);")])]),S("active",[S("pressed",[a("rail",[a("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),a("rail",[J("&:active",[a("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),S("active",[a("rail",[a("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),a("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[a("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[le()]),a("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),S("active",[a("rail","background-color: var(--n-rail-color-active);")]),S("loading",[a("rail",`
 cursor: wait;
 `)]),S("disabled",[a("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]);const Ue=["aria-checked","tabindex","onClick","onFocus","onBlur","onKeyup","onKeydown"],Le={...N.props,size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]};let K;var Je=ae({name:"Switch",props:Le,slots:Object,setup(e){K===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?K=CSS.supports("width","max(1px)"):K=!1:K=!0);const{mergedClsPrefixRef:n,inlineThemeDisabled:d,mergedComponentPropsRef:i}=de(e),s=N("Switch","-switch",Ne,Ie,e,n),h=Ve(e,{mergedSize(t){if(e.size!==void 0)return e.size;if(t)return t.mergedSize.value;const P=i?.value?.Switch?.size;return P||"medium"}}),{mergedSizeRef:p,mergedDisabledRef:r}=h,m=D(e.defaultValue),o=De(e,"value"),c=Pe(o,m),b=A(()=>c.value===e.checkedValue),l=D(!1),v=D(!1),y=A(()=>{const{railStyle:t}=e;if(t)return t({focused:v.value,checked:b.value})});function _(t){const{"onUpdate:value":P,onChange:G,onUpdateValue:H}=e,{nTriggerFormInput:L,nTriggerFormChange:O}=h;P&&Z(P,t),H&&Z(H,t),G&&Z(G,t),m.value=t,L(),O()}function M(){const{nTriggerFormFocus:t}=h;t()}function U(){const{nTriggerFormBlur:t}=h;t()}function C(){e.loading||r.value||(c.value!==e.checkedValue?_(e.checkedValue):_(e.uncheckedValue))}function V(){v.value=!0,M()}function T(){v.value=!1,U(),l.value=!1}function W(t){e.loading||r.value||t.key===" "&&(c.value!==e.checkedValue?_(e.checkedValue):_(e.uncheckedValue),l.value=!1)}function k(t){e.loading||r.value||t.key===" "&&(t.preventDefault(),l.value=!0)}const re=A(()=>{const{value:t}=p,{self:{opacityDisabled:P,railColor:G,railColorActive:H,buttonBoxShadow:L,buttonColor:O,boxShadowFocus:ue,loadingColor:he,textColor:fe,iconColor:be,[z("buttonHeight",t)]:B,[z("buttonWidth",t)]:ve,[z("buttonWidthPressed",t)]:ge,[z("railHeight",t)]:$,[z("railWidth",t)]:j,[z("railBorderRadius",t)]:pe,[z("buttonBorderRadius",t)]:me},common:{cubicBezierEaseInOut:we}}=s.value;let X,Y,q;return K?(X=`calc((${$} - ${B}) / 2)`,Y=`max(${$}, ${B})`,q=`max(${j}, calc(${j} + ${B} - ${$}))`):(X=ee((w($)-w(B))/2),Y=ee(Math.max(w($),w(B))),q=w($)>w(B)?j:ee(w(j)+w(B)-w($))),{"--n-bezier":we,"--n-button-border-radius":me,"--n-button-box-shadow":L,"--n-button-color":O,"--n-button-width":ve,"--n-button-width-pressed":ge,"--n-button-height":B,"--n-height":Y,"--n-offset":X,"--n-opacity-disabled":P,"--n-rail-border-radius":pe,"--n-rail-color":G,"--n-rail-color-active":H,"--n-rail-height":$,"--n-rail-width":j,"--n-width":q,"--n-box-shadow-focus":ue,"--n-loading-color":he,"--n-text-color":fe,"--n-icon-color":be}}),ne=d?Fe("switch",A(()=>p.value[0]),re,e):void 0;return{handleClick:C,handleBlur:T,handleFocus:V,handleKeyup:W,handleKeydown:k,mergedRailStyle:y,pressed:l,mergedClsPrefix:n,mergedValue:c,checked:b,mergedDisabled:r,cssVars:d?void 0:re,themeClass:ne?.themeClass,onRender:ne?.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:n,checked:d,mergedRailStyle:i,onRender:s,$slots:h}=this;s?.();const{checked:p,unchecked:r,icon:m,"checked-icon":o,"unchecked-icon":c}=h,b=!(Q(m)&&Q(o)&&Q(c));return g(),x("div",{role:"switch","aria-checked":d,class:u([`${e}-switch`,this.themeClass,b&&`${e}-switch--icon`,d&&`${e}-switch--active`,n&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`]),tabindex:this.mergedDisabled?void 0:0,style:I(this.cssVars),onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},[R("div",{class:u(`${e}-switch__rail`),"aria-hidden":"true",style:I(i)},[f(()=>F(p,l=>F(r,v=>l||v?(g(),x("div",{key:4,"aria-hidden":!0,class:u(`${e}-switch__children-placeholder`)},[R("div",{class:u(`${e}-switch__rail-placeholder`)},[R("div",{class:u(`${e}-switch__button-placeholder`)},null,2),f(()=>l)],2),R("div",{class:u(`${e}-switch__rail-placeholder`)},[R("div",{class:u(`${e}-switch__button-placeholder`)},null,2),f(()=>v)],2)],2)):null))),R("div",{class:u(`${e}-switch__button`)},[f(()=>F(m,l=>F(o,v=>F(c,y=>(g(),ce(Te,null,{default:()=>this.loading?(g(),ce(Ae,Me({key:"loading",clsPrefix:e,strokeWidth:20},this.spinProps),null,16,["clsPrefix"])):this.checked&&(v||l)?(g(),x("div",{class:u(`${e}-switch__button-icon`),key:v?"checked-icon":"icon"},[f(()=>v||l)],2)):!this.checked&&(y||l)?(g(),x("div",{class:u(`${e}-switch__button-icon`),key:y?"unchecked-icon":"icon"},[f(()=>y||l)],2)):null},1024)))))),f(()=>F(p,l=>l&&(g(),x("div",{key:"checked",class:u(`${e}-switch__checked`)},[f(()=>l)],2)))),f(()=>F(r,l=>l&&(g(),x("div",{key:"unchecked",class:u(`${e}-switch__unchecked`)},[f(()=>l)],2))))],2)],6)],46,Ue)}});function Qe(){const e=D([]),n=D(!1),d=D(null);async function i(){n.value=!0,d.value=null;try{e.value=await E.listProviders()}catch(o){d.value=o?.message??"load failed"}finally{n.value=!1}}async function s(o){const c=await E.addProvider(o);return await i(),c}async function h(o,c){const b=await E.updateProvider(o,c);return await i(),b}async function p(o){await E.deleteProvider(o),await i()}async function r(o){const c=await E.setDefault(o);return await i(),c}const m=A(()=>e.value.find(o=>o.is_default)??e.value[0]??null);return{providers:e,loading:n,error:d,defaultProvider:m,load:i,add:s,update:h,remove:p,setDefault:r}}export{Ye as A,qe as S,Je as a,Qe as u};
