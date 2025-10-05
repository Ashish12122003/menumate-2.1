// src/components/organisms/TableManagement.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";

import { createTablesForShop } from "../../api/adminService";
import { fetchShopData } from "../../features/vendor/shopSlice";

const TableManagement = ({ shopId }) => {
  const dispatch = useDispatch();
  const [manualTableName, setManualTableName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generatedQRs, setGeneratedQRs] = useState([]);

  const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualTableName) return;
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const qrIdentifier = uuidv4();
            // The fix: send a single tableNumber string
            await createTablesForShop(shopId, { tableNumber: manualTableName, qrIdentifier });
            setManualTableName("");
            setSuccessMessage(`QR code for table "${manualTableName}" created successfully!`);
            setGeneratedQRs([{ tableNumber: manualTableName, qrIdentifier }]);
            dispatch(fetchShopData(shopId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create QR code.");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!start || !end || isNaN(start) || isNaN(end) || parseInt(start) > parseInt(end)) {
            setError("Invalid start/end numbers.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const tablesToCreate = [];
        for (let i = parseInt(start); i <= parseInt(end); i++) {
            tablesToCreate.push({ tableNumber: prefix ? `${prefix}${i}` : `${i}`, qrIdentifier: uuidv4() });
        }

        try {
            // The fix: send the array of table objects
            await createTablesForShop(shopId, { tableNumbers: tablesToCreate });
            setPrefix("");
            setStart("");
            setEnd("");
            setSuccessMessage(`${tablesToCreate.length} QR codes generated successfully!`);
            setGeneratedQRs(tablesToCreate);
            dispatch(fetchShopData(shopId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create QR codes in bulk.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className=" bg-white space-y-12">
      <h2 className="text-3xl font-bold text-olive-700 border-b border-olive-300 pb-2">
        Table & QR Management
      </h2>

      {/* Error / Success Messages */}
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
      {successMessage && <p className="text-olive-700 font-medium text-center">{successMessage}</p>}

      {/* Manual QR Creation */}
      <div className="bg-white rounded-2xl shadow-lg p-6  border-orange-300">
        <h3 className="text-xl font-semibold text-olive-800 mb-5">Create One QR Code</h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualTableName}
            onChange={(e) => setManualTableName(e.target.value)}
            placeholder="Table Name/Number"
            className="bg-orange-50 flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-olive-700 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Generate QR"}
          </button>
        </form>
      </div>

      {/* Bulk QR Creation */}
      <div className="bg-white rounded-2xl shadow-lg p-6  border-green-900">
        <h3 className="text-xl font-semibold text-olive-800 mb-5">Generate Multiple QR Codes</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={handleBulkSubmit}>
          <div>
            <label htmlFor="prefix" className="block text-sm font-medium text-olive-700">Prefix</label>
            <input
              type="text"
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-olive-700">Start Number</label>
            <input
              type="number"
              id="start"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-olive-700">End Number</label>
            <input
              type="number"
              id="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-olive-700 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Bulk Generate"}
          </button>
        </form>
      </div>

      {/* Display Generated QR Codes */}
      {generatedQRs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-olive-800 mb-5">Generated QR Codes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {generatedQRs.map((table) => (
              <div
                key={table.qrIdentifier}
                className="flex flex-col items-center p-4 border rounded-xl bg-white hover:shadow-2xl transition transform hover:scale-105"
              >
                <p className="font-medium text-olive-800 mb-2">{table.tableNumber}</p>
                <QRCode value={`${window.location.origin}/menu/${table.qrIdentifier}`} size={128} />
                <a
                  href={`${window.location.origin}/menu/${table.qrIdentifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-olive-600 text-sm mt-2 hover:underline"
                >
                  Test Link
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
