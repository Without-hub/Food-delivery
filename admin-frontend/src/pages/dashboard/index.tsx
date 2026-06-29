import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { getDashboardStats } from '@/api/dashboard';
import type { DashboardStats } from '@/types';
import { OrderStatusMap, OrderStatusColorMap } from '@/types';
import { formatCurrency } from '@/utils/helpers';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      // 接口请求失败，保留 stats 为 null
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }} />;
  }

  const revenueChartOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: stats?.dailyRevenue.map((d) => d.date) },
    yAxis: { type: 'value' as const, name: '金额 (元)' },
    series: [
      {
        data: stats?.dailyRevenue.map((d) => d.revenue),
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 },
        itemStyle: { color: '#1677ff' },
      },
    ],
    grid: { left: 60, right: 20, top: 20, bottom: 30 },
  };

  const orderStatusOption = {
    tooltip: { trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: stats?.orderStatusDistribution.map((d) => ({
          name: OrderStatusMap[d.status],
          value: d.count,
        })),
        label: { show: true, formatter: '{b}: {c}' },
      },
    ],
  };

  const topDishColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '销量', dataIndex: 'salesCount', key: 'salesCount', sorter: (a: { salesCount: number }, b: { salesCount: number }) => b.salesCount - a.salesCount },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="今日订单数"
              value={stats?.todayOrderCount}
              prefix={<ShoppingCartOutlined />}
              suffix={<span style={{ fontSize: 14, color: '#52c41a' }}><ArrowUpOutlined /> 12%</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="今日营收"
              value={stats?.todayRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={<span style={{ fontSize: 14, color: '#52c41a' }}><ArrowUpOutlined /> 8%</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="今日新增用户"
              value={stats?.todayNewUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="累计营收"
              value={stats?.totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="近7日营收趋势">
            <ReactECharts option={revenueChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="订单状态分布">
            <ReactECharts option={orderStatusOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="热销菜品 Top5">
            <Table
              dataSource={stats?.topDishes}
              columns={topDishColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统概况">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="总订单数" value={stats?.totalOrders} prefix={<ShoppingCartOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="总用户数" value={stats?.totalUsers} prefix={<UserOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="商家总数" value={stats?.totalShops} prefix={<ShopOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="菜品总数" value={stats?.totalDishes} prefix={<ShopOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
