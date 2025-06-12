import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import StatsOverview from './components/StatsOverview'
import StatsCharts from './components/StatsCharts'

export const metadata: Metadata = {
  title: 'KaiaChain Stats | KaiaVerse Portal',
  description: 'KaiaChain ecosystem statistics and analytics dashboard',
}

export default function StatsPage() {
  const t = useTranslations('stats');
  
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