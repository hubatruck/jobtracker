import React from 'react';
import './App.css';
import {TaskItem, TaskItemProp} from "./Components/TaskItem";
import {UTIL} from "./Util";
import {Collapse, Layout, Switch} from "antd";
import Search from "antd/es/input/Search";
import {PlusOutlined, SettingOutlined} from "@ant-design/icons";

const {Header, Content, Footer} = Layout;

type Settings = {
    showConfirmDialog: boolean;
    showActiveTasksFirst: boolean;
    hideDone: boolean;
}

type AppState = {
    newTaskText: string;
    taskListEntries: TaskItemProp[];
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
            },
            taskListEntries: []
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShowConfirmChange = this.handleShowConfirmChange.bind(this);
        this.handleShowActiveFirst = this.handleShowActiveFirst.bind(this);
        this.handleHideDoneTasks = this.handleHideDoneTasks.bind(this);
    }

    /**
     * Load data
     */
    componentDidMount() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || JSON.stringify([]));
        const settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({showConfirmDialog: true}));
        this.setState({taskListEntries: tasks, settings: settings});
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

    handleDelete(task: TaskItemProp) {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.updateTasks(tasks);
        }
    }

    handleEdit(task: TaskItemProp) {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.setState({newTaskText: task.text});
            this.updateTasks(tasks);
        }
    }

    handleDone(task: TaskItemProp) {
        const tasks = this.state.taskListEntries.slice();
        const updatedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        tasks[updatedElIdx] = {...tasks[updatedElIdx], done: !tasks[updatedElIdx].done};
        this.updateTasks(tasks);
    }

    updateTasks(newTasks: TaskItemProp[]) {
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

    updateSettings(newSettings: Settings) {
        this.setState({
            settings: newSettings
        });
        localStorage.setItem('settings', JSON.stringify(newSettings));
    }

    createTaskListEntry(item: TaskItemProp) {
        return (<TaskItem key={item.UUID}
                          text={item.text}
                          done={item.done}
                          UUID={item.UUID}
                          onDelete={() => this.handleDelete(item)}
                          onDone={() => this.handleDone(item)}
                          onEdit={() => this.handleEdit(item)}
                          visibleConfirm={this.state.settings.showConfirmDialog}
        />);
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
                let activeTasks: TaskItemProp[] = [], doneTasks: TaskItemProp[] = [];
                tasks.forEach(task => {
                    if (task.done) {
                        doneTasks.push(task);
                    } else {
                        activeTasks.push(task);
                    }
                });

                tasks = activeTasks.concat(doneTasks);
            }

            taskListItems = tasks.map((item) => {
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
                    </div>
                    <Collapse>
                        <Collapse.Panel key={1} header="Settings" extra={<SettingOutlined/>}>
                            <table className="settings">
                                <tr>
                                    <td>Show confirm dialog when deleting</td>
                                    <td>
                                        <Switch
                                            onChange={this.handleShowConfirmChange}
                                            checked={this.state.settings.showConfirmDialog}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Show active tasks first</td>
                                    <td>
                                        <Switch
                                            onChange={this.handleShowActiveFirst}
                                            checked={this.state.settings.showActiveTasksFirst}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Hide done tasks</td>
                                    <td>
                                        <Switch
                                            onChange={this.handleHideDoneTasks}
                                            checked={this.state.settings.hideDone}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </Collapse.Panel>
                    </Collapse>
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
