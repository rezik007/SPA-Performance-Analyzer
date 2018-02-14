import * as actionTypes from '../constants/actionTypes';
import { apiUrl } from '../constants/config';
import 'isomorphic-fetch';

export const loadOverviewTime = (data) => ({
    type: actionTypes.OVERVIEW_TIMES_LOAD,
    data: data
});

export const fetchOverviewTimes = () => {
  return (dispatch) => {
    return fetch(apiUrl + '/overview/loadTimes', { method: 'GET'})
          .then( response => Promise.all([response, response.json()]))
          .then(([response, json]) =>{
                if(response.status === 200){
                  dispatch(loadOverviewTime(json))
                }
                else{
                //dispatch(fetchPostsError())
                }
    })
  }
}

export const loadOverviewErrors = (data) => ({
  type: actionTypes.OVERVIEW_ERRORS,
  data: data
});

export const fetchOverviewErrors = () => {
return (dispatch) => {
  return fetch(apiUrl + '/overview/errors', { method: 'GET'})
        .then( response => Promise.all([response, response.json()]))
        .then(([response, json]) =>{
              if(response.status === 200){
                dispatch(loadOverviewErrors(json))
              }
              else{
              //dispatch(fetchPostsError())
              }
  })
}
}
