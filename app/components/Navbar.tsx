import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/images/kaiaverse_icon.png"
              alt="Kaiaverse Logo" 
              width={32} 
              height={32}
            />
            <div className="flex items-center">
              <span className="text-xl font-bold">Kaiaverse</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">Beta</span>
            </div>
          </Link>
          <div className="flex space-x-8">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/stats" className="hover:text-blue-600">
              Stats
            </Link>
            <Link href="/tools" className="hover:text-blue-600">
              Tools
            </Link>
            <Link href="/events" className="hover:text-blue-600">
              Events
            </Link>
            <Link href="/resources" className="hover:text-blue-600">
              Resources
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 