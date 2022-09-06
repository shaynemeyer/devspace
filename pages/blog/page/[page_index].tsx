import React from 'react';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/Layout';
import matter from 'gray-matter';
import { Post } from '@/models/post';
import BlogPost from '@/components/Post';
import { POSTS_PER_PAGE } from '@/config/index';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Pagination from '@/components/Pagination';

interface IParams extends ParsedUrlQuery {
  page_index: string;
}

interface BlogPageProps {
  posts: Post[];
  numPages: number;
  currentPage: number;
}

export default function BlogPage({
  posts,
  numPages,
  currentPage,
}: BlogPageProps) {
  return (
    <Layout>
      <>
        <h1 className="text-5xl border-b-4 p-5">Blog</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, index) => (
            <BlogPost key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} numPages={numPages} />
      </>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);

  let paths = [];

  for (let i = 0; i <= numPages; i++) {
    paths.push({
      params: { page_index: i.toString() },
    });
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params as IParams;

  const page = parseInt((params && params.page_index) || '1');

  const files = fs.readdirSync(path.join('posts'));

  const posts: Post[] = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf8'
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
    } as Post;
  });

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);
  const pageIndex = page - 1;
  const orderedPosts = posts.slice(
    pageIndex * POSTS_PER_PAGE,
    (pageIndex + 1) * POSTS_PER_PAGE
  );

  return {
    props: {
      posts: orderedPosts,
      numPages,
      currentPage: page,
    },
  };
}
