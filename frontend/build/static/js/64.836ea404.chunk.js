(this["webpackJsonphyper-react"]=this["webpackJsonphyper-react"]||[]).push([[64],{1338:function(e,a,t){"use strict";t.r(a);var c=t(11),s=t(0),n=t(160),i=t(222),r=t(89),l=t(804),o=t(353),d=t(1154),b=t(22),j=t(6),m=(t(325),t(13)),u=t.n(m),p=t(1),O=new b.a;a.default=function(){var e=Object(j.f)(),a=Object(s.useState)([]),t=Object(c.a)(a,2),b=t[0],m=t[1];return Object(s.useEffect)((function(){O.get("/user/companies").then((function(e){m(e.data.data)}),(function(){}))}),[]),Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(n.a,{breadCrumbItems:[{label:"Empresas",path:"/panel/companies"},{label:"Lista de empresas",path:"/panel/companies",active:!0}],title:"Empresas",insideCompany:!1}),Object(p.jsx)(i.a,{children:(b||[]).map((function(a,t){return Object(p.jsx)(r.a,{sm:6,xl:3,className:"mb-3",children:Object(p.jsxs)(l.a,{className:"mb-0 h-100",children:[Object(p.jsxs)(l.a.Body,{children:[Object(p.jsx)("h4",{className:"header-title",hidden:null===a.name,children:a.name}),Object(p.jsx)("h5",{className:"text-muted fw-normal mt-0 text-truncate",children:a.cnpj||a.cpf}),Object(p.jsx)(o.a,{bg:"",className:u()("me-1","bg-success","rounded-pill"),children:"Ativo"},t)]}),Object(p.jsxs)(l.a.Footer,{style:{border:"none"},children:[Object(p.jsx)("div",{className:"float-start",children:Object(p.jsx)("button",{type:"button",className:"arrow-none dropdown-toggle btn btn-info",onClick:function(){e("/panel/company/".concat(a.id,"/service-schedules/list"))},children:"Acessar"})}),Object(p.jsxs)(d.a,{className:"float-end",children:[Object(p.jsx)(d.a.Toggle,{variant:"link",className:"arrow-none card-drop",children:Object(p.jsx)("i",{className:u()("mdi mdi-cog-outline")})}),Object(p.jsxs)(d.a.Menu,{align:"end",children:[Object(p.jsxs)(d.a.Item,{children:[Object(p.jsx)("i",{className:u()("mdi mdi-square-edit-outline","me-1")}),"Edit"]}),Object(p.jsx)(d.a.Divider,{as:"div"}),Object(p.jsxs)(d.a.Item,{className:u()("text-danger"),children:[Object(p.jsx)("i",{className:u()("mdi mdi-trash-can-outline","me-1")}),"Delete"]})]})]}),Object(p.jsx)("div",{className:"float-end",children:Object(p.jsx)("button",{type:"button",className:"arrow-none card-drop btn btn-link",children:Object(p.jsx)("i",{className:u()("mdi mdi-account-plus-outline","me-1")})})})]})]})},t.toString())}))})]})}},160:function(e,a,t){"use strict";t(0);var c=t(222),s=t(89),n=t(274),i=t(6),r=t(1);a.a=function(e){var a,t,l=Object(i.g)().companyId;return Object(r.jsx)(c.a,{children:Object(r.jsx)(s.a,{children:Object(r.jsxs)("div",{className:"page-title-box",children:[Object(r.jsx)("div",{className:"page-title-right",children:Object(r.jsxs)(n.a,{listProps:{className:"m-0"},children:[Object(r.jsx)(n.a.Item,{href:"/panel/companies",children:"TUNAP"}),Object(r.jsx)(n.a.Item,{hidden:!1===e.insideCompany,href:"/panel/company/".concat((null===(a=e.company)||void 0===a?void 0:a.id)||l,"/dashboard"),children:(null===(t=e.company)||void 0===t?void 0:t.name)||"Empresa"}),e.breadCrumbItems.map((function(a,t){var c;return a.active?Object(r.jsx)(n.a.Item,{active:!0,children:a.label},t):Object(r.jsx)(n.a.Item,{href:!1===e.insideCompany?a.path:"/panel/company/".concat((null===(c=e.company)||void 0===c?void 0:c.id)||l).concat(a.path),children:a.label},t)}))]})}),Object(r.jsx)("h4",{className:"page-title",children:e.title})]})})})}},167:function(e,a,t){"use strict";var c=t(0),s=function(e){return e&&"function"!==typeof e?function(a){e.current=a}:e};a.a=function(e,a){return Object(c.useMemo)((function(){return function(e,a){var t=s(e),c=s(a);return function(e){t&&t(e),c&&c(e)}}(e,a)}),[e,a])}},222:function(e,a,t){"use strict";var c=t(2),s=t(8),n=t(13),i=t.n(n),r=t(0),l=t(14),o=t(1),d=r.forwardRef((function(e,a){var t=e.bsPrefix,n=e.className,r=e.as,d=void 0===r?"div":r,b=Object(s.a)(e,["bsPrefix","className","as"]),j=Object(l.b)(t,"row"),m=Object(l.a)(),u="".concat(j,"-cols"),p=[];return m.forEach((function(e){var a,t=b[e];delete b[e],a=null!=t&&"object"===typeof t?t.cols:t;var c="xs"!==e?"-".concat(e):"";null!=a&&p.push("".concat(u).concat(c,"-").concat(a))})),Object(o.jsx)(d,Object(c.a)(Object(c.a)({ref:a},b),{},{className:i.a.apply(void 0,[n,j].concat(p))}))}));d.displayName="Row",a.a=d},274:function(e,a,t){"use strict";var c=t(2),s=t(8),n=t(13),i=t.n(n),r=t(0),l=t(14),o=t(171),d=t(1),b=r.forwardRef((function(e,a){var t=e.bsPrefix,n=e.active,r=e.children,b=e.className,j=e.as,m=void 0===j?"li":j,u=e.linkAs,p=void 0===u?o.a:u,O=e.linkProps,h=e.href,f=e.title,x=e.target,v=Object(s.a)(e,["bsPrefix","active","children","className","as","linkAs","linkProps","href","title","target"]),N=Object(l.b)(t,"breadcrumb-item");return Object(d.jsx)(m,Object(c.a)(Object(c.a)({ref:a},v),{},{className:i()(N,b,{active:n}),"aria-current":n?"page":void 0,children:n?r:Object(d.jsx)(p,Object(c.a)(Object(c.a)({},O),{},{href:h,title:f,target:x,children:r}))}))}));b.displayName="BreadcrumbItem",b.defaultProps={active:!1,linkProps:{}};var j=b,m=r.forwardRef((function(e,a){var t=e.bsPrefix,n=e.className,r=e.listProps,o=e.children,b=e.label,j=e.as,m=void 0===j?"nav":j,u=Object(s.a)(e,["bsPrefix","className","listProps","children","label","as"]),p=Object(l.b)(t,"breadcrumb");return Object(d.jsx)(m,Object(c.a)(Object(c.a)({"aria-label":b,className:n,ref:a},u),{},{children:Object(d.jsx)("ol",Object(c.a)(Object(c.a)({},r),{},{className:i()(p,null==r?void 0:r.className),children:o}))}))}));m.displayName="Breadcrumb",m.defaultProps={label:"breadcrumb",listProps:{}};a.a=Object.assign(m,{Item:j})},325:function(e,a,t){"use strict";var c=t(0),s=t.n(c),n=t(1154),i=t(13),r=t.n(i),l=t(1);a.a=function(e){var a=e.title,t=e.containerClass,c=e.icon,i=e.menuItems;return Object(l.jsxs)("div",{className:r()(t),children:["string"===typeof a?Object(l.jsx)("h4",{className:"header-title",children:a}):a,Object(l.jsxs)(n.a,{children:[Object(l.jsx)(n.a.Toggle,{className:"arrow-none card-drop",children:Object(l.jsx)("i",{className:r()(c||"mdi mdi-dots-vertical")})}),Object(l.jsx)(n.a.Menu,{align:"end",children:(i||[]).map((function(e,a){return Object(l.jsxs)(s.a.Fragment,{children:[e.hasDivider&&Object(l.jsx)(n.a.Divider,{as:"div"}),Object(l.jsxs)(n.a.Item,{className:r()(e.variant?e.variant:""),children:[e.icon&&Object(l.jsx)("i",{className:r()(e.icon,"me-1")}),e.label]})]},a)}))})]})]})}},340:function(e,a,t){"use strict";var c=t(0),s=c.createContext(null);s.displayName="InputGroupContext",a.a=s},353:function(e,a,t){"use strict";var c=t(2),s=t(8),n=t(13),i=t.n(n),r=t(0),l=t(14),o=t(1),d=r.forwardRef((function(e,a){var t=e.bsPrefix,n=e.bg,r=e.pill,d=e.text,b=e.className,j=e.as,m=void 0===j?"span":j,u=Object(s.a)(e,["bsPrefix","bg","pill","text","className","as"]),p=Object(l.b)(t,"badge");return Object(o.jsx)(m,Object(c.a)(Object(c.a)({ref:a},u),{},{className:i()(b,p,r&&"rounded-pill",d&&"text-".concat(d),n&&"bg-".concat(n))}))}));d.displayName="Badge",d.defaultProps={bg:"primary",pill:!1},a.a=d}}]);
//# sourceMappingURL=64.836ea404.chunk.js.map