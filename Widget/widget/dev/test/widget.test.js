//setting up JSDOM environment
const { JSDOM } = require('jsdom'), jsdom = new JSDOM('<html><head></head><body><a href="page.html" id="link">Link</a></body></html>', {
    url: 'https://code.visualstudio.com/page',
    referrer: 'https://code.visualstudio.com/page',
    contentType: 'text/html',
    userAgent: 'Mellblomenator/9000',
    includeNodeLocations: true
});
let { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};
global.HTMLElement = function() {};
window.pa = {
    q: [ [ 'site_ID' ] ]
};
//dependencies
let sinon = require('sinon');
chai = require('chai'),
spies = require('chai-spies'),
path = require('path'),
//preparing fake XMLHtppRequest for testing under NodeJS
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest(),
server = sinon.fakeServer.create(),

//loading classes for testing
Widget = require(path.join(__dirname, '..', 'js/widget')),

//chai with "expect" style assertions and spies for mocks
expect = chai.expect;
chai.use(spies);

//some necessarily global variables for set-up
let cookieDays = 7, siteId = 'site_id', userId = 'user_id',
    location = 'https://code.visualstudio.com/page', userIdValue = 'some_unique_value',
    apiUrl = 'localhost:3000/tracker/view', tracker;
describe('Tracker class', () => {
    before(() => {
        tracker = new Widget.Tracker(siteId, cookieDays);
    });
    describe('#constructor', () => {
        it('set proper siteId', () => {
            expect(tracker.siteId).to.equal(siteId);
        });
        it('set proper apiUrl (HTTP or HTTPS)', () => {
            tracker = new Widget.Tracker(siteId, cookieDays);
            expect(tracker.apiUrl).to.equal('https://' + apiUrl);
            jsdom.reconfigure({url: 'http://code.visualstudio.com/page' });
            tracker = new Widget.Tracker(siteId, cookieDays);
            expect(tracker.apiUrl).to.equal('http://' + apiUrl);
            jsdom.reconfigure({url: location });
            tracker = new Widget.Tracker(siteId, cookieDays);
        });
        it('set proper userUrl', () => {
            expect(tracker.userUrl).to.equal(location);
        });
        it('set clear object for params', () => {
            expect(tracker.params).to.be.a('object');
        });
        it('set empty request', () => {
            expect(tracker.request).to.equal('');
        });
        it('set location', () => {
            expect(tracker.oldLocation).to.equal(window.document.location.href);
        });
    });
    describe('#formatParams()', () => {
        it('returns connected parameters as an Object for GET/POST request', () => {
            params = {
                site_id: siteId,
                user_id: userIdValue,
                path: tracker.splitUrl(location, 'path'),
                domain: tracker.splitUrl(location, 'domain')
            };
            expect(tracker.formatParams(params)).to.contain('=').and.contain('&');
        });
    });
    describe('#splitUrl()', () => {
        it('return path of URL', () => {
            expect(tracker.splitUrl(location, 'path')).to.equal(window.location.pathname)
        });
        it('return domain of URL', () => {
            expect(tracker.splitUrl(location, 'domain')).to.equal(window.location.hostname);
        });
    });
    describe('#sendDataToApi()', () => {
        it('send request with no cookie and put response into cookie', () => {
            document.cookie = null;
            expect(document.cookie.valueOf('user_id')).to.be.equal('null');
            server.respondWith('POST', tracker.apiUrl,
                [200, { 'Content-Type': 'application/json' },
                    '3v74hyyeo1jo89nnlacpf6kczt']);
            server.respondImmediately = true;
            server.respond();
            tracker.sendDataToApi();
            expect(document.cookie.valueOf('user_id')).to.not.be.equal('null');
        });
    });
    describe('#watchUrl()', () => {
        let spy;
        before(() => {
            spy = chai.spy.on(tracker, 'sendDataToApi');
        });
        afterEach(() => {
            spy.__spy.called = false;
        });
        it('should set and send proper path/domain on path/domain change', () => {
            tracker.watchUrl();
            expect(tracker.params.path).to.equal(window.location.pathname);
            expect(tracker.params.domain).to.equal(window.location.hostname);
        });
        it('define onhashchange and sendDataToApi() when # in URL', () => {
            window.history.pushState(location,'pagetwo','/#/pageTwo');
            tracker.watchUrl();
            expect(spy).to.not.been.called();
            window.onhashchange();
            expect(spy).to.have.been.called.with(tracker.siteId, document.location.href);
        });
        it('define onpopstate and sendDataToApi()', () => {
            tracker.watchUrl()
            expect(spy).to.not.been.called();
            window.onpopstate();
            expect(spy).to.have.been.called.with(tracker.siteId,document.location.href);
        });
        it('trigerring sendDataToApi after click on link ', () => {
            window.history.pushState(location,'page','/page');
            expect(spy).to.not.been.called();
            document.getElementById('link').click();
            expect(spy).to.have.been.called.with(tracker.siteId, document.location.href);
        });
    });
});
describe('Cookies class', () => {
    let cookie;
    describe('create cookie', () => {
        it('create cookie object', () => {
            cookie = new Widget.Cookies(cookieDays);
            expect(cookie).to.be.an.instanceof(Widget.Cookies);
        });
    });
    describe('#constructor', () => {
        it('set cookieDays value', () => {
            expect(cookie.cookieDays).to.equal(cookieDays);
        });
    });
    describe('#setCookie()', () => {
        it('set cookie at client with parameters', () => {
            cookie.setCookie(userId, userIdValue, cookieDays);
            expect(document.cookie).to.contain(userId + '=' + userIdValue);
        });
        it('set cookie without expires date parameter', () => {
            cookie.cookieDays = null;
            cookie.setCookie(userId, userIdValue);
            expect(document.cookie).to.not.contain('expires=');
        });
    });
    describe('#getCookie()', () => {
        it('return proper, not empty value from cookie', () => {
            cookie.setCookie(userId, userIdValue, cookieDays);
            expect(cookie.getCookie(userId)).to.equal(userIdValue);
            expect(cookie.getCookie(userId)).to.not.equal('');
        });
    });
});