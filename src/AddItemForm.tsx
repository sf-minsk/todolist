import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {ControlPoint} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {
    const [newTaskName, setNewTaskName] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskName(e.currentTarget.value)
        setError(false)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value) {
            addNewTask()
        }
    }
    const addNewTask = () => {
        if (newTaskName.trim()) {
            props.addItem(newTaskName.trim())
        } else {
            setError(true)
        }
        setNewTaskName('')
    }

    return <div>
        <TextField
            helperText={error ? 'Input a correct value' : ''}
            label={'Type value'}
            error={error}
            value={newTaskName}
            variant={"outlined"}
            onChange={onChangeInputHandler}
            onKeyPress={onKeyPressHandler}/>
        <IconButton
            disabled={!newTaskName}
            onClick={addNewTask}
            color={"primary"}
        >
            <ControlPoint/>
        </IconButton>
    </div>
}