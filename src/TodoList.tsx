import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type PropsType = {
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskID: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    id: string
    removeTodoList: (id: string) => void
}

export const TodoList = (props: PropsType) => {

    const onAllClickHandler = () => {
        props.changeFilter('all', props.id)
    }
    const onActiveClickHandler = () => {
        props.changeFilter('active', props.id)
    }
    const onCompletedClickHandler = () => {
        props.changeFilter('completed', props.id)
    }
    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }
    const AddTask = (title: string) => {
        props.addTask(title, props.id)
    }

    return (
        <div>
            <h3>{props.title}
                <button onClick={removeTodoList}>X</button>
            </h3>
            <AddItemForm addItem={AddTask}/>
            <ul>
                {props.tasks.map(t => {
                    const onChangeIsDoneHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }
                    const onRemoveTaskHandler = () => {
                        props.removeTask(t.id, props.id)
                    }
                    return <li key={t.id} className={t.isDone ? 'is-done task' : 'task'}>
                        <input type="checkbox" checked={t.isDone} onChange={onChangeIsDoneHandler}/>
                        <EditableSpan title={t.title}/>
                        <button onClick={onRemoveTaskHandler}>X</button>
                    </li>
                })}
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All
                </button>
                <button className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    );
}

