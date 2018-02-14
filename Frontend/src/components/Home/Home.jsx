import * as React from 'react';

const Home = () => {

    return (
        <div className="home">
            <h1>Performance analyzer.</h1>
            <h5>Author: Patryk Rezler</h5>
            <p>Application you see is a simple preview for data collected by 'performance analyzer widget', which is small JavaScript file hooked to external website and getting informations about all resources, dom changes and errors during navigation by real users.</p>
            <p>Widget is designed for handling 'soft' type of navigations, typically for Single Page Applications (SPA). Widget makes so magic while retrieving bunch of usefull informations, and what's most important, it doesn't require any advanced configuration for start working.</p>
            <p><b>Overview</b> section contains general info about all data sent by widget into MySQL database. You can find there informations about all the paths of specified site (by siteID identifier), and their load times summary. You can also take a look about errors occured during navigations by real users. Their short description helps you aim and resolve the problem.</p>
            <p><b>Users Sessions</b> is the list of all sessions (first site load - navigations - site unload) of users and theis ID's. Every single session includes tree of paths, which user selected while his visit. You can find there informations from: Navigation Timing API, Resources Timing, General and XHR Errors and also small preview on DOM structure changes in time.</p>
        </div>
    )
}
export default Home;