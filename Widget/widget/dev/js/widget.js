
class PerformanceAnalyzer {
    constructor(siteId, cookieDays) {
        this.siteId = siteId;
        this.apiUrl = 'https://enigmatic-ridge-18595.herokuapp.com/tracker' ; //URL to local simple backend API
        this.cookiesHandler = new Cookies(cookieDays);
        this.params = {
            site_id: this.siteId,
            user_id: this.cookiesHandler.getCookie('user_id'),
            domain: this.splitUrl(document.location.href, 'domain'),
            path: this.splitUrl(document.location.href, 'path'),
            data: {}
        };
        this.xhrData = [];
        this.resourcesErrors = []; 
        this.domTimeChanges = [];
        this.domChanged = false;
        this.singleViewTime = 0;
    }

    // getting info about system and browser version
    getSystemDetails() {
        let nAgt = navigator.userAgent,
            browserName  = navigator.appName,
            browserVersion  = String(parseFloat(navigator.appVersion)),
            majorVersion = parseInt(navigator.appVersion,10),
            nameOffset,
            verOffset,
            ix,
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
            if ((verOffset = nAgt.indexOf('Version')) != -1) {browserVersion = nAgt.substring(verOffset + 8);}
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browserName = 'Firefox';
            browserVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                  (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset,verOffset);
            browserVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the browserVersion string at semicolon/space if present
        if ((ix = browserVersion.indexOf(';')) != -1) {browserVersion = browserVersion.substring(0,ix);}
        if ((ix = browserVersion.indexOf(' ')) != -1) {browserVersion = browserVersion.substring(0,ix);}

        majorVersion = parseInt(String(browserVersion),10);
        if (isNaN(majorVersion)) {
            browserVersion  = String(parseFloat(navigator.appVersion));
            majorVersion = parseInt(navigator.appVersion,10);
        }

        if (navigator.appVersion.indexOf('Win') != -1) {OSName = 'Windows';}
        if (navigator.appVersion.indexOf('Mac') != -1) {OSName = 'MacOS';}
        if (navigator.appVersion.indexOf('X11') != -1) {OSName = 'UNIX';}
        if (navigator.appVersion.indexOf('Linux') != -1) {OSName = 'Linux';}

        const userSystemInfo = {
            browserName: browserName,
            browserVersion: browserVersion,
            userAgent: navigator.userAgent
        }
        return userSystemInfo;
    }
    // split URL for getting separated domain and path
    splitUrl(url, parameter) {
        if (parameter === 'path') {
            let path = '', arrayIterator = url.toString().split('/');
            for (let i = 3; i < arrayIterator.length; i++) {path += '/' + arrayIterator[i];}
            return path;
        }
        if (parameter === 'domain') {
            return url.toString().split('/')[2];
        }
    }
    //sending data to API via POST/GET
    sendDataPackage(initial) {
        const xmlHttp = new XMLHttpRequest();
        //creating POST request
        xmlHttp.open('POST', this.apiUrl, false);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        if (this.params.data.svt === undefined || this.params.data.svt > 50) { // this condition prevents from calling onpopstate and click (twice) in Angular5 for example
            try {
                this.setData(Date.now(), 'timestamp', this.oldLocation); // setting timestamp if there is internet connection 
                xmlHttp.send(JSON.stringify(this.params));
                if (xmlHttp.status == 200) {
                    console.log('I SENT TO API: ', this.params);
                    console.log('I SENT TO API THAT DATA FIELD: ', this.params.data);
                    // checking if there is a cookie set, if not received ID is set
                    if (this.params.user_id === undefined) {
                        this.cookiesHandler.setCookie('user_id', xmlHttp.responseText);
                        this.params.user_id = xmlHttp.responseText;
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
    setData(data, dataSource, currentLocation) {
        this.params.domain = this.splitUrl(currentLocation, 'domain');
        this.params.path = this.splitUrl(currentLocation, 'path');
        this.params.data[dataSource] = data;
    }
    // preparing and sending data on initial route (hard navigation)
    sendOnLoadData(location) {
        this.setData(this.getSystemDetails(), 'usd', location);
        this.setData(performance.timing, 'nt', location);
        this.sendDataPackage(true);
    }
    filterDomChanges() {
        this.domTimeChanges = this.domTimeChanges.filter((thing, index, self) =>
            index === self.findIndex((t) => t.className === thing.className)
        )
    }
    sendOnRouteChangeData(location) {
        this.setData(Date.now() - this.singleViewTime, 'svt', location);
        this.setTimer();
        this.domChanged = false;
        this.setResourceTiming(this.oldLocation);
        this.setData(this.xhrData, 'xhr', location)
        this.setData(this.resourcesErrors, 'errors', location)
        this.filterDomChanges();
        this.setData(this.domTimeChanges, 'dtc', location)
        this.sendDataPackage(false);
    }

    // overwrites XMLHttpRequest methods for handle and XHR errors, timeouts etc.
    xhrWatcher() {
        let proxiedXHRopen = window.XMLHttpRequest.prototype.open,
            proxiedXHRsend = window.XMLHttpRequest.prototype.send,
            self = this;

        window.XMLHttpRequest.prototype.open = function(method, url, async, context = self) {
            let end, start = Date.now();
            this.xhrInProgress = false;
            this.addEventListener('load', () => {
                
                this.xhrInProgress = false;
            })
            this.addEventListener('timeout', () => {
                console.log('timeout called');
                let temp = [arguments[0], arguments[1], start, 'timeout']
                context.xhrData.push(temp);
                this.xhrInProgress = false;
            })
            this.addEventListener('error', () => {
                console.log('error called');
                let temp = [arguments[0], arguments[1], start, 'error']
                context.xhrData.push(temp);
                this.xhrInProgress = false;
            })
            this.addEventListener('abort', () => {
                console.log('abort called');
                let temp = [arguments[0], arguments[1], start, 'abort']
                context.xhrData.push(temp);
                this.xhrInProgress = false;
            })

            return proxiedXHRopen.apply(this, [].slice.call(arguments));
        }
    }
    setResourceTiming(location) {
        if (window.performance.getEntries()) {
            this.setData(window.performance.getEntries(), 'rt', location)
            if (typeof performance.clearResourceTimings == 'function') {
                window.performance.clearResourceTimings();
            }
        }
    }
    pushResourcesError(error) {
        this.resourcesErrors.push(error);
    }
    setTimer() {
        this.singleViewTime = Date.now();
    }
    sendDataOnUnload() {
        this.sendOnRouteChangeData(this.oldLocation);
    }
    mutationObserver() {
        const observer = new MutationObserver((mutations) => {
            for (let j = 0; j < mutations.length; j++) {
                this.domChanged = true;
                this.domTimeChanges.push({
                    nodeName: mutations[j].target.nodeName,
                    className: mutations[j].target.className,
                    timeAfterEnter: Date.now() - this.singleViewTime
                })
            }
        });
        const config = {
            attributes: true,
            characterData: true,
            childList: false,
            subtree: true
        }

        // pass in the target node, as well as the observer options
        observer.observe(document, config);
    }
    //watcher for SPA sites
    watchUrl() {
        this.oldLocation = document.location.href;
        let clickedLocation,
            self = this;
        //if SPA has hash (bang) enabled (HTML5)
        if (/#/.test(document.location.href)) {
            window.onhashchange = () => {
                self.sendOnRouteChangeData(self.oldLocation);
                self.oldLocation = document.location.href;
            }
        } else { //if hash (bang) is disabled
            window.onpopstate = () => {
                self.sendOnRouteChangeData(self.oldLocation);
                self.oldLocation = document.location.href;
            }
            document.addEventListener('click', (obj) => {
                console.warn('CLICK OBJ: ', obj);
                console.warn('self.oldLocation: ', self.oldLocation);
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
                        self.sendOnRouteChangeData(self.oldLocation);
                        self.oldLocation = clickedLocation;
                    }
                }
            });
        }
    }
}

class Cookies {
    //methods to manipulate cookies
    constructor(cookieDays) {
        this.cookieDays = cookieDays;
    }

    setCookie(name, value, days = this.cookieDays) {
        let expires = '', date = new Date();
        if (days) {
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    getCookie(name) {
        let cookieParts = document.cookie.split(';');
        name += '=';
        for (let i = 0; i < cookieParts.length; i++) {
            let cache = cookieParts[i];
            while (cache.charAt(0) == ' ') {cache = cache.substring(1, cache.length);}
            if (cache.indexOf(name) == 0) {
                return cache.substring(name.length, cache.length);
            }
        }
    }
}
//triggering tracker object (and parameters via window.pa.q)
(function(params) {
    if (params[0][0] !== undefined) {
        let cookieDaysExists = 7,
            tracker = new PerformanceAnalyzer(params[0][0], cookieDaysExists);
        console.log('TRACKER CREATED');
        tracker.setTimer();
        window.onload = () => {
            if (window.performance && performance.timing) {
                setTimeout(() => {
                    console.log('SETTING AND SENDING NT ONLOAD');
                    tracker.sendOnLoadData(document.location.href)
                }, 0)
            }
        }
        window.onbeforeunload = () => {
            tracker.sendDataOnUnload();
        }
        window.addEventListener('error', (error) => {
            let errorLog = {
                type: error.type,
                message: error.message ? error.message : 'No message',
                target: error.target.href ? error.target.href : error.target.src ? error.target.src : 'JavaScript Error'
            };
            tracker.pushResourcesError(errorLog);
            console.log(error)
        }, true);


        tracker.mutationObserver();
        tracker.xhrWatcher();
        tracker.watchUrl()

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
