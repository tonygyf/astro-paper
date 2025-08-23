import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - (kept for compatibility, not used anymore)
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath?: string, // kept for compatibility
  includeBase: boolean = true
) {
  const basePath = includeBase ? "/posts" : "";

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  return [basePath, slug].join("/");
}
