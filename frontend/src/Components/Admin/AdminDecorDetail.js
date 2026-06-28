import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, Plus, Trash2, FileImage, CheckCircle2, AlertCircle } from "lucide-react";
import "./AdminForms.css";

const AdminDecorDetail = () => {
  const navigate = useNavigate();
  const [title, setTitle]           = useState("");
  const [decorSlug, setDecorSlug]   = useState("");
  const [mainImage, setMainImage]   = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [products, setProducts]     = useState([{ name: "", price: "", image: null, preview: null }]);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  const handleProductChange = (i, field, value) => {
    const u = [...products]; u[i][field] = value; setProducts(u);
  };
  const handleProductImage = (i, file) => {
    if (file) { const u = [...products]; u[i].image = file; u[i].preview = URL.createObjectURL(file); setProducts(u); }
  };
  const addProduct    = () => setProducts([...products, { name: "", price: "", image: null, preview: null }]);
  const removeProduct = (i) => { if (products[i].preview) URL.revokeObjectURL(products[i].preview); setProducts(products.filter((_,j) => j !== i)); };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("decorSlug", decorSlug);
      fd.append("mainImage", mainImage);
      fd.append("products", JSON.stringify(products.map(p => ({ name: p.name, price: p.price }))));
      products.forEach((p, i) => { if (p.image) fd.append(`productImage_${i}`, p.image); });
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/decor-details", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      showToast("success", "Decor detail saved successfully.");
      setTitle(""); setDecorSlug(""); setMainImage(null); setMainPreview(null);
      setProducts([{ name: "", price: "", image: null, preview: null }]);
    } catch (err) {
      showToast("error", "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="af-page">
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>

      <div className="af-header">
        <div className="af-title">Create Decor Detail</div>
        <div className="af-sub">Map products to a specific decor style collection.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type === "error" ? " error" : ""}`}>
          {toast.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="af-card">
        <form onSubmit={submitHandler}>

          <div className="af-row">
            <div className="af-group">
              <label className="af-label">Collection Title</label>
              <input className="af-input" type="text"
                placeholder="e.g., Cozy Corner Details"
                value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="af-group">
              <label className="af-label">Decor Slug</label>
              <input className="af-input" type="text"
                placeholder="e.g., cozy-corner"
                value={decorSlug} onChange={e => setDecorSlug(e.target.value)} required />
            </div>
          </div>

          <div className="af-group">
            <label className="af-label">Main Concept Image</label>
            <div className={`af-upload${mainPreview ? " filled" : ""}`}>
              {mainPreview ? (
                <div className="af-preview-wrap">
                  <img src={mainPreview} alt="Concept"/>
                  <button type="button" className="af-change-img"
                    onClick={() => { setMainImage(null); setMainPreview(null); }}>Change Image</button>
                </div>
              ) : (
                <>
                  <div className="af-upload-inner">
                    <div className="af-upload-icon"><Upload size={18}/></div>
                    <div className="af-upload-text">Click to upload main background layout</div>
                    <div className="af-upload-hint">PNG, JPG, WEBP — max 5 MB</div>
                  </div>
                  <input type="file" accept="image/*" required
                    onChange={e => { const f=e.target.files[0]; if(f){ setMainImage(f); setMainPreview(URL.createObjectURL(f)); }}} />
                </>
              )}
            </div>
          </div>

          <hr className="af-divider"/>
          <div className="af-section-title">Products Linked to This Look</div>

          {products.map((p, i) => (
            <div key={i} className="af-sub-card">
              <div className="af-sub-hd">
                <span className="af-badge">Product #{i + 1}</span>
                {products.length > 1 && (
                  <button type="button" className="af-remove-btn" onClick={() => removeProduct(i)}>
                    <Trash2 size={12}/> Remove
                  </button>
                )}
              </div>
              <div className="af-row">
                <div className="af-group">
                  <label className="af-label">Product Name</label>
                  <input className="af-input" type="text"
                    placeholder="e.g., Minimal Ceramic Vase"
                    value={p.name}
                    onChange={e => handleProductChange(i, "name", e.target.value)} required />
                </div>
                <div className="af-group">
                  <label className="af-label">Price (₹)</label>
                  <input className="af-input" type="number"
                    placeholder="1250"
                    value={p.price}
                    onChange={e => handleProductChange(i, "price", e.target.value)} required />
                </div>
              </div>
              <div className="af-group">
                <label className="af-label">Product Image</label>
                <div className={`af-upload${p.preview ? " filled" : ""}`} style={{minHeight:100}}>
                  {p.preview ? (
                    <div className="af-preview-wrap" style={{height:130}}>
                      <img src={p.preview} alt="Product"/>
                      <button type="button" className="af-change-img"
                        onClick={() => { const u=[...products]; u[i].image=null; u[i].preview=null; setProducts(u); }}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="af-upload-inner" style={{padding:14}}>
                        <div className="af-upload-icon" style={{width:34,height:34}}><Upload size={15}/></div>
                        <div className="af-upload-text" style={{fontSize:12}}>Upload item image</div>
                      </div>
                      <input type="file" accept="image/*" required
                        onChange={e => handleProductImage(i, e.target.files[0])} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="af-add-row" onClick={addProduct}>
            <Plus size={14}/> Add Another Product
          </button>

          <button type="submit" className="af-submit" disabled={loading}>
            {loading ? "Publishing…" : <><FileImage size={15}/> Create Decor Detail Look</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDecorDetail;
