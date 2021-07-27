import React from "react";
import './TaskItem.css'
import {Button, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

export type TaskItemProp = {
    text: string;
    done: boolean;
    UUID: string;
    onDone?: any;
    onEdit?: any;
    onDelete?: any;
}

export class TaskItem extends React.Component<TaskItemProp> {
    getDoneButton() {
        const markAsText = 'Mark as ' + ((this.props.done) ? 'active' : 'done');
        const icon = this.props.done ? <CloseOutlined/> : <CheckOutlined/>;
        return (
            <Tooltip title={markAsText}>
                <Button
                    onClick={this.props.onDone}
                    icon={icon}
                    style={{backgroundColor: '#70C040'}}
                />
            </Tooltip>
        )
    }

    render() {
        return (
            <div className={`TaskItem-container ${this.props.done ? 'TaskItem-dimmed' : ''}`}>
                <div className="TaskItem-controls">
                    {this.getDoneButton()}
                    <Tooltip title="Edit task">
                        <Button
                            onClick={this.props.onEdit}
                            icon={<EditOutlined/>}
                            ghost
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
                <div className="Task-text">
                    {this.props.text}
                </div>
            </div>
        )
    }
}
