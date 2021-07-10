import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {AppRootStateType, AppThunkType} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";

export const tasksReducer = (state: TasksStateType = {}, action: TaskActionsType): TasksStateType => {
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
        case "TODOLIST/CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
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
const setTasksAC = (tasks: TaskType[], todolistId: string) => ({
    type: 'TODOLIST/SET-TASKS',
    tasks,
    todolistId,
} as const)
const addTaskAC = (task: TaskType) => ({
    type: 'TODOLIST/ADD-TASK',
    task,
} as const)
const removeTaskAC = (todoListId: string, taskId: string) => ({
    type: 'TODOLIST/REMOVE-TASK',
    taskId,
    todoListId,
} as const)
const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => ({
    type: 'TODOLIST/CHANGE-TASK-STATUS',
    todolistId,
    taskId,
    model,
} as const)

// THUNK Creators
export const fetchTasksTC = (todolistId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(setTasksAC(res.data.items, todolistId))
    dispatch(setAppStatusAC('succeeded'))
}
export const addTaskTC = (todolistId: string, title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.createTask(todolistId, title)
    if (res.data.resultCode === 0) {
        dispatch(addTaskAC(res.data.data.item))
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
export const removeTaskTC = (todolistId: string, taskId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    await todolistsAPI.deleteTask(todolistId, taskId)
    dispatch(removeTaskAC(todolistId, taskId))
    dispatch(setAppStatusAC('succeeded'))
}
export const updateTaskTC =
    (todolistId: string, taskId: string, domainTaskModel: UpdateDomainTaskModelType): AppThunkType =>
        async (dispatch, getState: () => AppRootStateType) => {
            const task = getState().tasks[todolistId].find(t => t.id === taskId)
            if (!task) {
                console.warn('TASK NOT FOUND!')
                return
            }
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainTaskModel,
            }
            dispatch(setAppStatusAC('loading'))
            await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            dispatch(updateTaskAC(todolistId, taskId, domainTaskModel))
            dispatch(setAppStatusAC('succeeded'))
        }

// Types
export type TaskActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | SetTodolistActionType
    | AddTodoListActionType
    | RemoveTodoListActionType

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


