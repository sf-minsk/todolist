import axios from 'axios'
import {RequestStatusType} from "../state/app-reducer";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'abc967f4-abc5-47ce-a245-10e7f69e7e3a'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title})
    },
    deleteTodolist(todolistid: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistid}`);
    },
    updateTodolist(todolistid: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistid}`, {title: title});
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, taskTitile: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitile});
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, payload: UpdateTaskPayloadType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, payload);
    }
}

export const authAPI = {
    login(payload: LoginPayloadType) {
        return instance.post<LoginResponseType>('auth/login', payload)
    },
    logout() {
        return instance.delete<LogoutResponseType>('auth/login')
    },
    me() {
        return instance.get<MeResponseType>('auth/me')
    },
}


//enums
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    processStatus: RequestStatusType
}
export type UpdateTaskPayloadType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type LoginPayloadType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}
export type LoginResponseType = {
    resultCode: number
    messages: []
    data: {
        userId: number
    }
}
export type LogoutResponseType = {
    resultCode: number
    messages: []
    data: {}
}
export type MeResponseType = {
    resultCode: number
    messages: [],
    data: {
        id: number,
        email: string,
        login: string
    }
}

