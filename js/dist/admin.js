(()=>{var t={n:e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};(()=>{"use strict";t.r(e);const n=flarum.core.compat["admin/app"];var r=t.n(n);const o=flarum.core.compat["common/components/Button"];var a=t.n(o),i="clarkwinkelmann-typewriter.admin.settings.";r().initializers.add("typewriter",(function(){r().extensionData.for("clarkwinkelmann-typewriter").registerSetting({setting:"typewriter.defaultFile",type:"text",label:r().translator.trans(i+"defaultFile")}).registerSetting((function(){var t,e=this;try{t=JSON.parse(this.setting("typewriter.sounds")())}catch(t){}return Array.isArray(t)||(t=[{keys:"",file:""}]),m(".Form-group",[m("label",r().translator.trans(i+"sounds")),m("table",[m("thead",m("tr",[m("th",r().translator.trans(i+"head.keys")),m("th",r().translator.trans(i+"head.file")),m("th")])),m("tbody",[t.map((function(n,r){return m("tr",[m("td",m("input.FormControl",{type:"text",value:n.keys||"",onchange:function(r){n.keys=r.target.value,e.setting("typewriter.sounds")(JSON.stringify(t))}})),m("td",m("input.FormControl",{type:"text",value:n.file||"",onchange:function(r){n.file=r.target.value,e.setting("typewriter.sounds")(JSON.stringify(t))}})),m("td",a().component({className:"Button Button--icon",icon:"fas fa-times",onclick:function(){t.splice(r,1),e.setting("typewriter.sounds")(JSON.stringify(t))}}))])})),m("tr",m("td",{colspan:3},a().component({className:"Button Button--block",onclick:function(){t.push({keys:"",file:""}),e.setting("typewriter.sounds")(JSON.stringify(t))}},r().translator.trans(i+"add"))))])])])}))}))})(),module.exports=e})();
//# sourceMappingURL=admin.js.map