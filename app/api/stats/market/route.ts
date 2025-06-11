import { NextResponse } from "next/server";
import { getPrefixedRedisClient } from "@lib/redis";

const redis = getPrefixedRedisClient();

// 缓存键名
const MARKET_CACHE_KEY = "market:kaia";
const MARKET_LAST_SYNC_KEY = "market:last_sync";
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
    [key: string]: any; // 允许任意其他市场数据字段
  };
  
  // 时间相关
  last_updated?: string;
  genesis_date?: string;
  
  // 其他可能的字段
  description?: Record<string, string>;
  links?: Record<string, any>;
  image?: Record<string, string>;
  developer_data?: Record<string, any>;
  community_data?: Record<string, any>;
  public_interest_stats?: Record<string, any>;
  
  // 索引签名 - 允许任意其他属性
  [key: string]: any;
}

// 内存缓存
interface CacheData {
  marketData: MarketData;
  timestamp: number;
  lastSyncTime?: string;
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
function isCacheValid(cache: CacheData | null, currentSyncTime?: string): boolean {
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
    console.log('检测到新的同步数据，缓存失效');
    return false;
  }
  
  return true;
}

// 获取最后同步时间
async function getLastSyncTime(): Promise<string | null> {
  try {
    const lastSync = await redis.get(MARKET_LAST_SYNC_KEY);
    return lastSync;
  } catch (error) {
    console.warn('获取同步时间失败:', error);
  }
  return null;
}

// 获取市场数据
async function getMarketData(): Promise<MarketData | null> {
  return retryOperation(async () => {
    // 先检查最后同步时间
    const currentSyncTime = await getLastSyncTime();
    
    // 检查内存缓存是否有效
    if (isCacheValid(memoryCache, currentSyncTime || undefined)) {
      console.log(`使用内存缓存数据`);
      return memoryCache!.marketData;
    }
    
    console.log('缓存无效或不存在，从 Redis 获取数据...');
    
    // 从 Redis 获取市场数据
    const cachedData = await redis.get(MARKET_CACHE_KEY);
    
    if (!cachedData) {
      console.log('未找到市场数据，请先运行同步命令');
      return null; // 直接返回null，不缓存空数据
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
    
    // 更新内存缓存
    memoryCache = {
      marketData,
      timestamp: Date.now(),
      lastSyncTime: currentSyncTime || undefined
    };
    
    console.log(`成功获取并缓存市场数据`);
    return marketData;
  });
}

export async function GET() {
  try {
    const marketData = await getMarketData();
    
    if (!marketData) {
      return NextResponse.json({
        success: false,
        error: "No cached market data found. Please run sync first."
      }, { status: 404 });
    }
    
    // 准确计算缓存状态
    const isFromMemoryCache = memoryCache && isCacheValid(memoryCache);
    
    // 添加缓存控制头
    const headers = {
      'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=600`,
      'X-Cache-Status': isFromMemoryCache ? 'HIT' : 'MISS',
    };
    
    return NextResponse.json({ 
      success: true,
      data: marketData,
      fromCache: !!isFromMemoryCache,
      meta: {
        cached: !!isFromMemoryCache,
        cacheAge: memoryCache ? Date.now() - memoryCache.timestamp : 0,
        lastSyncTime: memoryCache?.lastSyncTime || null
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

// 清除缓存的辅助函数（可以在需要时调用）
export function clearCache() {
  memoryCache = null;
  console.log('市场数据内存缓存已清除');
}
