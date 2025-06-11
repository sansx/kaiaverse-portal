"use client";

import MoreDetailsCard from "@/components/MoreDetailsCard";
import { useRef, useState } from "react";

export default function StatsCharts() {
  // miniapp 区域 iframe 加载
  const [miniLoading, setMiniLoading] = useState(true);
  const miniIframeCount = 3;
  const miniLoadedCount = useRef(0);
  const handleMiniIframeLoad = () => {
    miniLoadedCount.current += 1;
    if (miniLoadedCount.current >= miniIframeCount) {
      setMiniLoading(false);
    }
  };

  // count data 区域 iframe 加载
  const [countLoading, setCountLoading] = useState(true);
  const countIframeCount = 2;
  const countLoadedCount = useRef(0);
  const handleCountIframeLoad = () => {
    countLoadedCount.current += 1;
    if (countLoadedCount.current >= countIframeCount) {
      setCountLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <MoreDetailsCard
        href="https://dune.com/kaia_foundation/kaia-wave"
        linkText="kaia-wave"
        loading={miniLoading}
      >
        {/* miniapp */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row gap-4">
            {/* mini count */}
            <div className="flex flex-col w-1/2">
              <iframe
                src="https://dune.com/embeds/4853563/8040083"
                className="w-full h-[165px] rounded-lg shadow-md border-0 bg-white mb-[20px]"
                allowFullScreen
                onLoad={handleMiniIframeLoad}
              />
              <iframe
                src="https://dune.com/embeds/4853563/8040086"
                className="w-full h-[165px] rounded-lg shadow-md border-0 bg-white"
                allowFullScreen
                onLoad={handleMiniIframeLoad}
              />
            </div>
            <div className="w-1/2 flex items-stretch">
              <iframe
                src="https://dune.com/embeds/4853256/8039492"
                className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white"
                allowFullScreen
                onLoad={handleMiniIframeLoad}
              />
            </div>
          </div>
        </div>
      </MoreDetailsCard>
      <MoreDetailsCard
        href="https://dune.com/kaia_foundation/kaia-official-dashboard"
        linkText="kaia-official-dashboard"
        loading={countLoading}
      >
        {/* count data */}
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/2">
            <iframe
              src="https://dune.com/embeds/5255145/8634576"
              className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white"
              allowFullScreen
              onLoad={handleCountIframeLoad}
            />
          </div>
          <div className="w-1/2">
            <iframe
              src="https://dune.com/embeds/5255151/8634590"
              className="w-full h-[350px] rounded-lg shadow-md border-0 bg-white"
              allowFullScreen
              onLoad={handleCountIframeLoad}
            />
          </div>
        </div>
      </MoreDetailsCard>
      {/* trend chart */}
      {/* <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-1/2">
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
        <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-1/2">
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
      </div> */}

      {/* 代币分布图 */}
      {/* <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
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
