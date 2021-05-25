import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

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
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    id: string
    removeTodoList: (id: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
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
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodoListTitle}/>
                <IconButton aria-label={'delete'} onClick={removeTodoList}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={AddTask}/>
            <div>
                {props.tasks.map(t => {
                    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }
                    const onChangeTitleHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id)
                    }


                    const onRemoveTaskHandler = () => {
                        props.removeTask(t.id, props.id)
                    }
                    return <div key={t.id} className={t.isDone ? 'is-done task' : 'task'}>
                        <Checkbox checked={t.isDone} onChange={onChangeStatusHandler}/>
                        <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>

                        <IconButton aria-label={'delete'} onClick={onRemoveTaskHandler}>
                            <Delete />
                        </IconButton>
                    </div>
                })}
            </div>
            <div>
                <Button
                    style={{margin: '2px'}}
                    variant={props.filter === 'all' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    // className={props.filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}
                >
                    All
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={props.filter === 'active' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    // className={props.filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={props.filter === 'completed' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    // className={props.filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
}

