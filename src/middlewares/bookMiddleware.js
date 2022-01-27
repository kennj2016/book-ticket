import * as crypt from '../utils/crypt'
import {SET_DATA_BOOKING,REMOVE_DATA_BOOKING} from '../actions/types'
import {setStorage,removeStorage} from '../utils/helper'
import {LOCAL_STORAGE_EXPIRE} from '../define'
export default store => next => action => {
    const { type } = action;

    if (type === SET_DATA_BOOKING) {
        let data_booking =  action.data
        setStorage('bookinfo', crypt.encodeUtf8(JSON.stringify(data_booking)) ,parseInt(LOCAL_STORAGE_EXPIRE));
    }
    else if (type === REMOVE_DATA_BOOKING) {
        removeStorage('bookinfo');
    }

    next(action);

}