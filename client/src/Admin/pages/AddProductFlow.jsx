import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  X,
  PlusCircle,
  Loader2,
  Package,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  FileText,
  ChevronRight,
  Search,
  Check,
} from "lucide-react";
import { api } from "../../utils/api";

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
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    preview: null,
  });
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
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
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      if (categoryForm.image) formData.append("image", categoryForm.image);

      try {
        const res = await api.post("/categories/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCreatedCategory(res.data);
        setStep(2);
      } catch (err) {
        alert(err.response?.data?.message || "Error creating category");
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedCatId) return alert("Please select a category");
      const existing = categories.find((c) => c._id === selectedCatId);
      setCreatedCategory(existing);
      setStep(2);
    }
  };

  const addProductToTable = () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      return alert("Please fill Name, Price, and Description");
    }
    setProductList([...productList, { ...productForm, id: Date.now() }]);
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
      preview: null,
    });
  };

  const handleFinalSubmit = async () => {
    if (productList.length === 0) return alert("Add at least one product");
    setLoading(true);
    try {
      for (const prod of productList) {
        const formData = new FormData();
        formData.append("name", prod.name);
        formData.append("description", prod.description);
        formData.append("price", Number(prod.price));
        formData.append("stock", Number(prod.stock) || 0);
        formData.append("category", createdCategory._id);
        if (prod.image) formData.append("image", prod.image);

        const token = localStorage.getItem("accessToken");

        await api.post("/products/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }
      alert("🚀 All products published successfully!");
      resetAll();
    } catch (error) {
      alert("Error saving products");
    } finally {
      setLoading(false);
    }
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
    <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER & STEPPER */}
      <header className="mb-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Package size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Inventory Setup
          </span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
          {step === 1 ? "Select Category" : `Add Products to ${createdCategory?.name}`}
        </h2>

        {/* Visual Stepper */}
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
              {step > 1 ? <Check size={16} /> : "1"}
            </div>
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Category</span>
          </div>
          <div className={`h-[2px] w-16 rounded-full transition-colors ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step === 2 ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
              2
            </div>
            <span className={`text-sm font-semibold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>Products</span>
          </div>
        </div>
      </header>

      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            {/* Segmented Control */}
            <div className="flex p-1 mb-8 bg-slate-100/80 rounded-xl">
              <button
                type="button"
                onClick={() => setIsNewCategory(false)}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${!isNewCategory ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                Existing
              </button>
              <button
                type="button"
                onClick={() => setIsNewCategory(true)}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${isNewCategory ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                Create New
              </button>
            </div>

            <form onSubmit={handleCategoryStep}>
              {!isNewCategory ? (
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                    Select a Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCatId}
                      onChange={(e) => setSelectedCatId(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none cursor-pointer transition-all hover:border-slate-300"
                    >
                      <option value="" disabled>Choose from list...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Search size={18} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">
                      Category Name
                    </label>
                    <input
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400"
                      placeholder="e.g. Smart Home Devices"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">
                      Category Image
                    </label>
                    <div className="relative h-40 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:bg-slate-100 transition-colors group">
                      {catPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={catPreview}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                          <button
                            type="button"
                            onClick={() => setCatPreview(null)}
                            className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-slate-700 hover:text-red-600 hover:scale-105 transition-all cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                          <div className="w-10 h-10 mb-3 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                            <ImageIcon size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-600 mb-1">
                            Click to upload image
                          </span>
                          <span className="text-xs text-slate-400">
                            SVG, PNG, JPG or GIF
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setCategoryForm({ ...categoryForm, image: file });
                                setCatPreview(URL.createObjectURL(file));
                              }
                            }}
                            required={isNewCategory}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Continue to Products <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* LEFT: Product Input Form */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <FileText size={18} />
                  </div>
                  Item Details
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">Product Name</label>
                  <input
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 font-medium text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">Description</label>
                  <textarea
                    placeholder="Briefly describe the product..."
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 font-medium text-sm h-28 resize-none outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">Price (₹)</label>
                    <input
                      placeholder="0.00"
                      type="number"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 font-medium text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">Stock</label>
                    <input
                      placeholder="0"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stock: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 font-medium text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block ml-1">Product Image</label>
                  <div className="relative h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:bg-slate-100 transition-colors group">
                    {productForm.preview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={productForm.preview}
                          className="w-full h-full object-cover"
                          alt="p-prev"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              image: null,
                              preview: null,
                            })
                          }
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <UploadCloud size={24} className="text-slate-400 mb-2 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-xs text-slate-500 font-medium">
                          Upload product image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if(file) {
                              setProductForm({
                                ...productForm,
                                image: file,
                                preview: URL.createObjectURL(file),
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={addProductToTable}
                    className="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <PlusCircle size={18} /> Add to Queue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Table UI */}
          <div className="xl:col-span-7 flex flex-col h-full gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Publishing Queue</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Review items before saving to database</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                  <Package size={14}/>
                  {productList.length} {productList.length === 1 ? 'ITEM' : 'ITEMS'}
                </div>
              </div>
              
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Product Detail</th>
                      <th className="px-6 py-3 font-semibold">Price & Stock</th>
                      <th className="px-6 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {productList.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, backgroundColor: "#fee2e2" }}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                {item.preview ? (
                                  <img
                                    src={item.preview}
                                    className="w-full h-full object-cover"
                                    alt="thumbnail"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="max-w-[200px]">
                                <div className="font-bold text-sm text-slate-900 truncate">
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-500 truncate mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-900">
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              Qty: {item.stock}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                setProductList(
                                  productList.filter((p) => p.id !== item.id),
                                )
                              }
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {productList.length === 0 && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-24 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Package size={40} className="mb-3 opacity-20" />
                            <p className="font-medium text-sm text-slate-500">Your queue is empty</p>
                            <p className="text-xs mt-1">Fill out the form to add products here.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold uppercase text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-slate-50"
              >
                ← Back to Category
              </button>
              
              <button
                onClick={handleFinalSubmit}
                disabled={loading || productList.length === 0}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {loading
                  ? "Publishing..."
                  : `Publish to ${createdCategory?.name || 'Category'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}