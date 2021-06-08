import React, {useReducer} from 'react';
import {v1} from 'uuid';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoListAC,
    changeTodoLisFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}


export const AppWithReducers = () => {

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todoLists, dispatchToTodoListsReducer] = useReducer(todoListsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'active'},
        {id: todolistId2, title: 'What to buy', filter: 'all'}
    ])

    const [tasksObj, dispatchToTasksReducer] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: 'CSS&HTML', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Redux', isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bread', isDone: true},
            {id: v1(), title: 'Water', isDone: false},
            {id: v1(), title: 'Cheese', isDone: false}
        ]
    })

    function addTask(title: string, todolistId: string) {
        dispatchToTasksReducer(addTaskAC(title, todolistId))
    }

    function removeTask(id: string, todolistId: string) {
        dispatchToTasksReducer(removeTaskAC(id, todolistId))
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        dispatchToTasksReducer(changeTaskStatusAC(taskId, isDone, todolistId))
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        dispatchToTasksReducer(changeTaskTitleAC(taskId, newTitle, todolistId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchToTodoListsReducer(changeTodoLisFilterAC(value, todolistId))
    }

    function removeTodoList(todolistId: string) {
        const action = removeTodoListAC(todolistId)
        dispatchToTodoListsReducer(action)
        dispatchToTasksReducer(action)
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        dispatchToTodoListsReducer(changeTodoListTitleAC(id, newTitle))
    }

    function AddTodoList(title: string) {
        const action = addTodoListAC(title)
        dispatchToTodoListsReducer(action)
        dispatchToTasksReducer(action)
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
                            let tasksForTodoList = tasksObj[tl.id]
                            switch (tl.filter) {
                                case 'completed':
                                    tasksForTodoList = tasksObj[tl.id].filter(t => t.isDone)
                                    break;
                            }
                            switch (tl.filter) {
                                case 'active':
                                    tasksForTodoList = tasksObj[tl.id].filter(t => !t.isDone)
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
