import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
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

  // Download branded QR template
  const handleDownloadTemplate = async (table) => {
    const element = document.getElementById(`qr-template-${table.qrIdentifier}`);
    if (!element) return;

    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2 });
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `Table-${table.tableNumber}.png`;
    link.click();
  };

  // Print branded QR template
  const handlePrintTemplate = async (table) => {
    const element = document.getElementById(`qr-template-${table.qrIdentifier}`);
    if (!element) return;

    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
            img { width: 300px; height: auto; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="bg-white space-y-12">
      <h2 className="text-3xl font-bold" style={{ color: "#556b2f", borderBottom: "2px solid #ccc", paddingBottom: "8px" }}>Table & QR Management</h2>
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
      {successMessage && <p className="text-green-700 font-medium text-center">{successMessage}</p>}

      {/* Manual QR */}
      <div className="bg-white rounded-2xl shadow-lg p-6" style={{ border: "1px solid #f0a500" }}>
        <h3 className="text-xl font-semibold" style={{ color: "#556b2f", marginBottom: "12px" }}>Create One QR Code</h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualTableName}
            onChange={(e) => setManualTableName(e.target.value)}
            placeholder="Table Name/Number"
            className="bg-orange-50 flex-1 border rounded-lg px-4 py-2 shadow-sm placeholder-gray-400"
            style={{ borderColor: "#f0a500" }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Generate QR"}
          </button>
        </form>
      </div>

      {/* Bulk QR */}
      <div className="bg-white rounded-2xl shadow-lg p-6" style={{ border: "1px solid #28a745" }}>
        <h3 className="text-xl font-semibold" style={{ color: "#556b2f", marginBottom: "12px" }}>Generate Multiple QR Codes</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={handleBulkSubmit}>
          <div>
            <label htmlFor="prefix" style={{ color: "#556b2f" }}>Prefix</label>
            <input
              type="text"
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border rounded-lg px-4 py-2 shadow-sm placeholder-gray-400"
              style={{ borderColor: "#f0a500" }}
            />
          </div>
          <div>
            <label htmlFor="start" style={{ color: "#556b2f" }}>Start Number</label>
            <input
              type="number"
              id="start"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border rounded-lg px-4 py-2 shadow-sm placeholder-gray-400"
              style={{ borderColor: "#f0a500" }}
              required
            />
          </div>
          <div>
            <label htmlFor="end" style={{ color: "#556b2f" }}>End Number</label>
            <input
              type="number"
              id="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="bg-orange-50 mt-1 block w-full border rounded-lg px-4 py-2 shadow-sm placeholder-gray-400"
              style={{ borderColor: "#f0a500" }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Bulk Generate"}
          </button>
        </form>
      </div>

      {/* Display QR Codes */}
      {generatedQRs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold" style={{ color: "#556b2f", marginBottom: "12px" }}>Generated QR Codes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {generatedQRs.map((table) => (
              <div
                key={table.qrIdentifier}
                className="flex flex-col items-center p-4 border rounded-xl shadow-md"
                style={{ borderColor: "#f0a500" }}
              >
                <p className="font-medium mb-2" style={{ color: "#556b2f" }}>{table.tableNumber}</p>

                {/* Branded QR Template */}
                <div
                  id={`qr-template-${table.qrIdentifier}`}
                  style={{
                    background: "radial-gradient(circle, #ffaf60, #d77000)",
                    padding: "16px",
                    borderRadius: "12px",
                    textAlign: "center",
                    width: "220px",
                    border: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src="/MENUMATE.png" alt="Logo" style={{ width: "60px", marginBottom: "12px" }} />
                  <QRCode value={`${window.location.origin}/menu/${table.qrIdentifier}`} size={150} />
                  <p style={{ marginTop: "12px", fontWeight: "bold", color: "#333" }}>Table: {table.tableNumber}</p>
                  <p style={{ fontSize: "12px", color: "#777" }}>Make Your QR With MENUMATE</p>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDownloadTemplate(table)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handlePrintTemplate(table)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(table.qrIdentifier)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
