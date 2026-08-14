import { useMemo, useState } from "react";
import "./App.css";
import { TaskItem } from "./Components/TaskItem";
import { UTIL } from "./Util";
import { Button, Layout, message, Popconfirm, Tabs } from "antd";
import {
  ClearOutlined,
  HomeOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { WidthLimitedContainer } from "./Components/WidthLimitedContainer";
import scrollIntoView from "scroll-into-view-if-needed";
import { TaskInput, type TaskInputFormData } from "./Components/TaskInput";
import { type ISettings, SettingsPage } from "./Pages/SettingsPage";

const { Header, Content, Footer } = Layout;

type TaskItemData = {
  text: string;
  UUID: string;
  active: boolean;
};

const defaultSettings: ISettings = {
  showConfirmDialog: true,
  showActiveTasksFirst: false,
  showCompleted: true,
  clickableLinks: true,
};

const App = () => {
  const [taskInputValue, setTaskInputValue] = useState("");
  const [taskListEntries, setTaskListEntries] = useState<TaskItemData[]>(
    JSON.parse(localStorage.getItem("tasks") || "[]"),
  );
  const [settings, setSettings] = useState({
    ...defaultSettings,
    ...JSON.parse(localStorage.getItem("settings") || JSON.stringify({})),
  });

  const activeTaskCount = useMemo(
    () => taskListEntries.filter((task: TaskItemData) => task.active).length,
    [taskListEntries],
  );
  const finishedTaskCount: number = useMemo(
    () => Math.max(taskListEntries.length - activeTaskCount, 0),
    [activeTaskCount, taskListEntries.length],
  );
  const visibleTasks = useMemo(() => {
    let tasks = [...taskListEntries];

    if (!settings.showCompleted) {
      tasks = taskListEntries.filter((task) => {
        return task.active;
      });
    } else if (settings.showActiveTasksFirst) {
      const activeTasks: TaskItemData[] = [],
        completedTasks: TaskItemData[] = [];
      taskListEntries.forEach((task) => {
        (task.active ? activeTasks : completedTasks).push(task);
      });

      tasks = activeTasks.concat(completedTasks);
    }

    return tasks;
  }, [settings.showActiveTasksFirst, settings.showCompleted, taskListEntries]);

  const updateTasks = (
    newTasks: TaskItemData[],
    callback?: () => void,
  ): void => {
    setTaskListEntries(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    callback?.();
  };

  const handleMarkAllDone = (): void => {
    const tasks = taskListEntries.map((task: TaskItemData) => {
      task.active = false;
      return task;
    });
    updateTasks(tasks);
    message.info("All tasks marked completed!").then(() => {});
  };

  const handleDeleteAllCompleted = (): void => {
    const tasks = taskListEntries.filter((task: TaskItemData) => {
      return task.active;
    });
    updateTasks(tasks);
    message.info("Cleared completed tasks!").then(() => {});
  };

  const handleSubmit = (submittedValues: TaskInputFormData): void => {
    const tasks = taskListEntries.slice();
    const newTask = submittedValues.taskName;

    if (!newTask) {
      return;
    }

    tasks.push({
      text: newTask,
      UUID: crypto.randomUUID(),
      active: true,
    });

    setTaskInputValue("");
    updateTasks(tasks);
    message.success("Task created!").then(() => {});
  };

  const handleDelete = (task: TaskItemData): void => {
    const tasks = [...taskListEntries.slice()];
    const deletedElIdx = tasks.findIndex((el) => task.UUID === el.UUID);
    if (deletedElIdx >= 0) {
      tasks.splice(deletedElIdx, 1);
      updateTasks(tasks);
    }
    message.info("Task deleted successfully").then(() => {});
  };

  const handleEdit = (task: TaskItemData): void => {
    const tasks = [...taskListEntries.slice()];
    const deletedElIdx = tasks.findIndex((el) => task.UUID === el.UUID);
    if (deletedElIdx >= 0) {
      tasks.splice(deletedElIdx, 1);
      setTaskInputValue(task.text);
      updateTasks(tasks);
      scrollIntoView(
        document.body.querySelector(".input-container") as Element,
        {
          behavior: "smooth",
          scrollMode: "if-needed",
        },
      );
    }
  };

  const handleDone = (task: TaskItemData): void => {
    const fromTopX = window.scrollX,
      fromTopY = window.scrollY;
    const tasks = [...taskListEntries.slice()];
    const updatedElIdx = tasks.findIndex((el) => task.UUID === el.UUID);
    tasks[updatedElIdx] = {
      ...tasks[updatedElIdx],
      active: !tasks[updatedElIdx].active,
    };
    updateTasks(tasks, () => {
      window.scrollTo(fromTopX, fromTopY);
    });
  };

  const updateSettings = (newSettings: ISettings): void => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
    message.info("Settings updated!", 1).then(() => {});
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header style={{ color: "white" }}>
        <WidthLimitedContainer>JobTracker</WidthLimitedContainer>
      </Header>
      <Content className="content">
        <WidthLimitedContainer className="content-container">
          <Tabs defaultActiveKey="1" type="card">
            <Tabs.TabPane
              tab={
                <span>
                  <HomeOutlined /> Home
                </span>
              }
              key="1"
            >
              <div className="input-container">
                <TaskInput
                  onSubmit={handleSubmit.bind(this)}
                  clearOnSubmit={true}
                  initialValue={taskInputValue}
                />
              </div>
              <hr />
              <div className="button-group">
                <Button
                  onClick={handleMarkAllDone.bind(this)}
                  disabled={!activeTaskCount}
                  icon={<ThunderboltOutlined />}
                >
                  {" "}
                  Mark all as completed{" "}
                </Button>
                <Popconfirm
                  title="Are you sure? This cannot be undone."
                  okText="Yes"
                  cancelText="Nah"
                  onConfirm={handleDeleteAllCompleted.bind(this)}
                  placement="bottom"
                  disabled={!finishedTaskCount}
                >
                  <Button
                    danger
                    disabled={!finishedTaskCount}
                    icon={<ClearOutlined />}
                  >
                    {" "}
                    Clear completed tasks{" "}
                  </Button>
                </Popconfirm>
              </div>
              <div className="App-task-container">
                {visibleTasks.map((item) => (
                  <TaskItem
                    key={item.UUID}
                    text={item.text}
                    active={item.active}
                    UUID={item.UUID}
                    onDelete={() => handleDelete(item)}
                    onDone={() => handleDone(item)}
                    onEdit={() => handleEdit(item)}
                    visibleConfirm={settings.showConfirmDialog}
                    clickableLinks={settings.clickableLinks}
                  />
                ))}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Settings
                </span>
              }
              key="2"
            >
              <SettingsPage
                settings={{ ...settings }}
                onSettingUpdate={updateSettings.bind(this)}
              />
            </Tabs.TabPane>
          </Tabs>
        </WidthLimitedContainer>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          fontWeight: "lighter",
          padding: 5,
        }}
      >
        &copy; {UTIL.getCopyrightDate()} hubatruck |
        <a
          className="footer-link"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/hubatruck/jobtracker"
        >
          &nbsp;View project on GitHub&nbsp;
        </a>
        | {APP_VERSION} ({GIT_COMMIT})
      </Footer>
    </Layout>
  );
};

export default App;
