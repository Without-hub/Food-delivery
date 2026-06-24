import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Space, Spin, Rate, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { Shop, Dish } from '@/types';
import { getShopDetail } from '@/api/shops';
import { formatDate } from '@/utils/helpers';

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const data = await getShopDetail(Number(id));
      setShop(data);
    } catch {
      setShop({
        id: Number(id),
        name: '老王快餐',
        description: '一家专注于中式快餐的老字号餐厅，提供各类美味可口的快餐食品。',
        phone: '13800001001',
        address: '北京市朝阳区建国路88号',
        latitude: 39.9087,
        longitude: 116.4716,
        image: '',
        status: 1,
        rating: 4.5,
        salesCount: 856,
        deliveryFee: 5,
        minOrderAmount: 20,
        openingTime: '08:00',
        closingTime: '22:00',
        categoryId: 1,
        createTime: '2024-01-15T08:00:00',
        updateTime: '2024-06-22T12:00:00',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', minHeight: 300 }} />;
  if (!shop) return null;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shops')}>返回</Button>
      </Space>
      <Card title="商家信息">
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="商家名称">{shop.name}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{shop.phone}</Descriptions.Item>
          <Descriptions.Item label="营业状态">
            <Tag color={shop.status === 1 ? 'green' : shop.status === 2 ? 'orange' : 'red'}>
              {shop.status === 1 ? '营业中' : shop.status === 2 ? '休息中' : '关闭'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="评分"><Rate disabled allowHalf value={shop.rating} /></Descriptions.Item>
          <Descriptions.Item label="月销量">{shop.salesCount}</Descriptions.Item>
          <Descriptions.Item label="配送费">{shop.deliveryFee === 0 ? '免配送费' : `¥${shop.deliveryFee}`}</Descriptions.Item>
          <Descriptions.Item label="起送价">¥{shop.minOrderAmount}</Descriptions.Item>
          <Descriptions.Item label="营业时间">{shop.openingTime} - {shop.closingTime}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>{shop.address}</Descriptions.Item>
          <Descriptions.Item label="描述" span={3}>{shop.description}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDate(shop.createTime)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDate(shop.updateTime)}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
