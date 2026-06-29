import { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Select, Input, Rate, Modal, message, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Review } from '@/types';
import { getReviews, replyReview, updateReviewStatus, deleteReview } from '@/api/reviews';
import { formatDate } from '@/utils/helpers';

export default function ReviewsPage() {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<0 | 1 | undefined>();
  const [replyVisible, setReplyVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize, statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await getReviews({ page, pageSize, status: statusFilter });
      setData(result.list);
      setTotal(result.total);
    } catch {
      message.error('获取评价列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyContent.trim()) return;
    try {
      await replyReview(selectedReview.id, replyContent);
      message.success('回复成功');
      setReplyVisible(false);
      setReplyContent('');
      fetchReviews();
    } catch {
      message.error('回复失败');
    }
  };

  const handleStatusChange = async (id: number, status: 0 | 1) => {
    try {
      await updateReviewStatus(id, status);
      message.success(`评价已${status === 1 ? '显示' : '隐藏'}`);
      fetchReviews();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该评价？',
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          await deleteReview(id);
          message.success('删除成功');
          fetchReviews();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<Review> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户', dataIndex: 'userName', key: 'userName', width: 100 },
    { title: '商家', dataIndex: 'shopName', key: 'shopName', width: 120 },
    { title: '菜品', dataIndex: 'dishName', key: 'dishName', width: 120 },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (rating: number) => <Rate disabled allowHalf value={rating} />,
    },
    { title: '评价内容', dataIndex: 'content', key: 'content', width: 200, ellipsis: true },
    {
      title: '回复状态',
      key: 'replied',
      width: 100,
      render: (_, record) => (record.replyContent ? <Tag color="green">已回复</Tag> : <Tag>未回复</Tag>),
    },
    {
      title: '显示状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '显示' : '隐藏'}</Tag>
      ),
    },
    { title: '评价时间', dataIndex: 'createTime', key: 'createTime', width: 170, render: (t: string) => formatDate(t) },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_, record) => (
        <Space size="small">
          {!record.replyContent && (
            <Button type="link" size="small" onClick={() => { setSelectedReview(record); setReplyContent(''); setReplyVisible(true); }}>
              回复
            </Button>
          )}
          {record.status === 1 ? (
            <Button type="link" size="small" onClick={() => handleStatusChange(record.id, 0)}>隐藏</Button>
          ) : (
            <Button type="link" size="small" onClick={() => handleStatusChange(record.id, 1)}>显示</Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>评价管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="显示状态"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '显示', value: 1 },
              { label: '隐藏', value: 0 },
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
          scroll={{ x: 1300 }}
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
        title="回复评价"
        open={replyVisible}
        onOk={handleReply}
        onCancel={() => setReplyVisible(false)}
        okText="提交回复"
      >
        <div style={{ marginBottom: 12 }}>
          <p><strong>用户评价：</strong></p>
          <p style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{selectedReview?.content}</p>
        </div>
        <Input.TextArea
          rows={4}
          placeholder="请输入回复内容..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
      </Modal>
    </div>
  );
}
