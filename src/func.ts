import ogs from "open-graph-scraper";

export const getOgps = async (urls: string[]) => {
  try {
    const promises = urls.map((url) => ogs({ url }).then((res) => res.result.ogImage?.[0].url || ""));
    const ogps = await Promise.all(promises);
    return ogps;
  } catch (error) {
    console.error("Error fetching OGP images:", error);
    return [];
  }
};
