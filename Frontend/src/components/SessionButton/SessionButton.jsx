import * as React from 'react';
import { Link } from 'react-router-dom';

import './sessionButton.css';

const SessionButton = ({sessionData, onClick}) => {
    console.log(sessionData)
    return (
        <Link
        to={`${process.env.PUBLIC_URL}/session/`+ sessionData.ID}
        >
            <div className="session-button" onClick={() => onClick(sessionData.ID)}>
                <div className="session-button-label">User ID:<span> {sessionData.userID}</span></div>
                <div className="session-button-label">Site ID:<span> {sessionData.siteID}</span></div>
                <div className="session-button-label">Enter path:<span> {sessionData.path}</span></div>
                <div className="session-button-label">Date:<span> {sessionData.timestamp}</span></div>
            </div>
        </Link>
    )
}
export default SessionButton;