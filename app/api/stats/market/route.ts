import { NextResponse } from "next/server";
import { getPrefixedRedisClient } from "@lib/redis";
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 缓存键名
const MARKET_CACHE_KEY = "market:kaia";
// 缓存时间 24 小时
const CACHE_TTL = 24 * 60 * 60;

// 根据环境变量配置代理
const proxyUrl = process.env.PROXY_URL;
const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

const url = 'https://api.coingecko.com/api/v3/coins/kaia';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.COINGECKO_API || '',
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  },
  ...(proxyAgent && { agent: proxyAgent }) // 只在配置了代理时使用
};

export async function GET() {
  console.log('=== Market Data API Call Start ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Proxy URL:', proxyUrl || 'Not configured');
  
  const redis = getPrefixedRedisClient();
  let data;
  let fromCache = false;

  try {
    console.log('Attempting to fetch data from Redis cache...');
    // 尝试从缓存获取数据
    const cachedData = await redis.get(MARKET_CACHE_KEY);
    if (cachedData) {
      console.log('Cache hit: Data found in Redis');
      data = JSON.parse(cachedData);
      fromCache = true;
      console.log('Returning cached data');
      return NextResponse.json({
        success: true,
        data,
        fromCache
      });
    } else {
      console.log('Cache miss: No data found in Redis');
    }
  } catch (error) {
    console.error('Redis cache error:', error);
    // 缓存失败时继续执行，尝试从 API 获取数据
  }

  // 如果没有缓存数据，从 CoinGecko 获取数据
  let retries = 3;
  let lastError;
  
  while (retries > 0) {
    try {
      console.log(`\nAttempting API call (${4 - retries}/3)...`);
      console.log("Proxy enabled:", !!proxyAgent);
      
      const response = await fetch(url, options);
      console.log("API Response status:", response.status);
      console.log("API Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      data = await response.json();
      console.log('Successfully fetched data from API');

      // 尝试将数据存入缓存
      try {
        console.log('Attempting to cache data in Redis...');
        await redis.setex(MARKET_CACHE_KEY, CACHE_TTL, JSON.stringify(data));
        console.log('Data successfully cached in Redis');
      } catch (cacheError) {
        console.error('Failed to cache data:', cacheError);
        // 缓存失败不影响返回数据
      }

      console.log('=== Market Data API Call End ===\n');
      return NextResponse.json({
        success: true,
        data,
        fromCache
      });
    } catch (error) {
      lastError = error;
      retries--;
      console.error(`API call failed (${3 - retries}/3):`, error);
      
      if (retries > 0) {
        console.log(`Waiting 1 second before retry...`);
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      // 所有重试都失败了
      console.error('All retry attempts failed');
      console.log('=== Market Data API Call End (Error) ===\n');
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch market data",
          details: lastError instanceof Error ? lastError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
