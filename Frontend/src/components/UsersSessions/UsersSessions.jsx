import * as React from 'react';

import SessionButton from '../SessionButton/SessionButton';
import './usersSessions.css';

class UsersSessionsView extends React.Component {
    constructor(props) {
        super(props);
        this.props.loadSessions();
        this.state = {
            details: null
        }

        this.handleOnClick = this.handleOnClick.bind(this);
    }
    
    handleOnClick(id) {
        this.props.loadSessionDetails(id);
    }
    render() {
        if (this.props.sessions.sessions.response && this.state.details === null) {
            return (
                <div className="sessionButtons">
                {this.props.sessions.sessions.response.map(element => {
                    return <SessionButton key={element} sessionData={element} onClick={this.handleOnClick} />
                })}
                </div>
            );
        } else {
            return (
                <h4> Loading... if it takes too long please refresh site.</h4>
            );
        }
    }

};

export default UsersSessionsView;
