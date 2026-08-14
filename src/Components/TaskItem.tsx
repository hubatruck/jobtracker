import "./TaskItem.css";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ShowUrls } from "./ShowUrls";

export type TaskItemProps = {
  text: string;
  active: boolean;
  UUID: string;
  onDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
  visibleConfirm: boolean;
  clickableLinks: boolean;
};

export const TaskItem = ({
  active,
  text,
  onDelete,
  onDone,
  onEdit,
  visibleConfirm,
  clickableLinks,
}: TaskItemProps) => (
  <div className={`TaskItem-container ${active ? "" : "TaskItem-dimmed"}`}>
    <div className="TaskItem-controls button-group">
      <Tooltip title={`Mark as ${active ? "completed" : "active"}`}>
        <Button
          onClick={onDone}
          icon={active ? <CheckOutlined /> : <CloseOutlined />}
          style={{ backgroundColor: "#70C040" }}
        />
      </Tooltip>
      <Tooltip title="Edit task">
        <Button onClick={onEdit} icon={<EditOutlined />} />
      </Tooltip>
      {visibleConfirm ? (
        <Popconfirm
          title="Are you sure you want to delete this task?"
          okText="Yes"
          cancelText="Nah"
          onConfirm={onDelete}
          placement="right"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ) : (
        <Button icon={<DeleteOutlined />} danger onClick={onDelete} />
      )}
    </div>
    <div className="TaskItem-text">
      <ShowUrls text={text} convertLinks={clickableLinks} />
    </div>
  </div>
);
