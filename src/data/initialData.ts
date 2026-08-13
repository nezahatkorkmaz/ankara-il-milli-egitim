import { DigitalStoryCard, ProjectContractInfo, User } from '../types';

export const initialProjectContractInfo: ProjectContractInfo = {
  contractNo: 'TR51/25/İKT_TD/0041',
  activityName: 'DİJİTAL KÜLTÜR ROTALARI (GEÇMİŞTEN GELECEĞE KÜLTÜRÜYLE ANKARA)',
  activityLocation: 'İMKB ALPASLAN İ.H. ORTAOKULU',
  beneficiaryOrg: 'ANKARA İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ',
  dates: '2 Nisan–23 Haziran 2026 Yüzyüze Eğitim | 14-20-21.07.2026-06.08.2026 Çevrimiçi Eğitim',
  participantCount: '230 / 300',
  trainers: [
    'Dr. Necati YALÇIN',
    'Doç. Dr. Vedat BAYRAKTAR',
    'Doç. Dr. Gülhan GÜVEN',
    'Öğretim Gör. Betül TOKGÖZ'
  ],
  beneficiaryFeedback: 'Yararlanıcı kurum olan Ankara İl Milli Eğitim Müdürlüğü, projenin hazırlık ve uygulama aşamalarında son derece profesyonel bir koordinasyon süreci yürütmüştür. Kurumun stratejik planlama becerisi ve yenilikçi eğitim modellerine olan kurumsal desteği, faaliyetlerin sorunsuz ve takvime uygun ilerlemesini sağlamıştır. Gerekli altyapı, iletişim ve organizasyon destekleri zamanında ve eksiksiz olarak sunulmuştur.',
  participantFeedback: 'Eğitime katılan öğretmen grubumuz, dijital entegrasyon ve kültürel mirasın teknolojik araçlarla aktarımı konularına yüksek bir motivasyonla yaklaşmıştır. Katılımcıların eğitim sürecindeki interaktif tutumları, dijital araçlara hızlı adaptasyonları ve edindikleri becerileri saha uygulamalarına taşıma konusundaki isteklilikleri son derece olumlu değerlendirilmektedir.',
  impactFeedback: 'Süreç kapsamında, geliştirme ve altyapı çalışmaları halen devam eden çevrim içi paylaşım platformunun projedeki stratejik yeri öğretmenlerimize aktarılmıştır. Sistemin mevcut durumu üzerinden platformun tanıtımına ve temel kullanımına yönelik eğitimlere başlanmış olup, bu faaliyetler platformun tamamlanma sürecine paralel olarak kesintisiz bir şekilde devam etmektedir. Platform tam kapasiteyle devreye alındığında, öğretmenlerimizin hâlihazırda geliştirmekte oldukları dijital yetkinlikler sayesinde Ankara\'nın kültürel mirasının öğrencilere modern yöntemlerle aktarılması için kalıcı ve aktif bir altyapı sağlanmış olacaktır.',
  futureRecommendations: 'Projenin yakaladığı bu ivmenin sürdürülebilirliği için, dijital kültür rotası içeriklerinin çeşitlendirilmesi ve uygulamanın il geneline yaygınlaştırılması adına ileri düzey eğitim modülleri planlanabilir. Mevcut platform üzerindeki faaliyetlerin devamlılığını desteklemek üzere, gelecekteki teknik destek programlarında öğretmenlere yönelik periyodik çevrim içi mentorluk programlarının eklenmesi faydalı olacaktır.'
};

export const defaultMockUsers: User[] = [
  {
    id: 'usr-101',
    name: 'Ayşe YILMAZ',
    tcNo: '12345678901',
    email: 'ayse.yilmaz@meb.k12.tr',
    role: 'teacher',
    school: 'İMKB Alpaslan İ.H. Ortaokulu',
    branch: 'Tarih Öğretmeni',
    trainingCompleted: true
  },
  {
    id: 'usr-102',
    name: 'Mehmet KAYA',
    tcNo: '98765432109',
    email: 'mehmet.kaya@meb.k12.tr',
    role: 'teacher',
    school: 'Ankara Lisesi',
    branch: 'Görsel Sanatlar Öğretmeni',
    trainingCompleted: true
  },
  {
    id: 'usr-admin',
    name: 'Ankara İl MEM Koordinatörü',
    tcNo: '11111111111',
    email: 'ankara.proje@meb.gov.tr',
    role: 'admin',
    school: 'Ankara İl Milli Eğitim Müdürlüğü',
    branch: 'Strateji Geliştirme Hizmetleri',
    trainingCompleted: true
  }
];

export const sampleDigitalCards: DigitalStoryCard[] = [
  {
    id: 'card-1',
    title: 'Anadolu Medeniyetleri ve Ulus Müze Rotası',
    routeCategory: 'Ulus ve Müzeler Rotası',
    district: 'Altındağ',
    authorId: 'usr-101',
    authorName: 'Ayşe YILMAZ',
    authorSchool: 'İMKB Alpaslan İ.H. Ortaokulu',
    description: 'Anadolu Medeniyetleri Müzesi, İlk Meclis Binası ve Etnografya Müzesi ekseninde hazırlanan 1 sayfalık dijital kültür bilgilendirme afişi.',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-06-15',
    targetLevel: 'Ortaokul (5-8. Sınıf)',
    tags: ['Müzeler', 'Ulus', 'Tarihi Miras', 'Anadolu'],
    viewsCount: 342
  },
  {
    id: 'card-2',
    title: 'Augustus Tapınağı ve Hacı Bayram Veli Çevresi',
    routeCategory: 'Augustus ve Hacı Bayram Rotası',
    district: 'Altındağ',
    authorId: 'usr-102',
    authorName: 'Mehmet KAYA',
    authorSchool: 'Ankara Lisesi',
    description: 'Roma dönemi eseri Augustus Tapınağı ile Hacı Bayram Veli Camii ve külliyesinin bir arada bulunduğu hoşgörü rotası bilgi kartı.',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-06-18',
    targetLevel: 'Lise (9-12. Sınıf)',
    tags: ['Roma', 'Kültürel Miras', 'Mimari', 'İnanç Rotası'],
    viewsCount: 289
  },
  {
    id: 'card-3',
    title: 'Ankara Kalesi Tarihi ve Samanpazarı El Sanatları',
    routeCategory: 'Ankara Kalesi ve Samanpazarı',
    district: 'Altındağ',
    authorId: 'usr-101',
    authorName: 'Ayşe YILMAZ',
    authorSchool: 'İMKB Alpaslan İ.H. Ortaokulu',
    description: 'Ankara Kalesi burçları, tarihi Ankara evleri ve geleneksel Samanpazarı zanaatkarlarını konu alan interaktif dijital harita afişi.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-06-21',
    targetLevel: 'Tüm Seviyeler',
    tags: ['Ankara Kalesi', 'Samanpazarı', 'Zanaat', 'Sivil Mimari'],
    viewsCount: 415
  },
  {
    id: 'card-4',
    title: 'UNESCO Dünya Mirası Gordion ve Frig Uygarlığı',
    routeCategory: 'Gordion ve Antik Ankara',
    district: 'Polatlı',
    authorId: 'usr-102',
    authorName: 'Mehmet KAYA',
    authorSchool: 'Ankara Lisesi',
    description: 'UNESCO Dünya Mirası Listesi\'nde yer alan Polatlı Gordion Tümülüsü ve Kral Midas rotasına ait dijital öğrenme bilgi afişi.',
    imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-07-02',
    targetLevel: 'Ortaokul ve Lise',
    tags: ['Gordion', 'UNESCO', 'Frigya', 'Polatlı'],
    viewsCount: 520
  },
  {
    id: 'card-5',
    title: 'Tarihi Beypazarı Evleri ve Kültür Rotası',
    routeCategory: 'Beypazarı Kültür Rotası',
    district: 'Beypazarı',
    authorId: 'usr-101',
    authorName: 'Ayşe YILMAZ',
    authorSchool: 'İMKB Alpaslan İ.H. Ortaokulu',
    description: 'Osmanlı mimarisini günümüze taşıyan Beypazarı konakları, telkari sanatı ve yerel gastronomi kültürünü anlatan afiş tasarımı.',
    imageUrl: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-07-15',
    targetLevel: 'İlkokul ve Ortaokul',
    tags: ['Beypazarı', 'Geleneksel Mimarisi', 'Gastronomi', 'El Sanatları'],
    viewsCount: 310
  },
  {
    id: 'card-6',
    title: 'Milli Mücadele ve Cumhuriyete Giden Yol',
    routeCategory: 'Cumhuriyete Giden Yol',
    district: 'Çankaya / Altındağ',
    authorId: 'usr-102',
    authorName: 'Mehmet KAYA',
    authorSchool: 'Ankara Lisesi',
    description: 'Anıtkabir, II. TBMM Binası ve Müze Köşk aksında Cumhuriyetin başkenti Ankara\'nın kuruluş hikayesini sunan 1 sayfalık dijital öğrenim bilgi kartı.',
    imageUrl: 'https://images.unsplash.com/photo-1590059301905-2361d9a2630a?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-07-20',
    targetLevel: 'Tüm Öğrenciler',
    tags: ['Anıtkabir', 'Cumhuriyet', 'Milli Mücadele', 'Çankaya'],
    viewsCount: 680
  }
];
