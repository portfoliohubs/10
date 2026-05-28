import CONFIG from '../config';

export interface TomlFormData {
  personalInfo: {
    fullName: string;
    fullNameAr: string;
    title: string;
    titleAr: string;
    graduationYear: string;
    university: string;
    universityAr: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
  };
  profilePhoto: string | null;
  skills: {
    clinical: string[];
    clinicalAr: string[];
    digital: string[];
    digitalAr: string[];
    soft: string[];
    softAr: string[];
  };
  timeline: Array<{ year: string; event: string; eventAr: string }>;
  cases: Array<{
    category: string;
    categoryAr: string;
    title: string;
    titleAr: string;
    photo: string | null;
  }>;
}

function esc(str: string): string {
  if (!str) return '""';
  return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function arrToml(arr: string[]): string {
  if (!arr?.length) return '[]';
  return `[\n      ${arr.map(esc).join(',\n      ')}\n    ]`;
}

function skillsSection(skills: TomlFormData['skills'], ar = false): string {
  const prefix = ar ? '[params.ar.skills]' : '[params.skills]';
  return `${prefix}
    clinical = ${arrToml(ar ? skills.clinicalAr : skills.clinical)}
    digital  = ${arrToml(ar ? skills.digitalAr  : skills.digital)}
    soft     = ${arrToml(ar ? skills.softAr     : skills.soft)}`;
}

function timelineSection(timeline: TomlFormData['timeline'], ar = false): string {
  if (!timeline?.length) return '';
  const prefix = ar ? 'params.ar.education' : 'params.education';
  return timeline.map(item => `
  [[${prefix}.timeline]]
    year  = ${esc(item.year)}
    event = ${esc(ar ? item.eventAr : item.event)}`).join('');
}

function casesSection(cases: TomlFormData['cases']): string {
  if (!cases?.length) return '';
  // Group by category and sort alphabetically
  const grouped: Record<string, typeof cases> = {};
  cases.forEach(c => {
    const key = c.category || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, cats]) => {
      const first = cats[0];
      return `
  [[params.clinical_cases]]
    enabled     = true
    category    = ${esc(first.category)}
    category_ar = ${esc(first.categoryAr)}
${cats.map(c => `
    [[params.clinical_cases.cases]]
      photo       = ${c.photo ? esc(c.photo) : '""'}
      alt         = ${esc(c.title)}
      description = ${esc(c.title)}
      alt_ar      = ${esc(c.titleAr)}
      description_ar = ${esc(c.titleAr)}`).join('')}`;
    }).join('\n');
}

export function generateToml(data: TomlFormData): string {
  const name      = data.personalInfo.fullName      || 'Your Name';
  const nameAr    = data.personalInfo.fullNameAr    || name;
  const title     = data.personalInfo.title         || 'Professional';
  const titleAr   = data.personalInfo.titleAr       || title;
  const uni       = data.personalInfo.university    || 'Your University';
  const uniAr     = data.personalInfo.universityAr  || uni;
  const year      = data.personalInfo.graduationYear || '2025';
  const photo     = data.profilePhoto               || '';

  return `baseURL = ${esc(CONFIG.toml.baseUrl)}
languageCode = ${esc(CONFIG.toml.languageCode)}
title = ${esc(name)}
defaultContentLanguage = ${esc(CONFIG.toml.defaultContentLanguage)}

[params]
  [params.hero]
    name           = ${esc(name)}
    tagline        = ${esc(title)}
    graduation     = ${esc(`Graduated ${year} - ${uni}`)}
    profile_image  = ${esc(photo)}
    profile_image_alt = ${esc(`Profile photo of ${name}`)}

    [params.hero.current_position]
      role   = ${esc(title)}
      clinic = ${esc(`${title} at ${uni}`)}

  [params.seo]
    description          = ${esc(`Professional portfolio of ${name}`)}
    doctor_name_en       = ${esc(name)}
    doctor_name_ar       = ${esc(nameAr)}
    site_name            = ${esc(name)}
    og_image             = ${esc(photo)}
    google_search_console_verification = ${esc(CONFIG.seo.googleVerification)}
    keywords    = ["portfolio","professional",${esc(name)}]
    keywords_ar = ["محفظة","محترف",${esc(nameAr)}]

  ${skillsSection(data.skills)}

  [params.education]
    university      = ${esc(uni)}
    graduation_year = ${esc(year)}

    [params.education.master]
      obtained = false
      title = "Master in Oral Medicine"
      year  = ""

    [params.education.phd]
      obtained = false
      title = "PhD in Dental Sciences"
      year  = ""
    ${timelineSection(data.timeline)}

  ${casesSection(data.cases)}

  [params.contact]
    phone     = ${esc(data.contact.phone)}
    whatsapp  = ${esc(data.contact.whatsapp)}
    email     = ${esc(data.contact.email)}
    website   = ${esc(data.contact.website)}
    instagram = ""
    facebook  = ""
    linkedin  = ""

# ─── ARABIC TRANSLATIONS ─────────────────────────────────────────────────────
[params.ar]
  [params.ar.hero]
    name           = ${esc(nameAr)}
    tagline        = ${esc(titleAr)}
    graduation     = ${esc(`تخرج ${year} - ${uniAr}`)}
    profile_image_alt = ${esc(`صورة الملف الشخصي لـ ${nameAr}`)}

    [params.ar.hero.current_position]
      role   = ${esc(titleAr)}
      clinic = ${esc(`${titleAr} في ${uniAr}`)}

  ${skillsSection(data.skills, true)}

  [params.ar.education]
    university = ${esc(uniAr)}
    ${timelineSection(data.timeline, true)}
`;
}

export function downloadToml(content: string, filename = 'config.toml'): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
