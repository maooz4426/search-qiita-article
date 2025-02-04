import { Form, ActionPanel, Action } from "@raycast/api";
import { searchArticle } from "./searchArticle";

// type Values = {
//   textfield: string;
//   textarea: string;
//   datepicker: Date;
//   checkbox: boolean;
//   dropdown: string;
//   tokeneditor: string[];
// };

export default function Command() {

  // function handleSubmit(values: Values) {
  //   console.log(values);
  //   showToast({ title: "Submitted form", message: "See logs for submitted values" });
  // }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={searchArticle} />
        </ActionPanel>
      }
    >
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="access-token" title="Access Token" placeholder="Enter Access Token" />
      <Form.TextArea id="user" title="User ID" placeholder="Enter User ID" />
      <Form.TextArea id="tag" title="Tag" placeholder="Enter Tag" />
      <Form.Separator />
    {/*  <Form.DatePicker id="datepicker" title="Date picker" />*/}
    {/*  <Form.Checkbox id="checkbox" title="Checkbox" label="Checkbox Label" storeValue />*/}
    {/*  <Form.Dropdown id="dropdown" title="Dropdown">*/}
    {/*    <Form.Dropdown.Item value="dropdown-item" title="Dropdown Item" />*/}
    {/*  </Form.Dropdown>*/}
    {/*  <Form.TagPicker id="tokeneditor" title="Tag picker">*/}
    {/*    <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />*/}
    {/*  </Form.TagPicker>*/}
    </Form>
  );
}
