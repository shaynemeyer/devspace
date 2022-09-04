import React from 'react';
import fs from 'fs';
import path from 'path';
import Layout from '../../components/Layout';
import matter from 'gray-matter';
import Link from 'next/link';
import { Post } from '../../models/post';
import BlogPost from '../../components/Post';

interface BlogPageProps {
  posts: Post[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout>
      <>
        <h1 className="text-5xl border-b-4 p-5">Blog</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, index) => (
            <BlogPost key={post.slug} post={post} />
          ))}
        </div>
      </>
    </Layout>
  );
}
export async function getStaticProps() {
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

  return {
    props: {
      posts,
    },
  };
}
