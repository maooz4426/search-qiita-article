import ogs from "open-graph-scraper";
import { ArticleInfo } from "./types";

export const setOgps = async (articles: ArticleInfo[]): Promise<ArticleInfo[]> => {
  try {
    const seted = await Promise.all(
      articles.map(async (article) => {
        const res = await ogs({ url: article.url });
        const reArticle: ArticleInfo = {
          title: article.title,
          url: article.url,
          image: res.result.ogImage?.[0].url || "",
          likes_count: article.likes_count,
          stocks_count: article.stocks_count,
          tags: article.tags,
        };
        return reArticle;
      }),
    );
    return seted;
  } catch (error) {
    console.error("Error fetching OGP images:", error);
    return [];
  }
};
