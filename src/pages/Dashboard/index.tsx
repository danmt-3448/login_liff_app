import { useContext } from "react";
import { LiffContext } from "../../context/liff/LiffContext";

function Dashboard() {
  const { userLineInfo, isLoggedIn, liff } = useContext(LiffContext);
  // console.log("userLineInfo", userLineInfo);
  const sendTextMessages = async () => {
    try {
      await liff.sendMessages([
        {
          type: "text",
          text: "Hello, World!",
        },
      ]);
      console.log("message sent");
    } catch (err) {
      console.log("error", err);
    }
  };
  return (
    <div>
      <div>Page Dashboard</div>
      <div>Name: {userLineInfo?.displayName}</div>
      <div>Is Login: {isLoggedIn ? "true" : "false"}</div>
      <button onClick={sendTextMessages}>Say hello</button>
    </div>
  );
}
export default Dashboard;
