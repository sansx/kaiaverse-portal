import { NextResponse } from "next/server";
import { getPrefixedRedisClient } from "@lib/redis";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

const redis = getPrefixedRedisClient();
const CMC_CACHE_KEY = "cmc:listings";
const CACHE_TTL = 24 * 60 * 60; // 24小时
const CMC_LAST_SYNC_KEY = "cmc:last_sync";

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

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
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
}

// 同步CMC数据的核心逻辑
async function syncCMCData(): Promise<unknown> {
  // 检查是否刚刚同步过（防止频繁同步）
  const lastSync = await redis.get(CMC_LAST_SYNC_KEY);
  if (lastSync) {
    const timeSinceLastSync = Date.now() - parseInt(lastSync);
    const minSyncInterval = 1 * 60 * 1000; // 1分钟最小同步间隔
    if (timeSinceLastSync < minSyncInterval) {
      throw new Error(
        `同步过于频繁，请在 ${new Date(
          parseInt(lastSync) + minSyncInterval
        ).toLocaleString("zh-CN")} 后重试`
      );
    }
  }

  const apiKey = process.env.COINMARKETCAP_API;
  const proxyUrl = process.env.PROXY_URL;
  
  if (!apiKey) {
    throw new Error("CoinMarketCap API key not configured");
  }

  // 使用重试机制拉取CMC数据
  const data = await retryOperation(async () => {
    console.log("正在从 CoinMarketCap 获取数据...");
    
    const params = new URLSearchParams({
      aux: 'cmc_rank'
    });

    const fetchOptions: Record<string, unknown> = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-CMC_PRO_API_KEY': apiKey,
      },
    };

    // 如果配置了代理，则使用代理
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      fetchOptions.agent = agent;
      console.log('Using proxy:', proxyUrl);
    }

    const response = await fetch(`${CMC_API_URL}?${params}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();

    // 基本数据验证
    if (!result || typeof result !== "object") {
      throw new Error("API 返回数据格式无效");
    }

    return result;
  });

  console.log("成功获取CMC数据，准备写入 Redis...");

  // 使用重试机制写入 redis
  await retryOperation(async () => {
    const pipeline = redis.pipeline();
    pipeline.setex(CMC_CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    pipeline.set(CMC_LAST_SYNC_KEY, Date.now().toString());
    await pipeline.exec();
  });

  console.log("CMC数据同步成功");
  return data;
}

export async function POST() {
  try {
    console.log("手动触发CMC数据同步...");
    const data = await syncCMCData();

    return NextResponse.json({
      success: true,
      message: "CMC数据已同步",
      data,
      syncTime: new Date().toLocaleString("zh-CN"),
    });
  } catch (error) {
    console.error("CMC数据同步失败:", error);

    // 检查是否是频率限制错误
    if (error instanceof Error && error.message.includes("频繁")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "同步CMC数据失败",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // 验证授权
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const requestUrl = new URL(request.url);
  const shouldSync = requestUrl.searchParams.get("sync") !== "false"; // 默认触发同步

  // 如果需要触发同步
  if (shouldSync) {
    try {
      console.log("Cron 触发CMC数据同步...");
      const data = await syncCMCData();

      return NextResponse.json({
        success: true,
        message: "Cron CMC同步完成",
        syncTime: new Date().toLocaleString("zh-CN"),
        syncedData: {
          status: (data as Record<string, unknown>)?.status || "unknown",
          data_length: Array.isArray((data as Record<string, unknown>)?.data) 
            ? (data as Record<string, unknown[]>).data.length 
            : 0,
          last_updated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Cron CMC同步失败:", error);

      // 检查是否是频率限制错误
      if (error instanceof Error && error.message.includes("频繁")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Cron CMC同步失败",
          details:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        },
        { status: 500 }
      );
    }
  }

  // 只查询状态
  try {
    const [lastSync, cachedData] = await Promise.all([
      redis.get(CMC_LAST_SYNC_KEY),
      redis.get(CMC_CACHE_KEY),
    ]);

    let cachePreview = null;
    if (cachedData) {
      try {
        const fullData = JSON.parse(cachedData);
        cachePreview = {
          status: fullData.status,
          data_count: Array.isArray(fullData.data) ? fullData.data.length : 0,
          first_crypto: Array.isArray(fullData.data) && fullData.data.length > 0 
            ? {
                name: fullData.data[0].name,
                symbol: fullData.data[0].symbol,
                cmc_rank: fullData.data[0].cmc_rank,
                price: fullData.data[0].quote?.USD?.price
              }
            : null,
          timestamp: fullData.status?.timestamp,
        };
      } catch (error) {
        console.warn("解析CMC缓存预览数据失败:", error);
        cachePreview = { error: "缓存数据格式错误" };
      }
    }

    return NextResponse.json({
      success: true,
      lastSync: lastSync
        ? new Date(parseInt(lastSync)).toLocaleString("zh-CN")
        : "从未同步",
      hasCache: !!cachedData,
      nextScheduledSync: lastSync
        ? new Date(parseInt(lastSync) + CACHE_TTL * 1000).toLocaleString(
            "zh-CN"
          )
        : "未设置",
      cacheSize: cachedData
        ? `${Math.round(cachedData.length / 1024)} KB`
        : "0 KB",
      cachePreview,
    });
  } catch (error) {
    console.error("获取CMC同步状态失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "获取CMC同步状态失败",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
} 