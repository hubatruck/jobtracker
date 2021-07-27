import React from 'react';
import './App.css';
import {TaskItem, TaskItemProp} from "./Components/TaskItem";
import "./Util";
import {UTIL} from "./Util";

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
                    />
                )
            });
        }

        return (
            <div className="App">
                <header className="App-header">JobTracker</header>
                <div className="App-main-container">
                    <main className="App-main">
                        <div className="App-input-container">
                            <input type="text" value={this.state.newTaskText} placeholder="Type task here..."
                                   onChange={this.handleInput}/>
                            <button onClick={this.handleSubmit}>Add</button>
                        </div>
                        <div className="App-task-container">
                            {taskListItems}
                        </div>
                    </main>
                </div>
                <footer className="App-footer">&copy; {UTIL.getCopyrightDate()} | hubatruck</footer>
            </div>
        );
    }
}

export default App;
