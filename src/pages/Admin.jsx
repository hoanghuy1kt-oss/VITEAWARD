import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

import { auth, db, storage, isConfigured } from '../utils/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, getDocs, deleteDoc, updateDoc, writeBatch, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { VOTE_CATEGORIES } from '../data/categories';

// Helper to compress image base64 client-side using canvas
const compressImageBase64 = (base64Str, maxWidth = 300, maxHeight = 300) => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:') || base64Str.includes('image/svg+xml')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const mimeMatch = base64Str.match(/^data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      
      if (mimeType === 'image/png' || mimeType === 'image/webp') {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      if (mimeType === 'image/png' || mimeType === 'image/webp') {
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// Unified premium image upload component
function ImageUploader({ value, onChange, formName, label, placeholderIcon = "🖼️" }) {
  const [localUploading, setLocalUploading] = useState(false);
  const [forceBase64, setForceBase64] = useState(() => {
    return localStorage.getItem('vita_force_base64') === 'true';
  });
  const { addToast } = useToast();

  const handleForceBase64Change = (e) => {
    const checked = e.target.checked;
    setForceBase64(checked);
    localStorage.setItem('vita_force_base64', checked ? 'true' : 'false');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isConfigured || forceBase64) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImageBase64(reader.result, 300, 300);
        onChange(compressed);
        addToast(forceBase64 ? "Đã lưu ảnh dạng Base64 (Đã nén tối ưu)" : "Đã tải ảnh lên (Chế độ Offline)", "success");
      };
      reader.readAsDataURL(file);
      return;
    }

    setLocalUploading(true);

    const uploadWithTimeout = (storageRef, file, timeoutMs = 4000) => {
      return Promise.race([
        uploadBytes(storageRef, file),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs)
        )
      ]);
    };

    try {
      const storageRef = ref(storage, `${formName}/${Date.now()}_${file.name}`);
      const snapshot = await uploadWithTimeout(storageRef, file, 4000);
      const downloadURL = await getDownloadURL(snapshot.ref);
      onChange(downloadURL);
      addToast("Tải ảnh lên Cloud Storage thành công!", "success");
    } catch (err) {
      console.warn("Upload failed or timed out. Falling back to Base64:", err);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImageBase64(reader.result, 300, 300);
        onChange(compressed);
        addToast("Không thể tải lên Cloud Storage. Đã tự động lưu ảnh trực tiếp dạng Base64 (Đã nén).", "warning");
      };
      reader.readAsDataURL(file);
    } finally {
      setLocalUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div className="image-upload-wrapper" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
          {value ? (
            <>
              <div className="image-preview-box">
                <img src={value} alt="Preview" onError={(e) => { e.target.src = '/images/hero-collage.png'; }} />
              </div>
              <div className="image-upload-info">
                <span className="file-name" style={{ color: 'var(--gold-200)', fontSize: '0.85rem' }}>
                  {value.startsWith('data:') ? 'Ảnh Base64 (Đã nén tối ưu)' : value.startsWith('/images') ? `Ảnh tĩnh: ${value}` : 'Ảnh đã tải lên Cloud'}
                </span>
                <div className="image-upload-btn-container" style={{ marginTop: '8px' }}>
                  <label className="image-upload-btn">
                    <span>Thay đổi 🔄</span>
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={localUploading} />
                  </label>
                  <button type="button" className="image-upload-btn remove" onClick={handleRemove} disabled={localUploading}>
                    Xóa 🗑️
                  </button>
                </div>
              </div>
            </>
          ) : (
            <label className="image-upload-placeholder" style={{ margin: 0, width: '100%' }}>
              <span className="icon" style={{ fontSize: '2rem', display: 'block', marginBottom: '4px' }}>{placeholderIcon}</span>
              <span className="text" style={{ fontWeight: '600', color: '#fff' }}>{localUploading ? "Đang tải ảnh..." : "Chọn hình ảnh tải lên"}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.5, color: '#cbd5e1' }}>Hỗ trợ JPG, PNG, GIF, SVG</span>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={localUploading} />
            </label>
          )}
        </div>
        {isConfigured && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
            <input 
              type="checkbox" 
              id={`force-base64-${label}`}
              checked={forceBase64} 
              onChange={handleForceBase64Change}
              style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
            />
            <label htmlFor={`force-base64-${label}`} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', userSelect: 'none', fontWeight: 'normal' }}>
              Lưu trực tiếp vào Database (Base64) - Dùng khi Cloud Storage lỗi/đầy
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to generate a clean, sequential ID based on existing items
const getNextId = (list = [], prefix = 'nom') => {
  let maxNum = 0;
  list.forEach(item => {
    if (item.id) {
      if (item.id.includes('_')) {
        const parts = item.id.split('_');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      } else {
        // Fallback to extract numbers from IDs like cat1, event-1, 1.1-nom-2
        const numPart = item.id.replace(/^\D+/g, '');
        const num = parseInt(numPart, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return `${prefix}_${maxNum + 1}`;
};

export default function Admin() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { isLoggedIn, user, setUser, setIsLoggedIn } = useContext(AuthContext);

  // States
  const [activeTab, setActiveTab] = useState('overview');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Database States
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [stats, setStats] = useState({ totalVotes: 0, totalNominees: 0 });

  // Form States for categories/nominees CRUD
  const [editingNominee, setEditingNominee] = useState(null);
  const [nomineeForm, setNomineeForm] = useState({
    id: '', name: '', nameEn: '', subCategoryId: '', imageUrl: '', description: '', descriptionEn: '', votesCount: 0, url: ''
  });
  const [nomineeCategoryId, setNomineeCategoryId] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: '', label: '', labelEn: '', title: '', titleEn: '', sortOrder: 0, imageUrl: ''
  });

  // News CRUD States
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: ''
  });

  // Events/Media CRUD States
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: ''
  });

  // Sponsors CRUD States
  const [sponsorsList, setSponsorsList] = useState([]);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [sponsorForm, setSponsorForm] = useState({
    id: '', name: '', nameEn: '', image: '', tier: 'diamond', sortOrder: 0, url: ''
  });

  // Sub-Categories CRUD States
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [subCategoryForm, setSubCategoryForm] = useState({
    id: '', categoryId: '', title: '', titleEn: '', imageUrl: ''
  });

  // Dynamic Sequential Auto-IDs
  useEffect(() => {
    if (!editingNominee) {
      setNomineeForm(prev => ({ ...prev, id: getNextId(nominees, 'nom') }));
    }
  }, [nominees, editingNominee]);

  useEffect(() => {
    if (!editingCategory) {
      setCategoryForm(prev => ({ ...prev, id: getNextId(categories, 'cat') }));
    }
  }, [categories, editingCategory]);

  useEffect(() => {
    if (!editingSubCategory) {
      setSubCategoryForm(prev => ({ ...prev, id: getNextId(subCategories, 'sub') }));
    }
  }, [subCategories, editingSubCategory]);

  useEffect(() => {
    if (!editingNews) {
      setNewsForm(prev => ({ ...prev, id: getNextId(news, 'news') }));
    }
  }, [news, editingNews]);

  useEffect(() => {
    if (!editingEvent) {
      setEventForm(prev => ({ ...prev, id: getNextId(events, 'event') }));
    }
  }, [events, editingEvent]);

  useEffect(() => {
    if (!editingSponsor) {
      setSponsorForm(prev => ({ ...prev, id: getNextId(sponsorsList, 'sponsor') }));
    }
  }, [sponsorsList, editingSponsor]);

  const isAdmin = isLoggedIn && user && user.role === 'admin';

  // Fetch Database Data
  const fetchData = async () => {
    if (!isConfigured) {
      // Offline mock data fallback
      setCategories(VOTE_CATEGORIES.map((c, i) => ({ ...c, sortOrder: i + 1 })));
      const subs = [];
      const noms = [];
      VOTE_CATEGORIES.forEach(c => {
        c.items.forEach(sub => {
          subs.push({
            id: sub.id,
            categoryId: c.id,
            title: sub.title,
            titleEn: sub.titleEn || sub.title,
            imageUrl: sub.image
          });
          // Add some dummy nominees for each sub-category
          for (let i = 1; i <= 6; i++) {
            noms.push({
              id: `${sub.id}-n${i}`,
              subCategoryId: sub.id,
              name: `Đề cử ${i} - ${sub.title}`,
              nameEn: `Nominee ${i} - ${sub.titleEn || sub.title}`,
              imageUrl: i % 2 === 0 ? '/images/backround phat trien.png' : '/images/hero-collage.png',
              description: 'Mô tả chi tiết về đề cử này và những đóng góp cho du lịch.',
              descriptionEn: 'Detailed description about this nominee and contributions to tourism.',
              votesCount: Math.floor(Math.random() * 2000) + 100
            });
          }
        });
      });
      setSubCategories(subs);
      setNominees(noms);

      // Offline mock news
      setNews([
        { id: 'news-1', title: 'VITA Award 2025 thiết lập kỷ lục mới về lượng người tham gia', titleEn: 'VITA Award 2025 sets new records for participation', desc: 'Cộng đồng du lịch đã thể hiện sự ủng hộ mạnh mẽ cho các hạng mục giải thưởng mới.', descEn: 'The tourism community has shown overwhelming support for the new award categories.', image: '/images/hero-collage.png', dateStr: '12 Tháng 5, 2026', createdAt: '2026-05-12' },
        { id: 'news-2', title: 'Các influencer địa phương chung tay quảng bá du lịch bền vững', titleEn: 'Local influencers promote sustainable tourism', desc: 'Chiến dịch mới nhằm làm nổi bật các điểm đến thân thiện với môi trường.', descEn: 'A new campaign to highlight eco-friendly destinations.', image: '/images/Backround.png', dateStr: '11 Tháng 5, 2026', createdAt: '2026-05-11' }
      ]);

      // Offline mock events
      setEvents([
        { id: 'event-1', title: 'Triển lãm Hậu sự kiện VITA Award 2025', titleEn: 'VITA Award 2025 Post-Event Exhibition', desc: 'Khám phá hành trình và những khoảnh khắc vinh quang của mùa giải năm nay.', descEn: 'Explore the journey and the glorious moments of this year\'s award season.', image: '/images/hero-collage.png', dateStr: '20 Tháng 11, 2026', createdAt: '2026-11-20' }
      ]);

      // Offline mock sponsors
      setSponsorsList([
        { id: 'spon-1', name: 'Vietnam Airlines', nameEn: 'Vietnam Airlines', image: '', tier: 'diamond', sortOrder: 1 },
        { id: 'spon-2', name: 'Vingroup Travel', nameEn: 'Vingroup Travel', image: '', tier: 'diamond', sortOrder: 2 },
        { id: 'spon-3', name: 'Saigontourist', nameEn: 'Saigontourist', image: '', tier: 'gold', sortOrder: 3 }
      ]);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch Categories
      const catSnap = await getDocs(collection(db, 'categories'));
      const catList = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      catList.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setCategories(catList);

      // 2. Fetch SubCategories
      const subSnap = await getDocs(collection(db, 'subCategories'));
      const subList = subSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSubCategories(subList);

      // 3. Fetch Nominees
      const nomSnap = await getDocs(collection(db, 'nominees'));
      const nomList = nomSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      nomList.sort((a,b) => b.votesCount - a.votesCount);
      setNominees(nomList);

      // 4. Fetch News
      const newsSnap = await getDocs(collection(db, 'news'));
      const newsList = newsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      newsList.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setNews(newsList);

      // 5. Fetch Events
      const eventSnap = await getDocs(collection(db, 'events'));
      const eventList = eventSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      eventList.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setEvents(eventList);

      // 6. Fetch Sponsors
      const sponsorSnap = await getDocs(collection(db, 'sponsors'));
      const sponsorList = sponsorSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      sponsorList.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setSponsorsList(sponsorList);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      addToast("Lỗi khi tải dữ liệu từ database", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check if any admin exists in the database
  useEffect(() => {
    if (!isConfigured) {
      setAdminExists(true);
      return;
    }
    
    const checkAdminExists = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        setAdminExists(!querySnapshot.empty);
      } catch (err) {
        console.error("Error checking if admin exists:", err);
        // Fallback to true so we don't display registration form if firestore rules prevent read
        setAdminExists(true);
      }
    };
    
    checkAdminExists();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Handle stats updates
  useEffect(() => {
    const totalVotes = nominees.reduce((sum, n) => sum + (n.votesCount || 0), 0);
    setStats({
      totalVotes,
      totalNominees: nominees.length,
      totalCategories: categories.length
    });
  }, [nominees, categories]);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e, formName, fieldName, setFormState) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isConfigured) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, [fieldName]: reader.result }));
        addToast("Đã tải ảnh lên (Chế độ Offline)", "success");
      };
      reader.readAsDataURL(file);
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `${formName}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormState(prev => ({ ...prev, [fieldName]: downloadURL }));
      addToast("Tải ảnh lên thành công!", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      addToast("Tải ảnh thất bại: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // System Database Seeding
  const handleSeedDatabase = async () => {
    if (!window.confirm("Hành động này sẽ tải toàn bộ cấu trúc Hạng mục ban đầu từ categories.js lên Firestore. Bạn chắc chắn muốn tiếp tục chứ?")) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);

      // Seed categories & sub-categories
      VOTE_CATEGORIES.forEach((cat, index) => {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, {
          label: cat.label,
          labelEn: cat.labelEn,
          title: cat.title,
          titleEn: cat.titleEn,
          sortOrder: index + 1
        });

        cat.items.forEach(sub => {
          const subRef = doc(db, 'subCategories', sub.id);
          batch.set(subRef, {
            categoryId: cat.id,
            title: sub.title,
            titleEn: sub.titleEn || sub.title,
            imageUrl: sub.image || '/images/hero-collage.png'
          });

          // Insert 3 default dummy nominees for each sub-category
          for (let i = 1; i <= 3; i++) {
            const nomId = `${sub.id}-nom-${i}`;
            const nomRef = doc(db, 'nominees', nomId);
            batch.set(nomRef, {
              subCategoryId: sub.id,
              name: `Đề cử mẫu ${i} - ${sub.title}`,
              nameEn: `Sample Nominee ${i} - ${sub.titleEn || sub.title}`,
              imageUrl: '/images/hero-collage.png',
              description: 'Vui lòng chỉnh sửa mô tả này thông qua bảng quản trị Admin.',
              descriptionEn: 'Please edit this description using the admin dashboard.',
              votesCount: Math.floor(Math.random() * 500) + 10
            });
          }
        });
      });

      // Seed News
      const defaultNews = [
        {
          id: 'news-1',
          title: 'VITA Award 2025 thiết lập kỷ lục mới về lượng người tham gia',
          titleEn: 'VITA Award 2025 sets new records for participation',
          desc: 'Cộng đồng du lịch đã thể hiện sự ủng hộ mạnh mẽ cho các hạng mục giải thưởng mới.',
          descEn: 'The tourism community has shown overwhelming support for the new award categories.',
          image: '/images/hero-collage.png',
          dateStr: '12 Tháng 5, 2026',
          createdAt: '2026-05-12',
          url: 'https://vietnamtravel.net.vn/'
        },
        {
          id: 'news-2',
          title: 'Các influencer địa phương chung tay quảng bá du lịch bền vững',
          titleEn: 'Local influencers promote sustainable tourism',
          desc: 'Chiến dịch mới nhằm làm nổi bật các điểm đến thân thiện với môi trường.',
          descEn: 'A new campaign to highlight eco-friendly destinations.',
          image: '/images/Backround.png',
          dateStr: '11 Tháng 5, 2026',
          createdAt: '2026-05-11',
          url: 'https://vietnamtravel.net.vn/'
        },
        {
          id: 'news-3',
          title: 'VITA Award 2025 chính thức khởi động — Hành trình tôn vinh ngành du lịch Việt Nam',
          titleEn: 'VITA Award 2025 officially launches — Journey to honor Vietnam tourism',
          desc: 'Lễ khởi động VITA Award 2025 được tổ chức trang trọng với sự góp mặt của hơn 200 đại diện doanh nghiệp lữ hành, điểm đến và nhà sáng tạo nội dung du lịch trên cả nước.',
          descEn: 'The launch ceremony of VITA Award 2025 was solemnly held with the participation of over 200 representatives from travel agencies, destinations, and content creators.',
          image: '/images/hero-collage.png',
          dateStr: '10 Tháng 5, 2026',
          createdAt: '2026-05-10',
          url: 'https://vietnamtravel.net.vn/'
        }
      ];

      defaultNews.forEach(n => {
        const ref = doc(db, 'news', n.id);
        batch.set(ref, n);
      });

      // Seed Events
      const defaultEvents = [
        {
          id: 'event-1',
          title: 'Triển lãm Hậu sự kiện VITA Award 2025',
          titleEn: 'VITA Award 2025 Post-Event Exhibition',
          desc: 'Khám phá hành trình và những khoảnh khắc vinh quang của mùa giải năm nay.',
          descEn: 'Explore the journey and the glorious moments of this year\'s award season.',
          image: '/images/hero-collage.png',
          dateStr: '20 Tháng 11, 2026',
          createdAt: '2026-11-20',
          url: 'https://vietnamtravel.net.vn/'
        },
        {
          id: 'event-2',
          title: 'Giao lưu cùng Người chiến thắng',
          titleEn: 'Winners Meet & Greet',
          desc: 'Buổi giao lưu độc quyền để lắng nghe câu chuyện thành công trực tiếp từ những nhà vô địch.',
          descEn: 'An exclusive session to hear the success stories directly from the champions.',
          image: '/images/Backround.png',
          dateStr: '05 Tháng 11, 2026',
          createdAt: '2026-11-05',
          url: 'https://vietnamtravel.net.vn/'
        },
        {
          id: 'event-3',
          title: 'Đêm Gala vinh danh VITA Award 2025 - Tôn vinh giá trị',
          titleEn: 'Gala Night VITA Award 2025 - Honoring Values',
          desc: 'Lễ công bố và trao giải hoành tráng cho những người chiến thắng VITA Award 2025. Hãy tham gia cùng chúng tôi trong một đêm kỷ niệm hoành tráng.',
          descEn: 'The grand ceremony to announce and award the winners of VITA Award 2025. Join us for a spectacular night of celebration.',
          image: '/images/hero-collage.png',
          dateStr: '15 Tháng 6, 2026',
          createdAt: '2026-06-15',
          url: 'https://vietnamtravel.net.vn/'
        }
      ];

      defaultEvents.forEach(e => {
        const ref = doc(db, 'events', e.id);
        batch.set(ref, e);
      });

      // Seed Sponsors
      const defaultSponsors = [
        { id: 'spon-1', name: 'Vietnam Airlines', nameEn: 'Vietnam Airlines', image: '', tier: 'diamond', sortOrder: 1, url: 'https://www.vietnamairlines.com' },
        { id: 'spon-2', name: 'Vingroup Travel', nameEn: 'Vingroup Travel', image: '', tier: 'diamond', sortOrder: 2, url: 'https://vingroup.net' },
        { id: 'spon-3', name: 'Saigontourist', nameEn: 'Saigontourist', image: '', tier: 'gold', sortOrder: 3, url: 'https://saigontourist.net' },
        { id: 'spon-4', name: 'Vietravel', nameEn: 'Vietravel', image: '', tier: 'gold', sortOrder: 4, url: 'https://vietravel.com' },
        { id: 'spon-5', name: 'Sun Group', nameEn: 'Sun Group', image: '', tier: 'gold', sortOrder: 5, url: 'https://sungroup.com.vn' },
        { id: 'spon-6', name: 'Mường Thanh', nameEn: 'Muong Thanh', image: '', tier: 'gold', sortOrder: 6, url: 'http://muongthanh.com' },
        { id: 'spon-7', name: 'VTV24', nameEn: 'VTV24', image: '', tier: 'silver_media', sortOrder: 7, url: 'https://vtv.vn' },
        { id: 'spon-8', name: 'VNExpress', nameEn: 'VNExpress', image: '', tier: 'silver_media', sortOrder: 8, url: 'https://vnexpress.net' },
        { id: 'spon-9', name: 'Tuổi Trẻ', nameEn: 'Tuoi Tre', image: '', tier: 'silver_media', sortOrder: 9, url: 'https://tuoitre.vn' }
      ];

      defaultSponsors.forEach(s => {
        const ref = doc(db, 'sponsors', s.id);
        batch.set(ref, s);
      });

      await batch.commit();
      addToast("Đã khởi tạo cơ sở dữ liệu mẫu thành công!", "success");
      fetchData();
    } catch (err) {
      console.error(err);
      addToast("Khởi tạo thất bại: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Nominee actions (Create/Update/Delete)
  const handleSaveNominee = async (e) => {
    e.preventDefault();
    if (!nomineeForm.id || !nomineeForm.name || !nomineeForm.subCategoryId) {
      addToast("Vui lòng điền đủ thông tin bắt buộc", "warning");
      return;
    }

    try {
      let imageUrl = nomineeForm.imageUrl;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await compressImageBase64(imageUrl, 400, 300);
      }
      const nomineeData = {
        ...nomineeForm,
        imageUrl,
        votesCount: Number(nomineeForm.votesCount) || 0
      };

      if (isConfigured) {
        await setDoc(doc(db, 'nominees', nomineeForm.id), nomineeData);
      } else {
        // Offline state update
        if (editingNominee) {
          setNominees(prev => prev.map(n => n.id === nomineeForm.id ? nomineeData : n));
        } else {
          setNominees(prev => [nomineeData, ...prev]);
        }
      }

      addToast("Đã lưu đề cử thành công", "success");
      setEditingNominee(null);
      setNomineeForm({ id: '', name: '', nameEn: '', subCategoryId: '', imageUrl: '', description: '', descriptionEn: '', votesCount: 0, url: '' });
      setNomineeCategoryId('');
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu đề cử: " + err.message, "error");
    }
  };

  const handleDeleteNominee = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đề cử này?")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'nominees', id));
        fetchData();
      } else {
        setNominees(prev => prev.filter(n => n.id !== id));
      }
      addToast("Đã xóa đề cử", "info");
    } catch (err) {
      addToast("Lỗi khi xóa: " + err.message, "error");
    }
  };

  // News CRUD handlers
  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsForm.id || !newsForm.title) {
      addToast("Vui lòng điền đủ mã ID và Tiêu đề", "warning");
      return;
    }

    try {
      let image = newsForm.image;
      if (image && image.startsWith('data:')) {
        image = await compressImageBase64(image, 500, 300);
      }
      const data = { 
        ...newsForm,
        image
      };
      if (isConfigured) {
        await setDoc(doc(db, 'news', newsForm.id), data);
      } else {
        if (editingNews) {
          setNews(prev => prev.map(n => n.id === newsForm.id ? data : n));
        } else {
          setNews(prev => [data, ...prev]);
        }
      }
      addToast("Đã lưu tin tức thành công", "success");
      setEditingNews(null);
      setNewsForm({ id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: '' });
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu tin tức: " + err.message, "error");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tin tức này?")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'news', id));
        fetchData();
      } else {
        setNews(prev => prev.filter(n => n.id !== id));
      }
      addToast("Đã xóa tin tức", "info");
    } catch (err) {
      addToast("Lỗi khi xóa: " + err.message, "error");
    }
  };

  // Events CRUD handlers
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.id || !eventForm.title) {
      addToast("Vui lòng điền đủ mã ID và Tiêu đề sự kiện", "warning");
      return;
    }

    try {
      let image = eventForm.image;
      if (image && image.startsWith('data:')) {
        image = await compressImageBase64(image, 500, 300);
      }
      const data = { 
        ...eventForm,
        image
      };
      if (isConfigured) {
        await setDoc(doc(db, 'events', eventForm.id), data);
      } else {
        if (editingEvent) {
          setEvents(prev => prev.map(ev => ev.id === eventForm.id ? data : ev));
        } else {
          setEvents(prev => [data, ...prev]);
        }
      }
      addToast("Đã lưu sự kiện thành công", "success");
      setEditingEvent(null);
      setEventForm({ id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: '' });
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu sự kiện: " + err.message, "error");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sự kiện này?")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'events', id));
        fetchData();
      } else {
        setEvents(prev => prev.filter(ev => ev.id !== id));
      }
      addToast("Đã xóa sự kiện", "info");
    } catch (err) {
      addToast("Lỗi khi xóa: " + err.message, "error");
    }
  };

  // Sponsors CRUD handlers
  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    if (!sponsorForm.id || !sponsorForm.name) {
      addToast("Vui lòng điền đủ mã ID và Tên nhà tài trợ", "warning");
      return;
    }

    try {
      let image = sponsorForm.image;
      if (image && image.startsWith('data:')) {
        image = await compressImageBase64(image, 300, 300);
      }
      const data = { 
        ...sponsorForm,
        image,
        sortOrder: Number(sponsorForm.sortOrder) || 0
      };
      if (isConfigured) {
        await setDoc(doc(db, 'sponsors', sponsorForm.id), data);
      } else {
        if (editingSponsor) {
          setSponsorsList(prev => prev.map(s => s.id === sponsorForm.id ? data : s));
        } else {
          setSponsorsList(prev => [data, ...prev]);
        }
      }
      addToast("Đã lưu nhà tài trợ thành công", "success");
      setEditingSponsor(null);
      setSponsorForm({ id: '', name: '', nameEn: '', image: '', tier: 'diamond', sortOrder: 0, url: '' });
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu nhà tài trợ: " + err.message, "error");
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhà tài trợ này?")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'sponsors', id));
        fetchData();
      } else {
        setSponsorsList(prev => prev.filter(s => s.id !== id));
      }
      addToast("Đã xóa nhà tài trợ", "info");
    } catch (err) {
      addToast("Lỗi khi xóa: " + err.message, "error");
    }
  };

  // Category CRUD handlers
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.id || !categoryForm.label) {
      addToast("Vui lòng nhập Tên Nhóm Lớn", "warning");
      return;
    }

    try {
      const data = { 
        ...categoryForm,
        title: categoryForm.label,
        titleEn: categoryForm.labelEn || '',
        imageUrl: '',
        sortOrder: editingCategory ? (Number(categoryForm.sortOrder) || 0) : (categories.length + 1)
      };
      if (isConfigured) {
        await setDoc(doc(db, 'categories', categoryForm.id), data);
      } else {
        if (editingCategory) {
          setCategories(prev => prev.map(c => c.id === categoryForm.id ? data : c));
        } else {
          setCategories(prev => [...prev, data]);
        }
      }
      addToast("Đã lưu nhóm lớn thành công", "success");
      setEditingCategory(null);
      setCategoryForm({ id: '', label: '', labelEn: '', title: '', titleEn: '', sortOrder: 0, imageUrl: '' });
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu nhóm lớn: " + err.message, "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhóm lớn này? Tất cả các hạng mục con và đề cử liên quan có thể không hiển thị đúng.")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'categories', id));
        fetchData();
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
      addToast("Đã xóa nhóm lớn", "info");
    } catch (err) {
      addToast("Lỗi khi xóa nhóm lớn: " + err.message, "error");
    }
  };

  // SubCategory CRUD handlers
  const handleSaveSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategoryForm.id || !subCategoryForm.categoryId || !subCategoryForm.title) {
      addToast("Vui lòng điền đủ thông tin Hạng mục con", "warning");
      return;
    }

    try {
      let imageUrl = subCategoryForm.imageUrl;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await compressImageBase64(imageUrl, 400, 300);
      }
      const data = { 
        ...subCategoryForm,
        imageUrl
      };
      if (isConfigured) {
        await setDoc(doc(db, 'subCategories', subCategoryForm.id), data);
      } else {
        if (editingSubCategory) {
          setSubCategories(prev => prev.map(s => s.id === subCategoryForm.id ? data : s));
        } else {
          setSubCategories(prev => [...prev, data]);
        }
      }
      addToast("Đã lưu hạng mục con thành công", "success");
      setEditingSubCategory(null);
      setSubCategoryForm({ id: '', categoryId: '', title: '', titleEn: '', imageUrl: '' });
      if (isConfigured) fetchData();
    } catch (err) {
      addToast("Lỗi khi lưu hạng mục con: " + err.message, "error");
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa hạng mục con này? Tất cả đề cử liên quan có thể bị ẩn.")) return;
    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'subCategories', id));
        fetchData();
      } else {
        setSubCategories(prev => prev.filter(s => s.id !== id));
      }
      addToast("Đã xóa hạng mục con", "info");
    } catch (err) {
      addToast("Lỗi khi xóa hạng mục con: " + err.message, "error");
    }
  };

  const handleCreateFirstAdmin = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      addToast("Mật khẩu xác nhận không khớp!", "warning");
      return;
    }
    if (registerPassword.length < 6) {
      addToast("Mật khẩu phải từ 6 ký tự trở lên!", "warning");
      return;
    }

    setLoading(true);
    try {
      const email = registerEmail.includes('@') ? registerEmail : `${registerEmail.trim()}@vita.vn`;
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, registerPassword);
      const uid = userCredential.user.uid;

      // 2. Create user document in firestore with role 'admin'
      const adminData = {
        uid: uid,
        name: registerName || 'System Admin',
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', uid), adminData);

      setUser({
        uid: uid,
        name: adminData.name,
        email: adminData.email,
        phone: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
        role: 'admin'
      });
      setIsLoggedIn(true);

      addToast("Khởi tạo Admin đầu tiên thành công!", "success");
      setAdminExists(true);
    } catch (err) {
      console.error("Error creating first admin:", err);
      addToast("Lỗi khi tạo admin: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Auth Action
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmed = adminEmail.trim();
    let email = trimmed;
    if (!trimmed.includes('@')) {
      if (/^\+?[0-9]+$/.test(trimmed)) {
        email = `${trimmed.replace(/[^0-9+]/g, '')}@vita-award.com`;
      } else {
        email = `${trimmed}@vita.vn`;
      }
    }
    if (!isConfigured) {
      // Mock Login
      if (email === 'admin@vita.vn' && adminPassword === 'admin123') {
        setUser({ name: 'Admin Hoang Huy', email: email, role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' });
        setIsLoggedIn(true);
        addToast("Đăng nhập Admin (Offline Mode) thành công!", "success");
      } else {
        addToast("Sai tài khoản hoặc mật khẩu (Thử admin / admin123)", "error");
      }
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, adminPassword);
      // Wait for Auth state listener to fetch custom claims or users collection role
      // In App.jsx we listen to onAuthStateChanged. But let's verify if they have the role
      const adminDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const adminDetails = adminDoc.exists() && adminDoc.data().role === 'admin';
      
      if (adminDetails) {
        const adminData = adminDoc.data();
        setUser({
          uid: userCredential.user.uid,
          name: adminData.name || 'System Admin',
          email: userCredential.user.email || email,
          phone: adminData.phone || '',
          avatar: adminData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.uid}`,
          role: 'admin'
        });
        setIsLoggedIn(true);
        addToast("Đăng nhập Admin thành công!", "success");
      } else {
        await signOut(auth);
        addToast("Tài khoản của bạn không có quyền Admin", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Đăng nhập thất bại: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    if (isConfigured) {
      await signOut(auth);
    }
    setUser(null);
    setIsLoggedIn(false);
    addToast("Đã đăng xuất tài khoản", "info");
  };

  return (
    <PageTransition>
      <section style={{ paddingTop: '130px', paddingBottom: '100px', minHeight: '100vh', background: 'linear-gradient(180deg, #091028 0%, #050a18 100%)' }}>
        <style>{`
          .admin-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
            margin-bottom: 24px;
          }
          .admin-card-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 20px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .admin-card-title {
            font-size: 1.45rem;
            font-weight: 800;
            color: #fff;
            font-family: 'Playfair Display', serif;
          }
          .admin-nav {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-bottom: 12px;
            overflow-x: auto;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .admin-nav::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          .admin-nav-btn {
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.6);
            padding: 10px 20px;
            border-radius: 100px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.95rem;
            transition: all 0.3s;
            white-space: nowrap;
          }
          .admin-nav-btn.active {
            background: rgba(212, 175, 55, 0.12);
            color: var(--gold-200);
            border: 1px solid rgba(212,175,55,0.3);
          }
          .admin-stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .admin-stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            box-shadow: inset 0 0 10px rgba(255,255,255,0.01);
          }
          .admin-stat-val {
            font-size: 2.2rem;
            font-weight: 900;
            color: var(--gold-200);
            font-family: 'Be Vietnam Pro', sans-serif;
            margin-bottom: 6px;
          }
          .admin-stat-lbl {
            font-size: 0.85rem;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Admin Form controls */
          .admin-form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .admin-form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .admin-form-group label {
            font-size: 0.85rem;
            font-weight: bold;
            color: var(--gold-200);
          }
          .admin-form-group input, .admin-form-group select, .admin-form-group textarea {
            padding: 12px 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            color: #fff;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.3s;
          }
          .admin-form-group select option {
            background-color: #131931;
            color: #ffffff;
          }
          .admin-form-group input:focus, .admin-form-group select:focus, .admin-form-group textarea:focus {
            border-color: var(--gold-400);
            background: rgba(255,255,255,0.08);
          }

          /* Table designs */
          .admin-table-wrapper {
            overflow-x: auto;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
          }
          .admin-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          .admin-table th {
            background: rgba(255,255,255,0.03);
            color: var(--gold-200);
            padding: 14px 20px;
            font-weight: 700;
            font-size: 0.9rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .admin-table td {
            padding: 14px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            color: #cbd5e1;
            font-size: 0.95rem;
          }
          .admin-table tr:hover td {
            background: rgba(255,255,255,0.01);
            color: #fff;
          }

          .admin-action-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            margin-right: 6px;
            font-size: 0.85rem;
          }
          .admin-action-btn:hover {
            background: rgba(255,255,255,0.08);
          }
          .admin-action-btn.delete:hover {
            background: rgba(239, 68, 68, 0.15);
            border-color: rgb(239, 68, 68);
            color: #f87171;
          }

          /* Premium Image Upload Box */
          .image-upload-wrapper {
            display: flex;
            gap: 16px;
            align-items: center;
            background: rgba(255,255,255,0.02);
            border: 1px dashed rgba(212,175,55,0.2);
            border-radius: 12px;
            padding: 14px;
            transition: all 0.3s;
            position: relative;
            min-height: 100px;
            margin-top: 4px;
          }
          .image-upload-wrapper:hover {
            border-color: var(--gold-400);
            background: rgba(212,175,55,0.03);
          }
          .image-preview-box {
            width: 72px;
            height: 72px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            flex-shrink: 0;
          }
          .image-preview-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .image-upload-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            cursor: pointer;
            text-align: center;
            padding: 10px;
          }
          .image-upload-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: flex-start;
          }
          .image-upload-btn-container {
            display: flex;
            gap: 8px;
          }
          .image-upload-btn {
            background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.3);
            color: var(--gold-200);
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .image-upload-btn:hover {
            background: var(--gold-400);
            color: #000;
            border-color: var(--gold-400);
          }
          .image-upload-btn.remove {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #f87171;
          }
          .image-upload-btn.remove:hover {
            background: rgb(239, 68, 68);
            color: #fff;
            border-color: rgb(239, 68, 68);
          }
        `}</style>

        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 className="apg-sec-heading">{isAdmin ? "Admin Dashboard" : "VITA Awards Portal"} <span className="gold-text">Quản Trị</span></h2>
              <div className="apg-gold-rule" style={{ margin: '14px auto' }}></div>
            </div>

            {!isAdmin ? (
              !adminExists ? (
                /* FIRST ADMIN INITIALIZATION SCREEN */
                <div className="admin-card" style={{ maxWidth: '420px', margin: '0 auto' }}>
                  <div className="admin-card-header" style={{ justifyContent: 'center' }}>
                    <h3 className="admin-card-title">KHỞI TẠO ADMIN</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px', textAlign: 'center', lineHeight: '1.4' }}>
                    Chưa có tài khoản Quản trị viên trong hệ thống. Hãy đăng ký tài khoản Admin đầu tiên để bắt đầu.
                  </p>
                  <form onSubmit={handleCreateFirstAdmin}>
                    <div className="admin-form-group" style={{ marginBottom: '15px' }}>
                      <label>Họ và Tên</label>
                      <input 
                        type="text" 
                        value={registerName} 
                        onChange={e => setRegisterName(e.target.value)} 
                        placeholder="Admin Hoang Huy" 
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '15px' }}>
                      <label>Tài khoản Admin</label>
                      <input 
                        type="text" 
                        value={registerEmail} 
                        onChange={e => setRegisterEmail(e.target.value)} 
                        placeholder="admin" 
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '15px' }}>
                      <label>Mật khẩu</label>
                      <input 
                        type="password" 
                        value={registerPassword} 
                        onChange={e => setRegisterPassword(e.target.value)} 
                        placeholder="•••••••• (Tối thiểu 6 ký tự)" 
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '25px' }}>
                      <label>Xác nhận mật khẩu</label>
                      <input 
                        type="password" 
                        value={registerConfirmPassword} 
                        onChange={e => setRegisterConfirmPassword(e.target.value)} 
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}
                      disabled={loading}
                    >
                      {loading ? "Đang tạo..." : "Khởi Tạo & Đăng Nhập"}
                    </button>
                  </form>
                </div>
              ) : (
                /* SECURE ADMIN LOGIN SCREEN */
                <div className="admin-card" style={{ maxWidth: '420px', margin: '0 auto' }}>
                  <div className="admin-card-header" style={{ justifyContent: 'center' }}>
                    <h3 className="admin-card-title">ĐĂNG NHẬP HỆ THỐNG</h3>
                  </div>
                  <form onSubmit={handleAdminLogin}>
                    <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                      <label>Tài khoản Admin</label>
                      <input 
                        type="text" 
                        value={adminEmail} 
                        onChange={e => setAdminEmail(e.target.value)} 
                        placeholder="admin" 
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '30px' }}>
                      <label>Mật khẩu</label>
                      <input 
                        type="password" 
                        value={adminPassword} 
                        onChange={e => setAdminPassword(e.target.value)} 
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}
                      disabled={loading}
                    >
                      {loading ? "Đang xác thực..." : "Xác thực & Vào Bảng Điều Khiển"}
                    </button>
                  </form>
                  {!isConfigured && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '20px', textAlign: 'center' }}>
                      * Đang chạy chế độ offline. Đăng nhập bằng: <strong>admin@vita.vn</strong> / <strong>admin123</strong>
                    </p>
                  )}
                </div>
              )
            ) : (
              /* FULL ADMIN PANEL */
              <div>
                {/* Control bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                    <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                      Kết nối: <strong>{isConfigured ? "Firebase Firestore (Online)" : "Fallback Mock State (Offline)"}</strong>
                    </span>
                  </div>
                  <button onClick={handleAdminLogout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Đăng xuất [ {user?.name || 'Admin'} ] 🚪
                  </button>
                </div>

                {/* Subpage navigation */}
                <div className="admin-nav">
                  <button onClick={() => setActiveTab('overview')} className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}>📊 Tổng Quan</button>
                  <button onClick={() => setActiveTab('categories')} className={`admin-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}>📁 Nhóm Lớn (Category)</button>
                  <button onClick={() => setActiveTab('subcategories')} className={`admin-nav-btn ${activeTab === 'subcategories' ? 'active' : ''}`}>📂 Hạng Mục Con (Sub)</button>
                  <button onClick={() => setActiveTab('nominees')} className={`admin-nav-btn ${activeTab === 'nominees' ? 'active' : ''}`}>⭐ Quản Lý Đề Cử</button>
                  <button onClick={() => setActiveTab('news')} className={`admin-nav-btn ${activeTab === 'news' ? 'active' : ''}`}>📰 Quản Lý Tin Tức</button>
                  <button onClick={() => setActiveTab('events')} className={`admin-nav-btn ${activeTab === 'events' ? 'active' : ''}`}>🎥 Quản Lý Truyền Thông</button>
                  <button onClick={() => setActiveTab('sponsors')} className={`admin-nav-btn ${activeTab === 'sponsors' ? 'active' : ''}`}>🤝 Quản Lý Đối Tác</button>
                  <button onClick={() => setActiveTab('database')} className={`admin-nav-btn ${activeTab === 'database' ? 'active' : ''}`}>⚙️ Dữ Liệu & Khởi Tạo</button>
                </div>

                {/* Stats card grid */}
                <div className="admin-stat-grid">
                  <div className="admin-stat-card">
                    <div className="admin-stat-val">{stats.totalVotes.toLocaleString('vi-VN')}</div>
                    <div className="admin-stat-lbl">Tổng số lượt Vote</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-val">{stats.totalNominees}</div>
                    <div className="admin-stat-lbl">Đề cử đang chạy</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-val">{stats.totalCategories}</div>
                    <div className="admin-stat-lbl">Hạng mục chính</div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="admin-card">
                      <div className="admin-card-header">
                        <h3 className="admin-card-title">XẾP HẠNG PHIẾU BẦU HIỆN TẠI (TẤT CẢ ĐỀ CỬ)</h3>
                      </div>
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Hạng</th>
                              <th>Đề Cử</th>
                              <th>Thuộc Nhóm Hạng Mục</th>
                              <th>Lượt Vote</th>
                              <th>Tỉ Lệ %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nominees.slice(0, 10).map((nom, idx) => {
                              const subName = subCategories.find(s => s.id === nom.subCategoryId)?.title || nom.subCategoryId;
                              const maxVotes = nominees[0]?.votesCount || 1;
                              const pct = ((nom.votesCount / maxVotes) * 100).toFixed(1);
                              return (
                                <tr key={nom.id}>
                                  <td><strong>#{idx + 1}</strong></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img src={nom.imageUrl} alt="" style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                                      <strong>{nom.name}</strong>
                                    </div>
                                  </td>
                                  <td>{subName}</td>
                                  <td><span style={{ color: 'var(--gold-200)', fontWeight: 'bold' }}>{nom.votesCount.toLocaleString('vi-VN')}</span></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ flex: 1, minWidth: '60px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-400), var(--gold-200))' }}></div>
                                      </div>
                                      <span>{pct}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'categories' && (
                    <motion.div key="categories" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {/* CRUD Form */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingCategory ? "CHỈNH SỬA NHÓM LỚN" : "THÊM NHÓM LỚN MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveCategory}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã Nhóm Lớn (ID - tự động)</label>
                              <input 
                                type="text" 
                                value={categoryForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên Nhóm Lớn (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={categoryForm.label} 
                                onChange={e => setCategoryForm({...categoryForm, label: e.target.value})} 
                                placeholder="E.g. Địa phương, Lữ hành..."
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên Nhóm Lớn (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={categoryForm.labelEn} 
                                onChange={e => setCategoryForm({...categoryForm, labelEn: e.target.value})} 
                                placeholder="E.g. Localities, Tour Operators..."
                              />
                            </div>
                          </div>



                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingCategory && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingCategory(null);
                                  setCategoryForm({ id: '', label: '', labelEn: '', title: '', titleEn: '', sortOrder: 0, imageUrl: '' });
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingCategory ? "Cập Nhật Nhóm Lớn" : "Thêm Nhóm Lớn"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* List */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH NHÓM LỚN ({categories.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Tên Nhóm (VI)</th>
                                <th>Tên Nhóm (EN)</th>
                                <th>Tiêu Đề</th>
                                <th>Thứ Tự</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories.map((cat, idx) => (
                                <tr key={cat.id || idx}>
                                  <td style={{ fontFamily: 'monospace', color: 'var(--gold-200)' }}>{cat.id}</td>
                                  <td><strong>{cat.label}</strong></td>
                                  <td>{cat.labelEn}</td>
                                  <td style={{ fontSize: '0.85rem' }}>{cat.title}</td>
                                  <td>{cat.sortOrder}</td>
                                  <td>
                                    <button 
                                      onClick={() => {
                                        setEditingCategory(cat);
                                        setCategoryForm({
                                          ...cat,
                                          imageUrl: cat.imageUrl || ''
                                        });
                                      }}
                                      className="admin-action-btn"
                                    >
                                      Sửa ✏️
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteCategory(cat.id)}
                                      className="admin-action-btn delete"
                                    >
                                      Xóa 🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'subcategories' && (
                    <motion.div key="subcategories" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {/* CRUD Form */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingSubCategory ? "CHỈNH SỬA HẠNG MỤC CON" : "THÊM HẠNG MỤC CON MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveSubCategory}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã Hạng Mục Con (ID - tự động)</label>
                              <input 
                                type="text" 
                                value={subCategoryForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Thuộc Nhóm Lớn (Category)</label>
                              <select 
                                value={subCategoryForm.categoryId} 
                                onChange={e => setSubCategoryForm({...subCategoryForm, categoryId: e.target.value})}
                                required
                              >
                                <option value="">-- Chọn Nhóm Lớn --</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.label} ({cat.id})</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Tên Hạng Mục Con (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={subCategoryForm.title} 
                                onChange={e => setSubCategoryForm({...subCategoryForm, title: e.target.value})} 
                                placeholder="E.g. Điểm đến du lịch sinh thái hàng đầu..."
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên Hạng Mục Con (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={subCategoryForm.titleEn} 
                                onChange={e => setSubCategoryForm({...subCategoryForm, titleEn: e.target.value})} 
                                placeholder="English sub-category title..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <ImageUploader 
                              value={subCategoryForm.imageUrl} 
                              onChange={(val) => setSubCategoryForm(prev => ({ ...prev, imageUrl: val }))} 
                              formName="subCategories" 
                              label="Hình Ảnh Minh Họa" 
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingSubCategory && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingSubCategory(null);
                                  setSubCategoryForm({ id: '', categoryId: '', title: '', titleEn: '', imageUrl: '' });
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingSubCategory ? "Cập Nhật Hạng Mục" : "Thêm Hạng Mục"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* List */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH HẠNG MỤC CON ({subCategories.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Nhóm Lớn</th>
                                <th>Tên Hạng Mục Con (VI)</th>
                                <th>Tên Hạng Mục Con (EN)</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subCategories.map((sub, idx) => {
                                const parentLabel = categories.find(c => c.id === sub.categoryId)?.label || sub.categoryId;
                                return (
                                  <tr key={sub.id || idx}>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--gold-200)' }}>{sub.id}</td>
                                    <td><span className="badge badge-outline">{parentLabel}</span></td>
                                    <td><strong>{sub.title}</strong></td>
                                    <td>{sub.titleEn}</td>
                                    <td>
                                      <button 
                                        onClick={() => {
                                          setEditingSubCategory(sub);
                                          setSubCategoryForm(sub);
                                        }}
                                        className="admin-action-btn"
                                      >
                                        Sửa ✏️
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteSubCategory(sub.id)}
                                        className="admin-action-btn delete"
                                      >
                                        Xóa 🗑️
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'nominees' && (
                    <motion.div key="nominees" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {/* Crud Form */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingNominee ? "CHỈNH SỬA ĐỀ CỬ" : "THÊM ĐỀ CỬ MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveNominee}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã Đề Cử (ID - tự động)</label>
                              <input 
                                type="text" 
                                value={nomineeForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên Đề Cử (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={nomineeForm.name} 
                                onChange={e => setNomineeForm({...nomineeForm, name: e.target.value})} 
                                placeholder="Tên Doanh nghiệp / Địa phương"
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên Đề Cử (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={nomineeForm.nameEn} 
                                onChange={e => setNomineeForm({...nomineeForm, nameEn: e.target.value})} 
                                placeholder="English name"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Thuộc Nhóm Lớn (Category)</label>
                              <select
                                value={nomineeCategoryId}
                                onChange={e => {
                                  const newCatId = e.target.value;
                                  setNomineeCategoryId(newCatId);
                                  // Reset subCategoryId if it doesn't belong to the new category
                                  if (newCatId) {
                                    const currentSub = subCategories.find(s => s.id === nomineeForm.subCategoryId);
                                    if (!currentSub || currentSub.categoryId !== newCatId) {
                                      setNomineeForm(prev => ({ ...prev, subCategoryId: '' }));
                                    }
                                  }
                                }}
                              >
                                <option value="">-- Chọn Nhóm Lớn (Tất Cả) --</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.id} - {cat.title}</option>
                                ))}
                              </select>
                            </div>
                            <div className="admin-form-group">
                              <label>Nhóm hạng mục con (Sub Category)</label>
                              <select 
                                value={nomineeForm.subCategoryId} 
                                onChange={e => setNomineeForm({...nomineeForm, subCategoryId: e.target.value})}
                                required
                              >
                                <option value="">-- Chọn Hạng Mục --</option>
                                {subCategories
                                  .filter(sub => !nomineeCategoryId || sub.categoryId === nomineeCategoryId)
                                  .map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.id} - {sub.title}</option>
                                  ))}
                              </select>
                            </div>
                            <div className="admin-form-group">
                              <label>Lượt Vote Ban Đầu</label>
                              <input 
                                type="number" 
                                value={nomineeForm.votesCount} 
                                onChange={e => setNomineeForm({...nomineeForm, votesCount: e.target.value})} 
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <ImageUploader 
                              value={nomineeForm.imageUrl} 
                              onChange={(val) => setNomineeForm(prev => ({ ...prev, imageUrl: val }))} 
                              formName="nominees" 
                              label="Hình Ảnh Đề Cử" 
                            />
                            <div className="admin-form-group">
                              <label>Đường dẫn liên kết chi tiết (URL)</label>
                              <input 
                                type="text" 
                                value={nomineeForm.url || ''} 
                                onChange={e => setNomineeForm({...nomineeForm, url: e.target.value})} 
                                placeholder="https://..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="admin-form-group">
                              <label>Mô Tả Chi Tiết (Tiếng Việt)</label>
                              <textarea 
                                value={nomineeForm.description} 
                                onChange={e => setNomineeForm({...nomineeForm, description: e.target.value})} 
                                placeholder="Mô tả về lịch sử, thành tích, đóng góp của đề cử..."
                                rows="3"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Mô Tả Chi Tiết (Tiếng Anh)</label>
                              <textarea 
                                value={nomineeForm.descriptionEn} 
                                onChange={e => setNomineeForm({...nomineeForm, descriptionEn: e.target.value})} 
                                placeholder="English description..."
                                rows="3"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingNominee && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingNominee(null);
                                  setNomineeForm({ id: '', name: '', nameEn: '', subCategoryId: '', imageUrl: '', description: '', descriptionEn: '', votesCount: 0, url: '' });
                                  setNomineeCategoryId('');
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingNominee ? "Cập Nhật Đề Cử" : "Thêm Mới Đề Cử"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Nominees list */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH ĐỀ CỬ HIỆN CÓ ({nominees.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Đề cử</th>
                                <th>Phân Nhóm</th>
                                <th>Số Phiếu</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nominees.map(nom => (
                                <tr key={nom.id}>
                                  <td><code>{nom.id}</code></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img src={nom.imageUrl} alt="" style={{ width: '36px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                                      <div>
                                        <strong>{nom.name}</strong>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{nom.nameEn}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{subCategories.find(s => s.id === nom.subCategoryId)?.title || nom.subCategoryId}</td>
                                  <td><strong>{nom.votesCount.toLocaleString('vi-VN')}</strong></td>
                                  <td>
                                    <button 
                                      onClick={() => {
                                        setEditingNominee(nom);
                                        setNomineeForm({ ...nom });
                                        const sub = subCategories.find(s => s.id === nom.subCategoryId);
                                        setNomineeCategoryId(sub ? sub.categoryId : '');
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                      }}
                                      className="admin-action-btn"
                                    >
                                      Sửa ✏️
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteNominee(nom.id)}
                                      className="admin-action-btn delete"
                                    >
                                      Xóa 🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'news' && (
                    <motion.div key="news" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingNews ? "CHỈNH SỬA TIN TỨC" : "THÊM TIN TỨC MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveNews}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã ID Tin Tức (tự động)</label>
                              <input 
                                type="text" 
                                value={newsForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tiêu đề (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={newsForm.title} 
                                onChange={e => setNewsForm({...newsForm, title: e.target.value})} 
                                placeholder="Nhập tiêu đề tin tức..."
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tiêu đề (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={newsForm.titleEn} 
                                onChange={e => setNewsForm({...newsForm, titleEn: e.target.value})} 
                                placeholder="English title..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Chuỗi ngày hiển thị (Date String)</label>
                              <input 
                                type="text" 
                                value={newsForm.dateStr} 
                                onChange={e => setNewsForm({...newsForm, dateStr: e.target.value})} 
                                placeholder="E.g. 12 Tháng 5, 2026"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Ngày tạo (createdAt để sắp xếp)</label>
                              <input 
                                type="date" 
                                value={newsForm.createdAt} 
                                onChange={e => setNewsForm({...newsForm, createdAt: e.target.value})} 
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <ImageUploader 
                              value={newsForm.image} 
                              onChange={(val) => setNewsForm(prev => ({ ...prev, image: val }))} 
                              formName="news" 
                              label="Hình Ảnh Tin Tức" 
                            />
                            <div className="admin-form-group">
                              <label>Đường dẫn liên kết chi tiết (URL)</label>
                              <input 
                                type="text" 
                                value={newsForm.url || ''} 
                                onChange={e => setNewsForm({...newsForm, url: e.target.value})} 
                                placeholder="https://..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="admin-form-group">
                              <label>Mô tả ngắn (Tiếng Việt)</label>
                              <textarea 
                                value={newsForm.desc} 
                                onChange={e => setNewsForm({...newsForm, desc: e.target.value})} 
                                placeholder="Mô tả nội dung tin tức..."
                                rows="3"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Mô tả ngắn (Tiếng Anh)</label>
                              <textarea 
                                value={newsForm.descEn} 
                                onChange={e => setNewsForm({...newsForm, descEn: e.target.value})} 
                                placeholder="English description..."
                                rows="3"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingNews && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingNews(null);
                                  setNewsForm({ id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: '' });
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingNews ? "Cập Nhật Tin Tức" : "Thêm Tin Tức"}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH TIN TỨC HIỆN CÓ ({news.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Tin Tức</th>
                                <th>Ngày hiển thị</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {news.map(n => (
                                <tr key={n.id}>
                                  <td><code>{n.id}</code></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img src={n.image || '/images/hero-collage.png'} alt="" style={{ width: '36px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                                      <div>
                                        <strong>{n.title}</strong>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{n.titleEn}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{n.dateStr}</td>
                                  <td>
                                    <button 
                                      onClick={() => {
                                        setEditingNews(n);
                                        setNewsForm({ ...n });
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                      }}
                                      className="admin-action-btn"
                                    >
                                      Sửa ✏️
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteNews(n.id)}
                                      className="admin-action-btn delete"
                                    >
                                      Xóa 🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'events' && (
                    <motion.div key="events" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingEvent ? "CHỈNH SỬA SỰ KIỆN" : "THÊM SỰ KIỆN MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveEvent}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã ID Sự Kiện (tự động)</label>
                              <input 
                                type="text" 
                                value={eventForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tiêu đề sự kiện (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={eventForm.title} 
                                onChange={e => setEventForm({...eventForm, title: e.target.value})} 
                                placeholder="Nhập tiêu đề sự kiện..."
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tiêu đề sự kiện (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={eventForm.titleEn} 
                                onChange={e => setEventForm({...eventForm, titleEn: e.target.value})} 
                                placeholder="English event title..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Chuỗi ngày hiển thị (Date String)</label>
                              <input 
                                type="text" 
                                value={eventForm.dateStr} 
                                onChange={e => setEventForm({...eventForm, dateStr: e.target.value})} 
                                placeholder="E.g. 20 Tháng 11, 2026"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Ngày tạo (createdAt để sắp xếp)</label>
                              <input 
                                type="date" 
                                value={eventForm.createdAt} 
                                onChange={e => setEventForm({...eventForm, createdAt: e.target.value})} 
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <ImageUploader 
                              value={eventForm.image} 
                              onChange={(val) => setEventForm(prev => ({ ...prev, image: val }))} 
                              formName="events" 
                              label="Hình Ảnh Sự Kiện" 
                            />
                            <div className="admin-form-group">
                              <label>Đường dẫn liên kết chi tiết (URL)</label>
                              <input 
                                type="text" 
                                value={eventForm.url || ''} 
                                onChange={e => setEventForm({...eventForm, url: e.target.value})} 
                                placeholder="https://..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="admin-form-group">
                              <label>Mô tả ngắn (Tiếng Việt)</label>
                              <textarea 
                                value={eventForm.desc} 
                                onChange={e => setEventForm({...eventForm, desc: e.target.value})} 
                                placeholder="Mô tả sự kiện truyền thông..."
                                rows="3"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Mô tả ngắn (Tiếng Anh)</label>
                              <textarea 
                                value={eventForm.descEn} 
                                onChange={e => setEventForm({...eventForm, descEn: e.target.value})} 
                                placeholder="English event description..."
                                rows="3"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingEvent && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingEvent(null);
                                  setEventForm({ id: '', title: '', titleEn: '', desc: '', descEn: '', image: '', dateStr: '', createdAt: new Date().toISOString().slice(0, 10), url: '' });
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingEvent ? "Cập Nhật Sự Kiện" : "Thêm Sự Kiện"}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH SỰ KIỆN HIỆN CÓ ({events.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Sự Kiện</th>
                                <th>Ngày hiển thị</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {events.map(ev => (
                                <tr key={ev.id}>
                                  <td><code>{ev.id}</code></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img src={ev.image || '/images/hero-collage.png'} alt="" style={{ width: '36px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                                      <div>
                                        <strong>{ev.title}</strong>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{ev.titleEn}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{ev.dateStr}</td>
                                  <td>
                                    <button 
                                      onClick={() => {
                                        setEditingEvent(ev);
                                        setEventForm({ ...ev });
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                      }}
                                      className="admin-action-btn"
                                    >
                                      Sửa ✏️
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteEvent(ev.id)}
                                      className="admin-action-btn delete"
                                    >
                                      Xóa 🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'sponsors' && (
                    <motion.div key="sponsors" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">{editingSponsor ? "CHỈNH SỬA ĐỐI TÁC" : "THÊM ĐỐI TÁC MỚI"}</h3>
                        </div>
                        <form onSubmit={handleSaveSponsor}>
                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Mã ID Đối Tác (tự động)</label>
                              <input 
                                type="text" 
                                value={sponsorForm.id} 
                                disabled
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên nhà tài trợ/đối tác (Tiếng Việt)</label>
                              <input 
                                type="text" 
                                value={sponsorForm.name} 
                                onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})} 
                                placeholder="E.g. Vietnam Airlines"
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Tên đối tác (Tiếng Anh)</label>
                              <input 
                                type="text" 
                                value={sponsorForm.nameEn} 
                                onChange={e => setSponsorForm({...sponsorForm, nameEn: e.target.value})} 
                                placeholder="English name..."
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label>Phân hạng nhà tài trợ (Tier)</label>
                              <select 
                                value={sponsorForm.tier} 
                                onChange={e => setSponsorForm({...sponsorForm, tier: e.target.value})}
                                required
                              >
                                <option value="diamond">Nhà tài trợ Kim Cương</option>
                                <option value="gold">Nhà tài trợ Vàng</option>
                                <option value="silver_media">Đối tác Bạc & Truyền Thông</option>
                              </select>
                            </div>
                            <div className="admin-form-group">
                              <label>Thứ tự sắp xếp (Sort Order)</label>
                              <input 
                                type="number" 
                                value={sponsorForm.sortOrder} 
                                onChange={e => setSponsorForm({...sponsorForm, sortOrder: e.target.value})} 
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <ImageUploader 
                              value={sponsorForm.image} 
                              onChange={(val) => setSponsorForm(prev => ({ ...prev, image: val }))} 
                              formName="sponsors" 
                              label="Logo Đối Tác" 
                              placeholderIcon="🤝"
                            />
                            <div className="admin-form-group">
                              <label>Đường dẫn liên kết (URL)</label>
                              <input 
                                type="text" 
                                value={sponsorForm.url || ''} 
                                onChange={e => setSponsorForm({...sponsorForm, url: e.target.value})} 
                                placeholder="https://..."
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            {editingSponsor && (
                              <button 
                                type="button" 
                                className="btn btn-ghost" 
                                onClick={() => {
                                  setEditingSponsor(null);
                                  setSponsorForm({ id: '', name: '', nameEn: '', image: '', tier: 'diamond', sortOrder: 0, url: '' });
                                }}
                              >
                                Huỷ Bỏ
                              </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                              {editingSponsor ? "Cập Nhật Đối Tác" : "Thêm Đối Tác"}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h3 className="admin-card-title">DANH SÁCH ĐỐI TÁC HIỆN CÓ ({sponsorsList.length})</h3>
                        </div>
                        <div className="admin-table-wrapper">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Mã ID</th>
                                <th>Nhà Tài Trợ</th>
                                <th>Phân Hạng (Tier)</th>
                                <th>Thứ Tự</th>
                                <th>Hành Động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sponsorsList.map(s => (
                                <tr key={s.id}>
                                  <td><code>{s.id}</code></td>
                                  <td>
                                    <strong>{s.name}</strong>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{s.nameEn}</div>
                                  </td>
                                  <td>
                                    {s.tier === 'diamond' ? '💎 Kim Cương' : s.tier === 'gold' ? '🪙 Vàng' : '🥈 Bạc & Truyền Thông'}
                                  </td>
                                  <td>{s.sortOrder}</td>
                                  <td>
                                    <button 
                                      onClick={() => {
                                        setEditingSponsor(s);
                                        setSponsorForm({ ...s });
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                      }}
                                      className="admin-action-btn"
                                    >
                                      Sửa ✏️
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteSponsor(s.id)}
                                      className="admin-action-btn delete"
                                    >
                                      Xóa 🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'database' && (
                    <motion.div key="database" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="admin-card">
                      <div className="admin-card-header">
                        <h3 className="admin-card-title">CÀI ĐẶT HỆ THỐNG VÀ KHỞI TẠO DỮ LIỆU</h3>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '550px' }}>
                        <div style={{ padding: '16px', background: 'rgba(212,175,55,0.04)', border: '1px dashed var(--gold-400)', borderRadius: '12px' }}>
                          <h4 style={{ color: 'var(--gold-200)', marginBottom: '8px' }}>Khởi tạo cơ sở dữ liệu mẫu (Seeding)</h4>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', marginBottom: '14px' }}>
                            Nếu cơ sở dữ liệu Firestore của bạn đang trống, nút bấm này sẽ tự động khởi tạo cấu trúc 8 nhóm lớn và 32 nhóm hạng mục con lấy từ file <code>categories.js</code>, đồng thời thêm sẵn các đề cử mẫu để chạy hệ thống ngay lập tức.
                          </p>
                          <button 
                            onClick={handleSeedDatabase}
                            className="btn btn-primary" 
                            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                            disabled={loading || !isConfigured}
                          >
                            {!isConfigured ? "Vui lòng kết nối Firebase thực tế để seed" : "Khởi Tạo Dữ Liệu Lên Firestore"}
                          </button>
                        </div>

                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                          <h4 style={{ color: '#fff', marginBottom: '8px' }}>Xuất báo cáo kết quả Vote (Export CSV)</h4>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', marginBottom: '14px' }}>
                            Tải về tệp bảng tính CSV chứa đầy đủ xếp hạng và số phiếu bầu thực tế của các đề cử trong tất cả các hạng mục để lưu trữ hoặc công bố kết quả.
                          </p>
                          <button 
                            onClick={() => {
                              const csvHeaders = "Hạng Mục Con,Mã Đề Cử,Tên Đề Cử,Số Lượt Vote\n";
                              const csvRows = nominees.map(nom => {
                                const subName = subCategories.find(s => s.id === nom.subCategoryId)?.title || nom.subCategoryId;
                                return `"${subName}","${nom.id}","${nom.name}",${nom.votesCount}`;
                              }).join("\n");
                              
                              const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.setAttribute("href", url);
                              link.setAttribute("download", `VITA_AWARDS_LEADERBOARD_EXPORT_${new Date().toISOString().slice(0,10)}.csv`);
                              link.style.visibility = 'hidden';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              addToast("Đã tải tệp xuất dữ liệu thành công!", "success");
                            }}
                            className="btn btn-ghost" 
                            style={{ padding: '10px 18px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            Xuất Kết Quả CSV 📊
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
