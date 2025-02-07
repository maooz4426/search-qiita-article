import { Action, ActionPanel, Clipboard, Form, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";
import Style = Toast.Style;
import { FormItem, QiitaItemRes } from "./types";
import { getAccessToken, getTag, getUserID, saveAccessToken, saveTag, saveUserID } from "./stores";

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
        const userID = await getUserID();
        const tag = await getTag();

        setFormItem((prev) => ({
          ...prev,
          accessToken: act || "",
          userID: userID || "",
          tag: tag || "",
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
    </Form>
  );
}
