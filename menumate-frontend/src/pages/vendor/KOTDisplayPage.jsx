import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import KOTTicket from "../../components/organisms/KOTTicket";
import useVendorWebSocket from "../../hooks/useVendorWebSocket";
import {
  fetchOrdersForShop,
  updateOrderStatus,
} from "../../features/vendor/orderSlice";
import {
  setSelectedShop,
  fetchMyShops,
} from "../../features/vendor/shopSlice";
import VendorNavbarTop from "../../components/organisms/VendorNavbarTop"; // ✅ Top Navbar

// Mapping orderStatus → next button label
const nextActionMap = {
  Accepted: "Start Preparing",
  Preparing: "Mark Ready",
  Ready: "Complete Order",
};

const KOTDisplayPage = () => {
  const dispatch = useDispatch();
  const { vendor } = useSelector((state) => state.vendorAuth);
  const { orders } = useSelector((state) => state.vendorOrder);
  const { shops, selectedShop, loading: shopsLoading } = useSelector(
    (state) => state.shops
  );

  const [activeTickets, setActiveTickets] = useState([]);

  // 1️⃣ Fetch shops on mount
  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  // 2️⃣ Auto-select the first shop if none selected
  useEffect(() => {
    if (!shopsLoading && shops.length > 0 && !selectedShop) {
      dispatch(setSelectedShop(shops[0]));
    }
  }, [shops, shopsLoading, selectedShop, dispatch]);

  const shopId = selectedShop?._id;

  // 3️⃣ Fetch orders when shopId is available
  useEffect(() => {
    if (shopId) dispatch(fetchOrdersForShop(shopId));
  }, [dispatch, shopId]);

  // 4️⃣ WebSocket for real-time updates
  useVendorWebSocket(shopId);

  // 5️⃣ Update active tickets whenever orders change
  useEffect(() => {
    const filtered = orders.filter((order) =>
      ["Accepted", "Preparing", "Ready"].includes(order.orderStatus)
    );
    setActiveTickets(filtered);
  }, [orders]);

  // 6️⃣ Progress order to next stage
  const progressOrderStatus = (orderId, currentStatus) => {
    const nextStatus =
      currentStatus === "Accepted"
        ? "Preparing"
        : currentStatus === "Preparing"
        ? "Ready"
        : currentStatus === "Ready"
        ? "Completed"
        : null;

    if (!nextStatus) return;

    // Optimistic UI update
    setActiveTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === orderId
          ? { ...ticket, orderStatus: nextStatus }
          : ticket
      )
    );

    // Backend update
    dispatch(updateOrderStatus({ orderId, status: nextStatus }))
      .unwrap()
      .catch((err) => {
        console.error("Failed to update order status", err);
        // Revert UI if backend fails
        setActiveTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === orderId
              ? { ...ticket, orderStatus: currentStatus }
              : ticket
          )
        );
      });
  };

  // ---------------- UI ----------------
  if (!vendor)
    return (
      <div className="p-8 text-center text-gray-600">
        Please log in to view KOT.
      </div>
    );
  if (!shopId)
    return (
      <div className="p-8 text-center text-gray-600">
        Loading shop info...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      {/* ✅ Top Navigation Bar */}
      <VendorNavbarTop />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#6F4E37]">
              Kitchen Order Display (KOT)
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Shop: <span className="font-semibold">{vendor.name}</span> —{" "}
              <span className="text-gray-500 text-xs">ID: {shopId}</span>
            </p>
          </div>

          <select
            onChange={(e) => {
              const shop = shops.find((s) => s._id === e.target.value);
              dispatch(setSelectedShop(shop));
            }}
            value={shopId || ""}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-1 focus:ring-[#6F4E37]"
          >
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeTickets.length === 0 ? (
            <div className="col-span-full bg-white p-10 rounded-xl text-center border border-[#EAE8E2] shadow-sm">
              <p className="text-2xl font-semibold text-[#6F4E37]">
                🟢 No Active Orders
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Waiting for new requests...
              </p>
            </div>
          ) : (
            activeTickets.map((ticket) => (
              <KOTTicket
                key={ticket._id}
                order={ticket}
                nextActionLabel={nextActionMap[ticket.orderStatus]}
                onNextStage={() =>
                  progressOrderStatus(ticket._id, ticket.orderStatus)
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default KOTDisplayPage;
