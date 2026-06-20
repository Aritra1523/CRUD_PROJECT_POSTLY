import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Wallet,
  ShoppingBag,
} from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "card"
  const [card, setCard] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState({});
  const [placing, setPlacing] = useState(false);

  // Redirect back to cart if it's empty (and not mid-checkout)
  useEffect(() => {
    if (cartItems.length === 0 && !placing) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  const shipping = totalPrice > 0 ? 4.99 : 0;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error[name]) setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
    if (error[name]) setError((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newError = {};

    if (!form.fullName.trim()) newError.fullName = "Full name is required";
    if (!form.phone.trim()) newError.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim()))
      newError.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newError.address = "Address is required";
    if (!form.city.trim()) newError.city = "City is required";
    if (!form.state.trim()) newError.state = "State is required";
    if (!form.pincode.trim()) newError.pincode = "Pincode is required";
    else if (!/^\d{4,6}$/.test(form.pincode.trim()))
      newError.pincode = "Enter a valid pincode";

    if (paymentMethod === "card") {
      if (
        !card.cardNumber.trim() ||
        card.cardNumber.replace(/\s/g, "").length < 12
      )
        newError.cardNumber = "Enter a valid card number";
      if (!card.cardName.trim()) newError.cardName = "Name on card is required";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim()))
        newError.expiry = "Use MM/YY format";
      if (!/^\d{3,4}$/.test(card.cvv.trim())) newError.cvv = "Invalid CVV";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

 const handlePlaceOrder = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setPlacing(true);

  setTimeout(async () => {
    setPlacing(false);

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      items: cartItems,
      subtotal: totalPrice,
      shipping,
      tax,
      total: grandTotal,
      shippingInfo: { ...form },
      paymentMethod,
      status: "Processing",
    };

    // addOrder(order);

    await Swal.fire({
      title: "Order Placed! 🎉",
      html: `Thank you, <b>${form.fullName}</b>!<br/>Your order <b>${order.id}</b> totaling <b>$${grandTotal.toFixed(
        2
      )}</b> has been confirmed.`,
      icon: "success",
      confirmButtonText: "View My Orders",
      confirmButtonColor: "#6366f1",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
        title: "text-2xl font-bold text-gray-800 dark:text-white",
        htmlContainer: "text-gray-600 dark:text-gray-300",
        confirmButton: "px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105",
      },
    });

    clearCart();
    navigate("/orders");
  }, 900);
};

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Checkout
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review your details and place your order
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* ─── Left: Shipping & Payment ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white mb-5">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        error.fullName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                  </div>
                  {error.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        error.phone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                  </div>
                  {error.phone && (
                    <p className="text-red-500 text-xs mt-1">{error.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email (optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      name="address"
                      rows="2"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Street address, apartment, etc."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        error.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none resize-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                  </div>
                  {error.address && (
                    <p className="text-red-500 text-xs mt-1">{error.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      error.city
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                  />
                  {error.city && (
                    <p className="text-red-500 text-xs mt-1">{error.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      error.state
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                  />
                  {error.state && (
                    <p className="text-red-500 text-xs mt-1">{error.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="560001"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      error.pincode
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                  />
                  {error.pincode && (
                    <p className="text-red-500 text-xs mt-1">{error.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white mb-5">
                <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-indigo-600"
                  />
                  <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Cash on Delivery
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-indigo-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Credit / Debit Card
                  </span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 mt-4">
                      Card Number
                    </label>
                    <input
                      name="cardNumber"
                      value={card.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        error.cardNumber
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                    {error.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Name on Card
                    </label>
                    <input
                      name="cardName"
                      value={card.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        error.cardName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                    {error.cardName && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.cardName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Expiry (MM/YY)
                    </label>
                    <input
                      name="expiry"
                      value={card.expiry}
                      onChange={handleCardChange}
                      placeholder="08/27"
                      maxLength={5}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        error.expiry
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                    {error.expiry && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      CVV
                    </label>
                    <input
                      name="cvv"
                      type="password"
                      value={card.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        error.cvv
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                    />
                    {error.cvv && (
                      <p className="text-red-500 text-xs mt-1">{error.cvv}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: Order Summary ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="pr-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-800 dark:text-white border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                  <span>Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placing ? "Placing Order…" : "Place Order"}
              </button>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                By placing your order you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
