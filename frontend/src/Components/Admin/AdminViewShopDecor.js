import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, X, Eye, ArrowLeft, Plus, Upload, CheckCircle2, AlertCircle, ShoppingBag, Layers } from "lucide-react";
import "./AdminForms.css"; 

const API_BASE_URL = "http://localhost:5001/api/decor"; 

const formatImageUrl = (pathString) => {
  if (!pathString) return "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=500";
  if (pathString.startsWith("http")) return pathString;
  const cleanPath = pathString.startsWith("/") ? pathString.substring(1) : pathString;
  return `http://localhost:5001/${cleanPath}`;
};

/* ── shared premium style tokens ── */
const T = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 },
  card: {
    background: "#0f1628", border: "1px solid #1a2540",
    borderRadius: 14, overflow: "hidden",
    transition: "border-color .15s, transform .15s", cursor: "pointer",
  },
  cardImg: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  featuredBadge: {
    position: "absolute", top: 10, left: 10,
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    background: "#fb7185", color: "#fff", letterSpacing: ".04em"
  },
  standardBadge: {
    position: "absolute", top: 10, left: 10,
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    background: "#6b82a8", color: "#fff", letterSpacing: ".04em"
  },
  cardBody: { padding: "14px 16px 16px" },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#dde6f5", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#6b82a8", marginBottom: 12 },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  viewBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 12px", borderRadius: 8,
    border: "1px solid #1a2540", background: "#0a0f1e",
    color: "#6b82a8", fontSize: 12, fontWeight: 500, cursor: "pointer",
    transition: "background .14s, color .14s",
  },
  iconBtn: (color) => ({
    width: 32, height: 32, borderRadius: 8,
    border: "1px solid #1a2540", background: "#0a0f1e",
    color, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background .14s",
  }),
  actRow: { display: "flex", gap: 8 },

  /* overlay */
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(5,9,20,.8)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  },
  modal: {
    background: "#0f1628", border: "1px solid #1a2540",
    borderRadius: 16, width: "100%", maxWidth: 520,
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,.6)",
  },
  mHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 16px", borderBottom: "1px solid #1a2540",
    position: "sticky", top: 0, background: "#0f1628", zIndex: 1,
  },
  mTitle: { fontSize: 15, fontWeight: 700, color: "#dde6f5" },
  mClose: {
    width: 32, height: 32, borderRadius: 8,
    border: "1px solid #1a2540", background: "#080d18",
    color: "#6b82a8", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  mBody: { padding: "20px 22px" },
  mFoot: {
    display: "flex", gap: 10, padding: "14px 22px",
    borderTop: "1px solid #1a2540",
    position: "sticky", bottom: 0, background: "#0f1628",
  },
  cancelBtn: {
    flex: 1, padding: "10px 0", borderRadius: 9,
    border: "1px solid #1a2540", background: "#080d18",
    color: "#6b82a8", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  saveBtn: {
    flex: 2, padding: "10px 0", borderRadius: 9,
    border: "none", background: "#4f7eff",
    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  },

  /* list items view mapping */
  tagRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 14px", borderBottom: "1px solid #1a2540",
    color: "#dde6f5", fontSize: 13.5, fontWeight: 500
  },

  /* sub-item card wrapper inside edit modal */
  subCard: {
    background: "#080d18", border: "1px solid #1a2540",
    borderRadius: 10, padding: 14, marginBottom: 12,
  },
  subHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },

  imgThumbRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: 8, borderRadius: 9,
    border: "1px solid #1a2540", background: "#080d18",
  },
  miniThumb: { width: 64, height: 64, borderRadius: 7, objectFit: "cover", flexShrink: 0 },
  fileLabel: {
    fontSize: 11.5, color: "#4f7eff", cursor: "pointer",
    padding: "5px 10px", borderRadius: 6,
    border: "1px dashed #1a2540", background: "rgba(79,126,255,.08)",
  },

  empty: { padding: "48px 0", textAlign: "center", color: "#2c3d5c", fontSize: 13 },
  countBadge: {
    display: "inline-flex", alignItems: "center",
    padding: "4px 11px", borderRadius: 20,
    background: "rgba(79,126,255,.12)", color: "#4f7eff",
    fontSize: 12, fontWeight: 600, marginLeft: 10,
  },
  tabs: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20 },
  tab: (on) => ({
    padding: "7px 14px", borderRadius: 8,
    border: on ? "1px solid #4f7eff" : "1px solid #1a2540",
    background: on ? "rgba(79,126,255,.13)" : "#0f1628",
    color: on ? "#4f7eff" : "#6b82a8",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
    letterSpacing: ".04em", textTransform: "uppercase",
    transition: "all .14s",
  }),
};

export default function AdminViewShopDecor() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedItemsList, setSelectedItemsList] = useState(null);
  const [toast, setToast] = useState(null);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) return;
      const data = await response.json();
      const actualData = Array.isArray(data) ? data : (data.data || []);
      setCategories(actualData);
      setFilteredCategories(actualData);
    } catch (error) {
      showToast("error", "Could not reach server components.");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(cat => cat.featured === true));
    }
  }, [selectedFilter, categories]);

  const handleDeleteCategory = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this decor category?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        showToast("success", "Decor Category deleted.");
        fetchCategories();
      } else {
        showToast("error", "Delete permission failed.");
      }
    } catch {
      showToast("error", "Server response exception error.");
    }
  };

  const openEditModal = (e, cat) => {
    e.stopPropagation();
    setEditingCategory({
      ...cat,
      items: Array.isArray(cat.items) ? [...cat.items] : []
    });
    setEditPreview(formatImageUrl(cat.image));
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleSubItemTextChange = (index, value) => {
    const updatedItems = [...editingCategory.items];
    updatedItems[index] = value;
    setEditingCategory({ ...editingCategory, items: updatedItems });
  };

  const handleAddSubItemRow = () => {
    setEditingCategory({
      ...editingCategory,
      items: [...editingCategory.items, ""]
    });
  };

  const handleRemoveSubItemRow = (index) => {
    setEditingCategory({
      ...editingCategory,
      items: editingCategory.items.filter((_, i) => i !== index)
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", editingCategory.title);
    formData.append("slug", editingCategory.slug);
    formData.append("featured", editingCategory.featured);
    formData.append("items", JSON.stringify(editingCategory.items));

    if (editImageFile) formData.append("image", editImageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/${editingCategory._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        showToast("success", "Decor inventory schema saved.");
        setIsEditModalOpen(false);
        fetchCategories();
      } else {
        showToast("error", "Failed to compile updates architecture.");
      }
    } catch {
      showToast("error", "Server payload post mapping error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Back</button>

      <div style={{ marginBottom: 24 }}>
        <div className="af-title" style={{ marginBottom: 3 }}>
          Shop The Decor Inventory
          <span style={T.countBadge}>{filteredCategories.length} categories</span>
        </div>
        <div className="af-sub">Manage secondary store categories and target sub-elements array mapping.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type === "error" ? " error" : ""}`} style={{ marginBottom: 18 }}>
          {toast.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={T.tabs}>
        <button style={T.tab(selectedFilter === "all")} onClick={() => setSelectedFilter("all")}>
          All Categories
        </button>
        <button style={T.tab(selectedFilter === "featured")} onClick={() => setSelectedFilter("featured")}>
          Featured Hotspot
        </button>
      </div>

      {/* Grid Layout */}
      {filteredCategories.length === 0 ? (
        <div style={T.empty}>
          <ShoppingBag size={28} style={{ margin: "0 auto 8px", opacity: .2, display: "block" }} />
          No categories found matching this workspace stack.
        </div>
      ) : (
        <div style={T.grid}>
          {filteredCategories.map((cat) => (
            <div key={cat._id} style={T.card}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#243456"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2540"; e.currentTarget.style.transform = "none"; }}
              onClick={() => setSelectedItemsList(cat.items || [])}>
              <div style={{ position: "relative" }}>
                <img src={formatImageUrl(cat.image)} alt={cat.title} style={T.cardImg}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=500"; }} />
                {cat.featured ? (
                  <span style={T.featuredBadge}>Featured</span>
                ) : (
                  <span style={T.standardBadge}>Standard</span>
                )}
              </div>
              <div style={T.cardBody}>
                <div style={T.cardTitle}>{cat.title}</div>
                <div style={T.cardSub}>Slug: {cat.slug} • {cat.items?.length || 0} items linked</div>
                <div style={T.cardFoot}>
                  <button style={T.viewBtn}
                    onClick={e => { e.stopPropagation(); setSelectedItemsList(cat.items || []); }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1a2540"; e.currentTarget.style.color = "#dde6f5"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#0a0f1e"; e.currentTarget.style.color = "#6b82a8"; }}>
                    <Eye size={13} /> View Items
                  </button>
                  <div style={T.actRow}>
                    <button style={T.iconBtn("#4f7eff")} title="Edit"
                      onClick={e => openEditModal(e, cat)}
                      onMouseEnter={e => e.currentTarget.style.background = "#1a2540"}
                      onMouseLeave={e => e.currentTarget.style.background = "#0a0f1e"}>
                      <Edit2 size={13} />
                    </button>
                    <button style={T.iconBtn("#f04f72")} title="Delete"
                      onClick={e => handleDeleteCategory(e, cat._id)}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(240,79,114,.12)"}
                      onMouseLeave={e => e.currentTarget.style.background = "#0a0f1e"}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ITEMS VIEWER POPUP MODAL ── */}
      {selectedItemsList && (
        <div style={T.overlay} onClick={() => setSelectedItemsList(null)}>
          <div style={{ ...T.modal, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={T.mHead}>
              <span style={T.mTitle}>Linked Sub-Elements</span>
              <button style={T.mClose} onClick={() => setSelectedItemsList(null)}><X size={15} /></button>
            </div>
            <div style={T.mBody}>
              {selectedItemsList.length === 0 ? (
                <div style={T.empty}>No elements bound to payload.</div>
              ) : (
                selectedItemsList.map((item, idx) => (
                  <div key={idx} style={{ ...T.tagRow, ...(idx === selectedItemsList.length - 1 ? { borderBottom: "none" } : {}) }}>
                    <Layers size={13} style={{ color: "#4f7eff", flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL WITH ASSET MAPPING CONTROL ── */}
      {isEditModalOpen && editingCategory && (
        <div style={T.overlay} onClick={() => setIsEditModalOpen(false)}>
          <div style={T.modal} onClick={e => e.stopPropagation()}>
            <div style={T.mHead}>
              <span style={T.mTitle}>Modify Decor Category Stack</span>
              <button style={T.mClose} onClick={() => setIsEditModalOpen(false)}><X size={15} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={T.mBody}>
                <div className="af-row">
                  <div className="af-group">
                    <label className="af-label">Category Title</label>
                    <input className="af-input" value={editingCategory.title}
                      onChange={e => setEditingCategory({ ...editingCategory, title: e.target.value })} required />
                  </div>
                  <div className="af-group">
                    <label className="af-label">Slug String</label>
                    <input className="af-input" value={editingCategory.slug}
                      onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })} required />
                  </div>
                </div>

                <div className="af-group checkbox-row" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <input type="checkbox" id="featured_check" checked={editingCategory.featured}
                    onChange={e => setEditingCategory({ ...editingCategory, featured: e.target.checked })} />
                  <label htmlFor="featured_check" className="af-label" style={{ margin: 0, cursor: "pointer" }}>Mark as Featured Hotspot Category</label>
                </div>

                <div className="af-group">
                  <label className="af-label">Update Banner Thumbnail</label>
                  <div style={T.imgThumbRow}>
                    <img src={editPreview} alt="Preview Stack" style={T.miniThumb}
                      onError={e => { e.target.src = "https://via.placeholder.com/64?text=Img"; }} />
                    <label style={T.fileLabel}>
                      <Upload size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                      Change File
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) { setEditImageFile(file); setEditPreview(URL.createObjectURL(file)); }
                        }} />
                    </label>
                  </div>
                </div>

                <hr className="af-divider" />
                <div className="af-section-title">Dynamic Items Array String Stack</div>

                {editingCategory.items.map((item, index) => (
                  <div key={index} style={T.subCard}>
                    <div style={T.subHd}>
                      <span className="af-badge">Tag Element #{index + 1}</span>
                      <button type="button" className="af-remove-btn" onClick={() => handleRemoveSubItemRow(index)}>
                        <X size={12} /> Remove
                      </button>
                    </div>
                    <div className="af-group" style={{ marginBottom: 0 }}>
                      <input className="af-input" value={item} placeholder="e.g., Ceramic Vases"
                        onChange={e => handleSubItemTextChange(index, e.target.value)} required />
                    </div>
                  </div>
                ))}

                <button type="button" className="af-add-row" onClick={handleAddSubItemRow}>
                  <Plus size={13} /> Add New Sub-Element Tag
                </button>
              </div>

              <div style={T.mFoot}>
                <button type="button" style={T.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" style={T.saveBtn} disabled={saving}>
                  {saving ? "Saving Changes…" : <><CheckCircle2 size={14} /> Save Content Profile</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
