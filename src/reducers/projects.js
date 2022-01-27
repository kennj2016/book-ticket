import { SET_PROJECTS,SET_SHOW_MODE,SET_FILTER_STATUS,SET_FILTER_TYPE } from '../actions/types';
import { GRID,LIST,STATUS} from '../define';

const initialState = {
    bookings: [],
    bookings_type: {},
    show_mode:LIST,
    active_status:STATUS['ALL'],
    active_type:'upcoming'
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_PROJECTS       : return {...state,bookings:action.data};
    case SET_SHOW_MODE      : return {...state,show_mode:action.mode};
    case SET_FILTER_STATUS  : return {...state,active_status:action.status};
    case SET_FILTER_TYPE    : return {...state,active_type:action.filter_type};
    default: return state;
  }
}

