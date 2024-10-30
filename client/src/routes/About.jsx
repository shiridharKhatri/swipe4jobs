import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/component/About.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Heading from "../components/Heading";

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
      title: "Usage",
      info: "By accessing or interacting with this website, you are agreeing to abide by all conditions included in our Terms of Use. ",
    },
    {
      title: "Privacy & Security",
      info: (
        <>
          Details regarding Privacy and Security are outlined in our{" "}
          <Link to="/terms-of-use" aria-label="Terms of use link">
            Terms of Use
          </Link>{" "}
        </>
      ),
    },
    {
      title: "Posting Administration",
      info: " The administrators of the website, for whatever reason they see fit, and without any prior notice whatsoever, reserve the right to disallow, modify, edit or delete any Posting. ",
    },
    {
      title: "Posting Overview ",
      info: `We do not provide advice on how to format or structure a Job Posting.  Unlike most other online Job Search services, 
      Swipe 4 Jobs offers a premium service at an extremely reduced rate. Savings are facilitated by limiting Postings to those 
      familiar with the Posting process   Our typical Users include Owners, Managers, and Human Resource Professionals.   
      Beginning February 01, 2025, the rate for a 5 week posting will  be $28.  Depending on specific third party pricing plans, 
      this could represent an immediate savings of well over $300. `,
    },
    {
      title: "Free Postings",
      info: `
      For the entire months of December and January, one Free posting is available to new and existing clients. 
      Your Free posting will include up to 2 pages on your Electronic Letterhead stationery. 
      Your Free posting will additionally include your full color entity-designated logo.`,
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
      <Heading title={'About Us'}/>
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
