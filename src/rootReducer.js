import {combineReducers} from 'redux'
import bookinfo from './reducers/bookinfo'
import auth from './reducers/auth'
import payment from './reducers/payment'
import projects from './reducers/projects'

export default combineReducers({bookinfo,auth,payment,projects})