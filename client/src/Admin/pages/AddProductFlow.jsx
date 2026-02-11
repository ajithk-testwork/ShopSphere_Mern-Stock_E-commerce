import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, X, PlusCircle, Loader2, Package, 
  Image as ImageIcon, Trash2, CheckCircle2, FileText, ChevronRight, Search
} from "lucide-react";

export default function AddProductFlow() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]); 
  const [isNewCategory, setIsNewCategory] = useState(false); 
  
  const [createdCategory, setCreatedCategory] = useState(null); 
  
  
  const [categoryForm, setCategoryForm] = useState({ name: "", image: null }); 
  const [selectedCatId, setSelectedCatId] = useState("");
  const [catPreview, setCatPreview] = useState(null); 

  
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", stock: "", image: null, preview: null
  }); 
  const [productList, setProductList] = useState([]); 

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

 
  const handleCategoryStep = async (e) => {
    e.preventDefault();
    
    if (isNewCategory) {
      setLoading(true);
      const token = localStorage.getItem("accessToken"); 
      const formData = new FormData();
      formData.append("name", categoryForm.name); 
      if (categoryForm.image) formData.append("image", categoryForm.image); 

      try {
        const res = await axios.post("http://localhost:5000/api/categories/create", formData, {
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          }
        }); 
        setCreatedCategory(res.data);
        setStep(2); 
      } catch (err) {
        alert(err.response?.data?.message || "Error creating category");
      } finally { setLoading(false); }
    } else {
      if (!selectedCatId) return alert("Please select a category");
      const existing = categories.find(c => c._id === selectedCatId);
      setCreatedCategory(existing);
      setStep(2);
    }
  };

  
  const addProductToTable = () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      return alert("Please fill Name, Price, and Description");
    }
    setProductList([...productList, { ...productForm, id: Date.now() }]);
    setProductForm({ name: "", description: "", price: "", stock: "", image: null, preview: null });
  };

 
  const handleFinalSubmit = async () => {
    if (productList.length === 0) return alert("Add at least one product to the table");
    setLoading(true);
    const token = localStorage.getItem("accessToken"); 

    try {
      for (const prod of productList) {
        const formData = new FormData();
        formData.append("name", prod.name); 
        formData.append("description", prod.description); 
        formData.append("price", Number(prod.price)); 
        formData.append("stock", Number(prod.stock) || 0); 
        formData.append("category", createdCategory._id); 
        if (prod.image) formData.append("image", prod.image); 

        await axios.post("http://localhost:5000/api/products/create", formData, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          }
        }); 
      }
      alert("🚀 All products published successfully!");
      resetAll();
    } catch (error) {
      alert("Error saving products");
    } finally { setLoading(false); }
  };

  const resetAll = () => {
    setStep(1);
    setProductList([]);
    setCreatedCategory(null);
    setCategoryForm({ name: "", image: null });
    setSelectedCatId("");
    setCatPreview(null);
  };

  return (
    <div className="p-6 lg:p-12 max-w-6xl mx-auto min-h-screen bg-[#fafafa]">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2 text-blue-600">
          <Package size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Inventory Management</span>
        </div>
        <h2 className="text-4xl font-black text-gray-900 leading-tight">
          {step === 1 ? "Step 1: Category Selection" : `Step 2: Add Products to ${createdCategory?.name}`}
        </h2>
      </header>

      {step === 1 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            {/* Tab Toggle */}
            <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
              <button 
                type="button"
                onClick={() => setIsNewCategory(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${!isNewCategory ? "bg-white shadow-md text-blue-600" : "text-gray-400"}`}
              >
                Existing Category
              </button>
              <button 
                type="button"
                onClick={() => setIsNewCategory(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${isNewCategory ? "bg-white shadow-md text-blue-600" : "text-gray-400"}`}
              >
                Create New
              </button>
            </div>

            <form onSubmit={handleCategoryStep}>
              {!isNewCategory ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-gray-400 block ml-1">Search & Select Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCatId}
                      onChange={(e) => setSelectedCatId(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block ml-1">New Category Name</label>
                    <input 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. Smart Home"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block ml-1">Category Image</label>
                    <div className="relative h-44 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {catPreview ? (
                        <div className="relative w-full h-full group">
                          <img src={catPreview} className="w-full h-full object-cover" alt="Preview" />
                          <button type="button" onClick={() => setCatPreview(null)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform cursor-pointer"><X size={16}/></button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center group">
                          <ImageIcon className="text-gray-300 mb-2 group-hover:text-blue-400 transition-colors" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Icon</span>
                          <input type="file" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            setCategoryForm({...categoryForm, image: file});
                            setCatPreview(URL.createObjectURL(file));
                          }} required={isNewCategory} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full mt-10 bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all cursor-pointer">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue to Products <ChevronRight size={18} /></>}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Product Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                <FileText size={18} className="text-blue-500" /> Item Details
              </h3>
              <div className="space-y-4">
                <input 
                  placeholder="Product Name" 
                  value={productForm.name} 
                  onChange={(e)=>setProductForm({...productForm, name: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none font-semibold text-sm outline-none focus:ring-1 focus:ring-blue-100" 
                />
                <textarea 
                  placeholder="Product Description..." 
                  value={productForm.description}
                  onChange={(e)=>setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none font-semibold text-sm h-28 resize-none outline-none focus:ring-1 focus:ring-blue-100"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Price (₹)" type="number" value={productForm.price} onChange={(e)=>setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none font-semibold text-sm outline-none focus:ring-1 focus:ring-blue-100" />
                  <input placeholder="Stock" type="number" value={productForm.stock} onChange={(e)=>setProductForm({...productForm, stock: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none font-semibold text-sm outline-none focus:ring-1 focus:ring-blue-100" />
                </div>
                <div className="relative h-32 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {productForm.preview ? (
                    <div className="relative w-full h-full">
                      <img src={productForm.preview} className="w-full h-full object-cover" alt="p-prev" />
                      <button type="button" onClick={() => setProductForm({...productForm, image: null, preview: null})} className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500 cursor-pointer"><X size={12}/></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <UploadCloud size={20} className="text-gray-300 mb-1" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Product Image</span>
                      <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        setProductForm({...productForm, image: file, preview: URL.createObjectURL(file)});
                      }} />
                    </label>
                  )}
                </div>
                <button onClick={addProductToTable} className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all cursor-pointer active:scale-95"><PlusCircle size={18} /> Add to List</button>
              </div>
            </div>
          </div>

          {/* RIGHT: Table UI */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Queue to Publish</h3>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black">{productList.length} ITEMS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Price/Stock</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence mode="popLayout">
                      {productList.map((item) => (
                        <motion.tr key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                {item.preview ? <img src={item.preview} className="w-full h-full object-cover" alt="t-prev" /> : <ImageIcon className="m-auto text-gray-300" size={16}/>}
                              </div>
                              <div className="max-w-[180px]">
                                <div className="font-bold text-sm truncate">{item.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-900 tracking-tight">₹{item.price}</div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">{item.stock} in stock</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setProductList(productList.filter(p => p.id !== item.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {productList.length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-300 font-medium italic text-sm">Table is empty. Add a product on the left to begin.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleFinalSubmit} disabled={loading || productList.length === 0} className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-gray-900 active:scale-[0.99] disabled:bg-gray-200 disabled:shadow-none transition-all cursor-pointer">
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={22} />}
                {loading ? "Publishing Database..." : `Finalize & Publish to ${createdCategory?.name}`}
              </button>
              <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-gray-600 transition-colors cursor-pointer">← Change Category Selection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}