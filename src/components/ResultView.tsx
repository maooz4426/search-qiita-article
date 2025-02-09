// ResultView.tsx
import { ActionPanel, Action, List, Clipboard } from "@raycast/api";
import { ArticleInfo } from "../types";

type ResultViewProps = {
  articles: ArticleInfo[];
  urls: string[];
};

export const ResultView = (props: ResultViewProps) => {
  return (
    <List isShowingDetail>
      {props.articles.map((article, i) => (
        <List.Item
          key={i}
          title={`${article.title}`}
          actions={
            <ActionPanel>
              <Action title="All Articles Copy" onAction={() => Clipboard.copy(props.urls.join("\n\n"))} />
              <Action title={"Copy Article URL"} onAction={() => Clipboard.copy(article.url)} />
              <Action.OpenInBrowser url={article.url} />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail
              markdown={`![](${article.image})`}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="title" text={props.articles[i].title} />
                  <List.Item.Detail.Metadata.Label title="url" text={props.articles[i].url} />
                  <List.Item.Detail.Metadata.Label
                    title="likes_count"
                    text={props.articles[i].likes_count.toString()}
                  />
                  <List.Item.Detail.Metadata.Label
                    title="stocks_count"
                    text={props.articles[i].stocks_count.toString()}
                  />
                  <List.Item.Detail.Metadata.Label
                    title="tags"
                    text={props.articles[i].tags.map((tag) => tag.name).join(" ")}
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))}
    </List>
  );
};
