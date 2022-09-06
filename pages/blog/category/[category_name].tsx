import fs from 'fs';
import path from 'path';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Layout from '@/components/Layout';
import matter from 'gray-matter';
import { Post } from '@/models/post';
import BlogPost from '@/components/Post';
import { sortByDate } from '@/utils/index';
import { ParsedUrlQuery } from 'querystring';
import { getPosts } from '@/lib/posts';
import CategoryList from '@/components/CategoryList';

interface IParams extends ParsedUrlQuery {
  category_name: string;
}

interface CategoryBlogPageProps {
  posts: Post[];
  categoryName: string;
  categories: string[];
}

const CategoryBlogPage: NextPage<CategoryBlogPageProps> = ({
  posts,
  categoryName,
  categories,
}) => {
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="w-3/4 mr-10">
          <h1 className="text-5xl border-b-4 p-5 font-bold">
            Posts in {categoryName}
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <BlogPost key={index} post={post} />
            ))}
          </div>
        </div>

        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));

  const categories = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return frontmatter.category.toLowerCase();
  });

  const paths = categories.map((category) => ({
    params: { category_name: category },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  const files = fs.readdirSync(path.join('posts'));

  const params = ctx.params as IParams;

  const posts: Post[] = getPosts();

  // Get categories for sidebar
  const categories = posts.map((post) => post.frontmatter.category);
  const uniqueCategories = [...new Set(categories)];

  // Filter posts by category
  const categoryPosts = posts.filter(
    (post) => post.frontmatter.category.toLowerCase() === params.category_name
  );

  return {
    props: {
      posts: categoryPosts,
      categoryName: params.category_name,
      categories: uniqueCategories,
    },
  };
}

export default CategoryBlogPage;
