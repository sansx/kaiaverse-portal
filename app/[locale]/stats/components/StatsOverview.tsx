"use client";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { MdTrendingFlat } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaNetworkWired,
  FaChartLine,
  FaCoins,
  FaExchangeAlt,
  FaChartPie,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import MoreDetailsCard from "@/components/MoreDetailsCard";
import KaiaLoading from "@/components/KaiaLoading";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend: "up" | "down" | "flat";
  customIcon?: {
    icon: React.ReactNode;
    bgColor?: string;
    iconColor?: string;
  };
}

// 格式化数字为带单位的字符串
const formatNumber = (
  value: number | string | undefined | null,
  decimals: number = 2,
  options: {
    prefix?: string;
    suffix?: string;
    unit?: "short" | "long";
    isPercentage?: boolean;
  } = {}
) => {
  // 处理 undefined 或 null
  if (value === undefined || value === null) {
    return "0";
  }

  const {
    prefix = "",
    suffix = "",
    unit = "short",
    isPercentage = false,
  } = options;

  // 转换为数字
  const num = typeof value === "string" ? parseFloat(value) : value;

  // 如果输入无效，返回0
  if (isNaN(num)) return "0";

  // 如果是百分比且数值小于1，直接返回百分比格式
  if (isPercentage && Math.abs(num) < 1) {
    return `${(num * 100).toFixed(decimals)}%`;
  }

  // 如果数值小于1且不是百分比，直接返回格式化后的小数
  if (Math.abs(num) < 1 && !isPercentage) {
    return `${prefix}${num.toFixed(decimals)}${suffix}`;
  }

  // 定义单位
  const units =
    unit === "short"
      ? ["", "K", "M", "B", "T", "Qa", "Qi"]
      : [
          "",
          "Thousand",
          "Million",
          "Billion",
          "Trillion",
          "Quadrillion",
          "Quintillion",
        ];

  // 计算单位索引
  const k = 1000;
  const magnitude = Math.floor(Math.log(Math.abs(num)) / Math.log(k));
  const unitIndex = Math.min(magnitude, units.length - 1);

  // 计算缩放后的值
  const scaled = num / Math.pow(k, unitIndex);

  // 格式化数字，保留指定小数位
  const formatted = scaled.toFixed(decimals);

  // 移除末尾多余的0
  const trimmed = formatted.replace(/\.?0+$/, "");

  // 组合结果
  return `${prefix}${trimmed}${units[unitIndex]}${suffix}`;
};

// 使用示例：
// formatNumber(1000) => "1K"
// formatNumber(1500, 1) => "1.5K"
// formatNumber(1000000, 2, { prefix: '$' }) => "$1M"
// formatNumber(1000000, 2, { unit: 'long' }) => "1Million"
// formatNumber(1000000, 2, { prefix: '$', suffix: ' USD' }) => "$1M USD"
// formatNumber(0.15, 2, { isPercentage: true }) => "15%"
// formatNumber(0.0015, 2, { isPercentage: true }) => "0.15%"
// formatNumber(0.1254) => "0.12"
// formatNumber(0.1254, 3) => "0.125"

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  customIcon,
}) => {
  // 选择图标和颜色
  let Icon = MdTrendingFlat;
  let iconBg = "bg-gray-100";
  let iconColor = "text-gray-400";

  if (customIcon) {
    Icon = () => customIcon.icon;
    iconBg = customIcon.bgColor || iconBg;
    iconColor = customIcon.iconColor || iconColor;
  } else if (trend === "up") {
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

const PriceShowSkeleton = () => (
  <div className="flex items-end gap-3">
    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
  </div>
);

export default function StatsOverview() {
  const [loading, setLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState<number>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [networkStats, setNetworkStats] = useState<{
    nodes: number;
    avgBlockTime: number;
    avgBlockTime24h: number;
    avgTxCount24h: number;
    totalFees: number;
  }>();
  const [networkLoading, setNetworkLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [marketData, setMarketData] = useState<any>();

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        setNetworkLoading(true);
        const response = await fetch("/api/stats/network");
        const data = await response.json();
        console.log("Network Stats:", data);
        const { latestBlock, blocks, totalFees } = data.data;

        // 计算平均出块时间
        const blockTimes = blocks.results
          .slice(0, -1)
          .map((block: any, index: number) => {
            const currentTime = new Date(block.datetime).getTime();
            const nextTime = new Date(
              blocks.results[index + 1].datetime
            ).getTime();
            return (currentTime - nextTime) / 1000; // 转换为秒
          });

        const avgBlockTime =
          blockTimes.reduce((acc: number, time: number) => acc + time, 0) /
          blockTimes.length;

        setBlockHeight(latestBlock.block_id);
        setNetworkStats({
          nodes: latestBlock.block_committee.validators.length,
          avgBlockTime: Math.round(avgBlockTime * 100) / 100, // 保留两位小数
          avgBlockTime24h: Math.round(avgBlockTime * 100) / 100,
          totalFees: totalFees.result * 1,
          avgTxCount24h:
            blocks.results.reduce(
              (acc: number, block: any) => acc + block.total_transaction_count,
              0
            ) / blocks.results.length,
        });
      } catch (error) {
        console.error("Failed to fetch network stats:", error);
      } finally {
        setNetworkLoading(false);
      }
    };

    // fetchNetworkStats();
  }, []);

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        setMarketLoading(true);
        setShowLoading(true);
        const response = await fetch("/api/stats/market");
        const data = await response.json();
        console.log("Market Stats:", data);

        if (!data.success || !data.data?.market_data) {
          throw new Error("Invalid market data");
        }

        const { market_data } = data.data;
        const price_change_24h_in_percentage = market_data
          .price_change_24h_in_currency?.usd
          ? (market_data.price_change_24h_in_currency.usd /
              market_data.current_price.usd) *
            100
          : 0;

        setMarketData({
          price: {
            current: formatNumber(market_data.current_price?.usd, 2),
            change: formatNumber(price_change_24h_in_percentage, 2) + "%",
            trend: price_change_24h_in_percentage > 0 ? "up" : "down",
          },
          market: [
            {
              title: "市值",
              value: formatNumber(market_data.market_cap?.usd, 2, {
                prefix: "$",
              }),
              change:
                formatNumber(market_data.market_cap_change_percentage_24h, 2) +
                "%",
              trend:
                market_data.market_cap_change_percentage_24h > 0
                  ? "up"
                  : "down",
            },
            {
              title: "24小时交易量",
              value: formatNumber(market_data.total_volume?.usd, 2, {
                prefix: "$",
              }),
              customIcon: {
                icon: <FaExchangeAlt />,
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600",
              },
            },
            {
              title: "流通供应量",
              value: formatNumber(market_data.circulating_supply, 2, {
                suffix: " KAIA",
              }),
              customIcon: {
                icon: <FaCoins />,
                bgColor: "bg-yellow-100",
                iconColor: "text-yellow-600",
              },
            },
            {
              title: "日交易量/市值",
              value:
                formatNumber(
                  market_data.total_volume?.usd && market_data.market_cap?.usd
                    ? (market_data.total_volume.usd /
                        market_data.market_cap.usd) *
                        100
                    : 0,
                  2,
                  {
                    isPercentage: true,
                  }
                ) + "%",
              customIcon: {
                icon: <FaChartPie />,
                bgColor: "bg-indigo-100",
                iconColor: "text-indigo-600",
              },
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch market stats:", error);
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarketStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (blockHeight === undefined || timer) return;
    const tempTimer = setInterval(() => {
      setBlockHeight((prev) => {
        if (prev === undefined) return prev;
        return prev + 1;
      });
    }, 1000);
    setTimer(tempTimer);
  }, [blockHeight]);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div>
      {/* {showLoading && (
        <KaiaLoading
          unlock={marketLoading}
          onAnimationComplete={handleLoadingComplete}
        />
      )} */}
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
            {/* Kaia Price Show */}
            {marketLoading ? (
              <PriceShowSkeleton />
            ) : (
              <div className="flex items-end gap-3">
                <span className="text-3xl md:text-4xl font-extrabold text-gray-900 ">
                  ${marketData?.price?.current}
                </span>
                <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                  <FaCaretUp />
                  {marketData?.price?.change}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* <div className="md:col-span-3 flex flex-col justify-stretch">
          <MoreDetailsCard
            href="https://kaiascan.io/"
            linkText="kaiascan"
            className="h-full"
            loading={networkLoading}
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
                    <span className="text-2xl font-bold">
                      {networkStats?.nodes}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      平均出块时间<sup className="ml-0.5"></sup>
                    </span>
                    <span className="text-2xl font-bold">
                      {networkStats?.avgBlockTime}s
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      昨日用户交易费<sup className="ml-0.5"></sup>
                    </span>
                    <span className="text-2xl font-bold">
                      {formatNumber(networkStats?.totalFees, 2, {
                        suffix: " KAIA",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      区块平均交易数<sup className="ml-0.5">(最近20个区块)</sup>
                    </span>
                    <span className="text-2xl font-bold">
                      {networkStats?.avgTxCount24h}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </MoreDetailsCard>
        </div> */}
      </div>
      <MoreDetailsCard
        href="https://www.coingecko.com/en/coins/kaia"
        linkText="coingecko"
        loading={marketLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[90px]">
          {marketData?.market.map((stat: any, index: number) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </MoreDetailsCard>
    </div>
  );
}
