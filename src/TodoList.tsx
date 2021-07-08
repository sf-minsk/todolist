import React, {useCallback} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TasksStateType} from "./state/tasks-reducer";
import { FilterValuesType } from "./state/todolists-reducer";


export type PropsType = {
    title: string
    tasks: TasksStateType
    filter: FilterValuesType
    removeTask: (taskID: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    id: string
    removeTodoList: (todolistId: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
}

export const TodoList = React.memo(({
                                        title,
                                        tasks,
                                        filter,
                                        removeTask,
                                        changeFilter,
                                        addTask,
                                        changeTaskStatus,
                                        changeTaskTitle,
                                        id,
                                        removeTodoList,
                                        changeTodoListTitle,
                                    }: PropsType) => {

    console.log('todolist was render')
    debugger
    const onAllClickHandler = useCallback(() => {
        changeFilter('all', id)
    }, [changeFilter, id])
    const onActiveClickHandler = useCallback(() => {
        changeFilter('active', id)
    }, [changeFilter, id])
    const onCompletedClickHandler = useCallback(() => {
        changeFilter('completed', id)
    }, [changeFilter, id])
    const removeTodoListHandler = () => {
        debugger
        removeTodoList(id)
    }
    const AddTask = useCallback((title: string) => {
        addTask(title, id)
    }, [addTask, id])
    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        changeTodoListTitle(id, newTitle)
    }, [changeTodoListTitle, id])

    let tasksForTodoList = tasks

    // if (filter === 'completed') {
    //     tasksForTodoList = tasks.filter(t => t.isDone)
    // }
    // if (filter === 'active') {
    //     tasksForTodoList = tasks.filter(t => !t.isDone)
    // }

    return (
        <div>
            <h3>
                <EditableSpan title={title} onChange={changeTodoListTitleHandler}/>
                <IconButton aria-label={'delete'} onClick={removeTodoListHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={AddTask}/>
            {/*<div>*/}
            {/*    {tasksForTodoList.map(t => <Task key={t.id}*/}
            {/*                                     task={t}*/}
            {/*                                     changeTaskStatus={changeTaskStatus}*/}
            {/*                                     changeTaskTitle={changeTaskTitle}*/}
            {/*                                     todoListId={todoListId}*/}
            {/*                                     removeTask={removeTask}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</div>*/}
            <div>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    // className={props.filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}
                >
                    All
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'active' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    // className={props.filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
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
})
