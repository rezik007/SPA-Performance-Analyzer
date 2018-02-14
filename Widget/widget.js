(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PerformanceAnalyzer = function () {
    function PerformanceAnalyzer(siteId, cookieDays) {
        _classCallCheck(this, PerformanceAnalyzer);

        this.siteId = siteId;
        this.apiUrl = 'https://enigmatic-ridge-18595.herokuapp.com/tracker'; //URL to local simple backend API
        this.cookiesHandler = new Cookies(cookieDays);
        this.params = {
            site_id: this.siteId,
            user_id: this.cookiesHandler.getCookie('user_id'),
            domain: this.splitUrl(document.location.href, 'domain'),
            path: this.splitUrl(document.location.href, 'path'),
            data: {}
        };
        this.xhrData = [];
        this.resourcesErrors = []; //handles IMG, CSS(<link>), JS <script> Errors, EXPECT: IFrames wrong SRC, Fonts Errors
        this.domTimeChanges = [];
        this.domChanged = false;
        this.singleViewTime = 0;
    }

    // getting info about system and browser version


    _createClass(PerformanceAnalyzer, [{
        key: 'getSystemDetails',
        value: function getSystemDetails() {
            var nAgt = navigator.userAgent,
                browserName = navigator.appName,
                browserVersion = String(parseFloat(navigator.appVersion)),
                majorVersion = parseInt(navigator.appVersion, 10),
                nameOffset = void 0,
                verOffset = void 0,
                ix = void 0,
                OSName = 'Unknown OS';

            // In Opera, the true version is after "Opera" or after "Version"
            if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                browserName = 'Opera';
                browserVersion = nAgt.substring(verOffset + 6);
                if ((verOffset = nAgt.indexOf('Version')) != -1) {
                    browserVersion = nAgt.substring(verOffset + 8);
                }
            }
            // In MSIE, the true version is after "MSIE" in userAgent
            else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                    browserName = 'Microsoft Internet Explorer';
                    browserVersion = nAgt.substring(verOffset + 5);
                }
                // In Chrome, the true version is after "Chrome" 
                else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                        browserName = 'Chrome';
                        browserVersion = nAgt.substring(verOffset + 7);
                    }
                    // In Safari, the true version is after "Safari" or after "Version" 
                    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                            browserName = 'Safari';
                            browserVersion = nAgt.substring(verOffset + 7);
                            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                                browserVersion = nAgt.substring(verOffset + 8);
                            }
                        }
                        // In Firefox, the true version is after "Firefox" 
                        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                                browserName = 'Firefox';
                                browserVersion = nAgt.substring(verOffset + 8);
                            }
                            // In most other browsers, "name/version" is at the end of userAgent 
                            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                                    browserName = nAgt.substring(nameOffset, verOffset);
                                    browserVersion = nAgt.substring(verOffset + 1);
                                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                                        browserName = navigator.appName;
                                    }
                                }
            // trim the browserVersion string at semicolon/space if present
            if ((ix = browserVersion.indexOf(';')) != -1) {
                browserVersion = browserVersion.substring(0, ix);
            }
            if ((ix = browserVersion.indexOf(' ')) != -1) {
                browserVersion = browserVersion.substring(0, ix);
            }

            majorVersion = parseInt(String(browserVersion), 10);
            if (isNaN(majorVersion)) {
                browserVersion = String(parseFloat(navigator.appVersion));
                majorVersion = parseInt(navigator.appVersion, 10);
            }
            console.log('' + 'Browser name  = ' + browserName + '<br>' + 'Full version  = ' + browserVersion + '<br>' + 'navigator.userAgent = ' + navigator.userAgent + '<br>');

            if (navigator.appVersion.indexOf('Win') != -1) {
                OSName = 'Windows';
            }
            if (navigator.appVersion.indexOf('Mac') != -1) {
                OSName = 'MacOS';
            }
            if (navigator.appVersion.indexOf('X11') != -1) {
                OSName = 'UNIX';
            }
            if (navigator.appVersion.indexOf('Linux') != -1) {
                OSName = 'Linux';
            }

            console.log('Your OS: ' + OSName);
            var userSystemInfo = {
                browserName: browserName,
                browserVersion: browserVersion,
                userAgent: navigator.userAgent
            };
            return userSystemInfo;
        }
        // split URL for getting separated domain and path

    }, {
        key: 'splitUrl',
        value: function splitUrl(url, parameter) {
            if (parameter === 'path') {
                var path = '',
                    arrayIterator = url.toString().split('/');
                for (var i = 3; i < arrayIterator.length; i++) {
                    path += '/' + arrayIterator[i];
                }
                return path;
            }
            if (parameter === 'domain') {
                return url.toString().split('/')[2];
            }
        }
        //sending data to API via POST/GET

    }, {
        key: 'sendDataPackage',
        value: function sendDataPackage(initial) {
            var xmlHttp = new XMLHttpRequest();
            //creating POST request
            xmlHttp.open('POST', this.apiUrl, false);
            xmlHttp.setRequestHeader('Content-type', 'application/json');
            if (this.params.data.svt === undefined || this.params.data.svt > 50) {
                // this condition prevents from calling onpopstate and click (twice) in Angular5 for example
                try {
                    this.setData(Date.now(), 'timestamp', this.oldLocation); // setting timestamp if there is internet connection 
                    xmlHttp.send(JSON.stringify(this.params));
                    this.dataAlreadySent = false;
                    if (xmlHttp.status == 200) {
                        console.log('I SENT TO API: ', this.params);
                        console.log('I SENT TO API THAT DATA FIELD: ', this.params.data);
                        // console.log(JSON.parse(this.params.data.nt).loadEventEnd);
                        // console.log(JSON.parse(this.params.data.nt).navigationStart);
                        // console.log('STATIC FILES TIME LOAD FROM DATA CALCULATED:', JSON.parse(this.params.data.nt).loadEventEnd - JSON.parse(this.params.data.nt).navigationStart);
                        // console.log('DOMContentLoaded: ', JSON.parse(this.params.data.nt).domContentLoadedEventStart - JSON.parse(this.params.data.nt).navigationStart)

                        // checking if there is a cookie set, if not received ID is set
                        if (this.cookiesHandler.getCookie('user_id') === undefined) {
                            this.cookiesHandler.setCookie('user_id', xmlHttp.responseText);
                        }
                        this.params.data = {}; // clearing data for next route
                        if (!initial) {
                            // if route is initial (hard navigation) dont clear buffors before next route, when they'll be sent
                            this.xhrData = [];
                            this.resourcesErrors = [];
                            this.domTimeChanges = [];
                        }
                    }
                } catch (err) {}
            }
        }

        // setting data in params

    }, {
        key: 'setData',
        value: function setData(data, dataSource, currentLocation) {
            this.params.domain = this.splitUrl(currentLocation, 'domain');
            this.params.path = this.splitUrl(currentLocation, 'path');
            this.params.data[dataSource] = data;
        }
        // preparing and sending data on initial route (hard navigation)

    }, {
        key: 'sendOnLoadData',
        value: function sendOnLoadData(location) {
            this.setData(this.getSystemDetails(), 'usd', location);
            this.setData(performance.timing, 'nt', location);
            this.sendDataPackage(true);
        }
    }, {
        key: 'filterDomChanges',
        value: function filterDomChanges() {
            this.domTimeChanges = this.domTimeChanges.filter(function (thing, index, self) {
                return index === self.findIndex(function (t) {
                    return t.className === thing.className;
                });
            });
        }
    }, {
        key: 'sendOnRouteChangeData',
        value: function sendOnRouteChangeData(location) {
            console.warn('SEND ON ROUTE CALLED');
            this.setData(Date.now() - this.singleViewTime, 'svt', location);
            this.setTimer();
            this.domChanged = false;
            this.setResourceTiming(this.oldLocation);
            this.setData(this.xhrData, 'xhr', location);
            this.setData(this.resourcesErrors, 'errors', location);
            this.filterDomChanges();
            this.setData(this.domTimeChanges, 'dtc', location);
            this.sendDataPackage(false);
        }

        // overwrites XMLHttpRequest methods for handle and XHR errors, timeouts etc.

    }, {
        key: 'xhrWatcher',
        value: function xhrWatcher() {
            var proxiedXHRopen = window.XMLHttpRequest.prototype.open,
                proxiedXHRsend = window.XMLHttpRequest.prototype.send,
                self = this;

            window.XMLHttpRequest.prototype.open = function (method, url, async) {
                var _this = this,
                    _arguments = arguments;

                var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : self;

                var end = void 0,
                    start = Date.now();
                this.xhrInProgress = false;
                console.log('XHR INPUT: ', arguments);
                //TODO: watching pending request which dont finish before click and send (also before clearing queue)
                // this.addEventListener('loadstart', () => {
                //     console.log('XHR LOAD START');
                //     // end = Date.now();
                //     // context.wholeLoad += (end - context.wholeLoad);
                //     // console.log('load called with time ms: ', end-start);
                //     // let temp = [arguments[0], arguments[1], end-start]
                //     // context.xhrData.push(temp);
                // })
                // this.addEventListener('progress', () => {
                //     console.log('XHR PROGRESS');
                //     // end = Date.now();
                //     // context.wholeLoad += (end - context.wholeLoad);
                //     // console.log('load called with time ms: ', end-start);
                //     // let temp = [arguments[0], arguments[1], end-start]
                //     // context.xhrData.push(temp);
                //     this.xhrInProgress = true;
                // })
                this.addEventListener('load', function () {
                    // end = Date.now();
                    // context.wholeLoad += (end - context.wholeLoad);
                    // console.log('load called with time ms: ', end-start);
                    // let temp = [arguments[0], arguments[1], end-start]
                    // context.xhrData.push(temp);
                    _this.xhrInProgress = false;
                });
                this.addEventListener('timeout', function () {
                    console.log('timeout called');
                    var temp = [_arguments[0], _arguments[1], start, 'timeout'];
                    context.xhrData.push(temp);
                    _this.xhrInProgress = false;
                });
                this.addEventListener('error', function () {
                    console.log('error called');
                    var temp = [_arguments[0], _arguments[1], start, 'error'];
                    context.xhrData.push(temp);
                    _this.xhrInProgress = false;
                });
                this.addEventListener('abort', function () {
                    console.log('abort called');
                    var temp = [_arguments[0], _arguments[1], start, 'abort'];
                    context.xhrData.push(temp);
                    _this.xhrInProgress = false;
                });

                return proxiedXHRopen.apply(this, [].slice.call(arguments));
            };
            // window.XMLHttpRequest.prototype.send() = function() {
            //     return proxiedXHRsend.apply(this, [].slice.call(arguments));
            // }
        }
    }, {
        key: 'setResourceTiming',
        value: function setResourceTiming(location) {
            if (window.performance.getEntries()) {
                this.setData(window.performance.getEntries(), 'rt', location);
                if (typeof performance.clearResourceTimings == 'function') {
                    window.performance.clearResourceTimings();
                }
            }
        }
    }, {
        key: 'pushResourcesError',
        value: function pushResourcesError(error) {
            this.resourcesErrors.push(error);
        }
    }, {
        key: 'setTimer',
        value: function setTimer() {
            this.singleViewTime = Date.now();
        }
    }, {
        key: 'sendDataOnUnload',
        value: function sendDataOnUnload() {
            this.sendOnRouteChangeData(this.oldLocation);
        }
    }, {
        key: 'mutationObserver',
        value: function mutationObserver() {
            var _this2 = this;

            var observer = new MutationObserver(function (mutations) {
                _this2.domChanged = true;
                //unusefull ? I can handle all errors using window.onerror below... but I can measure times of appearing nodes in DOM ! TODO
                for (var j = 0; j < mutations.length; j++) {
                    //    console.log(mutations[j].target.nodeName, '----', mutations[j].target.className, ' TIME after click: ', Date.now() - this.singleViewTime)
                    // if (mutations[j].type === "attributes") {
                    //     mutations[j].target.addEventListener('load', () => {
                    //         // console.log(mutations[j].target, 'LOADED!')
                    //     })
                    //     mutations[j].target.addEventListener('error', (error) => {
                    //         // console.log(mutations[j].target, 'ERRORED!')
                    //         let errorLog = {
                    //             type: error.type,
                    //             message: error.message ? error.message : 'No message',
                    //             target: error.target.href ? error.target.href : error.target.src ? error.target.src : 'JavaScript Error'
                    //         };
                    //         // this.pushResourcesError(errorLog);

                    //     })
                    // } 
                    _this2.domTimeChanges.push({
                        nodeName: mutations[j].target.nodeName, //TODO: choose useable/interesting properties of node
                        className: mutations[j].target.className,
                        timeAfterEnter: Date.now() - _this2.singleViewTime
                    });
                    // if (mutations[j].type === 'childList') {
                    //     for (let i = 0; i < mutations[j].addedNodes.length; i++) {
                    //         // console.log(mutations[j].addedNodes[i])
                    //         // this.domTimeChanges.push({
                    //         //     nodeName: mutations[j].target[i].nodeName, //TODO: choose useable/interesting properties of node
                    //         //     className: mutations[j].target[i].className,
                    //         //     timeAfterEnter: Date.now() - this.singleViewTime
                    //         // })
                    //         // mutations[j].addedNodes[i].addEventListener('load', () => {
                    //         //     // console.log(mutations[j].addedNodes[i], 'LOADED CHILDLIST!')
                    //         // })
                    //         // mutations[j].addedNodes[i].addEventListener('error', () => {
                    //         //     // console.log(mutations[j].addedNodes[i], 'ERRORED CHILDLIST!')
                    //         // })
                    //         // console.log(mutations[j].addedNodes[i], Date.now())

                    //     }
                    // }
                }
            });

            // configuration of the observer:
            var config = {
                attributes: true,
                characterData: true,
                childList: false,
                subtree: true

                // pass in the target node, as well as the observer options
            };observer.observe(document, config);
        }
        //watcher for SPA sites

    }, {
        key: 'watchUrl',
        value: function watchUrl() {
            this.oldLocation = document.location.href;
            var clickedLocation = void 0,
                self = this;
            //if SPA has hash (bang) enabled (HTML5)
            if (/#/.test(document.location.href)) {
                window.onhashchange = function () {
                    console.warn('WINDOW ON HASH CHANGE EVENT ADDED');
                    self.sendOnRouteChangeData(self.oldLocation);
                    self.oldLocation = document.location.href;
                };
            } else {
                //if hash (bang) is disabled
                window.onpopstate = function () {
                    console.warn('WINDOW ON POP STATE CHANGE EVENT ADDED');
                    self.sendOnRouteChangeData(self.oldLocation);
                    self.oldLocation = document.location.href;
                };
                document.addEventListener('click', function (obj) {
                    console.warn('CLICK OBJ: ', obj);
                    console.warn('self.oldLocation: ', self.oldLocation);
                    // console.log('timig: ',performance.timing)
                    // console.log('getEntries: ',performance)
                    // console.log('naviagtion', performance.navigation)
                    // console.log('obj target nodeName', obj.target.nodeName)
                    // let loadTime = window.performance.timing.domComplete- window.performance.timing.navigationStart;
                    // console.log('loadTime', loadTime)
                    if (obj.target && obj.target.href) {
                        clickedLocation = obj.target.href;
                    } else if (obj.path && obj.path[0].href) {
                        clickedLocation = obj.path[0].href;
                    } else if (obj.path && obj.path[1].href) {
                        clickedLocation = obj.path[1].href;
                    }

                    console.warn('clickedLocation: ', clickedLocation);
                    console.warn('domchanged: ', self.domChanged);
                    if (self.domChanged) {
                        if (clickedLocation !== self.oldLocation && /http/.test(clickedLocation) || document.location.href !== self.oldLocation) {
                            console.warn('CLICK CATCHED: ', obj);
                            self.sendOnRouteChangeData(self.oldLocation);
                            self.oldLocation = clickedLocation;
                        }
                    }
                });
            }
        }
    }]);

    return PerformanceAnalyzer;
}();

var Cookies = function () {
    //methods to manipulate cookies
    function Cookies(cookieDays) {
        _classCallCheck(this, Cookies);

        this.cookieDays = cookieDays;
    }

    _createClass(Cookies, [{
        key: 'setCookie',
        value: function setCookie(name, value) {
            var days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.cookieDays;

            var expires = '',
                date = new Date();
            if (days) {
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + value + expires + '; path=/';
        }
    }, {
        key: 'getCookie',
        value: function getCookie(name) {
            var cookieParts = document.cookie.split(';');
            name += '=';
            for (var i = 0; i < cookieParts.length; i++) {
                var cache = cookieParts[i];
                while (cache.charAt(0) == ' ') {
                    cache = cache.substring(1, cache.length);
                }
                if (cache.indexOf(name) == 0) {
                    return cache.substring(name.length, cache.length);
                }
            }
        }
    }]);

    return Cookies;
}();
//triggering tracker object (and parameters via window.pa.q)


(function (params) {
    if (params[0][0] !== undefined) {
        var cookieDaysExists = 7,
            tracker = new PerformanceAnalyzer(params[0][0], cookieDaysExists);
        console.log('TRACKER CREATED');
        tracker.setTimer();
        window.onload = function () {
            if (window.performance && performance.timing) {
                setTimeout(function () {
                    console.log('SETTING AND SENDING NT ONLOAD');
                    tracker.sendOnLoadData(document.location.href);
                }, 0);
            }
        };
        window.onbeforeunload = function () {
            tracker.sendDataOnUnload();
        };
        window.addEventListener('error', function (error) {
            var errorLog = {
                type: error.type,
                message: error.message ? error.message : 'No message',
                target: error.target.href ? error.target.href : error.target.src ? error.target.src : 'JavaScript Error'
            };
            tracker.pushResourcesError(errorLog);
            console.log(error);
        }, true);

        tracker.mutationObserver();
        tracker.xhrWatcher();
        tracker.watchUrl();

        //manually run tracker calling this function defined in window scope
        // window.pa.runTracker = function() {
        //     tracker.sendDataToApi();
        // }
        //don't allow to start tracker when loaders are duplicated
        return window.pa.q[0][0] = undefined;
    }
})(window.pa.q);

//export modules for mocha
// module.exports = {
//     PerformanceAnalyzer: PerformanceAnalyzer,
//     Cookies: Cookies
// };

},{}]},{},[1]);
