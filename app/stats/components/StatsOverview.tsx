'use client';

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  isPositive?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    {change && (
      <p className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {change}
      </p>
    )}
  </div>
)

export default function StatsOverview() {
  // Demo数据
  const stats = [
    {
      title: '总交易量',
      value: '¥238.5M',
      change: '12.5%',
      isPositive: true
    },
    {
      title: '活跃钱包数',
      value: '12,453',
      change: '8.3%',
      isPositive: true
    },
    {
      title: '质押总量',
      value: '5.2M KAIA',
      change: '3.2%',
      isPositive: true
    },
    {
      title: '日交易笔数',
      value: '45,672',
      change: '2.1%',
      isPositive: false
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
} 