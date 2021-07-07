import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todolists-reducer";


export type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todoListId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK'
    taskTitle: string
    todoListId: string
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    taskId: string
    isDone: boolean
    todoListId: string
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    taskId: string
    taskTitle: string
    todoListId: string
}


export type ActionsTypes =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
const initialState: TasksStateType = {

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsTypes): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId]
            stateCopy[action.todoListId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTask = {id: v1(), title: action.taskTitle, isDone: false}
            stateCopy[action.todoListId] = [newTask, ...tasks]
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
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}

            stateCopy[action.todoListId] = []
            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todoListId,
    }
}

export const addTaskAC = (taskTitle: string, todoListId: string): AddTaskActionType => {
    return {
        type: 'ADD-TASK',
        taskTitle,
        todoListId,
    }
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        isDone,
        todoListId,
    }
}

export const changeTaskTitleAC = (taskId: string, taskTitle: string, todoListId: string): ChangeTaskTitleActionType => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        taskTitle,
        todoListId,
    }
}

