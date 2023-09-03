"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5607],{5607:(_,m,l)=>{l.r(m),l.d(m,{AuthPageModule:()=>P});var p=l(6814),a=l(95),s=l(5548),d=l(1629),e=l(6689),f=l(6321);const b=["f"],T=function(i){return{"horizontal-shake":i}},A=[{path:"",component:(()=>{var i;class u{constructor(t,n,o,r){this.authService=t,this.router=n,this.loadingCtrl=o,this.alertCtrl=r,this.isLoading=!1,this.isLogin=!0,this.wobbling=!1,this.showPassword=!1}ngOnInit(){}onSwitchMode(){this.isLogin=!this.isLogin,this.authForm.reset()}togglePasswordVisible(){this.showPassword=!this.showPassword}onSubmit(t){t.valid&&this.authenticate(t.value.email,t.value.password)}wobble(){this.wobbling=!0,setTimeout(()=>{this.wobbling=!1},400)}authenticate(t,n){this.isLoading=!0,this.loadingCtrl.create({keyboardClose:!0,message:"Authenticating..."}).then(o=>{let r;o.present(),r=this.isLogin?this.authService.login(t,n):this.authService.signUp(t,n),r.subscribe(g=>{console.log(g),this.isLoading=!1,o.dismiss(),this.router.navigateByUrl("/collections")},g=>{o.dismiss(),this.isLoading=!1;let c="Could not sign you up, please try again!";switch(g.error.error.message){case"EMAIL_EXISTS":c="The email address is already in use by another account.";break;case"OPERATION_NOT_ALLOWED":c="Password sign-in is disabled for this project.";break;case"TOO_MANY_ATTEMPTS_TRY_LATER":c="We have blocked all requests from this device due to unusual activity. Try again later.";break;case"USER_DISABLED":case"TOKEN_EXPIRED":c="The user's credential is no longer valid. The user must sign in again.";break;case"USER_NOT_FOUND":c="The user corresponding to the refresh token was not found. It is likely the user was deleted.";break;case"EMAIL_NOT_FOUND":c="There is no user record corresponding to this identifier. The user may have been deleted."}this.showAlert(c)})})}showAlert(t){this.alertCtrl.create({header:"Authentication Failed!",message:t,buttons:["Okay!"]}).then(n=>n.present())}}return(i=u).\u0275fac=function(t){return new(t||i)(e.Y36(f.e),e.Y36(d.F0),e.Y36(s.HT),e.Y36(s.Br))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-auth"]],viewQuery:function(t,n){if(1&t&&e.Gf(b,5),2&t){let o;e.iGM(o=e.CRH())&&(n.authForm=o.first)}},decls:29,vars:11,consts:[[3,"translucent"],["color","primary"],[1,"ion-padding",3,"fullscreen"],["collapse","condense"],["size","large"],[3,"ngSubmit"],["f","ngForm"],["size-md","6","offset-md","3"],["lines","none"],["ngModel","","required","","email","","lines","none","type","email","name","email","label","Email","labelPlacement","floating","helperText","Enter your account Email","errorText","Please enter a valid Email"],["emailCtrl","ngModel"],["ngModel","","required","","minlength","8","name","password","label","Password","labelPlacement","floating","helperText","Enter your account password","errorText","Please enter a password with at least 8 characters",3,"type"],["passwordCtrl","ngModel"],["fill","clear","color","dark","type","button",3,"click"],["slot","icon-only",3,"name"],["type","button","color","primary","fill","clear","expand","block",3,"click"],["type","submit","color","primary","expand","block",3,"ngClass","click"]],template:function(t,n){if(1&t){const o=e.EpF();e.TgZ(0,"ion-header",0)(1,"ion-toolbar",1)(2,"ion-title"),e._uU(3),e.qZA()()(),e.TgZ(4,"ion-content",2)(5,"ion-header",3)(6,"ion-toolbar")(7,"ion-title",4),e._uU(8),e.qZA()()(),e.TgZ(9,"form",5,6),e.NdJ("ngSubmit",function(){e.CHM(o);const g=e.MAs(10);return e.KtG(n.onSubmit(g))}),e.TgZ(11,"ion-grid")(12,"ion-row")(13,"ion-col",7)(14,"ion-list")(15,"ion-item",8),e._UZ(16,"ion-input",9,10),e.qZA(),e.TgZ(18,"ion-item",8),e._UZ(19,"ion-input",11,12),e.TgZ(21,"ion-button",13),e.NdJ("click",function(){return n.togglePasswordVisible()}),e._UZ(22,"ion-icon",14),e.qZA()()()()(),e.TgZ(23,"ion-row")(24,"ion-col",7)(25,"ion-button",15),e.NdJ("click",function(){return n.onSwitchMode()}),e._uU(26),e.qZA(),e.TgZ(27,"ion-button",16),e.NdJ("click",function(){e.CHM(o);const g=e.MAs(10);return e.KtG(g.valid?null:n.wobble())}),e._uU(28),e.qZA()()()()()()}2&t&&(e.Q6J("translucent",!0),e.xp6(3),e.Oqu(n.isLogin?"Login":"Signup"),e.xp6(1),e.Q6J("fullscreen",!0),e.xp6(4),e.Oqu(n.isLogin?"Login":"Signup"),e.xp6(11),e.Q6J("type",n.showPassword?"text":"password"),e.xp6(3),e.s9C("name",n.showPassword?"eye-outline":"eye-off-outline"),e.xp6(4),e.hij(" Switch to ",n.isLogin?"Signup":"Login"," "),e.xp6(1),e.Q6J("ngClass",e.VKq(9,T,n.wobbling)),e.xp6(1),e.hij(" ",n.isLogin?"Login":"Signup"," "))},dependencies:[p.mk,a._Y,a.JJ,a.JL,a.Q7,a.wO,a.on,a.On,a.F,s.YG,s.wI,s.W2,s.jY,s.Gu,s.gu,s.pK,s.Ie,s.q_,s.Nd,s.wd,s.sr,s.j9],styles:["@keyframes _ngcontent-%COMP%_horizontal-shaking{0%{transform:translate(0)}25%{transform:translate(5px)}50%{transform:translate(-5px)}75%{transform:translate(5px)}to{transform:translate(0)}}.horizontal-shake[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_horizontal-shaking .35s infinite}"]}),u})()}];let w=(()=>{var i;class u{}return(i=u).\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[d.Bz.forChild(A),d.Bz]}),u})(),P=(()=>{var i;class u{}return(i=u).\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[p.ez,a.u5,s.Pc,w]}),u})()}}]);