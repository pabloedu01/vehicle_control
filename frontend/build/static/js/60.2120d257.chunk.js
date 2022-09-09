(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[60],{1335:function(e,t,n){"use strict";n.r(t);var a=n(9),r=n.n(a),s=n(61),c=n(0),o=n(18),i=n(158),l=n(28),u=n(6),d=n(222),j=n(89),m=n(809),b=n(811),p=n(246),f=n(248),h=(n(13),n(36)),O=n(16),x=n(183),g=n(524),v=n(22),y=n(1),N=new v.a,w=function(){Object(b.a)().t;return Object(y.jsx)(d.a,{className:"mt-3",children:Object(y.jsx)(j.a,{className:"text-center",children:Object(y.jsx)("p",{className:"text-muted",children:Object(y.jsx)(l.b,{to:"/login",className:"text-muted ms-1",children:Object(y.jsx)("b",{children:"Login"})})})})})};t.default=function(){Object(b.a)().t;var e=Object(o.b)(),t=Object(u.f)();Object(c.useEffect)((function(){e(Object(O.i)())}),[e]);var n=Object(f.a)(p.e().shape({email:p.f().required("Por favor, digite Email").email("Por favor insira um e-mail v\xe1lido")})),a=Object(i.e)({resolver:n,defaultValues:{}}),l=function(){var e=Object(s.a)(r.a.mark((function e(n){var s;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s={email:n.email},N.post("/recover-password",s).then((function(e){h.a.show("success","Ative sua conta a partir da mensagem que enviamos para o e-mail."),t("/login")}),(function(e){if(400===e.response.status&&e.response.data.hasOwnProperty("errors"))for(var t in e.response.data.errors)e.response.data.errors.hasOwnProperty(t)&&a.setError(t,{type:"custom",message:e.response.data.errors[t].join("<br>")})}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(y.jsx)(y.Fragment,{children:Object(y.jsxs)(g.a,{bottomLinks:Object(y.jsx)(w,{}),children:[Object(y.jsxs)("div",{className:"text-center w-75 m-auto",children:[Object(y.jsx)("h4",{className:"text-dark-50 text-center mt-0 fw-bold",children:"Recupere sua senha"}),Object(y.jsx)("p",{className:"text-muted mb-4",children:"Recuperar sua senha leva menos de um minuto!"})]}),Object(y.jsxs)(x.b,{onSubmit:l,customMethods:a,resolver:n,defaultValues:{},children:[Object(y.jsx)(x.a,{label:"Email",type:"email",name:"email",placeholder:"Digite seu Email",containerClass:"mb-3"}),Object(y.jsx)("div",{className:"mb-3 mb-0 text-center",children:Object(y.jsx)(m.a,{variant:"primary",type:"submit",children:"Recuperar"})})]})]})})}},183:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return O}));var a=n(2),r=n(0),s=n.n(r),c=n(158),o=n(1),i=function(e){var t=e.defaultValues,n=e.resolver,r=e.children,i=e.onSubmit,l=e.customMethods,u=e.formClass,d=Object(c.e)({defaultValues:t,resolver:n});l&&(d=l);var j=d,m=j.handleSubmit,b=j.register,p=j.control,f=j.formState.errors;return Object(o.jsx)("form",{onSubmit:m(i,(function(e){console.log(e)})),className:u,noValidate:!0,children:Array.isArray(r)?r.map((function(e){return e.props&&e.props.name?s.a.createElement(e.type,Object(a.a)({},Object(a.a)(Object(a.a)({},e.props),{},{register:b,key:e.props.name,errors:f,control:p}))):e})):r})},l=n(8),u=n(11),d=n(1332),j=n(138),m=n(13),b=n.n(m),p=n(247),f=n(187),h=function(e){var t=e.name,n=e.placeholder,s=e.refCallback,c=e.errors,i=e.register,l=e.className,m=Object(r.useState)(!1),p=Object(u.a)(m,2),f=p[0],h=p[1];return Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)(d.a,{className:"mb-0",children:[Object(o.jsx)(j.a.Control,Object(a.a)(Object(a.a)({type:f?"text":"password",placeholder:n,name:t,id:t,as:"input",ref:function(e){s&&s(e)},className:l,isInvalid:!(!c||!c[t])},i?i(t):{}),{},{autoComplete:t})),Object(o.jsx)("div",{className:b()("input-group-text","input-group-password",{"show-password":f}),"data-password":f?"true":"false",children:Object(o.jsx)("span",{className:"password-eye",onClick:function(){h(!f)}})})]})})},O=function(e){var t=e.label,n=e.type,r=e.name,s=e.placeholder,i=e.register,u=e.errors,d=e.className,m=e.labelClassName,b=e.containerClass,O=e.refCallback,x=e.children,g=e.options,v=e.smallHtml,y=Object(l.a)(e,["label","type","name","placeholder","register","errors","className","labelClassName","containerClass","refCallback","children","options","smallHtml"]),N="textarea"===n?"textarea":"select"===n?"select":"datepicker"===n?"datepicker":"input";return Object(o.jsx)(o.Fragment,{children:"hidden"===n?Object(o.jsx)("input",Object(a.a)(Object(a.a)({type:n,name:r},i?i(r):{}),y)):Object(o.jsx)(o.Fragment,{children:"password"===n?Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)(j.a.Group,{className:b,children:[t?Object(o.jsxs)(o.Fragment,{children:[" ",Object(o.jsx)(j.a.Label,{className:m,children:t})," ",x," "]}):null,Object(o.jsx)(h,{name:r,placeholder:s,refCallback:O,errors:u,register:i,className:d}),u&&u[r]?Object(o.jsx)(j.a.Control.Feedback,{type:"invalid",className:"d-block",children:Object(o.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(o.jsx)(o.Fragment,{children:"select"===n?Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)(j.a.Group,{className:b,children:[t?Object(o.jsx)(j.a.Label,{className:m,children:t}):null,Object(o.jsx)(c.a,{control:y.control,render:function(e){var t=e.field,n=t.onChange,r=t.value,s=t.name,c=t.ref;return Object(o.jsx)(p.a,Object(a.a)({className:"react-select "+(u&&u[s]?"is-invalid":""),classNamePrefix:"react-select",inputRef:c,name:s,options:g,value:g.find((function(e){return e.value===r}))||null,onChange:function(e){n(e.value),y.hasOwnProperty("handleChange")&&y.handleChange(e.value)}},y))},name:r}),u&&u[r]?Object(o.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(o.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(o.jsx)(o.Fragment,{children:"checkbox"===n||"radio"===n||"switch"===n?Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)(j.a.Group,{className:b,children:[Object(o.jsx)(j.a.Check,Object(a.a)(Object(a.a)({type:n,label:t,name:r,id:r,ref:function(e){O&&O(e)},className:d,isInvalid:!(!u||!u[r])},i?i(r):{}),y)),u&&u[r]?Object(o.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(o.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null]})}):Object(o.jsx)(o.Fragment,{children:"datepicker"===n?Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)(j.a.Group,{className:b,children:[t?Object(o.jsx)(j.a.Label,{className:m,children:t}):null,Object(o.jsx)("div",{className:u&&u[r]?"is-invalid":"",children:Object(o.jsx)(c.a,{control:y.control,render:function(e){var t=e.field,n=(t.onChange,t.value),r=t.name;t.ref;return Object(o.jsx)(f.a,Object(a.a)({hideAddon:!0,showTimeSelect:!0,timeFormat:"HH:mm",tI:1,dateFormat:"dd/MM/yyyy h:mm aa",timeCaption:"time",name:r,value:n,onChange:function(e){y.hasOwnProperty("handleChange")&&y.handleChange(e)}},y))},name:r})}),u&&u[r]?Object(o.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(o.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,v||null]})}):Object(o.jsxs)(j.a.Group,{className:b,children:[t?Object(o.jsx)(j.a.Label,{className:m,children:t}):null,Object(o.jsx)(j.a.Control,Object(a.a)(Object(a.a)(Object(a.a)({type:n,placeholder:s,name:r,id:r,as:N,ref:function(e){O&&O(e)},className:d,isInvalid:!(!u||!u[r])},i?i(r):{}),y),{},{autoComplete:r,children:x||null})),u&&u[r]?Object(o.jsx)(j.a.Control.Feedback,{type:"invalid",children:Object(o.jsx)("span",{dangerouslySetInnerHTML:{__html:u[r].message}})}):null,v||null]})})})})})})}},187:function(e,t,n){"use strict";var a=n(0),r=n(264),s=n.n(r),c=n(13),o=n.n(c),i=n(1),l=Object(a.forwardRef)((function(e,t){return Object(i.jsx)("input",{type:"text",className:"form-control date",onClick:e.onClick,value:e.value,onChange:function(){console.log("date value changed")},ref:t})})),u=Object(a.forwardRef)((function(e,t){return Object(i.jsxs)("div",{className:"input-group",ref:t,children:[Object(i.jsx)("input",{type:"text",className:"form-control form-control-light",onClick:e.onClick,value:e.value,readOnly:!0}),Object(i.jsx)("div",{className:"input-group-append",children:Object(i.jsx)("span",{className:"input-group-text bg-primary border-primary text-white",children:Object(i.jsx)("i",{className:"mdi mdi-calendar-range font-13"})})})]})}));t.a=function(e){var t=!0===(e.hideAddon||!1)?Object(i.jsx)(l,{}):Object(i.jsx)(u,{});return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(s.a,{customInput:t,timeIntervals:e.tI,className:o()("form-control",e.inputClass),selected:e.value,onChange:function(t){return e.onChange(t)},showTimeSelect:e.showTimeSelect,timeFormat:"hh:mm a",timeCaption:e.timeCaption,dateFormat:e.dateFormat||"MM/dd/yyyy",minDate:e.minDate,maxDate:e.maxDate,monthsShown:e.monthsShown,showTimeSelectOnly:e.showTimeSelectOnly,inline:e.inline,autoComplete:"off"})})}},222:function(e,t,n){"use strict";var a=n(2),r=n(8),s=n(13),c=n.n(s),o=n(0),i=n(14),l=n(1),u=o.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,o=e.as,u=void 0===o?"div":o,d=Object(r.a)(e,["bsPrefix","className","as"]),j=Object(i.b)(n,"row"),m=Object(i.a)(),b="".concat(j,"-cols"),p=[];return m.forEach((function(e){var t,n=d[e];delete d[e],t=null!=n&&"object"===typeof n?n.cols:n;var a="xs"!==e?"-".concat(e):"";null!=t&&p.push("".concat(b).concat(a,"-").concat(t))})),Object(l.jsx)(u,Object(a.a)(Object(a.a)({ref:t},d),{},{className:c.a.apply(void 0,[s,j].concat(p))}))}));u.displayName="Row",t.a=u},279:function(e,t,n){"use strict";t.a=n.p+"static/media/logo_tunap.ca908ee5.png"},524:function(e,t,n){"use strict";var a=n(0),r=n(804),s=n(28),c=n(811),o=n(279),i=n(1);t.a=function(e){var t=e.bottomLinks,n=e.children;Object(a.useEffect)((function(){return document.body&&document.body.classList.add("authentication-bg"),function(){document.body&&document.body.classList.remove("authentication-bg")}}),[]);Object(c.a)().t;return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)("div",{className:"auth-fluid",children:Object(i.jsx)("div",{className:"auth-fluid-form-box",children:Object(i.jsx)("div",{className:"align-items-center d-flex h-100 text-center",children:Object(i.jsxs)(r.a.Body,{children:[Object(i.jsxs)("div",{className:"auth-brand text-center align-items-center text-lg-start",children:[Object(i.jsx)(s.b,{to:"/",className:"logo-dark",children:Object(i.jsx)("span",{children:Object(i.jsx)("img",{src:o.a,alt:"",height:"80"})})}),Object(i.jsx)(s.b,{to:"/",className:"logo-light",children:Object(i.jsx)("span",{children:Object(i.jsx)("img",{src:o.a,alt:"",height:"80"})})})]}),n,t]})})})})})}},525:function(e,t,n){var a=n(526),r=n(527),s=n(528),c=n(530);e.exports=function(e,t){return a(e)||r(e,t)||s(e,t)||c()},e.exports.default=e.exports,e.exports.__esModule=!0},526:function(e,t){e.exports=function(e){if(Array.isArray(e))return e},e.exports.default=e.exports,e.exports.__esModule=!0},527:function(e,t){e.exports=function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,s=[],c=!0,o=!1;try{for(n=n.call(e);!(c=(a=n.next()).done)&&(s.push(a.value),!t||s.length!==t);c=!0);}catch(i){o=!0,r=i}finally{try{c||null==n.return||n.return()}finally{if(o)throw r}}return s}},e.exports.default=e.exports,e.exports.__esModule=!0},528:function(e,t,n){var a=n(529);e.exports=function(e,t){if(e){if("string"===typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}},e.exports.default=e.exports,e.exports.__esModule=!0},529:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a},e.exports.default=e.exports,e.exports.__esModule=!0},530:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.default=e.exports,e.exports.__esModule=!0},811:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var a=n(525),r=n.n(a),s=n(63),c=n.n(s),o=n(0),i=n(136);function l(){if(console&&console.warn){for(var e,t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];"string"===typeof n[0]&&(n[0]="react-i18next:: ".concat(n[0])),(e=console).warn.apply(e,n)}}var u={};function d(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];"string"===typeof t[0]&&u[t[0]]||("string"===typeof t[0]&&(u[t[0]]=new Date),l.apply(void 0,t))}function j(e,t,n){e.loadNamespaces(t,(function(){if(e.isInitialized)n();else{e.on("initialized",(function t(){setTimeout((function(){e.off("initialized",t)}),0),n()}))}}))}function m(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(!t.languages||!t.languages.length)return d("i18n.languages were undefined or empty",t.languages),!0;var a=t.languages[0],r=!!t.options&&t.options.fallbackLng,s=t.languages[t.languages.length-1];if("cimode"===a.toLowerCase())return!0;var c=function(e,n){var a=t.services.backendConnector.state["".concat(e,"|").concat(n)];return-1===a||2===a};return!(n.bindI18n&&n.bindI18n.indexOf("languageChanging")>-1&&t.services.backendConnector.backend&&t.isLanguageChangingTo&&!c(t.isLanguageChangingTo,e))&&(!!t.hasResourceBundle(a,e)||(!t.services.backendConnector.backend||!(!c(a,e)||r&&!c(s,e))))}function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){c()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function f(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.i18n,a=Object(o.useContext)(i.a)||{},s=a.i18n,c=a.defaultNS,l=n||s||Object(i.d)();if(l&&!l.reportNamespaces&&(l.reportNamespaces=new i.b),!l){d("You will need to pass in an i18next instance by using initReactI18next");var u=function(e){return Array.isArray(e)?e[e.length-1]:e},b=[u,{},!1];return b.t=u,b.i18n={},b.ready=!1,b}l.options.react&&void 0!==l.options.react.wait&&d("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");var f=p(p(p({},Object(i.c)()),l.options.react),t),h=f.useSuspense,O=f.keyPrefix,x=e||c||l.options&&l.options.defaultNS;x="string"===typeof x?[x]:x||["translation"],l.reportNamespaces.addUsedNamespaces&&l.reportNamespaces.addUsedNamespaces(x);var g=(l.isInitialized||l.initializedStoreOnce)&&x.every((function(e){return m(e,l,f)}));function v(){return l.getFixedT(null,"fallback"===f.nsMode?x:x[0],O)}var y=Object(o.useState)(v),N=r()(y,2),w=N[0],C=N[1],k=Object(o.useRef)(!0);Object(o.useEffect)((function(){var e=f.bindI18n,t=f.bindI18nStore;function n(){k.current&&C(v)}return k.current=!0,g||h||j(l,x,(function(){k.current&&C(v)})),e&&l&&l.on(e,n),t&&l&&l.store.on(t,n),function(){k.current=!1,e&&l&&e.split(" ").forEach((function(e){return l.off(e,n)})),t&&l&&t.split(" ").forEach((function(e){return l.store.off(e,n)}))}}),[l,x.join()]);var S=Object(o.useRef)(!0);Object(o.useEffect)((function(){k.current&&!S.current&&C(v),S.current=!1}),[l]);var F=[w,l,g];if(F.t=w,F.i18n=l,F.ready=g,g)return F;if(!g&&!h)return F;throw new Promise((function(e){j(l,x,(function(){e()}))}))}}}]);
//# sourceMappingURL=60.2120d257.chunk.js.map