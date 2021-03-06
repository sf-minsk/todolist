import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";

type TaskPropsType = {
    todoListId: string
    task: TaskType
    removeTask: (taskID: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    processStatus: boolean
}

export const Task = React.memo((props: TaskPropsType) => {
    const {
        todoListId,
        task,
        removeTask,
        changeTaskStatus,
        changeTaskTitle,
        processStatus,
    } = props

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todoListId)
    }, [changeTaskStatus, task.id, todoListId])
    const onChangeTitleHandler = useCallback((newValue: string) => {
        changeTaskTitle(task.id, newValue, todoListId)
    }, [changeTaskTitle, task.id, todoListId])
    const onRemoveTaskHandler = () => {
        removeTask(task.id, todoListId)
    }

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done task' : 'task'}>
        <Checkbox checked={task.status === TaskStatuses.Completed} onChange={onChangeStatusHandler} disabled={!processStatus}/>
        <EditableSpan title={task.title} onChange={onChangeTitleHandler} disabled={!processStatus}/>
        <IconButton aria-label={'delete'} onClick={onRemoveTaskHandler} disabled={!processStatus}>
            <Delete/>
        </IconButton>
    </div>

})