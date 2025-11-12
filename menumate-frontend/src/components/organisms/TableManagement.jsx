import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import {
  createTablesForShop,
  getTablesForShop,
  deleteTable,
} from "../../api/adminService";
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
  const [existingTables, setExistingTables] = useState([]);

  // Fetch existing tables
  useEffect(() => {
    const fetchExistingTables = async () => {
      try {
        const tables = await getTablesForShop(shopId);
        setExistingTables(tables);
        setGeneratedQRs(tables);
      } catch (err) {
        console.error(err);
        setError("Failed to load existing tables.");
      }
    };
    fetchExistingTables();
  }, [shopId]);

  // Manual creation
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualTableName) return;
    if (existingTables.some((t) => t.tableNumber === manualTableName)) {
      setError(`Table "${manualTableName}" already exists.`);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const qrIdentifier = uuidv4();
      const newTable = { tableNumber: manualTableName, qrIdentifier };
      await createTablesForShop(shopId, newTable);
      setManualTableName("");
      setSuccessMessage(`QR for "${manualTableName}" created successfully!`);
      setGeneratedQRs((prev) => [newTable, ...prev]);
      setExistingTables((prev) => [newTable, ...prev]);
      dispatch(fetchShopData(shopId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create QR code.");
    } finally {
      setLoading(false);
    }
  };

  // Bulk creation
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!start || !end || isNaN(start) || isNaN(end) || parseInt(start) > parseInt(end)) {
      setError("Invalid start/end numbers.");
      return;
    }

    const tablesToCreate = [];
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      const tableNum = prefix ? `${prefix}${i}` : `${i}`;
      if (!existingTables.some((t) => t.tableNumber === tableNum)) {
        tablesToCreate.push({ tableNumber: tableNum, qrIdentifier: uuidv4() });
      }
    }

    if (tablesToCreate.length === 0) {
      setError("No new tables to create.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await createTablesForShop(shopId, { tableNumbers: tablesToCreate });
      setPrefix("");
      setStart("");
      setEnd("");
      setSuccessMessage(`${tablesToCreate.length} QR codes created successfully!`);
      setGeneratedQRs((prev) => [...tablesToCreate, ...prev]);
      setExistingTables((prev) => [...tablesToCreate, ...prev]);
      dispatch(fetchShopData(shopId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create QR codes.");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (qrIdentifier) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await deleteTable(shopId, qrIdentifier);
      setGeneratedQRs((prev) => prev.filter((t) => t.qrIdentifier !== qrIdentifier));
      setExistingTables((prev) => prev.filter((t) => t.qrIdentifier !== qrIdentifier));
      setSuccessMessage("Table deleted successfully.");
      dispatch(fetchShopData(shopId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete table.");
    }
  };

  // Download
  const handleDownloadTemplate = async (table) => {
    const element = document.getElementById(`qr-template-${table.qrIdentifier}`);
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#fff", scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `Table-${table.tableNumber}.png`;
    link.click();
  };

  // Print
  const handlePrintTemplate = async (table) => {
    const element = document.getElementById(`qr-template-${table.qrIdentifier}`);
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#fff", scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Print QR</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
        <img src="${dataUrl}" style="width:300px"/>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="bg-white space-y-10 p-6 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-[#B4161B] border-b-2 border-gray-200 pb-2">
        Table & QR Management
      </h2>

      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
      {successMessage && <p className="text-green-700 font-medium text-center">{successMessage}</p>}

      {/* Manual QR */}
      <div className="bg-[#fffafa] rounded-xl shadow-md border border-[#B4161B]/20 p-6">
        <h3 className="text-xl font-semibold text-[#B4161B] mb-3">Create One QR Code</h3>
        <form onSubmit={handleManualSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={manualTableName}
            onChange={(e) => setManualTableName(e.target.value)}
            placeholder="Table Name/Number"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#B4161B]/70 text-gray-700 flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B4161B] hover:bg-[#D92A2A] text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all disabled:opacity-60"
          >
            {loading ? "Creating..." : "Generate QR"}
          </button>
        </form>
      </div>

      {/* Bulk QR */}
      <div className="bg-[#fffafa] rounded-xl shadow-md border border-[#B4161B]/20 p-6">
        <h3 className="text-xl font-semibold text-[#B4161B] mb-3">Generate Multiple QRs</h3>
        <form
          onSubmit={handleBulkSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="text-sm font-semibold text-gray-700">Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-[#B4161B]/70 text-gray-700"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Start</label>
            <input
              type="number"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-[#B4161B]/70 text-gray-700"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">End</label>
            <input
              type="number"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-[#B4161B]/70 text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B4161B] hover:bg-[#D92A2A] text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all disabled:opacity-60"
          >
            {loading ? "Generating..." : "Bulk Generate"}
          </button>
        </form>
      </div>

      {/* Display QR Codes */}
      {generatedQRs.length > 0 && (
        <div className="bg-gray-50 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#B4161B] mb-4">
            Generated QR Codes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {generatedQRs.map((table) => (
              <div
                key={table.qrIdentifier}
                className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
              >
                <p className="font-semibold text-[#B4161B] mb-2">{table.tableNumber}</p>

                {/* Branded QR Template */}
                <div
                  id={`qr-template-${table.qrIdentifier}`}
                  className="bg-gradient-to-b from-[#ffffff] to-[#ffffff] border border-[#B4161B]/20 rounded-lg p-4 flex flex-col items-center"
                >
                  <img
                    src="/MENUMATE real logo.png"
                    alt="Logo"
                    className="w-20 mb-2"
                  />
                  <QRCode
                    value={`${window.location.origin}/menu/${table.qrIdentifier}`}
                    size={150}
                  />
                  <p className="text-sm font-bold mt-2 text-gray-800">
                    Table {table.tableNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Powered by MenuMate
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDownloadTemplate(table)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handlePrintTemplate(table)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(table.qrIdentifier)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
