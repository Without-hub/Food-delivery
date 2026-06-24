import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Table, Button, Space, Spin, Timeline, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { Order } from '@/types';
import { OrderStatusMap, OrderStatusColorMap } from '@/types';
import { getOrderDetail } from '@/api/orders';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const data = await getOrderDetail(Number(id));
      setOrder(data);
    } catch {
      // 模拟数据
      setOrder({
        id: Number(id),
        orderNo: `ORD${Date.now()}${id}`,
        userId: 101,
        userName: '张三',
        shopId: 201,
        shopName: '老王快餐',
        totalAmount: 58.50,
        deliveryFee: 5,
        paymentMethod: 'alipay',
        status: 1,
        addressId: 301,
        deliveryAddress: '北京市朝阳区建国路88号SOHO现代城A座1508',
        remark: '少放辣，多加葱',
        orderItems: [
          { id: 1, orderId: Number(id), dishId: 1, dishName: '鱼香肉丝', dishImage: '', price: 28, quantity: 1, subtotal: 28 },
          { id: 2, orderId: Number(id), dishId: 2, dishName: '米饭', dishImage: '', price: 3, quantity: 2, subtotal: 6 },
          { id: 3, orderId: Number(id), dishId: 3, dishName: '紫菜蛋花汤', dishImage: '', price: 12, quantity: 1, subtotal: 12 },
        ],
        createTime: new Date(Date.now() - 3600000).toISOString(),
        updateTime: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', minHeight: 300 }} />;
  }

  if (!order) return null;

  const itemColumns = [
    { title: '菜品', dataIndex: 'dishName', key: 'dishName' },
    { title: '单价', dataIndex: 'price', key: 'price', render: (p: number) => formatCurrency(p) },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '小计', dataIndex: 'subtotal', key: 'subtotal', render: (s: number) => formatCurrency(s) },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>返回</Button>
      </Space>

      <Card title={
        <Space>
          <span>订单详情</span>
          <Tag color={OrderStatusColorMap[order.status]}>{OrderStatusMap[order.status]}</Tag>
        </Space>
      }>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
          <Descriptions.Item label="下单用户">{order.userName || order.userId}</Descriptions.Item>
          <Descriptions.Item label="商家">{order.shopName || order.shopId}</Descriptions.Item>
          <Descriptions.Item label="支付方式">
            {{ alipay: '支付宝', wechat: '微信支付', cash: '货到付款' }[order.paymentMethod]}
          </Descriptions.Item>
          <Descriptions.Item label="配送地址" span={2}>{order.deliveryAddress}</Descriptions.Item>
          <Descriptions.Item label="订单备注" span={3}>{order.remark || '无'}</Descriptions.Item>
          <Descriptions.Item label="下单时间">{formatDate(order.createTime)}</Descriptions.Item>
          <Descriptions.Item label="支付时间">{formatDate(order.payTime)}</Descriptions.Item>
          <Descriptions.Item label="完成时间">{formatDate(order.completeTime)}</Descriptions.Item>
        </Descriptions>

        <Divider>订单商品</Divider>
        <Table
          columns={itemColumns}
          dataSource={order.orderItems}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} align="right">
                <strong>总计：</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        <Divider>订单状态流转</Divider>
        <Timeline
          items={[
            { color: 'green', children: `${formatDate(order.createTime)} 订单已创建` },
            ...(order.payTime ? [{ color: 'blue', children: `${formatDate(order.payTime)} 订单已支付` }] : []),
            ...(order.deliveryTime ? [{ color: 'purple', children: `${formatDate(order.deliveryTime)} 订单配送中` }] : []),
            ...(order.completeTime ? [{ color: 'gray', children: `${formatDate(order.completeTime)} 订单已完成` }] : []),
          ]}
        />
      </Card>
    </div>
  );
}
