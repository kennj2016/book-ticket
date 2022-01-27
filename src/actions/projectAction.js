import axios from 'axios';
import {SET_PROJECTS,SET_FILTER_STATUS,SET_SHOW_MODE,SET_FILTER_TYPE} from './types'
import {UTC_OFFSET} from '../define'

const API_URL = process.env.API_URL;

export function getBookings (offset = UTC_OFFSET) {
   return axios.get(API_URL + '/booking/user/getAllAppointments',
        {
            params:{offset}
        })
};

export function setBookings (data)  {
    return dispatch => dispatch({
        type:SET_PROJECTS,
        data
    });
}

export function updateBooking(id,data) {
    return axios.put(API_URL + '/booking/' + id,data)
}

export function cancelBooking(id) {
    return axios.put(API_URL + '/booking/user/cancelAppointment/' + id ,
    {},
    {
        params:{offset:UTC_OFFSET}
    })
}
export function addExtraTime(appointmentId,extraTime) {
    return axios.put(API_URL + '/booking/addExtraTime/' + appointmentId ,
    {extraTime})
}

export function tipAgent(agentId,amount) {
    console.log(agentId,amount);
    return axios.put(API_URL + '/booking/tip',{agentId,amount})
}
export function reviewBooking(appointmentId,rate,comments,isNow) {

    return axios.post(API_URL + '/user/reviewByUser',{

        appointmentId: appointmentId,
        ratingStars :rate,
        isNow :isNow,
        comments:comments

    })
}

export function setFilterStatus(status) {
    return dispatch => {
        dispatch({
            type:SET_FILTER_STATUS,
            status
        });
    }
}
export function setFilterType(type) {
    return dispatch => {
        dispatch({
            type:SET_FILTER_TYPE,
            filter_type:type
        });
    }
}


export function reloadBookings(store,data) {
    store.dispatch({
        type:SET_PROJECTS,
        data
    });
}


export function setShowMode(mode) {
    return dispatch => {
        dispatch({
            type:SET_SHOW_MODE,
            mode
        });
    }

}