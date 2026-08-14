import type { ReactElement } from "react";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export type ISettings = {
  showConfirmDialog: boolean;
  showActiveTasksFirst: boolean;
  showCompleted: boolean;
  clickableLinks: boolean;
};

export type SettingsProps = {
  settings: ISettings;
  onSettingUpdate: (newSettings: ISettings) => void;
};

export const SettingsPage = ({ settings, onSettingUpdate }: SettingsProps) => {
  const updateSettings = (itemName: string, itemValue: boolean): void => {
    const newSettings = { ...settings, [itemName]: itemValue };
    onSettingUpdate(newSettings);
  };

  const createCustomSwitch = (
    settingName: keyof ISettings,
  ): ReactElement<typeof Switch> => (
    <Switch
      onChange={(value: boolean) => updateSettings(settingName, value)}
      checked={settings[settingName]}
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
    />
  );

  return (
    <div>
      <h3>Here you can change the behavior of the application</h3>
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
            <td>{createCustomSwitch("showConfirmDialog")}</td>
          </tr>
          <tr>
            <td>Show active tasks first</td>
            <td>{createCustomSwitch("showActiveTasksFirst")}</td>
          </tr>
          <tr>
            <td>Show completed tasks</td>
            <td>{createCustomSwitch("showCompleted")}</td>
          </tr>
          <tr>
            <td>Make URLs clickable</td>
            <td>{createCustomSwitch("clickableLinks")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
