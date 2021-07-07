import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";
import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../api/todolists-api";



export const todoListsReducer = (state: Array<TodoListType> = [], action: ActionsType): Array<TodoListType> => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todoListId,
                title: action.title,
                filter: "all",
            }, ...state]
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.title = action.title
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER' : {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.filter = action.filter
            }
            return [...state]
        }
        default:
            return state
    }
}
// Action Creators
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const addTodolistAC = (todolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        title: todolistTitle,
        todoListId: v1(),
    }as const
}
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistId,
    } as const
}
export const changeTodolistTitleAC = (todolistId: string, todolistTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id: todolistId,
        title: todolistTitle,
    }as const
}
export const changeTodolisFilterAC = (filter: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todolistId,
        filter
    }as const
}

// THUNK Creators
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            debugger
            dispatch(setTodolistsAC(res.data))
        })
}

// Types
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>

export type ActionsType =
    | ReturnType<typeof setTodolistsAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolisFilterAC>
