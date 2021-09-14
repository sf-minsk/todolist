import {authAPI, LoginPayloadType} from "../api/todolists-api";
import {AppActionsType, setAppStatusAC} from "./app-reducer";
import {AppThunkType} from "./store";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type initialStateType = typeof initialState

export const authReducer = (state: initialStateType = initialState, action: LoginActionsType): initialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        default:
            return state
    }
}

//action creators
export const loginAC = (isLoggedIn: boolean) => ({
    type: 'login/SET-IS-LOGGED-IN',
    isLoggedIn,
} as const )

// THUNK creators
export const loginTC = (data: LoginPayloadType): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(loginAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const logoutTC = (): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(loginAC(false))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}



//types
export type LoginActionsType =
    | ReturnType<typeof loginAC>
    | AppActionsType