import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, X, Eye, ArrowLeft, Plus, Upload, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import "./AdminForms.css";

const API = "http://localhost:5001/api/shop-look";

const fmtImg = (p) => {
  if (!p) return "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400";
  if (p.startsWith("http")) return p;
  return `http://localhost:5001/${p.startsWith("/") ? p.slice(1) : p}`;
};

const ROOM_COLORS = {
  bedroom:"#a78bfa", living:"#4f7eff", dining:"#f5a623",
  kitchen:"#20c97a", office:"#38bdf8", balcony:"#fb7185", default:"#6b82a8",
};

/* ── shared style tokens ── */
const T = {
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 },
  card: {
    background:"#0f1628", border:"1px solid #1a2540",
    borderRadius:14, overflow:"hidden",
    transition:"border-color .15s, transform .15s", cursor:"pointer",
  },
  cardImg: { width:"100%", height:180, objectFit:"cover", display:"block" },
  roomBadge: (room) => ({
    position:"absolute", top:10, left:10,
    padding:"3px 10px", borderRadius:20,
    fontSize:11, fontWeight:700, textTransform:"capitalize",
    background: ROOM_COLORS[room?.toLowerCase()] || ROOM_COLORS.default,
    color:"#fff",
  }),
  cardBody: { padding:"14px 16px 16px" },
  cardTitle: { fontSize:14, fontWeight:700, color:"#dde6f5", marginBottom:4 },
  cardSub: { fontSize:12, color:"#6b82a8", marginBottom:12 },
  cardFoot: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  viewBtn: {
    display:"flex", alignItems:"center", gap:6,
    padding:"7px 12px", borderRadius:8,
    border:"1px solid #1a2540", background:"#0a0f1e",
    color:"#6b82a8", fontSize:12, fontWeight:500, cursor:"pointer",
    transition:"background .14s, color .14s",
  },
  iconBtn: (color) => ({
    width:32, height:32, borderRadius:8,
    border:"1px solid #1a2540", background:"#0a0f1e",
    color, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"background .14s",
  }),
  actRow: { display:"flex", gap:8 },

  /* overlay */
  overlay: {
    position:"fixed", inset:0, zIndex:1000,
    background:"rgba(5,9,20,.8)", backdropFilter:"blur(6px)",
    display:"flex", alignItems:"center", justifyContent:"center", padding:16,
  },
  modal: {
    background:"#0f1628", border:"1px solid #1a2540",
    borderRadius:16, width:"100%", maxWidth:520,
    maxHeight:"90vh", overflowY:"auto",
    boxShadow:"0 24px 60px rgba(0,0,0,.6)",
  },
  mHead: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"18px 22px 16px", borderBottom:"1px solid #1a2540",
    position:"sticky", top:0, background:"#0f1628", zIndex:1,
  },
  mTitle: { fontSize:15, fontWeight:700, color:"#dde6f5" },
  mClose: {
    width:32, height:32, borderRadius:8,
    border:"1px solid #1a2540", background:"#080d18",
    color:"#6b82a8", cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  mBody: { padding:"20px 22px" },
  mFoot: {
    display:"flex", gap:10, padding:"14px 22px",
    borderTop:"1px solid #1a2540",
    position:"sticky", bottom:0, background:"#0f1628",
  },
  cancelBtn: {
    flex:1, padding:"10px 0", borderRadius:9,
    border:"1px solid #1a2540", background:"#080d18",
    color:"#6b82a8", fontSize:13, fontWeight:600, cursor:"pointer",
  },
  saveBtn: {
    flex:2, padding:"10px 0", borderRadius:9,
    border:"none", background:"#4f7eff",
    color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  },

  /* view-products modal body */
  prodRow: {
    display:"flex", alignItems:"center", gap:12,
    padding:"10px 0", borderBottom:"1px solid #1a2540",
  },
  prodThumb: { width:48, height:48, borderRadius:8, objectFit:"cover", flexShrink:0 },
  prodName: { fontSize:13.5, fontWeight:600, color:"#dde6f5" },
  prodPrice:{ fontSize:12, color:"#6b82a8", marginTop:2 },

  /* sub-product card inside edit modal */
  subCard: {
    background:"#080d18", border:"1px solid #1a2540",
    borderRadius:10, padding:14, marginBottom:12,
  },
  subHd: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 },

  /* img thumb row in modal */
  imgThumbRow: {
    display:"flex", alignItems:"center", gap:10,
    padding:8, borderRadius:9,
    border:"1px solid #1a2540", background:"#080d18",
  },
  miniThumb: { width:48, height:48, borderRadius:7, objectFit:"cover", flexShrink:0 },
  fileLabel: {
    fontSize:11.5, color:"#4f7eff", cursor:"pointer",
    padding:"5px 10px", borderRadius:6,
    border:"1px dashed #1a2540", background:"rgba(79,126,255,.08)",
  },

  empty: { padding:"48px 0", textAlign:"center", color:"#2c3d5c", fontSize:13 },
  countBadge: {
    display:"inline-flex", alignItems:"center",
    padding:"4px 11px", borderRadius:20,
    background:"rgba(79,126,255,.12)", color:"#4f7eff",
    fontSize:12, fontWeight:600, marginLeft:10,
  },
  tabs: { display:"flex", gap:4, flexWrap:"wrap", marginBottom:20 },
  tab: (on) => ({
    padding:"7px 14px", borderRadius:8,
    border: on ? "1px solid #4f7eff" : "1px solid #1a2540",
    background: on ? "rgba(79,126,255,.13)" : "#0f1628",
    color: on ? "#4f7eff" : "#6b82a8",
    fontSize:12, fontWeight:600, cursor:"pointer",
    letterSpacing:".04em", textTransform:"uppercase",
    transition:"all .14s",
  }),
};

export default function AdminViewShopLook() {
  const navigate = useNavigate();
  const [looks, setLooks]           = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [roomFilter, setRoomFilter] = useState("all");
  const [roomTypes, setRoomTypes]   = useState(["all"]);
  const [toast, setToast]           = useState(null);

  // view modal
  const [viewProds, setViewProds]   = useState(null);

  // edit modal
  const [editOpen, setEditOpen]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [editMainFile, setEditMainFile] = useState(null);
  const [editMainPreview, setEditMainPreview] = useState(null);
  const [saving, setSaving]         = useState(false);

  const showToast = (type, msg) => { setToast({type,msg}); setTimeout(()=>setToast(null),3500); };

  const fetchLooks = async () => {
    try {
      const res  = await fetch(`${API}/`);
      if (!res.ok) return;
      const raw  = await res.json();
      const data = Array.isArray(raw) ? raw : (raw.looks || raw.data || []);
      setLooks(data); setFiltered(data);
      const rooms = ["all", ...new Set(data.map(l => l.roomType?.toLowerCase().trim()).filter(Boolean))];
      setRoomTypes(rooms);
    } catch { showToast("error","Could not reach server."); }
  };
  useEffect(() => { fetchLooks(); }, []);

  useEffect(() => {
    if (roomFilter === "all") setFiltered(looks);
    else setFiltered(looks.filter(l => l.roomType?.toLowerCase().trim() === roomFilter));
  }, [roomFilter, looks]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this room look?")) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method:"DELETE" });
      if (res.ok) { showToast("success","Look deleted."); fetchLooks(); }
      else showToast("error","Delete failed.");
    } catch { showToast("error","Server error."); }
  };

  const openEdit = (e, look) => {
    e.stopPropagation();
    const prods = (look.products || []).map(p => ({
      ...p, newFile:null, previewUrl: fmtImg(p.productImage)
    }));
    setEditing({ ...look, products: prods });
    setEditMainPreview(fmtImg(look.mainImg));
    setEditMainFile(null);
    setEditOpen(true);
  };

  const setEditProd = (i, field, val) => {
    const u = [...editing.products]; u[i][field] = val;
    setEditing({ ...editing, products: u });
  };
  const setEditProdImg = (i, file) => {
    const u = [...editing.products];
    u[i].newFile = file; u[i].previewUrl = URL.createObjectURL(file);
    setEditing({ ...editing, products: u });
  };
  const addProdRow = () => setEditing({
    ...editing,
    products: [...editing.products, { title:"", price:"", newFile:null, previewUrl:"" }]
  });
  const removeProdRow = (i) => setEditing({
    ...editing, products: editing.products.filter((_,j) => j !== i)
  });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    fd.append("roomType", editing.roomType);
    fd.append("title", editing.title);
    if (editMainFile) fd.append("mainImg", editMainFile);
    fd.append("products", JSON.stringify(editing.products.map(p => ({
      title: p.title, price: Number(p.price) || 0
    }))));
    editing.products.forEach((p, i) => { if (p.newFile) fd.append(`productImages_${i}`, p.newFile); });
    try {
      const res = await fetch(`${API}/edit/${editing._id}`, { method:"PUT", body:fd });
      if (res.ok) { showToast("success","Look updated."); setEditOpen(false); fetchLooks(); }
      else showToast("error","Update failed.");
    } catch { showToast("error","Server error."); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <button className="af-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>

      <div style={{ marginBottom:24 }}>
        <div className="af-title" style={{marginBottom:3}}>
          Shop The Look
          <span style={T.countBadge}>{filtered.length} looks</span>
        </div>
        <div className="af-sub">Manage curated room spaces and their linked product items.</div>
      </div>

      {toast && (
        <div className={`af-toast${toast.type==="error"?" error":""}`} style={{marginBottom:18}}>
          {toast.type==="success" ? <CheckCircle2 size={15}/> : <AlertCircle size={15}/>}
          {toast.msg}
        </div>
      )}

      {/* Room filter tabs */}
      <div style={T.tabs}>
        {roomTypes.map(r => (
          <button key={r} style={T.tab(roomFilter===r)} onClick={() => setRoomFilter(r)}>
            {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={T.empty}>
          <ShoppingBag size={28} style={{margin:"0 auto 8px",opacity:.2,display:"block"}}/>
          No looks found{roomFilter!=="all" ? ` for "${roomFilter}"` : ""}.
        </div>
      ) : (
        <div style={T.grid}>
          {filtered.map(look => (
            <div key={look._id} style={T.card}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#243456"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#1a2540"; e.currentTarget.style.transform="none"; }}
              onClick={() => setViewProds(look.products || [])}>
              <div style={{ position:"relative" }}>
                <img src={fmtImg(look.mainImg)} alt={look.title} style={T.cardImg}
                  onError={e => { e.target.src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400"; }}/>
                <span style={T.roomBadge(look.roomType)}>{look.roomType}</span>
              </div>
              <div style={T.cardBody}>
                <div style={T.cardTitle}>{look.title || "Room Layout"}</div>
                <div style={T.cardSub}>{look.products?.length || 0} products linked</div>
                <div style={T.cardFoot}>
                  <button style={T.viewBtn}
                    onClick={e => { e.stopPropagation(); setViewProds(look.products || []); }}
                    onMouseEnter={e => { e.currentTarget.style.background="#1a2540"; e.currentTarget.style.color="#dde6f5"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#0a0f1e"; e.currentTarget.style.color="#6b82a8"; }}>
                    <Eye size={13}/> View Products
                  </button>
                  <div style={T.actRow}>
                    <button style={T.iconBtn("#4f7eff")} title="Edit"
                      onClick={e => openEdit(e, look)}
                      onMouseEnter={e => e.currentTarget.style.background="#1a2540"}
                      onMouseLeave={e => e.currentTarget.style.background="#0a0f1e"}>
                      <Edit2 size={13}/>
                    </button>
                    <button style={T.iconBtn("#f04f72")} title="Delete"
                      onClick={e => handleDelete(e, look._id)}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(240,79,114,.12)"}
                      onMouseLeave={e => e.currentTarget.style.background="#0a0f1e"}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW PRODUCTS MODAL ── */}
      {viewProds && (
        <div style={T.overlay} onClick={() => setViewProds(null)}>
          <div style={{...T.modal, maxWidth:400}} onClick={e => e.stopPropagation()}>
            <div style={T.mHead}>
              <span style={T.mTitle}>Linked Products</span>
              <button style={T.mClose} onClick={() => setViewProds(null)}><X size={15}/></button>
            </div>
            <div style={T.mBody}>
              {viewProds.length === 0
                ? <div style={T.empty}>No products linked.</div>
                : viewProds.map((p, i) => (
                  <div key={i} style={{ ...T.prodRow, ...(i === viewProds.length-1 ? {borderBottom:"none"} : {}) }}>
                    <img src={fmtImg(p.productImage)} alt={p.title} style={T.prodThumb}
                      onError={e => { e.target.src="https://via.placeholder.com/48?text=?"; }}/>
                    <div>
                      <div style={T.prodName}>{p.title || `Item #${i+1}`}</div>
                      <div style={T.prodPrice}>₹{p.price || "—"}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editOpen && editing && (
        <div style={T.overlay} onClick={() => setEditOpen(false)}>
          <div style={T.modal} onClick={e => e.stopPropagation()}>
            <div style={T.mHead}>
              <span style={T.mTitle}>Edit Room Look</span>
              <button style={T.mClose} onClick={() => setEditOpen(false)}><X size={15}/></button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={T.mBody}>
                <div className="af-row">
                  <div className="af-group">
                    <label className="af-label">Banner Title</label>
                    <input className="af-input" value={editing.title}
                      onChange={e => setEditing({...editing, title:e.target.value})} required/>
                  </div>
                  <div className="af-group">
                    <label className="af-label">Room Zone</label>
                    <select className="af-select" value={editing.roomType}
                      onChange={e => setEditing({...editing, roomType:e.target.value})}>
                      {["bedroom","living","dining","kitchen","office","balcony"].map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="af-group">
                  <label className="af-label">Main Image</label>
                  <div style={T.imgThumbRow}>
                    <img src={editMainPreview} alt="main" style={{ ...T.miniThumb, width:64, height:64 }}
                      onError={e => { e.target.src="https://via.placeholder.com/64?text=Img"; }}/>
                    <label style={T.fileLabel}>
                      <Upload size={11} style={{marginRight:4,verticalAlign:"middle"}}/>
                      Change
                      <input type="file" accept="image/*" style={{display:"none"}}
                        onChange={e => { const f=e.target.files[0]; if(f){ setEditMainFile(f); setEditMainPreview(URL.createObjectURL(f)); }}}/>
                    </label>
                  </div>
                </div>

                <hr className="af-divider"/>
                <div className="af-section-title">Linked Products</div>

                {editing.products.map((p, i) => (
                  <div key={i} style={T.subCard}>
                    <div style={T.subHd}>
                      <span className="af-badge">Item #{i+1}</span>
                      {editing.products.length > 1 && (
                        <button type="button" className="af-remove-btn"
                          onClick={() => removeProdRow(i)}>
                          <Trash2 size={11}/> Remove
                        </button>
                      )}
                    </div>
                    <div className="af-row">
                      <div className="af-group">
                        <label className="af-label">Name</label>
                        <input className="af-input" value={p.title || ""}
                          onChange={e => setEditProd(i,"title",e.target.value)} required/>
                      </div>
                      <div className="af-group">
                        <label className="af-label">Price (₹)</label>
                        <input className="af-input" type="number" value={p.price || ""}
                          onChange={e => setEditProd(i,"price",e.target.value)} required/>
                      </div>
                    </div>
                    <div className="af-group" style={{marginBottom:0}}>
                      <label className="af-label">Item Image</label>
                      <div style={T.imgThumbRow}>
                        <img src={p.previewUrl || "https://via.placeholder.com/48?text=?"} alt="item" style={T.miniThumb}
                          onError={e => { e.target.src="https://via.placeholder.com/48?text=?"; }}/>
                        <label style={T.fileLabel}>
                          <Upload size={11} style={{marginRight:4,verticalAlign:"middle"}}/>
                          Change
                          <input type="file" accept="image/*" style={{display:"none"}}
                            onChange={e => { const f=e.target.files[0]; if(f) setEditProdImg(i,f); }}/>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="af-add-row" onClick={addProdRow}>
                  <Plus size={13}/> Add Product
                </button>
              </div>

              <div style={T.mFoot}>
                <button type="button" style={T.cancelBtn} onClick={() => setEditOpen(false)}>Cancel</button>
                <button type="submit" style={T.saveBtn} disabled={saving}>
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