import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {ControlPoint} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [newTaskName, setNewTaskName] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskName(e.currentTarget.value)
        setError(false)
    }
    const addNewTask = () => {
        if (newTaskName.trim()) {
            props.addItem(newTaskName.trim())
        } else {
            setError(true)
        }
        setNewTaskName('')
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTaskName) {
            addNewTask()
        }
    }

    return <div>
        <TextField
            helperText={error ? 'Input a correct value' : ''}
            label={'Type value'}
            error={error}
            value={newTaskName}
            variant={"outlined"}
            onChange={onChangeInputHandler}
            onKeyPress={onKeyPressHandler}
            disabled={props.disabled}
        />

        <IconButton
            disabled={!newTaskName || props.disabled}
            onClick={addNewTask}
            color={"primary"}
        >
            <ControlPoint/>
        </IconButton>
    </div>
})