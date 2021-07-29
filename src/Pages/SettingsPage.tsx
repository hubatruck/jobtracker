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

    createCustomSwitch(settingName: string): ReactElement<typeof Switch> {
        if (Object.keys(this.state).filter(key => key === settingName).length === 0) {
            throw Error(`Unknown setting key '${settingName}'. Did you misspell it?`);
        }
        return (
            <Switch
                onChange={(value: boolean) => this.updateSettings(settingName, value)}
                /// key hack: https://stackoverflow.com/a/64217699
                checked={this.state[settingName as keyof ISettings]}
                checkedChildren={<CheckOutlined/>}
                unCheckedChildren={<CloseOutlined/>}
            />
        );
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
                            {this.createCustomSwitch('showConfirmDialog')}
                        </td>
                    </tr>
                    <tr>
                        <td>Show active tasks first</td>
                        <td>
                            {this.createCustomSwitch('showActiveTasksFirst')}
                        </td>
                    </tr>
                    <tr>
                        <td>Show completed tasks</td>
                        <td>
                            {this.createCustomSwitch('showCompleted')}
                        </td>
                    </tr>
                    <tr>
                        <td>Make URLs clickable</td>
                        <td>
                            {this.createCustomSwitch('clickableLinks')}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    private updateSettings(itemName: string, itemValue: boolean): void {
        const settings = {...this.props.settings, [itemName]: itemValue};
        this.props.onSettingUpdate(settings);
    }
}
