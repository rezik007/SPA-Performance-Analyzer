import * as React from 'react';

import Table from '../Table/Table';

import './overview.css';

class Overview extends React.Component {
    constructor(props) {
        super(props);
        
        this.props.loadOverviewTimes();
        this.props.loadOverviewErrors();
        this.state = {
            errors: null,
            xhrProxy: null,
            description: null
        }
        this.siteTimePairs = {};
        this.onClickHandler = this.onClickHandler.bind(this);
        this.prepareTime = this.prepareTime.bind(this);
        this.getLoadTimes = this.getLoadTimes.bind(this);
    }

    getLoadTimes(data) {
        let loadTimes = {};        
        for(let i = 0; i < data.length; i++) {
                if(loadTimes[data[i].path] === undefined) {
                    loadTimes[data[i].path] = { max: 0, min: 99999999999, average: 0, counter:0 }
                }
                loadTimes[data[i].path].average += data[i].time;
                loadTimes[data[i].path].counter++;
                if(data[i].time > loadTimes[data[i].path].max) {
                    loadTimes[data[i].path].max = data[i].time;
                }
                if(data[i].time < loadTimes[data[i].path].min) {
                    loadTimes[data[i].path].min = data[i].time;
                }
            }
    
        for(let key in loadTimes) {
            loadTimes[key].average = loadTimes[key].average/loadTimes[key].counter;
        }
        return loadTimes;
    }
    prepareTime(data) {
        let site = null, timeSummary = [];
        data.map(element => {
            if(element.length != 0) {
                site = element[0].siteID;
                element.map(path => {
                        if(this.siteTimePairs[site] === undefined) {
                            this.siteTimePairs[site] = [];
                        }
                        this.siteTimePairs[site].push({
                            path: path.path,
                            time: path.timeLoad
                        });
                    
                })
            }
        });
        for(let property in this.siteTimePairs) {
            timeSummary.push({
                siteid: property,
                times: this.getLoadTimes(this.siteTimePairs[property])
            })
        }
        console.log('timeSummary', timeSummary);
        return timeSummary;
    }
        
    onClickHandler(errorsData) {
        this.setState({
            errors: null,
            xhrProxy: null,
            description: {
                siteId: errorsData.siteID,
                path: errorsData.path,
                date: errorsData.timestamp
            }
        })
        if(errorsData.errors !== '[]') {
            this.setState({errors: JSON.parse(errorsData.errors)});
        }
        if(errorsData.xhrProxy !== '[]') {
            this.setState({xhrProxy: JSON.parse(errorsData.xhrProxy)});
        }
        const errorTables = document.getElementsByClassName('errors-tables')[0];
        errorTables.style.display = "block";
        window.scrollTo(0, document.getElementsByClassName('clickable')[0].offsetTop);
        
    }
    render() {
        let loadTimes = [];
        this.siteTimePairs = {};
        if(this.props.overview !== null && this.props.overviewErrors !== null ) {
            loadTimes = this.prepareTime(this.props.overview);
            // const uniqueSites = [... new Set(this.props.overview.map(item => item.map(inner => inner.siteID)))];
            // for(let i = 0; i < uniqueSites.length; i++) {
            //     loadTimes.push({siteId: uniqueSites[i], times: this.prepareLoadTimes(uniqueSites[i])});
            // }
            return (
                <div>
                    <h2>Load times summary.</h2>
                    {loadTimes.map((element) => {
                        console.log('ELEMENT', element)
                        return (
                            <div>
                                <h3>Site ID: {element.siteid}</h3>
                                <Table type={'loadTimes'} data={element} />
                            </div>
                        )
                    })}
                    <h2>Overall errors summary.</h2>
                    <div className="content-divs">
                        <div>
                            <Table type={'errorsSummary'} data={this.props.overviewErrors} clickHandler={this.onClickHandler} />                    
                        </div>
                        <div className="errors-tables">
                            {this.state.description ? <div><p className={"errors-description"}>Site ID: {this.state.description.siteId}, </p>
                            <p className={"errors-description"}>path: {this.state.description.path},</p>
                            <p className={"errors-description"}>date: {this.state.description.date}</p></div> : null}
                            {this.state.errors ? <Table type={'errors'} data={this.state.errors} /> : null }
                            {this.state.xhrProxy ? <Table type={'xhrProxy'} data={this.state.xhrProxy} /> : null }
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <h4> Loading... if it takes too long please refresh site.</h4>
        );
    }
}
export default Overview;