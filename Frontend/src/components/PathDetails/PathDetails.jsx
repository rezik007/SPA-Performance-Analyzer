import * as React from 'react';

import Table from '../Table/Table';
import DomChangesPreview from '../DomChangesPreview/DomChangesPreview';
import NavigationChart from '../NavigationChart/NavigationChart';

import './pathDetails.css';

const PathDetails = ({ data, clickHandler, previousViewTime }) => {
    console.log(data)
    let navigationTimingData = null, resourceTimingData = null, errors = null, xhrProxy = null, domChanges, highestTime = 0;
    if(data.navigationTiming !== 'null') {
        navigationTimingData = JSON.parse(data.navigationTiming);
    }
    if(data.resourceTiming !== 'null') {
        resourceTimingData = JSON.parse(data.resourceTiming);
    }
    if(data.errors !== 'null') {
        errors = JSON.parse(data.errors);
    }
    if(data.xhrProxy !== 'null') {
        xhrProxy = JSON.parse(data.xhrProxy);
    }
    if(data.domTimeChanges !== 'null') {
        domChanges = JSON.parse(data.domTimeChanges);
    }

    const findLastResource = () => {
        let highestTime = 0;
        resourceTimingData.map((element) => {
            if(element.name !== 'first-paint' && element.name !== 'first-contentful-paint' && element.initiatorType !== 'navigation' && !element.name.includes("tracker")) {
                if(element.responseEnd >= highestTime) {
                    highestTime = element.responseEnd - previousViewTime;
                }
            }
        })
        return highestTime;
    }
    return (
        <div className="path-info">
            <div className="general-info">
                <div className="general-info-label">Complete URL: <span>{data.domain + data.path}</span></div>
                {data.singleViewTime ? <div className="general-info-label">Page view time: <span>{data.singleViewTime/1000} s</span></div> : ''}
                {resourceTimingData ? <div className="general-info-label">Page time load (loaded all additional resources): <span>{(Math.round(parseFloat(findLastResource()) * 10)/10000)} s</span></div> : ''}
            </div>
            <div className="content-divs">
                <div className="tables-content">
                    {navigationTimingData ? <Table type={'navigationTiming'} data={navigationTimingData} /> : null}
                    {resourceTimingData ? <Table type={'resourceTiming'} data={resourceTimingData} clickHandler={clickHandler} /> : null }
                    {errors ? <Table type={'errors'} data={errors} /> : null }
                    {xhrProxy ? <Table type={'xhrProxy'} data={xhrProxy} /> : null }
                </div>
                {domChanges ? 
                <div className="dom-changes-content">
                    <h2>Dom changes in time.</h2>
                    <DomChangesPreview data={domChanges} />
                </div> : <div id="chart-container"><NavigationChart data={navigationTimingData} /></div> }
            </div>
            <hr className="paths-separator" />
        </div>
    )
}
export default PathDetails;