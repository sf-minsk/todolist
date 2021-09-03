import {authAPI} from "../api/todolists-api";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {loginAC} from "./auth-reducer";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null}>) {
            state.error = action.payload.error
        },
        initializeAppAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer
//     (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'app/SET-STATUS':
//             return {...state, status: action.status}
//         case "app/SET-ERROR": {
//             return {...state, error: action.error}
//         }
//         case "app/SET-IS-INITIALIZED": {
//             return {...state, isInitialized: true}
//         }
//         default:
//             return state
//     }
// }

export const {setAppStatusAC} = slice.actions
export const {setAppErrorAC} = slice.actions
export const {initializeAppAC} = slice.actions

// Action Creators
// export const setAppStatusAC = (status: RequestStatusType) => ({
//     type: 'app/SET-STATUS',
//     status,
// } as const)
// export const setAppErrorAC = (error: string | null) => ({
//     type: 'app/SET-ERROR',
//     error
// } as const)
// export const initializeAppAC = () => ({
//     type: 'app/SET-IS-INITIALIZED'
// } as const)


//THUNK
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(loginAC({isLoggedIn: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch(initializeAppAC({isInitialized: true}))
    }
}


// Types
// export
// type AppActionsType =
//     | ReturnType<typeof setAppStatusAC>
//     | ReturnType<typeof setAppErrorAC>
//     | ReturnType<typeof initializeAppAC>