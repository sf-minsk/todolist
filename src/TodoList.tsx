import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
}

export const TodoList = (props: PropsType) => {

    const [newTaskName, setNewTaskName] = useState('')
    const [error, setError] = useState<boolean>(false)

    const addNewTask = () => {
        const trimmedTitle = newTaskName.trim()
        if (trimmedTitle) {
        props.addTask(newTaskName.trim()) }
        else {setError(true)}
        setNewTaskName('')
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskName(e.currentTarget.value)
        setError(false)

    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value) {addNewTask()}}
    const onAllClickHandler = () => {props.changeFilter('all')}
    const onActiveClickHandler = () => {props.changeFilter('active')}
    const onCompletedClickHandler = () => {props.changeFilter('completed')}


    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input placeholder={error ? 'Input a correct value' : ''}
                       value={newTaskName}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}/>
                <button onClick={addNewTask} >+</button>
            </div>
            <ul>
                {props.tasks.map(t => {
                    const onRemoveTaskHandler = () => {props.removeTask(t.id)}
                    return <li key={t.id}>
                        <input type="checkbox" checked={t.isDone}/>
                        <span>{t.title}</span>
                        <button onClick={onRemoveTaskHandler}>X</button>
                </li>})}
            </ul>
            <div>
                <button onClick={onAllClickHandler}>All</button>
                <button onClick={onActiveClickHandler}>Active</button>
                <button onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    );
}
