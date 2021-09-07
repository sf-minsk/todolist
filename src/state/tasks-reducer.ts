import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskPayloadType} from "../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasksTC', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks: res.data.items, todolistId: todolistId}
})
export const addTaskTC = createAsyncThunk('tasks/addTaskTC', async (param: { todolistId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, thunkAPI.dispatch)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTaskTC', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(changeTaskProcessStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        processStatus: "loading"
    }))
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListId: param.todolistId, taskId: param.taskId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, thunkAPI.dispatch)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTaskTC', async (param: { todolistId: string, taskId: string, domainTaskModel: UpdateDomainTaskModelType }, thunkAPI) => {
    // @ts-ignore
    const task = thunkAPI.getState().tasks[param.todolistId].find(t => t.id === param.taskId)
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
        ...param.domainTaskModel,
    }
    thunkAPI.dispatch(changeTaskProcessStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        processStatus: "loading"
    }))
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {
                todolistId: param.todolistId,
                taskId: param.taskId,
                model: param.domainTaskModel
            }

        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        handleNetworkAppError(e, thunkAPI.dispatch)
    } finally {
        thunkAPI.dispatch(changeTaskProcessStatusAC({
            todolistId: param.todolistId,
            taskId: param.taskId,
            processStatus: "succeeded"
        }))
    }
})

//slice
const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
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
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, processStatus: 'succeeded'}))
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload)
                state[action.payload.task.todoListId].unshift({...action.payload.task, processStatus: 'succeeded'})
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const {taskId, todoListId} = action.payload;
                const tasks = state[todoListId]
                const index = tasks.findIndex(t => t.id === taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            }
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId]
                const {taskId} = action.payload;
                const index = tasks.findIndex(t => t.id === taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            }
        })
    },
})
//reducer
export const tasksReducer = slice.reducer
//actions
const {
    changeTaskProcessStatusAC
} = slice.actions
//types
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


