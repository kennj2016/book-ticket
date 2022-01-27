import {
    INIT_SET_PHOTOGRAPHER_REQUEST,
    REMOVE_DATA_BOOKING,
    RESET_BOOKING_INFO,
    SET_BOOKTYPE,
    SET_CURRENT_STEP,
    SET_DATA_BOOKING,
    SET_DATE_BOOKING,
    SET_EVENT_LIST,
    SET_PHOTOGRAPHER,
    SET_PHOTOGRAPHERS,
    SET_PHOTOSESH_EVENT_TYPE,
    SET_PHOTOSESH_TYPE_NAME,
    SET_TIME_BOOKING,
    SET_SMART_MATCH
} from './types'
import axios from 'axios'
import qs from 'querystring'

const API_URL = process.env.API_URL

export function setTimeBooking(data) {
    return dispatch => {
        dispatch({
            type: SET_TIME_BOOKING,
            data
        })
    }
}

export function setDateBooking(data) {
    return dispatch => {
        dispatch({
            type: SET_DATE_BOOKING,
            data
        })
    }
}

export function setDataBooking(data) {
    return dispatch => {
        dispatch({
            type: SET_DATA_BOOKING,
            data
        })
    }
}

export function removeBookingInfo() {
    return dispatch => {
        dispatch({
            type: REMOVE_DATA_BOOKING
        })
    }
}

export function setPhotographers(photographers) {
    return dispatch => {
        dispatch({
            type: SET_PHOTOGRAPHERS,
            photographers
        })
    }
}

export function initSetPhotographerForRequest(photographerIds) {
    return dispatch => {
        dispatch({
            type: INIT_SET_PHOTOGRAPHER_REQUEST,
            photographerIds: photographerIds
        })
    }
}


export function setCurrentStep(current) {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_STEP,
            current
        })
    }
}

export function setSmartMatch(value) {
    return dispatch => {
        dispatch({
            type: SET_SMART_MATCH,
            value
        })
    }
}


export function setPhotographerForRequest(photographerId) {

    axios.put(API_URL + '/user/toggleLikePhotographer', {photographerId})


    return dispatch => {
        dispatch({
            type: SET_PHOTOGRAPHER,
            photographer_id: photographerId
        })
    }
}

export function resetBookingInfo(photographer_id) {
    return dispatch => {
        dispatch({
            type: RESET_BOOKING_INFO
        })
    }
}

export function prepareTypeDataBooking(data) {
    return {
        type: SET_DATA_BOOKING,
        data
    }
}

export function getBookingCornerbookNow(data) {
    return axios.get(API_URL + '/bookingCorner/user/photoSeshNow?' + qs.stringify(data))
}

export function addMorePhotographerIntoRequest(data) {
    return axios.post(API_URL + '/bookingCorner/addMorePhotographerIntoRequest', data)
}

export function getChartitySetting() {
    return axios.get(API_URL + '/admin/getChartitySetting')
}

export function getStyleCodeIconSetting() {
    return axios.get(API_URL + '/admin/getInfoIconSetting')
}

export function getSmartMatchIconSetting() {
    return axios.get(API_URL + '/admin/getSmartMatchInfoSetting')
}

export function getBookingCornerBookLater(data) {
    return axios.get(API_URL + '/bookingCorner/user/photoSeshLater?' + qs.stringify(data))
}

export function postBooking(data) {
    const config = {
        headers: {'content-type': 'multipart/form-data'}
    }

    return axios.post(API_URL + '/bookingCorner/bookAppointmentRequestMultiple', data, config)
}

export function changeCardBooking(bookingId, paymentCardId) {
    return axios.put(API_URL + '/bookingCorner/user/changeCard/' + bookingId, {paymentCardId})
}


export function setBooktype(booktype) {
    return dispatch => {
        dispatch({
            type: SET_BOOKTYPE,
            data: booktype
        })
    }
}

export function getEventsList() {
    return axios.get(API_URL + '/getEvents')
}


export function setPhotoseshTypeName(photosesh_type_name) {
    return dispatch => {
        dispatch({
            type: SET_PHOTOSESH_TYPE_NAME,
            photosesh_type_name
        })
    }
}

export function setPhotoseshEventType(photosesh_event_type) {
    return dispatch => {
        dispatch({
            type: SET_PHOTOSESH_EVENT_TYPE,
            photosesh_event_type
        })
    }
}


export function setEventList(eventlist) {
    return dispatch => {
        dispatch({
            type: SET_EVENT_LIST,
            data: eventlist
        })
    }
}

export function getAllCharities() {
    return axios.get(API_URL + '/user/get-charities')
}

export function getAgentProfile(agentId) {
    return axios.get(API_URL + '/user/getAgentProfile', {
        params: {
            agentId
        }
    })
}

export function getCollectionsBooking(bookingId) {
    return axios.get(API_URL + '/booking/user/getCollectionsBooking', {
        params: {
            bookingId
        }
    })
}

export function getBaseInfoBooking(bookingId) {
    return axios.get(API_URL + '/booking/user/getBaseInfoBooking', {
        params: {
            bookingId
        }
    })
}

export function getImageByCategory(query) {
    return axios.get(API_URL + `/collection/getImageFavoriteByCategory?collectionId=${query.collectionId}&category=${query.category}`)
}

export function updatePinCode(bookingId, pin) {
    return axios.post(API_URL + '/appointment/updateCodePinGallery', {
        bookingId,
        codePin: pin
    });
}

export function addCategory(data) {
    return axios.post(API_URL + '/appointment/createCategoryFavorite', data);
}
