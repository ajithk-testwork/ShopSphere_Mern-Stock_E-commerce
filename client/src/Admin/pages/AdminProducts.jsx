import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Edit3, Trash2, Search, X, Loader2, Package, 
  CheckCircle, AlertCircle, Save, Camera, Image as ImageIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editProduct, setEditProduct] = useState(null); 
  const [newImage, setNewImage] = useState(null);     
  const [imgPreview, setImgPreview] = useState(null); 
  const [status, setStatus] = useState(null);         
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/categories")
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      showToast("Failed to load inventory", "error");
    } finally { setLoading(false); }
  };

  const showToast = (text, type = "success") => {
    setStatus({ text, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
      showToast("Product deleted");
    } catch (err) { showToast("Delete failed", "error"); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("price", Number(editProduct.price));
    formData.append("stock", Number(editProduct.stock));
    formData.append("description", editProduct.description);
    
    // Only append image if a new one was selected
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        formData,
        { 
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          } 
        }
      );
      
      // Update local state with fresh data from database
      setProducts(products.map(p => p._id === editProduct._id ? res.data : p));
      showToast("Inventory Updated!");
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally { setIsUpdating(false); }
  };

  const closeModal = () => {
    setEditProduct(null);
    setNewImage(null);
    setImgPreview(null);
  };

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                         (p.description && p.description.toLowerCase().includes(searchLower));
    const matchesCategory = selectedCategory === "All" || p.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen bg-[#fcfcfc]">
      <AnimatePresence>
        {status && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold ${status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.text}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Inventory</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Catalog Management
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-gray-500 outline-none ring-1 ring-gray-100 focus:ring-blue-500 transition-all cursor-pointer hover:bg-gray-50">
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Type to search..."
              className="w-full pl-12 pr-6 py-3 bg-white border-none rounded-2xl shadow-sm outline-none ring-1 ring-gray-100 focus:ring-blue-500 font-medium" />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6 text-left">Product</th>
              <th className="px-6 py-6 text-left">Category</th>
              <th className="px-6 py-6 text-left">Stock Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p) => (
              <motion.tr layout key={p._id} className="group hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={`http://localhost:5000${p.image}`} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-100" />
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                      <p className="text-blue-600 font-black text-sm mt-1">₹{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black">{p.category?.name || 'N/A'}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`text-xs font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                    {p.stock} Units
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditProduct(p)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-90"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all cursor-pointer active:scale-90"><Trash2 size={18} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                
                <div className="md:w-5/12 bg-gray-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
                  <div className="relative group w-full aspect-square rounded-[2rem] overflow-hidden shadow-inner border border-gray-200">
                    <img src={imgPreview || `http://localhost:5000${editProduct.image}`} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                      <Camera size={32} />
                      <span className="text-[10px] font-black uppercase mt-2">Change Image</span>
                      <input type="file" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <div className="md:w-7/12 p-10">
                  <header className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Edit Product</h3>
                    <button onClick={closeModal} className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors"><X size={24} /></button>
                  </header>

                  <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Product Name</label>
                      <input value={editProduct.name} onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/10 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price (₹)</label>
                        <input type="number" value={editProduct.price} onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/10 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Stock</label>
                        <input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/10 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                      <textarea value={editProduct.description} onChange={(e) => setEditProduct({...editProduct, description: e.target.value})} rows="3"
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/10 transition-all resize-none" />
                    </div>

                    <button disabled={isUpdating} className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                      {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {isUpdating ? "Syncing..." : "Update Database"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}