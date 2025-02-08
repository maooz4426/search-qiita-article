// ResultView.tsx
import { ActionPanel, Action, List, Clipboard } from "@raycast/api";

type ResultViewProps = {
  titles: string[];
  urls: string[];
  ogpImages: string[];
};

export const ResultView = (props: ResultViewProps) => {
  console.log(props.ogpImages);
  return (
    <List isShowingDetail>
      {props.ogpImages.map((image, i) => (
        <List.Item
          key={i}
          title={`${props.titles[i]}`}
          actions={
            <ActionPanel>
              <Action title="All Copy" onAction={() => Clipboard.copy(props.urls.join("\n\n"))} />
              <Action title={"Copy URL"} onAction={() => Clipboard.copy(image)} />
            </ActionPanel>
          }
          detail={<List.Item.Detail markdown={`![](${image})`} />}
        />
      ))}
    </List>
  );
};
