import { getTranslations } from 'next-intl/server';

interface ResourcesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  await params; // 消费params但不使用
  const t = await getTranslations('Resources');

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('description')}
        </p>
        <div className="bg-gray-100 rounded-lg p-8">
          <p className="text-gray-500">
            {t('comingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
}
