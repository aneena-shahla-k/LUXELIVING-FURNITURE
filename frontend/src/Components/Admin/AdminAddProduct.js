import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Package, CheckCircle2, AlertCircle } from "lucide-react";
import "./AdminForms.css";
import { API } from "../../api";

/* ── premium token system for add form ── */
const T = {
  formCard: {
    background: "#0f1628", border: "1px solid #1a2540",
    borderRadius: 14, padding: 24, maxWidth: 520, margin: "0 auto"
  },
  uploadBox: (filled) => ({
    border: filled ? "1px solid #1a2540" : "1px dashed #243456",
    background: filled ? "#080d18" : "rgba(10,15,30,0.4)",
    borderRadius: 10, padding: 20, textAlign: "center", position: "relative",
    transition: "border-color .15s", cursor: "pointer"
  }),
  previewImg: { width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 8, display: "block", marginBottom: 12 },
  fileLabel: {
    fontSize: 12, color: "#4f7eff", cursor: "pointer",
    padding: "6px 14px", borderRadius: 7, display: "inline-flex", alignItems: "center", gap: 5,
    border: "1px dashed #1a2540", background: "rgba(79,126,255,.08)",
  }
};

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", price: "", category: "chair" });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    
    formData.append("img", image);

    try {
      const res = await fetch(API.products, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Product published successfully.");
        setProduct({ name: "", price: "", category: "chair" });
        setImage(null); setPreview(null);
      } else {
        showToast("error", data.message || "Failed to add product.");
      }
    } catch {
      showToast("error", "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <button className="af-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ marginBottom: 24 }}>
        <div className="af-title" style={{ marginBottom: 3 }}>Add New Product</div>
        <div className="af-sub">Upload and publish a new item into your premium database stack.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type === "error" ? " error" : ""}`} style={{ marginBottom: 18 }}>
          {toast.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div style={T.formCard}>
        <form onSubmit={handleSubmit}>
          <div className="af-group">
            <label className="af-label">Product Name</label>
            <input className="af-input" type="text" name="name"
              value={product.name} onChange={handleChange}
              placeholder="e.g., Bruna Cushion Chair" required />
          </div>

          <div className="af-row">
            <div className="af-group">
              <label className="af-label">Price (₹)</label>
              <input className="af-input" type="number" name="price"
                value={product.price} onChange={handleChange}
                placeholder="4500" required />
            </div>
            <div className="af-group">
              <label className="af-label">Category Descriptor</label>
              <select className="af-select" name="category"
                value={product.category} onChange={handleChange}>
                <option value="chair">Chair</option>
                <option value="sofa">Sofa</option>
                <option value="swing">Swing</option>
                <option value="bed">Bed</option>
                <option value="table">Dining</option>
                <option value="shelves">Shelves</option>
              </select>
            </div>
          </div>

          <div className="af-group" style={{ marginBottom: 22 }}>
            <label className="af-label">Asset Specification Image</label>
            <div style={T.uploadBox(!!preview)}>
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" style={T.previewImg} />
                  <button type="button" className="af-remove-btn" style={{ margin: "0 auto" }}
                    onClick={() => { setImage(null); setPreview(null); }}>
                    Change Current Asset
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer", display: "block" }}>
                  <div className="af-upload-inner">
                    <div className="af-upload-icon" style={{ margin: "0 auto 8px" }}><Upload size={16} style={{ color: "#4f7eff" }} /></div>
                    <div className="af-upload-text" style={{ fontSize: 13, color: "#dde6f5", fontWeight: 500 }}>Click to upload store matrix graphic</div>
                    <div className="af-upload-hint" style={{ fontSize: 11, color: "#6b82a8", marginTop: 4 }}>PNG, JPG, WEBP — up to 5MB</div>
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} required />
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="af-save-btn" style={{ width: "100%", padding: "12px 0" }} disabled={loading}>
            {loading ? "Publishing Assets…" : <><Package size={14} /> Publish Product Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}
