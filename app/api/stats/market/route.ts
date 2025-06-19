import { NextResponse } from "next/server";
import { getPrefixedRedisClient } from "@lib/redis";

const redis = getPrefixedRedisClient();

// 缓存键名
const MARKET_CACHE_KEY = "market:kaia";
const MARKET_LAST_SYNC_KEY = "market:last_sync";
const CMC_CACHE_KEY = "cmc:listings";
const CMC_LAST_SYNC_KEY = "cmc:last_sync";
const CACHE_TTL = 24 * 60 * 60; // 24小时

// 市场数据类型 - 灵活处理复杂的 CoinGecko API 响应
export interface MarketData {
  // 核心字段（我们确定会用到的）
  id?: string;
  symbol?: string;
  name?: string;
  
  // 市场数据嵌套对象
  market_data?: {
    current_price?: Record<string, number>;
    market_cap?: Record<string, number>;
    price_change_24h?: Record<string, number>;
    price_change_percentage_24h?: number;
    total_volume?: Record<string, number>;
    high_24h?: Record<string, number>;
    low_24h?: Record<string, number>;
    [key: string]: unknown; // 允许任意其他市场数据字段
  };
  
  // 时间相关
  last_updated?: string;
  genesis_date?: string;
  
  // 其他可能的字段
  description?: Record<string, string>;
  links?: Record<string, unknown>;
  image?: Record<string, string>;
  developer_data?: Record<string, unknown>;
  community_data?: Record<string, unknown>;
  public_interest_stats?: Record<string, unknown>;
  
  // 索引签名 - 允许任意其他属性
  [key: string]: unknown;
}

// CMC数据类型
export interface CMCData {
  status?: {
    timestamp?: string;
    error_code?: number;
    error_message?: string;
    elapsed?: number;
    credit_count?: number;
    notice?: string;
  };
  data?: Array<{
    id?: number;
    name?: string;
    symbol?: string;
    slug?: string;
    num_market_pairs?: number;
    date_added?: string;
    tags?: string[];
    max_supply?: number;
    circulating_supply?: number;
    total_supply?: number;
    platform?: Record<string, unknown> | null;
    cmc_rank?: number;
    last_updated?: string;
    quote?: {
      USD?: {
        price?: number;
        volume_24h?: number;
        volume_change_24h?: number;
        percent_change_1h?: number;
        percent_change_24h?: number;
        percent_change_7d?: number;
        percent_change_30d?: number;
        percent_change_60d?: number;
        percent_change_90d?: number;
        market_cap?: number;
        market_cap_dominance?: number;
        fully_diluted_market_cap?: number;
        last_updated?: string;
      };
    };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

// 内存缓存
interface CacheData {
  marketData: MarketData | null;
  cmcData: CMCData | null;
  timestamp: number;
  lastSyncTime?: string;
  lastCMCSyncTime?: string;
}

let memoryCache: CacheData | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 重试函数
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`操作失败，重试 ${i + 1}/${maxRetries}:`, error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

// 检查缓存是否有效
function isCacheValid(cache: CacheData | null, currentSyncTime?: string, currentCMCSyncTime?: string): boolean {
  if (!cache) return false;
  
  const now = Date.now();
  const cacheAge = now - cache.timestamp;
  
  // 如果缓存超过5分钟，则无效
  if (cacheAge > CACHE_DURATION) {
    console.log('缓存已过期，需要重新获取数据');
    return false;
  }
  
  // 如果同步时间发生变化，则缓存无效
  if (currentSyncTime && cache.lastSyncTime && currentSyncTime !== cache.lastSyncTime) {
    console.log('检测到新的市场同步数据，缓存失效');
    return false;
  }
  
  if (currentCMCSyncTime && cache.lastCMCSyncTime && currentCMCSyncTime !== cache.lastCMCSyncTime) {
    console.log('检测到新的CMC同步数据，缓存失效');
    return false;
  }
  
  return true;
}

// 获取最后同步时间
async function getLastSyncTimes(): Promise<{ marketSync: string | null; cmcSync: string | null }> {
  try {
    const [marketSync, cmcSync] = await Promise.all([
      redis.get(MARKET_LAST_SYNC_KEY),
      redis.get(CMC_LAST_SYNC_KEY)
    ]);
    return { marketSync, cmcSync };
  } catch (error) {
    console.warn('获取同步时间失败:', error);
    return { marketSync: null, cmcSync: null };
  }
}

// 获取市场数据
async function getMarketData(): Promise<MarketData | null> {
  return retryOperation(async () => {
    console.log('从 Redis 获取市场数据...');
    
    // 从 Redis 获取市场数据
    const cachedData = await redis.get(MARKET_CACHE_KEY);
    
    if (!cachedData) {
      console.log('未找到市场数据，请先运行同步命令');
      return null;
    }
    
    let marketData: MarketData;
    try {
      marketData = JSON.parse(cachedData);
      // 验证数据完整性
      if (!marketData || typeof marketData !== 'object') {
        throw new Error('市场数据格式无效');
      }
    } catch (parseError) {
      console.error('解析市场数据失败:', parseError);
      return null;
    }
    
    console.log(`成功获取市场数据`);
    return marketData;
  });
}

// 获取CMC数据
async function getCMCData(): Promise<CMCData | null> {
  return retryOperation(async () => {
    console.log('从 Redis 获取CMC数据...');
    
    // 从 Redis 获取CMC数据
    const cachedData = await redis.get(CMC_CACHE_KEY);
    
    if (!cachedData) {
      console.log('未找到CMC数据，请先运行同步命令');
      return null;
    }
    
    let cmcData: CMCData;
    try {
      cmcData = JSON.parse(cachedData);
      // 验证数据完整性
      if (!cmcData || typeof cmcData !== 'object') {
        throw new Error('CMC数据格式无效');
      }
    } catch (parseError) {
      console.error('解析CMC数据失败:', parseError);
      return null;
    }
    
    console.log(`成功获取CMC数据`);
    return cmcData;
  });
}

// 获取所有数据
async function getAllData(): Promise<{ marketData: MarketData | null; cmcData: CMCData | null }> {
  // 先检查最后同步时间
  const { marketSync, cmcSync } = await getLastSyncTimes();
  
  // 检查内存缓存是否有效
  if (isCacheValid(memoryCache, marketSync || undefined, cmcSync || undefined)) {
    console.log(`使用内存缓存数据`);
    return {
      marketData: memoryCache!.marketData,
      cmcData: memoryCache!.cmcData
    };
  }
  
  console.log('缓存无效或不存在，从 Redis 获取数据...');
  
  // 并行获取市场数据和CMC数据
  const [marketData, cmcData] = await Promise.all([
    getMarketData(),
    getCMCData()
  ]);
  
  // 更新内存缓存
  memoryCache = {
    marketData,
    cmcData,
    timestamp: Date.now(),
    lastSyncTime: marketSync || undefined,
    lastCMCSyncTime: cmcSync || undefined
  };
  
  console.log(`成功获取并缓存所有数据`);
  return { marketData, cmcData };
}

export async function GET() {
  try {
    const { marketData, cmcData } = await getAllData();
    
    // 准确计算缓存状态
    const isFromMemoryCache = memoryCache && isCacheValid(memoryCache);
    
    // 添加缓存控制头
    const headers = {
      'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=600`,
      'X-Cache-Status': isFromMemoryCache ? 'HIT' : 'MISS',
    };
    
    // 打印数据日志
    if (marketData) {
      console.log('Market Data from CoinGecko:', marketData);
    }
    if (cmcData) {
      console.log('CoinMarketCap Data:', cmcData);
    }
    
    return NextResponse.json({ 
      success: true,
      data: {
        market_data: marketData?.market_data,
        market_cap_rank: marketData?.market_cap_rank,
        tickers: marketData?.tickers,
        // 完整的原始数据
        coingecko_raw: marketData,
        coinmarketcap_raw: cmcData
      },
      fromCache: !!isFromMemoryCache,
      meta: {
        cached: !!isFromMemoryCache,
        cacheAge: memoryCache ? Date.now() - memoryCache.timestamp : 0,
        lastMarketSyncTime: memoryCache?.lastSyncTime || null,
        lastCMCSyncTime: memoryCache?.lastCMCSyncTime || null,
        hasMarketData: !!marketData,
        hasCMCData: !!cmcData,
        cmcDataCount: Array.isArray(cmcData?.data) ? cmcData.data.length : 0
      }
    }, { headers });
  } catch (error) {
    console.error('获取市场数据失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取市场数据失败，请检查 Redis 连接或运行市场数据同步',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
