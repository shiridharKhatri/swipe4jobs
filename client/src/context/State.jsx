import { Context } from "./Context";
import axios from "axios";
import Cookies from "js-cookies";
import { useEffect } from "react";
function State({ children }) {
  const HOST = import.meta.env.VITE_HOST;
  const ID = Cookies.getItem("user-id");
  const TOKEN = Cookies.getItem("user-token");
  let fetchPost = async () => {
    try {
      const response = await axios.get(
        `${HOST}/api/jobs/post-job/fetch-approved`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return error;
    }
  };

  let fetchUser = async () => {
    if (TOKEN) {
      try {
        const response = await axios.get(
          `${HOST}/user/auth/verification/fetch`,
          {
            headers: {
              "auth-token": TOKEN,
            },
          }
        );
        return response.data;
      } catch (error) {
        return console.log(error.response.data.message);
      }
    }
  };
  let fetchUserPost = async () => {
    if (TOKEN) {
      try {
        let response = await axios.post(
          `${HOST}/api/jobs/action/post/fetch/all/${ID}`,
          null,
          {
            headers: {
              "auth-token": TOKEN,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  };
  let fetchFreeTrialDate = async () => {
    try {
      let response = await axios.get(
        `${HOST}/api/postRules/post/rules/date/fetch`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Context.Provider value={{ fetchPost, fetchUser, fetchUserPost }}>
      {children}
    </Context.Provider>
  );
}

export default State;
