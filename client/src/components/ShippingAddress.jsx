import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { MapPin, Phone, User, Globe, Navigation, ArrowRight } from "lucide-react";

function ShippingAddress() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/orders", { shippingAddress: formData });
      
      // Save order details for the next step (Payment)
      localStorage.setItem("lastOrder", JSON.stringify(res.data));
      localStorage.setItem("shippingAddress", JSON.stringify(formData));
      
      navigate("/payment");
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
      alert("Error: " + (error.response?.data?.message || "Unauthorized"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="flex items-center justify-center mb-10 space-x-4">
          <div className="flex items-center text-blue-600">
            <span className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center font-bold text-sm">1</span>
            <span className="ml-2 font-semibold">Shipping</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center text-gray-400">
            <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-sm">2</span>
            <span className="ml-2 font-semibold">Payment</span>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin size={24} /> Delivery Information
            </h2>
            <p className="text-blue-100 text-sm mt-1">Where should we send your order?</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="md:col-span-2 relative">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Street Address</label>
                <div className="relative mt-1">
                  <Navigation className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Street, Apartment 4B"
                    required
                    rows="2"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Country */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Country</label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Details...
                </span>
              ) : (
                <>
                  Continue to Payment <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShippingAddress;