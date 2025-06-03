import AIQueryBox from './components/AIQueryBox';

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Kaiaverse Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered gateway to the Kaia ecosystem
        </p>
        <AIQueryBox />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Tools & Services"
            description="Access Kaia ecosystem tools including faucet, staking, swap, and lending services"
            link="/tools"
          />
          <FeatureCard
            title="Events Calendar"
            description="Stay updated with global Kaia ecosystem events and activities"
            link="/events"
          />
          <FeatureCard
            title="Resource Hub"
            description="Explore comprehensive resources, documentation, and community links"
            link="/resources"
          />
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ title, description, link }: { 
  title: string; 
  description: string; 
  link: string; 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a href={link} className="text-blue-600 hover:text-blue-800">
        Learn more →
      </a>
    </div>
  );
}; 