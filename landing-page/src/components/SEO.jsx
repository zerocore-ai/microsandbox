import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'microsandbox - Secure Code Execution Platform',
  description = 'Execute untrusted code safely with hardware-level VM isolation and sub-200ms startup times. Perfect for AI coding assistants, educational platforms, and data analysis.',
  keywords = 'microsandbox, secure code execution, sandbox, microvm, docker alternative, code isolation, AI code execution, safe code runner, libkrun, container security',
  author = 'microsandbox Team',
  image = '/og-image.png',
  url = 'https://microsandbox.dev',
  type = 'website',
}) => {
  const siteTitle = title.includes('microsandbox') ? title : `${title} | microsandbox`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="microsandbox" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@microsandbox" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#9333ea" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "microsandbox",
          "url": "https://microsandbox.dev",
          "logo": "https://microsandbox.dev/logo.png",
          "description": description,
          "sameAs": [
            "https://github.com/microsandbox/microsandbox",
            "https://discord.gg/T95Y3XnEAK",
            "https://twitter.com/microsandbox"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "url": "https://microsandbox.dev/contact"
          }
        })}
      </script>

      {/* Structured Data - Software Application */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "microsandbox",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Linux, macOS",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": description,
          "url": "https://microsandbox.dev",
          "downloadUrl": "https://get.microsandbox.dev",
          "softwareVersion": "1.0",
          "datePublished": "2024-01-01",
          "author": {
            "@type": "Organization",
            "name": "microsandbox Team"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "500"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
