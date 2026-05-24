import { db } from './config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot
} from 'firebase/firestore';

// ==========================================
// 1. DATA SEEDING UTILITY
// ==========================================

const SEED_CATEGORIES = [
  {
    id: "wooden-moulding",
    name: "Wooden Moulding",
    description: "Premium teak, pine, and hardwood mouldings carved to perfection.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wooden-chaukat",
    name: "Wooden Chaukat",
    description: "Durable wooden door and window frames (Chaukhats) made from premium wood.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wooden-doors",
    name: "Wooden Doors",
    description: "Premium solid wood doors, carved panels, and designer entryways.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "hdmr-products",
    name: "HDMR Products",
    description: "High-density moisture-resistant products, moldings, and panels for kitchens & bathrooms.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "decorative-wooden-panels",
    name: "Decorative Wooden Panels",
    description: "Aesthetic wooden louvers and 3D fluted panels for feature walls.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wall-moulding",
    name: "Wall Moulding",
    description: "Classic wainscoting and modern wall styling patterns.",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceiling-designs",
    name: "Ceiling Designs",
    description: "Elegant wooden cornices and ceiling panels for a grand overhead look.",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "interior-wooden-frames",
    name: "Interior Wooden Frames",
    description: "Sturdy and elegant frames for doors, windows, and partition panels.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "custom-wooden-work",
    name: "Custom Wooden Work",
    description: "Bespoke carvings and custom architectural decorative pieces.",
    image: "https://images.unsplash.com/photo-1601084881623-cef5a7de343a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "all-types-wooden-interior",
    name: "All Types of Wooden Interior Products",
    description: "Bespoke wooden handles, shelves, modular elements, and decors.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
  }
];

const SEED_PRODUCTS = [
  {
    name: "Classic Burma Teak Chaukhat Frame",
    description: "Heavy-duty doors frame crafted from single-piece Burma Teak. Precision routed rebates ensure airtight lock fitting.",
    category: "Wooden Chaukat",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      Material: "Premium Burma Teak",
      Dimensions: "5x3 inches profile",
      Finish: "Smooth sanded / Unfinished"
    },
    featured: true
  },
  {
    name: "Solid Sagwan Wooden Main Door",
    description: "Exquisite main entrance door with royal panel designs. Manufactured with anti-wrap core technology.",
    category: "Wooden Doors",
    mainImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      Wood: "Solid Teak (Sagwan)",
      Thickness: "40 mm",
      Design: "Modern panel grooves"
    },
    featured: true
  },
  {
    name: "Waterproof HDMR Wall Fluted Panel",
    description: "High-density moisture-resistant panels. Designed for luxury toilets and kitchen backsplash linings.",
    category: "HDMR Products",
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      Material: "HDMR Board",
      Finish: "Primer coated",
      Density: "850+ kg/m3"
    },
    featured: true
  },
  {
    name: "Classic Teak Crown Moulding",
    description: "Rich Burmese Teak cornice moulding with detailed double-relief profile.",
    category: "Wooden Moulding",
    mainImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      Material: "Burma Teak",
      Length: "8 feet",
      Width: "4 inches"
    },
    featured: true
  }
];

const SEED_TESTIMONIALS = [
  {
    name: "Rajesh Malhotra",
    designation: "Interior Architect, Delhi",
    rating: 5,
    review: "K K Moulding has been my go-to supplier for all wooden wall trims and custom paneling for over 5 years. Their Teak wood quality and precision in cuts are unmatched in Kirti Nagar."
  },
  {
    name: "Sneha Kapoor",
    designation: "Homeowner, Gurugram",
    rating: 5,
    review: "Rebuilt our drawing room walls using their wainscoting mouldings. The Primer Coated Pine wood saved us tons of polishing labor, and the finish looks extremely premium!"
  },
  {
    name: "Arun Sharma",
    designation: "Luxury Hotel Developer",
    rating: 5,
    review: "Ordered bulk quantities of custom ceiling cornice moulding for a hotel project. The order was delivered on schedule, and the dimensions were consistent down to the millimeter."
  }
];

const SEED_GALLERY = [
  {
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "Teak Door Frame Installation",
    category: "Wooden Chaukat"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "Solid Wood Carved Door",
    category: "Wooden Doors"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    title: "Kitchen Fluted Wall Paneling",
    category: "HDMR Products"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    title: "Burma Teak Cornice Borders",
    category: "Wooden Moulding"
  }
];

const SEED_PAGE_CONTENT = {
  home: {
    hero: {
      title: "Premium Wooden Moulding & Interior Solutions",
      subtitle: "Bulk Orders | Custom Designs | High Quality Finish",
      backgroundImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80",
      tag: "Kirti Nagar, Delhi • Direct Manufacturer"
    },
    aboutSnippet: {
      tag: "Crafting Perfection",
      title: "15+ Years of Fine Wooden Artistry in Delhi",
      paragraph1: "At **K K Moulding**, we bring over 15 years of experience in premium wooden craftsmanship and interior decorative solutions. Based in Kirti Nagar, Delhi, we specialize in wooden moulding, wooden chaukat, designer doors, HDMR products, decorative panels, and custom wooden interior work.",
      paragraph2: "Our commitment to quality, precision, and modern design has helped us build a strong reputation in the wooden interior industry. Every product is crafted using premium materials, advanced manufacturing techniques, and skilled craftsmanship to deliver durability, elegance, and superior finishing.",
      paragraph3: "We proudly serve residential, commercial, showroom, office, and interior projects with bulk supply and customized wooden solutions tailored to client requirements.",
      paragraph4: "With a legacy of trust, craftsmanship, and innovation, K K Moulding continues to create timeless wooden interiors that reflect perfection and style.",
      image: "/about-logo.jpg",
      yearsOfExperience: "15+"
    }
  }
};

export async function seedDatabase() {
  try {
    // 1. Seed Categories
    const catSnap = await getDocs(collection(db, "categories"));
    if (catSnap.empty) {
      console.log("Seeding categories...");
      for (const cat of SEED_CATEGORIES) {
        await setDoc(doc(db, "categories", cat.id), cat);
      }
    }

    // 2. Seed Products
    const prodSnap = await getDocs(collection(db, "products"));
    if (prodSnap.empty) {
      console.log("Seeding products...");
      for (const prod of SEED_PRODUCTS) {
        await addDoc(collection(db, "products"), {
          ...prod,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 3. Seed Testimonials
    const testSnap = await getDocs(collection(db, "testimonials"));
    if (testSnap.empty) {
      console.log("Seeding testimonials...");
      for (const test of SEED_TESTIMONIALS) {
        await addDoc(collection(db, "testimonials"), {
          ...test,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 4. Seed Gallery
    const gallSnap = await getDocs(collection(db, "gallery"));
    if (gallSnap.empty) {
      console.log("Seeding gallery...");
      for (const img of SEED_GALLERY) {
        await addDoc(collection(db, "gallery"), {
          ...img,
          uploadedAt: new Date().toISOString()
        });
      }
    }

    // 5. Seed Website Settings
    const settingsSnap = await getDocs(collection(db, "website_settings"));
    if (settingsSnap.empty) {
      console.log("Seeding website settings...");
      await setDoc(doc(db, "website_settings", "general"), {
        companyName: "K K Moulding",
        phone: "+91 9718503557",
        whatsapp: "919718503557",
        address: "B-116 Timber Block, Kirti Nagar, Delhi, India",
        email: "contact@kkmoulding.com",
        tagline: "Premium Wooden Moulding & Interior Solutions",
        subheading: "Bulk Orders | Custom Designs | High Quality Finish"
      });
    }

    // 6. Seed Page Content
    const pageContentSnap = await getDocs(collection(db, "page_content"));
    if (pageContentSnap.empty) {
      console.log("Seeding page content...");
      for (const [pageId, content] of Object.entries(SEED_PAGE_CONTENT)) {
        await setDoc(doc(db, "page_content", pageId), content);
      }
    }
    
    console.log("Database seed check completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// ==========================================
// 2. PRODUCTS COLLECTION FUNCTIONS
// ==========================================

export async function getProducts() {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeProducts(callback) {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(list);
  }, (err) => {
    console.error("Products subscription error", err);
  });
}

export async function addProduct(product) {
  return await addDoc(collection(db, "products"), {
    ...product,
    createdAt: new Date().toISOString()
  });
}

/**
 * Backfill: Syncs ALL existing products to gallery.
 * - For each product with a mainImage, checks if a gallery entry with productId exists.
 * - If not, creates one. If yes, skips (no duplicates).
 * Returns a count of how many entries were created.
 */
export async function syncAllProductsToGallery() {
  // Load all products
  const prodSnap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  const products = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Load existing gallery entries that were auto-created (source === 'product')
  const gallerySnap = await getDocs(
    query(collection(db, "gallery"), where("source", "==", "product"))
  );
  const syncedProductIds = new Set(gallerySnap.docs.map(d => d.data().productId).filter(Boolean));

  let created = 0;
  for (const prod of products) {
    if (!prod.mainImage) continue;                     // skip products without image
    if (syncedProductIds.has(prod.id)) continue;       // already in gallery

    await addDoc(collection(db, "gallery"), {
      imageUrl: prod.mainImage,
      title: prod.name,
      category: prod.category || 'Uncategorized',
      source: 'product',
      productId: prod.id,
      uploadedAt: prod.createdAt || new Date().toISOString()
    });
    created++;
  }

  return created;
}

/**
 * Adds a product AND auto-saves its main image to the gallery.
 * The gallery entry is tagged with `source: 'product'` and `productId`
 * so it can be distinguished from manually uploaded gallery photos.
 */
export async function addProductWithGallerySync(product) {
  // 1. Save the product
  const productRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: new Date().toISOString()
  });

  // 2. Auto-save the image to gallery (only if image present)
  if (product.mainImage) {
    await addDoc(collection(db, "gallery"), {
      imageUrl: product.mainImage,
      title: product.name,
      category: product.category || 'Uncategorized',
      source: 'product',
      productId: productRef.id,
      uploadedAt: new Date().toISOString()
    });
  }

  return productRef;
}

export async function updateProduct(id, product) {
  const docRef = doc(db, "products", id);
  return await updateDoc(docRef, product);
}

/**
 * Updates a product AND syncs the new image to the gallery.
 * If a gallery entry with this productId already exists it updates it;
 * otherwise it creates a new gallery entry.
 */
export async function updateProductWithGallerySync(id, product) {
  // 1. Update the product
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, product);

  // 2. Sync gallery — find existing entry for this product
  if (product.mainImage) {
    const galleryQ = query(
      collection(db, "gallery"),
      where("productId", "==", id)
    );
    const snap = await getDocs(galleryQ);

    if (!snap.empty) {
      // Update existing gallery entry
      await updateDoc(snap.docs[0].ref, {
        imageUrl: product.mainImage,
        title: product.name,
        category: product.category || 'Uncategorized',
        uploadedAt: new Date().toISOString()
      });
    } else {
      // Create new gallery entry for this product
      await addDoc(collection(db, "gallery"), {
        imageUrl: product.mainImage,
        title: product.name,
        category: product.category || 'Uncategorized',
        source: 'product',
        productId: id,
        uploadedAt: new Date().toISOString()
      });
    }
  }
}

export async function deleteProduct(id) {
  // 1. Delete the product
  await deleteDoc(doc(db, "products", id));

  // 2. Also remove its gallery entry if one was auto-created
  try {
    const galleryQ = query(collection(db, "gallery"), where("productId", "==", id));
    const snap = await getDocs(galleryQ);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
  } catch (e) {
    // Non-critical — gallery cleanup failed but product was deleted
    console.warn("Gallery cleanup failed for deleted product:", e);
  }
}

// ==========================================
// 3. CATEGORIES COLLECTION FUNCTIONS
// ==========================================

export async function getCategories() {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeCategories(callback) {
  return onSnapshot(collection(db, "categories"), (snap) => {
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(list);
  });
}

export async function addCategory(id, category) {
  const docRef = doc(db, "categories", id);
  return await setDoc(docRef, category);
}

export async function updateCategory(id, category) {
  const docRef = doc(db, "categories", id);
  return await updateDoc(docRef, category);
}

export async function deleteCategory(id) {
  const docRef = doc(db, "categories", id);
  return await deleteDoc(docRef);
}

// ==========================================
// 4. GALLERY COLLECTION FUNCTIONS
// ==========================================

export async function getGallery() {
  const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeGallery(callback) {
  const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(list);
  });
}

export async function addGalleryItem(item) {
  return await addDoc(collection(db, "gallery"), {
    ...item,
    uploadedAt: new Date().toISOString()
  });
}

export async function deleteGalleryItem(id) {
  const docRef = doc(db, "gallery", id);
  return await deleteDoc(docRef);
}

// ==========================================
// 5. TESTIMONIALS COLLECTION FUNCTIONS
// ==========================================

export async function getTestimonials() {
  const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeTestimonials(callback) {
  const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(list);
  });
}

export async function addTestimonial(testimonial) {
  return await addDoc(collection(db, "testimonials"), {
    ...testimonial,
    createdAt: new Date().toISOString()
  });
}

export async function deleteTestimonial(id) {
  const docRef = doc(db, "testimonials", id);
  return await deleteDoc(docRef);
}

// ==========================================
// 6. INQUIRIES & CONTACT SUBMISSIONS
// ==========================================

export async function getInquiries() {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeInquiries(callback) {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(list);
  });
}

export async function addInquiry(inquiry) {
  const payload = {
    ...inquiry,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  return await addDoc(collection(db, "inquiries"), payload);
}

export async function updateInquiryStatus(id, status) {
  const docRef = doc(db, "inquiries", id);
  return await updateDoc(docRef, { status });
}

export async function deleteInquiry(id) {
  const docRef = doc(db, "inquiries", id);
  return await deleteDoc(docRef);
}

// ==========================================
// 7. WEBSITE SETTINGS
// ==========================================

export async function getWebsiteSettings() {
  const docRef = doc(db, "website_settings", "general");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export function subscribeWebsiteSettings(callback) {
  const docRef = doc(db, "website_settings", "general");
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
}

export async function updateWebsiteSettings(settings) {
  const docRef = doc(db, "website_settings", "general");
  return await updateDoc(docRef, settings);
}

// ==========================================
// 8. PAGE CONTENT
// ==========================================

export async function getPageContent(pageId) {
  const docRef = doc(db, "page_content", pageId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export function subscribePageContent(pageId, callback) {
  const docRef = doc(db, "page_content", pageId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback(null);
    }
  });
}

export async function updatePageContent(pageId, content) {
  const docRef = doc(db, "page_content", pageId);
  return await updateDoc(docRef, content);
}
