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
    id: 'card-erimtan',
    title: 'Erimtan Arkeoloji ve Sanat Müzesi Bilgi Kartı',
    routeCategory: 'Ulus ve Müzeler Rotası',
    district: 'Altındağ',
    authorId: 'usr-101',
    authorName: 'Ayşe YILMAZ',
    authorSchool: 'İMKB Alpaslan İ.H. Ortaokulu',
    description: 'Ankara nın tarihi dokusunu yansıtan Erimtan Müzesi, çağdaş müzecilik anlayışıyla arkeolojik koleksiyonunu ve dönem sergilerini tanıtan 1 sayfalık dijital kültür afişi.',
    imageUrl: '/posters/erimtan-muzesi.jpg',
    createdAt: '2026-06-15',
    targetLevel: 'Ortaokul (5-8. Sınıf)',
    tags: ['Erimtan Müzesi', 'Arkeoloji', 'Kültürel Etkinlikler', 'Altındağ'],
    viewsCount: 342
  },
  {
    id: 'card-atakule',
    title: 'Atakule - Ankara nın Gözbebeği Kültür Afişi',
    routeCategory: 'Cumhuriyete Giden Yol',
    district: 'Çankaya',
    authorId: 'usr-102',
    authorName: 'Mehmet KAYA',
    authorSchool: 'Ankara Lisesi',
    description: 'Ankara nın simge yapılarından Atakule nin tarihi, mimari özellikleri ve kültürel miras koruma bilincini öğrencilere aktaran interaktif bilgi afişi.',
    imageUrl: '/posters/atakule.jpg',
    createdAt: '2026-06-18',
    targetLevel: 'İlkokul ve Ortaokul',
    tags: ['Atakule', 'Çankaya', 'Mimari Miras', 'Ankara Simgesi'],
    viewsCount: 489
  },
  {
    id: 'card-eymir',
    title: 'Eymir Gölü Doğal ve Kültürel Miras Afişi',
    routeCategory: 'Cumhuriyete Giden Yol',
    district: 'Çankaya',
    authorId: 'usr-101',
    authorName: 'Ayşe YILMAZ',
    authorSchool: 'İMKB Alpaslan İ.H. Ortaokulu',
    description: 'Ankara nın doğal hazinesi Eymir Gölü nün flora, fauna ve biyolojik çeşitliliğini koruma bilinciyle sunan 1 sayfalık dijital öğrenim kartı.',
    imageUrl: '/posters/eymir-golu.jpg',
    createdAt: '2026-06-21',
    targetLevel: 'Tüm Seviyeler',
    tags: ['Eymir Gölü', 'Doğal Miras', 'Çevre Koruma', 'Çankaya'],
    viewsCount: 415
  },
  {
    id: 'card-beypazari',
    title: 'Beypazarı Tarihi Konakları ve El Sanatları',
    routeCategory: 'Beypazarı Kültür Rotası',
    district: 'Beypazarı',
    authorId: 'usr-102',
    authorName: 'Mehmet KAYA',
    authorSchool: 'Ankara Lisesi',
    description: 'Geleneksel Beypazarı evleri, gümüş telkari sanatı, bakırcılık, el dokumacılığı ve yöresel lezzetleri kapsayan 1 sayfalık rehber afiş.',
    imageUrl: '/posters/beypazari.jpg',
    createdAt: '2026-07-02',
    targetLevel: 'Tüm Öğrenciler',
    tags: ['Beypazarı', 'Tarihi Konaklar', 'Bakırcılık', 'Telkari'],
    viewsCount: 520
  }
];
