(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[53],{1359:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a(11),c=a(0),s=a(160),i=a(222),l=a(89),o=a(804),u=a(809),d=a(22),j=a(6),b=a(248),m=a(246),f=a(158),p=a(183),O=a(1),h=new d.a;t.default=function(e){var t=Object(j.f)(),a=Object(j.g)().id,d=Object(c.useState)(),v=Object(r.a)(d,2),x=v[0],g=v[1],y=Object(b.a)(m.e().shape({integration_code:m.f().nullable(),description:m.f().required("Por favor, digite Descri\xe7\xe3o")})),N=Object(f.e)({resolver:y,defaultValues:{}}),C=N.handleSubmit,w=N.register,k=N.control,F={register:w,errors:N.formState.errors,control:k};return Object(c.useEffect)((function(){!function(){var e={integration_code:null,description:null};a?h.get("/claim-service/"+a).then((function(e){var t=e.data.data,a=t.integration_code,n=t.description;g({integration_code:a,description:n})}),(function(t){g(e)})):g(e)}()}),[a]),Object(c.useEffect)((function(){var e,t;N.setValue("integration_code",null!==(e=null===x||void 0===x?void 0:x.integration_code)&&void 0!==e?e:null),N.setValue("description",null!==(t=null===x||void 0===x?void 0:x.description)&&void 0!==t?t:null)}),[x]),Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(s.a,{breadCrumbItems:[{label:"Reclama\xe7\xf5es",path:"/claim-services/list"},{label:"Cadastro",path:"/claim-services/".concat(a?a+"/edit":"create"),active:!0}],title:"Reclama\xe7\xf5es",company:e.company}),Object(O.jsx)(i.a,{children:Object(O.jsx)(l.a,{xs:12,children:Object(O.jsx)(o.a,{children:Object(O.jsx)(o.a.Body,{children:Object(O.jsxs)("form",{onSubmit:C((function(n){var r,c;a?r=h.update("/claim-service/"+a,n):r=h.post("/claim-service",Object.assign(n,{company_id:null===(c=e.company)||void 0===c?void 0:c.id}));r.then((function(){var a;t("/panel/company/".concat(null===(a=e.company)||void 0===a?void 0:a.id,"/claim-services/list"))}),(function(e){if(400===e.response.status&&e.response.data.hasOwnProperty("errors"))for(var t in e.response.data.errors)e.response.data.errors.hasOwnProperty(t)&&N.setError(t,{type:"custom",message:e.response.data.errors[t].join("<br>")})}))}),(function(e){console.log(e)})),noValidate:!0,children:[Object(O.jsx)(i.a,{children:Object(O.jsxs)(l.a,{md:6,children:[Object(O.jsx)(p.a,Object(n.a)({label:"C\xf3digo de Integra\xe7\xe3o",type:"text",name:"integration_code",placeholder:"Digite C\xf3digo de Integra\xe7\xe3o",containerClass:"mb-3"},F)),Object(O.jsx)(p.a,Object(n.a)({label:"Descri\xe7\xe3o",type:"text",name:"description",placeholder:"Digite Descri\xe7\xe3o",containerClass:"mb-3"},F))]})}),Object(O.jsx)("div",{className:"mb-3 mb-0",children:Object(O.jsx)(u.a,{variant:"primary",type:"submit",children:"Cadastro"})})]})})})})})]})}},142:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0),r=a(144);function c(e){var t=Object(r.a)(e);return Object(n.useCallback)((function(){return t.current&&t.current.apply(t,arguments)}),[t])}},144:function(e,t,a){"use strict";var n=a(0);t.a=function(e){var t=Object(n.useRef)(e);return Object(n.useEffect)((function(){t.current=e}),[e]),t}},148:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(0),r=a(142);function c(e,t,a,c){void 0===c&&(c=!1);var s=Object(r.a)(a);Object(n.useEffect)((function(){var a="function"===typeof e?e():e;return a.addEventListener(t,s,c),function(){return a.removeEventListener(t,s,c)}}),[e])}},149:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(){var e=Object(n.useRef)(!0),t=Object(n.useRef)((function(){return e.current}));return Object(n.useEffect)((function(){return function(){e.current=!1}}),[]),t.current}},151:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(){return Object(n.useState)(null)}},157:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(0);function r(e){var t=Object(n.useRef)(null);return Object(n.useEffect)((function(){t.current=e})),t.current}},160:function(e,t,a){"use strict";a(0);var n=a(222),r=a(89),c=a(274),s=a(6),i=a(1);t.a=function(e){var t,a,l=Object(s.g)().companyId;return Object(i.jsx)(n.a,{children:Object(i.jsx)(r.a,{children:Object(i.jsxs)("div",{className:"page-title-box",children:[Object(i.jsx)("div",{className:"page-title-right",children:Object(i.jsxs)(c.a,{listProps:{className:"m-0"},children:[Object(i.jsx)(c.a.Item,{href:"/panel/companies",children:"TUNAP"}),Object(i.jsx)(c.a.Item,{hidden:!1===e.insideCompany,href:"/panel/company/".concat((null===(t=e.company)||void 0===t?void 0:t.id)||l,"/dashboard"),children:(null===(a=e.company)||void 0===a?void 0:a.name)||"Empresa"}),e.breadCrumbItems.map((function(t,a){var n;return t.active?Object(i.jsx)(c.a.Item,{active:!0,children:t.label},a):Object(i.jsx)(c.a.Item,{href:!1===e.insideCompany?t.path:"/panel/company/".concat((null===(n=e.company)||void 0===n?void 0:n.id)||l).concat(t.path),children:t.label},a)}))]})}),Object(i.jsx)("h4",{className:"page-title",children:e.title})]})})})}},171:function(e,t,a){"use strict";var n=a(11),r=a(0),c=(a(151),a(144),a(142));a(148);a(149),a(157);a(192),new WeakMap;var s=a(216),i=a(1),l=["onKeyDown"];var o=r.forwardRef((function(e,t){var a,r=e.onKeyDown,o=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,l),u=Object(s.b)(Object.assign({tagName:"a"},o)),d=Object(n.a)(u,1)[0],j=Object(c.a)((function(e){d.onKeyDown(e),null==r||r(e)}));return((a=o.href)&&"#"!==a.trim()||o.role)&&"button"!==o.role?Object(i.jsx)("a",Object.assign({ref:t},o,{onKeyDown:r})):Object(i.jsx)("a",Object.assign({ref:t},o,d,{onKeyDown:j}))}));o.displayName="Anchor";t.a=o},183:function(e,t,a){"use strict";a.d(t,"b",(function(){return l})),a.d(t,"a",(function(){return h}));var n=a(2),r=a(0),c=a.n(r),s=a(158),i=a(1),l=function(e){var t=e.defaultValues,a=e.resolver,r=e.children,l=e.onSubmit,o=e.customMethods,u=e.formClass,d=Object(s.e)({defaultValues:t,resolver:a});o&&(d=o);var j=d,b=j.handleSubmit,m=j.register,f=j.control,p=j.formState.errors;return Object(i.jsx)("form",{onSubmit:b(l,(function(e){console.log(e)})),className:u,noValidate:!0,children:Array.isArray(r)?r.map((function(e){return e.props&&e.props.name?c.a.createElement(e.type,Object(n.a)({},Object(n.a)(Object(n.a)({},e.props),{},{register:m,key:e.props.name,errors:p,control:f}))):e})):r})},o=a(8),u=a(11),d=a(1332),j=a(138),b=a(13),m=a.n(b),f=a(247),p=a(187),O=function(e){var t=e.name,a=e.placeholder,c=e.refCallback,s=e.errors,l=e.register,o=e.className,b=Object(r.useState)(!1),f=Object(u.a)(b,2),p=f[0],O=f[1];return Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)(d.a,{className:"mb-0",children:[Object(i.jsx)(j.a.Control,Object(n.a)(Object(n.a)({type:p?"text":"password",placeholder:a,name:t,id:t,as:"input",ref:function(e){c&&c(e)},className:o,isInvalid:!(!s||!s[t])},l?l(t):{}),{},{autoComplete:t})),Object(i.jsx)("div",{className:m()("input-group-text","input-group-password",{"show-password":p}),"data-password":p?"true":"false",children:Object(i.jsx)("span",{className:"password-eye",onClick:function(){O(!p)}})})]})})},h=function(e){var t=e.label,a=e.type,r=e.name,c=e.placeholder,l=e.register,u=e.errors,d=e.className,b=e.labelClassName,m=e.containerClass,h=e.refCallback,v=e.children,x=e.options,g=e.smallHtml,y=Object(o.a)(e,["label","type","name","placeholder","register","errors","className","labelClassName","containerClass","refCallback","children","options","smallHtml"]),N="textarea"===a?"textarea":"select"===a?"select":"datepicker"===a?"datepicker":"input";return Object(i.jsx)(i.Fragment,{children:"hidden"===a?Object(i.jsx)("input",Object(n.a)(Object(n.a)({type:a,name:r},l?l(r):{}),y)):Object(i.jsx)(i.Fragment,{children:"password"===a?Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)(j.a.Group,{className:m,children:[t?Object(i.jsxs)(i.Fragment,{children:[" ",Object(i.jsx)(j.a.Label,{className:b,children:t})," ",v," "]}):null,Object(i.jsx)(O,{name:r,placeholder:c,refCallback:h,errors:u,register:l,className:d}),u&&u[r]?Object(i.jsx)(j.a.Control.Feedback,{type:"invalid",className:"d-block",children:Object(i.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(i.jsx)(i.Fragment,{children:"select"===a?Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)(j.a.Group,{className:m,children:[t?Object(i.jsx)(j.a.Label,{className:b,children:t}):null,Object(i.jsx)(s.a,{control:y.control,render:function(e){var t=e.field,a=t.onChange,r=t.value,c=t.name,s=t.ref;return Object(i.jsx)(f.a,Object(n.a)({className:"react-select "+(u&&u[c]?"is-invalid":""),classNamePrefix:"react-select",inputRef:s,name:c,options:x,value:x.find((function(e){return e.value===r}))||null,onChange:function(e){a(e.value),y.hasOwnProperty("handleChange")&&y.handleChange(e.value)}},y))},name:r}),u&&u[r]?Object(i.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(i.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(i.jsx)(i.Fragment,{children:"checkbox"===a||"radio"===a||"switch"===a?Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)(j.a.Group,{className:m,children:[Object(i.jsx)(j.a.Check,Object(n.a)(Object(n.a)({type:a,label:t,name:r,id:r,ref:function(e){h&&h(e)},className:d,isInvalid:!(!u||!u[r])},l?l(r):{}),y)),u&&u[r]?Object(i.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(i.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(i.jsx)(i.Fragment,{children:"datepicker"===a?Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)(j.a.Group,{className:m,children:[t?Object(i.jsx)(j.a.Label,{className:b,children:t}):null,Object(i.jsx)("div",{className:u&&u[r]?"is-invalid":"",children:Object(i.jsx)(s.a,{control:y.control,render:function(e){var t=e.field,a=(t.onChange,t.value),r=t.name;t.ref;return Object(i.jsx)(p.a,Object(n.a)({hideAddon:!0,showTimeSelect:!0,timeFormat:"HH:mm",tI:1,dateFormat:"dd/MM/yyyy h:mm aa",timeCaption:"time",name:r,value:a,onChange:function(e){y.hasOwnProperty("handleChange")&&y.handleChange(e)}},y))},name:r})}),u&&u[r]?Object(i.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(i.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})}):Object(i.jsxs)(j.a.Group,{className:m,children:[t?Object(i.jsx)(j.a.Label,{className:b,children:t}):null,Object(i.jsx)(j.a.Control,Object(n.a)(Object(n.a)(Object(n.a)({type:a,placeholder:c,name:r,id:r,as:N,ref:function(e){h&&h(e)},className:d,isInvalid:!(!u||!u[r])},l?l(r):{}),y),{},{autoComplete:r,children:v||null})),u&&u[r]?Object(i.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(i.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})})})})})})}},187:function(e,t,a){"use strict";var n=a(0),r=a(264),c=a.n(r),s=a(13),i=a.n(s),l=a(1),o=Object(n.forwardRef)((function(e,t){return Object(l.jsx)("input",{type:"text",className:"form-control date",onClick:e.onClick,value:e.value,onChange:function(){console.log("date value changed")},ref:t})})),u=Object(n.forwardRef)((function(e,t){return Object(l.jsxs)("div",{className:"input-group",ref:t,children:[Object(l.jsx)("input",{type:"text",className:"form-control form-control-light",onClick:e.onClick,value:e.value,readOnly:!0}),Object(l.jsx)("div",{className:"input-group-append",children:Object(l.jsx)("span",{className:"input-group-text bg-primary border-primary text-white",children:Object(l.jsx)("i",{className:"mdi mdi-calendar-range font-13"})})})]})}));t.a=function(e){var t=!0===(e.hideAddon||!1)?Object(l.jsx)(o,{}):Object(l.jsx)(u,{});return Object(l.jsx)(l.Fragment,{children:Object(l.jsx)(c.a,{customInput:t,timeIntervals:e.tI,className:i()("form-control",e.inputClass),selected:e.value,onChange:function(t){return e.onChange(t)},showTimeSelect:e.showTimeSelect,timeFormat:"hh:mm a",timeCaption:e.timeCaption,dateFormat:e.dateFormat||"MM/dd/yyyy",minDate:e.minDate,maxDate:e.maxDate,monthsShown:e.monthsShown,showTimeSelectOnly:e.showTimeSelectOnly,inline:e.inline,autoComplete:"off"})})}},192:function(e,t,a){"use strict";(function(e){var n=a(0),r="undefined"!==typeof e&&e.navigator&&"ReactNative"===e.navigator.product,c="undefined"!==typeof document;t.a=c||r?n.useLayoutEffect:n.useEffect}).call(this,a(95))},222:function(e,t,a){"use strict";var n=a(2),r=a(8),c=a(13),s=a.n(c),i=a(0),l=a(14),o=a(1),u=i.forwardRef((function(e,t){var a=e.bsPrefix,c=e.className,i=e.as,u=void 0===i?"div":i,d=Object(r.a)(e,["bsPrefix","className","as"]),j=Object(l.b)(a,"row"),b=Object(l.a)(),m="".concat(j,"-cols"),f=[];return b.forEach((function(e){var t,a=d[e];delete d[e],t=null!=a&&"object"===typeof a?a.cols:a;var n="xs"!==e?"-".concat(e):"";null!=t&&f.push("".concat(m).concat(n,"-").concat(t))})),Object(o.jsx)(u,Object(n.a)(Object(n.a)({ref:t},d),{},{className:s.a.apply(void 0,[c,j].concat(f))}))}));u.displayName="Row",t.a=u},274:function(e,t,a){"use strict";var n=a(2),r=a(8),c=a(13),s=a.n(c),i=a(0),l=a(14),o=a(171),u=a(1),d=i.forwardRef((function(e,t){var a=e.bsPrefix,c=e.active,i=e.children,d=e.className,j=e.as,b=void 0===j?"li":j,m=e.linkAs,f=void 0===m?o.a:m,p=e.linkProps,O=e.href,h=e.title,v=e.target,x=Object(r.a)(e,["bsPrefix","active","children","className","as","linkAs","linkProps","href","title","target"]),g=Object(l.b)(a,"breadcrumb-item");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({ref:t},x),{},{className:s()(g,d,{active:c}),"aria-current":c?"page":void 0,children:c?i:Object(u.jsx)(f,Object(n.a)(Object(n.a)({},p),{},{href:O,title:h,target:v,children:i}))}))}));d.displayName="BreadcrumbItem",d.defaultProps={active:!1,linkProps:{}};var j=d,b=i.forwardRef((function(e,t){var a=e.bsPrefix,c=e.className,i=e.listProps,o=e.children,d=e.label,j=e.as,b=void 0===j?"nav":j,m=Object(r.a)(e,["bsPrefix","className","listProps","children","label","as"]),f=Object(l.b)(a,"breadcrumb");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({"aria-label":d,className:c,ref:t},m),{},{children:Object(u.jsx)("ol",Object(n.a)(Object(n.a)({},i),{},{className:s()(f,null==i?void 0:i.className),children:o}))}))}));b.displayName="Breadcrumb",b.defaultProps={label:"breadcrumb",listProps:{}};t.a=Object.assign(b,{Item:j})}}]);
//# sourceMappingURL=53.601912d8.chunk.js.map