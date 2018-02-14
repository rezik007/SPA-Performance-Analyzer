import * as React from 'react';

import './popupModal.css';

const PopupModal = ({ data, onCloseClick }) => {
    const isNumeric = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
            console.log(data)
            let rows = [];
            for(let key in data) {
                if(isNumeric(data[key])) {
                    data[key] = Math.round(data[key] *10)/10
                }
                rows.push(<tr><td>{key}</td><td>{data[key]}</td></tr>)
            }
    return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCloseClick}>&times;</span>
            <div>
                <h3>Details about: <i>{data.name}</i></h3>
                <div className="modal-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Field name</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        
        </div>
    )
}

export default PopupModal;