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
    filter: FilterValuesType
    removeTask: (taskID: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (taskId:string, isDone:boolean) => void
}

export const TodoList = (props: PropsType) => {

    const [newTaskName, setNewTaskName] = useState('')
    const [error, setError] = useState<boolean>(false)

    const addNewTask = () => {
        if (newTaskName.trim()) {
        props.addTask(newTaskName.trim()) }
        else {setError(true)}
        setNewTaskName('')
    }
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
                       onChange={onChangeInputHandler}
                       onKeyPress={onKeyPressHandler}/>
                <button disabled={!newTaskName} onClick={addNewTask} >+</button>
            </div>
            <ul>
                {props.tasks.map(t => {
                    const onChangeIsDoneHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked)
                    }
                    const onRemoveTaskHandler = () => {props.removeTask(t.id)}
                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <input checked={t.isDone} type="checkbox" onChange={onChangeIsDoneHandler}/>
                        <span>{t.title}</span>
                        <button onClick={onRemoveTaskHandler}>X</button>
                </li>})}
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    );
}
