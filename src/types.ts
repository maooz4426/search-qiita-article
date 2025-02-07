export type QiitaItemRes = {
  url: string;
};

//このプロパティ変更しただけだと再レンダリングされない(配列も同様)
export type FormItem = {
  accessToken: string;
  userID: string;
  tag: string;
};
