import { Card, Form, Input, Button, message } from 'antd';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const { userInfo } = useAuthStore();
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    console.log('保存设置:', values);
    message.success('设置已保存');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>个人设置</h2>
      <Card style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: userInfo?.username || '',
            phone: userInfo?.phone || '',
            email: userInfo?.email || '',
          }}
          onFinish={handleSave}
        >
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
