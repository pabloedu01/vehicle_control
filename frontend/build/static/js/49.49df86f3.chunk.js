(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[49],{1340:function(e,t,a){"use strict";a.r(t);var n=a(2),c=a(50),r=a(11),s=a(0),l=a(160),i=a(222),o=a(89),u=a(804),d=a(809),j=a(22),b=a(6),m=a(248),f=a(246),O=a(158),h=a(183),p=a(533),v=a(1),x=new j.a;t.default=function(e){var t=Object(b.f)(),a=Object(b.g)().id,j=Object(s.useState)(),g=Object(r.a)(j,2),y=g[0],N=g[1],C=Object(s.useState)([]),w=Object(r.a)(C,2),k=w[0],S=w[1],_=Object(s.useState)([]),F=Object(r.a)(_,2),P=F[0],I=F[1],E=Object(s.useState)(!1),D=Object(r.a)(E,2),R=D[0],T=D[1],L=Object(s.useState)(!1),M=Object(r.a)(L,2),V=M[0],A=M[1],H=Object(m.a)(f.e().shape({user_id:f.d(),name:f.f().required("Por favor, digite Nome Completo"),active:f.a()})),G=Object(O.e)({resolver:H,defaultValues:{}}),K=G.handleSubmit,U=G.register,W=G.control,B={register:U,errors:G.formState.errors,control:W};return Object(s.useEffect)((function(){y&&function(){var t;x.get("/technical-consultant/available-users",{company_id:null===(t=e.company)||void 0===t?void 0:t.id}).then((function(e){var t=[{value:0,label:"Without User"}].concat(Object(p.a)(e.data.data,y.user));I(t),S(t)}),(function(e){S([{value:0,label:"Without User"}]),I([{value:0,label:"Without User"}])}))}()}),[y]),Object(s.useEffect)((function(){!function(){var e={user_id:0,name:null,active:!0};a?x.get("/technical-consultant/"+a).then((function(e){var t=e.data.data,a=t.user_id,n=t.name,r=t.active,s=t.user;a?(S([{value:a,label:n}]),T(!0),A(!0)):(T(!1),A(!1),k.length!==P.length&&S(Object(c.a)(P))),N({name:n,user_id:a,active:r,user:s})}),(function(t){N(e)})):N(e)}()}),[a]),Object(s.useEffect)((function(){var e,t,a;G.setValue("name",null!==(e=null===y||void 0===y?void 0:y.name)&&void 0!==e?e:null),G.setValue("active",null===(t=null===y||void 0===y?void 0:y.active)||void 0===t||t),G.setValue("user_id",null!==(a=null===y||void 0===y?void 0:y.user_id)&&void 0!==a?a:0)}),[y]),Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(l.a,{breadCrumbItems:[{label:"Consultores T\xe9cnicos",path:"/technical-consultants/list"},{label:"Cadastro",path:"/technical-consultants/".concat(a?a+"/edit":"create"),active:!0}],title:"Formul\xe1rio de Consultor T\xe9cnico",company:e.company}),Object(v.jsx)(i.a,{children:Object(v.jsx)(o.a,{xs:12,children:Object(v.jsx)(u.a,{children:Object(v.jsx)(u.a.Body,{children:Object(v.jsxs)("form",{onSubmit:K((function(n){var c,r;a?c=x.update("/technical-consultant/"+a,Object.assign(n,{user_id:n.user_id?n.user_id:null})):c=x.post("/technical-consultant",Object.assign(n,{company_id:null===(r=e.company)||void 0===r?void 0:r.id,user_id:n.user_id?n.user_id:null}));c.then((function(){var a;t("/panel/company/".concat(null===(a=e.company)||void 0===a?void 0:a.id,"/technical-consultants/list"))}),(function(e){if(400===e.response.status&&e.response.data.hasOwnProperty("errors"))for(var t in e.response.data.errors)e.response.data.errors.hasOwnProperty(t)&&G.setError(t,{type:"custom",message:e.response.data.errors[t].join("<br>")})}))}),(function(e){console.log(e)})),noValidate:!0,children:[Object(v.jsxs)(i.a,{children:[Object(v.jsxs)(o.a,{md:6,children:[Object(v.jsx)(h.a,Object(n.a)(Object(n.a)({label:"Usuario",type:"select",name:"user_id",placeholder:"Digite Nome",containerClass:"mb-3"},B),{},{options:k,handleChange:function(e){var t=k.find((function(t){return t.value===e}));G.clearErrors("name"),t&&t.value?(G.setValue("name",t.label),T(!0)):(G.setValue("name",""),T(!1))},isDisabled:V})),Object(v.jsx)(h.a,Object(n.a)(Object(n.a)({label:"Nome",type:"text",name:"name",placeholder:"Digite Nome",containerClass:"mb-3"},B),{},{readOnly:R}))]}),Object(v.jsx)(o.a,{md:6,children:Object(v.jsx)(h.a,Object(n.a)({label:"Ative",type:"checkbox",name:"active",containerClass:"mb-3"},B))})]}),Object(v.jsx)("div",{className:"mb-3 mb-0",children:Object(v.jsx)(d.a,{variant:"primary",type:"submit",children:"Cadastro"})})]})})})})})]})}},142:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0),c=a(144);function r(e){var t=Object(c.a)(e);return Object(n.useCallback)((function(){return t.current&&t.current.apply(t,arguments)}),[t])}},144:function(e,t,a){"use strict";var n=a(0);t.a=function(e){var t=Object(n.useRef)(e);return Object(n.useEffect)((function(){t.current=e}),[e]),t}},148:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0),c=a(142);function r(e,t,a,r){void 0===r&&(r=!1);var s=Object(c.a)(a);Object(n.useEffect)((function(){var a="function"===typeof e?e():e;return a.addEventListener(t,s,r),function(){return a.removeEventListener(t,s,r)}}),[e])}},149:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0);function c(){var e=Object(n.useRef)(!0),t=Object(n.useRef)((function(){return e.current}));return Object(n.useEffect)((function(){return function(){e.current=!1}}),[]),t.current}},151:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0);function c(){return Object(n.useState)(null)}},157:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0);function c(e){var t=Object(n.useRef)(null);return Object(n.useEffect)((function(){t.current=e})),t.current}},160:function(e,t,a){"use strict";a(0);var n=a(222),c=a(89),r=a(274),s=a(6),l=a(1);t.a=function(e){var t,a,i=Object(s.g)().companyId;return Object(l.jsx)(n.a,{children:Object(l.jsx)(c.a,{children:Object(l.jsxs)("div",{className:"page-title-box",children:[Object(l.jsx)("div",{className:"page-title-right",children:Object(l.jsxs)(r.a,{listProps:{className:"m-0"},children:[Object(l.jsx)(r.a.Item,{href:"/panel/companies",children:"TUNAP"}),Object(l.jsx)(r.a.Item,{hidden:!1===e.insideCompany,href:"/panel/company/".concat((null===(t=e.company)||void 0===t?void 0:t.id)||i,"/dashboard"),children:(null===(a=e.company)||void 0===a?void 0:a.name)||"Empresa"}),e.breadCrumbItems.map((function(t,a){var n;return t.active?Object(l.jsx)(r.a.Item,{active:!0,children:t.label},a):Object(l.jsx)(r.a.Item,{href:!1===e.insideCompany?t.path:"/panel/company/".concat((null===(n=e.company)||void 0===n?void 0:n.id)||i).concat(t.path),children:t.label},a)}))]})}),Object(l.jsx)("h4",{className:"page-title",children:e.title})]})})})}},171:function(e,t,a){"use strict";var n=a(11),c=a(0),r=(a(151),a(144),a(142));a(148);a(149),a(157);a(192),new WeakMap;var s=a(216),l=a(1),i=["onKeyDown"];var o=c.forwardRef((function(e,t){var a,c=e.onKeyDown,o=function(e,t){if(null==e)return{};var a,n,c={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(c[a]=e[a]);return c}(e,i),u=Object(s.b)(Object.assign({tagName:"a"},o)),d=Object(n.a)(u,1)[0],j=Object(r.a)((function(e){d.onKeyDown(e),null==c||c(e)}));return((a=o.href)&&"#"!==a.trim()||o.role)&&"button"!==o.role?Object(l.jsx)("a",Object.assign({ref:t},o,{onKeyDown:c})):Object(l.jsx)("a",Object.assign({ref:t},o,d,{onKeyDown:j}))}));o.displayName="Anchor";t.a=o},183:function(e,t,a){"use strict";a.d(t,"b",(function(){return i})),a.d(t,"a",(function(){return p}));var n=a(2),c=a(0),r=a.n(c),s=a(158),l=a(1),i=function(e){var t=e.defaultValues,a=e.resolver,c=e.children,i=e.onSubmit,o=e.customMethods,u=e.formClass,d=Object(s.e)({defaultValues:t,resolver:a});o&&(d=o);var j=d,b=j.handleSubmit,m=j.register,f=j.control,O=j.formState.errors;return Object(l.jsx)("form",{onSubmit:b(i,(function(e){console.log(e)})),className:u,noValidate:!0,children:Array.isArray(c)?c.map((function(e){return e.props&&e.props.name?r.a.createElement(e.type,Object(n.a)({},Object(n.a)(Object(n.a)({},e.props),{},{register:m,key:e.props.name,errors:O,control:f}))):e})):c})},o=a(8),u=a(11),d=a(1332),j=a(138),b=a(13),m=a.n(b),f=a(247),O=a(187),h=function(e){var t=e.name,a=e.placeholder,r=e.refCallback,s=e.errors,i=e.register,o=e.className,b=Object(c.useState)(!1),f=Object(u.a)(b,2),O=f[0],h=f[1];return Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)(d.a,{className:"mb-0",children:[Object(l.jsx)(j.a.Control,Object(n.a)(Object(n.a)({type:O?"text":"password",placeholder:a,name:t,id:t,as:"input",ref:function(e){r&&r(e)},className:o,isInvalid:!(!s||!s[t])},i?i(t):{}),{},{autoComplete:t})),Object(l.jsx)("div",{className:m()("input-group-text","input-group-password",{"show-password":O}),"data-password":O?"true":"false",children:Object(l.jsx)("span",{className:"password-eye",onClick:function(){h(!O)}})})]})})},p=function(e){var t=e.label,a=e.type,c=e.name,r=e.placeholder,i=e.register,u=e.errors,d=e.className,b=e.labelClassName,m=e.containerClass,p=e.refCallback,v=e.children,x=e.options,g=e.smallHtml,y=Object(o.a)(e,["label","type","name","placeholder","register","errors","className","labelClassName","containerClass","refCallback","children","options","smallHtml"]),N="textarea"===a?"textarea":"select"===a?"select":"datepicker"===a?"datepicker":"input";return Object(l.jsx)(l.Fragment,{children:"hidden"===a?Object(l.jsx)("input",Object(n.a)(Object(n.a)({type:a,name:c},i?i(c):{}),y)):Object(l.jsx)(l.Fragment,{children:"password"===a?Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)(j.a.Group,{className:m,children:[t?Object(l.jsxs)(l.Fragment,{children:[" ",Object(l.jsx)(j.a.Label,{className:b,children:t})," ",v," "]}):null,Object(l.jsx)(h,{name:c,placeholder:r,refCallback:p,errors:u,register:i,className:d}),u&&u[c]?Object(l.jsx)(j.a.Control.Feedback,{type:"invalid",className:"d-block",children:Object(l.jsx)("span",{dangerouslySetInnerHTML:{__html:u[c].message}})}):null]})}):Object(l.jsx)(l.Fragment,{children:"select"===a?Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)(j.a.Group,{className:m,children:[t?Object(l.jsx)(j.a.Label,{className:b,children:t}):null,Object(l.jsx)(s.a,{control:y.control,render:function(e){var t=e.field,a=t.onChange,c=t.value,r=t.name,s=t.ref;return Object(l.jsx)(f.a,Object(n.a)({className:"react-select "+(u&&u[r]?"is-invalid":""),classNamePrefix:"react-select",inputRef:s,name:r,options:x,value:x.find((function(e){return e.value===c}))||null,onChange:function(e){a(e.value),y.hasOwnProperty("handleChange")&&y.handleChange(e.value)}},y))},name:c}),u&&u[c]?Object(l.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(l.jsx)("span",{dangerouslySetInnerHTML:{__html:u[c].message}})}):null]})}):Object(l.jsx)(l.Fragment,{children:"checkbox"===a||"radio"===a||"switch"===a?Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)(j.a.Group,{className:m,children:[Object(l.jsx)(j.a.Check,Object(n.a)(Object(n.a)({type:a,label:t,name:c,id:c,ref:function(e){p&&p(e)},className:d,isInvalid:!(!u||!u[c])},i?i(c):{}),y)),u&&u[c]?Object(l.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(l.jsx)("span",{dangerouslySetInnerHTML:{__html:u[c].message}})}):null]})}):Object(l.jsx)(l.Fragment,{children:"datepicker"===a?Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)(j.a.Group,{className:m,children:[t?Object(l.jsx)(j.a.Label,{className:b,children:t}):null,Object(l.jsx)("div",{className:u&&u[c]?"is-invalid":"",children:Object(l.jsx)(s.a,{control:y.control,render:function(e){var t=e.field,a=(t.onChange,t.value),c=t.name;t.ref;return Object(l.jsx)(O.a,Object(n.a)({hideAddon:!0,showTimeSelect:!0,timeFormat:"HH:mm",tI:1,dateFormat:"dd/MM/yyyy h:mm aa",timeCaption:"time",name:c,value:a,onChange:function(e){y.hasOwnProperty("handleChange")&&y.handleChange(e)}},y))},name:c})}),u&&u[c]?Object(l.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(l.jsx)("span",{dangerouslySetInnerHTML:{__html:u[c].message}})}):null,g||null]})}):Object(l.jsxs)(j.a.Group,{className:m,children:[t?Object(l.jsx)(j.a.Label,{className:b,children:t}):null,Object(l.jsx)(j.a.Control,Object(n.a)(Object(n.a)(Object(n.a)({type:a,placeholder:r,name:c,id:c,as:N,ref:function(e){p&&p(e)},className:d,isInvalid:!(!u||!u[c])},i?i(c):{}),y),{},{autoComplete:c,children:v||null})),u&&u[c]?Object(l.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(l.jsx)("span",{dangerouslySetInnerHTML:{__html:u[c].message}})}):null,g||null]})})})})})})}},187:function(e,t,a){"use strict";var n=a(0),c=a(264),r=a.n(c),s=a(13),l=a.n(s),i=a(1),o=Object(n.forwardRef)((function(e,t){return Object(i.jsx)("input",{type:"text",className:"form-control date",onClick:e.onClick,value:e.value,onChange:function(){console.log("date value changed")},ref:t})})),u=Object(n.forwardRef)((function(e,t){return Object(i.jsxs)("div",{className:"input-group",ref:t,children:[Object(i.jsx)("input",{type:"text",className:"form-control form-control-light",onClick:e.onClick,value:e.value,readOnly:!0}),Object(i.jsx)("div",{className:"input-group-append",children:Object(i.jsx)("span",{className:"input-group-text bg-primary border-primary text-white",children:Object(i.jsx)("i",{className:"mdi mdi-calendar-range font-13"})})})]})}));t.a=function(e){var t=!0===(e.hideAddon||!1)?Object(i.jsx)(o,{}):Object(i.jsx)(u,{});return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(r.a,{customInput:t,timeIntervals:e.tI,className:l()("form-control",e.inputClass),selected:e.value,onChange:function(t){return e.onChange(t)},showTimeSelect:e.showTimeSelect,timeFormat:"hh:mm a",timeCaption:e.timeCaption,dateFormat:e.dateFormat||"MM/dd/yyyy",minDate:e.minDate,maxDate:e.maxDate,monthsShown:e.monthsShown,showTimeSelectOnly:e.showTimeSelectOnly,inline:e.inline,autoComplete:"off"})})}},192:function(e,t,a){"use strict";(function(e){var n=a(0),c="undefined"!==typeof e&&e.navigator&&"ReactNative"===e.navigator.product,r="undefined"!==typeof document;t.a=r||c?n.useLayoutEffect:n.useEffect}).call(this,a(95))},222:function(e,t,a){"use strict";var n=a(2),c=a(8),r=a(13),s=a.n(r),l=a(0),i=a(14),o=a(1),u=l.forwardRef((function(e,t){var a=e.bsPrefix,r=e.className,l=e.as,u=void 0===l?"div":l,d=Object(c.a)(e,["bsPrefix","className","as"]),j=Object(i.b)(a,"row"),b=Object(i.a)(),m="".concat(j,"-cols"),f=[];return b.forEach((function(e){var t,a=d[e];delete d[e],t=null!=a&&"object"===typeof a?a.cols:a;var n="xs"!==e?"-".concat(e):"";null!=t&&f.push("".concat(m).concat(n,"-").concat(t))})),Object(o.jsx)(u,Object(n.a)(Object(n.a)({ref:t},d),{},{className:s.a.apply(void 0,[r,j].concat(f))}))}));u.displayName="Row",t.a=u},274:function(e,t,a){"use strict";var n=a(2),c=a(8),r=a(13),s=a.n(r),l=a(0),i=a(14),o=a(171),u=a(1),d=l.forwardRef((function(e,t){var a=e.bsPrefix,r=e.active,l=e.children,d=e.className,j=e.as,b=void 0===j?"li":j,m=e.linkAs,f=void 0===m?o.a:m,O=e.linkProps,h=e.href,p=e.title,v=e.target,x=Object(c.a)(e,["bsPrefix","active","children","className","as","linkAs","linkProps","href","title","target"]),g=Object(i.b)(a,"breadcrumb-item");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({ref:t},x),{},{className:s()(g,d,{active:r}),"aria-current":r?"page":void 0,children:r?l:Object(u.jsx)(f,Object(n.a)(Object(n.a)({},O),{},{href:h,title:p,target:v,children:l}))}))}));d.displayName="BreadcrumbItem",d.defaultProps={active:!1,linkProps:{}};var j=d,b=l.forwardRef((function(e,t){var a=e.bsPrefix,r=e.className,l=e.listProps,o=e.children,d=e.label,j=e.as,b=void 0===j?"nav":j,m=Object(c.a)(e,["bsPrefix","className","listProps","children","label","as"]),f=Object(i.b)(a,"breadcrumb");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({"aria-label":d,className:r,ref:t},m),{},{children:Object(u.jsx)("ol",Object(n.a)(Object(n.a)({},l),{},{className:s()(f,null==l?void 0:l.className),children:o}))}))}));b.displayName="Breadcrumb",b.defaultProps={label:"breadcrumb",listProps:{}};t.a=Object.assign(b,{Item:j})},533:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"id",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"name";return e.map((function(e){return{value:e[t],label:e[a]}}))},c=function(e,t){return null!==t?e.find((function(e){return e.value===t})):void 0},r=function(e,t,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"id",c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"name";return t||!a?e:e.concat(t?[]:[{value:a[n],label:a[c]+" "+(a.hasOwnProperty("active")&&!0!==a.active?"(Not active)":"(Deleted)")}])},s=function(e,t){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"id",l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"name",i=n(e,s,l);if(a){var o=t?c(i,t[s]):void 0;return r(i,o,t,s,l)}return i}}}]);
//# sourceMappingURL=49.49df86f3.chunk.js.map