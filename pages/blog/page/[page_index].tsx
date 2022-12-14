import React from 'react';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/Layout';
import { Post } from '@/models/post';
import BlogPost from '@/components/Post';
import { POSTS_PER_PAGE } from '@/config/index';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Pagination from '@/components/Pagination';
import { getPosts } from '@/lib/posts';
import CategoryList from '@/components/CategoryList';

interface IParams extends ParsedUrlQuery {
  page_index: string;
}

interface BlogPageProps {
  posts: Post[];
  numPages: number;
  currentPage: number;
  categories: string[];
}

export default function BlogPage({
  posts,
  numPages,
  currentPage,
  categories,
}: BlogPageProps) {
  return (
    <Layout>
      <div className="flex justify-between flex-col md:flex-row">
        <div className="w-3/4 mr-10">
          <h1 className="text-5xl border-b-4 p-5">Blog</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <BlogPost key={post.slug} post={post} />
            ))}
          </div>
          <Pagination currentPage={currentPage} numPages={numPages} />{' '}
        </div>

        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
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

  const posts: Post[] = getPosts();

  // Get categories for sidebar
  const categories = posts.map((post) => post.frontmatter.category);
  const uniqueCategories = [...new Set(categories)];

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
      categories: uniqueCategories,
    },
  };
}
