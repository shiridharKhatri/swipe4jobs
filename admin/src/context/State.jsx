import { Context } from "./Context";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
export default function State({ children }) {
  const HOST = import.meta.env.VITE_HOST;
  const ID = Cookies.get("admin-id");
  const TOKEN = Cookies.get("admin-token");

  //   Route to fetch overview
  const fetchOveriew = async () => {
    try {
      let response = await axios.post(
        `${HOST}/api/analytics/overview/${ID}`,
        null,
        {
          headers: {
            "auth-token": TOKEN,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  //   Route to fetch all post
  const fetchJobs = async () => {
    try {
      let response = await axios.post(
        `${HOST}/api/jobs/post-job/fetch-all`,
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
  };

  // Handel approve job and reject job
  const handelPostAction = async (postID, action) => {
    try {
      const response = await axios.post(
        `${HOST}/api/jobs/action/post/${postID}/${action}`,
        null,
        {
          headers: { "auth-token": TOKEN },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Handel post job and update job
  const handelJobPosting = async (id, bodyContent) => {
    try {
      if (id === "" || id.length <= 0) {
        let reqOptions = {
          url: `${HOST}/api/jobs/post-job/admin/${ID}`,
          method: "POST",
          headers: { Accept: "*/*", "auth-token": TOKEN },
          data: bodyContent,
        };
        let respose = await axios.request(reqOptions);
        return respose;
      } else if (id.length > 2 || id !== "") {
        let reqOptions = {
          url: `${HOST}/api/jobs/post-job/edit/${id}`,
          method: "PUT",
          headers: {
            "auth-token": TOKEN,
          },
          data: bodyContent,
        };
        let respose = await axios.request(reqOptions);
        return respose;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllAdmin = async () => {
    try {
      let response = await axios.post(
        `${HOST}/auth/admin/existing/access/fetch-all`,
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
  };

  return (
    <Context.Provider
      value={{
        fetchOveriew,
        fetchJobs,
        handelPostAction,
        handelJobPosting,
        fetchAllAdmin,
      }}
    >
      {children}
    </Context.Provider>
  );
}
