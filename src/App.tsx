import React, {ChangeEvent, ReactElement} from 'react';
import './App.css';
import {TaskItem} from "./Components/TaskItem";
import {UTIL} from "./Util";
import {Button, Input, Layout, message, Popconfirm, Switch, Tabs} from "antd";
import {
    CheckOutlined,
    ClearOutlined,
    CloseOutlined,
    HomeOutlined,
    PlusOutlined,
    SettingOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";
import {WidthLimitedContainer} from "./Components/WidthLimitedContainer";
import {version} from '../package.json';
import scrollIntoView from 'scroll-into-view-if-needed';

const {Header, Content, Footer} = Layout;

type Settings = {
    showConfirmDialog: boolean;
    showActiveTasksFirst: boolean;
    showCompleted: boolean;
    clickableLinks: boolean;
}

type TaskItemData = {
    text: string;
    UUID: string;
    active: boolean;
}

type AppState = {
    newTaskText: string;
    taskListEntries: TaskItemData[];
    settings: Settings;
}

class App extends React.Component<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            newTaskText: '',
            settings: {
                showConfirmDialog: true,
                showActiveTasksFirst: false,
                showCompleted: true,
                clickableLinks: true,
            },
            taskListEntries: []
        };

        this.handleMarkAllDone = this.handleMarkAllDone.bind(this);
        this.handleDeleteAllCompleted = this.handleDeleteAllCompleted.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShowConfirmChange = this.handleShowConfirmChange.bind(this);
        this.handleShowActiveFirst = this.handleShowActiveFirst.bind(this);
        this.handleShowCompletedTasks = this.handleShowCompletedTasks.bind(this);
        this.handleClickableLinks = this.handleClickableLinks.bind(this);

        message.config({
            maxCount: 2,
            duration: 3
        });
    }

    /**
     * Load data
     */
    componentDidMount(): void {
        const tasks = JSON.parse(localStorage.getItem('tasks') || JSON.stringify([]));
        const settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({showConfirmDialog: true}));
        this.setState({taskListEntries: tasks, settings: settings});
    }

    handleMarkAllDone(): void {
        const tasks = this.state.taskListEntries.map((task: TaskItemData) => {
            task.active = false;
            return task;
        });
        this.updateTasks(tasks);
        message.info("All tasks marked completed!").then(() => {
        });
    }

    handleDeleteAllCompleted(): void {
        const tasks = this.state.taskListEntries.filter((task: TaskItemData) => {
            return task.active;
        })
        this.updateTasks(tasks);
        message.info("Cleared completed tasks!").then(() => {
        });
    }

    handleInput(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newTaskText: event.currentTarget.value});
    }

    handleSubmit(): void {
        const tasks = this.state.taskListEntries.slice();
        const newTask = this.state.newTaskText;

        if (!newTask) {
            return;
        }

        tasks.push({
            text: this.state.newTaskText,
            UUID: Date.now().toString() + '_' + UTIL.randomHex(),
            active: true,
        });

        this.setState({
            newTaskText: '',
        });
        this.updateTasks(tasks);
        message.success("Task created!").then(() => {
        });
    }

    handleDelete(task: TaskItemData): void {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.updateTasks(tasks);
        }
        message.info("Task deleted successfully").then(() => {
        });
    }

    handleEdit(task: TaskItemData): void {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.setState({newTaskText: task.text});
            this.updateTasks(tasks);
            scrollIntoView(
                document.body.querySelector(".input-container") as Element,
                {
                    behavior: "smooth",
                    scrollMode: "if-needed"
                });
        }
    }

    handleDone(task: TaskItemData): void {
        const tasks = this.state.taskListEntries.slice();
        const updatedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        tasks[updatedElIdx] = {...tasks[updatedElIdx], active: !tasks[updatedElIdx].active};
        this.updateTasks(tasks);
    }

    handleShowConfirmChange(value: boolean): void {
        const settings = this.state.settings;
        settings.showConfirmDialog = value;
        this.updateSettings(settings);
    }

    handleShowActiveFirst(value: boolean): void {
        const settings = this.state.settings;
        settings.showActiveTasksFirst = value;
        this.updateSettings(settings);
    }

    handleShowCompletedTasks(value: boolean): void {
        const settings = this.state.settings;
        settings.showCompleted = value;
        this.updateSettings(settings);
    }

    handleClickableLinks(value: boolean): void {
        const settings = this.state.settings;
        settings.clickableLinks = value;
        this.updateSettings(settings);
    }

    updateTasks(newTasks: TaskItemData[]): void {
        this.setState({taskListEntries: newTasks});
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    updateSettings(newSettings: Settings): void {
        this.setState({
            settings: newSettings
        });
        localStorage.setItem('settings', JSON.stringify(newSettings));
        message.info('Settings updated!', 1).then(() => {
        });
    }

    createTaskListEntry(item: TaskItemData): ReactElement<TaskItem> {
        const settings = this.state.settings;
        return (<TaskItem
            key={item.UUID}
            text={item.text}
            active={item.active}
            UUID={item.UUID}
            onDelete={() => this.handleDelete(item)}
            onDone={() => this.handleDone(item)}
            onEdit={() => this.handleEdit(item)}
            visibleConfirm={settings.showConfirmDialog}
            clickableLinks={settings.clickableLinks}
        />);
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

    activeTaskCount(): number {
        return this.state.taskListEntries.filter((task: TaskItemData) => {
            return task.active;
        }).length;
    }

    finishedTaskCount(): number {
        return Math.max(this.state.taskListEntries.length - this.activeTaskCount(), 0);
    }

    render(): ReactElement {
        let taskListItems;
        if (this.state.taskListEntries) {
            let tasks = this.state.taskListEntries;

            if (!this.state.settings.showCompleted) {
                tasks = tasks.filter(task => {
                    return task.active;
                });
            } else if (this.state.settings.showActiveTasksFirst) {
                let activeTasks: TaskItemData[] = [], completedTasks: TaskItemData[] = [];
                tasks.forEach(task => {
                    task.active ? activeTasks.push(task) : completedTasks.push(task);
                });

                tasks = activeTasks.concat(completedTasks);
            }

            taskListItems = tasks.map((item: TaskItemData) => {
                return this.createTaskListEntry(item);
            });
        }

        return (
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Header style={{color: 'white'}}>
                    <WidthLimitedContainer>JobTracker</WidthLimitedContainer>
                </Header>
                <Content className="content">
                    <WidthLimitedContainer className="content-container">
                        <Tabs defaultActiveKey="1" type="card">
                            <Tabs.TabPane tab={<span><HomeOutlined/> Home</span>} key="1">
                                <div className="input-container">
                                    <Input.TextArea
                                        placeholder="Type task here..."
                                        allowClear
                                        value={this.state.newTaskText}
                                        style={{width: 400}}
                                        autoSize={{minRows: 2}}
                                        showCount
                                        maxLength={2000}
                                        onChange={this.handleInput}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={this.handleSubmit}
                                        icon={<PlusOutlined/>}
                                        style={{marginTop: "5px"}}
                                    > Add </Button>
                                </div>
                                <hr/>
                                <div className="button-group">
                                    <Button
                                        onClick={this.handleMarkAllDone}
                                        disabled={!this.activeTaskCount()}
                                        icon={<ThunderboltOutlined/>}
                                    > Mark all as completed </Button>
                                    <Popconfirm
                                        title="Are you sure? This cannot be undone."
                                        okText="Yes"
                                        cancelText="Nah"
                                        onConfirm={this.handleDeleteAllCompleted}
                                        placement="bottom"
                                        disabled={!this.finishedTaskCount()}
                                    >
                                        <Button
                                            danger
                                            disabled={!this.finishedTaskCount()}
                                            icon={<ClearOutlined/>}
                                        > Clear completed tasks </Button>
                                    </Popconfirm>
                                </div>
                                <div className="App-task-container">
                                    {taskListItems}
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={<span><SettingOutlined/>Settings</span>} key="2">
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
                                            {this.createCustomSwitch(this.handleShowConfirmChange, this.state.settings.showConfirmDialog)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Show active tasks first</td>
                                        <td>
                                            {this.createCustomSwitch(this.handleShowActiveFirst, this.state.settings.showActiveTasksFirst)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Show completed tasks</td>
                                        <td>
                                            {this.createCustomSwitch(this.handleShowCompletedTasks, this.state.settings.showCompleted)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Make URLs clickable</td>
                                        <td>
                                            {this.createCustomSwitch(this.handleClickableLinks, this.state.settings.clickableLinks)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Tabs.TabPane>
                        </Tabs>
                    </WidthLimitedContainer>
                </Content>
                <Footer style={{
                    textAlign: 'center',
                    fontWeight: 'lighter',
                    padding: 5,
                }}>
                    &copy; {UTIL.getCopyrightDate()} hubatruck |
                    <a className="footer-link" target="_blank" rel="noreferrer"
                       href="https://github.com/hubatruck/jobtracker">
                        &nbsp;View project on GitHub&nbsp;
                    </a>
                    | build: {process.env.REACT_APP_GIT_SHA}_v{version}
                </Footer>
            </Layout>
        );
    }
}

export default App;
