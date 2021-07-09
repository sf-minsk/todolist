import {applyMiddleware, combineReducers, createStore} from "redux";
import {TaskActionsType, tasksReducer} from "./tasks-reducer";
import {TodolistActionsType, todoListsReducer} from "./todolists-reducer";
import thunkMiddleware, { ThunkAction } from 'redux-thunk'


const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
})

type AppActionsType =
    | TaskActionsType
    | TodolistActionsType
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>


export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store