(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[52],{1353:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a(11),c=a(0),l=a(160),s=a(222),i=a(89),o=a(804),u=a(809),d=a(22),b=a(6),j=a(248),m=a(246),p=a(158),f=a(183),O=a(1),v=new d.a;t.default=function(e){var t=Object(b.f)(),a=Object(b.g)().id,d=Object(c.useState)(),h=Object(r.a)(d,2),x=h[0],g=h[1],y=Object(c.useState)(!1),C=Object(r.a)(y,2),N=C[0],w=C[1],k=Object(j.a)(m.e().shape({name:m.f().required("Por favor, digite Nome"),description:m.f().nullable(),code:m.f().nullable(),active:m.a(),type:m.f().required("Por favor, digite O Tipo"),rule:m.f().required("Por favor, digite Regra"),preview_data_value:m.f().required("Por favor, digite Valor")})),P=Object(p.e)({resolver:k,defaultValues:{}}),_=P.handleSubmit,I=P.register,S=P.control,F={register:I,errors:P.formState.errors,control:S},D=function(e){w("list"===e),P.setValue("options",null)};return Object(c.useEffect)((function(){!function(){var e={name:null,description:null,code:null,active:!0,type:null,rule:null,preview_data_value:null,options:null};a?v.get("/checklist-item/"+a).then((function(e){var t=e.data.data,a=t.name,n=t.description,r=t.code,c=t.active,l=t.validation.type,s=t.validation.rule,i=t.validation.options,o=t.preview_data.value;D(l),g({name:a,description:n,code:r,active:c,type:l,rule:s,preview_data_value:o,options:i})}),(function(t){g(e)})):g(e)}()}),[a]),Object(c.useEffect)((function(){var e,t,a,n,r,c,l,s,i;P.setValue("name",null!==(e=null===x||void 0===x?void 0:x.name)&&void 0!==e?e:null),P.setValue("description",null!==(t=null===x||void 0===x?void 0:x.description)&&void 0!==t?t:null),P.setValue("code",null!==(a=null===x||void 0===x?void 0:x.code)&&void 0!==a?a:null),P.setValue("active",null===(n=null===x||void 0===x?void 0:x.active)||void 0===n||n),P.setValue("type",null!==(r=null===x||void 0===x?void 0:x.type)&&void 0!==r?r:null),P.setValue("rule",null!==(c=null===x||void 0===x?void 0:x.rule)&&void 0!==c?c:null),P.setValue("preview_data_value",null!==(l=null===x||void 0===x?void 0:x.preview_data_value)&&void 0!==l?l:null),P.setValue("options",null!==(s=null===x||void 0===x||null===(i=x.options)||void 0===i?void 0:i.toString())&&void 0!==s?s:null)}),[x]),Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(l.a,{breadCrumbItems:[{label:"Itens do checklist",path:"/panel/checklist-items/list"},{label:"Cadastro do Iten",path:"/panel/checklist-items/".concat(a?a+"/edit":"create"),active:!0}],insideCompany:!1,title:"Iten de lista de verifica\xe7\xe3o",company:e.company}),Object(O.jsx)(s.a,{children:Object(O.jsx)(i.a,{xs:12,children:Object(O.jsx)(o.a,{children:Object(O.jsx)(o.a.Body,{children:Object(O.jsxs)("form",{onSubmit:_((function(e){e={name:e.name,description:e.description,code:e.code,active:e.active,validation:{type:e.type,rule:e.rule,options:"list"===e.type?e.options.split(","):[]},preview_data:{value:e.preview_data_value}},(a?v.update("/checklist-item/"+a,e):v.post("/checklist-item",e)).then((function(){t("/panel/checklist-items/list")}),(function(e){if(400===e.response.status&&e.response.data.hasOwnProperty("errors"))for(var t in e.response.data.errors)e.response.data.errors.hasOwnProperty(t)&&P.setError(t,{type:"custom",message:e.response.data.errors[t].join("<br>")})}))}),(function(e){console.log(e)})),noValidate:!0,children:[Object(O.jsxs)(s.a,{children:[Object(O.jsxs)(i.a,{md:6,children:[Object(O.jsx)(f.a,Object(n.a)({label:"C\xf3digo",type:"text",name:"code",placeholder:"Digite C\xf3digo",containerClass:"mb-3"},F)),Object(O.jsx)(f.a,Object(n.a)({label:"Nome",type:"text",name:"name",placeholder:"Digite Nome",containerClass:"mb-3"},F)),Object(O.jsx)(f.a,Object(n.a)({label:"Descri\xe7\xe3o",type:"text",name:"description",placeholder:"Digite Descri\xe7\xe3o",containerClass:"mb-3"},F)),Object(O.jsx)(f.a,Object(n.a)({label:"Valor Predefini\xe7\xe3o",type:"text",name:"preview_data_value",placeholder:"Digite Valor Predefini\xe7\xe3o",containerClass:"mb-3"},F))]}),Object(O.jsxs)(i.a,{md:6,children:[Object(O.jsx)(f.a,Object(n.a)({label:"O Tipo",type:"select",name:"type",options:[{value:"boolean",label:"Boolean"},{value:"string",label:"String"},{value:"list",label:"List"},{value:"integer",label:"Integer"},{value:"horizontalBar",label:"Horizontal Bar"}],placeholder:"Digite O Tipo",containerClass:"mb-3",handleChange:D},F)),N?Object(O.jsx)(f.a,Object(n.a)({label:"Op\xe7\xf5es",type:"text",name:"options",placeholder:"Digite Options",containerClass:"mb-3"},F)):null,Object(O.jsx)(f.a,Object(n.a)({label:"Regra",type:"text",name:"rule",placeholder:"Digite Regra",containerClass:"mb-3"},F)),Object(O.jsx)(f.a,Object(n.a)({label:"Ative",type:"checkbox",name:"active",containerClass:"mb-3"},F))]})]}),Object(O.jsx)("div",{className:"mb-3 mb-0",children:Object(O.jsx)(u.a,{variant:"primary",type:"submit",children:"Cadastro"})})]})})})})})]})}},142:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0),r=a(144);function c(e){var t=Object(r.a)(e);return Object(n.useCallback)((function(){return t.current&&t.current.apply(t,arguments)}),[t])}},144:function(e,t,a){"use strict";var n=a(0);t.a=function(e){var t=Object(n.useRef)(e);return Object(n.useEffect)((function(){t.current=e}),[e]),t}},148:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0),r=a(142);function c(e,t,a,c){void 0===c&&(c=!1);var l=Object(r.a)(a);Object(n.useEffect)((function(){var a="function"===typeof e?e():e;return a.addEventListener(t,l,c),function(){return a.removeEventListener(t,l,c)}}),[e])}},149:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(){var e=Object(n.useRef)(!0),t=Object(n.useRef)((function(){return e.current}));return Object(n.useEffect)((function(){return function(){e.current=!1}}),[]),t.current}},151:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(){return Object(n.useState)(null)}},157:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(e){var t=Object(n.useRef)(null);return Object(n.useEffect)((function(){t.current=e})),t.current}},160:function(e,t,a){"use strict";a(0);var n=a(222),r=a(89),c=a(274),l=a(6),s=a(1);t.a=function(e){var t,a,i=Object(l.g)().companyId;return Object(s.jsx)(n.a,{children:Object(s.jsx)(r.a,{children:Object(s.jsxs)("div",{className:"page-title-box",children:[Object(s.jsx)("div",{className:"page-title-right",children:Object(s.jsxs)(c.a,{listProps:{className:"m-0"},children:[Object(s.jsx)(c.a.Item,{href:"/panel/companies",children:"TUNAP"}),Object(s.jsx)(c.a.Item,{hidden:!1===e.insideCompany,href:"/panel/company/".concat((null===(t=e.company)||void 0===t?void 0:t.id)||i,"/dashboard"),children:(null===(a=e.company)||void 0===a?void 0:a.name)||"Empresa"}),e.breadCrumbItems.map((function(t,a){var n;return t.active?Object(s.jsx)(c.a.Item,{active:!0,children:t.label},a):Object(s.jsx)(c.a.Item,{href:!1===e.insideCompany?t.path:"/panel/company/".concat((null===(n=e.company)||void 0===n?void 0:n.id)||i).concat(t.path),children:t.label},a)}))]})}),Object(s.jsx)("h4",{className:"page-title",children:e.title})]})})})}},171:function(e,t,a){"use strict";var n=a(11),r=a(0),c=(a(151),a(144),a(142));a(148);a(149),a(157);a(192),new WeakMap;var l=a(216),s=a(1),i=["onKeyDown"];var o=r.forwardRef((function(e,t){var a,r=e.onKeyDown,o=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,i),u=Object(l.b)(Object.assign({tagName:"a"},o)),d=Object(n.a)(u,1)[0],b=Object(c.a)((function(e){d.onKeyDown(e),null==r||r(e)}));return((a=o.href)&&"#"!==a.trim()||o.role)&&"button"!==o.role?Object(s.jsx)("a",Object.assign({ref:t},o,{onKeyDown:r})):Object(s.jsx)("a",Object.assign({ref:t},o,d,{onKeyDown:b}))}));o.displayName="Anchor";t.a=o},183:function(e,t,a){"use strict";a.d(t,"b",(function(){return i})),a.d(t,"a",(function(){return v}));var n=a(2),r=a(0),c=a.n(r),l=a(158),s=a(1),i=function(e){var t=e.defaultValues,a=e.resolver,r=e.children,i=e.onSubmit,o=e.customMethods,u=e.formClass,d=Object(l.e)({defaultValues:t,resolver:a});o&&(d=o);var b=d,j=b.handleSubmit,m=b.register,p=b.control,f=b.formState.errors;return Object(s.jsx)("form",{onSubmit:j(i,(function(e){console.log(e)})),className:u,noValidate:!0,children:Array.isArray(r)?r.map((function(e){return e.props&&e.props.name?c.a.createElement(e.type,Object(n.a)({},Object(n.a)(Object(n.a)({},e.props),{},{register:m,key:e.props.name,errors:f,control:p}))):e})):r})},o=a(8),u=a(11),d=a(1332),b=a(138),j=a(13),m=a.n(j),p=a(247),f=a(187),O=function(e){var t=e.name,a=e.placeholder,c=e.refCallback,l=e.errors,i=e.register,o=e.className,j=Object(r.useState)(!1),p=Object(u.a)(j,2),f=p[0],O=p[1];return Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(d.a,{className:"mb-0",children:[Object(s.jsx)(b.a.Control,Object(n.a)(Object(n.a)({type:f?"text":"password",placeholder:a,name:t,id:t,as:"input",ref:function(e){c&&c(e)},className:o,isInvalid:!(!l||!l[t])},i?i(t):{}),{},{autoComplete:t})),Object(s.jsx)("div",{className:m()("input-group-text","input-group-password",{"show-password":f}),"data-password":f?"true":"false",children:Object(s.jsx)("span",{className:"password-eye",onClick:function(){O(!f)}})})]})})},v=function(e){var t=e.label,a=e.type,r=e.name,c=e.placeholder,i=e.register,u=e.errors,d=e.className,j=e.labelClassName,m=e.containerClass,v=e.refCallback,h=e.children,x=e.options,g=e.smallHtml,y=Object(o.a)(e,["label","type","name","placeholder","register","errors","className","labelClassName","containerClass","refCallback","children","options","smallHtml"]),C="textarea"===a?"textarea":"select"===a?"select":"datepicker"===a?"datepicker":"input";return Object(s.jsx)(s.Fragment,{children:"hidden"===a?Object(s.jsx)("input",Object(n.a)(Object(n.a)({type:a,name:r},i?i(r):{}),y)):Object(s.jsx)(s.Fragment,{children:"password"===a?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(b.a.Group,{className:m,children:[t?Object(s.jsxs)(s.Fragment,{children:[" ",Object(s.jsx)(b.a.Label,{className:j,children:t})," ",h," "]}):null,Object(s.jsx)(O,{name:r,placeholder:c,refCallback:v,errors:u,register:i,className:d}),u&&u[r]?Object(s.jsx)(b.a.Control.Feedback,{type:"invalid",className:"d-block",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"select"===a?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(b.a.Group,{className:m,children:[t?Object(s.jsx)(b.a.Label,{className:j,children:t}):null,Object(s.jsx)(l.a,{control:y.control,render:function(e){var t=e.field,a=t.onChange,r=t.value,c=t.name,l=t.ref;return Object(s.jsx)(p.a,Object(n.a)({className:"react-select "+(u&&u[c]?"is-invalid":""),classNamePrefix:"react-select",inputRef:l,name:c,options:x,value:x.find((function(e){return e.value===r}))||null,onChange:function(e){a(e.value),y.hasOwnProperty("handleChange")&&y.handleChange(e.value)}},y))},name:r}),u&&u[r]?Object(s.jsx)(b.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"checkbox"===a||"radio"===a||"switch"===a?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(b.a.Group,{className:m,children:[Object(s.jsx)(b.a.Check,Object(n.a)(Object(n.a)({type:a,label:t,name:r,id:r,ref:function(e){v&&v(e)},className:d,isInvalid:!(!u||!u[r])},i?i(r):{}),y)),u&&u[r]?Object(s.jsx)(b.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"datepicker"===a?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(b.a.Group,{className:m,children:[t?Object(s.jsx)(b.a.Label,{className:j,children:t}):null,Object(s.jsx)("div",{className:u&&u[r]?"is-invalid":"",children:Object(s.jsx)(l.a,{control:y.control,render:function(e){var t=e.field,a=(t.onChange,t.value),r=t.name;t.ref;return Object(s.jsx)(f.a,Object(n.a)({hideAddon:!0,showTimeSelect:!0,timeFormat:"HH:mm",tI:1,dateFormat:"dd/MM/yyyy h:mm aa",timeCaption:"time",name:r,value:a,onChange:function(e){y.hasOwnProperty("handleChange")&&y.handleChange(e)}},y))},name:r})}),u&&u[r]?Object(s.jsx)(b.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})}):Object(s.jsxs)(b.a.Group,{className:m,children:[t?Object(s.jsx)(b.a.Label,{className:j,children:t}):null,Object(s.jsx)(b.a.Control,Object(n.a)(Object(n.a)(Object(n.a)({type:a,placeholder:c,name:r,id:r,as:C,ref:function(e){v&&v(e)},className:d,isInvalid:!(!u||!u[r])},i?i(r):{}),y),{},{autoComplete:r,children:h||null})),u&&u[r]?Object(s.jsx)(b.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})})})})})})}},187:function(e,t,a){"use strict";var n=a(0),r=a(264),c=a.n(r),l=a(13),s=a.n(l),i=a(1),o=Object(n.forwardRef)((function(e,t){return Object(i.jsx)("input",{type:"text",className:"form-control date",onClick:e.onClick,value:e.value,onChange:function(){console.log("date value changed")},ref:t})})),u=Object(n.forwardRef)((function(e,t){return Object(i.jsxs)("div",{className:"input-group",ref:t,children:[Object(i.jsx)("input",{type:"text",className:"form-control form-control-light",onClick:e.onClick,value:e.value,readOnly:!0}),Object(i.jsx)("div",{className:"input-group-append",children:Object(i.jsx)("span",{className:"input-group-text bg-primary border-primary text-white",children:Object(i.jsx)("i",{className:"mdi mdi-calendar-range font-13"})})})]})}));t.a=function(e){var t=!0===(e.hideAddon||!1)?Object(i.jsx)(o,{}):Object(i.jsx)(u,{});return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(c.a,{customInput:t,timeIntervals:e.tI,className:s()("form-control",e.inputClass),selected:e.value,onChange:function(t){return e.onChange(t)},showTimeSelect:e.showTimeSelect,timeFormat:"hh:mm a",timeCaption:e.timeCaption,dateFormat:e.dateFormat||"MM/dd/yyyy",minDate:e.minDate,maxDate:e.maxDate,monthsShown:e.monthsShown,showTimeSelectOnly:e.showTimeSelectOnly,inline:e.inline,autoComplete:"off"})})}},192:function(e,t,a){"use strict";(function(e){var n=a(0),r="undefined"!==typeof e&&e.navigator&&"ReactNative"===e.navigator.product,c="undefined"!==typeof document;t.a=c||r?n.useLayoutEffect:n.useEffect}).call(this,a(95))},222:function(e,t,a){"use strict";var n=a(2),r=a(8),c=a(13),l=a.n(c),s=a(0),i=a(14),o=a(1),u=s.forwardRef((function(e,t){var a=e.bsPrefix,c=e.className,s=e.as,u=void 0===s?"div":s,d=Object(r.a)(e,["bsPrefix","className","as"]),b=Object(i.b)(a,"row"),j=Object(i.a)(),m="".concat(b,"-cols"),p=[];return j.forEach((function(e){var t,a=d[e];delete d[e],t=null!=a&&"object"===typeof a?a.cols:a;var n="xs"!==e?"-".concat(e):"";null!=t&&p.push("".concat(m).concat(n,"-").concat(t))})),Object(o.jsx)(u,Object(n.a)(Object(n.a)({ref:t},d),{},{className:l.a.apply(void 0,[c,b].concat(p))}))}));u.displayName="Row",t.a=u},274:function(e,t,a){"use strict";var n=a(2),r=a(8),c=a(13),l=a.n(c),s=a(0),i=a(14),o=a(171),u=a(1),d=s.forwardRef((function(e,t){var a=e.bsPrefix,c=e.active,s=e.children,d=e.className,b=e.as,j=void 0===b?"li":b,m=e.linkAs,p=void 0===m?o.a:m,f=e.linkProps,O=e.href,v=e.title,h=e.target,x=Object(r.a)(e,["bsPrefix","active","children","className","as","linkAs","linkProps","href","title","target"]),g=Object(i.b)(a,"breadcrumb-item");return Object(u.jsx)(j,Object(n.a)(Object(n.a)({ref:t},x),{},{className:l()(g,d,{active:c}),"aria-current":c?"page":void 0,children:c?s:Object(u.jsx)(p,Object(n.a)(Object(n.a)({},f),{},{href:O,title:v,target:h,children:s}))}))}));d.displayName="BreadcrumbItem",d.defaultProps={active:!1,linkProps:{}};var b=d,j=s.forwardRef((function(e,t){var a=e.bsPrefix,c=e.className,s=e.listProps,o=e.children,d=e.label,b=e.as,j=void 0===b?"nav":b,m=Object(r.a)(e,["bsPrefix","className","listProps","children","label","as"]),p=Object(i.b)(a,"breadcrumb");return Object(u.jsx)(j,Object(n.a)(Object(n.a)({"aria-label":d,className:c,ref:t},m),{},{children:Object(u.jsx)("ol",Object(n.a)(Object(n.a)({},s),{},{className:l()(p,null==s?void 0:s.className),children:o}))}))}));j.displayName="Breadcrumb",j.defaultProps={label:"breadcrumb",listProps:{}};t.a=Object.assign(j,{Item:b})}}]);
//# sourceMappingURL=52.9cb702dc.chunk.js.map