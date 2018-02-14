import * as React from 'react';


import PopupModal from '../PopupModal/PopupModal';

import PathDetails from '../PathDetails/PathDetails'

import './sessionDetails.css';

class SessionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.singleSession,
            modal: null
        }
        this.props.loadSessionDetails(this.props.match.params.id);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnCloseClick = this.handleOnCloseClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.singleSession });
    }
    handleOnClick(data) {
        this.setState({modal: data})
        console.log(this.state.modal)
    }
    handleOnCloseClick() {
        const modal = document.getElementById('myModal');
        modal.style.display = "none";

        this.setState({modal: null});
    }

    render() {
        if (this.state.data[0]) {
            let totalPreviousViewTime = 0;
            console.log(this.props)
            return(
                <div className="session-info">
                    {this.state.modal ? <PopupModal data={this.state.modal} onCloseClick={this.handleOnCloseClick} /> : null}
                    <div className="session-user-device-info">
                        <div className="session-info-block ">
                            <div>User ID: <span>{this.state.data[0].userID}</span></div>
                            <div>Site ID: <span>{this.state.data[0].siteID}</span></div>
                            <div>Site domain: <span>{this.state.data[0].domain}</span></div>
                            <div>Enter path: <span>{this.state.data[0].path}</span></div>
                            <div>Session Data: <span>{this.state.data[0].timestamp}</span></div>
                        </div>
                        <div className="session-info-block ">
                            <div>Users browser: <span>{JSON.parse(this.state.data[0].userDevice).browserName}</span></div>
                            <div>Users browser version: <span>{JSON.parse(this.state.data[0].userDevice).browserVersion}</span></div>
                            <div>User agent: <span>{JSON.parse(this.state.data[0].userDevice).userAgent}</span></div>
                        </div>
                    <hr className="paths-separator" />
                    </div>
                    <div className="session-path-details">
                        {this.state.data.map((element, index, array) => {
                            if(index) {
                                totalPreviousViewTime += array[index-1].singleViewTime;
                            }
                            return ( 
                                <div className="session-path-details-block">
                                    <PathDetails data={element} clickHandler={this.handleOnClick} previousViewTime={totalPreviousViewTime} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        return (
            <h4> Loading... if it takes too long please refresh site.</h4>
        );
    }
}

export default SessionDetails;