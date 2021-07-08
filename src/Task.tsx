import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TasksStateType} from "./state/tasks-reducer";

type TaskPropsType = {
    removeTask: (taskID: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    task: TasksStateType
    todoListId: string
}

export const Task = React.memo(({
                                    removeTask,
                                    changeTaskStatus,
                                    changeTaskTitle,
                                    task,
                                    todoListId,
                                }: TaskPropsType) => {


    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        changeTaskStatus(task.id, e.currentTarget.checked, todoListId)
    }, [changeTaskStatus, task.id, todoListId])
    const onChangeTitleHandler = useCallback((newValue: string) => {
        // @ts-ignore
        changeTaskTitle(task.id, newValue, todoListId)
    }, [changeTaskTitle, task.id, todoListId])


    const onRemoveTaskHandler = () => {
        // @ts-ignore
        removeTask(task.id, todoListId)
    }
    // @ts-ignore
    // @ts-ignore
    return <div key={task.id} className={task.isDone ? 'is-done task' : 'task'}>
        <Checkbox checked={task.isDone} onChange={onChangeStatusHandler}/>
        <EditableSpan title={task.title} onChange={onChangeTitleHandler}/>

        <IconButton aria-label={'delete'} onClick={onRemoveTaskHandler}>
            <Delete/>
        </IconButton>
    </div>

})