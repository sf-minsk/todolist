import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskPayloadType} from "../api/todolists-api";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, processStatus: 'succeeded'}))
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, processStatus: 'succeeded'})
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


// export const _tasksReducer = (state: TasksStateType = {}, action: any): TasksStateType => {
//     switch (action.type) {
//         case "TODOLIST/SET-TASKS": {
//             return {...state, [action.todolistId]: action.tasks.map((t: any) => ({...t, processStatus: 'succeeded'}))}
//         }
//         case 'TODOLIST/ADD-TASK': {
//             return {
//                 ...state,
//                 [action.task.todoListId]: [{
//                     ...action.task,
//                     processStatus: 'succeeded'
//                 }, ...state[action.task.todoListId]]
//             }
//         }
//         case 'TODOLIST/REMOVE-TASK': {
//             return {
//                 ...state,
//                 [action.todoListId]: state[action.todoListId].filter((t: { id: any; }) => t.id !== action.taskId)
//             }
//         }
//         case "TODOLIST/CHANGE-TASK-STATUS": {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map((t: { id: any; }) => t.id === action.taskId ? {...t, ...action.model} : t)
//             }
//         }
//         case "TODOLIST/CHANGE-TASK-PROCESS-STATUS": {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map((t: { id: any; }) => t.id === action.taskId ? {
//                     ...t,
//                     processStatus: action.processStatus
//                 } : t)
//             }
//         }


export const tasksReducer = slice.reducer

const {
    setTasksAC,
    addTaskAC,
    removeTaskAC,
    updateTaskAC,
    changeTaskProcessStatusAC
} = slice.actions

export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(setTasksAC({tasks: res.data.items, todolistId: todolistId}))
    dispatch(setAppStatusAC({status: 'succeeded'}))
}
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(changeTaskProcessStatusAC({todolistId: todolistId, taskId: taskId, processStatus: "loading"}))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({todoListId: todolistId, taskId: taskId}))
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
            dispatch(changeTaskProcessStatusAC({
                todolistId: todolistId,
                taskId: taskId,
                processStatus: "loading"
            }))
            dispatch(setAppStatusAC({status: 'loading'}))
            try {
                const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({todolistId: todolistId, taskId: taskId, model: domainTaskModel}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            } catch (e) {
                handleNetworkAppError(e, dispatch)
            } finally {
                dispatch(changeTaskProcessStatusAC({
                    todolistId: todolistId,
                    taskId: taskId,
                    processStatus: "succeeded"
                }))
            }
        }

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


