import { useTranslations } from 'next-intl';

export default function ResourcesPage() {
  const t = useTranslations('resources');
  
  const resources = [
    {
      category: t('categories.development'),
      items: [
        {
          title: t('docs.quickStart.title'),
          description: t('docs.quickStart.description'),
          link: "https://docs.kaia.io/learn/why-kaia/",
        },
        {
          title: t('docs.devTools.title'),
          description: t('docs.devTools.description'),
          link: "https://docs.kaia.io/build/tools/",
        },
        {
          title: t('docs.sdk.title'),
          description: t('docs.sdk.description'),
          link: "https://docs.kaia.io/references/sdk/",
        },
        {
          title: t('docs.whitepaper.title'),
          description: t('docs.whitepaper.description'),
          link: "https://docs.kaia.io/kaiatech/kaia-white-paper/",
        },
      ],
    },
    {
      category: t('categories.community'),
      items: [
        {
          title: t('community.discord.title'),
          description: t('community.discord.description'),
          link: "http://discord.gg/kaiachain",
        },
        {
          title: t('community.forum.title'),
          description: t('community.forum.description'),
          link: "https://devforum.kaia.io/",
        },
        {
          title: t('community.github.title'),
          description: t('community.github.description'),
          link: "https://github.com/kaiachain",
        },
      ],
    },
    {
      category: t('categories.learning'),
      items: [
        {
          title: t('learning.tutorials.title'),
          description: t('learning.tutorials.description'),
          link: "https://docs.kaia.io/build/tutorials/",
        },
        {
          title: t('learning.examples.title'),
          description: t('learning.examples.description'),
          link: "https://github.com/kaiachain/awesome-kaia",
        },
        {
          title: t('learning.videos.title'),
          description: t('learning.videos.description'),
          link: "https://www.youtube.com/@kaiachain",
        },
      ],
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <a
                    href={item.link}
                    target="_blank"
                    key={item.title}
                    className="bg-white rounded-lg shadow-md p-4 block hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      {t('visitResource')} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
