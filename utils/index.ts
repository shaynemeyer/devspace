import { Post } from '../models/post';

export const sortByDate = (a: Post, b: Post) => {
  return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
};
