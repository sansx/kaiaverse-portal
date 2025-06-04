import { Metadata } from 'next'
import StatsOverview from './components/StatsOverview'
import StatsCharts from './components/StatsCharts'

export const metadata: Metadata = {
  title: 'KaiaChain Stats | KaiaVerse Portal',
  description: 'KaiaChain ecosystem statistics and analytics dashboard',
}

export default function StatsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">KaiaChain 生态数据统计</h1>
      <div className="grid gap-8">
        <StatsOverview />
        <StatsCharts />
      </div>
    </main>
  )
} 