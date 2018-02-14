import { connect } from 'react-redux';
import * as overviewActions from '../actions/overviewActions';

import Overview from '../components/Overview/Overview';

const mapStateToProps = (state) => {
    return {
        overview: state.overview.overview,
        overviewErrors: state.overview.overviewErrors
    };
    
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadOverviewTimes: () => {
            dispatch(overviewActions.fetchOverviewTimes());
        },
        loadOverviewErrors: () => {
            dispatch(overviewActions.fetchOverviewErrors());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);

