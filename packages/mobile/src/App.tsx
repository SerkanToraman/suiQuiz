import { useCallback, useEffect, useState } from "@lynx-js/react";
import { trpc } from "./utils/trpcClient.ts"; // ✅ Import tRPC client
import "./App.css";
import arrow from "./assets/arrow.png";
import lynxLogo from "./assets/lynx-logo.png";
import reactLynxLogo from "./assets/react-logo.png";

// ✅ Define a User type based on your database model
type User = {
  id: string;
  name: string;
  bio?: string;
};

export function App() {
  const [alterLogo, setAlterLogo] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null); // ✅ Track new users via WebSocket
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Fetching user...");
    const fetchUser = async () => {
      try {
        const userData = await trpc.user.getUserById.query(
          "57c4ca3d-d08c-4876-92c0-ca9154ad031b"
        );
        setUser(userData);
        console.log("✅ User Data:", userData);
      } catch (error) {
        console.error("❌ User Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Subscribe to new user events via WebSocket
  useEffect(() => {
    console.log("📡 Subscribing to WebSocket...");
    const sub = trpc.user.onNewUser.subscribe(undefined, {
      onData(data: User) {
        console.log("🔥 New User Event:", data);
        setNewUser(data);
      },
      onError(error: any) {
        console.error("❌ WebSocket Error:", error);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    console.info("Hello, ReactLynx");
  }, []);

  const onTap = useCallback(() => {
    "background only";
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          <view className="Logo" bindtap={onTap}>
            {alterLogo ? (
              <image src={reactLynxLogo} className="Logo--react" />
            ) : (
              <image src={lynxLogo} className="Logo--lynx" />
            )}
          </view>
          <text className="Title">Sui Test</text>
          <text className="Subtitle">on Lynx</text>
        </view>
        <view className="Content">
          <image src={arrow} className="Arrow" />
          {loading ? (
            <text className="Description">Loading user...</text>
          ) : user ? (
            <text className="Description">User: {user.name}</text>
          ) : (
            <text className="Description">User not found</text>
          )}
          {newUser && (
            <text className="Notification">
              🔥 New user created: {newUser.name}
            </text>
          )}
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  );
}
