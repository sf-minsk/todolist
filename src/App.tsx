import React from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";

function App() {

    const tasks1: Array<TaskType> = [
        {id: 1, title: 'CSS&HTML', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'React', isDone: false}
    ]
    const tasks2: Array<TaskType> = [
        {id: 1, title: 'Terminator', isDone: true},
        {id: 2, title: 'XXX', isDone: false},
        {id: 3, title: 'Inception', isDone: true}
    ]

    return (
        <div className="App">
            <TodoList title='What to learn' tasks={tasks1}/>
            <TodoList title='Movies' tasks={tasks2}/>
        </div>
    );
}

export default App;
