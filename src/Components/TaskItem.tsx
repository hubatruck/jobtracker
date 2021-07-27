import React from "react";
import './TaskItem.css'

export type TaskItemProp = {
    text: string;
    done: boolean;
    UUID: string;
    onDone?: any;
    onDelete?: any;
}

export class TaskItem extends React.Component<TaskItemProp> {
    render() {
        return (
            <div className="TaskItem-container">
                <div className="TaskItem-controls">
                    <button onClick={this.props.onDone}>Done</button>
                    <button onClick={this.props.onDelete}>Delete</button>
                </div>
                <div className={this.props.done ? 'Task-text Task-done' : 'Task-text Task-in-progress'}>
                    {this.props.text}
                </div>
            </div>
        )
    }
}
