import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  {
    name: 'Website',
    href: 'https://www.kaia.io',
    icon: '/icons/safari.svg'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/KaiaChain',
    icon: '/icons/twitter.svg'
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/kaiachain',
    icon: '/icons/discord.svg'
  },
  {
    name: 'Telegram',
    href: 'https://t.me/kaiachain',
    icon: '/icons/telegram.svg'
  },
  {
    name: 'Medium',
    href: 'https://medium.com/kaiachain',
    icon: '/icons/medium.svg'
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kaiachain',
    icon: '/icons/github.svg'
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/10 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 group"
              >
                <div className="relative w-5 h-5 transition-transform duration-200 group-hover:scale-110">
                  <Image
                    src={link.icon}
                    alt={link.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Kaiaverse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 