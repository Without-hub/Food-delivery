import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Space, Button, Input, Select, message, Rate } from 'antd';
import { EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Shop } from '@/types';
import { getShops, updateShopStatus } from '@/api/shops';

export default function ShopsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | undefined>();

  useEffect(() => {
    fetchShops();
  }, [page, pageSize, statusFilter]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const result = await getShops({ page, pageSize, name: nameFilter || undefined, status: statusFilter });
      setData(result.list);
      setTotal(result.total);
    } catch {
      const mockData: Shop[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: ['老王快餐', '川味轩', '湘菜馆', '粤港茶餐厅', '东北饺子王', '兰州拉面', '沙县小吃', '黄焖鸡米饭', '海底捞', '肯德基'][i],
        description: '美味餐厅',
        phone: `1380000${String(1000 + i).slice(1)}`,
        address: `北京市朝阳区街道${i + 1}号`,
        latitude: 39.9,
        longitude: 116.4,
        image: '',
        status: i % 6 === 0 ? 0 : i % 5 === 0 ? 2 : 1,
        rating: 3.5 + Math.random() * 1.5,
        salesCount: 100 + Math.floor(Math.random() * 900),
        deliveryFee: i % 3 === 0 ? 0 : 5,
        minOrderAmount: 20,
        openingTime: '08:00',
        closingTime: '22:00',
        categoryId: (i % 4) + 1,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }));
      setData(mockData);
      setTotal(28);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 0 | 1 | 2) => {
    try {
      await updateShopStatus(id, status);
      message.success('状态更新成功');
      fetchShops();
    } catch {
      message.error('状态更新失败');
    }
  };

  const statusMap: Record<number, { color: string; text: string }> = {
    0: { color: 'red', text: '关闭' },
    1: { color: 'green', text: '营业中' },
    2: { color: 'orange', text: '休息中' },
  };

  const columns: ColumnsType<Shop> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '商家名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number) => <Rate disabled allowHalf value={rating} />,
    },
    { title: '月销量', dataIndex: 'salesCount', key: 'salesCount', width: 80, sorter: (a, b) => a.salesCount - b.salesCount },
    { title: '配送费', dataIndex: 'deliveryFee', key: 'deliveryFee', width: 80, render: (fee: number) => fee === 0 ? '免配送费' : `¥${fee}` },
    {
      title: '营业状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.text || '未知'}</Tag>,
    },
    { title: '营业时间', key: 'hours', width: 130, render: (_, record) => `${record.openingTime} - ${record.closingTime}` },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/shops/${record.id}`)}>
            详情
          </Button>
          <Select
            size="small"
            value={record.status}
            onChange={(val) => handleStatusChange(record.id, val)}
            style={{ width: 90 }}
            options={[
              { label: '营业中', value: 1 },
              { label: '休息中', value: 2 },
              { label: '关闭', value: 0 },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>商家管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索商家名称"
            prefix={<SearchOutlined />}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="营业状态"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '营业中', value: 1 },
              { label: '休息中', value: 2 },
              { label: '关闭', value: 0 },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => { setPage(1); fetchShops(); }}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setNameFilter(''); setStatusFilter(undefined); setPage(1); }}>重置</Button>
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1100 }}
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
    </div>
  );
}
