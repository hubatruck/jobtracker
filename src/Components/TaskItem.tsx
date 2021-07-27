import React from "react";
import './TaskItem.css'
import {Button, Popconfirm, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

type TaskItemState = {
    showingConfirm: boolean,
}

export type TaskItemProp = {
    text: string;
    done: boolean;
    UUID: string;
    onDone?: any;
    onEdit?: any;
    onDelete?: any;
    visibleConfirm?: boolean;
}

export class TaskItem extends React.Component<TaskItemProp, TaskItemState> {
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

    /// source: https://codesandbox.io/s/v3yo8
    handleVisibleChange = (visible: boolean) => {
        if (!visible) {
            this.setState({showingConfirm: visible});
            return;
        }

        if (this.props.visibleConfirm) {
            this.setState({showingConfirm: visible});
        } else {
            this.props.onDelete();
        }
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
                    <Popconfirm
                        title="Are you sure you want to delete this task?"
                        okText="Yes"
                        cancelText="Nah"
                        onConfirm={this.props.onDelete}
                        placement="bottom"
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <Button
                            icon={<DeleteOutlined/>}
                            danger
                        />
                    </Popconfirm>
                </div>
                <div className="Task-text">
                    {this.props.text}
                </div>
            </div>
        )
    }
}
