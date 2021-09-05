import {
    addTodolistAC,
    AddTodoListActionType,
    removeTodolistAC,
    RemoveTodoListActionType,
    SetTodolistActionType,
    setTodolistsAC
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskPayloadType} from "../api/todolists-api";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'taska',
    initialState: {} as TasksStateType,
    reducers: {
        setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateDomainTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        changeTaskProcessStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, processStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], processStatus: action.payload.processStatus}
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
    },
})

export const _tasksReducer = slice.reducer

export const tasksReducer = (state: TasksStateType = {}, action: any): TasksStateType => {
    switch (action.type) {
        case "TODOLIST/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks.map((t: any) => ({...t, processStatus: 'succeeded'}))}
        }
        case 'TODOLIST/ADD-TASK': {
            return {
                ...state,
                [action.task.todoListId]: [{
                    ...action.task,
                    processStatus: 'succeeded'
                }, ...state[action.task.todoListId]]
            }
        }
        case 'TODOLIST/REMOVE-TASK': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter((t: { id: any; }) => t.id !== action.taskId)
            }
        }
        case "TODOLIST/CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t: { id: any; }) => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case "TODOLIST/CHANGE-TASK-PROCESS-STATUS": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t: { id: any; }) => t.id === action.taskId ? {
                    ...t,
                    processStatus: action.processStatus
                } : t)
            }
        }

        case setTodolistsAC.type: {
            const stateCopy = {...state}
            action.payload.todolists.forEach((tl: { id: string | number; }) => stateCopy[tl.id] = [])
            return stateCopy
        }
        case addTodolistAC.type: {
            return {...state, [action.payload.todolist.id]: []}
        }
        case removeTodolistAC.type: {
            const stateCopy = {...state}
            delete stateCopy[action.payload.todolistId]
            return stateCopy
        }
        default:
            return state
    }
}

const {
    setTasksAC,
    addTaskAC,
    removeTaskAC,
    updateTaskAC,
    changeTaskProcessStatusAC
} = slice.actions

// THUNK Creators
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(setTasksAC(res.data.items, todolistId))
    dispatch(setAppStatusAC({status: 'succeeded'}))
}
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(changeTaskProcessStatusAC(todolistId, taskId, "loading"))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const updateTaskTC =
    (todolistId: string, taskId: string, domainTaskModel: UpdateDomainTaskModelType) =>
        async (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
            dispatch(setAppStatusAC({status: 'loading'}))
            try {
                const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, domainTaskModel))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
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


