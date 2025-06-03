import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Kaiaverse
          </Link>
          <div className="flex space-x-8">
            <Link href="/" className="hover:text-blue-600">
              Home
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