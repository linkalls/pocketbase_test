import { useAtom } from "jotai";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { imageAtom } from "./global_jotai";
import "./index.css";

// PocketBaseインスタンスを作成
const pb = new PocketBase("http://127.0.0.1:8090");

async function auth() {
  try {
    const authdata = await pb
      .collection("users")
      .authWithOAuth2({ provider: "github" });
    // PocketBaseの内部状態管理に任せる
    console.log("認証成功:", pb.authStore.isValid);
    console.log(authdata.record);
  } catch (error) {
    console.error("認証エラー:", error);
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);
  const [imageUrl, setImageUrl] = useAtom(imageAtom);

  useEffect(() => {
    // 認証状態の変更を監視
    pb.authStore.onChange(() => {
      setIsLoggedIn(pb.authStore.isValid);
      // if (pb.authStore.record?.avatar) {
      //   setImageUrl(`http://127.0.0.1:8090/api/files/_pb_users_auth_/${pb.authStore.record?.id}/${pb.authStore.record?.avatar}`);
      // }
    });
    if (pb.authStore.record?.avatar) {
      setImageUrl(
        `http://127.0.0.1:8090/api/files/_pb_users_auth_/${pb.authStore.record?.id}/${pb.authStore.record?.avatar}`
      );
    }
  }, [setImageUrl]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-2xl">
        ログイン状態: {isLoggedIn ? "ログイン中" : "未ログイン"}
        <img src={imageUrl} alt="" />
        <button
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={auth}
        >
          GitHubでログイン
        </button>
      </div>
    </div>
  );
}

export default App;
