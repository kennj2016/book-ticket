import {SET_PHOTOGRAPHER,SET_FAVORITE_PHOTOGRAPHERS, SET_CURRENT_USER,UPDATE_STYLE_CODE,DELETE_STYLE_CODE,ADD_STYLE_CODE } from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  isAuthenticated: false,
  route:'/',
  user: {favoritePhotographers:[]}

};

export default (state = initialState, action = {}) => {
  switch(action.type) {

    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      };
    case 'UPDATE_ROUTE':
      return {
        ...state,
        route: action.route
      };

    case SET_FAVORITE_PHOTOGRAPHERS:
    {
      let new_state = {...state}

      if(action.isLike){
        new_state.user.unlikePhotographers = new_state.user.unlikePhotographers.filter(id=>id!=action.photographerId)
        new_state.user.favoritePhotographers.push(action.photographerId)
      }else{
        new_state.user.favoritePhotographers = new_state.user.favoritePhotographers.filter(id=>id!=action.photographerId)
        new_state.user.unlikePhotographers.push(action.photographerId)
      }
      return new_state
    }
    case ADD_STYLE_CODE:
    {
      let new_state = {...state}
      new_state.user.styleCodes.push(action.styleCode)
      return new_state
    }

    case UPDATE_STYLE_CODE:
    {
      let new_state = {...state}
      new_state.user.styleCodes =  new_state.user.styleCodes.map(item=>{
        if(item._id == action.styleCode._id){
          return action.styleCode
        }
        return item;
      })
      return new_state
    }
    case SET_PHOTOGRAPHER:
    {
      let {user} = state,
          {photographer_id} = action;

      if(user.favoritePhotographers.indexOf(photographer_id) == '-1'){
        user.favoritePhotographers.push(photographer_id)
      }else{
        user.favoritePhotographers = user.favoritePhotographers.filter( p => p != photographer_id)
      }
      return  {...state,user}
    }
    case DELETE_STYLE_CODE:
    {
      let new_state = {...state}
      new_state.user.styleCodes = new_state.user.styleCodes.filter(item=>item._id != action.id)
      return new_state
    }

    default: return state;
  }
}
