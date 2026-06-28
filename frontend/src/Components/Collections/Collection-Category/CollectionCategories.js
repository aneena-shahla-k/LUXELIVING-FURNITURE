import React from "react";
import "./CollectionCategories.css";

import chairImg from "../../../assets/images/collection/category/colChair.JPG";
import sofaImg from "../../../assets/images/collection/category/colSofa.JPG";
import swingImg from "../../../assets/images/collection/category/colSwing.JPG";
import bedImg from "../../../assets/images/collection/category/colBed.JPG";
import diningImg from "../../../assets/images/collection/category/colTable.JPG";
import shelfImg from "../../../assets/images/collection/category/colBook.JPG";

const categories = [
  {title: "Chair", image: chairImg, link: "/collections/chair"},
  {title: "Sofa", image: sofaImg, link: "/collections/sofa"},
  {title: "Swing", image: swingImg, link: "/collections/swing"},
  {title: "Bed", image: bedImg, link: "/collections/bed"},
  {title: "Table", image: diningImg, link: "/collections/"},
  {title: "Shelves", image: shelfImg, link: "/collections/shelves"},

];

const CollectionCategories = () => {
  return (
    <section className="collection-section">
      <div className="collection-header">
        <h2>Collection Categories</h2>
        <p>Designed with elegance. Crafted for comfort.</p>
      </div>

      <div className="collection-grid">
        {categories.map((item, index) => (
          <a href={item.link} className="collection-card" key={index}>
            <img src={item.image} alt={item.title} />

            <div className="overlay">
                <h3>{item.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CollectionCategories;