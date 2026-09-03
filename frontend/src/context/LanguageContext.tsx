/**
 * Dual-Language Internationalization Context (TH / EN)
 * Complete, reliable translation dictionary covering all pages, components, and telemetry
 */
import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'th' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const STORAGE_KEY = 'sg_language'

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  th: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.subscriptions': 'Subscriptions',
    'nav.assessment': 'แบบประเมินความคุ้มค่า',
    'nav.demo': 'โหมดทดสอบ',
    'nav.signout': 'ออกจากระบบ',
    'nav.tagline': 'วิเคราะห์ความคุ้มค่าตามเวลาใช้งาน',
    'nav.pro': 'PRO',

    // Dashboard Page
    'dashboard.title': 'Dashboard Overview',
    'dashboard.subtitle': 'วิเคราะห์ความคุ้มค่าตามเวลาใช้งานจริง (Usage Time) และกำจัดบริการที่เสียเปล่า',
    'dashboard.manageAll': 'จัดการทั้งหมด',
    'dashboard.addSubscription': 'เพิ่ม Subscription',
    'dashboard.killCandidatesTitle': 'พบเป้าหมายที่ควรยกเลิกด่วน (Kill Zone Candidates)',
    'dashboard.killCandidatesDesc': 'คุณมี {count} บริการที่จ่ายค่าบริการสูงแต่ใช้งานน้อยมาก หากยกเลิกจะช่วยประหยัดเงินได้ถึง {monthly}/เดือน ({yearly}/ปี)',
    'dashboard.killAction': 'ส่งไป Graveyard',
    'dashboard.usedHours': 'ใช้ {hours} ชม./ด.',
    'dashboard.matrixBadge': 'เกณฑ์วัดเฉพาะบุคคล',
    'dashboard.matrixBadgeDesc': 'อิงตามลำดับความสำคัญของหมวดหมู่และหลักการเงิน 50/30/20',
    'dashboard.reassess': 'ปรับเกณฑ์ความคุ้มค่า',

    // Stats Cards
    'stats.monthlyBurn': 'ยอดจ่ายรายเดือน (Burn)',
    'stats.monthlyUnit': '/เดือน',
    'stats.yearlyEst': 'ประมาณการ {val}/ปี',
    'stats.activeCount': '{count} บริการ',
    'stats.totalUsage': 'ชั่วโมงที่ใช้รวม (Usage)',
    'stats.hoursUnit': 'ชม./เดือน',
    'stats.avgPerApp': 'เฉลี่ย {val} ชม./แอพ',
    'stats.costPerHour': 'ต้นทุนเฉลี่ยต่อ ชม. ($/hr)',
    'stats.costPerHourUnit': '/ชม.',
    'stats.costGood': 'อยู่ในเกณฑ์คุ้มค่ามาก',
    'stats.costReview': 'ควรตรวจสอบแอพที่ใช้น้อย',
    'stats.killZoneWaste': 'เสียเปล่าใน Kill Zone',
    'stats.killZoneTarget': '{count} บริการที่แทบไม่ได้ใช้',
    'stats.killZoneSafe': 'ปลอดภัย',
    'stats.killZoneCancelTarget': 'เป้าหมายยกเลิก',
    'stats.graveyardSavings': 'เงินที่ประหยัดได้สะสม',
    'stats.graveyardYearly': '+{val}/ปี',

    // Insights
    'insight.efficiencyTitle': 'ประสิทธิภาพเวลา (Usage Efficiency)',
    'insight.efficiencyDesc': 'คุณใช้งานเฉลี่ย {hours} ชม./แอพ ต่อเดือน โดยมีต้นทุนการใช้งานรวมอยู่ที่ {cost} / ชม.',
    'insight.spendTitle': 'ค่าเฉลี่ยต่อบริการ (Average Spend)',
    'insight.spendDesc': 'ค่าใช้จ่ายเฉลี่ยอยู่ที่ {cost}/เดือน ต่อหนึ่งบริการ การตัดบริการที่ไม่ได้ใช้งานช่วยลด Fixed Cost ได้อย่างมีนัยสำคัญ',
    'insight.roiTitle': 'ผลตอบแทนจากการตัดรายจ่าย (Savings ROI)',
    'insight.roiDesc': 'คุณได้ยกเลิกไปแล้ว {count} รายการ ช่วยรักษาเงินสดในกระเป๋าได้ถึง +{cost} ต่อปี',

    // Subscriptions Page
    'subs.title': 'Subscriptions',
    'subs.subtitle': 'จัดการรายการค่าบริการรายเดือนและตรวจสอบชั่วโมงการใช้งาน',
    'subs.exportCsv': 'Export CSV',
    'subs.add': 'เพิ่ม Subscription',
    'subs.filterActive': 'ใช้งานอยู่',
    'subs.filterGraveyard': 'Graveyard',
    'subs.filterAll': 'ทั้งหมด',
    'subs.searchPlaceholder': 'ค้นหาบริการหรือหมวดหมู่...',
    'subs.emptyTitle': 'ไม่พบรายการ Subscription',
    'subs.emptyDesc': 'ไม่มีบริการที่ตรงกับเงื่อนไขการค้นหา คุณสามารถลองปรับตัวกรองหรือเพิ่มบริการใหม่ได้ทันที',
    'subs.emptyAdd': 'เพิ่ม Subscription',
    'subs.activeMetric': 'บริการที่ใช้งานอยู่',
    'subs.activeOfTotal': 'จากทั้งหมด {total} บริการ',
    'subs.totalTimeMetric': 'เวลาใช้งานรวม {hours} ชม./เดือน',
    'subs.burnMetric': 'ยอดจ่ายรายเดือน (Burn)',
    'subs.savedMetric': 'เงินที่ประหยัดได้ (Graveyard)',
    'subs.savedFromCount': '+{val}/ปี จากการยกเลิก {count} บริการ',

    // Card
    'card.cost': 'ค่าบริการ',
    'card.perMonth': '/เดือน',
    'card.perYear': '/ปี',
    'card.daily': 'วันละ {val}',
    'card.monthly': 'เดือนละ {val} ชม.',
    'card.avgPerHour': 'เฉลี่ย {val}/ชม.',
    'card.active': 'ใช้งานอยู่',
    'card.cancelled': 'ยกเลิกแล้ว',
    'card.savedYearly': 'ประหยัดเงินได้ +{val}/ปี',
    'card.edit': 'แก้ไข',
    'card.kill': 'ยกเลิก (Kill)',
    'card.restore': 'กู้คืน',
    'card.delete': 'ลบถาวร',

    // Form
    'form.titleNew': 'เพิ่ม Subscription ใหม่',
    'form.titleEdit': 'แก้ไขบริการ Subscription',
    'form.subtitle': 'ระบุค่าบริการและชั่วโมงการใช้งานต่อวันเพื่อวิเคราะห์ความคุ้มค่า',
    'form.quickPresets': 'เลือกบริการหรือโลโก้จริง (Quick Preset)',
    'form.quickPresetsSub': 'คลิกเพื่อกรอกอัตโนมัติ',
    'form.nameLabel': 'ชื่อบริการ (Subscription Name) *',
    'form.namePlaceholder': 'เช่น YouTube Premium, Netflix, ChatGPT',
    'form.categoryLabel': 'หมวดหมู่ (Category)',
    'form.costLabel': 'ราคาค่าบริการ (Cost) *',
    'form.billingPlan': 'รอบการชำระเงิน (Billing Plan)',
    'form.monthlyPlan': 'รายเดือน (Monthly)',
    'form.yearlyPlan': 'รายปี (Yearly)',
    'form.dailyQuestion': 'คุณใช้งานบริการนี้เฉลี่ยวันละกี่ชั่วโมง? (Daily Usage)',
    'form.dailyRule': 'กฎความคุ้มค่า: คำนวณเป็นรายเดือน/ปี อัตโนมัติ ถ้าน้อย = เสียเปล่า (Zombie Sub)',
    'form.dailyUnit': 'ชม./วัน',
    'form.dailyZero': '0 ชม. (แทบไม่เคยเปิดใช้)',
    'form.dailyMax': '5+ ชม./วัน',
    'form.chipRare': 'นานๆ ครั้ง (สัปดาห์ละ 1-2 ชม.)',
    'form.chip15m': '15 นาที/วัน',
    'form.chip30m': '30 นาที/วัน',
    'form.chip1h': '1 ชม./วัน',
    'form.chip2h': '2 ชม./วัน',
    'form.chip3h': '3+ ชม./วัน',
    'form.timeSummary': 'การแปลงเวลาใช้งาน:',
    'form.timeSummaryDaily': 'วันละ {val} ชม.',
    'form.timeSummaryMonthly': '~{val} ชม./เดือน',
    'form.timeSummaryYearly': '~{val} ชม./ปี',
    'form.avgCostPerHour': 'ต้นทุนเฉลี่ยต่อชั่วโมง:',
    'form.cancel': 'ยกเลิก (Cancel)',
    'form.save': 'บันทึกข้อมูล',
    'form.saving': 'กำลังบันทึก...',

    // Quadrant Diagnoses
    'diag.killZone': 'ไม่คุ้มค่าอย่างยิ่ง! (Kill Zone)',
    'diag.silentBleed': 'เสี่ยงเสียเปล่า (ใช้น้อย)',
    'diag.premium': 'คุ้มค่าสมราคา (ใช้งานสม่ำเสมอ)',
    'diag.bargain': 'คุ้มค่ามาก! (ต้นทุนต่ำมากต่อ ชม.)',

    // Assessment Page
    'assess.title': 'แบบประเมินเกณฑ์ความคุ้มค่าเฉพาะบุคคล',
    'assess.subtitle': 'ปรับแต่งลำดับความสำคัญของหมวดหมู่ เพื่อสร้าง Matrix คำนวณความคุ้มค่าที่ตรงกับวิถีชีวิตของคุณ',
    'assess.methodTitle': 'เกณฑ์อ้างอิงตามหลักการเงินและพฤติกรรมคนหมู่มาก (Research & Benchmarks)',
    'assess.method1Title': '1. กฎการเงิน 50/30/20 (Elizabeth Warren)',
    'assess.method1Desc': 'Subscription ถูกจัดอยู่ในหมวด "Wants" (ความต้องการ) ซึ่งไม่ควรเกิน 30% ของรายได้ และต้องสร้างความคุ้มค่าต่อเวลาอย่างแท้จริง',
    'assess.method2Title': '2. เกณฑ์ต้นทุนต่อชั่วโมงมีส่วนร่วม (Cost per Engagement Hour)',
    'assess.method2Desc': 'งานวิจัยของ Statista & Bureau of Labor Statistics ระบุว่า สตรีมมิ่งความบันเทิงควรมีต้นทุน < $0.50 - $1.00/ชม. หากสูงเกิน $2.50/ชม. หรือใช้น้อยกว่า 15 นาที/วัน ถือเป็น Zombie Subscription ที่ควรยกเลิก',
    'assess.method3Title': '3. การปรับเกณฑ์เฉพาะบุคคล (Personalized Value Matrix)',
    'assess.method3Desc': 'บริการในหมวดที่คุณให้ความสำคัญสูงสุด (เช่น งาน หรือ สุขภาพ) ระบบจะยอมรับต้นทุนต่อชั่วโมงได้ยืดหยุ่นกว่า ส่วนหมวดที่สำคัญต่ำจะถูกตรวจจับความคุ้มค่าอย่างเข้มงวด',
    'assess.priorityLabel': 'จัดลำดับความสำคัญของแต่ละหมวดหมู่:',
    'assess.priorityHigh': 'สำคัญมากที่สุด (High Priority)',
    'assess.priorityMed': 'สำคัญปานกลาง (Medium Priority)',
    'assess.priorityLow': 'สำคัญน้อย / ฟุ่มเฟือย (Low Priority)',
    'assess.saveBtn': 'บันทึกเกณฑ์ความคุ้มค่าเฉพาะบุคคล',
    'assess.savedToast': 'บันทึกเกณฑ์ความคุ้มค่าเรียบร้อยแล้ว!',

    // Dialogs
    'dialog.confirmCancelTitle': 'ย้ายไปที่ Graveyard (ยกเลิกบริการ)',
    'dialog.confirmCancelMsg': 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิก "{name}"? บริการนี้จะถูกย้ายไปที่สุสาน Graveyard และนับเป็นเงินที่ประหยัดได้',
    'dialog.confirmCancelBtn': 'ยกเลิกบริการ (ส่งไปสุสาน)',
    'dialog.confirmDeleteTitle': 'ลบข้อมูลถาวร',
    'dialog.confirmDeleteMsg': 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูล "{name}" อย่างถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้',
    'dialog.confirmDeleteBtn': 'ลบถาวร',
    'dialog.cancel': 'ยกเลิก',

    // Auth
    'auth.signinTitle': 'เข้าสู่ระบบ (Sign In)',
    'auth.signinSubtitle': 'ใส่อีเมลและรหัสผ่านเพื่อเข้าใช้งาน หรือคลิกเปิดโหมดทดสอบได้ทันที',
    'auth.signupTitle': 'สร้างบัญชีใหม่ (Create Account)',
    'auth.signupSubtitle': 'กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบวิเคราะห์ความคุ้มค่า',
    'auth.demoBtn': 'เปิดโหมดทดสอบพร้อมข้อมูลจำลอง (Demo Mode)',
    'auth.noAccount': 'ยังไม่มีบัญชีผู้ใช้?',
    'auth.hasAccount': 'มีบัญชีผู้ใช้อยู่แล้ว?',
    'auth.signupLink': 'สมัครสมาชิกฟรี',
    'auth.signinLink': 'เข้าสู่ระบบที่นี่',
  },
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.subscriptions': 'Subscriptions',
    'nav.assessment': 'Value Assessment',
    'nav.demo': 'DEMO MODE',
    'nav.signout': 'Sign Out',
    'nav.tagline': 'Smart Time-Usage Analytics',
    'nav.pro': 'PRO',

    // Dashboard Page
    'dashboard.title': 'Dashboard Overview',
    'dashboard.subtitle': 'Analyze subscription value based on actual daily/monthly usage and eliminate zombie spend',
    'dashboard.manageAll': 'Manage All',
    'dashboard.addSubscription': 'Add Subscription',
    'dashboard.killCandidatesTitle': 'High-Priority Cancellation Targets (Kill Zone)',
    'dashboard.killCandidatesDesc': 'You have {count} subscriptions with high cost but low usage. Canceling will save {monthly}/mo ({yearly}/yr)',
    'dashboard.killAction': 'Send to Graveyard',
    'dashboard.usedHours': 'Used {hours}h/mo',
    'dashboard.matrixBadge': 'Personalized Matrix',
    'dashboard.matrixBadgeDesc': 'Calibrated to your category priorities and the 50/30/20 rule',
    'dashboard.reassess': 'Customize Matrix',

    // Stats Cards
    'stats.monthlyBurn': 'Monthly Burn Rate',
    'stats.monthlyUnit': '/mo',
    'stats.yearlyEst': 'Est. {val}/yr',
    'stats.activeCount': '{count} active',
    'stats.totalUsage': 'Total Usage Hours',
    'stats.hoursUnit': 'hrs/mo',
    'stats.avgPerApp': 'Avg {val} hrs/app',
    'stats.costPerHour': 'Avg Cost Per Hour ($/hr)',
    'stats.costPerHourUnit': '/hr',
    'stats.costGood': 'Exceptional value efficiency',
    'stats.costReview': 'Review underused apps',
    'stats.killZoneWaste': 'Kill Zone Waste',
    'stats.killZoneTarget': '{count} barely-used subs',
    'stats.killZoneSafe': 'Safe',
    'stats.killZoneCancelTarget': 'Cancel Candidate',
    'stats.graveyardSavings': 'Graveyard Savings',
    'stats.graveyardYearly': '+{val}/yr',

    // Insights
    'insight.efficiencyTitle': 'Usage Efficiency',
    'insight.efficiencyDesc': 'You average {hours} hrs/app monthly with a blended usage cost of {cost} / hour.',
    'insight.spendTitle': 'Average Spend',
    'insight.spendDesc': 'Average active subscription costs {cost}/mo. Purging unused services preserves discretionary cash flow.',
    'insight.roiTitle': 'Graveyard ROI',
    'insight.roiDesc': 'You have cancelled {count} zombie services, saving +{cost} per year in recurring burn.',

    // Subscriptions Page
    'subs.title': 'Subscriptions',
    'subs.subtitle': 'Track recurring commitments and monitor daily engagement time',
    'subs.exportCsv': 'Export CSV',
    'subs.add': 'Add Subscription',
    'subs.filterActive': 'Active',
    'subs.filterGraveyard': 'Graveyard',
    'subs.filterAll': 'All',
    'subs.searchPlaceholder': 'Search subscriptions or categories...',
    'subs.emptyTitle': 'No Subscriptions Found',
    'subs.emptyDesc': 'No subscriptions match your query. Adjust filters or add a new recurring service.',
    'subs.emptyAdd': 'Add Subscription',
    'subs.activeMetric': 'Active Subscriptions',
    'subs.activeOfTotal': 'out of {total} total',
    'subs.totalTimeMetric': 'Total engagement {hours} hrs/mo',
    'subs.burnMetric': 'Monthly Burn',
    'subs.savedMetric': 'Graveyard Savings',
    'subs.savedFromCount': '+{val}/yr from {count} killed',

    // Card
    'card.cost': 'Cost',
    'card.perMonth': '/mo',
    'card.perYear': '/yr',
    'card.daily': '{val}/day',
    'card.monthly': '{val} hrs/mo',
    'card.avgPerHour': 'Avg {val}/hr',
    'card.active': 'Active',
    'card.cancelled': 'Cancelled',
    'card.savedYearly': 'Saved +{val}/yr',
    'card.edit': 'Edit',
    'card.kill': 'Kill',
    'card.restore': 'Restore',
    'card.delete': 'Delete',

    // Form
    'form.titleNew': 'New Subscription',
    'form.titleEdit': 'Edit Subscription',
    'form.subtitle': 'Enter recurring cost and average daily engagement time to evaluate value',
    'form.quickPresets': 'Quick Presets (Official Brand Logos)',
    'form.quickPresetsSub': 'Click to auto-populate',
    'form.nameLabel': 'Subscription Name *',
    'form.namePlaceholder': 'e.g. YouTube Premium, Netflix, ChatGPT',
    'form.categoryLabel': 'Category',
    'form.costLabel': 'Subscription Cost *',
    'form.billingPlan': 'Billing Plan',
    'form.monthlyPlan': 'Monthly',
    'form.yearlyPlan': 'Yearly',
    'form.dailyQuestion': 'How many hours per day do you use this service? (Daily Usage)',
    'form.dailyRule': 'Value Rule: Automatically converted to Monthly/Yearly. Low engagement = Waste (Zombie Sub)',
    'form.dailyUnit': 'hrs/day',
    'form.dailyZero': '0 hrs (Never opened)',
    'form.dailyMax': '5+ hrs/day',
    'form.chipRare': 'Rarely (1-2 hrs/week)',
    'form.chip15m': '15 min/day',
    'form.chip30m': '30 min/day',
    'form.chip1h': '1 hr/day',
    'form.chip2h': '2 hrs/day',
    'form.chip3h': '3+ hrs/day',
    'form.timeSummary': 'Engagement Projections:',
    'form.timeSummaryDaily': '{val} hrs/day',
    'form.timeSummaryMonthly': '~{val} hrs/mo',
    'form.timeSummaryYearly': '~{val} hrs/yr',
    'form.avgCostPerHour': 'Estimated Cost Per Hour:',
    'form.cancel': 'Cancel',
    'form.save': 'Save Subscription',
    'form.saving': 'Saving...',

    // Quadrant Diagnoses
    'diag.killZone': 'High Waste! (Kill Zone Candidate)',
    'diag.silentBleed': 'Silent Bleeder (Low Engagement)',
    'diag.premium': 'Worth Every Penny (Consistent High Value)',
    'diag.bargain': 'Bargain Hero (Ultra-low Cost per Hour)',

    // Assessment Page
    'assess.title': 'Personalized Value Matrix Assessment',
    'assess.subtitle': 'Prioritize subscription categories to tailor evaluation thresholds to your lifestyle',
    'assess.methodTitle': 'Research Benchmarks & Behavioral Economics',
    'assess.method1Title': '1. The 50/30/20 Rule (Senator Elizabeth Warren)',
    'assess.method1Desc': 'Subscriptions fall under "Discretionary Wants" (max 30% of net income). Every service must provide tangible utility per dollar spent.',
    'assess.method2Title': '2. Cost per Engagement Hour Benchmarks',
    'assess.method2Desc': 'Statista & Bureau of Labor Statistics show benchmark streaming cost is <$0.50-$1.00/hr. Costs >$2.50/hr or usage <15 mins/day qualify as "Zombie Subscriptions".',
    'assess.method3Title': '3. Personalized Priority Tuning',
    'assess.method3Desc': 'Categories you rank highest (e.g. Work or Health) have higher cost tolerance, while lower-priority services face strict underutilization detection.',
    'assess.priorityLabel': 'Set Priority Level for Each Category:',
    'assess.priorityHigh': 'High Priority',
    'assess.priorityMed': 'Medium Priority',
    'assess.priorityLow': 'Low Priority',
    'assess.saveBtn': 'Save Priority Calibration',
    'assess.savedToast': 'Personalized Value Matrix saved successfully!',

    // Dialogs
    'dialog.confirmCancelTitle': 'Send to Graveyard (Cancel Subscription)',
    'dialog.confirmCancelMsg': 'Are you sure you want to cancel "{name}"? It will be moved to the Graveyard and recorded as realized savings.',
    'dialog.confirmCancelBtn': 'Cancel Subscription',
    'dialog.confirmDeleteTitle': 'Delete Record Permanently',
    'dialog.confirmDeleteMsg': 'Are you sure you want to permanently delete "{name}"? This action cannot be undone.',
    'dialog.confirmDeleteBtn': 'Delete Permanently',
    'dialog.cancel': 'Cancel',

    // Auth
    'auth.signinTitle': 'Sign In',
    'auth.signinSubtitle': 'Enter your credentials or launch the interactive demo instantly',
    'auth.signupTitle': 'Create Account',
    'auth.signupSubtitle': 'Sign up free to begin tracking subscription engagement',
    'auth.demoBtn': 'Launch Interactive Demo (Preloaded)',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupLink': 'Sign up free',
    'auth.signinLink': 'Sign in here',
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'th',
  setLanguage: () => {},
  t: (k) => k,
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language
    return saved === 'en' || saved === 'th' ? saved : 'th'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.th
    let text = dict[key] || TRANSLATIONS.en[key] || key

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val))
      })
    }
    return text
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
export default LanguageContext
