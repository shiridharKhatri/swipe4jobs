import React, { useEffect, useState } from "react";
import TopDetails from "./TopDetails";
import { Fa6icons } from "../assets/Icons/icons";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "./Loader";
export default function Mpayment(props) {
  const HOST = import.meta.env.VITE_HOST;
  const ID = Cookies.get("admin-id");
  const TOKEN = Cookies.get("admin-token");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const fetchPayment = () => {
    setIsLoading(true);
    axios
      .post(`${HOST}/api/payment/details/fetch/${ID}`, null, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          setIsLoading(false);
          setPaymentData(response.data.data);
          const totalPrice = response.data.data.reduce(
            (acc, item) => acc + item.amount,
            0
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchPayment();
  }, []);
  return (
    <section className="manage-payment section">
      <TopDetails title="Manage Payment" navbar={props.navContainerRef} />
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="paymentDetails">
          <div className="head">
            <h1>Payment History</h1>
            <p>
              Total :{" "}
              <span>
                {" "}
                $
                {paymentData
                  ?.reduce((e, item) => e + item.amount, 0)
                  .toFixed(2)}
              </span>
            </p>
          </div>
          {!paymentData || paymentData?.length <= 0 ? (
            <div className="noPayment">
              <img src="/noPayment.png" about="no payment image" />
              <p>No payment has been done yet</p>
            </div>
          ) : (
            <div className="card-container">
              {paymentData?.map((e) => {
                return (
                  <div key={e.id} className="cardItem">
                    <div className="details c-item">
                      <div className="profile-details">
                        <div className="name">{e.name}</div>
                        <div className="method det">
                          Payment method : <span>{e.paymentMethod}</span>
                        </div>
                        <div className="paidFor det">
                          Paid for :{" "}
                          <span>
                            {e.serviceType} (+{e.search_limit})
                          </span>{" "}
                        </div>
                        <div className="price det">
                          Price :<span>${e.amount}</span>{" "}
                        </div>
                        <div className="status det">
                          Status :<span>{e.paymentStatus}</span>{" "}
                        </div>
                        <div className="remarks det">
                          Remarks : <span>{e.remarks}</span>
                        </div>
                        <div className="receipt det">
                          Download receipt :{" "}
                          <button>
                            <span>
                              <Fa6icons.FaFilePdf />
                            </span>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
