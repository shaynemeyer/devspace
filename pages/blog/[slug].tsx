import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Layout from '@/components/Layout';
import Link from 'next/link';
import CategoryLabel from '@/components/CategoryLabel';

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export default function PostPage({
  frontmatter,
  content,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, category, date, cover_image, author, author_image } =
    frontmatter;

  return (
    <Layout title={title}>
      <Link href="/blog">Go Back</Link>
      <div className="w-full px-10 py-6 bg-white rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-5xl mb-7">{title}</h1>
          <CategoryLabel category={category} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover_image} alt="" className="w-full rounded" />

        <div className="flex justify-between items-center bg-gray-100 p-2 my-8">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={author_image}
              alt=""
              className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
            />
            <h4>{author}</h4>
          </div>
          <div className="mr-4">{date}</div>
        </div>

        <div className="blog-text mt-2">
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths({}) {
  const files = fs.readdirSync(path.join('posts'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  const { slug } = ctx.params as IParams;
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  };
}
