import * as React from 'react';
import ReactDOM from 'react-dom';

import __Profiler from './profiler.jsx';

const NavigationChart= ({ data }) => { 
    let node = document.getElementById('chart-container');
    let chart = new __Profiler(data, node);
    window.onload = () => {
        node = document.getElementById('chart-container');
        let chart = new __Profiler(data, node);
        chart._init();
        console.log(chart._isEmpty())
    }
    

    
    return (            
            <div>
                {chart._init()}
            </div>
    );
    
}
export default NavigationChart;