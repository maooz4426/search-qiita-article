import axios from "axios";
import { Clipboard, showToast, Toast } from "@raycast/api";

type Props = {
  accessToken: string;
  user: string;
  tag: string;
}

export const searchArticle = async(props: Props) =>{
  // const [user, setUser] = useState("");
  // const [tag, setTag] = useState("");

  const apiClient = axios.create(
    {
      baseURL: "https://qiita.com/api/v2/items",
    headers : {
      "Authorization": `Bearer ${props.accessToken}`
}
}
)

  const query = `?query=user:${props.user}+tag:${props.tag}`

  const urls = []

  try{
    const res = await apiClient.get(query);

    res.data.forEach(item => {
      if(item.url){
        urls.push(item.url);
      }
    })
  }
  catch(err){
    console.log(err)
    showToast(err)
  }finally{
    const urlText = urls.join("\n\n")
    await Clipboard.copy(urlText)
    await showToast({
      style: Toast.Style.Animated,
      title: "Success Copied!",
    });
  }

}