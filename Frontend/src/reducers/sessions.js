import * as actionTypes from '../constants/actionTypes';

const initialState = {
    sessions: [],
    singleSession: []
};

export const session = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SESSIONS_LIST_LOAD:
            return {
                ...state,
                sessions: action.data
            };
        case actionTypes.SINGLE_SESSION_LOAD:
        return {
            ...state,
            singleSession: action.sessionData
        };
        default:
            return state;
    }
};
