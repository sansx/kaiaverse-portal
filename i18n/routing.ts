import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['zh', 'en', 'ko'],
  defaultLocale: 'zh'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing); 