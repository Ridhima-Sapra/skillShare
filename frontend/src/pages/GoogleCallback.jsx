// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/axios";

// function GoogleCallback() {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("Processing Google login...");

//   useEffect(() => {
//     const handleGoogleCallback = async () => {
//       // Grab "code" and "state" from query params
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get("code");
//       const state = params.get("state");

//       if (!code) {
//         setStatus("No authorization code found in URL.");
//         return;
//       }

//       try {
//         // Send code + state to backend callback
//         const res = await axios.get("/events/google-oauth-callback/", {
//           params: { code, state },
//     });

//         if (res.data.success) {
//           setStatus("Google account successfully linked! Redirecting...");
//           localStorage.setItem("token", res.data.access);
//           localStorage.setItem("refresh", res.data.refresh);

//           setTimeout(() => navigate("/dashboard"), 1500);
//         } else {
//           setStatus("Failed to link Google account. Please try again.");
//         }
//       } catch (err) {
//         console.error("Error in GoogleCallback:", err);
//         setStatus("Something went wrong during Google login.");
//       }
//     };

//     handleGoogleCallback();
//   }, [navigate]);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="p-6 bg-white shadow rounded-lg">
//         <h2 className="text-xl font-bold mb-2">Google Login</h2>
//         <p>{status}</p>
//       </div>
//     </div>
//   );
// }

// export default GoogleCallback;
