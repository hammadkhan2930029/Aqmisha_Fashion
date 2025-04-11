import { ADD_ITEM, GENERATE_RANDOM_NUMBER, REMOVE_ITEM } from "./actionsTypes";


export const Add_items = (user) => ({
    type: ADD_ITEM,
    payload: user,
});

export const RemoveItems = (index) => ({
    type: REMOVE_ITEM,
    payload: index,
});
export const generateRandomNumber = () => {
    // const randomNumber = Math.floor(Math.random() * 5000);
    const min = Math.pow(10, 7);
    const max = Math.pow(10, 10) - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return {
        type: GENERATE_RANDOM_NUMBER,
        payload: randomNumber,
    };
};