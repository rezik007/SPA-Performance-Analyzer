import { connect } from 'react-redux';
import * as usersSessionsActions from '../actions/usersSessions';
import SessionDetails from '../components/SessionDetails/SessionDetails';

const mapStateToProps = (state) => {
    return {
        singleSession: state.session.singleSession,
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

export default connect(mapStateToProps, mapDispatchToProps )(SessionDetails);

