// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/models/post';

interface Data {
  results: Post[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let posts;

  if (process.env.NODE_ENV === 'production') {
    // Fetch from cache
    posts = require('../../cache/data').posts;
  } else {
    const files = fs.readdirSync(path.join('posts'));

    posts = files.map((filename) => {
      const slug = filename.replace('.md', '');

      const markdownWithMeta = fs.readFileSync(
        path.join('posts', filename),
        'utf-8'
      );

      const { data: frontmatter } = matter(markdownWithMeta);

      return {
        slug,
        frontmatter,
      };
    });
  }

  const results = posts.filter(
    ({
      frontmatter: { title, excerpt, category },
    }: {
      frontmatter: { title: string; excerpt: string; category: string };
    }) =>
      title.toLowerCase().indexOf(req.query?.q as string) != -1 ||
      excerpt.toLowerCase().indexOf(req.query?.q as string) != -1 ||
      category.toLowerCase().indexOf(req.query?.q as string) != -1
  );

  res.status(200).json({ results });
}
