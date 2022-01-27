import axios from 'axios';
import {setStorage, removeStorage} from  '../utils/helper'
import {LOCAL_STORAGE_EXPIRE} from  '../define'
import {SET_CURRENT_USER, UPDATE_STYLE_CODE, ADD_STYLE_CODE,SET_DATA_BOOKING,RESET_BOOKING_INFO} from './types';
import setAuthorizationToken from '../utils/setAuthorizationToken';

export const API_URL = process.env.API_URL;


export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function updateStyleCode(stylecode) {
    return {
        type: UPDATE_STYLE_CODE,
        stylecode
    };
}

export function logout() {
    return dispatch => {


        localStorage.removeItem('access_token');
        localStorage.removeItem('access_token_expiresIn');
        localStorage.removeItem('bookinfo');
        localStorage.removeItem('bookinfo_expiresIn');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));

        dispatch({
            type: RESET_BOOKING_INFO
        })
    }
}


export function filterUserData(data) {
    let {isVerified,favoritePhotographers,name, location, phoneNumber, emailId, profilePicURL, photoseshTypeList, eventList, referralCode, styleCodes, isStyleCodeAdmin, shareURL , shareText,_id } = data;
    return {
        _id,
        name,
        location,
        phone: phoneNumber,
        email: emailId,
        profilePicURL,
        photoseshTypeList,
        isVerified,
        eventList,
        referralCode,
        styleCodes,
        isStyleCodeAdmin,
        shareURL ,
        shareText,
        favoritePhotographers
    }
}

export function login(data) {
    return axios.post(API_URL + '/user/login', data)
}


export function verifyToken() {
    return axios.get(API_URL + '/user/verify-token')
}

export function agentFetch() {
    return axios.get(API_URL + '/user/verify-token')
}


export function resetPassword(email) {
    return axios.post(API_URL + '/user/forgetPassword/' + email)
}
export function agentLogin(data) {
    return axios.post(API_URL + '/serviceProvider/agentLogin', data)
}
export function fetchBookingAttachment(id) {
    return axios.get(API_URL + '/serviceProvider/fetchBookingAttachment/'+id)
}

export function verifyUserFb(data) {
    return axios.post(API_URL + '/fb/verifyUserFb',data)
}
export function verifyUserGoogle(data) {
    return axios.post(API_URL + '/auth/verifyUserGoogle',data)
}


export function verifyLoginAs(data) {
    return axios.get(API_URL + '/verifyTokenLoginAsCustomer', data)
}
export function resendEmailVerify(email) {
    return axios.post(API_URL + '/user/resendEmailVerify/' + email)
}

export function setToken(token, user) {
    return dispatch => {
        setStorage('access_token', token, parseInt(LOCAL_STORAGE_EXPIRE));
        setAuthorizationToken(token);
        dispatch(setCurrentUser(user));
    }
}
