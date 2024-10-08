import React, { useContext, useEffect } from "react";
import Header from "../components/Header";
import TrendingPost from "../components/TrendingPost";
import Footer from "../components/Footer";
export default function Root() {
  useEffect(() => {
    window.document.title = "SWIPE 4 JOBS | Home";
  }, []);

  return (
    <>
         <Header
          firstText="SWIPE"
          secondHeighlightText="4"
          lastText="JOBS"
          byline=" Showcasing the Future of the Career Marketplace"
        />
      <TrendingPost />
      <Footer />
    </>
  );
}
