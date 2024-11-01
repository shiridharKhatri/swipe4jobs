import React, { useEffect } from "react";
import "../styles/component/Invoice.css";
import { MdIcons } from "../assets/Icons/icons";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
export default function Invoice({ invoiceRef, paymentData, currentDate }) {
  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (!element) {
      console.error("Invoice element is not available for download.");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    pdf.addImage(data, "PNG", 0, 0, canvasWidth * scale, canvasHeight * scale);
    pdf.save(`${paymentData.name}-${paymentData.paymentMethod}.pdf`);
  };



  return (
    <section className="invoice">
      <div className="invoice-container">
        <div className="invoice-box" ref={invoiceRef}>
          <table>
            <tr className="top">
              <td colSpan="2">
                <table>
                  <tr>
                    <td className="title">
                      <div className="ogo">
                        SWIPE<span>4</span>JOBS
                      </div>
                    </td>

                    <td>
                      Transaction id : {paymentData.id}
                      <br />
                      Created: {currentDate}
                      <br />
                      Purchase on : {paymentData.purchaseDate}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colSpan="2">
                <table>
                  <tr>
                    <td>
                      {paymentData.name}
                      <br />
                      {paymentData.email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr className="heading">
              <td>Payment Method</td>
              <td></td>
            </tr>
            <tr className="details">
              <td>{paymentData.paymentMethod}</td>
              <td></td>
            </tr>
            <tr className="heading">
              <td>Item</td>
              <td>Price</td>
            </tr>
            <tr className="item">
              <td>{paymentData.product}</td>
              <td>${paymentData.price}</td>
            </tr>
            <tr className="total">
              <td></td>
              <td>Total: ${paymentData.total}</td>
            </tr>
          </table>
        </div>
        <div className="btn">
          {" "}
          <button onClick={handleDownload}>
            {" "}
            <span>
              <MdIcons.MdOutlineFileDownload />
            </span>
            Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
