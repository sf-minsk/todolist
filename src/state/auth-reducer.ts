import {authAPI, LoginPayloadType} from "../api/todolists-api";
import {setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk<{isLoggedIn: boolean},LoginPayloadType, {
    rejectValue: {errors: Array<string>, fieldsErrors?: Array<{field: string; error: string}>}
}>('auth/loginTC', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error: AxiosError = e
        handleNetworkAppError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    }
})


// export const logoutTC = createAsyncThunk('auth/logoutTC', async (thunkAPI) => {
//     thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         const res = await authAPI.logout()
//         if (res.data.resultCode === 0) {
//             thunkAPI.dispatch(loginAC({isLoggedIn: true}))
//         } else {
//             handleServerAppError(res.data, thunkAPI.dispatch)
//         }
//     } catch (e) {
//         handleNetworkAppError(e, thunkAPI.dispatch)
//     } finally {
//         thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
//     }
// })


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        loginAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
export const {loginAC} = slice.actions

// THUNK creators
export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(loginAC({isLoggedIn: false}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}