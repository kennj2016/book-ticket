import {SET_SMART_MATCH,INIT_SET_PHOTOGRAPHER_REQUEST,REMOVE_DATA_BOOKING,SET_PHOTOGRAPHERS,SET_BOOKTYPE, SET_EVENT_LIST,SET_PHOTOSESH_TYPE_NAME,SET_PHOTOSESH_EVENT_TYPE,SET_DATA_BOOKING,SET_TIME_BOOKING,SET_PHOTOGRAPHER,RESET_BOOKING_INFO,SET_DATE_BOOKING,SET_CURRENT_STEP} from '../actions/types'
import {NOW,TIME,LATER,DURATIONS} from '../define'
import {getTimeForBookNow} from '../utils/helper'
import moment from 'moment'

let indexTimeNear = (TIME.indexOf(getTimeForBookNow()) != '-1') ? TIME.indexOf(getTimeForBookNow()) : 0

const default_state = {
    book_type:LATER,
    info:{
        duration:DURATIONS[0],
        date:moment(),
        from:TIME[indexTimeNear],
        to:TIME[indexTimeNear+3],
        photosesh_type_name:'',
        photosesh_event_type:'',
        photographers_request:[],
        place:'',
        position:{}
    },
    currentStep:0,
    photographers:[],
    smart_match:false
}

export default function bookinfo(state = default_state,action = {}) {

    switch (action.type) {
        case SET_BOOKTYPE:
            return  {...state,book_type:action.data}
        case SET_CURRENT_STEP:
            return  {...state,currentStep:action.current}
        case SET_SMART_MATCH:
            return  {...state,smart_match:action.value}
        case SET_PHOTOGRAPHERS:
            return  {...state,photographers:action.photographers}
        case SET_PHOTOGRAPHER:
        {
            let {info} = state,
                {photographer_id} = action;

            if(info.photographers_request.indexOf(photographer_id) == '-1'){
                info.photographers_request.push(photographer_id)
            }else{
                info.photographers_request = info.photographers_request.filter( p => p != photographer_id)
            }
            return  {...state,info}
        }
        case INIT_SET_PHOTOGRAPHER_REQUEST:
        {
            let {info} = state,
                {photographerIds} = action;


            let newPhotographersRequest = [...photographerIds]

            console.log({newPhotographersRequest});
            info.photographers_request = newPhotographersRequest
            return  {...state,info}
        }

        case SET_TIME_BOOKING:
        {
            let {info} = state,
                {to,from} = action.data;

            info.to  = to
            info.from  = from
            return {...state,info}

        }
        case SET_DATE_BOOKING:
        {
            let {info} = state,
                {date} = action.data;

            info.date  = date
            return {...state,info}

        }
        case SET_DATA_BOOKING:
        {
            return {...state,...action.data}
        }
        case REMOVE_DATA_BOOKING:
        {
            return default_state
        }

        case SET_PHOTOSESH_TYPE_NAME:
        {
            let {info} = state
            info.photosesh_type_name  = action.photosesh_type_name
            return {...state,info}
        }

        case SET_PHOTOSESH_EVENT_TYPE:
        {
            let {info} = state
            info.photosesh_event_type  = action.photosesh_event_type
            return {...state,info}
        }
        case RESET_BOOKING_INFO:
        {
            let {info} = default_state
            info.photographers_request = []
            return {...default_state,info};
        }

        default:
            return state
    }

}