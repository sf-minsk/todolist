import TextField from "@material-ui/core/TextField";
import React, {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
    title: string
    onChange: (title: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')
    const activateEditMode = () => {
        if (!props.disabled) {
            setEditMode(true)
            setTitle(props.title)
        }
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField
            value={title}
            onBlur={activateViewMode}
            autoFocus
            onChange={onChangeTitleHandler}
        />
        : <span
            onDoubleClick={activateEditMode}
        >{props.title}</span>
})