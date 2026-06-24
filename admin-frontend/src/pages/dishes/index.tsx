import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Space, Button, Input, Select, Image, message, Modal, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Dish } from '@/types';
import { getDishes, deleteDish } from '@/api/dishes';
import { formatCurrency } from '@/utils/helpers';

export default function DishesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<0 | 1 | undefined>();

  useEffect(() => {
    fetchDishes();
  }, [page, pageSize, statusFilter]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const result = await getDishes({ page, pageSize, name: nameFilter || undefined, status: statusFilter });
      setData(result.list);
      setTotal(result.total);
    } catch {
      const mockData: Dish[] = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: ['鱼香肉丝', '宫保鸡丁', '麻婆豆腐', '糖醋里脊', '水煮鱼', '回锅肉', '酸辣土豆丝', '西红柿炒蛋', '红烧排骨', '清炒时蔬', '东坡肉', '烤鸭'][i],
        description: '美味可口',
        price: 18 + Math.random() * 50,
        image: '',
        categoryId: (i % 4) + 1,
        categoryName: ['川菜', '湘菜', '粤菜', '鲁菜'][i % 4],
        shopId: 200 + (i % 5),
        shopName: `商家${(i % 5) + 1}`,
        status: i % 5 === 0 ? 0 : 1,
        salesCount: 50 + Math.floor(Math.random() * 300),
        rating: 3.5 + Math.random() * 1.5,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }));
      setData(mockData);
      setTotal(36);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该菜品？',
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          await deleteDish(id);
          message.success('删除成功');
          fetchDishes();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<Dish> = [
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
    },
    {
      title: '商家',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 120,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount',
      width: 80,
      sorter: (a, b) => a.salesCount - b.salesCount,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating) => rating?.toFixed(1),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '在售' : '停售'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/dishes/${record.id}/edit`)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>菜品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dishes/new')}>
          新增菜品
        </Button>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索菜品名称"
            prefix={<SearchOutlined />}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="售卖状态"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '在售', value: 1 },
              { label: '停售', value: 0 },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => { setPage(1); fetchDishes(); }}>
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setNameFilter(''); setStatusFilter(undefined); setPage(1); }}>
            重置
          </Button>
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 900 }}
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
