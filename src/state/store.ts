import {applyMiddleware, combineReducers, createStore} from "redux";
import {TaskActionsType, tasksReducer} from "./tasks-reducer";
import {TodolistActionsType, todoListsReducer} from "./todolists-reducer";
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import {AppActionsType, appReducer} from "./app-reducer";
import {LoginActionsType} from "./auth-reducer";


const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
})

type RootActionsType =
    | TaskActionsType
    | TodolistActionsType
    | AppActionsType
    | LoginActionsType
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionsType>


export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store