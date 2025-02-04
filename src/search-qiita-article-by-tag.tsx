import { Form, ActionPanel, Action, Clipboard, showToast, Toast } from "@raycast/api";

import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  accessToken: string;
  user: string;
  tag: string;
};

type QiitaItemRes = {
  url: string;
};

const saveAccessToken = async (accessToken: string) => {
  await LocalStorage.setItem("access-token", accessToken);
};

const getAccessToken = async () => {
  const accessToken = await LocalStorage.getItem<string>("access-token");
  // console.log(accessToken);
  return accessToken;
};

export default function Command() {
  const [showAccessToken, setShowAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // const firstSet = async () => {
  //   setLoading(true);
  //   const accessToken = await getAccessToken();
  //   setShowAccessToken(accessToken || "");
  // };
  // firstSet();

  const searchArticle = async (props: Props) => {
    setLoading(true);
    setShowAccessToken(props.accessToken);
    saveAccessToken(props.accessToken);
    const apiClient = axios.create({
      baseURL: "https://qiita.com/api/v2/items",
      headers: {
        Authorization: `Bearer ${showAccessToken}`,
      },
    });
    const query = `?query=user:${props.user}+tag:${props.tag}`;

    const urls: string[] = [];

    try {
      const res = await apiClient.get(query);

      res.data.forEach((item: QiitaItemRes) => {
        if (item.url) {
          urls.push(item.url);
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      const urlText = urls.join("\n\n");
      await Clipboard.copy(urlText);
      await showToast({
        style: Toast.Style.Animated,
        title: "Success Copied!",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const act = await getAccessToken();
        setShowAccessToken(act || "");
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
    setLoading(false);
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={searchArticle} />
        </ActionPanel>
      }
      isLoading={loading}
    >
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField
        id="accessToken"
        title="Access Token"
        placeholder="Enter Access Token"
        value={showAccessToken || ""}
        onChange={(value) => setShowAccessToken((prev) => Object.assign({}, prev, { value }))} //スプレッド構文でエラーを吐いたため
      />
      <Form.TextField id="user" title="User ID" placeholder="Enter User ID" value={userId || ""} onChange={setUserId} />
      <Form.TextField id="tag" title="Tag" placeholder="Enter Tag" value={tag || ""} onChange={setTag} />
      <Form.Separator />
    </Form>
  );
}
