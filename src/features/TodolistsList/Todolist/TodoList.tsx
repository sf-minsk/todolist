import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {fetchTasksTC} from "../../../state/tasks-reducer";
import {FilterValuesType} from "../../../state/todolists-reducer";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {Task} from "./Task/Task";
import {RequestStatusType} from "../../../state/app-reducer";

export type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (title: string, todolistId: string) => void
    removeTask: (taskID: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
    removeTodoList: (todolistId: string) => void
    processStatus: RequestStatusType
}

export const TodoList = React.memo((props: PropsType) => {
    const {
        id,
        title,
        tasks,
        filter,
        addTask,
        removeTask,
        changeTaskStatus,
        changeTaskTitle,
        changeFilter,
        changeTodoListTitle,
        removeTodoList,
        processStatus,
    } = props

    //start
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(id))
    }, [id, dispatch])

    //filter actions
    const onAllClickHandler = useCallback(() => {
        changeFilter('all', id)
    }, [changeFilter, id])
    const onActiveClickHandler = useCallback(() => {
        changeFilter('active', id)
    }, [changeFilter, id])
    const onCompletedClickHandler = useCallback(() => {
        changeFilter('completed', id)
    }, [changeFilter, id])

    //todolist actions
    const removeTodoListHandler = () => {
        removeTodoList(id)
    }
    const AddTask = useCallback((title: string) => {
        addTask(title, id)
    }, [addTask, id])
    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        changeTodoListTitle(id, newTitle)
    }, [changeTodoListTitle, id])

    //tasks depending on the filter
    let tasksForTodoList = tasks
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }

    return (
        <div>
            <h3 style={{display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
                <EditableSpan title={title} onChange={changeTodoListTitleHandler}/>
                <IconButton
                    aria-label={'delete'}
                    onClick={removeTodoListHandler}
                    disabled={processStatus === 'loading'}
                >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={AddTask} disabled={processStatus === "loading"}/>
            <div>
                {tasksForTodoList.map(t => <Task
                        key={t.id}
                        todoListId={id}
                        task={t}
                        removeTask={removeTask}
                        changeTaskStatus={changeTaskStatus}
                        changeTaskTitle={changeTaskTitle}
                        processStatus={t.processStatus === "succeeded"}
                    />
                )}
            </div>
            <div>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    className={filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}
                >
                    All
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'active' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    className={filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    style={{margin: '2px'}}
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
})
