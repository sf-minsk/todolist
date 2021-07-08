import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../api/todolists-api";


export const todoListsReducer = (state: Array<TodolistStateType> = [], action: ActionsType): Array<TodolistStateType> => {
    switch (action.type) {
        case 'TODOLIST/SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        case 'TODOLIST/ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
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
        default:
            return state
    }
}


// Action Creators
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {
        type: 'TODOLIST/SET-TODOLISTS',
        todolists,
    } as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: 'TODOLIST/ADD-TODOLIST',
        todolist,
    } as const
}
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'TODOLIST/REMOVE-TODOLIST',
        todolistId,
    } as const
}
export const changeTodolistTitleAC = (todolistId: string, todolistTitle: string) => {
    return {
        type: 'TODOLIST/CHANGE-TODOLIST-TITLE',
        id: todolistId,
        title: todolistTitle,
    } as const
}
export const changeTodolisFilterAC = (filter: FilterValuesType, todolistId: string) => {
    return {
        type: 'TODOLIST/CHANGE-TODOLIST-FILTER',
        id: todolistId,
        filter
    } as const
}


// THUNK Creators
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const removeTodolistTC = (todolistid: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTodolist(todolistid)
        .then(() => dispatch(removeTodolistAC(todolistid)))
}
export const ChangeTodolistTitleTC = (todolistid: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistid, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistid, title))
        })
}


// Types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistStateType = TodolistType & {
    filter: FilterValuesType,
}

export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>

export type ActionsType =
    | SetTodolistActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolisFilterAC>
