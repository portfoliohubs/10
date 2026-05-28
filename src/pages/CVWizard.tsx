import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Plus, X, Upload, Image as ImageIcon, Check, FileDown, RotateCcw, ChevronDown, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import CONFIG from '../config';
import { generateCvPdf } from '../lib/pdfGenerator';
import { processImageToBase64, processMultipleImages } from '../lib/imageProcessor';

type Step = 'personal' | 'contact' | 'photo' | 'skills' | 'timeline' | 'cases' | 'preview';

const STEPS: Step[] = ['personal', 'contact', 'photo', 'skills', 'timeline', 'cases', 'preview'];
const STEP_LABELS: Record<Step, string> = {
  personal: CONFIG.steps.personal,
  contact:  CONFIG.steps.contact,
  photo:    CONFIG.steps.photo,
  skills:   CONFIG.steps.skills,
  timeline: CONFIG.steps.timeline,
  cases:    CONFIG.steps.cases,
  preview:  CONFIG.steps.preview,
};

interface Milestone { 
  year: string; 
  event: string;
  eventAr: string; 
}

interface ClinicalCase {
  category: string; 
  categoryAr: string;
  customCategory: string;
  customCategoryAr: string;
  alt: string;
  altAr: string;
  description: string;
  descriptionAr: string;
  photo: string | null; 
  preview: string | null;
}

const blankCase = (): ClinicalCase => ({
  category: '', categoryAr: '', customCategory: '', customCategoryAr: '',
  alt: '', altAr: '', description: '', descriptionAr: '', photo: null, preview: null,
});

interface FormData {
  fullName: string; fullNameAr: string;
  title: string; titleAr: string;
  graduationYear: string; university: string; universityAr: string;
  clinicRole: string; clinicRoleAr: string;
  clinicName: string; clinicNameAr: string;
  phone: string; whatsapp: string; email: string; instagram: string; facebook: string; linkedin: string;
  latitude: string; longitude: string; addressAr: string;
  profilePhoto: string | null; profilePreview: string | null;
  clinicalSkills: string[]; clinicalSkillsAr: string[];
  digitalSkills: string[]; digitalSkillsAr: string[];
  softSkills: string[]; softSkillsAr: string[];
  timeline: Milestone[];
  cases: ClinicalCase[];
  seoDescription: string;
  keywords: string[];
  keywordsAr: string[];
}

const blankForm = (): FormData => ({
  fullName: '', fullNameAr: '',
  title: '', titleAr: '',
  graduationYear: '', university: '', universityAr: '',
  clinicRole: '', clinicRoleAr: '',
  clinicName: '', clinicNameAr: '',
  phone: '', whatsapp: '', email: '', instagram: '', facebook: '', linkedin: '',
  latitude: '', longitude: '', addressAr: '',
  profilePhoto: null, profilePreview: null,
  clinicalSkills: [], clinicalSkillsAr: [],
  digitalSkills: [], digitalSkillsAr: [],
  softSkills: [], softSkillsAr: [],
  timeline: [], cases: [],
  seoDescription: '', keywords: [], keywordsAr: []
});

function SkillInput({ label, items, onAdd, onRemove, placeholder }: {
  label: string; items: string[]; onAdd: (v: string) => void;
  onRemove: (i: number) => void; placeholder: string;
}) {
  const [val, setVal] = useState('');
  const add = () => { if (val.trim()) { onAdd(val.trim()); setVal(''); } };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="flex gap-2">
        <input
          type="text" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={add} type="button"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {item}
              <button onClick={() => onRemove(i)} className="ml-0.5 text-primary/60 hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required, dir = 'ltr' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; dir?: 'ltr' | 'rtl';
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} dir={dir}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default function CVWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(blankForm());
  const profileRef = useRef<HTMLInputElement>(null);
  const casesRef   = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));
  const addSkill = (key: keyof FormData, v: string) =>
    setForm(prev => ({ ...prev, [key]: [...(prev[key] as string[]), v] }));
  const removeSkill = (key: keyof FormData, i: number) =>
    setForm(prev => ({ ...prev, [key]: (prev[key] as string[]).filter((_, idx) => idx !== i) }));
  
  const addMilestone = () => set('timeline', [...form.timeline, { year: '', event: '', eventAr: '' }]);
  const removeMilestone = (i: number) => set('timeline', form.timeline.filter((_, idx) => idx !== i));
  const updateMilestone = (i: number, k: keyof Milestone, v: string) => {
    const t = [...form.timeline];
    t[i] = { ...t[i], [k]: v }; set('timeline', t);
  };
  
  const updateCase = (i: number, k: keyof ClinicalCase, v: string) => {
    const c = [...form.cases];
    c[i] = { ...c[i], [k]: v }; set('cases', c);
  };
  const removeCase = (i: number) => set('cases', form.cases.filter((_, idx) => idx !== i));

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await processImageToBase64(file);
    set('profilePhoto', b64); set('profilePreview', b64);
  };

  const handleCasesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const imgs = await processMultipleImages(files);
    const newCases: ClinicalCase[] = imgs.map(img => ({ ...blankCase(), photo: img.base64, preview: img.preview }));
    set('cases', [...form.cases, ...newCases]);
    e.target.value = '';
  };

  const handleDownloadPdf = () => {
    // Generates output passing advanced keys structuralized for your configuration
    generateCvPdf({
      baseURL: "https://portfoliohubs.github.io/MICKY/",
      title: form.fullName,
      hero: {
        name: form.fullName, name_ar: form.fullNameAr,
        tagline: form.title, tagline_ar: form.titleAr,
        graduation: `Graduated ${form.graduationYear} - ${form.university}`,
        current_position: { role: form.clinicRole, role_ar: form.clinicRoleAr, clinic: form.clinicName, clinic_ar: form.clinicNameAr }
      },
      seo: { description: form.seoDescription, keywords: form.keywords, keywords_ar: form.keywordsAr },
      skills: {
        clinical: form.clinicalSkills, clinical_ar: form.clinicalSkillsAr,
        digital: form.digitalSkills, digital_ar: form.digitalSkillsAr,
        soft: form.softSkills, soft_ar: form.softSkillsAr
      },
      education: { university: form.university, university_ar: form.universityAr, graduation_year: form.graduationYear },
      timeline: form.timeline.map(m => ({ year: m.year, event: m.event, event_ar: m.eventAr })),
      clinical_cases: form.cases.map(c => ({
        category: c.category === 'custom' ? c.customCategory : c.category,
        category_ar: c.category === 'custom' ? c.customCategoryAr : c.categoryAr,
        cases: [{ photo: c.photo, alt: c.alt, alt_ar: c.altAr, description: c.description, description_ar: c.descriptionAr }]
      })),
      contact: {
        phone: form.phone, whatsapp: form.whatsapp, email: form.email,
        instagram: form.instagram, facebook: form.facebook, linkedin: form.linkedin,
        location: { address_ar: form.addressAr, latitude: form.latitude, longitude: form.longitude }
      }
    });
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showBack />

      {/* Progress bar */}
      <div className="w-full bg-muted h-1.5">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      {/* Step indicators */}
      <div className="w-full overflow-x-auto border-b border-border/50">
        <div className="flex min-w-max max-w-3xl mx-auto px-4 py-2 gap-1">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                i === step ? 'bg-primary text-primary-foreground'
                : i < step  ? 'bg-primary/15 text-primary cursor-pointer hover:bg-primary/25'
                : 'text-muted-foreground cursor-default'
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span className="text-xs w-3.5 text-center">{i + 1}</span>}
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="wizard-step-enter">

          {/* ── PERSONAL INFO (DUAL LANGUAGE) ───────────────────────────────── */}
          {currentStep === 'personal' && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.personal}</h2>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">Supports Arabic & English Profiles</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name (EN)" value={form.fullName} onChange={v => set('fullName', v)} placeholder="Dr. Michael Nabil" required />
                <InputField label="الاسم بالكامل (AR)" value={form.fullNameAr} onChange={v => set('fullNameAr', v)} placeholder="د. مايكل نبيل" dir="rtl" required />
                
                <InputField label="Tagline / Role (EN)" value={form.title} onChange={v => set('title', v)} placeholder="Internship Dentist" />
                <InputField label="المسمى الوظيفي (AR)" value={form.titleAr} onChange={v => set('titleAr', v)} placeholder="طبيب امتياز" dir="rtl" />
                
                <InputField label="University Name (EN)" value={form.university} onChange={v => set('university', v)} placeholder="Egyptian Russian University" />
                <InputField label="اسم الجامعة (AR)" value={form.universityAr} onChange={v => set('universityAr', v)} placeholder="الجامعة الروسية المصرية" dir="rtl" />

                <InputField label="Current Hospital/Clinic (EN)" value={form.clinicName} onChange={v => set('clinicName', v)} placeholder="Zagazig University Hospital" />
                <InputField label="جهة العمل الحالية (AR)" value={form.clinicNameAr} onChange={v => set('clinicNameAr', v)} placeholder="مستشفى جامعة الزقازيق" dir="rtl" />

                <InputField label="Graduation Year" value={form.graduationYear} onChange={v => set('graduationYear', v)} placeholder="2025" />
                <InputField label="SEO Portfolio Description" value={form.seoDescription} onChange={v => set('seoDescription', v)} placeholder="Professional dental portfolio..." />
              </div>
            </section>
          )}

          {/* ── CONTACT & LOCALIZATION DETAILS ──────────────────────────────── */}
          {currentStep === 'contact' && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.contact}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Phone Number" value={form.phone} onChange={v => set('phone', v)} placeholder="+20127..." type="tel" />
                <InputField label="WhatsApp Link/Number" value={form.whatsapp} onChange={v => set('whatsapp', v)} placeholder="+20127..." type="tel" />
                <InputField label="Email Address" value={form.email} onChange={v => set('email', v)} placeholder="example@gmail.com" type="email" />
                <InputField label="Instagram URL" value={form.instagram} onChange={v => set('instagram', v)} placeholder="https://instagram.com/..." type="url" />
                <InputField label="Facebook URL" value={form.facebook} onChange={v => set('facebook', v)} placeholder="https://facebook.com/..." type="url" />
                <InputField label="LinkedIn URL" value={form.linkedin} onChange={v => set('linkedin', v)} placeholder="https://linkedin.com/in/..." type="url" />
                
                <div className="sm:col-span-2 border-t pt-3 mt-2">
                  <p className="text-sm font-semibold mb-2 text-foreground">Map Clinic Location Coordinates</p>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Latitude" value={form.latitude} onChange={v => set('latitude', v)} placeholder="30.5850..." />
                    <InputField label="Longitude" value={form.longitude} onChange={v => set('longitude', v)} placeholder="31.4872..." />
                  </div>
                  <div className="mt-3">
                    <InputField label="العنوان التفصيلي بالكامل (AR)" value={form.addressAr} onChange={v => set('addressAr', v)} placeholder="مستشفيات جامعة الزقازيق - الشرقية" dir="rtl" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── PROFILE PHOTO ─────────────────────────────────────────────────── */}
          {currentStep === 'photo' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.photo}</h2>
              <p className="text-sm text-muted-foreground">Upload profile picture linked dynamically onto your site layout configuration.</p>
              <input ref={profileRef} type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
              <div
                onClick={() => profileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors min-h-[220px]"
              >
                {form.profilePreview ? (
                  <>
                    <img src={form.profilePreview} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-primary/20 shadow-md" />
                    <p className="text-sm text-primary font-medium">Click to change photo</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Profile Image Entry</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to browse asset files</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* ── SKILLS MULTI-DIALECT METRICS ─────────────────────────────────── */}
          {currentStep === 'skills' && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.skills}</h2>
              
              <div className="border border-border p-4 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-primary">Clinical Core Skills</h3>
                <SkillInput label="Clinical Skills (EN)" items={form.clinicalSkills} onAdd={v => addSkill('clinicalSkills', v)} onRemove={i => removeSkill('clinicalSkills', i)} placeholder="e.g. Endodontics" />
                <SkillInput label="المهارات السريرية (AR)" items={form.clinicalSkillsAr} onAdd={v => addSkill('clinicalSkillsAr', v)} onRemove={i => removeSkill('clinicalSkillsAr', i)} placeholder="مثال: علاج جذور" />
              </div>

              <div className="border border-border p-4 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-primary">Digital & Tech Skills</h3>
                <SkillInput label="Digital Skills (EN)" items={form.digitalSkills} onAdd={v => addSkill('digitalSkills', v)} onRemove={i => removeSkill('digitalSkills', i)} placeholder="e.g. Dental Website Coding" />
                <SkillInput label="المهارات الرقمية (AR)" items={form.digitalSkillsAr} onAdd={v => addSkill('digitalSkillsAr', v)} onRemove={i => removeSkill('digitalSkillsAr', i)} placeholder="مثال: برمجة المواقع" />
              </div>

              <div className="border border-border p-4 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-primary">Soft & Communication Skills</h3>
                <SkillInput label="Soft Skills (EN)" items={form.softSkills} onAdd={v => addSkill('softSkills', v)} onRemove={i => removeSkill('softSkills', i)} placeholder="e.g. Patient Management" />
                <SkillInput label="المهارات الشخصية (AR)" items={form.softSkillsAr} onAdd={v => addSkill('softSkillsAr', v)} onRemove={i => removeSkill('softSkillsAr', i)} placeholder="مثال: التعامل مع مرضى الأطفال" />
              </div>
            </section>
          )}

          {/* ── TIMELINE LOGICAL TIMEFRAMES ─────────────────────────────────── */}
          {currentStep === 'timeline' && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.timeline}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Chronological professional milestones history tracker.</p>
                </div>
                <button onClick={addMilestone} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
                  <Plus className="h-4 w-4" /> Add Milestone
                </button>
              </div>
              {form.timeline.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                  <p className="text-sm">No historical milestones defined yet.</p>
                </div>
              )}
              <div className="space-y-3">
                {form.timeline.map((m, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 bg-card">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Event Milestone #{i + 1}</span>
                      <button onClick={() => removeMilestone(i)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <InputField label="Year / Period" value={m.year} onChange={v => updateMilestone(i, 'year', v)} placeholder="e.g. 2025-2026" />
                      <InputField label="English Event Log" value={m.event} onChange={v => updateMilestone(i, 'event', v)} placeholder="Graduated from Faculty of Dentistry" />
                      <InputField label="تفاصيل الحدث بالعربية" value={m.eventAr} onChange={v => updateMilestone(i, 'eventAr', v)} placeholder="التخرج من كلية طب الأسنان" dir="rtl" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── CLINICAL CASES RICH METADATA ─────────────────────────────────── */}
          {currentStep === 'cases' && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">{STEP_LABELS.cases} Portfolio Matrix</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Build structural grid cards featuring high value treated case data.</p>
              </div>
              <input ref={casesRef} type="file" accept="image/*" multiple onChange={handleCasesUpload} className="hidden" />
              <button
                onClick={() => casesRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-medium text-sm hover:bg-primary/5 hover:border-primary transition-colors"
              >
                <Upload className="h-4.5 w-4.5" /> Select Case Asset Files
              </button>
              {form.cases.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No medical portfolios built yet.</p>
                </div>
              )}
              <div className="space-y-4">
                {form.cases.map((c, i) => (
                  <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Case Portfolio Component #{i + 1}</span>
                      <button onClick={() => removeCase(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      {c.preview && (
                        <img src={c.preview} alt={`Case ${i + 1}`} className="w-full max-h-48 object-contain rounded-lg bg-black/5" />
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Structural Classification (EN)</label>
                          <select
                            value={c.category}
                            onChange={e => updateCase(i, 'category', e.target.value)}
                            className="w-full appearance-none px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Choose Structural Category</option>
                            <option value="Cosmetic">Cosmetic</option>
                            <option value="fixed prosthodontics">Fixed Prosthodontics</option>
                            <option value="Endodontic Treatment">Endodontic Treatment</option>
                            <option value="Pediatric">Pediatric</option>
                            <option value="custom">Custom Specified Category</option>
                          </select>
                        </div>
                        
                        <div dir="rtl">
                          <label className="block text-sm font-medium text-foreground mb-1 text-right">التصنيف الطبي (AR)</label>
                          <InputField label="" value={c.categoryAr} onChange={v => updateCase(i, 'categoryAr', v)} placeholder="مثال: الحشو التجميلى" dir="rtl" />
                        </div>

                        {c.category === 'custom' && (
                          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                            <InputField label="Custom Category Name (EN)" value={c.customCategory} onChange={v => updateCase(i, 'customCategory', v)} placeholder="e.g. Implantology" />
                            <InputField label="اسم التصنيف المخصص (AR)" value={form.cases[i].customCategoryAr || ''} onChange={v => updateCase(i, 'customCategoryAr', v)} placeholder="مثال: زراعة أسنان" dir="rtl" />
                          </div>
                        )}

                        <InputField label="Alt Text / Label Tag (EN)" value={c.alt} onChange={v => updateCase(i, 'alt', v)} placeholder="e.g. 4 E-MAX Crowns" />
                        <InputField label="العنوان البديل للصورة (AR)" value={c.altAr} onChange={v => updateCase(i, 'altAr', v)} placeholder="أربعة تركيبات ثابته" dir="rtl" />

                        <InputField label="Brief Summary Description (EN)" value={c.description} onChange={v => updateCase(i, 'description', v)} placeholder="Treatment using composite layer fillings" />
                        <InputField label="الوصف الدقيق للحالة (AR)" value={c.descriptionAr} onChange={v => updateCase(i, 'descriptionAr', v)} placeholder="تجميل الابتسامة بالحشو الليزر الابيض" dir="rtl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── PREVIEW & INTEGRATIONS EXPORT GENERATION ─────────────────────── */}
          {currentStep === 'preview' && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Review Configuration Schema</h2>
              <p className="text-sm text-muted-foreground">Verify systemic values compiled for localization models prior to file generation.</p>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground mb-3">Portfolio Mapping Meta Summary</p>
                {[
                  ['Identity Schema', `${form.fullName} / ${form.fullNameAr}`],
                  ['Structural Position', form.clinicName],
                  ['Mapped Timelines', `${form.timeline.length} configurations`],
                  ['Image Assets Tracked', `${form.cases.length} medical items`],
                  ['Coordinates Tracked', `Lat: ${form.latitude || 'None'}, Long: ${form.longitude || 'None'}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm gap-3">
                    <span className="text-muted-foreground shrink-0">{k}</span>
                    <span className="text-foreground text-right truncate font-mono text-xs">{v}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors shadow-md"
              >
                <FileDown className="h-5 w-5" /> Compile Config Model Output
              </button>

              <button onClick={() => { setForm(blankForm()); setStep(0); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-colors">
                <RotateCcw className="h-4 w-4" /> Reset Schema Builder
              </button>
            </section>
          )}
        </div>

        {/* Navigation buttons */}
        {currentStep !== 'preview' && (
          <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
