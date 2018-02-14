import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';

import UsersSessions  from '../../containers/UsersSessions';
import SingleSession  from '../../containers/SingleSession';
import Overview from '../../containers/Overview';

import Home from '../Home/Home';

const logo = require('../../assets/images/logo.svg');

const App = () => {
    return (
        <div className="App" id="App">
            <Router>
                <div>
                    <div className="App-header">
                        <img src={logo} className="App-header-logo" alt="logo" />
                        <div className="homeLinkContainer">
                        <h2>
                            <Link className="homeLink" to={`${process.env.PUBLIC_URL}/`}>
                                <i>Performance Analyzer v.0.1</i>
                            </Link>
                        </h2>
                        </div>
                        <div className="topNavContainer">
                            <NavLink className="topNavButton" activeClassName="topNavButton-active" to={`${process.env.PUBLIC_URL}/users_sessions`}>
                                Users sessions
                            </NavLink>
                            <NavLink className="topNavButton" activeClassName="topNavButton-active" to={`${process.env.PUBLIC_URL}/overview`}>
                                Overview
                            </NavLink>
                        </div>
                    </div>
                    <div className="App-container">
                        <div className="content">
                            <Route
                                path={`${process.env.PUBLIC_URL}/users_sessions`}
                                component={UsersSessions}
                            />
                            <Route
                                path={`${process.env.PUBLIC_URL}/session/:id`}
                                component={SingleSession}
                            />
                            <Route
                                path={`${process.env.PUBLIC_URL}/overview`}
                                component={Overview}
                            />
                            <Route
                                path={`${process.env.PUBLIC_URL}/`}
                                exact={true}
                                component={Home}
                            />
                        </div>
                        <div className="clearFix" />
                    </div>
                </div>
            </Router>
        </div>
    );
};

export default App;
