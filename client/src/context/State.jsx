import { useState, useEffect } from "react";
import { Context } from "./Context";
import axios from "axios";
import Cookies from "js-cookies";
function State({ children }) {
  const HOST = import.meta.env.VITE_HOST;

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
    if (Cookies.getItem("token")) {
      try {
        const response = await axios.get(
          `${HOST}/user/auth/verification/fetch`,
          {
            headers: {
              "auth-token": Cookies.getItem("token"),
            },
          }
        );
        return response.data;
      } catch (error) {
        return console.log(error.response.data.message);
      }
    }
  };

  return (
    <Context.Provider value={{ fetchPost, fetchUser }}>
      {children}
    </Context.Provider>
  );
}

export default State;
