import Dashboard from "./dashboard/page";

// import { useEffect, useState } from "react";
// import axios from "axios";



export default function Page() {
  // const [recordingStarted, setRecordingStarted] = useState(false); // State to check API trigger

  // useEffect(() => {
  //   const triggerRecording = async () => {
  //     try {
  //       if (!recordingStarted) {
  //         const response = await axios.post("/api/footage/startRecording");
  //         console.log(response.data.message);
  //         setRecordingStarted(true); // Mark as triggered
  //       }
  //     } catch (error) {
  //       console.error("Failed to start recording", error);
  //     }
  //   };

  //   triggerRecording();
  // }, [recordingStarted]);
  return (
    <Dashboard/>
  );
}