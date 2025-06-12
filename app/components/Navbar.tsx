'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const Navbar = () => {
  const t = useTranslations('Navigation');
  const locale = useLocale();

  // 创建本地化链接的辅助函数
  const createLocalizedHref = (path: string) => {
    return `/${locale}${path === '/' ? '' : path}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={createLocalizedHref('/')} className="flex items-center space-x-2">
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
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link href={createLocalizedHref('/')} className="hover:text-blue-600 transition-colors">
                {t('home')}
              </Link>
              <Link href={createLocalizedHref('/stats')} className="hover:text-blue-600 transition-colors">
                {t('stats')}
              </Link>
              <Link href={createLocalizedHref('/tools')} className="hover:text-blue-600 transition-colors">
                {t('tools')}
              </Link>
              <Link href={createLocalizedHref('/events')} className="hover:text-blue-600 transition-colors">
                {t('events')}
              </Link>
              <Link href={createLocalizedHref('/resources')} className="hover:text-blue-600 transition-colors">
                {t('resources')}
              </Link>
            </div>
            
            {/* 语言切换器 */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 