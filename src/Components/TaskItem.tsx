import React, {ReactElement} from "react";
import './TaskItem.css'
import {Button, Popconfirm, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ShowUrls} from "./ShowUrls";

type TaskItemState = {
    showingConfirm: boolean,
}

export type TaskItemProps = {
    text: string;
    active: boolean;
    UUID: string;
    onDone: any;
    onEdit: any;
    onDelete: any;
    visibleConfirm: boolean;
    clickableLinks: boolean;
}

export class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
    getDoneButton(): ReactElement<typeof Tooltip> {
        const markAsText = 'Mark as ' + ((this.props.active) ? 'completed' : 'active');
        const icon = this.props.active ? <CheckOutlined/> : <CloseOutlined/>;
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
    handleVisibleChange = (visible: boolean): void => {
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

    render(): ReactElement {
        return (
            <div className={`TaskItem-container ${this.props.active ? '' : 'TaskItem-dimmed'}`}>
                <div className="TaskItem-controls button-group">
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
                    <ShowUrls text={this.props.text} convertLinks={this.props.clickableLinks}/>
                </div>
            </div>
        )
    }
}
