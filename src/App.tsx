/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useRef } from 'react';
import { 
  Plane, 
  Mail, 
  Printer, 
  Receipt, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2, 
  ChevronDown,
  ArrowRight,
  Info,
  CircleDollarSign,
  Wallet,
  PlaneTakeoff,
  PlaneLanding,
  Download,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      appName: "Globetix",
      login: "Login",
      eticket: "ETICKET",
      email: "EMAIL",
      print: "PRINT",
      expense: "EXPENSE",
      ical: "ICAL",
      feedback: "FEEDBACK",
      signupBanner: "Create an account to save your trips and access them anytime",
      signup: "SIGN UP",
      myTrip: "My Trip",
      printTicket: "Print Ticket",
      downloadPdf: "Download PDF",
      expandAll: "Expand All",
      collapse: "Collapse",
      expand: "Expand",
      confirmed: "Confirmed",
      airlineFlight: "Airline & Flight",
      aircraft: "Aircraft",
      departure: "DEPARTURE",
      arrival: "ARRIVAL",
      duration: "2H 20M",
      nonStop: "NON-STOP",
      directFlight: "Direct Flight",
      passengers: "PASSENGERS",
      name: "Name",
      ticketNumber: "Ticket Number",
      specialServices: "Special Services",
      infant: "Infant",
      viewDetails: "View Details",
      classOfService: "Class Of Service: Economy",
      airportInfo: "AIRPORT INFO",
      flightInfo: "FLIGHT INFO",
      to: "to",
      bookingSummary: "Booking Summary",
      flightId: "Flight ID",
      fareBreakdown: "Fare Breakdown & Passenger Details",
      description: "Description",
      net: "Net",
      gross: "Gross",
      tax: "Net (Tax)",
      total: "Total (EGP)",
      seatsBooked: "Number of Seats Booked",
      totalBookingAmount: "Total Booking Amount:",
      totalSalesAmount: "Total Sales Amount",
      totalNetAmount: "Total Net Amount",
      help: "Help",
      reservationCode: "Your Reservation Code:",
      branch: "VCT BRANCH 3",
      termsOfUse: "Terms Of Use",
      privacyPolicy: "Privacy Policy",
      siteFeedback: "Site Feedback",
      changeLang: "Change Language",
      langName: "العربية",
      dateRange: "THU, JUN 25, 2026",
      routeDescription: "Cairo (CAI) to Taif (TIF)",
      airlineName: "Nesma Airlines (NE) 130",
      terminalName1: "Terminal 1",
      terminalNameMain: "Main Terminal",
      airportNameCAI: "Cairo International Airport",
      airportNameTIF: "Taif International Airport",
      cityCAI: "Cairo, EG",
      cityTIF: "Taif, SA",
      aircraftModel: "Airbus A321",
      bookingDetails: "CAI - TIF | 25-06-2026 | Number of Seats Booked: 6"
    },
    ar: {
      appName: "جلوبيتكس",
      login: "تسجيل الدخول",
      eticket: "تذكرة إلكترونية",
      email: "بريد إلكتروني",
      print: "طباعة",
      expense: "مصاريف",
      ical: "تقويم",
      feedback: "ملاحظات",
      signupBanner: "أنشئ حساباً لحفظ رحلاتك والوصول إليها في أي وقت",
      signup: "سجل الآن",
      myTrip: "رحلتي",
      printTicket: "طباعة التذكرة",
      downloadPdf: "تحميل PDF",
      expandAll: "توسيع الكل",
      collapse: "طوي",
      expand: "توسيع",
      confirmed: "مؤكد",
      airlineFlight: "شركة الطيران والرحلة",
      aircraft: "الطائرة",
      departure: "المغادرة",
      arrival: "الوصول",
      duration: "ساعتان و20 دقيقة",
      nonStop: "بدون توقف",
      directFlight: "رحلة مباشرة",
      passengers: "المسافرون",
      name: "الاسم",
      ticketNumber: "رقم التذكرة",
      specialServices: "خدمات خاصة",
      infant: "رضيع",
      viewDetails: "عرض التفاصيل",
      classOfService: "درجة الخدمة: سياحية",
      airportInfo: "معلومات المطار",
      flightInfo: "معلومات الرحلة",
      to: "إلى",
      bookingSummary: "ملخص الحجز",
      flightId: "رقم الرحلة",
      fareBreakdown: "توزيع الأجرة وتفاصيل المسافرين",
      description: "الوصف",
      net: "صافي",
      gross: "إجمالي",
      tax: "صافي (الضريبة)",
      total: "المجموع (ج.م)",
      seatsBooked: "عدد المقاعد المحجوزة",
      totalBookingAmount: "إجمالي مبلغ الحجز:",
      totalSalesAmount: "إجمالي مبلغ المبيعات",
      totalNetAmount: "إجمالي المبلغ الصافي",
      help: "مساعدة",
      reservationCode: "رمز الحجز الخاص بك:",
      branch: "فرع VCT 3",
      termsOfUse: "شروط الاستخدام",
      privacyPolicy: "سياسة الخصوصية",
      siteFeedback: "ملاحظات الموقع",
      changeLang: "تغيير اللغة",
      langName: "English",
      dateRange: "الخميس، 25 يونيو 2026",
      routeDescription: "القاهرة (CAI) إلى الطائف (TIF)",
      airlineName: "نيسما للطيران (NE) 130",
      terminalName1: "مبنى الركاب 1",
      terminalNameMain: "المبنى الرئيسي",
      airportNameCAI: "مطار القاهرة الدولي",
      airportNameTIF: "مطار الطائف الدولي",
      cityCAI: "القاهرة، مصر",
      cityTIF: "الطائف، السعودية",
      aircraftModel: "إيرباص A321",
      bookingDetails: "القاهرة - الطائف | 25-06-2026 | عدد المقاعد المحجوزة: 6"
    }
  }[lang];

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  const downloadPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      setIsDownloading(true);
      
      // Hide elements with data-pdf-exclude
      const excludeElements = contentRef.current.querySelectorAll('[data-pdf-exclude]');
      excludeElements.forEach(el => (el as HTMLElement).style.display = 'none');

      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });
      
      // Restore hidden elements
      excludeElements.forEach(el => (el as HTMLElement).style.display = 'flex');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Globetix-Itinerary.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const passengers = [
    { name: "MOHAMED, MOSTAFAMR", ticket: "0701234567890", services: "Infant: Mohamed/aishamiss 07oct24" },
    { name: "MOHAMED, AISHAMISS (Infant)", ticket: "0701234567892", services: "" },
    { name: "MAHDY, NESMAMRS", ticket: "0701234567893", services: "" },
    { name: "MOHAMED, YOUSSEFMR", ticket: "0701234567894", services: "" },
    { name: "MOHAMED, YASSINMSTR (Child)", ticket: "0701234567895", services: "" },
    { name: "MOHAMED, KHADIGAMISS (Child)", ticket: "0701234567896", services: "" },
  ];

  const bookingSummary = {
    flightId: "NDCEG-BR-F260517yXL9yC",
    items: [
      { type: "3ADT", net: "9,498.000", gross: "9,498.000", tax: "17,243.400", total: "26,741.400" },
      { type: "2CHD", net: "6,332.000", gross: "6,332.000", tax: "11,495.600", total: "17,827.600" },
      { type: "1INF", net: "705.000", gross: "705.000", tax: "2,023.800", total: "2,728.800" },
    ],
    totalBooking: "47,297.800",
    totalSales: "47,297.800 EGP",
    totalNet: "47,297.800 EGP"
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#222]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <main ref={contentRef} className="mx-auto w-full max-w-[970px] bg-white shadow-xl min-h-screen pb-10">
        {/* Header */}
        <header className="bg-[#08729b] h-[54px] px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ffe3b8] flex items-center justify-center text-[#08729b] font-bold text-xl">
              G
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#ffe3b8]">{t.appName}</span>
          </div>
            <div className="flex items-center gap-3">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a8cb1] hover:bg-[#349cc4] transition-colors rounded-lg text-xs font-bold cursor-pointer group shadow-sm border border-white/10"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-[10px]">{lang === 'ar' ? 'EN' : 'AR'}</span>
              </div>
              {t.langName}
            </button>
            <button className="bg-[#2a8cb1] hover:bg-[#349cc4] transition-colors text-white border-0 rounded-lg py-1.5 px-4.5 text-sm flex items-center gap-1 cursor-pointer shadow-sm">
              {t.login} <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className={`bg-[#07597e] h-12 flex items-center ${lang === 'ar' ? 'justify-start' : 'justify-end'} px-4 gap-6 text-white`}>
          <NavItem icon={<Plane size={16} />} label={t.eticket} />
          <NavItem icon={<Mail size={16} />} label={t.email} />
          <NavItem icon={<Printer size={16} />} label={t.print} />
          <NavItem icon={<Receipt size={16} />} label={t.expense} />
          <NavItem icon={<CalendarIcon size={16} />} label={t.ical} />
          <NavItem icon={<MessageSquare size={16} />} label={t.feedback} />
        </nav>

        {/* Signup Banner */}
        <section className={`mx-2.5 my-3.5 border border-dashed border-gray-300 h-[103px] flex items-center px-6 bg-white gap-10 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <div className="w-[66px] h-[66px] rounded-full bg-[#07597e] flex items-center justify-center text-[#ffe3b8] text-3xl font-bold shrink-0 shadow-sm border border-gray-200">
            G
          </div>
          <p className="text-lg text-[#333] flex-1 font-medium italic">
            {t.signupBanner}
          </p>
          <button className="w-[208px] h-9 bg-[#67be18] hover:bg-[#78d022] transition-all text-white border-0 shadow-[0_2px_5px_rgba(0,0,0,0.22)] text-sm font-bold tracking-wide rounded-sm cursor-pointer uppercase">
            {t.signup}
          </button>
        </section>

        {/* Trip Content */}
        <section className="bg-[#efefef] px-1.5 py-3.5 pt-4 pb-5">
          <div className={`flex items-center justify-between mb-3 mx-2.5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <h1 className="text-2xl font-light text-black">{t.myTrip}</h1>
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`} data-pdf-exclude="true">
              <button 
                onClick={() => window.print()}
                className={`bg-white border border-[#08729b] text-[#08729b] hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                <Printer size={18} />
                <span>{t.printTicket}</span>
              </button>
              <button 
                onClick={downloadPDF}
                disabled={isDownloading}
                className={`bg-[#67be18] hover:bg-[#78d022] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{t.downloadPdf}</span>
              </button>
            </div>
          </div>

          <article className="bg-white border border-[#c7c7c7] shadow-md p-2 pt-2 pb-5 min-h-[535px] relative">
            {/* Control Buttons */}
            <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-[-45px] flex items-center gap-4`}>
              <button 
                onClick={() => setIsExpanded(true)}
                className="flex flex-col items-center gap-0.5 text-[#0b92db] text-[9px] font-bold hover:opacity-80 transition-opacity cursor-pointer uppercase"
              >
                <PlusCircle size={24} strokeWidth={1.5} />
                {t.expandAll}
              </button>
            </div>
            
            <div className="flex justify-start mb-4 px-2">
               <button 
                onClick={() => setIsExpanded(prev => !prev)}
                className={`${lang === 'ar' ? 'mr-auto' : 'ml-auto'} flex flex-col items-center gap-0.5 text-[#0b92db] text-[9px] font-bold hover:opacity-80 transition-opacity cursor-pointer uppercase`}
              >
                {isExpanded ? <MinusCircle size={24} strokeWidth={1.5} /> : <PlusCircle size={24} strokeWidth={1.5} />}
                {isExpanded ? t.collapse : t.expand}
              </button>
            </div>

            <div className={`px-2 mb-4 text-sm text-[#333] border-b border-gray-100 pb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="font-bold uppercase tracking-tight">{t.dateRange}</span>
              <span className="mx-2">—</span>
              {t.routeDescription}
              <span className="mx-2">—</span>
              <span className="text-[#68bd19] font-medium flex inline-flex items-center gap-1">
                {t.confirmed} <CheckCircle2 size={14} fill="#68bd19" stroke="white" />
              </span>
            </div>

            <div className="px-2 mb-8">
              <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 bg-gray-50 p-3 px-4 rounded-full border border-gray-100 shadow-sm ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#07597e] border border-gray-100 shadow-xs">
                    <Plane className={`${lang === 'ar' ? '-rotate-90' : 'rotate-90'} shrink-0`} size={20} fill="#07597e" strokeWidth={1.5} />
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">{t.airlineFlight}</div>
                    <span className="text-lg text-[#333] font-bold tracking-tight">{t.airlineName}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                   <div className={`hidden sm:flex flex-col ${lang === 'ar' ? 'items-start' : 'items-end'}`}>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">{t.aircraft}</div>
                      <span className="text-sm font-semibold text-gray-600">{t.aircraftModel}</span>
                   </div>
                </div>
              </div>

              <div className={`flex items-stretch gap-2 md:gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                {/* Depart block */}
                <div className="flex-1 bg-[#f3f9fb] border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center relative hover:border-gray-300 transition-colors">
                  <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} text-[#08729b] opacity-20`}>
                    <PlaneTakeoff size={32} />
                  </div>
                  <div className="text-[10px] text-[#08729b] font-black uppercase tracking-[0.2em] mb-4 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-xs">{t.departure}</div>
                  
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-black text-[#111] tabular-nums tracking-tighter">10:15</span>
                    <span className="text-lg font-bold text-gray-400 uppercase">{lang === 'ar' ? 'ص' : 'am'}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center">
                    <div className="text-3xl font-black text-[#08729b] tracking-tighter leading-none">CAI</div>
                    <div className="text-xs text-gray-500 font-bold mt-2 text-center max-w-[120px] leading-tight">{t.airportNameCAI}</div>
                    <div className="text-[10px] text-gray-400 font-medium mt-1">{t.terminalName1}</div>
                  </div>
                </div>

                {/* Journey Separator */}
                <div className="flex flex-col items-center justify-center gap-4 px-1 md:px-2">
                  <div className="h-full w-[2px] relative" style={{ background: 'linear-gradient(to bottom, transparent, #e5e7eb, transparent)' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                       <div className="bg-white border border-gray-100 p-2 rounded-full shadow-sm">
                          <ArrowRight className={`text-[#67be18] ${lang === 'ar' ? 'rotate-180' : ''}`} size={20} strokeWidth={3} />
                       </div>
                       <div className="whitespace-nowrap bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-widest rotate-270 origin-center absolute -mt-1">
                          {t.duration}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Arrive block */}
                <div className="flex-1 bg-[#f7fcf3] border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center relative hover:border-gray-300 transition-colors">
                  <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} text-[#67be18] opacity-20`}>
                    <PlaneLanding size={32} />
                  </div>
                  <div className="text-[10px] text-[#67be18] font-black uppercase tracking-[0.2em] mb-4 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-xs">{t.arrival}</div>
                  
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-black text-[#111] tabular-nums tracking-tighter">12:35</span>
                    <span className="text-lg font-bold text-gray-400 uppercase">{lang === 'ar' ? 'م' : 'pm'}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center">
                    <div className="text-3xl font-black text-[#67be18] tracking-tighter leading-none">TIF</div>
                    <div className="text-xs text-gray-500 font-bold mt-2 text-center max-w-[120px] leading-tight">{t.airportNameTIF}</div>
                    <div className="text-[10px] text-gray-400 font-medium mt-1">{t.terminalNameMain}</div>
                  </div>
                </div>
              </div>

              <div className={`mt-6 flex items-center justify-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="h-[1px] flex-1" style={{ background: `linear-gradient(to ${lang === 'ar' ? 'left' : 'right'}, transparent, #e5e7eb)` }}></div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#67be18]" />
                  {t.directFlight}
                </div>
                <div className="h-[1px] flex-1" style={{ background: `linear-gradient(to ${lang === 'ar' ? 'right' : 'left'}, transparent, #e5e7eb)` }}></div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-2 overflow-hidden"
                >
                  <label className={`block text-[11px] text-[#47749b] font-bold uppercase mb-2 ${lang === 'ar' ? 'mr-14' : 'ml-14'}`}>{t.passengers}</label>
                  
                  <div className={`${lang === 'ar' ? 'mr-14' : 'ml-14'} w-[88%] border border-[#333] rounded-sm overflow-hidden`}>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#07597e] text-white">
                          <th className={`text-left py-1 px-2 font-medium text-[12px] ${lang === 'ar' ? 'border-l' : 'border-r'} border-[#333]/30`}>{t.name}</th>
                          <th className={`text-left py-1 px-2 font-medium text-[12px] w-[25%] ${lang === 'ar' ? 'border-l' : 'border-r'} border-[#333]/30`}>{t.ticketNumber}</th>
                          <th className="text-left py-1 px-2 font-medium text-[12px] w-[34%]">{t.specialServices}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengers.map((p, i) => (
                          <tr 
                            key={i} 
                            className={`
                              transition-all duration-150 border-b border-gray-100 last:border-b-0
                              ${i % 2 === 0 ? "bg-white" : "bg-[#eaf6ff]"} 
                              hover:bg-[#d0e9ff] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.02)]
                            `}
                          >
                            <td className={`py-2 px-2 border-gray-200 ${lang === 'ar' ? 'border-l text-right' : 'border-r text-left'}`}>
                              <div className="font-semibold text-[#333]">{p.name}</div>
                              {p.services && (
                                <div className={`mt-3 flex items-start gap-2 text-xs ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                  <div className="w-4 h-4 bg-[#0b69a3] rounded-sm flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={10} className="text-white" />
                                  </div>
                                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                    <strong className="block text-[#111]">{t.infant}</strong>
                                    <span className="text-gray-600 italic">{p.services.split(': ')[1]}</span>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className={`py-2 px-2 text-[#444] font-medium border-gray-200 font-mono ${lang === 'ar' ? 'border-l text-right' : 'border-r text-left'}`}>
                              {p.ticket}
                            </td>
                            <td className={`py-2 px-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                              {i === 0 && (
                                <div className={`flex flex-col ${lang === 'ar' ? 'items-end' : 'items-start'}`}>
                                  <div className="w-4 h-4 bg-[#0b69a3] rounded-sm flex items-center justify-center mb-1">
                                    <CheckCircle2 size={10} className="text-white" />
                                  </div>
                                  <a href="#" className="text-[9px] text-[#0b92db] hover:underline font-bold mt-1">{t.viewDetails}</a>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={`${lang === 'ar' ? 'mr-14' : 'ml-14'} mt-6 text-sm text-[#333] space-y-4`}>
                    <div className="font-medium">{t.classOfService}</div>
                    
                    <div className="space-y-1 pt-2">
                      <div className="text-[11px] text-[#47749b] font-bold uppercase">{t.airportInfo}</div>
                      <a href="#" className="text-[#1594e6] hover:underline block font-medium">{t.airportNameCAI} ({lang === 'ar' ? 'CAI' : 'CAI'})</a>
                      <span className="text-[#1594e6] block font-medium">{t.cityCAI}</span>
                    </div>

                    <div className={`flex items-center gap-3 py-2 w-[500px] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className="h-[1px] border-t border-dashed border-gray-400 flex-1"></div>
                      <span className="text-gray-500 font-italic">{t.to}</span>
                      <div className="h-[1px] border-t border-dashed border-gray-400 flex-1"></div>
                    </div>

                    <div className="space-y-1">
                      <a href="#" className="text-[#1594e6] hover:underline block font-medium">{t.airportNameTIF} ({lang === 'ar' ? 'TIF' : 'TIF'})</a>
                      <span className="text-[#1594e6] block font-medium">{t.cityTIF}</span>
                    </div>

                    <div className="pt-4 pb-2">
                      <div className="text-[11px] text-[#47749b] font-bold uppercase mb-1">{t.flightInfo}</div>
                      <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Info size={16} className="text-[#07597e]" />
                        <span className="font-medium text-gray-700 underline decoration-dotted underline-offset-4">{t.aircraftModel}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          {/* Booking Summary Card */}
          <article className="mt-6 bg-white border border-[#c7c7c7] shadow-md overflow-hidden rounded-sm">
            <div className={`bg-[#07597e] text-white p-3 px-4 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <CircleDollarSign size={20} className="text-[#ffe3b8]" />
                <h2 className="text-lg font-bold uppercase tracking-tight">{t.bookingSummary}</h2>
              </div>
              <div className={`text-xs opacity-80 font-mono ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{t.flightId}: {bookingSummary.flightId}</div>
            </div>
            
            <div className="p-4 px-6">
              <div className={`mb-4 text-xs font-bold text-[#47749b] uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Info size={14} />
                {t.fareBreakdown}
              </div>
              
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`bg-gray-50 border-b border-gray-100 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <th className={`${lang === 'ar' ? 'text-right' : 'text-left'} py-2.5 px-4 font-bold text-gray-500 uppercase text-[10px]`}>{t.description}</th>
                      <th className={`${lang === 'ar' ? 'text-left' : 'text-right'} py-2.5 px-4 font-bold text-gray-500 uppercase text-[10px]`}>{t.net}</th>
                      <th className={`${lang === 'ar' ? 'text-left' : 'text-right'} py-2.5 px-4 font-bold text-gray-500 uppercase text-[10px]`}>{t.gross}</th>
                      <th className={`${lang === 'ar' ? 'text-left' : 'text-right'} py-2.5 px-4 font-bold text-gray-500 uppercase text-[10px]`}>{t.tax}</th>
                      <th className={`${lang === 'ar' ? 'text-left' : 'text-right'} py-2.5 px-4 font-bold text-gray-500 uppercase text-[10px] bg-[#67be18]/5 text-[#67be18]`}>{t.total}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="bg-gray-50 italic text-[#2a8cb1]">
                      <td colSpan={5} className={`py-2 px-4 text-xs font-medium border-b border-gray-50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t.bookingDetails}
                      </td>
                    </tr>
                    {bookingSummary.items.map((item, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <td className={`py-3 px-4 font-bold text-[#07597e] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.type}</td>
                        <td className={`py-3 px-4 text-right font-mono text-gray-600 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{item.net}</td>
                        <td className={`py-3 px-4 text-right font-mono text-gray-600 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{item.gross}</td>
                        <td className={`py-3 px-4 text-right font-mono text-gray-600 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{item.tax}</td>
                        <td className={`py-3 px-4 text-right font-mono font-bold text-black bg-[#f7fcf3] ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={`bg-gray-900 text-white ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <td colSpan={4} className={`py-3 px-4 font-bold uppercase text-[11px] ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{t.totalBookingAmount}</td>
                      <td className={`py-3 px-4 text-right font-black text-lg bg-[#e1f2d1] text-[#07597e] ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{bookingSummary.totalBooking}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className={`mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-[#efefef] p-4 rounded-xl border border-gray-200 flex items-center gap-4 group hover:border-[#07597e]/30 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#67be18] shadow-sm">
                    <Wallet size={24} />
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{t.totalSalesAmount}</div>
                    <div className="text-xl font-black text-gray-900 group-hover:text-[#07597e] transition-colors">{bookingSummary.totalSales}</div>
                  </div>
                </div>
                
                <div className={`bg-[#efefef] p-4 rounded-xl border border-gray-200 flex items-center gap-4 group hover:border-[#67be18]/30 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#07597e] shadow-sm">
                    <CircleDollarSign size={24} />
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{t.totalNetAmount}</div>
                    <div className="text-xl font-black text-gray-900 group-hover:text-[#67be18] transition-colors">{bookingSummary.totalNet}</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Help Section */}
        <section className="mt-8 border-t border-gray-200">
          <h2 className={`bg-[#239bd0] text-white text-lg font-medium px-4 py-2.5 m-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.help}</h2>
          <div className={`bg-white p-4 px-6 min-h-[118px] text-[14px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className={`text-lg mb-3 tracking-tight ${lang === 'ar' ? 'flex flex-row-reverse gap-2 justify-end' : ''}`}>
              <span>{t.reservationCode}</span> <strong className="font-bold text-black border-b-2 border-[#67be18]">GX7WK0</strong>
            </div>
            <div className="font-bold text-[#111] mb-1">{t.branch}</div>
            <address className="not-italic text-[#1594e6] leading-tight font-medium">
              6 Bostan Street<br />
              Cairo, 00<br />
              {lang === 'ar' ? 'مصر' : 'Egypt'}
            </address>
          </div>
        </section>

        {/* Footer */}
        <footer className={`bg-[#07597e] min-h-[80px] p-4 px-6 flex flex-col md:flex-row justify-between items-center text-white gap-4 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
          <div className={`text-xs leading-relaxed text-center ${lang === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
            <div className={`flex flex-wrap items-center justify-center ${lang === 'ar' ? 'md:justify-end flex-row-reverse' : 'md:justify-start'} gap-x-2 gap-y-1 mb-2 font-bold opacity-90`}>
              <a href="#" className="hover:underline">{t.termsOfUse}</a>
              <span className="opacity-40">|</span>
              <a href="#" className="hover:underline">{t.privacyPolicy}</a>
              <span className="opacity-40">|</span>
              <a href="#" className="hover:underline">{t.siteFeedback}</a>
              <span className="opacity-40">|</span>
              <a href="#" className="hover:underline">{t.changeLang}</a>
            </div>
            <div className="opacity-70">©2026 {t.appName}.</div>
            <div className="opacity-50 font-mono text-[10px] mt-0.5">v26.1.0</div>
          </div>
          
          <div className={`flex items-center gap-2.5 font-bold tracking-[0.2em] text-lg select-none ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="w-5 h-5 rounded-full bg-[#ffe3b8] text-[#07597e] flex items-center justify-center text-xs tracking-normal">
              G
            </div>
            {t.appName.toUpperCase()}
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label }: { icon: ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center h-full group hover:bg-[#08729b] px-3 transition-colors cursor-pointer min-w-[70px]">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[9px] font-extrabold tracking-tighter mt-0.5 uppercase">{label}</span>
    </button>
  );
}

