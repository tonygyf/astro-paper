import { BLOG_PATH } from "@/content.config";


/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)


 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string
) {
  // Making sure `id` does not contain the directory
  return filePath.split(".md")[0];
}
