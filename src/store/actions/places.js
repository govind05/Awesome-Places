import { SET_PLACES, DELETE_PLACE_SUCCESS, PLACE_ADDED, START_ADD_PLACE} from './actionTypes';
import {uiStartLoading, uiStopLoading, authGetToken} from './index';

export const startAddPlace = ( ) => {
    return{
        type: START_ADD_PLACE
    }
}

export const addPlace = (placeName, location, image) => {
    return dispatch =>{
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid Token found!");
        })
        .then(token => {
            authToken = token;
            return fetch("https://us-central1-awesome-places-1515913378197.cloudfunctions.net/storeImage", {
                method: 'POST',
                body: JSON.stringify({
                    image: image.base64,
                }),
                headers:{
                    Authorization: "Bearer " + authToken
                }
            })
        })
        .catch(err => {
            console.log(err);
            alert('Something went wrong. In CLoud Please try again!!');
            dispatch(uiStopLoading());
        })
        .then(res => {
            if(res.ok){
                return res.json();
            }else{
                throw(new Error());
            }
        })
        .then(parsedRes => {
            console.log(parsedRes)
            const placeData = {
                name: placeName,
                location: location,
                image: parsedRes.imageUrl,
                imagePath: parsedRes.imagePath 
            };
            return fetch('https://awesome-places-1515913378197.firebaseio.com/places.json?auth=' + authToken, {
                method: 'POST',
                body: JSON.stringify(placeData)
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw (new Error());
            }
        })
        .then(parsedRes => {
            console.log(parsedRes)
            dispatch(uiStopLoading());
            dispatch(placeAdded());
            
        })
        .catch(err => {
            console.log(err);
            alert('Something went wrong. In firebase fetch Please try again!!');
            dispatch(uiStopLoading());
        });;
    };
};

export const placeAdded = () => {
    return{
        type: PLACE_ADDED
    }
}
export const getPlaces= () => {
    return dispatch => {
        dispatch(authGetToken())
        .then(token => {
            return fetch('https://awesome-places-1515913378197.firebaseio.com/places.json?auth=' +token)
        }) 
        .catch(() => {
            alert("No valid Token found!");
        })
        .then(res => res.json())
        .then(parsedRes => {
            const places = [];
            for (let key in parsedRes) {
                places.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    key: key
                });
            }
            dispatch(setPlaces(places))
        })
        .catch(err => {
            alert("something went wrong. please try again")
        });;
        
        
    }
}

export const setPlaces = places => {
    return{
        type: SET_PLACES,
        places: places
    }
};
export const deletePlaceSuccess = key => {
    return{
        type: DELETE_PLACE_SUCCESS,
        key: key
    }
}

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid Token found!");
        })
        .then(token => {
            return fetch('https://awesome-places-1515913378197.firebaseio.com/places/' + key + '.json?auth=' + token, {
                method: 'DELETE'
            })
        })
        .then( res => dispatch(deletePlaceSuccess(key)))
        .catch(err => {
            alert("something went wrong. please try again")
        })
    }
}
