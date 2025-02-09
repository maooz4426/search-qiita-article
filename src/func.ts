import ogs from "open-graph-scraper";

export const getOgps = async (urls: string[]): Promise<string[]> => {
  try {
    const ogps = await Promise.all(
      urls.map(async (url) => {
        const res = await ogs({ url });
        return res.result.ogImage?.[0].url || "";
      }),
    );
    return ogps;
  } catch (error) {
    console.error("Error fetching OGP images:", error);
    return [];
  }
};
