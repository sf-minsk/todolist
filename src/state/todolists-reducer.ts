import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {AppThunkType} from "./store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

export const todoListsReducer = (state: Array<TodolistStateType> = [], action: TodolistActionsType): Array<TodolistStateType> => {
    switch (action.type) {
        case 'TODOLIST/SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all', processStatus: "succeeded"}))
        }
        case 'TODOLIST/ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', processStatus: "succeeded"}, ...state]
        }
        case 'TODOLIST/REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.todolistId)
        }
        case 'TODOLIST/CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'TODOLIST/CHANGE-TODOLIST-FILTER' : {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.filter = action.filter
            }
            return [...state]
        }
        case 'TODOLIST/CHANGE-TODOLIST-PROCESS-STATUS' : {
            return state.map(t => t.id === action.id ? {...t, processStatus: action.processStatus} : t)
        }
        default:
            return state
    }
}

// Action Creators
const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'TODOLIST/SET-TODOLISTS',
    todolists,
} as const)
const addTodolistAC = (todolist: TodolistType) => ({
    type: 'TODOLIST/ADD-TODOLIST',
    todolist,
} as const)
const removeTodolistAC = (todolistId: string) => ({
    type: 'TODOLIST/REMOVE-TODOLIST',
    todolistId,
} as const)
const changeTodolistTitleAC = (todolistId: string, todolistTitle: string) => ({
    type: 'TODOLIST/CHANGE-TODOLIST-TITLE',
    id: todolistId,
    title: todolistTitle,
} as const)
export const changeTodolisFilterAC = (filter: FilterValuesType, todolistId: string) => ({
    type: 'TODOLIST/CHANGE-TODOLIST-FILTER',
    id: todolistId,
    filter
} as const)
const changeTodolistProcessStatusAC = (id: string, processStatus: RequestStatusType) => ({
    type: 'TODOLIST/CHANGE-TODOLIST-PROCESS-STATUS',
    id,
    processStatus,
} as const)

// THUNK Creators
export const fetchTodolistsTC = (): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC(res.data))
    dispatch(setAppStatusAC('succeeded'))
}
export const addTodolistTC = (title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === 0) {
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    } else {
        if (res.data.messages.length) {
            dispatch(setAppErrorAC(res.data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some Error occurred'))
        }
        dispatch(setAppStatusAC('failed'))
    }
}
export const removeTodolistTC = (todolistid: string): AppThunkType => async dispatch => {
    dispatch(changeTodolistProcessStatusAC(todolistid, "loading"))
    dispatch(setAppStatusAC('loading'))
    await todolistsAPI.deleteTodolist(todolistid)
    dispatch(removeTodolistAC(todolistid))
    dispatch(setAppStatusAC('succeeded'))
}
export const changeTodolistTitleTC = (todolistid: string, title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    await todolistsAPI.updateTodolist(todolistid, title)
    dispatch(changeTodolistTitleAC(todolistid, title))
    dispatch(setAppStatusAC('succeeded'))
}

// Types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistStateType = TodolistType & {
    filter: FilterValuesType,
    processStatus: RequestStatusType,
}
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>

export type TodolistActionsType =
    | SetTodolistActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolisFilterAC>
    | ReturnType<typeof changeTodolistProcessStatusAC>
