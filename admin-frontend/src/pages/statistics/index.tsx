import { useState, useEffect } from 'react';
import { Row, Col, Card, DatePicker, Space, Table, Statistic, Spin, message } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import {
  getStatisticsSummary,
  getRevenueTrend,
  getOrderStatusDistribution,
  getTopDishes,
  getShopRankings,
} from '@/api/statistics';
import type { StatisticsSummary, RevenueTrend, TopDish, ShopRank, OrderStatusDist } from '@/api/statistics';

const { RangePicker } = DatePicker;

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
  const [orderStatusDist, setOrderStatusDist] = useState<OrderStatusDist[]>([]);
  const [topDishes, setTopDishes] = useState<TopDish[]>([]);
  const [shopRankings, setShopRankings] = useState<ShopRank[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [summaryRes, trendRes, distRes, dishesRes, shopsRes] = await Promise.all([
        getStatisticsSummary(),
        getRevenueTrend(dateRange[0] || undefined, dateRange[1] || undefined),
        getOrderStatusDistribution(),
        getTopDishes(10),
        getShopRankings(5),
      ]);
      setSummary(summaryRes);
      setRevenueTrend(trendRes);
      setOrderStatusDist(distRes);
      setTopDishes(dishesRes);
      setShopRankings(shopsRes);
    } catch {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (_: unknown, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      setDateRange([dateStrings[0], dateStrings[1]]);
    }
  };

  const revenueOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['总营收', '订单量'] },
    xAxis: { type: 'category' as const, data: revenueTrend.map((d) => d.date) },
    yAxis: [
      { type: 'value' as const, name: '营收 (元)' },
      { type: 'value' as const, name: '订单量' },
    ],
    series: [
      {
        name: '总营收',
        type: 'bar',
        data: revenueTrend.map((d) => d.revenue),
        itemStyle: { color: '#1677ff' },
      },
      {
        name: '订单量',
        type: 'line',
        yAxisIndex: 1,
        data: revenueTrend.map((d) => d.orderCount),
        itemStyle: { color: '#52c41a' },
      },
    ],
    grid: { left: 60, right: 60, top: 40, bottom: 30 },
  };

  const orderStatusOption = {
    tooltip: { trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        label: { show: true, formatter: '{b}: {c} ({d}%)' },
        data: orderStatusDist.map((d) => ({
          name: d.name,
          value: d.value,
        })),
      },
    ],
  };

  const topDishColumns = [
    { title: '排名', key: 'rank', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '所属分类', dataIndex: 'category', key: 'category' },
    { title: '总销量', dataIndex: 'salesCount', key: 'salesCount', sorter: (a: TopDish, b: TopDish) => b.salesCount - a.salesCount },
    { title: '营收金额', dataIndex: 'revenue', key: 'revenue', render: (val: number) => `¥${val.toFixed(2)}`, sorter: (a: TopDish, b: TopDish) => b.revenue - a.revenue },
  ];

  const shopRankColumns = [
    { title: '排名', key: 'rank', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '商家名称', dataIndex: 'name', key: 'name' },
    { title: '订单量', dataIndex: 'orderCount', key: 'orderCount', sorter: (a: ShopRank, b: ShopRank) => b.orderCount - a.orderCount },
    { title: '总营收', dataIndex: 'revenue', key: 'revenue', render: (val: number) => `¥${val.toFixed(2)}`, sorter: (a: ShopRank, b: ShopRank) => b.revenue - a.revenue },
    { title: '平均评分', dataIndex: 'rating', key: 'rating', render: (val: number) => `${val.toFixed(1)} 分` },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }} />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据统计分析</h2>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>时间范围：</span>
          <RangePicker onChange={handleDateChange} />
          <span>（选择日期后刷新页面数据）</span>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="总订单数" value={summary?.totalOrders ?? 0} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="总营收" value={summary?.totalRevenue ?? 0} precision={2} prefix={<DollarOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="注册用户" value={summary?.totalUsers ?? 0} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="入驻商家" value={summary?.totalShops ?? 0} prefix={<ShopOutlined />} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="营收与订单趋势">
            <ReactECharts option={revenueOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="订单状态分布">
            <ReactECharts option={orderStatusOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="热销菜品 Top10">
            <Table dataSource={topDishes} columns={topDishColumns} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="商家营收排行 Top5">
            <Table dataSource={shopRankings} columns={shopRankColumns} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
