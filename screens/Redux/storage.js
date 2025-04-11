import { createStore } from "redux";
import { Reduceres, rootReducer} from "./reducer";
import { randomNumberReducer } from "./reducer";
export const myStore=createStore(rootReducer);