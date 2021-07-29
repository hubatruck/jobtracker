import React from 'react';
import {Button, Form, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

type TaskInputProps = {
    onSubmit: (values: { taskName: string }) => void;
    clearOnSubmit?: boolean;
    initialValue?: string;
}

export type TaskInputFormData = {
    taskName: string;
}

/// Note that useForm is a React Hooks that only works in functional component.
export default function TaskInput(props: TaskInputProps) {
    const [form] = Form.useForm<TaskInputFormData>();

    /// Not the pretties solution, but it works
    if (props.initialValue) {
        setTimeout(() => {
            form.setFieldsValue({taskName: props.initialValue});
        }, 0);
    }

    return (
        <Form
            name="newTaskForm"
            preserve={false}
            onFinish={data => {
                if (props.clearOnSubmit) {
                    form.resetFields();
                }
                props.onSubmit(data);
            }}
            form={form}
        >
            <Form.Item name="taskName">
                <Input.TextArea
                    placeholder="Type task here..."
                    allowClear
                    style={{width: 400}}
                    autoSize={{minRows: 2}}
                    showCount
                    maxLength={2000}
                    onPressEnter={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (event.ctrlKey || event.shiftKey) {
                            form.submit();
                        }
                    }}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined/>}
                    style={{marginTop: '5px'}}
                > Add </Button>
            </Form.Item>
        </Form>);
}
