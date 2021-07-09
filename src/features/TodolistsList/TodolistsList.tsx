import React, {useCallback, useEffect} from 'react';
import {TodoList} from "./Todolist/TodoList";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Grid, Paper} from "@material-ui/core";
import {
    addTodolistTC,
    changeTodolisFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistStateType,
} from "../../state/todolists-reducer";
import {
    addTaskTC,
    removeTaskTC,
    TasksStateType,
    updateTaskTC,
} from "../../state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {TaskStatuses} from "../../api/todolists-api";


export const TodolistsList: React.FC = () => {
    //start
    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, Array<TodolistStateType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    //todolists actions
    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])
    const removeTodoList = useCallback((id: string) => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])
    const changeTodoListTitle = useCallback((todolistId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todolistId, title))
    }, [dispatch])
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolisFilterAC(value, todolistId))
    }, [dispatch])

    //tasks actions
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, title))
    }, [dispatch])
    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, id))
    }, [dispatch])
    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {status: status}))
    }, [dispatch])
    const changeTaskTitle = useCallback((taskId: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title: title}))
    }, [dispatch])

    return (
        <>
            <Grid container style={{padding: '10px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={5}>
                {todoLists.map((tl) => {
                        let tasksForTodoList = tasks[tl.id]
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodoList}
                                    filter={tl.filter}
                                    addTask={addTask}
                                    removeTask={removeTask}
                                    changeTaskStatus={changeStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    changeFilter={changeFilter}
                                    changeTodoListTitle={changeTodoListTitle}
                                    removeTodoList={removeTodoList}
                                />
                            </Paper>
                        </Grid>
                    }
                )}
            </Grid>
        </>
    )
}