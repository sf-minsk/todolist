import {authAPI} from "../api/todolists-api";
import {AppThunkType} from "./store";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import { loginAC } from "./auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'app/SET-STATUS':
            return {...state, status: action.status}
        case "app/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "app/SET-IS-INITIALIZED": {
            return {...state, isInitialized: true}
        }
        default:
            return state
    }
}

// Action Creators
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'app/SET-STATUS',
    status,
} as const)
export const setAppErrorAC = (error: string | null) => ({
    type: 'app/SET-ERROR',
    error
} as const)
export const initializeAppAC = () => ({
    type: 'app/SET-IS-INITIALIZED'
} as const)


//THUNK
export const initializeAppTC = (): AppThunkType => async dispatch => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(loginAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch (initializeAppAC())
    }
}


// Types
export
type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof initializeAppAC>