/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kaiaverse.xyz',
  generateRobotsTxt: false, // 我们已经手动创建了robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'],
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    // 你可以在这里添加动态生成的路径
    return []
  },
} 