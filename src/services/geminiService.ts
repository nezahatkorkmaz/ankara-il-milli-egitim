import { RouteCategory } from '../types';

export interface DynamicDesignSystem {
  primaryColor: string;     // e.g. #0B1E36 (Navy), #5C1D24 (Burgundy), #1B4D3E (Emerald)
  accentColor: string;      // e.g. #B8860B (Gold), #D97706 (Amber), #C23B22 (Terracotta)
  backgroundColor: string;  // e.g. #FAF7F2 (Ivory Paper), #F5F3EF (Cream), #F8FAFC (Slate)
  cardBorderColor: string;  // e.g. #D8CBB7, #CBD5E1
  themeVariant: 'classic_antique' | 'modern_minimalist' | 'ottoman_heritage' | 'art_deco';
  quoteStyle: 'greek_column' | 'decorative_banner' | 'modern_box';
}

export interface InfographicPosterData {
  mainTitle: string;
  slogan: string;
  headerTag: string;
  aboutText: string;
  whatIsThere: { title: string; desc: string }[];
  geziBilgileri: {
    yer: string;
    saatler: string;
    kurucu: string;
    ulasim: string;
  };
  learnings: string[];
  visitTips: string[];
  quote: string;
  designSystem: DynamicDesignSystem;
  aiGeneratedImageUrl?: string;
}

/**
 * Convert a File object to Base64 string for Gemini Multimodal API
 */
export function fileToBase64(file: File): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Generate Direct AI Building Photo using Gemini Imagen API or Free Pollinations AI Engine.
 */
export async function generateAiBuildingImage(
  placePrompt: string,
  apiKey?: string
): Promise<string> {
  const cleanPlace = placePrompt.trim() || 'Ankara Resim ve Heykel Müzesi';

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [
              {
                prompt: `High quality realistic architectural photography of ${cleanPlace}, cultural heritage museum building in Ankara Turkey, sunny day, 4k ultra detailed`,
              },
            ],
            parameters: { sampleCount: 1, aspectRatio: '4:3' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions?.[0]?.bytesBase64Encoded) {
          return `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
      }
    } catch (err) {
      console.warn('Gemini Imagen API notice:', err);
    }
  }

  const encodedPrompt = encodeURIComponent(
    `Realistic architectural photo of ${cleanPlace}, Ankara cultural heritage landmark, sunny exterior view, 8k resolution`
  );
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${seed}`;
}

/**
 * Multimodal Gemini AI Generation:
 * Accepts natural language text AND uploaded image base64.
 * Uses a system prompt to dynamically produce BOTH content and a unique UI/UX Design System!
 */
export async function generateInfographicPosterData(
  rawStoryText: string,
  routeCategory: RouteCategory,
  district: string,
  imageFile?: File | null,
  apiKey?: string
): Promise<InfographicPosterData> {
  const cleanedText = rawStoryText.trim();

  if (!cleanedText) {
    throw new Error('Lütfen afişe dönüştürülecek mekan/kültür metnini giriniz.');
  }

  // Generate building photo if needed
  const aiImageUrl = await generateAiBuildingImage(cleanedText.substring(0, 60), apiKey);

  // System Prompt for Multimodal Gemini AI
  const systemPrompt = `Sen MEB Ankara İl Millî Eğitim Müdürlüğü Kıdemli Grafik Tasarımcısı ve Pedagojik İçerik Mimarısın.
Sana verilen mekan görselini ve metnini analiz ederek, mekana ÖZGÜ DINAMIK BIR TASARIM SISTEMI ve 1 sayfalık kültür afişi JSON verisi oluştur.

Yalnızca aşağıdaki JSON formatında yanıt ver:
{
  "designSystem": {
    "primaryColor": "#0B1E36",
    "accentColor": "#B8860B",
    "backgroundColor": "#FAF7F2",
    "cardBorderColor": "#D8CBB7",
    "themeVariant": "classic_antique",
    "quoteStyle": "greek_column"
  },
  "mainTitle": "MEKAN ADI BÜYÜK BAŞLIĞI (ör. ANKARA RESİM VE HEYKEL MÜZESİ)",
  "slogan": "GEÇMİŞTEN İLHAM AL, GELECEĞİ KEŞFET!",
  "headerTag": "Ankara'nın Kültür Hazinesi",
  "aboutText": "Mekan hakkında 2-3 cümlelik pedagojik açıklama",
  "whatIsThere": [
    { "title": "1. Koleksiyon / Bölüm Adı", "desc": "Kısa 1 cümle açıklama" },
    { "title": "2. Sergi / Alan Adı", "desc": "Kısa 1 cümle açıklama" },
    { "title": "3. Etkinlik / Atölye", "desc": "Kısa 1 cümle açıklama" }
  ],
  "geziBilgileri": {
    "yer": "${district} / Ankara",
    "saatler": "Salı - Pazar 09.00 - 17.00",
    "kurucu": "T.C. Kültür ve Turizm Bakanlığı / MEB",
    "ulasim": "Metro ve otobüs hatları ile ulaşım"
  },
  "learnings": [
    "Ankara'nın tarihi ve kültürel mirasını tanıyacağız.",
    "Farklı dönemlere ait eserleri inceleyeceğiz.",
    "Tarihi toplumların gelişimini keşfedeceğiz.",
    "Gözlem yapacak, sorular soracağız.",
    "Kültürel mirasın korunmasını fark edeceğiz."
  ],
  "visitTips": [
    "Defter ve kalem getirmeyi unutma.",
    "Fotoğraf çekebilirsin, eserlere özen göster.",
    "Sessiz olalım, müze kurallarına uyalım.",
    "Eserlere dokunmayalım, koruyalım.",
    "Grup halinde rehber eşliğinde hareket edelim."
  ],
  "quote": "Tarih, insanın hafızasıdır; sanat ise ruhuna ışık tutar. Geçmişe dokunuyor, geleceğe ilham alıyoruz!"
}

Notlar:
- themeVariant seçenekleri: "classic_antique", "modern_minimalist", "ottoman_heritage", "art_deco".
- Mekanın karakterine göre primaryColor (#0B1E36 lacivert, #5C1D24 bordo, #1B4D3E zümrüt yeşili, #3E2723 kahve) ve accentColor seç.
Ham Metin: "${cleanedText}"
Rota: "${routeCategory}"
İlçe: "${district}"`;

  // Multimodal Gemini API Request
  if (apiKey) {
    try {
      const parts: any[] = [{ text: systemPrompt }];

      if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        parts.unshift({
          inlineData: {
            mimeType: base64Data.mimeType,
            data: base64Data.data,
          },
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText) as InfographicPosterData;
          parsed.aiGeneratedImageUrl = aiImageUrl;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Multimodal Gemini API call notice:', err);
    }
  }

  // Fallback Dynamic Smart Synthesizer
  const result = synthesizeSmartInfographicData(cleanedText, routeCategory, district);
  result.aiGeneratedImageUrl = aiImageUrl;
  return result;
}

function synthesizeSmartInfographicData(
  rawText: string,
  routeCategory: RouteCategory,
  district: string
): InfographicPosterData {
  let extractedTitle = '';

  const placeMatches = rawText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s]+(Müzesi|Kalesi|Antik Kenti|Camii|Hanı|Külliyesi|Tiyatrosu|Parkı|Ören Yeri))/i);
  if (placeMatches && placeMatches[0]) {
    extractedTitle = placeMatches[0].trim().toUpperCase();
  } else {
    const firstLine = rawText.split('\n')[0].replace(/[.!?]/g, '').trim();
    if (firstLine.length > 5 && firstLine.length <= 50) {
      extractedTitle = firstLine.toUpperCase();
    } else {
      extractedTitle = `${district.toUpperCase()} RESİM VE HEYKEL MÜZESİ`;
    }
  }

  if (extractedTitle.length > 45) {
    extractedTitle = extractedTitle.substring(0, 42) + '...';
  }

  // Determine dynamic design theme based on route category or text content
  let primaryColor = '#0B1E36';
  let accentColor = '#B8860B';
  let themeVariant: 'classic_antique' | 'modern_minimalist' | 'ottoman_heritage' | 'art_deco' = 'classic_antique';

  if (routeCategory.includes('Augustus') || routeCategory.includes('Beypazarı')) {
    primaryColor = '#5C1D24'; // Ottoman Burgundy
    accentColor = '#D97706'; // Warm Amber
    themeVariant = 'ottoman_heritage';
  } else if (routeCategory.includes('Cumhuriyet') || routeCategory.includes('Gordion')) {
    primaryColor = '#1B4D3E'; // Emerald / Ancient Gordion
    accentColor = '#C23B22'; // Terracotta Red
    themeVariant = 'art_deco';
  }

  return {
    designSystem: {
      primaryColor,
      accentColor,
      backgroundColor: '#FAF7F2',
      cardBorderColor: '#D8CBB7',
      themeVariant,
      quoteStyle: 'greek_column',
    },
    mainTitle: extractedTitle,
    slogan: 'GEÇMİŞTEN İLHAM AL, GELECEĞİ KEŞFET!',
    headerTag: "Ankara'nın Kültür Hazinesi",
    aboutText: rawText.length > 240 ? rawText.substring(0, 235) + '...' : rawText,
    whatIsThere: [
      {
        title: 'ARKEOLOJİ VE SANAT KOLEKSİYONU',
        desc: 'Tarihi dönemlere uzanan nadide heykel, tablo ve sanat eserleri sizleri bekliyor.',
      },
      {
        title: 'GEÇİCİ VE DAİMİ SANAT SERGİLERİ',
        desc: 'Çağdaş Türk sanatının önde gelen ustalarının eserleri müze salonlarında sergilenmektedir.',
      },
      {
        title: 'EĞİTİM VE KÜLTÜREL ATÖLYELER',
        desc: 'Öğrenciler için rehberli turlar, söyleşiler ve uygulamalı sanat atölye çalışmaları düzenlenir.',
      },
    ],
    geziBilgileri: {
      yer: `${district} / Ankara (Namazgâh Tepesi, Ulus)`,
      saatler: 'Salı - Pazar 09.00 - 17.00 (Pazartesi kapalı)',
      kurucu: 'T.C. Kültür ve Turizm Bakanlığı / MEB',
      ulasim: 'Ulus metrosu ve otobüs hatları ile kolayca ulaşabilirsiniz.',
    },
    learnings: [
      "Ankara'nın tarihi ve kültürel mirasını tanıyacağız.",
      'Farklı dönemlere ait resim ve heykelleri inceleyeceğiz.',
      'Türk sanat tarihinin gelişim evrelerini keşfedeceğiz.',
      'Gözlem yapacak, sorular sorarak bilgi edineceğiz.',
      'Kültürel mirasın korunmasının önemini fark edeceğiz.',
    ],
    visitTips: [
      'Defter ve kalem getirmeyi unutma.',
      'Fotoğraf çekebilirsin, eserlere özen göster.',
      'Sessiz olalım, müze kurallarına uyalım.',
      'Eserlere dokunmayalım, koruyalım.',
      'Grup halinde rehber eşliğinde hareket edelim.',
    ],
    quote: 'Tarih, insanın hafızasıdır; sanat ise ruhuna ışık tutar. Geçmişe dokunuyor, geleceğe ilham alıyoruz!',
  };
}
