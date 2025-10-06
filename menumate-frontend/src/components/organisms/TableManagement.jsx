import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import { createTablesForShop, getTablesForShop, deleteTable } from "../../api/adminService";
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
    if (existingTables.some(t => t.tableNumber === manualTableName)) {
      setError(`Table number "${manualTableName}" already exists.`);
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
      setSuccessMessage(`QR code for table "${manualTableName}" created successfully!`);
      setGeneratedQRs(prev => [newTable, ...prev]);
      setExistingTables(prev => [newTable, ...prev]);
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
      if (!existingTables.some(t => t.tableNumber === tableNum)) {
        tablesToCreate.push({ tableNumber: tableNum, qrIdentifier: uuidv4() });
      }
    }
    if (tablesToCreate.length === 0) {
      setError("No new tables to create. All table numbers already exist.");
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
      setSuccessMessage(`${tablesToCreate.length} QR codes generated successfully!`);
      setGeneratedQRs(prev => [...tablesToCreate, ...prev]);
      setExistingTables(prev => [...tablesToCreate, ...prev]);
      dispatch(fetchShopData(shopId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create QR codes in bulk.");
    } finally {
      setLoading(false);
    }
  };

  // Delete table
  const handleDelete = async (qrIdentifier) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await deleteTable(shopId, qrIdentifier);
      setGeneratedQRs(prev => prev.filter(t => t.qrIdentifier !== qrIdentifier));
      setExistingTables(prev => prev.filter(t => t.qrIdentifier !== qrIdentifier));
      setSuccessMessage("Table deleted successfully.");
      dispatch(fetchShopData(shopId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete table.");
    }
  };

  // Download QR code
  const handleDownload = (qrIdentifier, tableNumber) => {
    const svg = document.getElementById(`qr-${qrIdentifier}`);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `Table-${tableNumber}.png`;
      link.click();
    };
    img.src = url;
  };

  // Print QR code
  const handlePrint = (qrIdentifier) => {
    const printWindow = window.open("", "_blank");
    const svg = document.getElementById(`qr-${qrIdentifier}`);
    if (!svg) return;
    printWindow.document.write(`<html><head><title>Print QR Code</title></head><body>${svg.outerHTML}<p>Table: ${qrIdentifier}</p></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="bg-white space-y-12">
      <h2 className="text-3xl font-bold text-olive-700 border-b border-olive-300 pb-2">Table & QR Management</h2>
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
      {successMessage && <p className="text-olive-700 font-medium text-center">{successMessage}</p>}

      {/* Manual QR */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-orange-300">
        <h3 className="text-xl font-semibold text-olive-800 mb-5">Create One QR Code</h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleManualSubmit}>
          <input type="text" value={manualTableName} onChange={(e) => setManualTableName(e.target.value)}
            placeholder="Table Name/Number"
            className="bg-orange-50 flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400"
            required />
          <button type="submit" disabled={loading} className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-olive-700 transition-all transform hover:scale-105 disabled:opacity-50">
            {loading ? "Creating..." : "Generate QR"}
          </button>
        </form>
      </div>

      {/* Bulk QR */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-green-900">
        <h3 className="text-xl font-semibold text-olive-800 mb-5">Generate Multiple QR Codes</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={handleBulkSubmit}>
          <div>
            <label htmlFor="prefix" className="block text-sm font-medium text-olive-700">Prefix</label>
            <input type="text" id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-olive-700">Start Number</label>
            <input type="number" id="start" value={start} onChange={(e) => setStart(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400" required />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-olive-700">End Number</label>
            <input type="number" id="end" value={end} onChange={(e) => setEnd(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-200 shadow-sm placeholder-gray-400" required />
          </div>
          <button type="submit" disabled={loading} className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-olive-700 transition-all transform hover:scale-105 disabled:opacity-50">
            {loading ? "Generating..." : "Bulk Generate"}
          </button>
        </form>
      </div>

      {/* Display QR Codes */}
      {generatedQRs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-olive-800 mb-5">Generated QR Codes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {generatedQRs.map((table) => (
              <div key={table.qrIdentifier} className="flex flex-col items-center p-4 border rounded-xl border-orange-300  hover:shadow-2xl transition transform hover:scale-105">
                <p className="font-medium text-olive-800 mb-2">{table.tableNumber}</p>
                <div id={`qr-${table.qrIdentifier}`} className="mb-2">
                  <QRCode value={`${window.location.origin}/menu/${table.qrIdentifier}`} size={128} />
                </div>
                <a href={`${window.location.origin}/menu/${table.qrIdentifier}`} target="_blank" rel="noopener noreferrer" className="text-olive-600 text-sm mb-2 hover:underline">Test Link</a>
                <div className="flex gap-2">
                  <button onClick={() => handleDownload(table.qrIdentifier, table.tableNumber)} className="bg-blue-500  text-white px-1 py-0 rounded hover:bg-blue-600 transition">Download</button>
                  <button onClick={() => handlePrint(table.qrIdentifier)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Print</button>
                  <button onClick={() => handleDelete(table.qrIdentifier)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
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
