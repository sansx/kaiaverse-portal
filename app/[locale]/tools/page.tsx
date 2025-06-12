import { useTranslations } from 'next-intl';

export default function ToolsPage() {
  const t = useTranslations('tools');
  
  const tools = [
    {
      name: t('faucet.name'),
      description: t('faucet.description'),
      link: "#",
      icon: "💧"
    },
    {
      name: t('staking.name'),
      description: t('staking.description'),
      link: "#",
      icon: "🔒"
    },
    {
      name: t('swap.name'),
      description: t('swap.description'),
      link: "#",
      icon: "🔄"
    },
    {
      name: t('lending.name'),
      description: t('lending.description'),
      link: "#",
      icon: "💰"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div key={tool.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <a
                href={tool.link}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('useNow')} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 