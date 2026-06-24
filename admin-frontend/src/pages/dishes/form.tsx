import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Select, Button, Space, message, Spin, Upload } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { getDishDetail, createDish, updateDish } from '@/api/dishes';
import { getCategories } from '@/api/categories';
import type { Category } from '@/types';

export default function DishFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const isEdit = !!id;

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchDish();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategories([
        { id: 1, name: '川菜', sort: 1, status: 1, createTime: '', updateTime: '' },
        { id: 2, name: '湘菜', sort: 2, status: 1, createTime: '', updateTime: '' },
        { id: 3, name: '粤菜', sort: 3, status: 1, createTime: '', updateTime: '' },
        { id: 4, name: '鲁菜', sort: 4, status: 1, createTime: '', updateTime: '' },
      ]);
    }
  };

  const fetchDish = async () => {
    setLoading(true);
    try {
      const data = await getDishDetail(Number(id));
      form.setFieldsValue(data);
    } catch {
      message.error('加载菜品信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateDish(Number(id), values);
        message.success('更新成功');
      } else {
        await createDish(values);
        message.success('创建成功');
      }
      navigate('/dishes');
    } catch {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', minHeight: 300 }} />;
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dishes')}>返回</Button>
      </Space>
      <Card title={isEdit ? '编辑菜品' : '新增菜品'} style={{ maxWidth: 800 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 1, price: 0, salesCount: 0 }}
        >
          <Form.Item name="name" label="菜品名称" rules={[{ required: true, message: '请输入菜品名称' }]}>
            <Input placeholder="请输入菜品名称" />
          </Form.Item>
          <Form.Item name="description" label="菜品描述">
            <Input.TextArea rows={3} placeholder="请输入菜品描述" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
              <InputNumber min={0} precision={2} prefix="¥" placeholder="0.00" />
            </Form.Item>
            <Form.Item name="categoryId" label="所属分类" rules={[{ required: true, message: '请选择分类' }]}>
              <Select style={{ width: 200 }} placeholder="请选择分类" options={categories.map((c) => ({ label: c.name, value: c.id }))} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select style={{ width: 120 }} options={[{ label: '在售', value: 1 }, { label: '停售', value: 0 }]} />
            </Form.Item>
          </Space>
          <Form.Item name="image" label="菜品图片">
            <Upload maxCount={1} action="/api/upload" listType="picture">
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '保存修改' : '创建菜品'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
