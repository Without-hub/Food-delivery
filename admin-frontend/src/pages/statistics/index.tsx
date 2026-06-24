import { useState } from 'react';
import { Row, Col, Card, DatePicker, Space, Table, Statistic } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState<[string, string]>(['2024-06-01', '2024-06-22']);

  // 营收趋势数据
  const revenueOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['总营收', '订单量'] },
    xAxis: { type: 'category' as const, data: ['06-01', '06-04', '06-07', '06-10', '06-13', '06-16', '06-19', '06-22'] },
    yAxis: [
      { type: 'value' as const, name: '营收 (元)' },
      { type: 'value' as const, name: '订单量' },
    ],
    series: [
      {
        name: '总营收',
        type: 'bar',
        data: [5200, 5800, 6200, 7100, 6800, 7560, 8230, 8560],
        itemStyle: { color: '#1677ff' },
      },
      {
        name: '订单量',
        type: 'line',
        yAxisIndex: 1,
        data: [85, 92, 105, 118, 110, 128, 135, 142],
        itemStyle: { color: '#52c41a' },
      },
    ],
    grid: { left: 60, right: 60, top: 40, bottom: 30 },
  };

  // 订单状态分布数据
  const orderStatusOption = {
    tooltip: { trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        label: { show: true, formatter: '{b}: {c} ({d}%)' },
        data: [
          { name: '待支付', value: 156, itemStyle: { color: '#faad14' } },
          { name: '待接单', value: 235, itemStyle: { color: '#1677ff' } },
          { name: '备餐中', value: 189, itemStyle: { color: '#722ed1' } },
          { name: '配送中', value: 168, itemStyle: { color: '#13c2c2' } },
          { name: '已完成', value: 2856, itemStyle: { color: '#52c41a' } },
          { name: '已取消', value: 98, itemStyle: { color: '#d9d9d9' } },
        ],
      },
    ],
  };

  // 热销菜品TOP10数据
  const topDishColumns = [
    { title: '排名', key: 'rank', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '所属分类', dataIndex: 'category', key: 'category' },
    { title: '总销量', dataIndex: 'salesCount', key: 'salesCount', sorter: (a: { salesCount: number }, b: { salesCount: number }) => b.salesCount - a.salesCount },
    { title: '营收金额', dataIndex: 'revenue', key: 'revenue', render: (val: number) => `¥${val.toFixed(2)}`, sorter: (a: { revenue: number }, b: { revenue: number }) => b.revenue - a.revenue },
  ];

  const topDishData = [
    { name: '鱼香肉丝', category: '川菜', salesCount: 856, revenue: 23968 },
    { name: '宫保鸡丁', category: '川菜', salesCount: 752, revenue: 21056 },
    { name: '麻婆豆腐', category: '川菜', salesCount: 698, revenue: 13960 },
    { name: '糖醋里脊', category: '鲁菜', salesCount: 635, revenue: 22225 },
    { name: '水煮鱼', category: '川菜', salesCount: 586, revenue: 29300 },
    { name: '回锅肉', category: '湘菜', salesCount: 523, revenue: 15690 },
    { name: '红烧排骨', category: '鲁菜', salesCount: 498, revenue: 22410 },
    { name: '酸辣土豆丝', category: '湘菜', salesCount: 465, revenue: 6975 },
    { name: '西红柿炒蛋', category: '家常菜', salesCount: 432, revenue: 6480 },
    { name: '清炒时蔬', category: '粤菜', salesCount: 398, revenue: 5970 },
  ];

  // 商家排行数据
  const shopRankColumns = [
    { title: '排名', key: 'rank', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '商家名称', dataIndex: 'name', key: 'name' },
    { title: '订单量', dataIndex: 'orderCount', key: 'orderCount', sorter: (a: { orderCount: number }, b: { orderCount: number }) => b.orderCount - a.orderCount },
    { title: '总营收', dataIndex: 'revenue', key: 'revenue', render: (val: number) => `¥${val.toFixed(2)}`, sorter: (a: { revenue: number }, b: { revenue: number }) => b.revenue - a.revenue },
    { title: '平均评分', dataIndex: 'rating', key: 'rating', render: (val: number) => `${val.toFixed(1)} 分` },
  ];

  const shopRankData = [
    { name: '老王快餐', orderCount: 1256, revenue: 62800, rating: 4.5 },
    { name: '川味轩', orderCount: 1120, revenue: 56000, rating: 4.3 },
    { name: '湘菜馆', orderCount: 986, revenue: 49300, rating: 4.6 },
    { name: '粤港茶餐厅', orderCount: 856, revenue: 59920, rating: 4.2 },
    { name: '东北饺子王', orderCount: 768, revenue: 26880, rating: 4.0 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据统计分析</h2>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>时间范围：</span>
          <RangePicker
            onChange={(_, dateStrings) => {
              if (dateStrings[0] && dateStrings[1]) {
                setDateRange([dateStrings[0], dateStrings[1]]);
              }
            }}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="总订单数" value={15860} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="总营收" value={986520} precision={2} prefix={<DollarOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="注册用户" value={5280} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="入驻商家" value={186} prefix={<ShopOutlined />} /></Card>
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
            <Table dataSource={topDishData} columns={topDishColumns} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="商家营收排行 Top5">
            <Table dataSource={shopRankData} columns={shopRankColumns} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
