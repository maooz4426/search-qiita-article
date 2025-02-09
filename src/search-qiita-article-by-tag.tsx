import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { ArticleInfo, QiitaItemRes } from "./types";
import { getAccessToken, getTag, getUserID, saveAccessToken, saveTag, saveUserID } from "./stores";
import { ResultView } from "./components/ResultView";
import { apiClient, setAccessToken } from "./apiClient";
import { setOgps } from "./func";
import { FormValidation, useForm } from "@raycast/utils";

type SearchArticleValues = {
  accessToken: string;
  userID: string;
  tag: string;
};

export default function Command() {
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useNavigation();
  const { handleSubmit, itemProps, setValue } = useForm<SearchArticleValues>({
    async onSubmit(values) {
      await saveAccessToken(values.accessToken);
      await saveUserID(values.userID);
      await saveTag(values.tag);

      const query = `?query=user:${values.userID}+tag:${values.tag}`;
      const urls: string[] = [];
      const articles: ArticleInfo[] = [];

      try {
        await showToast({
          style: Toast.Style.Animated,
          title: "Fetching Article...",
        });

        setAccessToken(values.accessToken);
        const res = await apiClient.get(query);

        res.data.forEach((item: QiitaItemRes) => {
          if (item) {
            articles.push({ title: item.title, url: item.url, image: "" });
          }
        });

        const setArticle = await setOgps(articles);

        await showToast({
          style: Toast.Style.Success,
          title: "Success Copied!",
        });

        await push(<ResultView articles={setArticle} urls={urls} />);
      } catch (err) {
        await showToast({
          style: Toast.Style.Failure,
          title: `Fetching Error: ${err}`,
        });
      }
    },
    validation: {
      accessToken: FormValidation.Required,
      userID: FormValidation.Required,
    },
  });

  //非同期のタイミングでレンダリングがうまくいってない
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const act = await getAccessToken();
        const userID = await getUserID();
        const tag = await getTag();

        setValue("accessToken", act || "");
        setValue("userID", userID || "");
        setValue("tag", tag || "");
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  //localstorageからfetchした値が反映されないのでこれで対応
  if (isLoading) {
    return (
      <Form isLoading={isLoading}>
        <Form.Description text="Loading..." />
      </Form>
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Fetch Article" onSubmit={handleSubmit} />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      {isLoading && <Form.Description text="Loading..." />}
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField title="Access Token" placeholder="Enter Access Token" {...itemProps.accessToken} />
      <Form.TextField title="User ID" placeholder="Enter User ID Without @" {...itemProps.userID} />
      <Form.TextField title="Tag" placeholder="Enter Tag" {...itemProps.tag} />
      <Form.Separator />
    </Form>
  );
}
