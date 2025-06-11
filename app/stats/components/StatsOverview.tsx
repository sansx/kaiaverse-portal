"use client";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { MdTrendingFlat } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaNetworkWired,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import MoreDetailsCard from "@/components/MoreDetailsCard";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend: "up" | "down" | "flat";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend }) => {
  // 选择图标和颜色
  let Icon = MdTrendingFlat;
  let iconBg = "bg-gray-100";
  let iconColor = "text-gray-400";
  if (trend === "up") {
    Icon = FiTrendingUp;
    iconBg = "bg-green-100";
    iconColor = "text-green-600";
  } else if (trend === "down") {
    Icon = FiTrendingDown;
    iconBg = "bg-red-100";
    iconColor = "text-red-600";
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border border-gray-100 transition hover:shadow-md">
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{title}</span>
          {change && (
            <span
              className={`text-xs font-semibold rounded px-1.5 py-0.5 inline-flex items-center gap-0.5 ${
                trend === "up"
                  ? "text-green-700 bg-green-50"
                  : trend === "down"
                  ? "text-red-700 bg-red-50"
                  : "text-gray-500 bg-gray-100"
              }`}
            >
              {trend === "up" ? (
                <FaCaretUp />
              ) : trend === "down" ? (
                <FaCaretDown />
              ) : (
                ""
              )}
              {change}
            </span>
          )}
        </div>
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg} shadow-sm`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
    </div>
  );
};

export default function StatsOverview() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Demo数据
  const stats = [
    {
      title: "市值",
      value: "$743.71M",
      change: "15.88%",
      trend: "up" as const,
    },
    {
      title: "24小时交易量",
      value: "$85.55M",
      change: "1179.96%",
      trend: "up" as const,
    },
    {
      title: "流通供应量",
      value: "5.8B KAIA",
      change: "0.0%",
      trend: "flat" as const,
    },
    {
      title: "日交易量/市值",
      value: "10.19%",
      change: "0.1%",
      trend: "down" as const,
    },
  ];

  // Kaia价格和涨幅demo
  const kaiaPrice = 0.1231;
  const kaiaChange = 15.2;

  // 当前区块高度动态增长
  const [blockHeight, setBlockHeight] = useState(187419980);

  return (
    <div>

      {/* KaiaChain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-stretch">
        <div className="flex items-center min-w-0 md:col-span-1">
          {/* logo */}
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mr-3 overflow-hidden">
            <Image
              src="/icons/kaia-kaia-logo.svg"
              alt="Kaia Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg text-gray-900 ">Kaia</span>
              <span className="text-xs text-gray-400 font-medium">
                KAIA Price
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl md:text-4xl font-extrabold text-gray-900 ">
                ${kaiaPrice}
              </span>
              <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                <FaCaretUp />
                {kaiaChange}%
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col justify-stretch">
          <MoreDetailsCard
            href="https://kaiascan.io/"
            linkText="kaiascan"
            className="h-full"
          >
            <div className="flex-1 min-w-0 flex items-stretch w-full rounded-2xl p-4 flex-col h-full bg-white text-gray-900 shadow border border-gray-100">
              <div className="flex items-center justify-between  mb-5">
                <div className="flex items-center mr-8 min-w-fit">
                  <div className="w-10 h-10 rounded-xl bg-[#49546A] flex items-center justify-center mr-2">
                    <FaNetworkWired className="w-7 h-7" />
                  </div>
                  <span className="text-xl font-semibold">主网</span>
                </div>
                <div className="flex justify-between bg-[#49546A] rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex items-center">
                    <FaNetworkWired className="w-5 h-5 text-[#BFF007] mr-2" />
                    <span className="text-sm text-gray-200 mr-1">
                      当前区块高度
                    </span>
                  </div>
                  <span className="text-xl text-center font-bold text-[#BFF007] tracking-wider min-w-32">
                    {blockHeight}
                  </span>
                </div>
              </div>
              <div className=" flex items-center">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      共识节点数
                    </span>
                    <span className="text-2xl font-bold">41</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      平均出块时间<sup className="ml-0.5">(1小时)</sup>
                    </span>
                    <span className="text-2xl font-bold">1.0s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      平均出块时间<sup className="ml-0.5">(24小时)</sup>
                    </span>
                    <span className="text-2xl font-bold">1.0s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      区块平均交易数<sup className="ml-0.5">(24小时)</sup>
                    </span>
                    <span className="text-2xl font-bold">13.2</span>
                  </div>
                </div>
              </div>
            </div>
          </MoreDetailsCard>
        </div>
      </div>
      <MoreDetailsCard
        href="https://www.coingecko.com/en/coins/kaia"
        linkText="coingecko"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </MoreDetailsCard>
    </div>
  );
}
