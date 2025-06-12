import { getTranslations } from 'next-intl/server';
import AIQueryBox from '../components/AIQueryBox';
import StructuredData from '../components/StructuredData';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');
  const tCommon = await getTranslations('Common');
  const tTools = await getTranslations('Tools');
  const tEvents = await getTranslations('Events');
  const tResources = await getTranslations('Resources');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kaiaverse Portal",
    "description": t('subtitle'),
    "url": "https://kaiaverse.xyz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kaiaverse.xyz/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <AIQueryBox />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              title={tTools('title')}
              description={tTools('description')}
              link={`/${locale}/tools`}
              linkText={tCommon('learnMore')}
            />
            <FeatureCard
              title={tEvents('title')}
              description={tEvents('description')}
              link={`/${locale}/events`}
              linkText={tCommon('learnMore')}
            />
            <FeatureCard
              title={tResources('title')}
              description={tResources('description')}
              link={`/${locale}/resources`}
              linkText={tCommon('learnMore')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const FeatureCard = ({ title, description, link, linkText }: { 
  title: string; 
  description: string; 
  link: string;
  linkText: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="text-blue-600 hover:text-blue-800 transition-colors">
        {linkText} →
      </Link>
    </div>
  );
}; 