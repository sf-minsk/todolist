import React from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {addTodoListAC, changeTodoLisFilterAC, changeTodoListTitleAC, removeTodoListAC} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TasksStateType} from "./App";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}


export const AppWithRedux = () => {

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    function addTask(title: string, todolistId: string) {
        dispatch(addTaskAC(title, todolistId))
    }

    function removeTask(id: string, todolistId: string) {
        dispatch(removeTaskAC(id, todolistId))
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        dispatch(changeTaskStatusAC(taskId, isDone, todolistId))
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatch(changeTodoLisFilterAC(value, todolistId))
    }

    function removeTodoList(todolistId: string) {
        dispatch(removeTodoListAC(todolistId))
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        dispatch(changeTodoListTitleAC(id, newTitle))
    }

    function AddTodoList(title: string) {
        dispatch(addTodoListAC(title))
    }

    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton edge={"start"} color={"inherit"} aria-label={'menu'}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '30px'}}>
                    <AddItemForm addItem={(title: string) => {
                        AddTodoList(title)
                    }}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map((tl) => {
                            let tasksForTodoList = tasks[tl.id]
                            switch (tl.filter) {
                                case 'completed':
                                    tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
                                    break;
                            }
                            switch (tl.filter) {
                                case 'active':
                                    tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
                                    break;
                            }
                            return <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <TodoList
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        removeTask={removeTask}
                                        tasks={tasksForTodoList}
                                        filter={tl.filter}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        removeTodoList={removeTodoList}
                                        changeTodoListTitle={changeTodoListTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    )
}
