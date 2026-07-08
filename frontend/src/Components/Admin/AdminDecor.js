import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, Palette, CheckCircle2, AlertCircle } from "lucide-react";
import "./AdminForms.css";
import { API } from "../../api";

const AdminDecor = () => {
  const navigate = useNavigate();
  const [title, setTitle]     = useState("");
  const [slug, setSlug]       = useState("");
  const [items, setItems]     = useState("");
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const fileRef               = useRef();

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("slug", slug);
      fd.append("items", JSON.stringify(items.split(",")));
      fd.append("image", image);
      const token = localStorage.getItem("token");
      await axios.post(API.decor, fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("success", "Decor collection created.");
      setTitle(""); setSlug(""); setItems(""); setImage(null); setPreview("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      showToast("error", "Failed to save decor collection.");
    } finally { setLoading(false); }
  };

  return (
    <div className="af-page">
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>

      <div className="af-header">
        <div className="af-title">Create Decor Collection</div>
        <div className="af-sub">Add a curated decor styling collection to your store.</div>
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
                placeholder="e.g., Minimalist Ceramic Aesthetics"
                value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="af-group">
              <label className="af-label">Slug</label>
              <input className="af-input" type="text"
                placeholder="e.g., minimalist-ceramic"
                value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
          </div>

          <div className="af-group">
            <label className="af-label">Items (comma-separated)</label>
            <textarea className="af-textarea"
              placeholder="Vase, Ceramic Pot, Golden Frame, Candle"
              value={items} onChange={e => setItems(e.target.value)} required />
          </div>

          <div className="af-group">
            <label className="af-label">Decor Image</label>
            <div className={`af-upload${preview ? " filled" : ""}`}>
              {preview ? (
                <div className="af-preview-wrap">
                  <img src={preview} alt="Decor preview"/>
                  <button type="button" className="af-change-img" onClick={() => {
                    setImage(null); setPreview("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}>Change Image</button>
                </div>
              ) : (
                <>
                  <div className="af-upload-inner">
                    <div className="af-upload-icon"><Upload size={18}/></div>
                    <div className="af-upload-text">Click to upload decor image</div>
                    <div className="af-upload-hint">PNG, JPG, WEBP — max 5 MB</div>
                  </div>
                  <input type="file" ref={fileRef} accept="image/*" required
                    onChange={e => {
                      if (e.target.files[0]) {
                        setImage(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                </>
              )}
            </div>
          </div>

          <button type="submit" className="af-submit" disabled={loading}>
            {loading ? "Saving…" : <><Palette size={15}/> Save Decor Collection</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDecor;
