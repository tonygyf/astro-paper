import { BLOG_PATH } from "@/content.config";


/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)

 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,

) {
  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  return slug.join("/");
}
