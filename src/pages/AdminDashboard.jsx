import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  FileText,
  ChevronRight,
  LogOut,
  X,
  AlertTriangle,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  PhoneCall,
  Save,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  subscribeProducts, addProductWithGallerySync, updateProductWithGallerySync, deleteProduct, syncAllProductsToGallery,
  subscribeCategories, addCategory, deleteCategory,
  subscribeGallery, addGalleryItem, deleteGalleryItem,
  subscribeInquiries, updateInquiryStatus, deleteInquiry,
  subscribeWebsiteSettings, updateWebsiteSettings,
  subscribePageContent, updatePageContent
} from '../firebase/db';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';

// ─── Custom Confirm Modal ────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel, isDestructive = true }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-stone-100 animate-fade-in">
        <div className={`flex items-center justify-center h-14 w-14 rounded-full mx-auto mb-4 ${isDestructive ? 'bg-red-50' : 'bg-amber-50'}`}>
          <AlertTriangle size={26} className={isDestructive ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-800 text-center mb-2">Are you sure?</h3>
        <p className="text-sm text-stone-500 text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold transition-all ${type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      {message}
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm modal state
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }
  // Toast state
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => setToast({ message, type });
  const showConfirm = (message, onConfirm) => setConfirm({ message, onConfirm });

  // Real-time states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettings] = useState(null);
  const [pageContentHome, setPageContentHome] = useState(null);
  const [homeContentForm, setHomeContentForm] = useState(null);

  // Modal / Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', category: '', mainImage: '', specs: {}, featured: false });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Category Form State
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });

  // Gallery Form State
  const [newGallery, setNewGallery] = useState({ title: '', category: '', imageUrl: '' });

  // Load subscriptions
  useEffect(() => {
    const unsubProducts = subscribeProducts(setProducts);
    const unsubCategories = subscribeCategories(setCategories);
    const unsubGallery = subscribeGallery(setGallery);
    const unsubInquiries = subscribeInquiries(setInquiries);
    const unsubSettings = subscribeWebsiteSettings(setSettings);
    const unsubPageHome = subscribePageContent('home', (data) => {
      setPageContentHome(data);
      if (!homeContentForm && data) setHomeContentForm(data);
    });

    // Auto-sync all existing products to gallery on first load (skips already-synced ones)
    syncAllProductsToGallery().then(count => {
      if (count > 0) console.log(`[Gallery Sync] Synced ${count} existing product(s) to gallery.`);
    }).catch(err => console.warn('[Gallery Sync] Error:', err));

    return () => { unsubProducts(); unsubCategories(); unsubGallery(); unsubInquiries(); unsubSettings(); unsubPageHome(); };
  }, []);

  // Clear selections on tab switch
  useEffect(() => { setSelectedIds([]); }, [activeTab]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0 || isProcessing) return;
    showConfirm(`This will permanently delete ${selectedIds.length} item(s). This action cannot be undone.`, async () => {
      setConfirm(null);
      setIsProcessing(true);
      try {
        if (activeTab === 'products') await Promise.all(selectedIds.map(id => deleteProduct(id)));
        else if (activeTab === 'categories') await Promise.all(selectedIds.map(id => deleteCategory(id)));
        else if (activeTab === 'gallery') await Promise.all(selectedIds.map(id => deleteGalleryItem(id)));
        else if (activeTab === 'inquiries') await Promise.all(selectedIds.map(id => deleteInquiry(id)));
        setSelectedIds([]);
        showToast(`${selectedIds.length} item(s) deleted successfully`);
      } catch (err) {
        console.error(err);
        showToast('Failed to delete some items', 'error');
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/'); } catch (e) { console.error(e); }
  };

  // ─── Product CRUD ─────────────────────────────────────────────────────────
  const resetProductForm = () => {
    setProductForm({ name: '', description: '', category: categories[0]?.name || '', mainImage: '', specs: {}, featured: false });
    setEditingProduct(null);
    setNewSpecKey(''); setNewSpecValue('');
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({ name: prod.name, description: prod.description || '', category: prod.category, mainImage: prod.mainImage || '', specs: prod.specs || {}, featured: prod.featured || false });
    setShowProductModal(true);
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim()) return;
    setProductForm(prev => ({ ...prev, specs: { ...prev.specs, [newSpecKey.trim()]: newSpecValue.trim() } }));
    setNewSpecKey(''); setNewSpecValue('');
  };

  const handleRemoveSpec = (key) => {
    const updated = { ...productForm.specs };
    delete updated[key];
    setProductForm(prev => ({ ...prev, specs: updated }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!productForm.name || !productForm.category) { showToast('Name and Category are required', 'error'); return; }
    setIsProcessing(true);
    try {
      if (editingProduct) await updateProductWithGallerySync(editingProduct.id, productForm);
      else await addProductWithGallerySync(productForm);
      setShowProductModal(false);
      resetProductForm();
      showToast(editingProduct ? 'Product updated!' : 'Product added!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save product', 'error');
    } finally { setIsProcessing(false); }
  };

  const handleDeleteProductClick = (id) => {
    if (isProcessing) return;
    showConfirm('This will permanently remove this product from your catalog.', async () => {
      setConfirm(null);
      setIsProcessing(true);
      try { await deleteProduct(id); showToast('Product deleted'); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
    });
  };

  // ─── Category CRUD ────────────────────────────────────────────────────────
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (isProcessing || !newCategory.name) return;
    setIsProcessing(true);
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    try {
      await addCategory(id, newCategory);
      setNewCategory({ name: '', description: '', image: '' });
      showToast('Category created!');
    } catch (err) { console.error(err); showToast('Failed to create category', 'error'); }
    finally { setIsProcessing(false); }
  };

  const handleDeleteCategory = (id) => {
    if (isProcessing) return;
    showConfirm('This will delete this category. Products linked to it may lose their category filter.', async () => {
      setConfirm(null);
      setIsProcessing(true);
      try { await deleteCategory(id); showToast('Category deleted'); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
    });
  };

  // ─── Gallery CRUD ─────────────────────────────────────────────────────────
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (isProcessing || !newGallery.imageUrl) return;
    setIsProcessing(true);
    try {
      await addGalleryItem(newGallery);
      setNewGallery({ title: '', category: categories[0]?.name || '', imageUrl: '' });
      showToast('Photo uploaded!');
    } catch (err) { console.error(err); showToast('Failed to upload photo', 'error'); }
    finally { setIsProcessing(false); }
  };

  const handleDeleteGallery = (id) => {
    if (isProcessing) return;
    showConfirm('This will permanently remove this image from the gallery.', async () => {
      setConfirm(null);
      setIsProcessing(true);
      try { await deleteGalleryItem(id); showToast('Image deleted'); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
    });
  };

  // ─── Inquiry management ───────────────────────────────────────────────────
  const handleInquiryStatusChange = async (id, status) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try { await updateInquiryStatus(id, status); showToast('Status updated'); } catch (err) { console.error(err); }
    finally { setIsProcessing(false); }
  };

  const handleDeleteInquiryClick = (id) => {
    if (isProcessing) return;
    showConfirm('This will permanently delete this inquiry record.', async () => {
      setConfirm(null);
      setIsProcessing(true);
      try { await deleteInquiry(id); showToast('Inquiry deleted'); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
    });
  };

  // ─── Settings ─────────────────────────────────────────────────────────────
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    try { await updateWebsiteSettings(settings); showToast('Settings saved successfully!'); } catch (err) { console.error(err); showToast('Failed to update settings', 'error'); }
    finally { setIsProcessing(false); }
  };

  // ─── Page Content ─────────────────────────────────────────────────────────
  const handlePageContentSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing || !homeContentForm) return;
    setIsProcessing(true);
    try { await updatePageContent('home', homeContentForm); showToast('Page Content saved successfully!'); } catch (err) { console.error(err); showToast('Failed to update content', 'error'); }
    finally { setIsProcessing(false); }
  };

  // ─── Shared UI helpers ────────────────────────────────────────────────────
  const inputCls = "w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-800 outline-none focus:border-brand-wood focus:bg-white focus:ring-2 focus:ring-brand-wood/10 transition-all";
  const labelCls = "block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider";

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={18} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'pages', label: 'Pages', icon: <FileText size={18} /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} />, badge: inquiries.filter(i => i.status === 'new').length },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const BulkBar = ({ list }) => selectedIds.length > 0 ? (
    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
      <span className="text-sm font-semibold text-red-700">{selectedIds.length} selected</span>
      <button onClick={handleBulkDelete} disabled={isProcessing}
        className="flex items-center gap-1.5 rounded-lg bg-red-500 text-white px-4 py-1.5 text-xs font-bold hover:bg-red-600 transition-colors shadow-sm">
        <Trash2 size={13} /> Delete All
      </button>
      <button onClick={() => setSelectedIds([])} className="text-xs text-red-400 hover:text-red-600 font-semibold ml-auto">Clear</button>
    </div>
  ) : null;

  const PageHeader = ({ title, subtitle, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-800">{title}</h2>
        <p className="text-sm text-stone-400 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );

  const TableWrapper = ({ children }) => (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );

  const Th = ({ children, center }) => (
    <th className={`px-5 py-3.5 text-[11px] uppercase font-bold tracking-wider text-stone-400 ${center ? 'text-center' : 'text-left'}`}>{children}</th>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F4F2]">

      {/* ── Confirm Modal ─────────────────────────────────────────────── */}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#160C05] to-[#1E1209] text-white shrink-0 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center px-5 pt-7 pb-6 border-b border-white/5">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/30">
              <img src="/logo-white.png" alt="K K Moulding" className="h-16 w-auto object-contain" />
            </div>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1 mt-2">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25'
                    : 'text-white/45 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-[#D4AF37]' : 'text-white/35'}>{tab.icon}</span>
                <span className="tracking-wide">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="text-center mb-3">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">K K Moulding Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 py-3 text-xs font-bold uppercase tracking-wider text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div>
              <PageHeader title="Dashboard Overview" subtitle="Real-time summary of your K K Moulding store." />

              {/* Stat Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {[
                  { label: 'Total Products', value: products.length, icon: <Package size={20} />, color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
                  { label: 'Categories', value: categories.length, icon: <Layers size={20} />, color: 'from-violet-500 to-violet-600', light: 'bg-violet-50 text-violet-600' },
                  { label: 'Gallery Photos', value: gallery.length, icon: <ImageIcon size={20} />, color: 'from-teal-500 to-teal-600', light: 'bg-teal-50 text-teal-600' },
                  { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: <MessageSquare size={20} />, color: 'from-amber-500 to-orange-500', light: 'bg-amber-50 text-amber-600' },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${card.light} shrink-0`}>{card.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{card.label}</p>
                      <p className="text-3xl font-bold text-stone-800 mt-0.5 leading-none">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Inquiries */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-stone-50">
                  <h3 className="font-serif text-lg font-bold text-stone-800">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs font-bold text-brand-wood hover:text-brand-dark flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                {inquiries.length === 0 ? (
                  <div className="p-12 text-center text-stone-400">
                    <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No customer inquiries yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        <Th>Customer</Th><Th>Phone</Th><Th>Message</Th><Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-stone-700">{inq.name}</td>
                          <td className="px-5 py-4 text-xs text-stone-500">{inq.phone}</td>
                          <td className="px-5 py-4 text-xs text-stone-400 line-clamp-1 max-w-xs">{inq.message}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                              inq.status === 'new' ? 'bg-amber-100 text-amber-700' :
                              inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>{inq.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: PRODUCTS ────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div>
              <PageHeader title="Product Catalog" subtitle="Add, edit and manage your wooden moulding products.">
                <div className="flex items-center gap-3">
                  <BulkBar />
                  <button
                    onClick={() => { resetProductForm(); setShowProductModal(true); }}
                    className="flex items-center gap-2 rounded-xl bg-brand-wood px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-dark transition-colors"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </PageHeader>

              <TableWrapper>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="px-5 py-3.5 w-10 text-center">
                        <input type="checkbox"
                          checked={products.length > 0 && selectedIds.length === products.length}
                          onChange={(e) => { if (e.target.checked) setSelectedIds(products.map(p => p.id)); else setSelectedIds([]); }}
                          className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                      </th>
                      <Th>Product</Th><Th>Category</Th><Th center>Status</Th><Th center>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map((prod) => (
                      <tr key={prod.id} className={`hover:bg-stone-50/60 transition-colors ${selectedIds.includes(prod.id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-5 py-4 text-center">
                          <input type="checkbox" checked={selectedIds.includes(prod.id)} onChange={() => toggleSelection(prod.id)}
                            className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={prod.mainImage} alt="" className="h-11 w-11 object-cover rounded-xl border border-stone-100 shadow-sm shrink-0" />
                            <span className="font-semibold text-stone-800 line-clamp-1">{prod.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">{prod.category}</span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {prod.featured ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                              <Star size={10} /> Featured
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-stone-400">Standard</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditProductClick(prod)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 transition-colors" title="Edit">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDeleteProductClick(prod.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-16 text-center text-stone-400">
                        <Package size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No products yet. Add your first product!</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </TableWrapper>

              {/* Product Modal */}
              {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-stone-100">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100 bg-stone-50/60 rounded-t-2xl">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-stone-800">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5">{editingProduct ? editingProduct.name : 'Fill in the details to add a new product.'}</p>
                      </div>
                      <button onClick={() => setShowProductModal(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="p-6 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Product Name *</label>
                          <input type="text" required value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className={inputCls} placeholder="E.g. Solid Teak Main Door" />
                        </div>
                        <div>
                          <label className={labelCls}>Category *</label>
                          <select value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className={inputCls}>
                            {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                          </select>
                        </div>
                      </div>

                      <ImageUploader label="Product Image" currentImage={productForm.mainImage}
                        onUpload={(url) => setProductForm({ ...productForm, mainImage: url })} />

                      <div>
                        <label className={labelCls}>Description</label>
                        <textarea rows={3} value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className={inputCls + ' resize-none'} placeholder="Brief product description..." />
                      </div>

                      {/* Specs */}
                      <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                        <label className={labelCls}>Technical Specifications</label>
                        <div className="space-y-2 mb-3">
                          {Object.entries(productForm.specs).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-stone-100 text-xs">
                              <span className="font-semibold text-stone-600">{k}: <span className="text-stone-400 font-normal">{v}</span></span>
                              <button type="button" onClick={() => handleRemoveSpec(k)} className="text-red-400 hover:text-red-600 font-bold text-xs">Remove</button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input type="text" placeholder="Key (e.g. Material)" value={newSpecKey}
                            onChange={(e) => setNewSpecKey(e.target.value)} className={inputCls} />
                          <input type="text" placeholder="Value (e.g. Teak)" value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)} className={inputCls} />
                          <button type="button" onClick={handleAddSpec}
                            className="rounded-xl bg-brand-wood/10 border border-brand-wood/20 text-brand-wood text-xs font-bold py-2 px-4 hover:bg-brand-wood hover:text-white transition-colors">
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Featured */}
                      <label className="flex items-center gap-3 cursor-pointer group bg-stone-50 p-3.5 rounded-xl border border-stone-100 hover:bg-amber-50/50 transition-colors">
                        <input type="checkbox" id="featured" checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="rounded border-stone-300 accent-amber-500 h-4 w-4" />
                        <div>
                          <p className="text-sm font-semibold text-stone-700">Feature on Home Page</p>
                          <p className="text-xs text-stone-400">This product will appear in the featured section.</p>
                        </div>
                        <Star size={16} className="ml-auto text-amber-400 opacity-60" />
                      </label>

                      <div className="pt-2 flex justify-end gap-3 border-t border-stone-100">
                        <button type="button" onClick={() => setShowProductModal(false)}
                          className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
                          Cancel
                        </button>
                        <button type="submit" disabled={isProcessing}
                          className={`rounded-xl px-6 py-2.5 text-sm font-bold text-white flex items-center gap-2 transition-colors ${isProcessing ? 'bg-brand-wood/50 cursor-not-allowed' : 'bg-brand-wood hover:bg-brand-dark'}`}>
                          <Save size={15} />
                          {isProcessing ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: CATEGORIES ──────────────────────────────────────── */}
          {activeTab === 'categories' && (
            <div>
              <PageHeader title="Category Manager" subtitle="Organise your product catalog into categories." />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Form */}
                <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-stone-800 mb-1">Create Category</h3>
                  <div>
                    <label className={labelCls}>Category Name</label>
                    <input type="text" required placeholder="E.g. Custom Wooden Work" value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className={inputCls} />
                  </div>
                  <ImageUploader label="Category Image" currentImage={newCategory.image}
                    onUpload={(url) => setNewCategory({ ...newCategory, image: url })} />
                  <div>
                    <label className={labelCls}>Brief Description</label>
                    <textarea rows={3} placeholder="Short description..." value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className={inputCls + ' resize-none'} />
                  </div>
                  <button type="submit" disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow transition-colors ${isProcessing ? 'bg-brand-wood/50 cursor-not-allowed' : 'bg-brand-wood hover:bg-brand-dark'}`}>
                    <Plus size={16} />{isProcessing ? 'Adding...' : 'Create Category'}
                  </button>
                </form>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <BulkBar />
                  <TableWrapper>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-100">
                          <th className="px-5 py-3.5 w-10 text-center">
                            <input type="checkbox"
                              checked={categories.length > 0 && selectedIds.length === categories.length}
                              onChange={(e) => { if (e.target.checked) setSelectedIds(categories.map(c => c.id)); else setSelectedIds([]); }}
                              className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                          </th>
                          <Th>Category</Th><Th>Description</Th><Th center>Delete</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {categories.map((cat) => (
                          <tr key={cat.id} className={`hover:bg-stone-50/60 transition-colors ${selectedIds.includes(cat.id) ? 'bg-amber-50/30' : ''}`}>
                            <td className="px-5 py-4 text-center">
                              <input type="checkbox" checked={selectedIds.includes(cat.id)} onChange={() => toggleSelection(cat.id)}
                                className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={cat.image} alt="" className="h-10 w-10 object-cover rounded-xl border border-stone-100 shadow-sm shrink-0" />
                                <span className="font-semibold text-stone-800">{cat.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-stone-400 max-w-xs truncate">{cat.description}</td>
                            <td className="px-5 py-4 text-center">
                              <button onClick={() => handleDeleteCategory(cat.id)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mx-auto">
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {categories.length === 0 && (
                          <tr><td colSpan={4} className="px-5 py-12 text-center text-stone-400 text-sm">No categories yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </TableWrapper>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: GALLERY ─────────────────────────────────────────── */}
          {activeTab === 'gallery' && (
            <div>
              <PageHeader title="Gallery Manager" subtitle="Upload installation & design photos for the public gallery." />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Form */}
                <form onSubmit={handleGallerySubmit} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-stone-800 mb-1">Add Photo</h3>
                  <div>
                    <label className={labelCls}>Image Title</label>
                    <input type="text" required placeholder="E.g. Oak Wall Fluted Panel" value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })} className={inputCls} />
                  </div>
                  <ImageUploader label="Upload Image" currentImage={newGallery.imageUrl}
                    onUpload={(url) => setNewGallery({ ...newGallery, imageUrl: url })} />
                  <div>
                    <label className={labelCls}>Link Category</label>
                    <select value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })} className={inputCls}>
                      {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                    </select>
                  </div>
                  <button type="submit" disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow transition-colors ${isProcessing ? 'bg-brand-wood/50 cursor-not-allowed' : 'bg-brand-wood hover:bg-brand-dark'}`}>
                    <Plus size={16} />{isProcessing ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </form>

                {/* Gallery Grid */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center bg-white px-5 py-3 rounded-2xl border border-stone-100 shadow-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-600">
                      <input type="checkbox"
                        checked={gallery.length > 0 && selectedIds.length === gallery.length}
                        onChange={(e) => { if (e.target.checked) setSelectedIds(gallery.map(g => g.id)); else setSelectedIds([]); }}
                        className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" id="selectAllGallery" />
                      <span>Select All</span>
                    </label>
                    <BulkBar />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <div key={item.id} className={`relative group h-44 overflow-hidden rounded-2xl shadow-sm border-2 transition-all ${selectedIds.includes(item.id) ? 'border-brand-wood ring-2 ring-brand-wood/30' : 'border-transparent'}`}>
                        <div className="absolute top-2 left-2 z-20">
                          <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)}
                            className="cursor-pointer h-4 w-4 rounded border-white/70 accent-brand-wood bg-white/80 shadow" />
                        </div>
                        <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                          <button onClick={() => handleDeleteGallery(item.id)}
                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold truncate">{item.category}</p>
                            {item.source === 'product' && (
                              <span className="shrink-0 bg-blue-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Auto</span>
                            )}
                          </div>
                          <p className="text-xs text-white font-medium truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                    {gallery.length === 0 && (
                      <div className="col-span-3 py-16 text-center text-stone-400">
                        <ImageIcon size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No images yet. Upload your first photo!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: PAGES ─────────────────────────────────────────────── */}
          {activeTab === 'pages' && (
            <div>
              <PageHeader title="Page Content" subtitle="Edit text and images on your public website pages." />
              {homeContentForm ? (
                <form onSubmit={handlePageContentSubmit} className="space-y-8 max-w-4xl">
                  
                  {/* Home Hero Section */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-3">Home Page - Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Hero Title</label>
                        <input type="text" value={homeContentForm.hero.title} onChange={(e) => setHomeContentForm({...homeContentForm, hero: {...homeContentForm.hero, title: e.target.value}})} className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Hero Subtitle</label>
                        <input type="text" value={homeContentForm.hero.subtitle} onChange={(e) => setHomeContentForm({...homeContentForm, hero: {...homeContentForm.hero, subtitle: e.target.value}})} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Top Tag / Location</label>
                        <input type="text" value={homeContentForm.hero.tag} onChange={(e) => setHomeContentForm({...homeContentForm, hero: {...homeContentForm.hero, tag: e.target.value}})} className={inputCls} />
                      </div>
                      <ImageUploader label="Hero Background Image" currentImage={homeContentForm.hero.backgroundImage} onUpload={(url) => setHomeContentForm({...homeContentForm, hero: {...homeContentForm.hero, backgroundImage: url}})} />
                    </div>
                  </div>

                  {/* Home About Snippet Section */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-3">Home Page - About Snippet</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Tag</label>
                          <input type="text" value={homeContentForm.aboutSnippet.tag} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, tag: e.target.value}})} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Years of Experience</label>
                          <input type="text" value={homeContentForm.aboutSnippet.yearsOfExperience} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, yearsOfExperience: e.target.value}})} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Main Title</label>
                        <input type="text" value={homeContentForm.aboutSnippet.title} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, title: e.target.value}})} className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Paragraph 1</label>
                        <textarea rows={3} value={homeContentForm.aboutSnippet.paragraph1} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, paragraph1: e.target.value}})} className={inputCls + ' resize-none'} />
                      </div>
                      <div>
                        <label className={labelCls}>Paragraph 2</label>
                        <textarea rows={3} value={homeContentForm.aboutSnippet.paragraph2} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, paragraph2: e.target.value}})} className={inputCls + ' resize-none'} />
                      </div>
                      <div>
                        <label className={labelCls}>Paragraph 3</label>
                        <textarea rows={3} value={homeContentForm.aboutSnippet.paragraph3} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, paragraph3: e.target.value}})} className={inputCls + ' resize-none'} />
                      </div>
                      <div>
                        <label className={labelCls}>Paragraph 4</label>
                        <textarea rows={3} value={homeContentForm.aboutSnippet.paragraph4} onChange={(e) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, paragraph4: e.target.value}})} className={inputCls + ' resize-none'} />
                      </div>
                      <ImageUploader label="About Snippet Image" currentImage={homeContentForm.aboutSnippet.image} onUpload={(url) => setHomeContentForm({...homeContentForm, aboutSnippet: {...homeContentForm.aboutSnippet, image: url}})} />
                    </div>
                  </div>

                  <div className="flex justify-end sticky bottom-6 z-10 bg-white p-4 rounded-xl shadow-lg border border-stone-100">
                    <button type="submit" disabled={isProcessing} className={`px-8 py-3 rounded-xl text-sm font-bold text-white shadow flex items-center gap-2 transition-colors ${isProcessing ? 'bg-brand-wood/50 cursor-not-allowed' : 'bg-brand-wood hover:bg-brand-dark'}`}>
                      <Save size={16} /> {isProcessing ? 'Saving...' : 'Save All Page Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-12 text-center text-stone-400">Loading page content...</div>
              )}
            </div>
          )}

          {/* ── TAB 6: INQUIRIES ───────────────────────────────────────── */}
          {activeTab === 'inquiries' && (
            <div>
              <PageHeader title="Customer Inquiries" subtitle="Review and manage bulk quote requests from customers.">
                <BulkBar />
              </PageHeader>

              {inquiries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-16 text-center text-stone-400">
                  <PhoneCall size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No inquiries yet.</p>
                </div>
              ) : (
                <TableWrapper>
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        <th className="px-5 py-3.5 w-10 text-center">
                          <input type="checkbox"
                            checked={inquiries.length > 0 && selectedIds.length === inquiries.length}
                            onChange={(e) => { if (e.target.checked) setSelectedIds(inquiries.map(i => i.id)); else setSelectedIds([]); }}
                            className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                        </th>
                        <Th>Customer</Th><Th>Contact</Th><Th>Message</Th><Th>Date</Th><Th center>Status</Th><Th center>Del</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className={`hover:bg-stone-50/60 transition-colors ${selectedIds.includes(inq.id) ? 'bg-amber-50/30' : ''}`}>
                          <td className="px-5 py-4 text-center">
                            <input type="checkbox" checked={selectedIds.includes(inq.id)} onChange={() => toggleSelection(inq.id)}
                              className="cursor-pointer h-4 w-4 rounded border-stone-300 accent-brand-wood" />
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-stone-800">{inq.name}</p>
                            {inq.productName && (
                              <span className="inline-block bg-amber-50 text-amber-700 border border-amber-100 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full mt-1">
                                Ref: {inq.productName}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs text-stone-500">
                            <a href={`tel:${inq.phone}`} className="hover:text-brand-wood font-semibold block">{inq.phone}</a>
                            {inq.email && <a href={`mailto:${inq.email}`} className="hover:text-brand-wood block text-stone-400 mt-0.5">{inq.email}</a>}
                          </td>
                          <td className="px-5 py-4 text-xs text-stone-400 max-w-xs leading-relaxed">{inq.message}</td>
                          <td className="px-5 py-4 text-[11px] text-stone-400 whitespace-nowrap">{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-5 py-4 text-center">
                            <select value={inq.status || 'new'} onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold border outline-none cursor-pointer ${
                                inq.status === 'new' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                inq.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button onClick={() => handleDeleteInquiryClick(inq.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mx-auto">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrapper>
              )}
            </div>
          )}

          {/* ── TAB 6: SETTINGS ────────────────────────────────────────── */}
          {activeTab === 'settings' && settings && (
            <div className="max-w-3xl">
              <PageHeader title="Website Settings" subtitle="Update your public business info, contact details & banner text." />
              <form onSubmit={handleSettingsSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Company Name</label>
                    <input type="text" value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Showroom Phone</label>
                    <input type="text" value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>WhatsApp (Intl. format)</label>
                    <input type="text" value={settings.whatsapp} placeholder="919718503557"
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Showroom Email</label>
                    <input type="email" value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Showroom Address</label>
                  <input type="text" value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })} className={inputCls} />
                </div>

                <div className="border-t border-stone-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-wood">Home Page Banner</h4>
                  <div>
                    <label className={labelCls}>Main Heading</label>
                    <input type="text" value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subheading</label>
                    <input type="text" value={settings.subheading}
                      onChange={(e) => setSettings({ ...settings, subheading: e.target.value })} className={inputCls} />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button type="submit" disabled={isProcessing}
                    className={`flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white transition-colors ${isProcessing ? 'bg-brand-wood/50 cursor-not-allowed' : 'bg-brand-wood hover:bg-brand-dark'}`}>
                    <Save size={16} />
                    {isProcessing ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
