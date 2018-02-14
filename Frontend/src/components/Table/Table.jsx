import * as React from 'react';

import './table.css';

const Table = ({ type, data, clickHandler }) => {

    if (type === 'navigationTiming') {
        let tdFields = [], navigationStartPoint;
        for(let key in data) {
            if(key === 'navigationStart') {
                navigationStartPoint = data[key];
            }
            tdFields.push(<tr><td>{key}</td><td>{data[key] ? data[key] - navigationStartPoint : 0} ms</td></tr>)
        }
        return (
            <div>
                <div>
                    <h2>Informations from Navigation Timing.</h2>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Field name</th>
                                    <th>Value in ms counted from 'navigationStart'</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tdFields}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'resourceTiming') {
        let rows = [];
        data.map((element) => {
            if(element.name !== 'first-paint' && element.name !== 'first-contentful-paint' && element.initiatorType !== 'navigation' && !element.name.includes("tracker")) {
                rows.push(
                    <tr key={element.name} onClick={() => clickHandler(element)}>
                        <td>{element.name}</td>
                        <td>{element.initiatorType}</td>
                        <td>{Math.round(parseFloat(element.startTime) * 10 ) / 10}</td>
                        <td>{Math.round(parseFloat(element.responseEnd) * 10 ) / 10}</td>
                        <td>{Math.round(parseFloat(element.duration) * 10 ) / 10}</td>
                    </tr>    
                );
            }
        });
        if(rows.length !== 0) {
            return (
                <div>
                    <h2>Informations from Resource Timing (click for details).</h2>
                    <div className="table">
                        <table className="clickable">
                            <thead>
                                <tr>
                                    <th>Resource name</th>
                                    <th>Initiator type</th>
                                    <th>Start time [ms]</th>
                                    <th>Response end [ms]</th>
                                    <th>Duration [ms]</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
    if (type === 'xhrProxy') {
        let rows = [];
        data.map((element) => {
            rows.push(
                <tr key={element[0]}>
                <td className={"error-row"}>{element[0]}</td>
                <td className={"error-row"}>{element[1]}</td>
                <td className={"error-row"}>{new Date(element[2]).toLocaleString()}</td>
                <td className={"error-row"}>{element[3]}</td>
            </tr>  
            )
        })
        if(rows.length !== 0) {
            return (
                <div>
                <h2>Informations about XHR resources problems.</h2>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Resource URL</th>
                                <th>Time</th>
                                <th>Problem type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
            )
        } else {
            return null;
        }
    }
    if (type === 'errors') {
        let rows = [];
        data.map((element) => {
            rows.push(
                <tr key={element.type}>
                <td className={"error-row"}>{element.type}</td>
                <td className={"error-row"}>{element.message}</td>
                <td className={"error-row"}>{element.target}</td>
            </tr>  
            )
        })
        if(rows.length !== 0) {
            return (
                <div>
                <h2>Informations about errors.</h2>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Error type</th>
                                <th>Message</th>
                                <th>Target</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
            )
        } else {
            return null;
        }
    }
    if (type === 'loadTimes') {
        let rows = [];
        for(let key in data.times) {
                rows.push(
                    <tr key={data.times[key]}>
                        <td className={"error-row"}>{key}</td>
                        <td>{data.times[key].min}</td>
                        <td>{data.times[key].max}</td>
                        <td>{Math.round(parseFloat(data.times[key].average) * 10000 ) / 10000}</td>
                        <td>{data.times[key].counter}</td>
                    </tr>  
                )
        }
        if(rows.length !== 0) {
            return (
                <div>
                <h4>Informations about time load of different paths.</h4>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Path</th>
                                <th>Min time load [s]</th>
                                <th>Max time load [s]</th>
                                <th>Average time load [s]</th>
                                <th>Number of enters</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
            )
        } else {
            return null;
        }
    }
    if (type === 'errorsSummary') {
        let rows = [];
        data.map((element) => {
            let numberXhrErrors = 0, numberOtherErorrs = 0;
            if(element.xhrProxy !== '[]') {
                numberXhrErrors = JSON.parse(element.xhrProxy).length;
            }
            if(element.errors !== '[]') {
                numberOtherErorrs = JSON.parse(element.errors).length;
            }
                rows.push(
                    <tr key={element.siteID} onClick={() => clickHandler(element)}>
                        <td>{element.siteID}</td>
                        <td>{element.path}</td>
                        <td>{element.timestamp}</td>
                        <td>{numberXhrErrors}</td>
                        <td>{numberOtherErorrs}</td>
                    </tr>  
                )
        })
        if(rows.length !== 0) {
            return (
                <div>
                <h4>Informations about errors (click for details).</h4>
                    <div className="table">
                        <table className="clickable">
                            <thead>
                                <tr>
                                    <th>Site ID</th>
                                    <th>Path</th>
                                    <th>Date</th>
                                    <th>XHR errors</th>
                                    <th>Other errors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
            </div>
            )
        } else {
            return null;
        }
    }

}

export default Table;