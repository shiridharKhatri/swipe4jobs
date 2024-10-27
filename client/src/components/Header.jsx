import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { EffectCards, Autoplay } from "swiper/modules";
import ColorThief from "colorthief";
import { Context } from "../context/Context";
import Map from "./Map";
export default function Header(props) {
  const HOST = import.meta.env.VITE_HOST;

  const [isLoading, setIsLoading] = useState(true);
  let navigation = useNavigate();
  const { fetchPost } = useContext(Context);
  const [data, setData] = useState([]);
  const [dominantColor, setDominantColor] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const imgRef = useRef([]);
  const swiperRef = useRef(null);

  const paginationOnClick = (status) => {
    if (status.toLowerCase() === "next") {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    }
    if (status.toLowerCase() === "prev") {
      if (swiperRef.current) {
        swiperRef.current.slidePrev();
      }
    }
  };

  useEffect(() => {
    fetchPost()
      .then((res) => {
        if (res.success) {
          setIsLoading(false);
          setData(res.jobs);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [fetchPost]);

  useEffect(() => {
    if (data.length > 0) {
      let colours = new Array(data.length).fill("transparent");
      imgRef.current.forEach((el, index) => {
        let colorThief = new ColorThief();
        if (el && el.complete) {
          const color = colorThief.getColor(el);
          colours[index] = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
      });
      setDominantColor(colours);
    }
  }, [data]);

  return (
    <header>
      <Navbar post={props.post} />
      <div className="head-container">
        <div className="text-section">
          <h1>
            {props.firstText}
            <span>{props.secondHeighlightText}</span>
            {props.lastText}
          </h1>
          <p> {props.byline}</p>
          <button onClick={() => navigation(`/post-jobs`)}>POST JOBS</button>
        </div>
        <div className="job-slider">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            effect={"cards"}
            grabCursor={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[EffectCards,]}
            className="mySwiper"
          >
            {isLoading && (
              <>
                {[0, 0, 0, 0, 0].map((_, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="card card-loader"></div>
                    </SwiperSlide>
                  );
                })}
              </>
            )}
            {!isLoading && (
              <>
                {data?.slice(0, 10).map((elems, index) => {
                  return (
                    <SwiperSlide key={elems._id}>
                      <div className="card">
                        <div
                          className={`mapSection ${
                            hoveredIndex === index ? "hovered" : ""
                          }`}
                        >
                          {" "}
                          <Map cityName={elems.city} />
                        </div>

                        <div className="headSec">
                          <img
                            ref={(el) => (imgRef.current[index] = el)}
                            src={`${HOST}/image/${elems.logo.filename}`}
                            alt={elems.name}
                            onLoad={() => {
                              let colorThief = new ColorThief();
                              const color = colorThief.getColor(
                                imgRef.current[index]
                              );
                              setDominantColor((prevColors) => {
                                const newColors = [...prevColors];
                                newColors[
                                  index
                                ] = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                                return newColors;
                              });
                            }}
                            crossOrigin="annonymous"
                          />
                          <div
                            style={{ background: dominantColor[index] }}
                            className="status"
                          >
                            {elems.position[0]}
                          </div>
                        </div>
                        <div className="second">
                          <div className="text-2">
                            {elems.overview.length > 48
                              ? elems.overview.slice(0, 48) + " ..."
                              : elems.overview}
                          </div>
                        </div>
                        <div className="third">
                          <div className="btn-item btnOne">{elems.city}</div>
                          <div className="btn-item btnTwo">
                            {elems.state.toLowerCase() ===
                            "district of columbia"
                              ? "DOC"
                              : elems.state}
                          </div>
                          <div className="btn-item btnThree">{elems.zip}</div>
                        </div>
                        <div className="btn">
                          <button
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            View map
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </>
            )}
            <div className="pagination">
              <div
                className="prev paginationDot"
                onClick={() => paginationOnClick("prev")}
              ></div>
              <div className="current paginationDot"></div>
              <div
                className="next paginationDot"
                onClick={() => paginationOnClick("next")}
              ></div>
            </div>
          </Swiper>
        </div>
      </div>
    </header>
  );
}
