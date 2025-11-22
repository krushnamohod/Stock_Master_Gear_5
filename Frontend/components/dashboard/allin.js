import React, { useState, createContext, useContext } from 'react';
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, Plus, X, Save, FileText, Clock, CheckCircle, XCircle, MoreVertical, TrendingUp, Activity } from 'lucide-react';

// Context for managing global state
const StockContext = createContext();

const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error('useStock must be used within StockProvider');
  return context;
};

// Initial Data
const initialProducts = [
  { id: 'P001', name: 'Steel Rods', sku: 'SR-001', category: 'Electronics', stock: 150, location: 'Warehouse A', minStock: 50 },
  { id: 'P002', name: 'Office Chair', sku: 'OC-002', category: 'Furniture', stock: 25, location: 'Warehouse B', minStock: 10 },
  { id: 'P003', name: 'Laptop Charger', sku: 'LC-003', category: 'Accessories', stock: 8, location: 'Warehouse A', minStock: 20 },
  { id: 'P004', name: 'Notebooks', sku: 'NB-004', category: 'Stationery', stock: 200, location: 'Warehouse C', minStock: 100 },
];

const initialReceipts = [
  { id: 'WH/IN/0001', from: 'Supplier ABC', date: '2025-11-20', incharge: 'John Doe', status: 'done', items: [{ productId: 'P001', quantity: 50 }] },
  { id: 'WH/IN/0002', from: 'Vendor XYZ', date: '2025-11-22', incharge: 'John Doe', status: 'ready', items: [{ productId: 'P002', quantity: 10 }] },
];

const initialDeliveries = [
  { id: 'WH/OUT/0001', from: 'Warehouse A', to: 'Customer Site', contact: '555-1234', date: '2025-11-21', incharge: 'John Doe', status: 'done', type: 'Delivery Orders (Outgoing Stock)', items: [{ productId: 'P001', quantity: 20 }] },
  { id: 'WH/OUT/0002', from: 'Warehouse B', to: 'Retail Store', contact: '555-5678', date: '2025-11-23', incharge: 'John Doe', status: 'waiting', type: 'Delivery Orders (Outgoing Stock)', items: [{ productId: 'P002', quantity: 5 }] },
];

// StockProvider Component
function StockProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [currentUser] = useState('John Doe');

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `P${String(products.length + 1).padStart(3, '0')}`,
    };
    setProducts([...products, newProduct]);
  };

  const addReceipt = (receipt) => {
    const newReceipt = {
      ...receipt,
      id: `WH/IN/${String(receipts.length + 1).padStart(4, '0')}`,
    };
    setReceipts([...receipts, newReceipt]);
  };

  const addDelivery = (delivery) => {
    const newDelivery = {
      ...delivery,
      id: `WH/OUT/${String(deliveries.length + 1).padStart(4, '0')}`,
    };
    setDeliveries([...deliveries, newDelivery]);
  };

  const updateReceiptStatus = (id, status) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, status } : r));
  };

  const updateDeliveryStatus = (id, status) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status } : d));
  };

  const stats = {
    totalProducts: products.length,
    lowStockCount: products.filter(p => p.stock < p.minStock).length,
    pendingDeliveries: deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * 50), 0),
  };

  return (
    <StockContext.Provider value={{
      products,
      receipts,
      deliveries,
      currentUser,
      stats,
      addProduct,
      addReceipt,
      addDelivery,
      updateReceiptStatus,
      updateDeliveryStatus,
    }}>
      {children}
    </StockContext.Provider>
  );
}

// KPI Card Component
function KPICard({ title, value, icon: Icon, alert, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-6 shadow-sm transition-all hover:shadow-md cursor-pointer ${
        alert ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium tracking-tight text-slate-500">{title}</h3>
        <Icon className={`h-4 w-4 ${alert ? 'text-red-500' : 'text-slate-500'}`} />
      </div>
      <div className="flex items-baseline space-x-2">
        <div className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-slate-900'}`}>
          {value}
        </div>
      </div>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    ready: 'bg-blue-100 text-blue-700',
    waiting: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// New Product Modal
function NewProductModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    stock: 0,
    location: '',
    minStock: 10,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: '', sku: '', category: 'Electronics', stock: 0, location: '', minStock: 10 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">New Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input
              required
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input
              required
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Accessories</option>
              <option>Stationery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
            <input
              required
              type="number"
              min="0"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              required
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// New Receipt Modal
function NewReceiptModal({ isOpen, onClose, onSave }) {
  const { products, currentUser, addProduct } = useStock();
  const [formData, setFormData] = useState({
    from: '',
    date: new Date().toISOString().split('T')[0],
    incharge: currentUser,
    items: [{ productId: '', quantity: 0 }],
  });
  const [showProductModal, setShowProductModal] = useState(false);

  const handleSubmit = (status) => {
    if (!formData.from || formData.items.some(item => !item.productId || item.quantity <= 0)) {
      alert('Please fill all required fields');
      return;
    }
    onSave({ ...formData, status });
    setFormData({ from: '', date: new Date().toISOString().split('T')[0], incharge: currentUser, items: [{ productId: '', quantity: 0 }] });
    onClose();
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 0 }] });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">New Stock Receipt</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Receive From (Location)</label>
                <input
                  required
                  type="text"
                  placeholder="Supplier name or location"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
                <input
                  required
                  type="date"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Incharge</label>
              <input
                readOnly
                type="text"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-slate-50"
                value={formData.incharge}
              />
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Product Details</h3>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  + New Product
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <select
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  >
                    <option value="">-- Select Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('ready')}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Mark as Ready
              </button>
            </div>
          </div>
        </div>
      </div>
      <NewProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={addProduct}
      />
    </>
  );
}

// New Delivery Modal
function NewDeliveryModal({ isOpen, onClose, onSave }) {
  const { products, currentUser, addProduct } = useStock();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    incharge: currentUser,
    type: 'Delivery Orders (Outgoing Stock)',
    items: [{ productId: '', quantity: 0 }],
  });
  const [showProductModal, setShowProductModal] = useState(false);

  const handleSubmit = (status) => {
    if (!formData.from || !formData.to || !formData.contact || formData.items.some(item => !item.productId || item.quantity <= 0)) {
      alert('Please fill all required fields');
      return;
    }
    onSave({ ...formData, status });
    setFormData({
      from: '',
      to: '',
      contact: '',
      date: new Date().toISOString().split('T')[0],
      incharge: currentUser,
      type: 'Delivery Orders (Outgoing Stock)',
      items: [{ productId: '', quantity: 0 }],
    });
    onClose();
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 0 }] });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">New Delivery Order</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">From (Location)</label>
                <input
                  required
                  type="text"
                  placeholder="Warehouse location"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To (Delivery Address)</label>
                <input
                  required
                  type="text"
                  placeholder="Destination address"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Details</label>
                <input
                  required
                  type="text"
                  placeholder="Phone or email"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
                <input
                  required
                  type="date"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Incharge</label>
              <input
                readOnly
                type="text"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-slate-50"
                value={formData.incharge}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Operation Type</label>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Receipts (Incoming Stock)</option>
                <option>Delivery Orders (Outgoing Stock)</option>
                <option>Inventory Adjustment</option>
              </select>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Product Details</h3>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  + New Product
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <select
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  >
                    <option value="">-- Select Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('ready')}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Mark as Ready
              </button>
            </div>
          </div>
        </div>
      </div>
      <NewProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={addProduct}
      />
    </>
  );
}

// Receipts Tab View
function ReceiptsView() {
  const { receipts, updateReceiptStatus } = useStock();
  const [showModal, setShowModal] = useState(false);
  const { addReceipt } = useStock();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Stock Receipts</h2>
          <p className="text-sm text-slate-500">Manage incoming stock operations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Receipt
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Incharge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{receipt.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{receipt.from}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{receipt.date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{receipt.incharge}</td>
                <td className="px-6 py-4"><StatusBadge status={receipt.status} /></td>
                <td className="px-6 py-4">
                  <select
                    className="text-xs border border-slate-300 rounded px-2 py-1"
                    value={receipt.status}
                    onChange={(e) => updateReceiptStatus(receipt.id, e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="ready">Ready</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewReceiptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addReceipt}
      />
    </div>
  );
}

// Deliveries Tab View
function DeliveriesView() {
  const { deliveries, updateDeliveryStatus } = useStock();
  const [showModal, setShowModal] = useState(false);
  const { addDelivery } = useStock();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Delivery Orders</h2>
          <p className="text-sm text-slate-500">Manage outgoing stock operations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Delivery
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{delivery.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{delivery.from}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{delivery.to}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{delivery.contact}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{delivery.date}</td>
                <td className="px-6 py-4"><StatusBadge status={delivery.status} /></td>
                <td className="px-6 py-4">
                  <select
                    className="text-xs border border-slate-300 rounded px-2 py-1"
                    value={delivery.status}
                    onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="waiting">Waiting</option>
                    <option value="ready">Ready</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewDeliveryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addDelivery}
      />
    </div>
  );
}

// Adjustments Tab View
function AdjustmentsView() {
  const { products } = useStock();
  const [adjustments] = useState([
    { id: 'ADJ-001', product: 'Steel Rods', quantity: -3, reason: 'Damaged', date: '2025-11-21', status: 'done' },
    { id: 'ADJ-002', product: 'Notebooks', quantity: 5, reason: 'Count correction', date: '2025-11-22', status: 'ready' },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory Adjustments</h2>
          <p className="text-sm text-slate-500">Stock corrections and adjustments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> New Adjustment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {adjustments.map((adj) => (
              <tr key={adj.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{adj.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{adj.product}</td>
                <td className={`px-6 py-4 text-sm font-medium ${adj.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{adj.reason}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{adj.date}</td>
                <td className="px-6 py-4"><StatusBadge status={adj.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Products List View
function ProductsListView() {
  const { products } = useStock();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">All Products</h2>
          <p className="text-sm text-slate-500">Complete product inventory</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.location}</td>
                <td className="px-6 py-4">
                  {product.stock < product.minStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Low Stock Items View
function LowStockView() {
  const { products } = useStock();
  const lowStockProducts = products.filter(p => p.stock < p.minStock);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Low Stock Items</h2>
          <p className="text-sm text-slate-500">Products requiring immediate attention</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Min Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Alert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {lowStockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm font-bold text-red-600">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.minStock}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.location}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Reorder Now
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Recent Activity View
function RecentActivityView() {
  const { receipts, deliveries } = useStock();
  
  const recentActivity = [
    ...receipts.slice(-3).map(r => ({ type: 'receipt', ...r })),
    ...deliveries.slice(-3).map(d => ({ type: 'delivery', ...d })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
        <p className="text-sm text-slate-500">Latest inventory movements</p>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${activity.type === 'receipt' ? 'bg-green-100' : 'bg-blue-100'}`}>
                {activity.type === 'receipt' ? (
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{activity.id}</h3>
                  <StatusBadge status={activity.status} />
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {activity.type === 'receipt' ? `From: ${activity.from}` : `To: ${activity.to}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Section View
function ChartView() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Inventory Analytics</h2>
        <p className="text-sm text-slate-500">Visual insights and trends</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock Value Trend</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="text-center text-slate-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Chart Visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="text-center text-slate-400">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Pie Chart Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const { stats } = useStock();
  const [activeTab, setActiveTab] = useState('overview');
  const [operationsSubmenu, setOperationsSubmenu] = useState('receipts');

  const renderContent = () => {
    if (activeTab === 'operations') {
      switch (operationsSubmenu) {
        case 'receipts':
          return <ReceiptsView />;
        case 'deliveries':
          return <DeliveriesView />;
        case 'adjustments':
          return <AdjustmentsView />;
        default:
          return <ReceiptsView />;
      }
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                description="In inventory"
                onClick={() => setActiveTab('products')}
              />
              <KPICard
                title="Low Stock Items"
                value={stats.lowStockCount}
                icon={AlertTriangle}
                alert={stats.lowStockCount > 0}
                description="Requires attention"
                onClick={() => setActiveTab('lowstock')}
              />
              <KPICard
                title="Total Value"
                value={`${stats.totalValue.toLocaleString()}`}
                icon={Package}
                description="Inventory Asset"
              />
              <KPICard
                title="Pending Deliveries"
                value={stats.pendingDeliveries}
                icon={ArrowUpRight}
                description="Active orders"
                onClick={() => {
                  setActiveTab('operations');
                  setOperationsSubmenu('deliveries');
                }}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
              <div className="md:col-span-4">
                <ChartView />
              </div>
              <div className="md:col-span-3">
                <RecentActivityView />
              </div>
            </div>
          </div>
        );
      case 'products':
        return <ProductsListView />;
      case 'lowstock':
        return <LowStockView />;
      case 'activity':
        return <RecentActivityView />;
      case 'charts':
        return <ChartView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">StockMaster</h1>
                <p className="text-xs text-slate-500">Inventory Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">John Doe</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab('operations');
                  setOperationsSubmenu('receipts');
                }}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'operations'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Operations
              </button>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Products
            </button>
            <button
              onClick={() => setActiveTab('lowstock')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'lowstock'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'charts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Charts
            </button>
          </div>
        </div>
      </div>

      {/* Operations Submenu */}
      {activeTab === 'operations' && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 py-2">
              <button
                onClick={() => setOperationsSubmenu('receipts')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  operationsSubmenu === 'receipts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Receipts
              </button>
              <button
                onClick={() => setOperationsSubmenu('deliveries')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  operationsSubmenu === 'deliveries'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Deliveries
              </button>
              <button
                onClick={() => setOperationsSubmenu('adjustments')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  operationsSubmenu === 'adjustments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Adjustments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

// App Component
export default function App() {
  return (
    <StockProvider>
      <Dashboard />
    </StockProvider>
  );
}