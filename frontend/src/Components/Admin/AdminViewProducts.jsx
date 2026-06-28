import React, { useState, useEffect, useCallback } from "react"; // 👈 useCallback ചേർത്തു
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, X, ArrowLeft, Search, Package, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import "./AdminForms.css";

const S = {
  page: { fontFamily: "'Inter',sans-serif" },
  topBar: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:14, marginBottom:24 },
  hdrRight: { display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" },
  searchWrap: { position:"relative", display:"flex", alignItems:"center" },
  searchIcon: { position:"absolute", left:11, color:"#6b82a8", pointerEvents:"none", display:"flex" },
  searchInput: { padding:"9px 14px 9px 34px", borderRadius:9, border:"1px solid #1a2540", background:"#0f1628", color:"#dde6f5", fontSize:13, outline:"none", fontFamily:"inherit", width:200, transition:"border-color .15s, box-shadow .15s" },
  tabs: { display:"flex", gap:4, flexWrap:"wrap", marginBottom:20 },
  tab: (on) => ({ padding:"7px 14px", borderRadius:8, border: on ? "1px solid #4f7eff" : "1px solid #1a2540", background: on ? "rgba(79,126,255,.13)" : "#0f1628", color: on ? "#4f7eff" : "#6b82a8", fontSize:12.5, fontWeight:600, cursor:"pointer", letterSpacing:".04em", textTransform:"uppercase", transition:"all .14s" }),
  tableCard: { background:"#0f1628", border:"1px solid #1a2540", borderRadius:14, overflow:"hidden" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:"#6b82a8", borderBottom:"1px solid #1a2540", background:"#0a0f1e" },
  td: { padding:"12px 16px", fontSize:13.5, color:"#dde6f5", borderBottom:"1px solid #1a2540", verticalAlign:"middle" },
  trHover: { background:"#131d33" },
  thumb: { width:46, height:46, borderRadius:8, objectFit:"cover", border:"1px solid #1a2540", display:"block" },
  catBadge: { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, textTransform:"capitalize", letterSpacing:".04em", background:"rgba(79,126,255,.12)", color:"#4f7eff" },
  price: { fontWeight:700, color:"#dde6f5" },
  actionRow: { display:"flex", gap:8 },
  editBtn: { width:32, height:32, borderRadius:8, border:"1px solid #1a2540", background:"#0a0f1e", color:"#4f7eff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .14s" },
  delBtn: { width:32, height:32, borderRadius:8, border:"1px solid #1a2540", background:"#0a0f1e", color:"#f04f72", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .14s" },
  emptyCell: { padding:"48px 16px", textAlign:"center", color:"#6b82a8", fontSize:13 },
  countBadge: { display:"inline-flex", alignItems:"center", padding:"5px 12px", borderRadius:20, background:"rgba(79,126,255,.12)", color:"#4f7eff", fontSize:12, fontWeight:600, marginLeft:10 },
  overlay: { position:"fixed", inset:0, zIndex:1000, background:"rgba(5,9,20,.78)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal: { background:"#0f1628", border:"1px solid #1a2540", borderRadius:16, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.55)" },
  mHead: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px 16px", borderBottom:"1px solid #1a2540" },
  mTitle: { fontSize:16, fontWeight:700, color:"#dde6f5" },
  mClose: { width:32, height:32, borderRadius:8, border:"1px solid #1a2540", background:"#080d18", color:"#6b82a8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  mBody: { padding:"20px 22px" },
  mFoot: { display:"flex", gap:10, padding:"16px 22px", borderTop:"1px solid #1a2540" },
  cancelBtn: { flex:1, padding:"10px 0", borderRadius:9, border:"1px solid #1a2540", background:"#080d18", color:"#6b82a8", fontSize:13, fontWeight:600, cursor:"pointer" },
  saveBtn: { flex:2, padding:"10px 0", borderRadius:9, border:"none", background:"#4f7eff", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 },
  imgThumbRow: { display:"flex", alignItems:"center", gap:12, padding:10, borderRadius:10, border:"1px solid #1a2540", background:"#080d18" },
  modalThumb: { width:60, height:60, borderRadius:8, objectFit:"cover", flexShrink:0 },
  fileLabel: { fontSize:12, color:"#4f7eff", cursor:"pointer", padding:"6px 12px", borderRadius:7, border:"1px dashed #1a2540", background:"rgba(79,126,255,.08)" },
};

const CATEGORIES = ["all","chair","sofa","swing","bed","table","shelves"];
const API = "http://localhost:5001/api/products";

export default function AdminViewProducts() {
  const navigate = useNavigate();
  const [products, setProducts]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [category, setCategory]         = useState("all");
  const [search, setSearch]             = useState("");
  const [hoveredRow, setHoveredRow]     = useState(null);
  const [toast, setToast]               = useState(null);

  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState(null);
  const [editImg, setEditImg]           = useState(null);
  const [editPreview, setEditPreview]   = useState(null);
  const [saving, setSaving]             = useState(false);

  const showToast = useCallback((type, msg) => { setToast({type,msg}); setTimeout(()=>setToast(null), 3500); }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}`);
      const data = await res.json();
      const actualArray = Array.isArray(data) ? data : (data.data || data.products || []);
      setProducts(actualArray);
      setFiltered(actualArray);
    } catch { 
      showToast("error", "Could not fetch data. Please check backend router endpoint."); 
    }
  }, [showToast]);
  
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    let list = [...products];
    if (category !== "all") {
      list = list.filter(p => p.category?.toLowerCase().trim() === category.toLowerCase().trim());
    }
    if (search.trim()) {
      list = list.filter(p => p.name?.toLowerCase().includes(search.toLowerCase().trim()));
    }
    setFiltered(list);
  }, [category, search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method:"DELETE" });
      if (res.ok) { 
        showToast("success", "Product deleted successfully."); 
        fetchProducts(); 
      } else {
        showToast("error", "Delete execution failed.");
      }
    } catch { showToast("error", "Server processing exception."); }
  };

  const openEdit = (p) => {
    setEditing({ ...p });
    setEditPreview(imgUrl(p.img || p.image));
    setEditImg(null);
    setModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    fd.append("name", editing.name);
    fd.append("price", editing.price);
    fd.append("category", editing.category);
    if (editImg) fd.append("img", editImg);
    
    try {
      const res = await fetch(`${API}/edit/${editing._id}`, { method:"PUT", body:fd });
      if (res.ok) {
        showToast("success", "Product configurations updated.");
        setModalOpen(false); 
        fetchProducts();
      } else {
        showToast("error", "Update failed.");
      }
    } catch { showToast("error", "Server layout processing error."); }
    finally { setSaving(false); }
  };

  const imgUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50?text=No+Img";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    if (cleanPath.startsWith("uploads/")) {
      return `http://localhost:5001/${cleanPath}`;
    }
    return `http://localhost:5001/uploads/${cleanPath}`;
  };

  return (
    <div style={S.page}>
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>

      <div style={S.topBar}>
        <div>
          <div className="af-title" style={{marginBottom:3}}>
            Product Inventory
            <span style={S.countBadge}>{filtered.length} items</span>
          </div>
          <div className="af-sub">Manage, edit and remove structural products from your catalog.</div>
        </div>
        <div style={S.hdrRight}>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}><Search size={14}/></span>
            <input
              style={S.searchInput}
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type==="error"?" error":""}`} style={{marginBottom:18}}>
          {toast.type==="success" ? <CheckCircle2 size={15}/> : <AlertCircle size={15}/>}
          {toast.msg}
        </div>
      )}

      <div style={S.tabs}>
        {CATEGORIES.map(c => (
          <button key={c} style={S.tab(category===c)} onClick={() => setCategory(c)}>
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Image Set</th>
              <th style={S.th}>Product Name</th>
              <th style={S.th}>Category</th>
              <th style={S.th}>Price</th>
              <th style={{...S.th, textAlign:"right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={S.emptyCell}>
                <Package size={28} style={{margin:"0 auto 8px",opacity:.25,display:"block"}}/>
                No products found matching this catalog layer.
              </td></tr>
            ) : filtered.map(p => (
              <tr key={p._id}
                style={hoveredRow === p._id ? {...S.trHover} : {}}
                onMouseEnter={() => setHoveredRow(p._id)}
                onMouseLeave={() => setHoveredRow(null)}>
                <td style={S.td}>
                  <img src={imgUrl(p.img || p.image)} alt={p.name} style={S.thumb}
                    onError={e => { e.target.src="https://via.placeholder.com/50?text=Img"; }}/>
                </td>
                <td style={{...S.td, fontWeight:600}}>{p.name}</td>
                <td style={S.td}><span style={S.catBadge}>{p.category}</span></td>
                <td style={{...S.td, ...S.price}}>₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td style={{...S.td, textAlign:"right"}}>
                  <div style={{...S.actionRow, justifyContent:"flex-end"}}>
                    <button style={S.editBtn} title="Edit" onClick={() => openEdit(p)}>
                      <Edit2 size={14}/>
                    </button>
                    <button style={S.delBtn} title="Delete" onClick={() => handleDelete(p._id)}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && editing && (
        <div style={S.overlay} onClick={() => setModalOpen(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.mHead}>
              <span style={S.mTitle}>Edit Product Assets</span>
              <button style={S.mClose} onClick={() => setModalOpen(false)}><X size={15}/></button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={S.mBody}>
                <div className="af-group">
                  <label className="af-label">Product Name</label>
                  <input className="af-input" type="text" value={editing.name}
                    onChange={e => setEditing({...editing, name:e.target.value})} required/>
                </div>

                <div className="af-row">
                  <div className="af-group">
                    <label className="af-label">Price (₹)</label>
                    <input className="af-input" type="number" value={editing.price}
                      onChange={e => setEditing({...editing, price:e.target.value})} required/>
                  </div>
                  <div className="af-group">
                    <label className="af-label">Category</label>
                    <select className="af-select" value={editing.category}
                      onChange={e => setEditing({...editing, category:e.target.value})}>
                      <option value="chair">Chair</option>
                      <option value="sofa">Sofa</option>
                      <option value="swing">Swing</option>
                      <option value="bed">Bed</option>
                      <option value="table">Dining</option>
                      <option value="shelves">Shelves</option>
                    </select>
                  </div>
                </div>

                <div className="af-group" style={{marginBottom:0}}>
                  <label className="af-label">Product Image</label>
                  <div style={S.imgThumbRow}>
                    <img src={editPreview} alt="preview" style={S.modalThumb}
                      onError={e => { e.target.src="https://via.placeholder.com/60?text=Img"; }}/>
                    <label style={S.fileLabel}>
                      <Upload size={12} style={{marginRight:5, verticalAlign:"middle"}}/>
                      Change Asset
                      <input type="file" accept="image/*" style={{display:"none"} }
                        onChange={e => { const f=e.target.files[0]; if(f){ setEditImg(f); setEditPreview(URL.createObjectURL(f)); }}}/>
                    </label>
                  </div>
                </div>
              </div>

              <div style={S.mFoot}>
                <button type="button" style={S.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" style={S.saveBtn} disabled={saving}>
                  {saving ? "Saving…" : <><CheckCircle2 size={14}/> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
