import React, { useState, useEffect, useCallback } from "react"; // 👈 useCallback ചേർത്തു
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, X, ArrowLeft, Plus, Upload, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import "./AdminForms.css"; 
import { API } from "../../api";

const API_BASE_URL = API.decorDetails;
const BACKEND_URL = process.env.REACT_APP_API_URL;

const formatImageUrl = (pathString) => {
  if (!pathString)
    return "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500";

  if (pathString.startsWith("http"))
    return pathString;

  return `${BACKEND_URL}${pathString.startsWith("/") ? "" : "/"}${pathString}`;
};

const T = {
  profileWrapper: { background: "#0f1628", border: "1px solid #1a2540", borderRadius: 14, overflow: "hidden", marginBottom: 24, padding: 20 },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a2540", paddingBottom: 16, marginBottom: 16, flexWrap: "wrap", gap: 16 },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  mainLayoutImg: { width: 70, height: 70, borderRadius: 10, objectFit: "cover", flexShrink: 0 },
  profileTitle: { fontSize: 16, fontWeight: 700, color: "#dde6f5", marginBottom: 4 },
  slugBadge: { display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(79,126,255,.12)", color: "#4f7eff", border: "1px solid rgba(79,126,255,.2)" },
  actRow: { display: "flex", gap: 8 },
  subGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 },
  miniBox: { display: "flex", alignItems: "center", gap: 12, background: "#080d18", border: "1px solid #1a2540", borderRadius: 10, padding: 10 },
  miniBoxImg: { width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  miniBoxName: { fontSize: 13, fontWeight: 600, color: "#dde6f5", marginBottom: 2 },
  miniBoxPrice: { fontSize: 12, color: "#6b82a8" },
  overlay: { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,9,20,.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#0f1628", border: "1px solid #1a2540", borderRadius: 16, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.6)" },
  mHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 16px", borderBottom: "1px solid #1a2540", position: "sticky", top: 0, background: "#0f1628", zIndex: 1 },
  mTitle: { fontSize: 15, fontWeight: 700, color: "#dde6f5" },
  mClose: { width: 32, height: 32, borderRadius: 8, border: "1px solid #1a2540", background: "#080d18", color: "#6b82a8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  mBody: { padding: "20px 22px" },
  mFoot: { display: "flex", gap: 10, padding: "14px 22px", borderTop: "1px solid #1a2540", position: "sticky", bottom: 0, background: "#0f1628" },
  cancelBtn: { flex: 1, padding: "10px 0", borderRadius: 9, border: "1px solid #1a2540", background: "#080d18", color: "#6b82a8", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  saveBtn: { flex: 2, padding: "10px 0", borderRadius: 9, border: "none", background: "#4f7eff", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  subCard: { background: "#080d18", border: "1px solid #1a2540", borderRadius: 10, padding: 14, marginBottom: 12 },
  subHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  imgThumbRow: { display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 9, border: "1px solid #1a2540", background: "#080d18" },
  miniThumb: { width: 64, height: 64, borderRadius: 7, objectFit: "cover", flexShrink: 0 },
  fileLabel: { fontSize: 11.5, color: "#4f7eff", cursor: "pointer", padding: "5px 10px", borderRadius: 6, border: "1px dashed #1a2540", background: "rgba(79,126,255,.08)" },
  empty: { padding: "36px 0", textAlign: "center", color: "#6b82a8", fontSize: 13 },
  countBadge: { display: "inline-flex", alignItems: "center", padding: "4px 11px", borderRadius: 20, background: "rgba(79,126,255,.12)", color: "#4f7eff", fontSize: 12, fontWeight: 600, marginLeft: 10 },
  viewBtn: { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: "1px solid #1a2540", background: "#0a0f1e", color: "#4f7eff", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background .14s" },
  iconBtn: (color) => ({ width: 32, height: 32, borderRadius: 8, border: "1px solid #1a2540", background: "#0a0f1e", color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .14s" }),
};

export default function AdminViewDecorDetails() {
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [toast, setToast] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [productImageFiles, setProductImageFiles] = useState({}); 
  const [productPreviews, setProductPreviews] = useState({});     

  const showToast = useCallback((type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); }, []);

  // 🌟 useCallback ഉപയോഗിച്ച് ഫങ്ഷൻ മാറ്റിയെഴുതി
  const fetchDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) return;
      const data = await response.json();
      setDetails(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast("error", "Failed to catch structural layout metadata details.");
    }
  }, [showToast]);

  // 🌟 dependency array-ൽ fetchDetails നൽകി
  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleDeleteDetail = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Entire Decor Profile page?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        showToast("success", "Decor page profile architecture deleted.");
        fetchDetails();
      } else {
        showToast("error", "Delete execution refused.");
      }
    } catch {
      showToast("error", "Server response processing error.");
    }
  };

  const openEditModal = (item) => {
    setEditingDetail(JSON.parse(JSON.stringify(item))); 
    setMainImagePreview(formatImageUrl(item.mainImage));
    setMainImageFile(null);
    setProductImageFiles({});
    
    const initialPreviews = {};
    item.products?.forEach((prod, index) => {
      initialPreviews[index] = formatImageUrl(prod.image);
    });
    setProductPreviews(initialPreviews);
    setIsEditModalOpen(true);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...editingDetail.products];
    updatedProducts[index][field] = value;
    setEditingDetail({ ...editingDetail, products: updatedProducts });
  };

  const handleAddProductField = () => {
    setEditingDetail({
      ...editingDetail,
      products: [...editingDetail.products, { name: "", price: 0, image: "" }]
    });
  };

  const handleRemoveProductField = (index) => {
    const updatedProducts = editingDetail.products.filter((_, i) => i !== index);
    setEditingDetail({ ...editingDetail, products: updatedProducts });
    
    const newFiles = { ...productImageFiles };
    delete newFiles[index];
    setProductImageFiles(newFiles);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", editingDetail.title);
    formData.append("decorSlug", editingDetail.decorSlug);

    if (mainImageFile) formData.append("mainImage", mainImageFile);

    const productsPayload = editingDetail.products.map((prod) => ({
      name: prod.name,
      price: Number(prod.price) || 0,
      image: prod.image 
    }));
    formData.append("products", JSON.stringify(productsPayload));

    Object.keys(productImageFiles).forEach((index) => {
      formData.append(`productImage_${index}`, productImageFiles[index]);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/${editingDetail._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        showToast("success", "Decor section profile updated seamlessly.");
        setIsEditModalOpen(false);
        fetchDetails();
      } else {
        showToast("error", "Failed to preserve updated structural changes.");
      }
    } catch {
      showToast("error", "Server mapping sync connection exception.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Back</button>

      <div style={{ marginBottom: 24 }}>
        <div className="af-title" style={{ marginBottom: 3 }}>
          Decor Details Management
          <span style={T.countBadge}>{details.length} profiles</span>
        </div>
        <div className="af-sub">Review premium structural specs page layouts, individual product listings, and image matrices.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type === "error" ? " error" : ""}`} style={{ marginBottom: 18 }}>
          {toast.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {details.length === 0 ? (
        <div style={T.empty}>
          <ShoppingBag size={28} style={{ margin: "0 auto 8px", opacity: .2, display: "block" }} />
          No detail specification sets found inside workspace payload.
        </div>
      ) : (
        details.map((mainItem) => (
          <div key={mainItem._id} style={T.profileWrapper}>
            <div style={T.headerRow}>
              <div style={T.headerLeft}>
                <img src={formatImageUrl(mainItem.mainImage)} alt={mainItem.title} style={T.mainLayoutImg}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500"; }} />
                <div>
                  <div style={T.profileTitle}>{mainItem.title}</div>
                  <span style={T.slugBadge}>slug: {mainItem.decorSlug}</span>
                </div>
              </div>
              
              <div style={T.actRow}>
                <button style={T.viewBtn} onClick={() => openEditModal(mainItem)}>
                  <Edit2 size={13} /> Edit Profile
                </button>
                <button style={T.iconBtn("#f04f72")} title="Delete Entire Profile" onClick={() => handleDeleteDetail(mainItem._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div style={T.subGrid}>
              {!mainItem.products || mainItem.products.length === 0 ? (
                <div style={{ ...T.empty, gridColumn: "1/-1", padding: "14px 0" }}>No linked layout items bounded.</div>
              ) : (
                mainItem.products.map((subProduct, idx) => (
                  <div key={subProduct._id || idx} style={T.miniBox}>
                    <img src={formatImageUrl(subProduct.image)} alt={subProduct.name} style={T.miniBoxImg}
                      onError={e => { e.target.src = "https://via.placeholder.com/48?text=?"; }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={T.miniBoxName} className="af-text-ellipsis">{subProduct.name || "Unnamed Item"}</div>
                      <div style={T.miniBoxPrice}>₹{subProduct.price}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}

      {isEditModalOpen && editingDetail && (
        <div style={T.overlay} onClick={() => setIsEditModalOpen(false)}>
          <div style={T.modal} onClick={e => e.stopPropagation()}>
            <div style={T.mHead}>
              <span style={T.mTitle}>Modify Decor Section Profile</span>
              <button style={T.mClose} onClick={() => setIsEditModalOpen(false)}><X size={15} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={T.mBody}>
                <div className="af-row">
                  <div className="af-group">
                    <label className="af-label">Layout Page Title</label>
                    <input className="af-input" value={editingDetail.title} onChange={e => setEditingDetail({ ...editingDetail, title: e.target.value })} required />
                  </div>
                  <div className="af-group">
                    <label className="af-label">Unique Slug Identifier</label>
                    <input className="af-input" value={editingDetail.decorSlug} onChange={e => setEditingDetail({ ...editingDetail, decorSlug: e.target.value })} required />
                  </div>
                </div>

                <div className="af-group">
                  <label className="af-label">Main Cover Layout Image</label>
                  <div style={T.imgThumbRow}>
                    <img src={mainImagePreview} alt="Main Layout" style={T.miniThumb} onError={e => { e.target.src = "https://via.placeholder.com/64?text=Img"; }} />
                    <label style={T.fileLabel}>
                      <Upload size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                      Replace Cover
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) { setMainImageFile(file); setMainImagePreview(URL.createObjectURL(file)); }
                        }} />
                    </label>
                  </div>
                </div>

                <hr className="af-divider" />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div className="af-section-title" style={{ margin: 0 }}>Sub-elements Matrix ({editingDetail.products?.length || 0})</div>
                  <button type="button" className="af-add-row" style={{ margin: 0, padding: "6px 12px" }} onClick={handleAddProductField}>
                    <Plus size={12} /> Add Element
                  </button>
                </div>

                <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: 4 }}>
                  {editingDetail.products?.map((product, index) => (
                    <div key={index} style={T.subCard}>
                      <div style={T.subHd}>
                        <span className="af-badge">Product Item #{index + 1}</span>
                        <button type="button" className="af-remove-btn" onClick={() => handleRemoveProductField(index)}>
                          <X size={12} /> Remove
                        </button>
                      </div>

                      <div className="af-row">
                        <div className="af-group">
                          <label className="af-label">Item Name</label>
                          <input className="af-input" value={product.name} onChange={e => handleProductChange(index, "name", e.target.value)} required />
                        </div>
                        <div className="af-group">
                          <label className="af-label">Price (₹)</label>
                          <input className="af-input" type="number" value={product.price || ""} onChange={e => handleProductChange(index, "price", e.target.value)} required />
                        </div>
                      </div>

                      <div className="af-group" style={{ marginBottom: 0 }}>
                        <label className="af-label">Item Graphic Asset</label>
                        <div style={T.imgThumbRow}>
                          <img src={productPreviews[index] || "https://via.placeholder.com/48?text=?"} alt="Product view" style={{ ...T.miniThumb, width: 48, height: 48 }} onError={e => { e.target.src = "https://via.placeholder.com/48?text=?"; }} />
                          <label style={T.fileLabel}>
                            <Upload size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                            Change Image
                            <input type="file" accept="image/*" style={{ display: "none" }}
                              onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                  setProductImageFiles({ ...productImageFiles, [index]: file });
                                  setProductPreviews({ ...productPreviews, [index]: URL.createObjectURL(file) });
                                }
                              }} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={T.mFoot}>
                <button type="button" style={T.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" style={T.saveBtn} disabled={saving}>
                  {saving ? "Saving Changes…" : <><CheckCircle2 size={14} /> Update Detail Stack</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
