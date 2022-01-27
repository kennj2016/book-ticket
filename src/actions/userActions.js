import axios from "axios";

import {
  ADD_STYLE_CODE,
  DELETE_STYLE_CODE,
  SET_FAVORITE_PHOTOGRAPHERS,
} from "./types";

const API_URL = process.env.API_URL;

export function userSignupRequest(userData) {
  return axios({
    method: "post",
    url: API_URL + "/user/register",
    data: userData,
  });
}

export function addStyleCode(data) {
  return axios({
    method: "post",
    url: API_URL + "/user/addStyleCode",
    data,
  });
}

export function downloadCollectionBooking(data) {
  return axios({
    method: "POST",
    url: API_URL + `/downloadCollectionBooking`,
    data,
  });
}

export function likeImageCollectionBooking(data) {
  return axios({
    method: "POST",
    url: API_URL + `/collection/likeImageCollection`,
    data,
  });
}

export function unlikeImageCollectionBooking(data) {
  return axios({
    method: "POST",
    url: API_URL + `/collection/unlikeImageCollection`,
    data,
  });
}

export function getArrayLikeImageCollection(data) {
  return axios({
    method: "GET",
    url:
      API_URL +
      `/collection/getArrayLikeImageCollection?collectionId=${data.collectionId}&email=${data.email}`,
    data,
  });
}
export function getAllCollectionFavorite(data) {
  console.log(data);
  return axios({
    method: "GET",
    url:
      API_URL +
      `/collection/getAllCollectionFavourites?collectionIds=${JSON.stringify(
        data.collectionIds
      )}&email=${data.email}`,
    data,
  });
}
export function downloadSingleImageByUrl(url) {
  return axios({
    method: "GET",
    url: API_URL + `/responseImage?url=${url}`,
  });
}

export function updateListStyleCodesInRedux(type, styleCode) {
  return {
    type,
    styleCode,
  };
}

export function updateRoute(route) {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_ROUTE",
      route,
    });
  };
}

export function updateStyleCode(id, data) {
  return axios({
    method: "put",
    url: API_URL + "/user/updateStyleCode/" + id,
    data,
  });
}

export function deleteStyleCode(id) {
  return (dispatch) => {
    axios({
      method: "put",
      url: API_URL + "/user/deleteStyleCode",
      data: { id },
    }).then((res) => {
      dispatch({
        type: DELETE_STYLE_CODE,
        id,
      });
    });
  };
}

export function saveNewStyleCode(styleCode) {
  return (dispatch) =>
    dispatch({
      type: ADD_STYLE_CODE,
      styleCode,
    });
}

export function getStyleCodes() {
  return axios({
    method: "get",
    url: API_URL + "/user/getAllStyleCodes",
  });
}

export function searchStyleCodes(keyword) {
  return axios({
    method: "get",
    url: API_URL + "/user/searchStyleCodes?keyword=" + keyword,
  });
}

export function updateProfile(data) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  return axios.post(API_URL + "/user/updateProfile", data, config);
}

export function uploadAttachments(data) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  return axios.post(API_URL + "/booking/uploadAttachments", data, config);
}

export function changePassword(data) {
  return axios.put(API_URL + "/user/changePassword", data);
}

export function likePhotographer(data) {
  return axios.put(API_URL + "/user/feelingPhotographer", data);
}

export function updateFavoritePhotographerInRedux(photographerId, isLike) {
  return (dispatch) =>
    dispatch({
      type: SET_FAVORITE_PHOTOGRAPHERS,
      photographerId,
      isLike,
    });
}

export function getAllTours() {
  return axios.get(API_URL + "/getStepToursPublic", {
    params: { webtype: "NORMAL" },
  });
}

export function getWelcomeTextMessage() {
  return axios.get(API_URL + "/getWelcomeTextMessage", {
    params: { webtype: "NORMAL" },
  });
}
