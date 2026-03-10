import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import { 
  ChefHat, Package, Plus, Sparkles, Send, User, Lock, Phone, LogOut, Trash2, Calendar, 
  ShoppingCart, Settings, BookOpen, CalendarCheck, Minus, CreditCard, Truck, Wallet, CheckCircle, Save, Clock, Tag
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// --- FALLBACK CATEGORY IMAGES ---
const CATEGORY_IMAGES = {
  'Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400&q=80',
  'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
  'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
  'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
  'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
  'Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'Oils': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  'Others': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
};

// --- SMART IMAGE MAPPING (Reliable Unsplash Links) ---
const getImageForFood = (query, category) => {
  const q = query ? query.toLowerCase() : '';
  
  // --- FIX: UPDATED ORGANIC EGG IMAGE ---
  if (q.includes('egg')) return 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80';

  // Vegetables
  if (q.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80';
  if (q.includes('onion')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80';
  if (q.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80';
  if (q.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80';
  if (q.includes('spinach')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80';
  if (q.includes('broccoli')) return 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80';
  if (q.includes('capsicum') || q.includes('bell pepper')) return 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=400&q=80';
  if (q.includes('cauliflower')) return 'https://images.unsplash.com/photo-1568584711075-3d021a7c3d05?auto=format&fit=crop&w=400&q=80';
  if (q.includes('garlic')) return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80';
  if (q.includes('cucumber')) return 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80';

  // Fruits
  if (q.includes('banana')) return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80';
  if (q.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80';
  if (q.includes('orange')) return 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80';
  if (q.includes('mango')) return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80';
  if (q.includes('grape')) return 'https://images.unsplash.com/photo-1537640538965-17565236b589?auto=format&fit=crop&w=400&q=80';
  if (q.includes('watermelon')) return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80';
  if (q.includes('strawberry') || q.includes('berry')) return 'https://images.unsplash.com/photo-1464965911861-746a04b4b0ae?auto=format&fit=crop&w=400&q=80';

  // Dairy
  if (q.includes('milk')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80';
  if (q.includes('cheese')) return 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80';
  if (q.includes('butter')) return 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80';
  if (q.includes('paneer') || q.includes('cottage')) return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80';
  if (q.includes('yogurt') || q.includes('curd')) return 'https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&w=400&q=80';

  // Meat
  if (q.includes('chicken')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80';
  if (q.includes('mutton') || q.includes('lamb')) return 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=400&q=80';
  if (q.includes('fish') || q.includes('salmon')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80';

  // Grains
  if (q.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80';
  if (q.includes('dal') || q.includes('lentil')) return 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=400&q=80';
  if (q.includes('flour') || q.includes('atta')) return 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=400&q=80';
  if (q.includes('pasta')) return 'https://images.unsplash.com/photo-1612966808573-3b3260714b1e?auto=format&fit=crop&w=400&q=80';
  if (q.includes('oat')) return 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80';

  // Spices & Oils
  if (q.includes('oil')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80';
  if (q.includes('turmeric')) return 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&w=400&q=80';
  if (q.includes('salt')) return 'https://images.unsplash.com/photo-1518110925495-592540608cec?auto=format&fit=crop&w=400&q=80';
  if (q.includes('coffee')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80';
  
  // Bakery
  if (q.includes('bread')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
  if (q.includes('cookie') || q.includes('biscuit')) return 'https://images.unsplash.com/photo-1499636138143-bd630f5cf388?auto=format&fit=crop&w=400&q=80';

  // Fallback
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Others'];
};

// --- STORE DATA (EXPANDED LIST) ---
// --- FRUITS ---
  

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Bakery', 'Spices', 'Oils', 'Others'];

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); 
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('shopping'); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [cart, setCart] = useState([]);
  const [viewState, setViewState] = useState('store'); 
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentOption, setPaymentOption] = useState('card');
  const [storeFilter, setStoreFilter] = useState('All');
  const [storeProducts, setStoreProducts] = useState([]);
  useEffect(() => {
  const fetchStoreProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setStoreProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchStoreProducts();
}, []);

  const [mealPlan, setMealPlan] = useState({
    'Mon-Breakfast': 'Oatmeal',
    'Wed-Dinner': 'Chicken Curry'
  });

  const [recipes, setRecipes] = useState([
    { id: 1, title: 'Spicy Tomato Pasta', time: '20 mins', tags: ['Vegetarian', 'Easy'], image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Grilled Lemon Chicken', time: '45 mins', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80' }
  ]);

  const [dietarypref, setDietaryPref] = useState('None');

  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your AI Chef. I can see your kitchen inventory. Ask me for a recipe! 🍳' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // --- NEW STATES FOR SCANNING UI ---
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemCat, setNewItemCat] = useState('Vegetables'); 
  const [newItemDate, setNewItemDate] = useState('');
  const [aiMode, setAiMode] = useState('menu');

  // Auto-update preview image when name or category changes
  const [previewImage, setPreviewImage] = useState(getImageForFood('', 'Vegetables'));

  useEffect(() => {
    // Immediate update for responsive feel
    setPreviewImage(getImageForFood(newItemName || newItemCat, newItemCat));
  }, [newItemName, newItemCat]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchItems();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getStatus = (dateString) => {
    if (!dateString) return 'good';
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'warning';
    return 'good';
  };

  // --- ACTIONS ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product.id);
      if (existing) return prev.map(item => item._id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === productId) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = deliveryOption === 'express' ? 50 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    setViewState('success');
    setTimeout(() => {
      setCart([]);
      setViewState('store');
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, mobile, password });
      alert(res.data.message || "Registration Successful!");
      setAuthMode('login');
      setUsername(''); setMobile(''); setPassword('');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed. Check console/network.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { mobile, password }); // Debug log
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { mobile, password });
      console.log("Login success:", res.data); // Debug log
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      fetchItems();
    } catch (err) {
      console.error("Login error details:", err);
      const msg = err.response?.data?.message || err.message || "Login Failed";
      alert(`Login Failed: ${msg}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setItems([]);
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`${API_URL}/items`, {
        headers: { 'x-auth-token': token }
      });
      setItems(res.data);
    } catch (err) { 
      console.error(err); 
      if (err.response && err.response.status === 401) {
        // Token invalid/expired
        handleLogout();
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItemDate) {
      alert("Please select an expiry date.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      // Ensure specific types are sent correctly
      const payload = {
        itemName: newItemName,
        quantity: newItemQty ? Number(newItemQty) : 1, 
        unit: newItemUnit || 'kg', 
        category: newItemCat || 'Vegetables', 
        expiryDate: newItemDate
      };

      await axios.post(`${API_URL}/items/add`, payload, {
        headers: { 'x-auth-token': token }
      });
      
      setShowAddModal(false);
      fetchItems();
      // Reset form
      setNewItemName(''); 
      setNewItemQty(''); 
      setNewItemDate('');
    } catch (err) { 
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        handleLogout();
      } else {
        alert("Failed to add item: " + (err.response?.data?.msg || err.message)); 
      }
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete item?")) return;
    try { 
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/items/${id}`, {
        headers: { 'x-auth-token': token }
      }); 
      fetchItems(); 
    } catch(err){ alert("Error deleting"); }
  };

  const updateMealPlan = (day, type, value) => {
    setMealPlan(prev => ({...prev, [`${day}-${type}`]: value}));
  };

  const saveRecipeFromChat = (recipeData) => {
    // Generate AI Image for this new recipe title
    const aiImage = getImageForFood(recipeData.imageKeyword || recipeData.title, 'Others');

    const newRecipe = {
      id: Date.now(),
      title: recipeData.title,
      time: recipeData.time || 'AI Generated',
      tags: ['AI Chef'],
      image: aiImage,
      videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeData.youtubeQuery || recipeData.title)}`,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions
    };
    
    setRecipes([...recipes, newRecipe]);
    alert("Recipe Saved to your Collection!");
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);

    const inventoryList = items.map(i => `${i.name || i.itemName} (${i.quantity} ${i.unit})`).join(', ');
    const context = `Inventory: ${inventoryList}. User Preferences: ${dietarypref} diet.`;

    try {
      const res = await axios.post(`${API_URL}/chat`, { userQuery: userMsg, inventoryContext: context });
      
      const aiResponse = res.data;
      
      if (aiResponse.isRecipe) {
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: `Here is a recipe for ${aiResponse.title}`,
            recipe: aiResponse 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: aiResponse.reply || "I didn't understand that." }]);
      }

    } catch (err) {
      console.error(err);
      let errorResponse = "I'm having trouble connecting to the server.";
      if (err.response) {
          if (err.response.status === 404) errorResponse = "Error 404: Chat Route missing.";
          else if (err.response.status === 500) errorResponse = "Error 500: Backend failed.";
          else errorResponse = `Server Error: ${err.response.data?.message || "Unknown error"}`;
      } else if (err.request) {
          errorResponse = "Network Error: Cannot connect to backend.";
      }
      setMessages(prev => [...prev, { role: 'model', text: errorResponse }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- SCANNING SIMULATION FOR NEW UI ---
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedData({
        name: "Italian Paneer Pizza",
        calories: 140,
        protein: "12.2g",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60"
      });
      setIsScanning(false);
      setMessages(prev => [...prev, { role: 'model', text: "I see you found Italian Pizza! 🍕 Would you like the recipe?" }]);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-700">
          <div className="text-center mb-8">
            <img src="/ai-chef.png" alt="Chef Logo" className="w-32 h-32 mx-auto mb-6 object-contain" />
            <h1 className="text-3xl font-bold text-emerald-400">Smart Kitchen</h1>
            <p className="text-gray-400 mt-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</p>
          </div>
          <div className="flex bg-gray-700 p-1 rounded-xl mb-8">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 text-lg rounded-lg transition-all ${authMode === 'login' ? 'bg-gray-600 text-white shadow font-bold' : 'text-gray-400 hover:text-gray-200'}`}>Login</button>
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 text-lg rounded-lg transition-all ${authMode === 'register' ? 'bg-gray-600 text-white shadow font-bold' : 'text-gray-400 hover:text-gray-200'}`}>Register</button>
          </div>
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-6">
            {authMode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" size={20} />
                <input type="text" placeholder="Username" className="w-full pl-12 p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            )}
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="text" placeholder="Mobile Number" className="w-full pl-12 p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={mobile} onChange={e => setMobile(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="password" placeholder="Password" className="w-full pl-12 p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/20">
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN WEBSITE LAYOUT ---
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-gray-100">
      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-md border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
               <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
               <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent hidden sm:block">SmartKitchen</span>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavButton active={activeTab === 'shopping'} onClick={() => {setActiveTab('shopping'); setViewState('store');}} icon={<ShoppingCart size={18}/>} text="Store" />
              <NavButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Sparkles size={18}/>} text="Inventory" />
              <NavButton active={activeTab === 'meal-planner'} onClick={() => setActiveTab('meal-planner')} icon={<CalendarCheck size={18}/>} text="Plans" />
              <NavButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} icon={<BookOpen size={18}/>} text="Recipes" />
              <NavButton active={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} icon={<ChefHat size={18}/>} text="AI Chef" />
              <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Package size={18}/>} text="Dashboard" />
            </div>

            {/* Profile & Settings */}
            <div className="flex items-center gap-3">
               <button onClick={() => setActiveTab('settings')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"><Settings size={20}/></button>
               <button onClick={handleLogout} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-medium border border-red-500/20 flex items-center gap-2">
                 <LogOut size={16}/> Logout
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Header for Current View */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold capitalize text-white tracking-tight drop-shadow-md">
            {activeTab === 'shopping' ? 'Grocery Store' : activeTab.replace('-', ' ')}
          </h1>
          {activeTab === 'inventory' && (
            <button onClick={() => setShowAddModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1">
              <Plus size={22}/> Add Item
            </button>
          )}
        </div>

        {/* --- VIEW: INVENTORY --- */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {items.map(item => {
              const status = getStatus(item.expiryDate);
              const statusStyles = {
                expired: 'bg-red-500/20 text-red-400 border-red-500/50',
                warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
                good: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
              };
              
              const itemImage = getImageForFood(item.itemName, item.category);

              return (
                <div key={item._id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={itemImage} loading="lazy" alt={item.itemName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-gray-600">
                      {item.category}
                    </div>
                    <div className={`absolute bottom-2 left-2 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${statusStyles[status]}`}>
                      {status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-white leading-tight">{item.itemName}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm bg-gray-900/50 px-2 py-1 rounded-lg">
                        <Calendar size={14}/>
                        <span>{item.expiryDate ? item.expiryDate.substring(0, 10) : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-700">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Quantity</p>
                        <p className="text-xl font-bold text-white">{item.quantity} <span className="text-sm font-normal text-gray-400">{item.unit}</span></p>
                      </div>
                      <button onClick={() => handleDelete(item._id)} className="text-gray-500 hover:text-red-400 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {items.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 bg-gray-800 rounded-3xl border border-gray-700 border-dashed">
                <Sparkles size={48} className="mx-auto mb-4 opacity-20"/>
                <p className="text-xl">Your kitchen is empty.</p>
                <p className="text-sm mt-2">Click "Add Item" to stock up!</p>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: STORE --- */}
        {activeTab === 'shopping' && (
          <div className="flex flex-col gap-8">
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80" 
                    alt="Grocery" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent flex flex-col justify-center px-12">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase mb-2">Premium Groceries</span>
                    <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">Fresh From <br/>The Farm</h2>
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold w-fit hover:bg-emerald-400 hover:text-white transition-colors">Shop Now</button>
                </div>
            </div>

            {viewState === 'store' && (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 w-full">
                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setStoreFilter(cat)}
                            className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-medium border ${storeFilter === cat ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storeProducts
  .filter(item => storeFilter === 'All' || item.category === storeFilter)
  .map(product => (

                        <div key={product._id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 group">
                            <div className="h-56 overflow-hidden relative">
                                <img src={product.image_url || CATEGORY_IMAGES['Others']} loading="lazy" alt={product.name}
className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                <button onClick={() => addToCart(product)} className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-500 hover:text-white">
                                    <Plus size={24} />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-wide mb-1">{product.category}</p>
                                        <h3 className="font-bold text-xl text-white">{product.name}</h3>
                                    </div>
                                    <span className="font-bold text-white text-lg bg-gray-700 px-2 py-1 rounded-lg">₹{product.price}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-auto">Per {product.unit}</p>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-2xl sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
                        <span className="flex items-center gap-2"><ShoppingCart className="text-emerald-400"/> Your Cart</span>
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
                    </h3>
                    <div className="max-h-[50vh] overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <ShoppingCart size={48} className="mx-auto mb-3 opacity-20"/>
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-center bg-gray-700/30 p-3 rounded-2xl border border-gray-700">
                                    <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-400">₹{item.price} / {item.unit}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-gray-600 rounded hover:bg-gray-500"><Minus size={12}/></button>
                                            <span className="text-sm font-bold text-white">{item.qty}</span>
                                            <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-gray-600 rounded hover:bg-emerald-500"><Plus size={12}/></button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={18}/></button>
                                </div>
                            ))
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                            <div className="flex justify-between text-gray-400 mb-2"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                            <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-700"><span>Total</span><span>₹{cartTotal}</span></div>
                            <button onClick={() => setViewState('checkout')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-emerald-500/20 transition-all">Proceed to Checkout</button>
                        </div>
                    )}
                </div>
              </div>
            )}

            {viewState === 'checkout' && (
                <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
                    <button onClick={() => setViewState('store')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">← Back to Store</button>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><CheckCircle className="text-emerald-400" size={32}/> Checkout</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="bg-gray-700/30 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Truck size={20} className="text-emerald-400"/> Delivery</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${deliveryOption === 'standard' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                        <div className="flex items-center gap-3"><input type="radio" name="delivery" checked={deliveryOption==='standard'} onChange={()=>setDeliveryOption('standard')} className="accent-emerald-500 w-5 h-5" /> Standard</div>
                                        <span className="font-mono">Free</span>
                                    </label>
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${deliveryOption === 'express' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                        <div className="flex items-center gap-3"><input type="radio" name="delivery" checked={deliveryOption==='express'} onChange={()=>setDeliveryOption('express')} className="accent-emerald-500 w-5 h-5" /> Express</div>
                                        <span className="font-mono">₹50</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-gray-700/30 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Wallet size={20} className="text-emerald-400"/> Payment</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentOption === 'card' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                        <div className="flex items-center gap-3"><input type="radio" name="payment" checked={paymentOption==='card'} onChange={()=>setPaymentOption('card')} className="accent-emerald-500 w-5 h-5" /> Card</div>
                                        <CreditCard size={20}/>
                                    </label>
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentOption === 'upi' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                        <div className="flex items-center gap-3"><input type="radio" name="payment" checked={paymentOption==='upi'} onChange={()=>setPaymentOption('upi')} className="accent-emerald-500 w-5 h-5" /> UPI</div>
                                        <SmartphoneIcon/> 
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 mb-6">
                                <h3 className="text-white font-bold mb-4">Order Total</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                                    <div className="flex justify-between text-gray-400"><span>Delivery</span><span>₹{deliveryFee}</span></div>
                                    <div className="border-t border-gray-700 my-2"></div>
                                    <div className="flex justify-between text-2xl font-bold text-white"><span>Total</span><span className="text-emerald-400">₹{grandTotal}</span></div>
                                </div>
                            </div>
                            <button onClick={handlePlaceOrder} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-1">
                                Confirm & Pay ₹{grandTotal}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewState === 'success' && (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/40 animate-bounce">
                        <CheckCircle size={64} className="text-white"/>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-4">Order Confirmed!</h2>
                    <p className="text-gray-400 text-xl max-w-lg text-center">Thank you for shopping with KitchenAI. Your fresh groceries are on their way.</p>
                </div>
            )}
          </div>
        )}

        {/* --- VIEW: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Package size={32}/></div>
                <span className="text-xs font-bold bg-gray-700 px-3 py-1 rounded-full text-gray-300">Updated Now</span>
              </div>
              <p className="text-gray-400 font-medium">Total Inventory</p>
              <h2 className="text-5xl font-bold text-white mt-2">{items.length}</h2>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-amber-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Calendar size={32}/></div>
                <span className="text-xs font-bold bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full">Action Needed</span>
              </div>
              <p className="text-gray-400 font-medium">Expiring Soon</p>
              <h2 className="text-5xl font-bold text-white mt-2">{items.filter(i => getStatus(i.expiryDate) === 'warning').length}</h2>
            </div>

            <div className="bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-emerald-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><ShoppingCart size={32}/></div>
              </div>
              <p className="text-gray-400 font-medium">Cart Total</p>
              <h2 className="text-5xl font-bold text-white mt-2">₹{cartTotal}</h2>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 p-8 rounded-3xl shadow-lg border border-purple-500/30 col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300"><CalendarCheck size={24}/></div>
                <h3 className="text-xl font-bold text-white">Next Meal Plan</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-purple-300 font-medium text-lg">Wednesday Dinner</p>
                  <h2 className="text-4xl font-bold text-white mt-1">{mealPlan['Wed-Dinner'] || 'Not Planned'}</h2>
                </div>
                <button onClick={()=>setActiveTab('meal-planner')} className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">View All</button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: RECIPES (Enhanced) --- */}
        {activeTab === 'recipes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-700 hover:border-emerald-500/50 transition-all group flex flex-col">
                <div className="h-48 overflow-hidden relative">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{recipe.title}</h3>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Clock size={14} className="text-emerald-400" /> {recipe.time}
                        </div>
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-700/50 border border-gray-600 text-emerald-300 px-2 py-1 rounded-full flex items-center gap-1">
                                <Tag size={10} /> {tag}
                            </span>
                        ))}
                    </div>
                    {recipe.instructions && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{recipe.instructions}</p>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-gray-700">
                        {recipe.videoUrl ? (
                            <a 
                                href={recipe.videoUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 flex items-center justify-center gap-2 font-bold transition-colors"
                            >
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-red-600 border-b-[3px] border-b-transparent ml-0.5"></div>
                                </div>
                                Watch Video
                            </a>
                        ) : (
                             <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.title + " recipe")}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-full bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-xl py-2 flex items-center justify-center gap-2 font-bold transition-all"
                            >
                                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-current">
                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-current border-b-[3px] border-b-transparent ml-0.5"></div>
                                </div>
                                Find Video
                            </a>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW: MEAL PLANNER (Enhanced) --- */}
        {activeTab === 'meal-planner' && (
          <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="flex flex-col gap-3">
                        <div className="bg-gray-900 p-3 rounded-xl text-center border border-gray-700">
                            <span className="font-bold text-emerald-400">{day}</span>
                        </div>
                        {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                            <div key={type} className="bg-gray-700/30 p-3 rounded-xl border border-gray-700 hover:border-emerald-500/30 transition-colors h-24 flex flex-col justify-between group">
                                <span className="text-xs text-gray-500 uppercase font-bold">{type}</span>
                                <input 
                                    className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none focus:placeholder-transparent" 
                                    placeholder="Add meal..." 
                                    value={mealPlan[`${day}-${type}`] || ''} 
                                    onChange={(e) => updateMealPlan(day, type, e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
          </div>
        )}

       {/* --- VIEW: AI CHEF BOT (SPLIT VIEW) --- */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto h-[80vh] bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden relative">
            
            {/* 1. BACK BUTTON (Only visible if not in menu) */}
            {aiMode !== 'menu' && (
              <button 
                onClick={() => setAiMode('menu')}
                className="absolute top-4 left-4 z-10 bg-gray-900/80 p-2 rounded-full text-white hover:bg-emerald-500 transition-colors"
              >
                ← Back
              </button>
            )}

            {/* 2. MENU SELECTION VIEW */}
            {aiMode === 'menu' && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-gradient-to-br from-gray-800 to-gray-900">
                 <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                    <ChefHat size={40} className="text-white"/>
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">How can I help you?</h2>
                 <p className="text-gray-400 mb-12">Scan ingredients to get details or chat for recipes.</p>

                 <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                    {/* OPTION 1: SCAN */}
                    <button 
                      onClick={() => setAiMode('scan')}
                      className="bg-gray-700 hover:bg-emerald-600/20 hover:border-emerald-500 border border-gray-600 p-8 rounded-3xl transition-all group flex flex-col items-center gap-4"
                    >
                       <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package size={32} className="text-emerald-400"/>
                       </div>
                       <div className="text-center">
                          <h3 className="text-xl font-bold text-white">Scan Food</h3>
                          <p className="text-sm text-gray-400 mt-2">Identify ingredients & nutrition</p>
                       </div>
                    </button>

                    {/* OPTION 2: CHAT */}
                    <button 
                      onClick={() => setAiMode('chat')}
                      className="bg-gray-700 hover:bg-blue-600/20 hover:border-blue-500 border border-gray-600 p-8 rounded-3xl transition-all group flex flex-col items-center gap-4"
                    >
                       <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Sparkles size={32} className="text-blue-400"/>
                       </div>
                       <div className="text-center">
                          <h3 className="text-xl font-bold text-white">Message AI</h3>
                          <p className="text-sm text-gray-400 mt-2">Get recipes & cooking advice</p>
                       </div>
                    </button>
                 </div>
              </div>
            )}

            {/* 3. SCAN MODE VIEW */}
            {aiMode === 'scan' && (
              <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in">
                 {!scannedData ? (
                    <div className="text-center">
                       <div className="w-64 h-64 bg-black rounded-3xl border-4 border-gray-700 mx-auto mb-8 flex items-center justify-center relative overflow-hidden">
                          {isScanning ? (
                             <>
                               <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-[scan_2s_infinite]"></div>
                               <span className="text-emerald-400 font-mono">Analyzing...</span>
                             </>
                          ) : (
                             <span className="text-gray-500">Camera Feed</span>
                          )}
                       </div>
                       <button 
                         onClick={handleScan}
                         className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                         disabled={isScanning}
                       >
                         {isScanning ? "Scanning..." : "Start Scan"}
                       </button>
                    </div>
                 ) : (
                    // RESULT PAGE (ONE PAGE INFO)
                    <div className="bg-gray-900 p-8 rounded-3xl border border-gray-700 max-w-md w-full text-center">
                       <img src={scannedData.image} alt="Food" className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-emerald-500 shadow-xl"/>
                       <h2 className="text-3xl font-bold text-white mb-2">{scannedData.name}</h2>
                       <div className="flex justify-center gap-4 mb-6">
                          <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                             <span className="block text-2xl font-bold text-emerald-400">{scannedData.calories}</span>
                             <span className="text-xs text-gray-400 uppercase">Calories</span>
                          </div>
                          <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                             <span className="block text-2xl font-bold text-blue-400">{scannedData.protein}</span>
                             <span className="text-xs text-gray-400 uppercase">Protein</span>
                          </div>
                       </div>
                       <p className="text-gray-400 mb-8">Healthy choice! This ingredient is great for Italian dishes.</p>
                       <div className="flex gap-3">
                          <button onClick={() => { setScannedData(null); }} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800">Scan Again</button>
                          <button onClick={() => { setAiMode('chat'); setChatInput(`Give me a recipe using ${scannedData.name}`); }} className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600">Get Recipe</button>
                       </div>
                    </div>
                 )}
              </div>
            )}

            {/* 4. CHAT MODE VIEW */}
            {aiMode === 'chat' && (
               <div className="flex flex-col h-full bg-gray-900">
                  <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-center shadow-lg z-10">
                     <span className="font-bold text-white">ChefBot AI</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                           <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
                           }`}>
                              {m.text}
                           </div>

                           {/* RICH RECIPE CARD */}
                           {m.recipe && (
                               <div className="mt-3 bg-gray-800 border border-gray-600 rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl animate-fade-in">
                                   <div className="h-40 overflow-hidden relative">
                                       <img 
                                            src={getImageForFood(m.recipe.imageKeyword || m.recipe.title, 'Others')} 
                                            alt={m.recipe.title} 
                                            className="w-full h-full object-cover"
                                       />
                                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                       <div className="absolute bottom-2 left-3">
                                            <h3 className="font-bold text-white text-lg drop-shadow-md">{m.recipe.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                                <div className="flex items-center gap-1"><Clock size={12}/> {m.recipe.time}</div>
                                                <div className="flex items-center gap-1"><Tag size={12}/> {m.recipe.calories}</div>
                                            </div>
                                       </div>
                                   </div>
                                   
                                   <div className="p-4">
                                        <p className="text-gray-400 text-xs mb-3 line-clamp-3">{m.recipe.instructions}</p>
                                        
                                        <div className="flex gap-2">
                                            <a 
                                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(m.recipe.youtubeQuery || m.recipe.title)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-red-600 border-b-[3px] border-b-transparent ml-0.5"></div>
                                                </div>
                                                Watch Video
                                            </a>
                                            <button 
                                                onClick={() => saveRecipeFromChat(m.recipe)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Save size={14}/> Save Recipe
                                            </button>
                                        </div>
                                   </div>
                               </div>
                           )}
                        </div>
                     ))}
                     {isAiLoading && <div className="text-gray-500 text-xs animate-pulse ml-2">Chef is thinking...</div>}
                     <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleChat} className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
                     <input 
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                     />
                     <button type="submit" className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600">
                        <Send size={20}/>
                     </button>
                  </form>
               </div>
            )}
            
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 p-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Settings & Preferences</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-gray-300 mb-4 font-bold text-lg">Dietary Preference</label>
                <div className="grid grid-cols-2 gap-4">
                  {['None', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Paleo'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setDietaryPref(type)}
                      className={`p-4 rounded-xl border text-left transition-all font-medium ${dietarypref === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Account Details</p>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-white text-lg"><span className="text-emerald-500">User:</span> {user.username}</p>
                    <p className="text-gray-400"><span className="text-emerald-500">Mobile:</span> {user.mobile}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
             <img src="/logo.png" alt="Logo" className="h-8 opacity-80" />
             <span className="text-xl font-bold text-white">SmartKitchen</span>
          </div>
          <p className="text-gray-500 text-sm">&copy; 2026 Smart Kitchen AI Project. Built for Academic Submission.</p>
        </div>
      </footer>

      {/* MODAL: ADD ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-600">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-white">Add New Item</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><Trash2 size={24} className="rotate-45"/></button>
            </div>
            
            {/* Image Preview for Add Modal */}
            <div className="mb-6 h-40 rounded-xl overflow-hidden relative border border-gray-600 shadow-inner bg-gray-900 group">
                <img 
                    src={previewImage} 
                    alt="Item Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center text-xs text-gray-300">
                    Preview based on name: {newItemName || '...'}
                </div>
            </div>

            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Item Name</label>
                <input placeholder="e.g. Tomatoes" className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={newItemName} onChange={e => setNewItemName(e.target.value)} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                    <input placeholder="1" type="number" className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                    <select className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)}>
                        <option>kg</option><option>grams</option><option>Liters</option><option>Pieces</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={newItemCat} onChange={e => setNewItemCat(e.target.value)}>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Dairy</option>
                    <option>Meat</option>
                    <option>Grains</option>
                    <option>Spices</option>
                    <option>Bakery</option>
                    <option>Oils</option>
                    <option>Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                <input type="date" className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={newItemDate} onChange={e => setNewItemDate(e.target.value)} required />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Nav Button Component Helper
const NavButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
      active 
      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    {text}
  </button>
);

// Icon Helper
const SmartphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);