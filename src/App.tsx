import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";

export type FilterValuesType = 'all' | 'active' | 'completed';


export const App = () => {

    //local state
    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: 'CSS&HTML', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'React', isDone: false},
        {id: 4, title: 'Redux', isDone: false}
    ])
    let [filter, setFilter] = useState<FilterValuesType>('all')

    //delete tasks
    const removeTask = (id: number) => {
        let filteredTasks = tasks.filter((t) => t.id !== id)
        setTasks(filteredTasks)
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
            />
        </div>
    )
}
