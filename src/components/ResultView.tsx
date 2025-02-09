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
              <Action title="All Copy" onAction={() => Clipboard.copy(props.urls.join("\n\n"))} />
              <Action title={"Copy URL"} onAction={() => Clipboard.copy(article.url)} />
            </ActionPanel>
          }
          detail={<List.Item.Detail markdown={`![](${article.image})`} />}
        />
      ))}
    </List>
  );
};
