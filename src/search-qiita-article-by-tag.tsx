import { Action, ActionPanel, Clipboard, Form, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";
import Style = Toast.Style;

type Props = {
  accessToken: string;
  user: string;
  tag: string;
};

type QiitaItemRes = {
  url: string;
};

//このプロパティ変更しただけだと再レンダリングされない(配列も同様)
type FormItem = {
  accessToken: string;
  user: string;
  tag: string;
};

const saveAccessToken = async (accessToken: string) => {
  await LocalStorage.setItem("access-token", accessToken);
};

const getAccessToken = async () => {
  const accessToken = await LocalStorage.getItem<string>("access-token");
  return accessToken;
};

export default function Command() {
  const [formItem, setFormItem] = useState<FormItem>({
    accessToken: "",
    user: "",
    tag: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const searchArticle = async (props: Props) => {
    saveAccessToken(props.accessToken);
    const apiClient = axios.create({
      baseURL: "https://qiita.com/api/v2/items",
      headers: {
        Authorization: `Bearer ${formItem.accessToken}`,
      },
    });
    const query = `?query=user:${props.user}+tag:${props.tag}`;

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
      });
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Fetching Error: ${err}`,
      });
      // console.log(err);
    } finally {
      const urlText = urls.join("\n\n");
      await Clipboard.copy(urlText);
      await showToast({
        style: Toast.Style.Success,
        title: "Success Copied!",
      });
    }
  };

  //非同期のタイミングでレンダリングがうまくいってない
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const act = await getAccessToken();
        setFormItem((prev) => ({
          ...prev,
          accessToken: act || "",
        }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // useEffect(() => {
  //   setIsLoading(false);
  // }, [isLoading]);

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
          console.log(formItem);
        }}
      />
      <Form.TextField
        id="user"
        title="User ID"
        placeholder="Enter User ID"
        value={formItem.user || ""}
        onChange={(value) => setFormItem((prev) => ({ ...prev, user: value }))}
      />
      <Form.TextField
        id="tag"
        title="Tag"
        placeholder="Enter Tag"
        value={formItem.tag || ""}
        onChange={(value) => setFormItem((prev) => ({ ...prev, tag: value }))}
      />
    </Form>
  );
}
