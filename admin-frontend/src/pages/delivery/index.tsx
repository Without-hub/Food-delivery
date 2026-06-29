import { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Select, Modal, message, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Delivery } from '@/types';
import { DeliveryStatusMap } from '@/types';
import { getDeliveries, assignRider, getAvailableRiders, updateDeliveryStatus } from '@/api/delivery';
import { formatDate } from '@/utils/helpers';

export default function DeliveryPage() {
  const [data, setData] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [assignVisible, setAssignVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [riders, setRiders] = useState<{ id: number; name: string; phone: string }[]>([]);
  const [selectedRider, setSelectedRider] = useState<number | undefined>();

  useEffect(() => {
    fetchDeliveries();
  }, [page, pageSize, statusFilter]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const result = await getDeliveries({ page, pageSize, status: statusFilter });
      setData(result.list);
      setTotal(result.total);
    } catch {
      message.error('获取配送列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRider = async () => {
    if (!selectedDelivery || !selectedRider) return;
    try {
      await assignRider(selectedDelivery.id, selectedRider);
      message.success('骑手分配成功');
      setAssignVisible(false);
      fetchDeliveries();
    } catch {
      message.error('分配失败');
    }
  };

  const openAssignModal = async (record: Delivery) => {
    setSelectedDelivery(record);
    setSelectedRider(undefined);
    try {
      const riderList = await getAvailableRiders();
      setRiders(riderList);
    } catch {
      message.error('获取可用骑手列表失败');
    }
    setAssignVisible(true);
  };

  const statusColors: Record<number, string> = { 0: 'red', 1: 'blue', 2: 'processing', 3: 'success' };

  const columns: ColumnsType<Delivery> = [
    { title: '配送单ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    {
      title: '配送状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => <Tag color={statusColors[status]}>{DeliveryStatusMap[status as keyof typeof DeliveryStatusMap]}</Tag>,
    },
    { title: '骑手', dataIndex: 'riderName', key: 'riderName', width: 100, render: (name: string) => name || '-' },
    { title: '骑手电话', dataIndex: 'riderPhone', key: 'riderPhone', width: 130, render: (phone: string) => phone || '-' },
    {
      title: '取餐地址',
      dataIndex: 'pickupAddress',
      key: 'pickupAddress',
      width: 200,
      ellipsis: true,
    },
    {
      title: '送达地址',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 200,
      ellipsis: true,
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170, render: (t: string) => formatDate(t) },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 0 && (
            <Button type="link" size="small" icon={<UserOutlined />} onClick={() => openAssignModal(record)}>
              分配骑手
            </Button>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" onClick={async () => {
              try {
                await updateDeliveryStatus(record.id, 2);
                message.success('已标记为配送中');
                fetchDeliveries();
              } catch { message.error('操作失败'); }
            }}>
              开始配送
            </Button>
          )}
          {record.status === 2 && (
            <Button type="link" size="small" onClick={async () => {
              try {
                await updateDeliveryStatus(record.id, 3);
                message.success('已标记为已送达');
                fetchDeliveries();
              } catch { message.error('操作失败'); }
            }}>
              确认送达
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>配送管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="配送状态"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '待分配', value: 0 },
              { label: '待取餐', value: 1 },
              { label: '配送中', value: 2 },
              { label: '已送达', value: 3 },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => { setStatusFilter(undefined); setPage(1); }}>重置</Button>
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
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
        title="分配骑手"
        open={assignVisible}
        onOk={handleAssignRider}
        onCancel={() => setAssignVisible(false)}
        okText="确认分配"
      >
        <div style={{ marginBottom: 16 }}>
          {selectedDelivery && (
            <Descriptions size="small" column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="配送单ID">{selectedDelivery.id}</Descriptions.Item>
              <Descriptions.Item label="取餐地址">{selectedDelivery.pickupAddress}</Descriptions.Item>
              <Descriptions.Item label="送达地址">{selectedDelivery.deliveryAddress}</Descriptions.Item>
            </Descriptions>
          )}
        </div>
        <Select
          placeholder="请选择骑手"
          value={selectedRider}
          onChange={(val) => setSelectedRider(val)}
          style={{ width: '100%' }}
          options={riders.map((r) => ({ label: `${r.name} (${r.phone})`, value: r.id }))}
        />
      </Modal>
    </div>
  );
}
