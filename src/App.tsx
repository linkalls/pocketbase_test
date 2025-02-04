import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import "./index.css";

// PocketBaseインスタンスを作成
const pb = new PocketBase("http://127.0.0.1:8090");

async function auth() {
  try {
    await pb.collection("users").authWithOAuth2({ provider: "github" });
    // PocketBaseの内部状態管理に任せる
    console.log("認証成功:", pb.authStore.isValid);
  } catch (error) {
    console.error("認証エラー:", error);
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);

  useEffect(() => {
    // 認証状態の変更を監視
    pb.authStore.onChange(() => {
      console.log("認証状態が変更されました:", {
        isValid: pb.authStore.isValid,
      });
      setIsLoggedIn(pb.authStore.isValid);
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-2xl">
        ログイン状態: {isLoggedIn ? "ログイン中" : "未ログイン"}
      </div>
      <button onClick={auth}>GitHubでログイン</button>
    </div>
  );
}

export default App;
