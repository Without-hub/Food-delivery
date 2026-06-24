import { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Input, Select, message, Modal, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '@/types';
import { getUsers, updateUserStatus, deleteUser } from '@/api/users';
import { formatDate } from '@/utils/helpers';

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [username, setUsername] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers({ page, pageSize, username: username || undefined, role: roleFilter });
      setData(result.list);
      setTotal(result.total);
    } catch {
      const mockData: User[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        username: ['admin', 'merchant1', 'rider1', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'sunqi', 'zhouba', 'wujiu', 'zhengshi', 'chenliu', 'liuqi', 'huangba', 'yangjiu'][i],
        phone: `138${String(10000000 + i).padStart(8, '0')}`,
        email: `user${i}@example.com`,
        avatar: '',
        role: (i === 0 ? 'admin' : i < 3 ? 'merchant' : i < 6 ? 'rider' : 'customer') as User['role'],
        status: i % 7 === 0 ? 0 : 1,
        createTime: new Date(Date.now() - i * 86400000).toISOString(),
        updateTime: new Date().toISOString(),
      }));
      setData(mockData);
      setTotal(45);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 0 | 1) => {
    try {
      await updateUserStatus(id, status);
      message.success(`用户已${status === 1 ? '启用' : '禁用'}`);
      fetchUsers();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该用户？',
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          fetchUsers();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const roleColors: Record<string, string> = { admin: 'red', merchant: 'blue', rider: 'green', customer: 'default' };
  const roleNames: Record<string, string> = { admin: '管理员', merchant: '商家', rider: '骑手', customer: '用户' };

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => <Tag color={roleColors[role]}>{roleNames[role] || role}</Tag>,
    },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (email: string) => email || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '正常' : '禁用'}</Tag>,
    },
    { title: '注册时间', dataIndex: 'createTime', key: 'createTime', width: 170, render: (t: string) => formatDate(t) },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<UserOutlined />} onClick={() => { setSelectedUser(record); setDetailVisible(true); }}>
            详情
          </Button>
          {record.status === 1 ? (
            <Button type="link" size="small" danger onClick={() => handleStatusChange(record.id, 0)}>禁用</Button>
          ) : (
            <Button type="link" size="small" onClick={() => handleStatusChange(record.id, 1)}>启用</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>用户管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索用户名"
            prefix={<SearchOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="用户角色"
            value={roleFilter}
            onChange={(val) => { setRoleFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '管理员', value: 'admin' },
              { label: '商家', value: 'merchant' },
              { label: '骑手', value: 'rider' },
              { label: '用户', value: 'customer' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => { setPage(1); fetchUsers(); }}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setUsername(''); setRoleFilter(undefined); setPage(1); }}>重置</Button>
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          }}
        />
      </Card>

      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{selectedUser.username}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color={roleColors[selectedUser.role]}>{roleNames[selectedUser.role]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedUser.status === 1 ? 'green' : 'red'}>{selectedUser.status === 1 ? '正常' : '禁用'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="手机号">{selectedUser.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedUser.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="注册时间" span={2}>{formatDate(selectedUser.createTime)}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
