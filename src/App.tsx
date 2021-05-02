import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {TodoList} from "./TodoList";

export type FilterValuesType = 'all' | 'active' | 'completed';
type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export const App = () => {
    const addTask = (title: string, todolistId: string) => {
        const newTask = {id: v1(), title: title, isDone: false}
        const tasks = tasksObj[todolistId]
        tasksObj[todolistId] = [newTask, ...tasks]
        setTasks({...tasksObj})
    }
    const removeTask = (id: string, todolistId: string) => {
        const tasks = tasksObj[todolistId]
        tasksObj[todolistId] = tasks.filter((t) => t.id !== id)
        setTasks({...tasksObj})
    }
    const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        const tasks = tasksObj[todolistId]
        const task = tasks.find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            setTasks({...tasksObj})
        }
    }
    const changeFilter = (value: FilterValuesType, todolistId: string) => {
        const todoList = todoLists.find(tl => tl.id === todolistId);
        if (todoList) {
            todoList.filter = value
            setTodoLists([...todoLists])
        }
    }
    const removeTodoList = (todolistId: string) => {
      const filteredTodoLists =  todoLists.filter((tl)=> tl.id !== todolistId)
        setTodoLists(filteredTodoLists)
        delete tasksObj[todolistId]
        setTasks({...tasksObj})
    }

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todolistId1, title: 'What to learn', filter: 'active'},
        {id: todolistId2, title: 'What to buy', filter: 'all'}
    ])

    const [tasksObj, setTasks] = useState({
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

    return (
        <div className="App">
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
                    return <TodoList
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        removeTask={removeTask}
                        tasks={tasksForTodoList}
                        filter={tl.filter}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        removeTodoList={removeTodoList}
                    />
                })}
        </div>
    )
}
