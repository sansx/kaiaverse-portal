import AIQueryBox from '../components/AIQueryBox';
import StructuredData from '../components/StructuredData';
import {Link} from '../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kaiaverse Portal",
    "description": "Your AI-powered gateway to the Kaia ecosystem",
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
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          <AIQueryBox />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              title={t('features.tools.title')}
              description={t('features.tools.description')}
              link="/tools"
              learnMore={t('learnMore')}
            />
            <FeatureCard
              title={t('features.events.title')}
              description={t('features.events.description')}
              link="/events"
              learnMore={t('learnMore')}
            />
            <FeatureCard
              title={t('features.resources.title')}
              description={t('features.resources.description')}
              link="/resources"
              learnMore={t('learnMore')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const FeatureCard = ({ title, description, link, learnMore }: { 
  title: string; 
  description: string; 
  link: string;
  learnMore: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="text-blue-600 hover:text-blue-800">
        {learnMore} →
      </Link>
    </div>
  );
}; 