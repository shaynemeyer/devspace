export interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author: string;
  author_image: string;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
}
