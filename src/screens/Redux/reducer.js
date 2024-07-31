import { combineReducers } from "redux";
import {  ADD_ITEM, GENERATE_RANDOM_NUMBER, REMOVE_ITEM } from "./actionsTypes";


export const Reduceres = (state = [], action) => {
    switch (action.type) {
        case ADD_ITEM:

            return [...state, action.payload];

        case REMOVE_ITEM:

            const deleteArry = state.filter((item, index) => {
                return (index !== action.payload)
            });
            return deleteArry;

        default:

            return state;

    }

}

const initialState = {
    randomNumber: null,
};

export const RandomNumberReducer = (state = initialState, action) => {
    switch (action.type) {
        case GENERATE_RANDOM_NUMBER:
            return { ...state, randomNumber: action.payload };
        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    main: Reduceres,
    randomNumber: RandomNumberReducer,
});