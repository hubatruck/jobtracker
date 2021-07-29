import React, {ReactElement} from 'react';
import {Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export type ISettings = {
    showConfirmDialog: boolean;
    showActiveTasksFirst: boolean;
    showCompleted: boolean;
    clickableLinks: boolean;
}

export type SettingsProps = {
    settings: ISettings;
    onSettingUpdate: (newSettings: ISettings) => void;
}

export class SettingsPage extends React.Component<SettingsProps, ISettings> {
    constructor(props: SettingsProps) {
        super(props);

        this.state = {...this.props.settings}
    }

    createCustomSwitch(onChangeMethod: any, checkedStateBind: boolean): ReactElement<typeof Switch> {
        return (
            <Switch
                onChange={onChangeMethod}
                checked={checkedStateBind}
                checkedChildren={<CheckOutlined/>}
                unCheckedChildren={<CloseOutlined/>}
            />
        );
    }

    handleShowConfirmChange(value: boolean): void {
        const settings = this.props.settings;
        settings.showConfirmDialog = value;
        this.props.onSettingUpdate(settings);
    }

    handleShowActiveFirst(value: boolean): void {
        const settings = this.props.settings;
        settings.showActiveTasksFirst = value;
        this.props.onSettingUpdate(settings);
    }

    handleShowCompletedTasks(value: boolean): void {
        const settings = this.props.settings;
        settings.showCompleted = value;
        this.props.onSettingUpdate(settings);
    }

    handleClickableLinks(value: boolean): void {
        const settings =  this.props.settings;
        settings.clickableLinks = value;
        this.props.onSettingUpdate(settings);
    }

    render() {
        return (
            <div>
                <h3>Here you can change the behaviour of the application</h3>
                <table className="settings">
                    <thead>
                    <tr>
                        <th>Action name</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Show confirm dialog when deleting</td>
                        <td>
                            {this.createCustomSwitch(this.handleShowConfirmChange.bind(this), this.props.settings.showConfirmDialog)}
                        </td>
                    </tr>
                    <tr>
                        <td>Show active tasks first</td>
                        <td>
                            {this.createCustomSwitch(this.handleShowActiveFirst.bind(this), this.props.settings.showActiveTasksFirst)}
                        </td>
                    </tr>
                    <tr>
                        <td>Show completed tasks</td>
                        <td>
                            {this.createCustomSwitch(this.handleShowCompletedTasks.bind(this), this.props.settings.showCompleted)}
                        </td>
                    </tr>
                    <tr>
                        <td>Make URLs clickable</td>
                        <td>
                            {this.createCustomSwitch(this.handleClickableLinks.bind(this), this.props.settings.clickableLinks)}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
