import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistStateType>,
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', processStatus: 'idle'}))
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', processStatus: "succeeded"})
        },
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.slice(index, 1)
            }
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, todolistTitle: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.todolistTitle
        },
        changeTodolisFilterAC(state, action: PayloadAction<{ filter: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        changeTodolistProcessStatusAC(state, action: PayloadAction<{ id: string, processStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.processStatus)
            state[index].processStatus = action.payload.processStatus
        },
    }
})
export const todoListsReducer = slice.reducer
export const {
    setTodolistsAC,
    addTodolistAC,
    removeTodolistAC,
    changeTodolistTitleAC,
    changeTodolisFilterAC,
    changeTodolistProcessStatusAC
} = slice.actions

export const fetchTodolistsTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC({todolists: res.data}))
    dispatch(setAppStatusAC({status: 'succeeded'}))
}
export const addTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC({todolist: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const removeTodolistTC = (todolistid: string) => async (dispatch: Dispatch) => {
    dispatch(changeTodolistProcessStatusAC({id: todolistid, processStatus: "loading"}))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistid)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC({todolistId: todolistid}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const changeTodolistTitleTC = (todolistid: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(changeTodolistProcessStatusAC({id: todolistid, processStatus: "loading"}))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.updateTodolist(todolistid, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC({todolistId: todolistid, todolistTitle: title}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    } finally {
        dispatch(changeTodolistProcessStatusAC({id: todolistid, processStatus: "succeeded"}))
    }
}

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistStateType = TodolistType & {
    filter: FilterValuesType,
    processStatus: RequestStatusType,
}
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>


