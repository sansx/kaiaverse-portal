import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server';
import StatsOverview from './components/StatsOverview'
import StatsCharts from './components/StatsCharts'

export const metadata: Metadata = {
  title: 'KaiaChain Stats | KaiaVerse Portal',
  description: 'KaiaChain ecosystem statistics and analytics dashboard',
}

interface StatsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function StatsPage({ params }: StatsPageProps) {
  await params; // 消费params但不使用
  const t = await getTranslations('Stats');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <div className="grid gap-8">
        <StatsOverview />
        <StatsCharts />
      </div>
    </main>
  )
} 