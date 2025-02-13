export type QiitaItemRes = {
  title: string;
  url: string;
  likes_count: number;
  stocks_count: number;
  tags: QiitaTag[];
};

type QiitaTag = {
  name: string;
  versions: string[];
};

// //このプロパティ変更しただけだと再レンダリングされない(配列も同様)
// export type FormItem = {
//   accessToken: string;
//   userID: string;
//   tag: string;
// };

export type OGP = {
  ogTitle: string[];
  ogImage?: OGImage[];
};

export type OGImage = {
  url: string;
};

export type ArticleInfo = {
  title: string;
  url: string;
  image: string;
  likes_count: number;
  stocks_count: number;
  tags: QiitaTag[];
};
