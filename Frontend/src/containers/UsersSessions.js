import { connect } from 'react-redux';
import * as usersSessionsActions from '../actions/usersSessions';

import UsersSessions from '../components/UsersSessions/UsersSessions';

const mapStateToProps = (state) => {
    return {
        sessions: state.session,
    };
    
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSessions: () => {
            dispatch(usersSessionsActions.fetchAllSessions());
        },
        loadSessionDetails: (id) => {
            dispatch(usersSessionsActions.fetchSessionDetails(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSessions);

