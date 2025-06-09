"use client";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { MdTrendingFlat } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaInfoCircle,
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
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-700 transition hover:shadow-md">
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          {change && (
            <span
              className={`text-xs font-semibold rounded px-1.5 py-0.5 inline-flex items-center gap-0.5 ${
                trend === "up"
                  ? "text-green-700 bg-green-50 dark:bg-green-900/30"
                  : trend === "down"
                  ? "text-red-700 bg-red-50 dark:bg-red-900/30"
                  : "text-gray-500 bg-gray-100 dark:bg-gray-700/30"
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
  const kaiaRank = 121;
  // Fear & Greed Index demo
  const fgIndex = 72; // 0-100, 0极度恐惧，100极度贪婪

  // 当前区块高度动态增长
  const [blockHeight, setBlockHeight] = useState(187419980);
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockHeight((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* KaiaChain Stats */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex items-center min-w-0 md:w-auto md:flex-shrink-0">
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

        <MoreDetailsCard
          href="https://kaiascan.io/"
          linkText="kaiascan"
          className="mt-10"
        >
          <div className="flex-1 min-w-0 flex items-stretch w-full dark:bg-gray-800 rounded-2xl p-4 flex-col">
            <div className="flex items-center justify-between  mb-5">
              <div className="flex items-center mr-8 min-w-fit">
                <div className="w-12 h-12 rounded-xl bg-[#49546A] flex items-center justify-center mr-2">
                  <FaNetworkWired className="w-7 h-7 text-white/80" />
                </div>
                <span className="text-xl font-semibold text-white/90">
                  主网
                </span>
              </div>
              <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 shadow-sm">
                <FaNetworkWired className="w-5 h-5 text-[#BFF007] mr-2" />
                <span className="text-sm text-gray-200 mr-1">当前区块高度</span>
                <span className="text-xl font-bold text-[#BFF007] tracking-wider">
                  {blockHeight}
                </span>
              </div>
            </div>
            <div className=" flex items-center">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                <div className="flex flex-col">
                  <span className="text-sm text-[#A2A9B6] mb-1">
                    共识节点数
                  </span>
                  <span className="text-2xl font-bold text-white">41</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#A2A9B6] mb-1">
                    平均出块时间<sup className="ml-0.5">(1小时)</sup>
                  </span>
                  <span className="text-2xl font-bold text-white">1.0s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#A2A9B6] mb-1">
                    平均出块时间<sup className="ml-0.5">(24小时)</sup>
                  </span>
                  <span className="text-2xl font-bold text-white">1.0s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#A2A9B6] mb-1">
                    区块平均交易数<sup className="ml-0.5">(24小时)</sup>
                  </span>
                  <span className="text-2xl font-bold text-white">13.2</span>
                </div>
              </div>
            </div>
          </div>
        </MoreDetailsCard>
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
