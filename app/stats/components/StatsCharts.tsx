"use client";

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
} from "recharts";
import MoreDetailsCard from "@/components/MoreDetailsCard";

// Demo数据
const transactionData = [
  { name: "1月", value: 15000 },
  { name: "2月", value: 25000 },
  { name: "3月", value: 18000 },
  { name: "4月", value: 30000 },
  { name: "5月", value: 28000 },
  { name: "6月", value: 35000 },
];

const stakingData = [
  { name: "1月", locked: 2000000, flexible: 1500000 },
  { name: "2月", locked: 2200000, flexible: 1600000 },
  { name: "3月", locked: 2400000, flexible: 1800000 },
  { name: "4月", locked: 2600000, flexible: 2000000 },
  { name: "5月", locked: 2800000, flexible: 2200000 },
  { name: "6月", locked: 3000000, flexible: 2400000 },
];

export default function StatsCharts() {
  return (
    <div className="flex flex-col gap-8">
      <MoreDetailsCard
        href="https://dune.com/kaia_foundation/kaia-wave"
        linkText="kaia-wave"
      >
        {/* miniapp */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row gap-4">
            {/* mini count */}
            <div className="flex flex-col w-1/2">
              <iframe
                src="https://dune.com/embeds/4853563/8040083"
                className="w-full h-[165px] rounded-lg shadow-md border-0 bg-white dark:bg-gray-800 mb-[20px]"
                allowFullScreen
              />
              <iframe
                src="https://dune.com/embeds/4853563/8040086"
                className="w-full h-[165px] rounded-lg shadow-md border-0 bg-white dark:bg-gray-800"
                allowFullScreen
              />
            </div>
            <div className="w-1/2 flex items-stretch">
              <iframe
                src="https://dune.com/embeds/4853256/8039492"
                className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white dark:bg-gray-800"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </MoreDetailsCard>
      <MoreDetailsCard
        href="https://dune.com/kaia_foundation/kaia-official-dashboard"
        linkText="kaia-official-dashboard"
      >
        {/* count data */}
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/2">
            <iframe
              src="https://dune.com/embeds/5255145/8634576"
              className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white dark:bg-gray-800"
              allowFullScreen
            />
          </div>
          <div className="w-1/2">
            <iframe
              src="https://dune.com/embeds/5255151/8634590"
              className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white dark:bg-gray-800"
              allowFullScreen
            />
          </div>
        </div>
      </MoreDetailsCard>
      {/* trend chart */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* 交易量趋势图 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">每月交易量趋势</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="交易量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 质押数据图 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm w-full md:w-1/2">
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
      </div>

      {/* 代币分布图 */}
      {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm lg:col-span-2">
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
      </div> */}
    </div>
  );
}
