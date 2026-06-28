import React, {useEffect,useState} from "react";
import axios from "axios";
import { useParams, Link} from "react-router-dom";
import "./DecorDetailPage.css";

const DecorDetailPage = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [ selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
  window.scrollTo(0, 0);
}, []); 

  useEffect(() => {
    const fetchDetail =
      async () => {
        try {
          const { data } =
            await axios.get(`http://localhost:5001/api/decor-details/${slug}`);
          setDetail(data);
          setSelectedItems(
            data.products.map(
              (_, index) =>
                index
            )
          );
        } catch (error) {
          console.log(error);
        }
      };
    fetchDetail();
  }, [slug]);

  if (!detail) {
    return <h1>Loading...</h1>;
  }
  

  const handleCheckboxChange =
    (index) => {
      if (
        selectedItems.includes(
          index
        )
      ) {
        setSelectedItems(

          selectedItems.filter(
            (item) =>
              item !== index
          )
        );
      } else {
        setSelectedItems([
          ...selectedItems,
          index,
        ]);
      }
    };
const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const selectedProducts = detail.products.filter((_, index) =>
      selectedItems.includes(index)
    );

    for (const product of selectedProducts) {
      await axios.post(
        "http://localhost:5001/api/cart/add",
        {
          name: product.name,
          price: product.price,
          img: product.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    window.dispatchEvent(new Event("cartUpdated"));

    
    setTimeout(() => {
      alert("Items added to cart");
    }, 100);

  } catch (error) {
    console.log(error);
    alert("Failed to add cart");
  }
};
  const total =
    detail.products.reduce(

      (
        acc,
        item,
        index
      ) => {

        if (
          selectedItems.includes(
            index
          )
        ) {

          return (
            acc +
            Number(item.price)
          );
        }

        return acc;
      },

      0
    );



  return (

    <div className="shop-look-section">

      <h1 className="look-page-title">
        {detail.title}
      </h1>



      <div className="shop-container">

        {/* LEFT */}
        <div className="image-section">

          <img
            src={`http://localhost:5001${detail.mainImage}`}

            alt=""

            className="main-image"
          />

        </div>



        {/* RIGHT */}
        <div className="look-panel">

          <h2>
            Shop This Look
          </h2>



          <div className="product-list">

            {detail.products.map(
              (
                item,
                index
              ) => (

                <div
                  className="look-item"
                  key={index}
                >

                  <div className="item-left">

                    <input
                      type="checkbox"

                      checked={selectedItems.includes(
                        index
                      )}

                      onChange={() =>
                        handleCheckboxChange(
                          index
                        )
                      }
                    />



                    <img
                      src={`http://localhost:5001${item.image}`}
                      alt=""
                    />



                    <p>
                      {item.name}
                    </p>

                  </div>



                  <span>
                    ₹ {item.price}
                  </span>

                </div>
              )
            )}

          </div>



          <div className="total-box">

            <h3>
              Total:
              ₹ {total}
            </h3>

            <button className="cart-btn" onClick={handleAddToCart}>
              Add Selected To Cart
            </button>

          </div>
        </div>
      </div>
      <div className="back-wrapper">
       <Link
                to="/collection/shop-the-decor"
                className="back-btn"
              >
                ← Back
              </Link></div>
    </div>
    
  );
};

export default DecorDetailPage;