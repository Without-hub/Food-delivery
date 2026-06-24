import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Space, Button, Select, Input, DatePicker, message, Modal } from 'antd';
import { EyeOutlined, CloseCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Order, OrderStatus } from '@/types';
import { OrderStatusMap, OrderStatusColorMap } from '@/types';
import { getOrders, updateOrderStatus, cancelOrder, deleteOrder } from '@/api/orders';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrders({
        page,
        pageSize,
        status: statusFilter,
        orderNo: orderNo || undefined,
      });
      setData(result.list);
      setTotal(result.total);
    } catch {
      // Mock data for development
      const mockData: Order[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        orderNo: `ORD${Date.now()}${i}`,
        userId: 100 + i,
        userName: `用户${i + 1}`,
        shopId: 200 + i,
        shopName: `商家${(i % 5) + 1}`,
        totalAmount: 25 + Math.random() * 100,
        deliveryFee: 5,
        paymentMethod: i % 3 === 0 ? 'alipay' : i % 3 === 1 ? 'wechat' : 'cash',
        status: (i % 6) as OrderStatus,
        addressId: 300 + i,
        remark: i % 3 === 0 ? '少放辣' : '',
        createTime: new Date(Date.now() - i * 3600000).toISOString(),
        updateTime: new Date().toISOString(),
      }));
      setData(mockData);
      setTotal(58);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: '确认取消该订单？',
      content: '取消后不可恢复',
      onOk: async () => {
        try {
          await cancelOrder(id);
          message.success('订单已取消');
          fetchOrders();
        } catch {
          message.error('取消失败');
        }
      },
    });
  };

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      message.success('状态更新成功');
      fetchOrders();
    } catch {
      message.error('状态更新失败');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '商家',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method) => {
        const map = { alipay: '支付宝', wechat: '微信支付', cash: '货到付款' };
        return map[method as keyof typeof map] || method;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: OrderStatus) => (
        <Tag color={OrderStatusColorMap[status]}>{OrderStatusMap[status]}</Tag>
      ),
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      render: (time) => formatDate(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            详情
          </Button>
          {record.status === 0 && (
            <Button
              type="link"
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              取消
            </Button>
          )}
          {record.status === 1 && (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusChange(record.id, 2)}
            >
              确认接单
            </Button>
          )}
          {record.status === 2 && (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusChange(record.id, 3)}
            >
              开始配送
            </Button>
          )}
          {record.status === 3 && (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusChange(record.id, 4)}
            >
              确认送达
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>订单管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索订单号"
            prefix={<SearchOutlined />}
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="订单状态"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '待支付', value: 0 },
              { label: '待接单', value: 1 },
              { label: '备餐中', value: 2 },
              { label: '配送中', value: 3 },
              { label: '已完成', value: 4 },
              { label: '已取消', value: 5 },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => { setPage(1); fetchOrders(); }}>
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setOrderNo(''); setStatusFilter(undefined); setPage(1); }}>
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
