import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskPayloadType} from "../api/todolists-api";
import {AppRootStateType, AppThunkType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";

export const tasksReducer = (state: TasksStateType = {}, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "TODOLIST/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, processStatus: 'succeeded'}))}
        }
        case 'TODOLIST/ADD-TASK': {
            return {...state, [action.task.todoListId]: [{...action.task, processStatus: 'succeeded'}, ...state[action.task.todoListId]]}
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
        case "TODOLIST/CHANGE-TASK-PROCESS-STATUS": {
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, processStatus: action.processStatus} : t)
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
const changeTaskProcessStatusAC = (todolistId: string, taskId: string, processStatus: RequestStatusType) => ({
    type: 'TODOLIST/CHANGE-TASK-PROCESS-STATUS',
    todolistId,
    taskId,
    processStatus,
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
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunkType => async dispatch => {
    dispatch(changeTaskProcessStatusAC(todolistId, taskId, "loading"))
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const updateTaskTC =
    (todolistId: string, taskId: string, domainTaskModel: UpdateDomainTaskModelType): AppThunkType =>
        async (dispatch, getState: () => AppRootStateType) => {
            const task = getState().tasks[todolistId].find(t => t.id === taskId)
            if (!task) {
                console.warn('TASK NOT FOUND!')
                return
            }
            const apiModel: UpdateTaskPayloadType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainTaskModel,
            }
            dispatch(changeTaskProcessStatusAC(todolistId, taskId, "loading"))
            dispatch(setAppStatusAC('loading'))
            try {
                const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, domainTaskModel))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            } catch (e) {
                handleNetworkAppError(e, dispatch)
            } finally {
                dispatch(changeTaskProcessStatusAC(todolistId, taskId, "succeeded"))
            }
        }

// Types
export type TaskActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof changeTaskProcessStatusAC>
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


