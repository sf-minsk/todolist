import React, {ChangeEvent, KeyboardEvent, useState} from "react";

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
        <input placeholder={error ? 'Input a correct value' : ''}
               value={newTaskName}
               onChange={onChangeInputHandler}
               onKeyPress={onKeyPressHandler}/>
        <button disabled={!newTaskName} onClick={addNewTask}>+</button>
    </div>
}