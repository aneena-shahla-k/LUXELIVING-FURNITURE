import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, Plus, Trash2, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import "./AdminForms.css";
import { API } from "../../api";

export default function AdminShopTheLook() {
  const navigate = useNavigate();
  const [roomType, setRoomType]   = useState("bedroom");
  const [title, setTitle]         = useState("");
  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [products, setProducts]   = useState([{ title: "", price: "", file: null, preview: null }]);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  const handleMainImg = (e) => {
    const f = e.target.files[0];
    if (f) { setMainImgFile(f); setMainPreview(URL.createObjectURL(f)); }
  };

  const handleProductChange = (i, e) => {
    const u = [...products];
    if (e.target.name === "file") {
      const f = e.target.files[0];
      if (f) { u[i].file = f; u[i].preview = URL.createObjectURL(f); }
    } else { u[i][e.target.name] = e.target.value; }
    setProducts(u);
  };

  const addRow    = () => setProducts([...products, { title: "", price: "", file: null, preview: null }]);
  const removeRow = (i) => { if (products[i].preview) URL.revokeObjectURL(products[i].preview); setProducts(products.filter((_,j) => j !== i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { showToast("error", "Admin authorization missing."); return; }
    if (!mainImgFile) { showToast("error", "Please upload the main room image."); return; }
    setLoading(true);
    const fd = new FormData();
    fd.append("roomType", roomType);
    fd.append("title", title);
    fd.append("mainImg", mainImgFile);
    fd.append("products", JSON.stringify(products.map(p => ({ title: p.title, price: Number(p.price) || 0 }))));
    products.forEach((p, i) => fd.append(`productImages_${i}`, p.file || new Blob(), "empty.jpg"));
    try {
      const res = await axios.post(`${API.shopLook}/add`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      showToast("success", res.data.message || "Space configuration saved.");
      setTitle(""); setMainImgFile(null); setMainPreview(null);
      setProducts([{ title: "", price: "", file: null, preview: null }]);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Upload failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="af-page">
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>

      <div className="af-header">
        <div className="af-title">Shop The Look</div>
        <div className="af-sub">Create an interactive room space with linked product items.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type === "error" ? " error" : ""}`}>
          {toast.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="af-card">
        <form onSubmit={handleSubmit}>

          <div className="af-group">
            <label className="af-label">Curated Zone</label>
            <select className="af-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
              <option value="bedroom">Bedroom</option>
              <option value="living">Living Room</option>
              <option value="dining">Dining</option>
              <option value="kitchen">Kitchen</option>
              <option value="office">Office Room</option>
              <option value="balcony">Balcony</option>
            </select>
          </div>

          <div className="af-group">
            <label className="af-label">Collection Banner Title</label>
            <input className="af-input" type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Luxury Nordic Bedroom Look" required />
          </div>

          <div className="af-group">
            <label className="af-label">Main Room Concept Image</label>
            <div className={`af-upload${mainPreview ? " filled" : ""}`}>
              {mainPreview ? (
                <div className="af-preview-wrap">
                  <img src={mainPreview} alt="Room concept"/>
                  <button type="button" className="af-change-img"
                    onClick={() => { setMainImgFile(null); setMainPreview(null); }}>Change Image</button>
                </div>
              ) : (
                <>
                  <div className="af-upload-inner">
                    <div className="af-upload-icon"><Upload size={18}/></div>
                    <div className="af-upload-text">Click to upload main layout image</div>
                    <div className="af-upload-hint">PNG, JPG, WEBP — max 5 MB</div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleMainImg} required />
                </>
              )}
            </div>
          </div>

          <hr className="af-divider"/>
          <div className="af-section-title">Products in This Look</div>

          {products.map((p, i) => (
            <div key={i} className="af-sub-card">
              <div className="af-sub-hd">
                <span className="af-badge">Item #{i + 1}</span>
                {products.length > 1 && (
                  <button type="button" className="af-remove-btn" onClick={() => removeRow(i)}>
                    <Trash2 size={12}/> Remove
                  </button>
                )}
              </div>
              <div className="af-row">
                <div className="af-group">
                  <label className="af-label">Product Name</label>
                  <input className="af-input" type="text" name="title"
                    value={p.title} onChange={e => handleProductChange(i, e)}
                    placeholder="e.g., Walnut Sideboard" required />
                </div>
                <div className="af-group">
                  <label className="af-label">Price (₹)</label>
                  <input className="af-input" type="number" name="price"
                    value={p.price} onChange={e => handleProductChange(i, e)}
                    placeholder="4500" required />
                </div>
              </div>
              <div className="af-group">
                <label className="af-label">Item Image</label>
                <div className={`af-upload${p.preview ? " filled" : ""}`} style={{minHeight:100}}>
                  {p.preview ? (
                    <div className="af-preview-wrap" style={{height:130}}>
                      <img src={p.preview} alt="Item"/>
                      <button type="button" className="af-change-img"
                        onClick={() => { const u=[...products]; u[i].file=null; u[i].preview=null; setProducts(u); }}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="af-upload-inner" style={{padding:14}}>
                        <div className="af-upload-icon" style={{width:34,height:34}}><Upload size={15}/></div>
                        <div className="af-upload-text" style={{fontSize:12}}>Upload item image</div>
                      </div>
                      <input type="file" name="file" accept="image/*"
                        onChange={e => handleProductChange(i, e)} required />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="af-add-row" onClick={addRow}>
            <Plus size={14}/> Add Another Item
          </button>

          <button type="submit" className="af-submit" disabled={loading}>
            {loading ? "Uploading…" : <><ShoppingBag size={15}/> Publish Space Configuration</>}
          </button>
        </form>
      </div>
    </div>
  );
}
