import React from 'react';
import './App.css';
import {TaskItem, TaskItemProp} from "./Components/TaskItem";
import "./Util";
import {UTIL} from "./Util";
import {Layout} from "antd";
import Search from "antd/es/input/Search";
import {PlusOutlined} from "@ant-design/icons";

const {Header, Content, Footer} = Layout;

type AppState = {
    newTaskText: string;
    taskListEntries: TaskItemProp[];
}

class App extends React.Component<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            newTaskText: '',
            taskListEntries: []
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Load data
     */
    componentDidMount() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || JSON.stringify([]));
        this.setState({taskListEntries: tasks});
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
            taskListEntries: tasks
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

    render() {
        let taskListItems;
        if (this.state.taskListEntries) {
            taskListItems = this.state.taskListEntries.map((item) => {
                return (
                    <TaskItem key={item.UUID}
                              text={item.text}
                              done={item.done}
                              UUID={item.UUID}
                              onDelete={() => {
                                  this.handleDelete(item)
                              }}
                              onDone={() => {
                                  this.handleDone(item);
                              }}
                              onEdit={() => this.handleEdit(item)}
                    />
                )
            });
        }

        return (
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Header style={{color:'white'}}>JobTracker</Header>
                <Content style={{padding:'0 25px'}}>
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
