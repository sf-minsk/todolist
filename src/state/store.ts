import {combineReducers} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todoListsReducer} from "./todolists-reducer";
import thunkMiddleware from 'redux-thunk'
import {appReducer} from "./app-reducer";
import {authReducer} from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
})


export type AppRootStateType = ReturnType<typeof rootReducer>
// export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionsType>



//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

// @ts-ignore
window.store = store