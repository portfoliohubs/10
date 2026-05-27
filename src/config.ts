/**
 * PortfolioHubs — Master Configuration File
 *
 * This is the SINGLE FILE to edit for all app customization.
 * Change any value here and it will reflect across the entire app.
 *
 * HOW TO EDIT:
 * 1. Open this file in your code editor
 * 2. Find the section you want to change (brand, whatsapp, placeholders, etc.)
 * 3. Edit the value in quotes
 * 4. Save the file — changes are live instantly in development
 */

const CONFIG = {

  // ─── BRAND ──────────────────────────────────────────────────────────────────
  brand: {
    name: "PortfolioHubs",
    slogan: "الاسنانجى لازم يتدلع",
    sloganEn: "The Dentist Deserves to Shine",
    logoUrl: "https://github.com/user-attachments/assets/fef6c67d-5ed0-4459-b41d-4c288ab48163", // leave empty to use the built-in text logo, or put a URL like "https://example.com/logo.png"
    favicon: "https://github.com/user-attachments/assets/fef6c67d-5ed0-4459-b41d-4c288ab48163",
  },

  // ─── WHATSAPP ────────────────────────────────────────────────────────────────
  whatsapp: {
    destinationNumber: "201271476215", // number to receive portfolio config files (without +)
    message: "Hi! Here is my portfolio configuration file from PortfolioHubs.",
  },

  // ─── SEO ─────────────────────────────────────────────────────────────────────
  seo: {
    googleVerification: "6VtKNI5qnSYsfjCTBMfnm9PuZjjR7aYh6crmofpS8yw",
    siteUrl: "https://portfoliohubs.replit.app",
    keywords: "portfoliohubs, cv maker, dental cv, cv pdf maker, dental portfolio, dentist cv, free cv maker",
  },

  // ─── TOML BASE URL ────────────────────────────────────────────────────────────
  toml: {
    baseUrl: "https://portfoliohubs.github.io/MICKY/",
    languageCode: "en-us",
    defaultContentLanguage: "en",
  },

  // ─── CLINICAL CASE CATEGORIES ─────────────────────────────────────────────────
  // These appear in the category dropdown when adding clinical cases
  caseCategories: [
    { id: "cosmetic",          en: "Cosmetic Dentistry",     ar: "تجميل الأسنان" },
    { id: "operative",         en: "Operative & Esthetics",  ar: "الحشو والتجميل" },
    { id: "prosthesis_fixed",  en: "Fixed Prosthodontics",   ar: "تركيبات ثابتة" },
    { id: "prosthesis_removable", en: "Removable Prosthodontics", ar: "تركيبات متحركة" },
    { id: "endodontics",       en: "Endodontics",             ar: "حشو العصب" },
    { id: "oral_surgery",      en: "Oral Surgery",            ar: "جراحة الفم" },
    { id: "periodontics",      en: "Periodontics",            ar: "أمراض اللثة" },
    { id: "orthodontics",      en: "Orthodontics",            ar: "تقويم الأسنان" },
    { id: "pediatric",         en: "Pediatric Dentistry",     ar: "طب أسنان الأطفال" },
    { id: "implant",           en: "Dental Implants",         ar: "زراعة الأسنان" },
  ],

  // ─── FIELD PLACEHOLDERS (EXAMPLES) ──────────────────────────────────────────
  // These are the example hints shown inside input fields.
  // Change any placeholder value here to update the hint across the whole app.
  placeholders: {
    fullNameEn:     "Dr. John Doe",
    fullNameAr:     "د. محمد أحمد",
    titleEn:        "Internship Dentist",
    titleAr:        "طبيب أسنان متدرب",
    graduationYear: "2025",
    universityEn:   "Faculty of Dentistry, University Name",
    universityAr:   "كلية طب الأسنان، اسم الجامعة",
    phone:          "+20 123 456 7890",
    whatsapp:       "+20 123 456 7890",
    email:          "doctor@example.com",
    website:        "https://portfoliohubs.github.io/yourname/",
    clinicalSkill:  "e.g. Oral Surgery",
    digitalSkill:   "e.g. Dental Photography",
    softSkill:      "e.g. Patient Communication",
    milestoneYear:  "2025",
    milestoneEn:    "e.g. Graduated from Faculty of Dentistry",
    milestoneAr:    "مثال: تخرجت من كلية طب الأسنان",
    caseTitleEn:    "e.g. Class IV Composite Restoration",
    caseTitleAr:    "مثال: حشوة كومبوزيت من الدرجة الرابعة",
  },

  // ─── HOME PAGE TEXT ───────────────────────────────────────────────────────────
  home: {
    headline: "Build Your Dental Profile",
    subheadline: "Free professional tools for dentists and dental students",
    portfolioButtonTitle: "Portfolio Appear in Google Search",
    portfolioButtonSubtitle: "Professional • Free • TOML Config",
    cvButtonTitle: "CV PDF Maker",
    cvButtonSubtitle: "Download instantly • Free • No registration",
    features: [
      "No account required",
      "100% free forever",
      "Mobile friendly",
      "Dark mode support",
    ],
  },

  // ─── WIZARD STEP LABELS ───────────────────────────────────────────────────────
  steps: {
    personal: "Personal Info",
    contact: "Contact Details",
    photo: "Profile Photo",
    skills: "Professional Skills",
    timeline: "Career Timeline",
    cases: "Clinical Cases",
    preview: "Preview & Download",
  },

  // ─── FORM LABELS ─────────────────────────────────────────────────────────────
  labels: {
    fullNameEn:      "Full Name (English)",
    fullNameAr:      "Full Name (Arabic)",
    titleEn:         "Title / Role (English)",
    titleAr:         "Title / Role (Arabic)",
    graduationYear:  "Graduation Year",
    universityEn:    "University (English)",
    universityAr:    "University (Arabic)",
    phone:           "Phone",
    whatsapp:        "WhatsApp",
    email:           "Email",
    website:         "Your Link (Professional Page — optional)",
    profilePhoto:    "Profile Photo",
    profilePhotoHint:"Upload a clear, front-facing photo. Any size accepted.",
    clinicalSkills:  "Clinical Skills",
    digitalSkills:   "Digital Skills",
    softSkills:      "Soft Skills",
    skillInputHint:  "Type a skill and click Add",
    addSkill:        "Add",
    timeline:        "Career Timeline",
    timelineHint:    "Add milestones that appear on the Education page",
    addMilestone:    "Add Milestone",
    milestoneYear:   "Year",
    milestoneEn:     "Event (English)",
    milestoneAr:     "Event (Arabic)",
    cases:           "Clinical Cases",
    casesHint:       "Select multiple photos at once — each photo becomes a case entry",
    selectPhotos:    "Select Case Photos",
    category:        "Category",
    selectCategory:  "Select a category",
    customCategory:  "Custom category",
    caseTitleEn:     "Case Title (English)",
    caseTitleAr:     "Case Title (Arabic)",
    previewTitle:    "Review Your Data",
    previewSubtitle: "Check everything before downloading",
  },

  // ─── BUTTON LABELS ───────────────────────────────────────────────────────────
  buttons: {
    next:          "Next Step",
    previous:      "Previous",
    addMilestone:  "Add Milestone",
    removeMilestone: "Remove",
    downloadToml:  "Download TOML File",
    sendWhatsApp:  "Send via WhatsApp",
    downloadPdf:   "Download CV as PDF",
    backHome:      "Back to Home",
    resetForm:     "Start Over",
  },

  // ─── CV PDF SETTINGS ──────────────────────────────────────────────────────────
  pdf: {
    pageTitle: "Dr. Michael Nabil — CV",   // change to the user's name dynamically
    footerText: "© 2026",
    primaryColor: "#0e7490",    // teal — hex color for PDF header
    accentColor:  "#164e63",
    showCasesInPdf: true,       // set false to exclude case photos from the PDF
    maxCasePhotosPerRow: 2,     // 1 or 2 photos per row in the PDF cases section
  },
};

export default CONFIG;
