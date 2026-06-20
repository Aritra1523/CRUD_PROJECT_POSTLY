import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Wallet,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  XCircle,
  ShoppingBag,
  ArrowLeft,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";

// ─── Status badge styling ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  Processing: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  Shipped: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", icon: Truck },
  Delivered: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", icon: CheckCircle2 },
  Cancelled: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Processing;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

// ─── Single order card ──────────────────────────────────────────────────────────
const OrderCard = ({ order, onReorder, onCancel }) => {
  const [open, setOpen] = useState(false);

  const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white">{order.id}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400">${order.total.toFixed(2)}</p>
          </div>
          <StatusBadge status={order.status} />
          {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-5 pt-4 space-y-4">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900/40 rounded-lg px-3 py-2">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.title}</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  ${((item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Shipping Address
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.shippingInfo.fullName}
                <br />
                {order.shippingInfo.address}, {order.shippingInfo.city}
                <br />
                {order.shippingInfo.state} - {order.shippingInfo.pincode}
                <br />
                {order.shippingInfo.phone}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-semibold mb-1">
                {order.paymentMethod === "card" ? <CreditCard className="w-3.5 h-3.5" /> : <Wallet className="w-3.5 h-3.5" />}
                Payment
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.paymentMethod === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
              </p>

              <div className="mt-3 space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span><span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onReorder(order)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reorder
            </button>
            {order.status === "Processing" && (
              <button
                onClick={() => onCancel(order.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2.5 rounded-xl font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Order History Page ───────────────────────────────────────────────────
const OrderHistoryPage = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { addToCart, increment } = useCart();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.price);
      for (let i = 1; i < item.quantity; i++) {
        increment(item._id);
      }
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Items added to your cart",
      showConfirmButton: false,
      timer: 2000,
    });

    navigate("/cart");
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
    });

    if (result.isConfirmed) {
      updateOrderStatus(orderId, "Cancelled");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Order cancelled",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/product/list"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Order History</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your placed orders will show up here.</p>
            <button
              onClick={() => navigate("/product/list")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Browse Posts
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={handleReorder} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;