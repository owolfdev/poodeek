import Link from "next/link";

interface BlogPost {
  slug: string;
  type: string;
  date: string;
  title: string;
  description: string;
  image: string;
  author: string;
  tags: string[];
  formattedDate?: string;
  likes?: number; // Change to allow undefined
}

interface BlogPostListProps {
  blogs: BlogPost[];
  trimDescription: (description: string) => string;
}

const BlogPostList = ({ blogs, trimDescription }: BlogPostListProps) => {
  return (
    <ul className="flex flex-col gap-8">
      {blogs.map((blog) => (
        <li key={blog.slug} className="border-none sm:border rounded-lg">
          <Link href={`/blog/${blog.slug}`}>
            <div className="flex flex-col gap-0">
              <h3 className="font-black text-4xl sm:text-5xl">{blog.title}</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm">{blog.formattedDate}</p>
                <p className="text-sm rounded-lg px-2 py-1  m-2">
                  Likes: {blog.likes}
                </p>
              </div>
              <p className="">{trimDescription(blog.description)}</p>
            </div>
          </Link>
          <div className="pt-8 border-b border-primary w-full" />
        </li>
      ))}
    </ul>
  );
};

export default BlogPostList;
