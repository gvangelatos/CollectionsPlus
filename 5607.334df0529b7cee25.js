"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5607],{5607:(y,m,l)=>{l.r(m),l.d(m,{AuthPageModule:()=>w});var p=l(6814),a=l(95),s=l(5548),d=l(1629),e=l(6689),f=l(6321);const b=function(t){return{"horizontal-shake":t}},T=[{path:"",component:(()=>{var t;class u{constructor(i,n,o,r){this.authService=i,this.router=n,this.loadingCtrl=o,this.alertCtrl=r,this.isLoading=!1,this.isLogin=!0,this.wobbling=!1,this.showPassword=!1}ngOnInit(){}onSwitchMode(){this.isLogin=!this.isLogin}togglePasswordVisible(){this.showPassword=!this.showPassword}onSubmit(i){i.valid&&this.authenticate(i.value.email,i.value.password)}wobble(){this.wobbling=!0,setTimeout(()=>{this.wobbling=!1},400)}authenticate(i,n){this.isLoading=!0,this.loadingCtrl.create({keyboardClose:!0,message:"Authenticating..."}).then(o=>{let r;o.present(),r=this.isLogin?this.authService.login(i,n):this.authService.signUp(i,n),r.subscribe(h=>{console.log(h),this.isLoading=!1,o.dismiss(),this.router.navigateByUrl("/collections")},h=>{o.dismiss(),this.isLoading=!1;let c="Could not sign you up, please try again!";switch(h.error.error.message){case"EMAIL_EXISTS":c="The email address is already in use by another account.";break;case"OPERATION_NOT_ALLOWED":c="Password sign-in is disabled for this project.";break;case"TOO_MANY_ATTEMPTS_TRY_LATER":c="We have blocked all requests from this device due to unusual activity. Try again later.";break;case"USER_DISABLED":case"TOKEN_EXPIRED":c="The user's credential is no longer valid. The user must sign in again.";break;case"USER_NOT_FOUND":c="The user corresponding to the refresh token was not found. It is likely the user was deleted.";break;case"EMAIL_NOT_FOUND":c="There is no user record corresponding to this identifier. The user may have been deleted."}this.showAlert(c)})})}showAlert(i){this.alertCtrl.create({header:"Authentication Failed!",message:i,buttons:["Okay!"]}).then(n=>n.present())}}return(t=u).\u0275fac=function(i){return new(i||t)(e.Y36(f.e),e.Y36(d.F0),e.Y36(s.HT),e.Y36(s.Br))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-auth"]],decls:29,vars:11,consts:[[3,"translucent"],["color","primary"],[1,"ion-padding",3,"fullscreen"],["collapse","condense"],["size","large"],[3,"ngSubmit"],["f","ngForm"],["size-md","6","offset-md","3"],["lines","none"],["ngModel","","required","","email","","lines","none","type","email","name","email","label","Email","labelPlacement","floating","helperText","Enter your account Email","errorText","Please enter a valid Email"],["emailCtrl","ngModel"],["ngModel","","required","","minlength","8","name","password","label","Password","labelPlacement","floating","helperText","Enter your account password","errorText","Please enter a password with at least 8 characters",3,"type"],["passwordCtrl","ngModel"],["fill","clear","color","dark","type","button",3,"click"],["slot","icon-only",3,"name"],["type","button","color","primary","fill","clear","expand","block",3,"click"],["type","submit","color","primary","expand","block",3,"ngClass","click"]],template:function(i,n){if(1&i){const o=e.EpF();e.TgZ(0,"ion-header",0)(1,"ion-toolbar",1)(2,"ion-title"),e._uU(3),e.qZA()()(),e.TgZ(4,"ion-content",2)(5,"ion-header",3)(6,"ion-toolbar")(7,"ion-title",4),e._uU(8),e.qZA()()(),e.TgZ(9,"form",5,6),e.NdJ("ngSubmit",function(){e.CHM(o);const h=e.MAs(10);return e.KtG(n.onSubmit(h))}),e.TgZ(11,"ion-grid")(12,"ion-row")(13,"ion-col",7)(14,"ion-list")(15,"ion-item",8),e._UZ(16,"ion-input",9,10),e.qZA(),e.TgZ(18,"ion-item",8),e._UZ(19,"ion-input",11,12),e.TgZ(21,"ion-button",13),e.NdJ("click",function(){return n.togglePasswordVisible()}),e._UZ(22,"ion-icon",14),e.qZA()()()()(),e.TgZ(23,"ion-row")(24,"ion-col",7)(25,"ion-button",15),e.NdJ("click",function(){return n.onSwitchMode()}),e._uU(26),e.qZA(),e.TgZ(27,"ion-button",16),e.NdJ("click",function(){e.CHM(o);const h=e.MAs(10);return e.KtG(h.valid?null:n.wobble())}),e._uU(28),e.qZA()()()()()()}2&i&&(e.Q6J("translucent",!0),e.xp6(3),e.Oqu(n.isLogin?"Login":"Signup"),e.xp6(1),e.Q6J("fullscreen",!0),e.xp6(4),e.Oqu(n.isLogin?"Login":"Signup"),e.xp6(11),e.Q6J("type",n.showPassword?"text":"password"),e.xp6(3),e.s9C("name",n.showPassword?"eye-outline":"eye-off-outline"),e.xp6(4),e.hij(" Switch to ",n.isLogin?"Signup":"Login"," "),e.xp6(1),e.Q6J("ngClass",e.VKq(9,b,n.wobbling)),e.xp6(1),e.hij(" ",n.isLogin?"Login":"Signup"," "))},dependencies:[p.mk,a._Y,a.JJ,a.JL,a.Q7,a.wO,a.on,a.On,a.F,s.YG,s.wI,s.W2,s.jY,s.Gu,s.gu,s.pK,s.Ie,s.q_,s.Nd,s.wd,s.sr,s.j9],styles:["@keyframes _ngcontent-%COMP%_horizontal-shaking{0%{transform:translate(0)}25%{transform:translate(5px)}50%{transform:translate(-5px)}75%{transform:translate(5px)}to{transform:translate(0)}}.horizontal-shake[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_horizontal-shaking .35s infinite}"]}),u})()}];let A=(()=>{var t;class u{}return(t=u).\u0275fac=function(i){return new(i||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[d.Bz.forChild(T),d.Bz]}),u})(),w=(()=>{var t;class u{}return(t=u).\u0275fac=function(i){return new(i||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[p.ez,a.u5,s.Pc,A]}),u})()}}]);