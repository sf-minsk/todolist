import React from "react";

type EditableSpanPropsType = {
    title: string
}

export function EditableSpan(props: EditableSpanPropsType) {
    return <span>{props.title}</span>
}