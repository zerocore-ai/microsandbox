import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://microsandbox.dev';

  const staticPages = [
    '',
    '/features',
    '/about',
    '/pricing',
    '/organizations',
    '/blog',
    '/get-started',
    '/blog/why-microvm-isolation-matters',
    '/blog/ai-powered-development-secure-execution'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          (path) => `
        <url>
          <loc>${baseUrl}${path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${path === '' ? 'daily' : path.includes('/blog/') ? 'weekly' : 'monthly'}</changefreq>
          <priority>${path === '' ? '1.0' : path.includes('/blog/') ? '0.7' : '0.8'}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;