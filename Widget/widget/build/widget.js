!function e(t,n,o){function a(i,s){if(!n[i]){if(!t[i]){var c="function"==typeof require&&require;if(!s&&c)return c(i,!0);if(r)return r(i,!0);var h=new Error("Cannot find module '"+i+"'");throw h.code="MODULE_NOT_FOUND",h}var u=n[i]={exports:{}};t[i][0].call(u.exports,function(e){var n=t[i][1][e];return a(n||e)},u,u.exports,e,t,n,o)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<o.length;i++)a(o[i]);return a}({1:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=function(){function e(t,n){o(this,e),this.siteId=t,this.apiUrl="https://enigmatic-ridge-18595.herokuapp.com/tracker",this.cookiesHandler=new i(n),this.params={site_id:this.siteId,user_id:this.cookiesHandler.getCookie("user_id"),domain:this.splitUrl(document.location.href,"domain"),path:this.splitUrl(document.location.href,"path"),data:{}},this.xhrData=[],this.resourcesErrors=[],this.domTimeChanges=[],this.domChanged=!1,this.singleViewTime=0}return a(e,[{key:"getSystemDetails",value:function(){var e=navigator.userAgent,t=navigator.appName,n=String(parseFloat(navigator.appVersion)),o=parseInt(navigator.appVersion,10),a=void 0,r=void 0,i=void 0,s="Unknown OS";-1!=(r=e.indexOf("Opera"))?(t="Opera",n=e.substring(r+6),-1!=(r=e.indexOf("Version"))&&(n=e.substring(r+8))):-1!=(r=e.indexOf("MSIE"))?(t="Microsoft Internet Explorer",n=e.substring(r+5)):-1!=(r=e.indexOf("Chrome"))?(t="Chrome",n=e.substring(r+7)):-1!=(r=e.indexOf("Safari"))?(t="Safari",n=e.substring(r+7),-1!=(r=e.indexOf("Version"))&&(n=e.substring(r+8))):-1!=(r=e.indexOf("Firefox"))?(t="Firefox",n=e.substring(r+8)):(a=e.lastIndexOf(" ")+1)<(r=e.lastIndexOf("/"))&&(t=e.substring(a,r),n=e.substring(r+1),t.toLowerCase()==t.toUpperCase()&&(t=navigator.appName)),-1!=(i=n.indexOf(";"))&&(n=n.substring(0,i)),-1!=(i=n.indexOf(" "))&&(n=n.substring(0,i)),o=parseInt(String(n),10),isNaN(o)&&(n=String(parseFloat(navigator.appVersion)),o=parseInt(navigator.appVersion,10)),console.log("Browser name  = "+t+"<br>Full version  = "+n+"<br>navigator.userAgent = "+navigator.userAgent+"<br>"),-1!=navigator.appVersion.indexOf("Win")&&(s="Windows"),-1!=navigator.appVersion.indexOf("Mac")&&(s="MacOS"),-1!=navigator.appVersion.indexOf("X11")&&(s="UNIX"),-1!=navigator.appVersion.indexOf("Linux")&&(s="Linux"),console.log("Your OS: "+s);return{browserName:t,browserVersion:n,userAgent:navigator.userAgent}}},{key:"splitUrl",value:function(e,t){if("path"===t){for(var n="",o=e.toString().split("/"),a=3;a<o.length;a++)n+="/"+o[a];return n}if("domain"===t)return e.toString().split("/")[2]}},{key:"sendDataPackage",value:function(e){var t=new XMLHttpRequest;if(t.open("POST",this.apiUrl,!1),t.setRequestHeader("Content-type","application/json"),void 0===this.params.data.svt||this.params.data.svt>50)try{this.setData(Date.now(),"timestamp",this.oldLocation),t.send(JSON.stringify(this.params)),200==t.status&&(console.log("I SENT TO API: ",this.params),console.log("I SENT TO API THAT DATA FIELD: ",this.params.data),void 0===this.params.user_id&&(this.cookiesHandler.setCookie("user_id",t.responseText),this.params.user_id=t.responseText),this.params.data={},e||(this.xhrData=[],this.resourcesErrors=[],this.domTimeChanges=[]))}catch(e){}}},{key:"setData",value:function(e,t,n){this.params.domain=this.splitUrl(n,"domain"),this.params.path=this.splitUrl(n,"path"),this.params.data[t]=e}},{key:"sendOnLoadData",value:function(e){this.setData(this.getSystemDetails(),"usd",e),this.setData(performance.timing,"nt",e),this.sendDataPackage(!0)}},{key:"filterDomChanges",value:function(){this.domTimeChanges=this.domTimeChanges.filter(function(e,t,n){return t===n.findIndex(function(t){return t.className===e.className})})}},{key:"sendOnRouteChangeData",value:function(e){console.warn("SEND ON ROUTE CALLED"),this.setData(Date.now()-this.singleViewTime,"svt",e),this.setTimer(),this.domChanged=!1,this.setResourceTiming(this.oldLocation),this.setData(this.xhrData,"xhr",e),this.setData(this.resourcesErrors,"errors",e),this.filterDomChanges(),this.setData(this.domTimeChanges,"dtc",e),this.sendDataPackage(!1)}},{key:"xhrWatcher",value:function(){var e=window.XMLHttpRequest.prototype.open,t=(window.XMLHttpRequest.prototype.send,this);window.XMLHttpRequest.prototype.open=function(n,o,a){var r=this,i=arguments,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t,c=Date.now();return this.xhrInProgress=!1,console.log("XHR INPUT: ",arguments),this.addEventListener("load",function(){r.xhrInProgress=!1}),this.addEventListener("timeout",function(){console.log("timeout called");var e=[i[0],i[1],c,"timeout"];s.xhrData.push(e),r.xhrInProgress=!1}),this.addEventListener("error",function(){console.log("error called");var e=[i[0],i[1],c,"error"];s.xhrData.push(e),r.xhrInProgress=!1}),this.addEventListener("abort",function(){console.log("abort called");var e=[i[0],i[1],c,"abort"];s.xhrData.push(e),r.xhrInProgress=!1}),e.apply(this,[].slice.call(arguments))}}},{key:"setResourceTiming",value:function(e){window.performance.getEntries()&&(this.setData(window.performance.getEntries(),"rt",e),"function"==typeof performance.clearResourceTimings&&window.performance.clearResourceTimings())}},{key:"pushResourcesError",value:function(e){this.resourcesErrors.push(e)}},{key:"setTimer",value:function(){this.singleViewTime=Date.now()}},{key:"sendDataOnUnload",value:function(){this.sendOnRouteChangeData(this.oldLocation)}},{key:"mutationObserver",value:function(){var e=this;new MutationObserver(function(t){for(var n=0;n<t.length;n++)e.domChanged=!0,e.domTimeChanges.push({nodeName:t[n].target.nodeName,className:t[n].target.className,timeAfterEnter:Date.now()-e.singleViewTime})}).observe(document,{attributes:!0,characterData:!0,childList:!1,subtree:!0})}},{key:"watchUrl",value:function(){this.oldLocation=document.location.href;var e=void 0,t=this;/#/.test(document.location.href)?window.onhashchange=function(){console.warn("WINDOW ON HASH CHANGE EVENT ADDED"),t.sendOnRouteChangeData(t.oldLocation),t.oldLocation=document.location.href}:(window.onpopstate=function(){console.warn("WINDOW ON POP STATE CHANGE EVENT ADDED"),t.sendOnRouteChangeData(t.oldLocation),t.oldLocation=document.location.href},document.addEventListener("click",function(n){console.warn("CLICK OBJ: ",n),console.warn("self.oldLocation: ",t.oldLocation),n.target&&n.target.href?e=n.target.href:n.path&&n.path[0].href?e=n.path[0].href:n.path&&n.path[1].href&&(e=n.path[1].href),console.warn("clickedLocation: ",e),console.warn("domchanged: ",t.domChanged),t.domChanged&&(e!==t.oldLocation&&/http/.test(e)||document.location.href!==t.oldLocation)&&(console.warn("CLICK CATCHED: ",n),t.sendOnRouteChangeData(t.oldLocation),t.oldLocation=e)}))}}]),e}(),i=function(){function e(t){o(this,e),this.cookieDays=t}return a(e,[{key:"setCookie",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.cookieDays,o="",a=new Date;n&&(a.setTime(a.getTime()+24*n*60*60*1e3),o="; expires="+a.toUTCString()),document.cookie=e+"="+t+o+"; path=/"}},{key:"getCookie",value:function(e){var t=document.cookie.split(";");e+="=";for(var n=0;n<t.length;n++){for(var o=t[n];" "==o.charAt(0);)o=o.substring(1,o.length);if(0==o.indexOf(e))return o.substring(e.length,o.length)}}}]),e}();!function(e){if(void 0!==e[0][0]){var t=new r(e[0][0],7);console.log("TRACKER CREATED"),t.setTimer(),window.onload=function(){window.performance&&performance.timing&&setTimeout(function(){console.log("SETTING AND SENDING NT ONLOAD"),t.sendOnLoadData(document.location.href)},0)},window.onbeforeunload=function(){t.sendDataOnUnload()},window.addEventListener("error",function(e){var n={type:e.type,message:e.message?e.message:"No message",target:e.target.href?e.target.href:e.target.src?e.target.src:"JavaScript Error"};t.pushResourcesError(n),console.log(e)},!0),t.mutationObserver(),t.xhrWatcher(),t.watchUrl(),window.pa.q[0][0]=void 0}}(window.pa.q)},{}]},{},[1]);