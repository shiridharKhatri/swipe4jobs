import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/component/About.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const ItemType = "ITEM";

function DraggableItem({ item, index, moveItem }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="item">
      <div className="lowOpacity">{item.title}</div>
      <h2>{item.info}</h2>
    </div>
  );
}

export default function About() {
  const [items, setItems] = useState([
    {
      title: "Search Requirements",
      info: "To search for postings anytime after they display on the Trending page, users shall click Search and include their originating Zip Code.",
    },
    {
      title: "Privacy and Security",
      info: (
        <>
          Details are found on the{" "}
          <Link to="/terms-of-use" aria-label="Terms of use link">
            Terms of Use
          </Link>{" "}
          page.
        </>
      ),
    },
    {
      title: "Approval",
      info: "Postings must adhere to traditional family values.",
    },
    {
      title: "Posting Order",
      info: "Newest postings will display first.",
    },
    {
      title: "Duration",
      info: "Approved postings will display for 5 weeks.",
    },
    {
      title: "October 01 and Beyond Posting Rate",
      info: "Jobs posted from October 01, 2024, will be at the $28 rate. The same Detail procedures implemented for Free Postings shall be utilized.",
    },
    {
      title: "Posting Notes",
      info: "Posting Modifications are not permitted. Unlike most other online Job Search services, SWIPE 4 JOBS offers a premium service at a highly reduced rate. Savings are facilitated by limiting Postings to those familiar with the Posting process, and will not make modifications. Our typical Users include Owners, Managers, and Human Resource Professionals.",
    },
    {
      title: "Free Postings",
      info: "For the months of August and September only, we are offering a Referral special. Employers are requested to notify 5 or more others in their network regarding our Referral special. Your FREE posting will include up to 2 pages on your Electronic Letterhead stationery. Your FREE posting will also include your entity-designated logo (a $50 value). Your FREE Posting commences on the Post page.",
    },
  ]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  useEffect(() => {
    window.document.title = "SWIPE 4 JOBS | About";
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
         <Header
         post={'POST'}
          firstText="SWIPE"
          secondHeighlightText="4"
          lastText="JOBS"
          byline=" Showcasing the Future of the Career Marketplace"
        />
      <div className="aboutHeaderText">ABOUT</div>
      <section className="about-container">
        {items.map((item, index) => (
          <DraggableItem
            key={index}
            index={index}
            item={item}
            moveItem={moveItem}
          />
        ))}
      </section>
    </DndProvider>
  );
}
