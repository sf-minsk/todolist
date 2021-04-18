import React, {useState} from 'react';
import { v1 } from 'uuid';
import './App.css';
import {TaskType, TodoList} from "./TodoList";

export type FilterValuesType = 'all' | 'active' | 'completed';


export const App = () => {

    //local state
    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: 'CSS&HTML', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false},
        {id: v1(), title: 'Redux', isDone: false}
    ])
    let [filter, setFilter] = useState<FilterValuesType>('all')


    //delete tasks
    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter((t) => t.id !== id)
        setTasks(filteredTasks)
    }
    const addTask = (title: string) => {
        const newTask = {id: v1(), title: title, isDone: false}
        const newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }

    //change tasks filter
    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }
    let tasksForTodoList = tasks
    switch (filter) {
        case 'completed':
            tasksForTodoList = tasks.filter(t => t.isDone)
            break;
    }
    switch (filter) {
        case 'active':
            tasksForTodoList = tasks.filter(t => !t.isDone)
            break;
    }

    //render
    return (
        <div className="App">
            <TodoList title='What to learn'
                      removeTask={removeTask}
                      tasks={tasksForTodoList}
                      changeFilter={changeFilter}
                      addTask={addTask}
            />
        </div>
    )
}
