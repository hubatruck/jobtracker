import React from 'react';
import './App.css';
import {TaskItem} from "./Components/TaskItem";
import {UTIL} from "./Util";
import {Button, Layout, Switch, Tabs} from "antd";
import Search from "antd/es/input/Search";
import {CheckOutlined, CloseOutlined, HomeOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";

const {Header, Content, Footer} = Layout;

type Settings = {
    showConfirmDialog: boolean;
    showActiveTasksFirst: boolean;
    hideDone: boolean;
    clickableLinks: boolean;
}

type TaskItemData = {
    text: string;
    UUID: string;
    done: boolean;
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
                hideDone: false,
                clickableLinks: true,
            },
            taskListEntries: []
        };

        this.handleMarkAllDone = this.handleMarkAllDone.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShowConfirmChange = this.handleShowConfirmChange.bind(this);
        this.handleShowActiveFirst = this.handleShowActiveFirst.bind(this);
        this.handleHideDoneTasks = this.handleHideDoneTasks.bind(this);
        this.handleClickableLinks = this.handleClickableLinks.bind(this);
    }

    /**
     * Load data
     */
    componentDidMount() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || JSON.stringify([]));
        const settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({showConfirmDialog: true}));
        this.setState({taskListEntries: tasks, settings: settings});
    }

    handleMarkAllDone(): void {
        const tasks = this.state.taskListEntries.map((task: TaskItemData) => {
            task.done = true;
            return task;
        });
        this.updateTasks(tasks);
    }

    handleInput(event: React.FormEvent<HTMLInputElement>) {
        this.setState({newTaskText: event.currentTarget.value});
    }

    handleSubmit() {
        const tasks = this.state.taskListEntries.slice();
        const newTask = this.state.newTaskText;

        if (!newTask) {
            return;
        }

        tasks.push({
            text: this.state.newTaskText,
            UUID: Date.now().toString() + '_' + UTIL.randomHex(),
            done: false,
        });

        this.setState({
            newTaskText: '',
        });
        this.updateTasks(tasks);
    }

    handleDelete(task: TaskItemData) {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.updateTasks(tasks);
        }
    }

    handleEdit(task: TaskItemData) {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.setState({newTaskText: task.text});
            this.updateTasks(tasks);
        }
    }

    handleDone(task: TaskItemData) {
        const tasks = this.state.taskListEntries.slice();
        const updatedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        tasks[updatedElIdx] = {...tasks[updatedElIdx], done: !tasks[updatedElIdx].done};
        this.updateTasks(tasks);
    }

    updateTasks(newTasks: TaskItemData[]) {
        this.setState({taskListEntries: newTasks});
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    handleShowConfirmChange(value: boolean) {
        const settings = this.state.settings;
        settings.showConfirmDialog = value;
        this.updateSettings(settings);
    }

    handleShowActiveFirst(value: boolean) {
        const settings = this.state.settings;
        settings.showActiveTasksFirst = value;
        this.updateSettings(settings);
    }

    handleHideDoneTasks(value: boolean) {
        const settings = this.state.settings;
        settings.hideDone = value;
        this.updateSettings(settings);
    }

    handleClickableLinks(value: boolean) {
        const settings = this.state.settings;
        settings.clickableLinks = value;
        this.updateSettings(settings);
    }

    updateSettings(newSettings: Settings) {
        this.setState({
            settings: newSettings
        });
        localStorage.setItem('settings', JSON.stringify(newSettings));
    }

    createTaskListEntry(item: TaskItemData) {
        const settings = this.state.settings;
        return (<TaskItem key={item.UUID}
                          text={item.text}
                          done={item.done}
                          UUID={item.UUID}
                          onDelete={() => this.handleDelete(item)}
                          onDone={() => this.handleDone(item)}
                          onEdit={() => this.handleEdit(item)}
                          visibleConfirm={settings.showConfirmDialog}
                          clickableLinks={settings.clickableLinks}
        />);
    }

    createCustomSwitch(onChangeMethod: any, checkedStateBind: boolean) {
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
            return !task.done;
        }).length;
    }

    render() {
        let taskListItems;
        if (this.state.taskListEntries) {
            let tasks = this.state.taskListEntries;

            if (this.state.settings.hideDone) {
                tasks = tasks.filter(task => {
                    return !task.done;
                });
            } else if (this.state.settings.showActiveTasksFirst) {
                let activeTasks: TaskItemData[] = [], doneTasks: TaskItemData[] = [];
                tasks.forEach(task => {
                    if (task.done) {
                        doneTasks.push(task);
                    } else {
                        activeTasks.push(task);
                    }
                });

                tasks = activeTasks.concat(doneTasks);
            }

            taskListItems = tasks.map((item: TaskItemData) => {
                return this.createTaskListEntry(item);
            });
        }

        return (
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Header style={{color: 'white'}}>JobTracker</Header>
                <Content style={{padding: '0 25px'}}>
                    <div className="layout-content">
                        <Tabs defaultActiveKey="1" type="card">
                            <Tabs.TabPane tab={<span><HomeOutlined/> Home</span>} key="1">
                                <div className="button-group">
                                    <Button
                                        onClick={this.handleMarkAllDone}
                                        disabled={!this.activeTaskCount()}
                                    >
                                        Mark all done
                                    </Button>
                                </div>
                                <div className="input-container">
                                    <Search
                                        placeholder="Type task here..."
                                        allowClear
                                        enterButton={<PlusOutlined/>}
                                        value={this.state.newTaskText}
                                        onSearch={this.handleSubmit}
                                        onChange={this.handleInput}
                                        style={{width: 400}}
                                    />
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
                                        <th> Action name</th>
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
                                        <td>Hide completed tasks</td>
                                        <td>
                                            {this.createCustomSwitch(this.handleHideDoneTasks, this.state.settings.hideDone)}
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
                    </div>

                </Content>
                <Footer style={{
                    textAlign: 'center',
                    fontWeight: 'lighter',
                    padding: 5,
                }}
                >
                    &copy; {UTIL.getCopyrightDate()} | hubatruck
                </Footer>
            </Layout>
        );
    }
}

export default App;
