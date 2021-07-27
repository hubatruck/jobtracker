import React from "react";
import './TaskItem.css'
import {Button, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";

export type TaskItemProp = {
    text: string;
    done: boolean;
    UUID: string;
    onDone?: any;
    onDelete?: any;
}

export class TaskItem extends React.Component<TaskItemProp> {
    render() {
        const markAsText = 'Mark as ' + ((this.props.done) ? 'un-done' : 'done');
        return (
            <div className="TaskItem-container">
                <div className="TaskItem-controls">
                    <Tooltip title={markAsText}>
                        <Button
                            onClick={this.props.onDone}
                            icon={this.props.done ? <CloseOutlined/> : <CheckOutlined/>}
                            style={{backgroundColor: '#70C040'}}
                            onClick={this.props.onDone}
                            icon={this.props.done ? <CloseOutlined/> : <CheckOutlined/>}
                        />
                    </Tooltip>
                    <Tooltip title="Delete task">
                        <Button
                            onClick={this.props.onDelete}
                            icon={<DeleteOutlined/>}
                            danger
                        />
                    </Tooltip>
                </div>
                <div className={this.props.done ? 'Task-text Task-done' : 'Task-text Task-in-progress'}>
                    {this.props.text}
                </div>
            </div>
        )
    }
}
