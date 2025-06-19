"use client";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { MdTrendingFlat } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaCoins,
  FaExchangeAlt,
  FaChartPie,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MoreDetailsCard from "@/components/MoreDetailsCard";

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
export const formatNumber = (
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

interface MarketData {
  price: {
    current: string;
    change: string;
    trend: "up" | "down";
    rank: number;
    symbol?: string;
    displayName?: string;
    lastUpdated?: string;
    volume24h?: string;
    high24h?: string;
    low24h?: string;
  };
  market: Array<{
    title: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "flat";
    description?: string;
    category?: "market" | "trading" | "supply" | "ratio" | "custom";
    importance?: "high" | "medium" | "low";
    customIcon?: {
      icon: React.ReactNode;
      bgColor?: string;
      iconColor?: string;
    };
    metadata?: {
      source?: string;
      lastUpdated?: string;
      precision?: number;
      unit?: string;
    };
  }>;
  tickers?: Array<{
    base: string;
    target: string;
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    last: number | null;
    volume: number;
    converted_last: {
      btc: number;
      eth: number;
      usd: number;
    };
    converted_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    trust_score: string | null;
    bid_ask_spread_percentage: number | null;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string | null;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    token_info_url: string | null;
    coin_id: string;
    target_coin_id: string;
  }>;
  marketDataRaw?: {
    total_volume?: {
      usd?: number;
    };
  };
}

export default function StatsOverview() {
  const t = useTranslations("stats.overview");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loading, setLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState<number>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_networkLoading, setNetworkLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showLoading, setShowLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData>();

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

        const { market_data, tickers, coinmarketcap_raw } = data.data;
        
        // 打印CMC数据（如果存在）
        if (coinmarketcap_raw) {
          console.log('CoinMarketCap Data:', coinmarketcap_raw);
        }
        
        // 简化：从CMC数据中获取KAIA排名
        const getKaiaRank = (cmcData: unknown): number => {
          try {
            const data = (cmcData as Record<string, unknown>)?.data;
            if (!Array.isArray(data)) return 0;
            
            const kaiaToken = data.find((token: unknown) => {
              const t = token as Record<string, unknown>;
              return t?.symbol === "KAIA" || t?.name === "Kaia";
            });
            return (kaiaToken as Record<string, unknown>)?.cmc_rank as number || 0;
          } catch {
            return 0;
          }
        };
        
        const kaiaRank = getKaiaRank(coinmarketcap_raw);
        
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
            rank: kaiaRank,
            symbol: "KAIA",
            displayName: "Kaia",
            volume24h: formatNumber(market_data.total_volume?.usd, 2, {
              prefix: "$",
            }),
            high24h: formatNumber(market_data.high_24h?.usd, 2, {
              prefix: "$",
            }),
            low24h: formatNumber(market_data.low_24h?.usd, 2, {
              prefix: "$",
            }),
            lastUpdated: new Date().toISOString(),
          },
          market: [
            {
              title: t("marketCap"),
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
              category: "market",
              importance: "high",
              description: t("marketCapDescription"),
              metadata: {
                source: "coingecko",
                precision: 2,
                unit: "USD",
                lastUpdated: new Date().toISOString(),
              },
            },
            {
              title: t("volume24h"),
              value: formatNumber(market_data.total_volume?.usd, 2, {
                prefix: "$",
              }),
              category: "trading",
              importance: "high",
              description: t("volume24hDescription"),
              customIcon: {
                icon: <FaExchangeAlt />,
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              metadata: {
                source: "coingecko",
                precision: 2,
                unit: "USD",
                lastUpdated: new Date().toISOString(),
              },
            },
            {
              title: t("circulatingSupply"),
              value: formatNumber(market_data.circulating_supply, 2, {
                suffix: " KAIA",
              }),
              category: "supply",
              importance: "medium",
              description: t("circulatingSupplyDescription"),
              customIcon: {
                icon: <FaCoins />,
                bgColor: "bg-yellow-100",
                iconColor: "text-yellow-600",
              },
              metadata: {
                source: "coingecko",
                precision: 2,
                unit: "KAIA",
                lastUpdated: new Date().toISOString(),
              },
            },
            {
              title: t("volumeToMarketCap"),
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
              category: "ratio",
              importance: "medium",
              description: t("volumeToMarketCapDescription"),
              customIcon: {
                icon: <FaChartPie />,
                bgColor: "bg-indigo-100",
                iconColor: "text-indigo-600",
              },
              metadata: {
                source: "coingecko",
                precision: 2,
                unit: "percentage",
                lastUpdated: new Date().toISOString(),
              },
            },
          ],
          marketDataRaw: market_data,
          tickers,
        });
      } catch (error) {
        console.error("Failed to fetch market stats:", error);
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarketStats();
  }, [t]);

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
  }, [blockHeight, timer]);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <div>
      {/* KaiaChain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-stretch">
        <div className="flex items-center min-w-0 md:col-span-1">
          {/* logo */}
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mr-3 overflow-hidden">
            <Image
              src="/icons/kaia-kaia-logo.svg"
              alt={t("kaiaLogo")}
              width={80}
              height={80}
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg text-gray-900 ">Kaia</span>
              <span className="text-xs text-gray-400 font-medium">
                {t("kaiaPrice")}
              </span>
              {!marketLoading && marketData?.price?.rank && (
                <span className="inline-flex items-center px-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  #{marketData.price.rank}
                </span>
              )}
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
      </div>
      <MoreDetailsCard
        href="https://www.coingecko.com/en/coins/kaia"
        linkText="coingecko"
        loading={marketLoading}
      >
        <div className="min-h-[90px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[90px]">
            {marketData?.market.map((stat, index: number) => (
              <StatCard key={index} {...stat} trend={stat.trend || "flat"} />
            ))}
          </div>
        </div>
      </MoreDetailsCard>
    </div>
  );
}
