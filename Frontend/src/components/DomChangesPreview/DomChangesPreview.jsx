import * as React from 'react';

import './domChangesPreview.css';

const DomChangesPreview = ({ data }) => {
    return (
        <div>
            <div className="dom-changes-description">Node name  - class - appear time after enter </div>
            <ul>
            {data.map((element) => {
                return (
                        <li className="dom-changes-list-element">{element.nodeName} - "{element.className}" - {element.timeAfterEnter} ms</li>
                )
            })}
            </ul>
        </div>
    )
}
export default DomChangesPreview;