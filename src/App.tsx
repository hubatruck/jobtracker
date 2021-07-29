import React, {ReactElement} from 'react';
import './App.css';
import {TaskItem} from './Components/TaskItem';
import {UTIL} from './Util';
import {Button, Layout, message, Popconfirm, Tabs} from 'antd';
import {ClearOutlined, HomeOutlined, SettingOutlined, ThunderboltOutlined} from '@ant-design/icons';
import {WidthLimitedContainer} from './Components/WidthLimitedContainer';
import {version} from '../package.json';
import scrollIntoView from 'scroll-into-view-if-needed';
import TaskInput from './Components/TaskInput';
import {ISettings, SettingsPage} from './Pages/SettingsPage';

const {Header, Content, Footer} = Layout;

type TaskItemData = {
    text: string;
    UUID: string;
    active: boolean;
}

type AppState = {
    newTaskText: string;
    taskListEntries: TaskItemData[];
    settings: ISettings;
}

const defaultSettings: ISettings = {
    showConfirmDialog: true,
    showActiveTasksFirst: false,
    showCompleted: true,
    clickableLinks: true,
};

class App extends React.Component<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            newTaskText: '',
            settings: {
                ...defaultSettings,
                ...JSON.parse(localStorage.getItem('settings') || JSON.stringify({}))
            },
            taskListEntries: []
        };

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
        this.setState({taskListEntries: tasks});
    }

    handleMarkAllDone(): void {
        const tasks = this.state.taskListEntries.map((task: TaskItemData) => {
            task.active = false;
            return task;
        });
        this.updateTasks(tasks);
        message.info('All tasks marked completed!').then(() => {
        });
    }

    handleDeleteAllCompleted(): void {
        const tasks = this.state.taskListEntries.filter((task: TaskItemData) => {
            return task.active;
        })
        this.updateTasks(tasks);
        message.info('Cleared completed tasks!').then(() => {
        });
    }

    handleSubmit(submittedValues: { taskName: string }): void {
        const tasks = this.state.taskListEntries.slice();
        const newTask = submittedValues.taskName;

        if (!newTask) {
            return;
        }

        tasks.push({
            text: newTask,
            UUID: Date.now().toString() + '_' + UTIL.randomHex(),
            active: true,
        });

        this.setState({
            newTaskText: '',
        });
        this.updateTasks(tasks);
        message.success('Task created!').then(() => {
        });
    }

    handleDelete(task: TaskItemData): void {
        const tasks = this.state.taskListEntries.slice();
        const deletedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        if (deletedElIdx >= 0) {
            tasks.splice(deletedElIdx, 1);
            this.updateTasks(tasks);
        }
        message.info('Task deleted successfully').then(() => {
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
                document.body.querySelector('.input-container') as Element,
                {
                    behavior: 'smooth',
                    scrollMode: 'if-needed'
                });
        }
    }

    handleDone(task: TaskItemData): void {
        const fromTopX = window.scrollX, fromTopY = window.scrollY;
        const tasks = this.state.taskListEntries.slice();
        const updatedElIdx = tasks.findIndex(el => task.UUID === el.UUID);
        tasks[updatedElIdx] = {...tasks[updatedElIdx], active: !tasks[updatedElIdx].active};
        this.updateTasks(tasks, () => {
            window.scrollTo(fromTopX, fromTopY);
        });
    }

    updateTasks(newTasks: TaskItemData[], callback?: (() => void)): void {
        this.setState({taskListEntries: newTasks}, callback);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    updateSettings(newSettings: ISettings): void {
        this.setState({
            settings: newSettings
        });
        localStorage.setItem('settings', JSON.stringify(newSettings));
        message.info('Settings updated!', 1).then(() => {
        });
    }

    createTaskListEntry(item: TaskItemData): ReactElement<TaskItem> {
        const settings = this.state.settings;
        return (
            <TaskItem
                key={item.UUID}
                text={item.text}
                active={item.active}
                UUID={item.UUID}
                onDelete={() => this.handleDelete(item)}
                onDone={() => this.handleDone(item)}
                onEdit={() => this.handleEdit(item)}
                visibleConfirm={settings.showConfirmDialog}
                clickableLinks={settings.clickableLinks}
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
                                    <TaskInput
                                        onSubmit={this.handleSubmit.bind(this)}
                                        clearOnSubmit={true}
                                    />
                                </div>
                                <hr/>
                                <div className="button-group">
                                    <Button
                                        onClick={this.handleMarkAllDone.bind(this)}
                                        disabled={!this.activeTaskCount()}
                                        icon={<ThunderboltOutlined/>}
                                    > Mark all as completed </Button>
                                    <Popconfirm
                                        title="Are you sure? This cannot be undone."
                                        okText="Yes"
                                        cancelText="Nah"
                                        onConfirm={this.handleDeleteAllCompleted.bind(this)}
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
                                <SettingsPage
                                    settings={{...this.state.settings}}
                                    onSettingUpdate={this.updateSettings.bind(this)}
                                />
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
