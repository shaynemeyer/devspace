import Link from 'next/link';

interface CategoryLabelProps {
  category: string;
}

interface ColorKey {
  [key: string]: string;
}

export default function CategoryLabel({ category }: CategoryLabelProps) {
  const colorKey: ColorKey = {
    JavaScript: 'yellow',
    CSS: 'blue',
    Python: 'green',
    PHP: 'purple',
    Ruby: 'red',
  };

  console.log({ category });
  console.log(colorKey[category]);

  return (
    <div
      className={`px-2 py-1 bg-${colorKey[category]}-600 text-gray-100 font-bold rounded`}
    >
      <Link href={`/blog/category/${category.toLowerCase()}`}>{category}</Link>
    </div>
  );
}
