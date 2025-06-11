import { NextResponse } from "next/server";
import dayjs from "dayjs";

const fetchKaiascan = async (url: string) =>
  fetch(url, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.KAIASCAN_API}`,
    },
  });

export async function GET() {
  try {
    const response = await Promise.all([
      fetchKaiascan("https://mainnet-oapi.kaiascan.io/api/v1/blocks/latest"),
      fetchKaiascan("https://mainnet-oapi.kaiascan.io/api/v1/blocks"),
      fetchKaiascan(
        `https://mainnet-oapi.kaiascan.io/api?module=stats&action=totalfees&date=${dayjs()
          .subtract(dayjs().hour() >= 12 ? 1 : 2, "day")
          .format("YYYY-MM-DD")}&apikey=${process.env.KAIASCAN_API}`
      ),
    ]);

    const [latestBlock, blocks, totalFees] = await Promise.all(
      response.map((res) => res?.json())
    );

    return NextResponse.json({
      success: true,
      data: {
        latestBlock,
        blocks,
        totalFees,
      },
    });
  } catch (error) {
    console.error("Failed to fetch network stats:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch network stats",
      },
      { status: 500 }
    );
  }
}
