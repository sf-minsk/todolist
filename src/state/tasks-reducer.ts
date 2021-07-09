import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const tasksReducer = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "TODOLIST/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'TODOLIST/ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'TODOLIST/REMOVE-TASK': {
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)}
        }
        case 'TODOLIST/CHANGE-TASK-STATUS': {
            const tasks = state[action.todoListId]
            state[action.todoListId] = tasks
                .map(t => t.id === action.taskId
                    ? {...t, isDone: action.isDone}
                    : t)
            return ({...state})
        }
        case 'TODOLIST/CHANGE-TASK-TITLE': {
            const tasks = state[action.todoListId]
            state[action.todoListId] = tasks
                .map(t => t.id === action.taskId
                    ? {...t, title: action.taskTitle}
                    : t)
            return ({...state})
        }
        case 'TODOLIST/SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach(tl => stateCopy[tl.id] = [])
            return stateCopy
        }
        case 'TODOLIST/ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'TODOLIST/REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        default:
            return state
    }
}

// Action creators
export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {
        type: 'TODOLIST/SET-TASKS',
        tasks,
        todolistId,
    } as const
}
export const addTaskAC = (task: TaskType) => {
    return {
        type: 'TODOLIST/ADD-TASK',
        task,
    } as const
}
export const removeTaskAC = (todoListId: string, taskId: string) => {
    return {
        type: 'TODOLIST/REMOVE-TASK',
        taskId,
        todoListId,
    } as const
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string) => {
    return {
        type: 'TODOLIST/CHANGE-TASK-STATUS',
        taskId,
        isDone,
        todoListId,
    } as const
}
export const changeTaskTitleAC = (taskId: string, taskTitle: string, todoListId: string) => {
    return {
        type: 'TODOLIST/CHANGE-TASK-TITLE',
        taskId,
        taskTitle,
        todoListId,
    } as const
}

// THUNK Creators
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todolistId, taskId))
        })
}
export const changeTaskStatusTC = (todolistId: string, taskId: string, model: UpdateTaskModelType) => (dispatch: Dispatch<ActionsType>) => {
}

// Types
export type ActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | SetTodolistActionType
    | AddTodoListActionType
    | RemoveTodoListActionType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


