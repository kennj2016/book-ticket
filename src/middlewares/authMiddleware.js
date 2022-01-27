
import {SET_CURRENT_USER} from '../actions/types'
import {startPusherNotification} from '../HandleNotification'

export default store => next => action => {
    const { type ,user} = action;
    if (type === SET_CURRENT_USER && user) {
        startPusherNotification(store,user._id)
    }
    next(action);
}
