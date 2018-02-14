(function(a) {
    window[a] = window[a] || function() {
        (window[a].q = window[a].q || []).push(arguments);
    };
    function loadWidget() {
        var s = document.createElement('script'), x;
        s.type = 'text/javascript';
        s.async = true;
        s.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'localhost:8000/widget.js';
        x = document.getElementsByTagName('head')[0];
        x.insertBefore(s, x.firstChild);
    }
    if (window.attachEvent) {
        window.attachEvent('onload', loadWidget());
    } else {
        window.addEventListener('load', loadWidget(), false);
    }
    loadWidget();
})('pa');
pa('site_ID');