import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Search from './Search';

interface LayoutProps {
  title?: string;
  description?: string;
  keywords?: string;
  children?: JSX.Element | JSX.Element[] | string[];
}

const DefaultProps: LayoutProps = {
  title: 'Welcome to Devspace',
  keywords: 'development, coding, programming',
  description: 'The best info and news in development',
};

export default function Layout({
  title,
  keywords,
  description,
  children,
}: LayoutProps): JSX.Element {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Search />
      <main className="container mx-auto my-7">{children}</main>
    </div>
  );
}

Layout.defaultProps = DefaultProps;
