import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./api/todolists-api";

type TaskPropsType = {
    todoListId: string
    task: TaskType
    removeTask: (taskID: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Task = React.memo(({
                                    todoListId,
                                    task,
                                    removeTask,
                                    changeTaskStatus,
                                    changeTaskTitle,
                                }: TaskPropsType) => {
    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked, todoListId)
    }, [changeTaskStatus, task.id, todoListId])
    const onChangeTitleHandler = useCallback((newValue: string) => {
        changeTaskTitle(task.id, newValue, todoListId)
    }, [changeTaskTitle, task.id, todoListId])
    const onRemoveTaskHandler = () => {
        removeTask(task.id, todoListId)
    }

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done task' : 'task'}>
        <Checkbox checked={task.status === TaskStatuses.Completed} onChange={onChangeStatusHandler}/>
        <EditableSpan title={task.title} onChange={onChangeTitleHandler}/>

        <IconButton aria-label={'delete'} onClick={onRemoveTaskHandler}>
            <Delete/>
        </IconButton>
    </div>

})