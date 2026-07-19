import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  LucideCheck,
  LucideShoppingBag,
  LucideArrowLeft,
} from "lucide-react";
import "./CommonAll.css";
import { API } from "../../../api";

export default function ShopTheLookPage() {
  const { roomType } = useParams();

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  const navigate = useNavigate();

  // ✅ Supports both Cloudinary and old uploads folder
  const getImageUrl = (img) => {
    if (!img) return "";

    if (img.startsWith("http")) {
      return img;
    }

    return `${process.env.REACT_APP_API_URL}/${img}`;
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [roomType]);

  useEffect(() => {
    const fetchRoomLook = async () => {
      setLoading(true);

      try {
       const response = await fetch(`${API.shopLook}/${roomType}`);
const data = await response.json();

if (response.ok && data.success && data.data.length > 0) {

    const look = data.data[0];   // 👈 first room

    setRoomData(look);

    const initialCheckboxes = {};

    look.products.forEach((item) => {
        const idStr = String(item._id || item.id);
        initialCheckboxes[idStr] = true;
    });

    setSelectedItems(initialCheckboxes);

} else {
    setRoomData(null);
}
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    if (roomType) {
      fetchRoomLook();
    }
  }, [roomType]);

  const handleCheckboxChange = (e, itemId) => {
    e.stopPropagation();

    const idStr = String(itemId);

    setSelectedItems((prev) => ({
      ...prev,
      [idStr]: !prev[idStr],
    }));
  };

  const calculateTotal = () => {
    if (!roomData || !roomData.products) return 0;

    return roomData.products.reduce((sum, item) => {
      const idStr = String(item._id || item.id);

      return selectedItems[idStr]
        ? sum + item.price
        : sum;
    }, 0);
  };

  const addSelectedToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Sign In / Sign Up to add products to your cart!");
      return;
    }

    const itemsToAdd = roomData.products.filter(
      (item) => selectedItems[String(item._id || item.id)]
    );

    if (itemsToAdd.length === 0) {
      alert("Please select at least one product!");
      return;
    }

    try {
      const promises = itemsToAdd.map((item) =>
        fetch(`${API.cart}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: item.title,
            price: item.price,
            img: item.img,
          }),
        })
      );

      await Promise.all(promises);

      alert("Selected products added to cart 🛒");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div
        className="container text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: "80vh",
          marginTop: "100px",
        }}
      >
        <div className="spinner-border text-success mb-3"></div>

        <p className="text-muted">
          Curating your luxury interior...
        </p>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div
        className="container text-center py-5"
        style={{
          marginTop: "120px",
        }}
      >
        <h3>Room not found</h3>

        <Link
          to="/collection"
          className="btn btn-success mt-3"
        >
          Back to Collection
        </Link>
      </div>
    );
  }
  return (
  <div
    className="shop-look-premium-container"
    style={{
      marginTop: "90px",
      backgroundColor: "#fcfbf7",
      minHeight: "100vh",
    }}
  >
    {/* HERO IMAGE */}
    <div
      className="position-relative overflow-hidden w-100"
      style={{ height: "55vh" }}
    >
      <img
        src={getImageUrl(roomData.mainImg)}
        className="w-100 h-100"
        alt={roomData.title}
        style={{
          objectFit: "cover",
          filter: "brightness(0.85)",
        }}
      />

      <div
        className="position-absolute start-0 bottom-0 w-100 p-4 p-md-5 d-flex flex-column justify-content-end"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.7), transparent)",
          height: "60%",
        }}
      >
        <span className="text-white-50 text-uppercase small mb-2">
          Interactive Editorial Look
        </span>

        <h1 className="text-white display-5 fw-normal m-0">
          {roomData.title}
        </h1>
      </div>
    </div>

    <div className="container py-5">

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom pb-4 mb-5">

        <div>
          <h2
            className="h3 mb-2"
            style={{ color: "#2d4a3e" }}
          >
            Complete the Look
          </h2>

          <p className="text-muted">
            Select the items you want to purchase
          </p>
        </div>

        <button
          className="btn text-white d-flex align-items-center gap-2"
          style={{
            background: "#3b5d50",
          }}
          onClick={addSelectedToCart}
        >
          <LucideShoppingBag size={18} />

          Add Selected
          (₹{calculateTotal().toLocaleString("en-IN")})
        </button>
      </div>

      <div className="row g-4">
        {roomData.products.map((item) => {

          const idStr = String(item._id || item.id);

          const isChecked = !!selectedItems[idStr];

          return (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={idStr}
            >
              <div
                className="card h-100 border-0 shadow-sm position-relative"
                style={{
                  cursor: "pointer",
                  opacity: isChecked ? 1 : .75,
                }}
                onClick={() =>
                  navigate(`/product/${idStr}`)
                }
              >

                <div
                  className="position-absolute top-0 start-0 m-3"
                  style={{
                    zIndex: 10,
                  }}
                  onClick={(e) =>
                    handleCheckboxChange(e, idStr)
                  }
                >
                  {isChecked ? (
                    <LucideCheck
                      color="#3b5d50"
                      size={22}
                    />
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        border: "2px solid #3b5d50",
                      }}
                    />
                  )}
                </div>

                <div
                  className="bg-light d-flex align-items-center justify-content-center p-4"
                  style={{
                    height: "280px",
                  }}
                >
                  <img
                    src={getImageUrl(item.img)}
                    alt={item.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="card-body">

                  <h5>{item.title}</h5>

                  <p
                    style={{
                      color: "#2d4a3e",
                      fontWeight: 600,
                    }}
                  >
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="d-flex justify-content-between">

                    <span
                      style={{
                        cursor: "pointer",
                        color: "#3b5d50",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${idStr}`);
                      }}
                    >
                      View Details →
                    </span>

                    <span>
                      {isChecked
                        ? "Selected"
                        : "Omitted"}
                    </span>

                  </div>

                </div>

              </div>
            </div>
          );

        })}
      </div>

      <div className="mt-5">
        <Link
          to="/collection"
          className="text-decoration-none"
          style={{
            color: "#3b5d50",
          }}
        >
          <LucideArrowLeft size={16} />
          {" "}
          Explore Other Spaces
        </Link>
      </div>

    </div>
  </div>
);
}