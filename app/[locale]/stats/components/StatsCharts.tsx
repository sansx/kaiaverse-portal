"use client";

import MoreDetailsCard from "@/components/MoreDetailsCard";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function StatsCharts() {
  const t = useTranslations('stats.charts');

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
        linkText={t('kaiaWave')}
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
        linkText={t('officialDashboard')}
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
    </div>
  );
}
