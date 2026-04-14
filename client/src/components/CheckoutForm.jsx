import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { api } from "../utils/api";

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      
      const { data } = await api.post("/payments/create", { orderId });
      const clientSecret = data.clientSecret;

      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("Payment Successful!");
        window.location.href = "/orders/success";
      }
    } catch (err) {
      setErrorMessage("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;