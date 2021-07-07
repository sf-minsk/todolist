import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";


export const tasksReducer = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTask = {id: v1(), title: action.taskTitle, isDone: false}
            stateCopy[action.todoListId] = [newTask, ...tasks]
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId]
            stateCopy[action.todoListId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            const tasks = state[action.todoListId]
            state[action.todoListId] = tasks
                .map(t => t.id === action.taskId
                    ? {...t, isDone: action.isDone}
                    : t)
            return ({...state})
        }
        case 'CHANGE-TASK-TITLE': {
            const tasks = state[action.todoListId]
            state[action.todoListId] = tasks
                .map(t => t.id === action.taskId
                    ? {...t, title: action.taskTitle}
                    : t)
            return ({...state})
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach(tl => stateCopy[tl.id] = [])
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []
            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }

        default:
            return state
    }
}

// Action creators

export const addTaskAC = (taskTitle: string, todoListId: string) => {
    return {
        type: 'ADD-TASK',
        taskTitle,
        todoListId,
    } as const
}

export const removeTaskAC = (taskId: string, todoListId: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todoListId,
    }as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        isDone,
        todoListId,
    }as const
}

export const changeTaskTitleAC = (taskId: string, taskTitle: string, todoListId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        taskTitle,
        todoListId,
    }as const
}

// THUNK Creators


// Types

export type ActionsType =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | SetTodolistActionType
    | AddTodoListActionType
    | RemoveTodoListActionType



