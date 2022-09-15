(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[56],{1361:function(e,a,t){"use strict";t.r(a);var n=t(2),r=t(11),c=t(0),l=t(160),s=t(222),o=t(89),i=t(804),u=t(809),d=t(22),j=t(6),b=t(248),m=t(246),f=t(158),p=t(183),O=t(1),v=new d.a;a.default=function(e){var a=Object(j.f)(),t=Object(j.g)().id,d=Object(c.useState)(),h=Object(r.a)(d,2),x=h[0],g=h[1],y=Object(b.a)(m.e().shape({name:m.f().required("Por favor, digite Nome do Produto"),product_code:m.f().required("Por favor, digite C\xf3digo do Produto"),sale_value:m.d().required("Por favor, digite Valor de Venda"),guarantee_value:m.d().required("Por favor, digite Valor da Garantia"),unique_code:m.f().nullable(),active:m.a()})),N=Object(f.e)({resolver:y,defaultValues:{}}),C=N.handleSubmit,_=N.register,w=N.control,k={register:_,errors:N.formState.errors,control:w};return Object(c.useEffect)((function(){!function(){var e={name:null,product_code:null,sale_value:null,guarantee_value:null,unique_code:null,active:!0};t?v.get("/product/"+t).then((function(e){var a=e.data.data,t=a.name,n=a.product_code,r=a.sale_value,c=a.guarantee_value,l=a.unique_code,s=a.active;g({name:t,product_code:n,sale_value:r,guarantee_value:c,unique_code:l,active:s})}),(function(a){g(e)})):g(e)}()}),[t]),Object(c.useEffect)((function(){var e,a,t,n,r,c;N.setValue("name",null!==(e=null===x||void 0===x?void 0:x.name)&&void 0!==e?e:null),N.setValue("product_code",null!==(a=null===x||void 0===x?void 0:x.product_code)&&void 0!==a?a:null),N.setValue("sale_value",null!==(t=null===x||void 0===x?void 0:x.sale_value)&&void 0!==t?t:null),N.setValue("guarantee_value",null!==(n=null===x||void 0===x?void 0:x.guarantee_value)&&void 0!==n?n:null),N.setValue("unique_code",null!==(r=null===x||void 0===x?void 0:x.unique_code)&&void 0!==r?r:null),N.setValue("active",null===(c=null===x||void 0===x?void 0:x.active)||void 0===c||c)}),[x]),Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(l.a,{breadCrumbItems:[{label:"Produtos",path:"/products/list"},{label:"Cadastro",path:"/products/".concat(t?t+"/edit":"create"),active:!0}],title:"Produtos",company:e.company}),Object(O.jsx)(s.a,{children:Object(O.jsx)(o.a,{xs:12,children:Object(O.jsx)(i.a,{children:Object(O.jsx)(i.a.Body,{children:Object(O.jsxs)("form",{onSubmit:C((function(n){var r,c;t?r=v.update("/product/"+t,n):r=v.post("/product",Object.assign(n,{company_id:null===(c=e.company)||void 0===c?void 0:c.id}));r.then((function(){var t;a("/panel/company/".concat(null===(t=e.company)||void 0===t?void 0:t.id,"/products/list"))}),(function(e){if(400===e.response.status&&e.response.data.hasOwnProperty("errors"))for(var a in e.response.data.errors)e.response.data.errors.hasOwnProperty(a)&&N.setError(a,{type:"custom",message:e.response.data.errors[a].join("<br>")})}))}),(function(e){console.log(e)})),noValidate:!0,children:[Object(O.jsxs)(s.a,{children:[Object(O.jsxs)(o.a,{md:6,children:[Object(O.jsx)(p.a,Object(n.a)({label:"Nome",type:"text",name:"name",placeholder:"Digite Nome do Produto",containerClass:"mb-3"},k)),Object(O.jsx)(p.a,Object(n.a)({label:"C\xf3digo do Produto",type:"text",name:"product_code",placeholder:"Digite C\xf3digo do Produto",containerClass:"mb-3"},k)),Object(O.jsx)(p.a,Object(n.a)({label:"Valor de Venda",type:"text",name:"sale_value",placeholder:"Digite Valor de Venda",containerClass:"mb-3"},k))]}),Object(O.jsxs)(o.a,{md:6,children:[Object(O.jsx)(p.a,Object(n.a)({label:"Valor da Garantia",type:"text",name:"guarantee_value",placeholder:"Digite Valor da Garantia",containerClass:"mb-3"},k)),Object(O.jsx)(p.a,Object(n.a)({label:"C\xf3digo \xdanico",type:"text",name:"unique_code",placeholder:"Digite C\xf3digo \xdanico",containerClass:"mb-3"},k)),Object(O.jsx)(p.a,Object(n.a)({label:"Ative",type:"checkbox",name:"active",containerClass:"mb-3"},k))]})]}),Object(O.jsx)("div",{className:"mb-3 mb-0",children:Object(O.jsx)(u.a,{variant:"primary",type:"submit",children:"Cadastro"})})]})})})})})]})}},142:function(e,a,t){"use strict";t.d(a,"a",(function(){return c}));var n=t(0),r=t(144);function c(e){var a=Object(r.a)(e);return Object(n.useCallback)((function(){return a.current&&a.current.apply(a,arguments)}),[a])}},144:function(e,a,t){"use strict";var n=t(0);a.a=function(e){var a=Object(n.useRef)(e);return Object(n.useEffect)((function(){a.current=e}),[e]),a}},148:function(e,a,t){"use strict";t.d(a,"a",(function(){return c}));var n=t(0),r=t(142);function c(e,a,t,c){void 0===c&&(c=!1);var l=Object(r.a)(t);Object(n.useEffect)((function(){var t="function"===typeof e?e():e;return t.addEventListener(a,l,c),function(){return t.removeEventListener(a,l,c)}}),[e])}},149:function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));var n=t(0);function r(){var e=Object(n.useRef)(!0),a=Object(n.useRef)((function(){return e.current}));return Object(n.useEffect)((function(){return function(){e.current=!1}}),[]),a.current}},151:function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));var n=t(0);function r(){return Object(n.useState)(null)}},157:function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));var n=t(0);function r(e){var a=Object(n.useRef)(null);return Object(n.useEffect)((function(){a.current=e})),a.current}},160:function(e,a,t){"use strict";t(0);var n=t(222),r=t(89),c=t(274),l=t(6),s=t(1);a.a=function(e){var a,t,o=Object(l.g)().companyId;return Object(s.jsx)(n.a,{children:Object(s.jsx)(r.a,{children:Object(s.jsxs)("div",{className:"page-title-box",children:[Object(s.jsx)("div",{className:"page-title-right",children:Object(s.jsxs)(c.a,{listProps:{className:"m-0"},children:[Object(s.jsx)(c.a.Item,{href:"/panel/companies",children:"TUNAP"}),Object(s.jsx)(c.a.Item,{hidden:!1===e.insideCompany,href:"/panel/company/".concat((null===(a=e.company)||void 0===a?void 0:a.id)||o,"/dashboard"),children:(null===(t=e.company)||void 0===t?void 0:t.name)||"Empresa"}),e.breadCrumbItems.map((function(a,t){var n;return a.active?Object(s.jsx)(c.a.Item,{active:!0,children:a.label},t):Object(s.jsx)(c.a.Item,{href:!1===e.insideCompany?a.path:"/panel/company/".concat((null===(n=e.company)||void 0===n?void 0:n.id)||o).concat(a.path),children:a.label},t)}))]})}),Object(s.jsx)("h4",{className:"page-title",children:e.title})]})})})}},171:function(e,a,t){"use strict";var n=t(11),r=t(0),c=(t(151),t(144),t(142));t(148);t(149),t(157);t(192),new WeakMap;var l=t(216),s=t(1),o=["onKeyDown"];var i=r.forwardRef((function(e,a){var t,r=e.onKeyDown,i=function(e,a){if(null==e)return{};var t,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)t=c[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,o),u=Object(l.b)(Object.assign({tagName:"a"},i)),d=Object(n.a)(u,1)[0],j=Object(c.a)((function(e){d.onKeyDown(e),null==r||r(e)}));return((t=i.href)&&"#"!==t.trim()||i.role)&&"button"!==i.role?Object(s.jsx)("a",Object.assign({ref:a},i,{onKeyDown:r})):Object(s.jsx)("a",Object.assign({ref:a},i,d,{onKeyDown:j}))}));i.displayName="Anchor";a.a=i},183:function(e,a,t){"use strict";t.d(a,"b",(function(){return o})),t.d(a,"a",(function(){return v}));var n=t(2),r=t(0),c=t.n(r),l=t(158),s=t(1),o=function(e){var a=e.defaultValues,t=e.resolver,r=e.children,o=e.onSubmit,i=e.customMethods,u=e.formClass,d=Object(l.e)({defaultValues:a,resolver:t});i&&(d=i);var j=d,b=j.handleSubmit,m=j.register,f=j.control,p=j.formState.errors;return Object(s.jsx)("form",{onSubmit:b(o,(function(e){console.log(e)})),className:u,noValidate:!0,children:Array.isArray(r)?r.map((function(e){return e.props&&e.props.name?c.a.createElement(e.type,Object(n.a)({},Object(n.a)(Object(n.a)({},e.props),{},{register:m,key:e.props.name,errors:p,control:f}))):e})):r})},i=t(8),u=t(11),d=t(1332),j=t(138),b=t(13),m=t.n(b),f=t(247),p=t(187),O=function(e){var a=e.name,t=e.placeholder,c=e.refCallback,l=e.errors,o=e.register,i=e.className,b=Object(r.useState)(!1),f=Object(u.a)(b,2),p=f[0],O=f[1];return Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(d.a,{className:"mb-0",children:[Object(s.jsx)(j.a.Control,Object(n.a)(Object(n.a)({type:p?"text":"password",placeholder:t,name:a,id:a,as:"input",ref:function(e){c&&c(e)},className:i,isInvalid:!(!l||!l[a])},o?o(a):{}),{},{autoComplete:a})),Object(s.jsx)("div",{className:m()("input-group-text","input-group-password",{"show-password":p}),"data-password":p?"true":"false",children:Object(s.jsx)("span",{className:"password-eye",onClick:function(){O(!p)}})})]})})},v=function(e){var a=e.label,t=e.type,r=e.name,c=e.placeholder,o=e.register,u=e.errors,d=e.className,b=e.labelClassName,m=e.containerClass,v=e.refCallback,h=e.children,x=e.options,g=e.smallHtml,y=Object(i.a)(e,["label","type","name","placeholder","register","errors","className","labelClassName","containerClass","refCallback","children","options","smallHtml"]),N="textarea"===t?"textarea":"select"===t?"select":"datepicker"===t?"datepicker":"input";return Object(s.jsx)(s.Fragment,{children:"hidden"===t?Object(s.jsx)("input",Object(n.a)(Object(n.a)({type:t,name:r},o?o(r):{}),y)):Object(s.jsx)(s.Fragment,{children:"password"===t?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(j.a.Group,{className:m,children:[a?Object(s.jsxs)(s.Fragment,{children:[" ",Object(s.jsx)(j.a.Label,{className:b,children:a})," ",h," "]}):null,Object(s.jsx)(O,{name:r,placeholder:c,refCallback:v,errors:u,register:o,className:d}),u&&u[r]?Object(s.jsx)(j.a.Control.Feedback,{type:"invalid",className:"d-block",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"select"===t?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(j.a.Group,{className:m,children:[a?Object(s.jsx)(j.a.Label,{className:b,children:a}):null,Object(s.jsx)(l.a,{control:y.control,render:function(e){var a=e.field,t=a.onChange,r=a.value,c=a.name,l=a.ref;return Object(s.jsx)(f.a,Object(n.a)({className:"react-select "+(u&&u[c]?"is-invalid":""),classNamePrefix:"react-select",inputRef:l,name:c,options:x,value:x.find((function(e){return e.value===r}))||null,onChange:function(e){t(e.value),y.hasOwnProperty("handleChange")&&y.handleChange(e.value)}},y))},name:r}),u&&u[r]?Object(s.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"checkbox"===t||"radio"===t||"switch"===t?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(j.a.Group,{className:m,children:[Object(s.jsx)(j.a.Check,Object(n.a)(Object(n.a)({type:t,label:a,name:r,id:r,ref:function(e){v&&v(e)},className:d,isInvalid:!(!u||!u[r])},o?o(r):{}),y)),u&&u[r]?Object(s.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(s.jsx)(s.Fragment,{children:"datepicker"===t?Object(s.jsx)(s.Fragment,{children:Object(s.jsxs)(j.a.Group,{className:m,children:[a?Object(s.jsx)(j.a.Label,{className:b,children:a}):null,Object(s.jsx)("div",{className:u&&u[r]?"is-invalid":"",children:Object(s.jsx)(l.a,{control:y.control,render:function(e){var a=e.field,t=(a.onChange,a.value),r=a.name;a.ref;return Object(s.jsx)(p.a,Object(n.a)({hideAddon:!0,showTimeSelect:!0,timeFormat:"HH:mm",tI:1,dateFormat:"dd/MM/yyyy h:mm aa",timeCaption:"time",name:r,value:t,onChange:function(e){y.hasOwnProperty("handleChange")&&y.handleChange(e)}},y))},name:r})}),u&&u[r]?Object(s.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})}):Object(s.jsxs)(j.a.Group,{className:m,children:[a?Object(s.jsx)(j.a.Label,{className:b,children:a}):null,Object(s.jsx)(j.a.Control,Object(n.a)(Object(n.a)(Object(n.a)({type:t,placeholder:c,name:r,id:r,as:N,ref:function(e){v&&v(e)},className:d,isInvalid:!(!u||!u[r])},o?o(r):{}),y),{},{autoComplete:r,children:h||null})),u&&u[r]?Object(s.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(s.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,g||null]})})})})})})}},187:function(e,a,t){"use strict";var n=t(0),r=t(264),c=t.n(r),l=t(13),s=t.n(l),o=t(1),i=Object(n.forwardRef)((function(e,a){return Object(o.jsx)("input",{type:"text",className:"form-control date",onClick:e.onClick,value:e.value,onChange:function(){console.log("date value changed")},ref:a})})),u=Object(n.forwardRef)((function(e,a){return Object(o.jsxs)("div",{className:"input-group",ref:a,children:[Object(o.jsx)("input",{type:"text",className:"form-control form-control-light",onClick:e.onClick,value:e.value,readOnly:!0}),Object(o.jsx)("div",{className:"input-group-append",children:Object(o.jsx)("span",{className:"input-group-text bg-primary border-primary text-white",children:Object(o.jsx)("i",{className:"mdi mdi-calendar-range font-13"})})})]})}));a.a=function(e){var a=!0===(e.hideAddon||!1)?Object(o.jsx)(i,{}):Object(o.jsx)(u,{});return Object(o.jsx)(o.Fragment,{children:Object(o.jsx)(c.a,{customInput:a,timeIntervals:e.tI,className:s()("form-control",e.inputClass),selected:e.value,onChange:function(a){return e.onChange(a)},showTimeSelect:e.showTimeSelect,timeFormat:"hh:mm a",timeCaption:e.timeCaption,dateFormat:e.dateFormat||"MM/dd/yyyy",minDate:e.minDate,maxDate:e.maxDate,monthsShown:e.monthsShown,showTimeSelectOnly:e.showTimeSelectOnly,inline:e.inline,autoComplete:"off"})})}},192:function(e,a,t){"use strict";(function(e){var n=t(0),r="undefined"!==typeof e&&e.navigator&&"ReactNative"===e.navigator.product,c="undefined"!==typeof document;a.a=c||r?n.useLayoutEffect:n.useEffect}).call(this,t(95))},222:function(e,a,t){"use strict";var n=t(2),r=t(8),c=t(13),l=t.n(c),s=t(0),o=t(14),i=t(1),u=s.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,s=e.as,u=void 0===s?"div":s,d=Object(r.a)(e,["bsPrefix","className","as"]),j=Object(o.b)(t,"row"),b=Object(o.a)(),m="".concat(j,"-cols"),f=[];return b.forEach((function(e){var a,t=d[e];delete d[e],a=null!=t&&"object"===typeof t?t.cols:t;var n="xs"!==e?"-".concat(e):"";null!=a&&f.push("".concat(m).concat(n,"-").concat(a))})),Object(i.jsx)(u,Object(n.a)(Object(n.a)({ref:a},d),{},{className:l.a.apply(void 0,[c,j].concat(f))}))}));u.displayName="Row",a.a=u},274:function(e,a,t){"use strict";var n=t(2),r=t(8),c=t(13),l=t.n(c),s=t(0),o=t(14),i=t(171),u=t(1),d=s.forwardRef((function(e,a){var t=e.bsPrefix,c=e.active,s=e.children,d=e.className,j=e.as,b=void 0===j?"li":j,m=e.linkAs,f=void 0===m?i.a:m,p=e.linkProps,O=e.href,v=e.title,h=e.target,x=Object(r.a)(e,["bsPrefix","active","children","className","as","linkAs","linkProps","href","title","target"]),g=Object(o.b)(t,"breadcrumb-item");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({ref:a},x),{},{className:l()(g,d,{active:c}),"aria-current":c?"page":void 0,children:c?s:Object(u.jsx)(f,Object(n.a)(Object(n.a)({},p),{},{href:O,title:v,target:h,children:s}))}))}));d.displayName="BreadcrumbItem",d.defaultProps={active:!1,linkProps:{}};var j=d,b=s.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,s=e.listProps,i=e.children,d=e.label,j=e.as,b=void 0===j?"nav":j,m=Object(r.a)(e,["bsPrefix","className","listProps","children","label","as"]),f=Object(o.b)(t,"breadcrumb");return Object(u.jsx)(b,Object(n.a)(Object(n.a)({"aria-label":d,className:c,ref:a},m),{},{children:Object(u.jsx)("ol",Object(n.a)(Object(n.a)({},s),{},{className:l()(f,null==s?void 0:s.className),children:i}))}))}));b.displayName="Breadcrumb",b.defaultProps={label:"breadcrumb",listProps:{}};a.a=Object.assign(b,{Item:j})}}]);
//# sourceMappingURL=56.f4eb467d.chunk.js.map