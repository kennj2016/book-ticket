import {setCurrentUser,verifyToken} from '../actions/authActions'
import {prepareTypeDataBooking} from '../actions/bookActions'
import setAuthorizationToken from '../utils/setAuthorizationToken'

import {removeStorage,getStorage} from './helper'


import * as crypt from './crypt'



export default function (store) {
    try {

        if (getStorage('access_token')) {

            setAuthorizationToken(getStorage('access_token'));

            verifyToken()
            .then(res=>{
                let user = res.data.data;
                 store.dispatch(setCurrentUser(user));
            },({response})=>{
                removeStorage('access_token');
                removeStorage('bookinfo');
                window.location.href = '/'
            })

        }


        if (getStorage('bookinfo')) {
            let data_booking = JSON.parse(crypt.decodeUtf8(getStorage('bookinfo')))
            store.dispatch(prepareTypeDataBooking(data_booking));
        }

        return;
    } catch (e) {
        // Unable to load or parse stored state, proceed as usual
    }
}