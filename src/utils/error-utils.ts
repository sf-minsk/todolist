import {ResponseType} from "../api/todolists-api";
import {AppActionsType, setAppErrorAC, setAppStatusAC} from "../state/app-reducer";
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some Error'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleNetworkAppError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC("failed"))
}

type ErrorUtilsDispatchType = Dispatch<AppActionsType>

