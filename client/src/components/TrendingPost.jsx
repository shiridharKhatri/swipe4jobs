import React, { useContext, useEffect, useState } from "react";
import { Fa6icons, GiIcons } from "../assets/Icons/icons";
import Loader from "../tools/Loader";
import { Context } from "../context/Context";

export default function TrendingPost() {
  const HOST = import.meta.env.VITE_HOST
  let { fetchPost } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [data, setData] = useState([]);

  const SkeletonLoader = () => {
    return (
      <div className="loaderCard">
        {[0, 0, 0, 0, 0, 0].map((_, index) => {
          return (
            <div key={index} className="cards-loader">
              <div className="image-loader"></div>
              <div className="others-loader">
                <div className="headTitle-loader"></div>
                <div className="tags-loader">
                  <span></span>
                  <span></span>
                </div>
                <div className="state-loader"></div>
                <div className="paragraph-loader"></div>
                <div className="paragraph-loader-two"></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    fetchPost()
      .then((data) => {
        if (data.success === true) {
          setData(data);
          setIsContentLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, [fetchPost]);

  useEffect(() => {
    const startTime = performance.now();

    const timer = setTimeout(() => {
      const endTime = performance.now();
      if (endTime - startTime >= 3000) {
        setLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="trending-post-container">
          <h1 className="titleHead">
            <div className="line"></div>TRENDING
          </h1>
          {isContentLoading && <SkeletonLoader />}
          {!isContentLoading && (
            <div className="card-container">
              {data.jobs
                .slice(0, 6)
                .reverse()
                .map((e) => {
                  return (
                    <div key={e._id} className="job-card">
                      <div className="image">
                        <img src={`${HOST}/image/${e.logo.filename}`} alt={e.name} />
                      </div>
                      <div className="details-section">
                        <div className="first-details">
                          <h2 className="items-group ">{e.name}</h2>
                          <div className="tags items-group ">
                            <div className="tag-cont">
                              <span className="tag locTag">{e.state}</span>
                              <span className="tag catTag">{e.position[0]}</span>
                            </div>
                            <div className="type">
                              {e.schedule.map((e, ind) => {
                                return <h3 key={ind}>{e}</h3>;
                              })}
                            </div>
                          </div>
                          <div className="locationTag items-group ">
                            {e.city}&nbsp;
                            <div className="dot">
                              <GiIcons.GoDotFill />
                            </div>
                            &nbsp;{e.state}&nbsp;
                            <div className="dot">
                              <GiIcons.GoDotFill />
                            </div>
                            &nbsp;{e.zip}
                          </div>
                          <p className="items-group ">{e.overview}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      )}
    </>
  );
}
