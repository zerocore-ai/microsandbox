import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import Features from '../components/Features';
import UseCases from '../components/UseCases';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Microsandbox - Secure Code Execution Platform</title>
        <meta name="description" content="Easy secure execution of untrusted user/AI code. Hardware-level VM isolation with instant startup times under 200ms. Perfect for AI agents, code analysis, and secure development environments." />
        <meta name="keywords" content="code execution, sandbox, security, microvm, ai agents, code analysis, container isolation" />
        <meta property="og:title" content="Microsandbox - Secure Code Execution Platform" />
        <meta property="og:description" content="Easy secure execution of untrusted user/AI code with hardware-level VM isolation and instant startup times." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://microsandbox.dev" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Microsandbox - Secure Code Execution Platform" />
        <meta name="twitter:description" content="Easy secure execution of untrusted user/AI code with hardware-level VM isolation and instant startup times." />
        <meta name="twitter:image" content="/twitter-image.png" />
        <link rel="canonical" href="https://microsandbox.dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Hero />
        <Features />
        <UseCases />
        <Testimonials />
        <CTA />
      </Layout>
    </>
  );
}