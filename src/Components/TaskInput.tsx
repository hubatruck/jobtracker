import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type TaskInputProps = {
  onSubmit: (values: { taskName: string }) => void;
  clearOnSubmit?: boolean;
  initialValue?: string;
};

export type TaskInputFormData = {
  taskName: string;
};

export const TaskInput = ({
  initialValue,
  clearOnSubmit,
  onSubmit,
}: TaskInputProps) => {
  const [form] = Form.useForm<TaskInputFormData>();

  /// Not the pretties solution, but it works
  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({ taskName: initialValue });
    }
  });

  const onFinish = (data: TaskInputFormData) => {
    if (clearOnSubmit) {
      form.resetFields();
    }
    onSubmit(data);
  };

  const onPressEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey || event.shiftKey) {
      form.submit();
    }
  };

  return (
    <Form name="newTaskForm" preserve={false} onFinish={onFinish} form={form}>
      <Form.Item name="taskName">
        <Input.TextArea
          placeholder="Type task here..."
          allowClear
          style={{ width: 400 }}
          autoSize={{ minRows: 2 }}
          showCount
          maxLength={2000}
          onPressEnter={onPressEnter}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          style={{ marginTop: "5px" }}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};
