import PocketBase from "pocketbase";
import "./App.css";

async function auth() {
  const pb = new PocketBase("http://127.0.0.1:8090");

  // This method initializes a one-off realtime subscription and will
  // open a popup window with the OAuth2 vendor page to authenticate.
  //
  // Once the external OAuth2 sign-in/sign-up flow is completed, the popup
  // window will be automatically closed and the OAuth2 data sent back
  // to the user through the previously established realtime connection.
  //
  // If the popup is being blocked on Safari, you can try the suggestion from:
  // https://github.com/pocketbase/pocketbase/discussions/2429#discussioncomment-5943061.
  await pb.collection("users").authWithOAuth2({ provider: "github" });

  // after the above you can also access the auth data from the authStore
  console.log(pb.authStore.isValid);
  console.log(pb.authStore.token);
  console.log(pb.authStore.record?.id);
  pb.authStore.clear();
  // console.log(pb.authStore.isValid);
}

function App() {
  return (
    <button
      onClick={async () => {
        auth();
      }}
    >
      Click me
    </button>
  );
}

export default App;
