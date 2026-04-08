import { motion } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react"; 
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export default function ProductCard({ product }) {
  const navigate = useNavigate(); // 2. Initialize navigate
  const BASE_URL = import.meta.env.VITE_API_URL;
  const imageUrl = product.image
  ? product.image.startsWith("http")
    ? product.image   // ✅ Cloudinary image
    : `${BASE_URL}${product.image}` // ✅ old local image
  : "https://via.placeholder.com/600";

console.log("FINAL IMAGE:", imageUrl);

  // 3. Navigation handler
  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick} 
      className="group relative w-full cursor-pointer flex flex-col"
    >
      
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white border border-zinc-100">
        <motion.img
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            console.log("Adding:", product._id);
            
          }}
          className="absolute right-3 top-3 z-10 p-3 bg-white/90 backdrop-blur-md text-black rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-black hover:text-white"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-800 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
            View details <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      
      <div className="mt-4 flex flex-col gap-0.5">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-[14px] font-bold tracking-tight text-zinc-900 leading-tight line-clamp-2 uppercase">
            {product.name}
          </h2>
          <p className="text-[14px] font-semibold text-zinc-700 whitespace-nowrap">
            ₹{product.price?.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="h-[1px] w-4 bg-zinc-300" />
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            {product.category?.name || "Collection"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}