import * as actionTypes from '../constants/actionTypes';
import { apiUrl } from '../constants/config';
import 'isomorphic-fetch';

export const loadSessions = (data) => ({
    type: actionTypes.SESSIONS_LIST_LOAD,
    data: data
});
export const loadSingleSession = (data) => ({
  type: actionTypes.SINGLE_SESSION_LOAD,
  sessionData: data
});

export const fetchAllSessions = () => {
  return (dispatch) => {
    return fetch(apiUrl + '/users_sessions', { method: 'GET'})
          .then( response => Promise.all([response, response.json()]))
          .then(([response, json]) =>{
                if(response.status === 200){
                  dispatch(loadSessions(json))
                }
                else{
                //dispatch(fetchPostsError())
                }
    })
  }
}

export const fetchSessionDetails = (id) => {
    return (dispatch) => {
    return fetch(apiUrl + '/session/' + id, { method: 'GET'})
          .then( response => Promise.all([response, response.json()]))
          .then(([response, json]) =>{
                if(response.status === 200){
                  dispatch(loadSingleSession(json))
                }
                else{
                //dispatch(fetchPostsError())
                }
    })
  }
}

