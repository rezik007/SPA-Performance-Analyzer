import * as actionTypes from '../constants/actionTypes';

const initialState = {
    overview: null,
    overviewErrors: null
};

export const overview = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OVERVIEW_TIMES_LOAD:
            return {
                ...state,
                overview: action.data
            };
        case actionTypes.OVERVIEW_ERRORS:
            return {
                ...state,
                overviewErrors: action.data
            }
        default:
            return state;
    }
};
