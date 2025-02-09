import ogs from "open-graph-scraper";
import { ArticleInfo } from "./types";

export const setOgps = async (articles: ArticleInfo[]): Promise<ArticleInfo[]> => {
  try {
    const seted = await Promise.all(
      articles.map(async (article, i) => {
        const res = await ogs({ url: article.url });
        // return res.result.ogImage?.[0].url || "";
        const reArticle = {
          title: article.title,
          url: article.url,
          image: res.result.ogImage?.[0].url || "",
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
