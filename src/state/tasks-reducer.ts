import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskType, todolistsAPI} from "../api/todolists-api";
import {Dispatch} from "redux";


export const tasksReducer = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "TODOLIST/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        // case 'TODOLIST/ADD-TASK': {
        //     const stateCopy = {...state}
        //     const tasks = stateCopy[action.todoListId]
        //     const newTask = {id: v1(), title: action.taskTitle, isDone: false}
        //     stateCopy[action.todoListId] = [newTask, ...tasks]
        //     return stateCopy
        // }
        case 'TODOLIST/REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId]
            stateCopy[action.todoListId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
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
            const stateCopy = {...state}
            // @ts-ignore
            stateCopy[action.todolist] = []
            return stateCopy
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

export const addTaskAC = (taskTitle: string, todoListId: string) => {
    return {
        type: 'TODOLIST/ADD-TASK',
        taskTitle,
        todoListId,
    } as const
}

export const removeTaskAC = (taskId: string, todoListId: string) => {
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


