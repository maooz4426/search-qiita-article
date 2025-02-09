import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";
import Style = Toast.Style;
import { ArticleInfo, FormItem, QiitaItemRes } from "./types";
import { getAccessToken, getTag, getUserID, saveAccessToken, saveTag, saveUserID } from "./stores";
import ogs from "open-graph-scraper";
import { ResultView } from "./components/ResultView";

type Props = {
  accessToken: string;
  userID: string;
  tag: string;
};

export default function Command() {
  const [formItem, setFormItem] = useState<FormItem>({
    accessToken: "",
    userID: "",
    tag: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useNavigation();

  const getOgps = async (urls: string[]) => {
    try {
      const promises = urls.map((url) => ogs({ url }).then((res) => res.result.ogImage?.[0].url || ""));
      const ogps = await Promise.all(promises);
      return ogps;
    } catch (error) {
      console.error("Error fetching OGP images:", error);
      return [];
    }
  };

  const searchArticle = async (props: Props) => {
    await saveAccessToken(props.accessToken);
    await saveUserID(props.userID);
    await saveTag(props.tag);

    const apiClient = axios.create({
      baseURL: "https://qiita.com/api/v2/items",
      headers: {
        Authorization: `Bearer ${formItem.accessToken}`,
      },
    });
    const query = `?query=user:${props.userID}+tag:${props.tag}`;

    const titles: string[] = [];
    const urls: string[] = [];

    try {
      await showToast({
        style: Style.Animated,
        title: "Fetching Article...",
      });
      const res = await apiClient.get(query);
      res.data.forEach((item: QiitaItemRes) => {
        if (item.url) {
          urls.push(item.url);
        }
        if (item.title) {
          titles.push(item.title);
        }
      });
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Fetching Error: ${err}`,
      });
    } finally {
      const ogps = await getOgps(urls);
      await showToast({
        style: Toast.Style.Success,
        title: "Success Copied!",
      });

      const articles: ArticleInfo[] = urls.map((url, index) => ({
        title: titles[index],
        url: url,
        image: ogps[index],
      }));

      await push(<ResultView articles={articles} urls={urls} />);
    }
  };

  //非同期のタイミングでレンダリングがうまくいってない
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const act = await getAccessToken();
        const userID = await getUserID();
        const tag = await getTag();

        setFormItem((prev) => ({
          ...prev,
          accessToken: act || "",
          userID: userID || "",
          tag: tag || "",
        }));
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
          <Action.SubmitForm title="Fetch Article" onSubmit={searchArticle} />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      {isLoading && <Form.Description text="Loading..." />}
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField
        id="accessToken"
        title="Access Token"
        placeholder="Enter Access Token"
        value={formItem.accessToken || ""}
        onChange={(value) => {
          setFormItem((prev) => ({ ...prev, accessToken: value }));
        }}
      />
      <Form.TextField
        id="userID"
        title="User ID"
        placeholder="Enter User ID Without @"
        value={formItem.userID || ""}
        onChange={(value) => setFormItem((prev) => ({ ...prev, userID: value }))}
      />
      <Form.TextField
        id="tag"
        title="Tag"
        placeholder="Enter Tag"
        value={formItem.tag || ""}
        onChange={(value) => setFormItem((prev) => ({ ...prev, tag: value }))}
      />
      <Form.Separator />
    </Form>
  );
}
