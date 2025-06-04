'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Demo数据
const transactionData = [
  { name: '1月', value: 15000 },
  { name: '2月', value: 25000 },
  { name: '3月', value: 18000 },
  { name: '4月', value: 30000 },
  { name: '5月', value: 28000 },
  { name: '6月', value: 35000 },
]

const stakingData = [
  { name: '1月', locked: 2000000, flexible: 1500000 },
  { name: '2月', locked: 2200000, flexible: 1600000 },
  { name: '3月', locked: 2400000, flexible: 1800000 },
  { name: '4月', locked: 2600000, flexible: 2000000 },
  { name: '5月', locked: 2800000, flexible: 2200000 },
  { name: '6月', locked: 3000000, flexible: 2400000 },
]

const distributionData = [
  { name: '质押', value: 5400000 },
  { name: '流动性挖矿', value: 2500000 },
  { name: '治理', value: 1500000 },
  { name: '生态基金', value: 500000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function StatsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 交易量趋势图 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">每月交易量趋势</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="交易量" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 质押数据图 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">质押数据趋势</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stakingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="locked" fill="#8884d8" name="锁定质押" />
              <Bar dataKey="flexible" fill="#82ca9d" name="灵活质押" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 代币分布图 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">代币分布</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 