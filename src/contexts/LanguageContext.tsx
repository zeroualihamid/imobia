
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.properties': 'Biens',
    'nav.addProperty': 'Ajouter bien',
    'nav.allProperties': 'Tous les biens',
    'nav.advisors': 'Conseillers',
    'nav.advisorsList': 'Liste des conseillers',
    'nav.addAdvisor': 'Ajouter un conseiller',
    'nav.requests': 'Demandes',
    'nav.clientRequests': 'Demande client',
    'nav.agentRequests': 'Demande agent',
    'nav.mandates': 'Mandats',
    'nav.addMandate': 'Ajouter un mandat',
    'nav.planning': 'Planning',
    'nav.messaging': 'Messagerie',
    'nav.whatsapp': 'Envoi par WhatsApp',
    'nav.matching': 'Matching bien et besoin',
    'nav.scraping': 'Scrapping des sites d\'annonces',
    
    // Property form
    'property.add': 'Ajouter un bien',
    'property.category': 'Catégorie de bien',
    'property.sale': 'Vente',
    'property.rent': 'Location',
    'property.vacation': 'Location de vacances',
    'property.type': 'Type de bien',
    'property.apartment': 'Appartement',
    'property.villa': 'Villa et maison de luxe',
    'property.commercial': 'Locaux commerciaux',
    'property.land': 'Terrain',
    'property.house': 'Maison',
    'property.riad': 'Riad',
    'property.office': 'Bureau',
    'property.farm': 'Ferme',
    'property.location': 'Emplacement',
    'property.address': 'Adresse',
    'property.region': 'Région',
    'property.city': 'Ville',
    'property.district': 'Arrondissement',
    'property.neighborhood': 'Quartier',
    'property.surface': 'Surface',
    'property.builtArea': 'Surface construite',
    'property.livingArea': 'Surface habitable',
    'property.outdoorArea': 'Surface extérieure',
    'property.condition': 'État',
    'property.new': 'Nouveau',
    'property.good': 'Bon état',
    'property.renovate': 'À rénover',
    'property.composition': 'Composition',
    'property.bedrooms': 'Chambres',
    'property.rooms': 'Pièces',
    'property.bathrooms': 'Salles de bain',
    'property.gallery': 'Galerie',
    'property.features': 'Fonctionnalités',
    'property.terrace': 'Terrasse',
    'property.elevator': 'Ascenseur',
    'property.seaView': 'Vue sur mer',
    'property.parking': 'Parking',
    'property.garden': 'Jardin',
    'property.pool': 'Piscine',
    'property.aircon': 'Climatisation',
    'property.heating': 'Chauffage',
    'property.fireplace': 'Cheminée',
    'property.security': 'Sécurité',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.language': 'Langue',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.properties': 'Properties',
    'nav.addProperty': 'Add Property',
    'nav.allProperties': 'All Properties',
    'nav.advisors': 'Advisors',
    'nav.advisorsList': 'Advisors List',
    'nav.addAdvisor': 'Add Advisor',
    'nav.requests': 'Requests',
    'nav.clientRequests': 'Client Request',
    'nav.agentRequests': 'Agent Request',
    'nav.mandates': 'Mandates',
    'nav.addMandate': 'Add Mandate',
    'nav.planning': 'Planning',
    'nav.messaging': 'Messaging',
    'nav.whatsapp': 'WhatsApp Sending',
    'nav.matching': 'Property & Need Matching',
    'nav.scraping': 'Listing Sites Scraping',
    
    // Property form
    'property.add': 'Add Property',
    'property.category': 'Property Category',
    'property.sale': 'Sale',
    'property.rent': 'Rent',
    'property.vacation': 'Vacation Rental',
    'property.type': 'Property Type',
    'property.apartment': 'Apartment',
    'property.villa': 'Villa and Luxury House',
    'property.commercial': 'Commercial Space',
    'property.land': 'Land',
    'property.house': 'House',
    'property.riad': 'Riad',
    'property.office': 'Office',
    'property.farm': 'Farm',
    'property.location': 'Location',
    'property.address': 'Address',
    'property.region': 'Region',
    'property.city': 'City',
    'property.district': 'District',
    'property.neighborhood': 'Neighborhood',
    'property.surface': 'Surface',
    'property.builtArea': 'Built Area',
    'property.livingArea': 'Living Area',
    'property.outdoorArea': 'Outdoor Area',
    'property.condition': 'Condition',
    'property.new': 'New',
    'property.good': 'Good Condition',
    'property.renovate': 'To Renovate',
    'property.composition': 'Composition',
    'property.bedrooms': 'Bedrooms',
    'property.rooms': 'Rooms',
    'property.bathrooms': 'Bathrooms',
    'property.gallery': 'Gallery',
    'property.features': 'Features',
    'property.terrace': 'Terrace',
    'property.elevator': 'Elevator',
    'property.seaView': 'Sea View',
    'property.parking': 'Parking',
    'property.garden': 'Garden',
    'property.pool': 'Pool',
    'property.aircon': 'Air Conditioning',
    'property.heating': 'Heating',
    'property.fireplace': 'Fireplace',
    'property.security': 'Security',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.language': 'Language',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة القيادة',
    'nav.properties': 'العقارات',
    'nav.addProperty': 'إضافة عقار',
    'nav.allProperties': 'جميع العقارات',
    'nav.advisors': 'المستشارون',
    'nav.advisorsList': 'قائمة المستشارين',
    'nav.addAdvisor': 'إضافة مستشار',
    'nav.requests': 'الطلبات',
    'nav.clientRequests': 'طلب العميل',
    'nav.agentRequests': 'طلب الوكيل',
    'nav.mandates': 'التفويضات',
    'nav.addMandate': 'إضافة تفويض',
    'nav.planning': 'التخطيط',
    'nav.messaging': 'المراسلة',
    'nav.whatsapp': 'الإرسال عبر واتساب',
    'nav.matching': 'مطابقة العقار والحاجة',
    'nav.scraping': 'استخراج مواقع الإعلانات',
    
    // Property form
    'property.add': 'إضافة عقار',
    'property.category': 'فئة العقار',
    'property.sale': 'بيع',
    'property.rent': 'إيجار',
    'property.vacation': 'إيجار إجازة',
    'property.type': 'نوع العقار',
    'property.apartment': 'شقة',
    'property.villa': 'فيلا ومنزل فاخر',
    'property.commercial': 'محلات تجارية',
    'property.land': 'أرض',
    'property.house': 'منزل',
    'property.riad': 'رياض',
    'property.office': 'مكتب',
    'property.farm': 'مزرعة',
    'property.location': 'الموقع',
    'property.address': 'العنوان',
    'property.region': 'المنطقة',
    'property.city': 'المدينة',
    'property.district': 'الحي',
    'property.neighborhood': 'المنطقة السكنية',
    'property.surface': 'المساحة',
    'property.builtArea': 'المساحة المبنية',
    'property.livingArea': 'مساحة المعيشة',
    'property.outdoorArea': 'المساحة الخارجية',
    'property.condition': 'الحالة',
    'property.new': 'جديد',
    'property.good': 'حالة جيدة',
    'property.renovate': 'يحتاج تجديد',
    'property.composition': 'التكوين',
    'property.bedrooms': 'غرف النوم',
    'property.rooms': 'الغرف',
    'property.bathrooms': 'دورات المياه',
    'property.gallery': 'المعرض',
    'property.features': 'المميزات',
    'property.terrace': 'شرفة',
    'property.elevator': 'مصعد',
    'property.seaView': 'إطلالة على البحر',
    'property.parking': 'موقف سيارات',
    'property.garden': 'حديقة',
    'property.pool': 'مسبح',
    'property.aircon': 'تكييف',
    'property.heating': 'تدفئة',
    'property.fireplace': 'مدفأة',
    'property.security': 'أمان',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.language': 'اللغة',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
