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
 * Helper to get the API Key safely from environment variables
 */
export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!envKey) {
    console.warn('⚠️ VITE_GEMINI_API_KEY environment variable is missing.');
  }
  return envKey.trim();
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
 * Direct AI Full Poster Generation (Imagen 3 & Pollinations Engine).
 */
export async function generateDirectAiPosterImage(
  rawText: string,
  routeCategory: RouteCategory,
  district: string,
  userImageFile?: File | null,
  apiKey: string = getGeminiApiKey()
): Promise<string> {
  const cleanText = rawText.trim() || 'Ankara Anıtkabir ve Atatürk Müzesi';

  let extractedTitle = 'Ankara Kültür Rotaları Afişi';
  const placeMatches = cleanText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s]+(Müzesi|Kalesi|Antik Kenti|Camii|Hanı|Külliyesi|Tiyatrosu|Parkı|Ören Yeri|Anıtkabir))/i);
  if (placeMatches && placeMatches[0]) {
    extractedTitle = placeMatches[0].trim();
  } else {
    extractedTitle = cleanText.split('.')[0].substring(0, 40);
  }

  // Try Gemini Imagen 3 API if key present
  if (apiKey) {
    try {
      const promptText = `A professional 1-page educational infographic museum poster for "${extractedTitle}" in ${district} Ankara, MEB cultural routes project. Elegant ivory paper texture, gold and deep navy borders, structured infographic layout with building photograph, headers, 3 bullet points, visiting info, learning outcomes icons, high resolution graphic design print poster quality, 4k`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: promptText }],
            parameters: { sampleCount: 1, aspectRatio: '3:4' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions?.[0]?.bytesBase64Encoded) {
          return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
      } else {
        console.error('Gemini Imagen API error status:', response.status, await response.text());
      }
    } catch (err) {
      console.warn('Gemini Imagen 3 full poster generation notice:', err);
    }
  }

  // Fallback AI Graphic Generator
  const posterPrompt = `Professional 1-page educational culture infographic poster of ${extractedTitle} in ${district} Ankara Turkey, MEB digital culture routes, elegant typography, ivory paper texture, gold and dark blue accents, structured sections with icons, high resolution full graphic poster art`;

  const encodedPrompt = encodeURIComponent(posterPrompt);
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=900&height=1275&nologo=true&seed=${seed}`;
}

const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

/**
 * Generate Direct AI Building Photo using Gemini Imagen API or Free Pollinations AI Engine.
 */
export async function generateAiBuildingImage(
  placePrompt: string,
  apiKey: string = getGeminiApiKey()
): Promise<string> {
  const cleanPlace = placePrompt.trim() || 'Ankara Resim ve Heykel Müzesi';

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `High quality realistic architectural photograph of ${cleanPlace}, cultural heritage museum building in Ankara, Turkey. Sunny day, 4K ultra detailed.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['IMAGE'],
              imageConfig: { aspectRatio: '4:3' },
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imagePart = data.candidates?.[0]?.content?.parts?.find(
          (p: any) => p.inlineData?.data
        );
        if (imagePart) {
          return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
        }
      }
    } catch (err) {
      console.warn('Gemini image API notice:', err);
    }
  }

  const encodedPrompt = encodeURIComponent(
    `Realistic architectural photo of ${cleanPlace}, Ankara cultural heritage landmark, sunny exterior view, 8k resolution`
  );
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${seed}`;
}

/**
 * Multimodal Gemini AI Text & Structured Data Extraction
 */
export async function generateInfographicPosterData(
  rawStoryText: string,
  routeCategory: RouteCategory,
  district: string,
  imageFile?: File | null,
  apiKey: string = getGeminiApiKey()
): Promise<InfographicPosterData> {
  const cleanedText = rawStoryText.trim();

  if (!cleanedText) {
    throw new Error('Lütfen afişe dönüştürülecek mekan/kültür metnini giriniz.');
  }

  // Generate building photo if needed
  const aiImageUrl = await generateAiBuildingImage(cleanedText.substring(0, 60), apiKey);

  // Advanced System Prompt for Multimodal Gemini Vision-Language (VL) Model
  const systemPrompt = `Sen MEB Ankara İl Millî Eğitim Müdürlüğü Kıdemli Görsel İletişim Tasarımcısı ve Sanat Yönetmenisin.
Sana verilen mekan görselini ve metnini analiz ederek, Erimtan Müzesi ve Ankara Resim Heykel Müzesi bilgi kartları standartlarında 1 sayfalık kültür afişi JSON verisi ve mekana özel DINAMIK BIR TASARIM SISTEMI oluştur.

GÖRSEL VE METİN ANALİZ GÖREVLERİN:
1. Yüklenen fotoğrafı analiz et: Yapının mimari türünü (Selçuklu/Osmanlı, Antik Yunan/Roma, Birinci Ulusal Mimarlık, Cumhuriyet dönemi) ve fotoğraftaki baskın renk paletini tespit et.
2. Fotoğraf ve metindeki ipuçlarına dayanarak mekana en uygun primaryColor, accentColor ve themeVariant değerlerini belirle.
3. Öğretmenin ham metninden Erimtan Müzesi afiş düzenine birebir uyan 8 adet pedagojik bölüm oluştur.

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
  "mainTitle": "MEKAN ADI BÜYÜK BAŞLIĞI (Örn: ANKARA RESİM VE HEYKEL MÜZESİ)",
  "slogan": "GEÇMİŞTEN İLHAM AL, GELECEĞİ KEŞFET!",
  "headerTag": "Ankara'nın Kültür Hazinesi",
  "aboutText": "Mekan hakkında 2-3 cümlelik akıcı, bilgilendirici pedagojik özet metin",
  "whatIsThere": [
    { "title": "1. Koleksiyon / Eser Adı", "desc": "1 cümle detaylı açıklama" },
    { "title": "2. Sergi / Salon Adı", "desc": "1 cümle detaylı açıklama" },
    { "title": "3. Atölye / Etkinlik", "desc": "1 cümle detaylı açıklama" }
  ],
  "geziBilgileri": {
    "yer": "${district} / Ankara",
    "saatler": "Salı - Pazar 09.00 - 17.00 (Pazartesi Kapalı)",
    "kurucu": "T.C. Kültür ve Turizm Bakanlığı / MEB",
    "ulasim": "Metro ve otobüs hatları ile kolay ulaşım"
  },
  "learnings": [
    "Ankara'nın tarihi ve kültürel mirasını tanıyacağız.",
    "Farklı dönemlere ait nadide eserleri inceleyeceğiz.",
    "Tarihi toplumların gelişimini ve yaşam tarzını keşfedeceğiz.",
    "Gözlem yapacak, sorular sorarak aktif öğrenme sağlayacağız.",
    "Kültürel mirasın korunmasının önemini fark edeceğiz."
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
      console.log('🚀 Calling Gemini API with Key:', apiKey.substring(0, 8) + '...');
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
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
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
          const defaultDesignSystem: DynamicDesignSystem = {
            primaryColor: '#0B1E36',
            accentColor: '#B8860B',
            backgroundColor: '#FAF7F2',
            cardBorderColor: '#D8CBB7',
            themeVariant: 'classic_antique',
            quoteStyle: 'greek_column',
          };
          parsed.designSystem = Object.assign({}, defaultDesignSystem, parsed.designSystem);
          parsed.aiGeneratedImageUrl = aiImageUrl;
          console.log('✅ Gemini API Response Parsed Successfully!');
          return parsed;
        }
      } else {
        const errorResponseBody = await response.text();
        console.error('❌ Gemini 1.5 Flash API Call Failed:', response.status, errorResponseBody);
      }
    } catch (err) {
      console.warn('Multimodal Gemini API call notice:', err);
    }
  }

  // Fallback Dynamic Smart Synthesizer
  console.log('⚠️ Falling back to local smart synthesizer');
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

  const placeMatches = rawText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s]+(Müzesi|Kalesi|Antik Kenti|Camii|Hanı|Külliyesi|Tiyatrosu|Parkı|Ören Yeri|Anıtkabir))/i);
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
      ulasim: 'Ulus metrosu mevkii ve otobüs hatları ile ulaşabilirsiniz.',
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

/**
 * Per-theme art direction, modeled on the 4 reference posters supplied by MEB
 * (Erimtan Müzesi = classic_antique, Beypazarı = ottoman_heritage, Atakule = art_deco,
 * plus a clean modern_minimalist option).
 */
function getStyleDirective(themeVariant: DynamicDesignSystem['themeVariant']): string {
  switch (themeVariant) {
    case 'ottoman_heritage':
      return `ART STYLE — warm hand-illustrated heritage poster (like a Beypazarı Ankara tourism poster):
- Soft warm color palette: sage green, terracotta brown, cream paper background.
- Dashed/stitched-line decorative borders around text boxes, like a scrapbook page.
- Hand-drawn watercolor-style illustrations of the featured buildings/objects (not photos) with a cozy folk-art feel.
- A small charming cartoon mascot character in traditional local dress standing near the bottom corner, waving.
- A simplified, cute illustrated map of Türkiye/Ankara with a pin marking the location, placed in a top corner.
- Rounded, friendly hand-lettered display font for the main title, with a small heart or leaf doodle accent.
- Circular photo-badges with scalloped or rope-style borders for each "what's there" item, each paired with a simple flat icon (teapot, loom, bridge, etc).`;
    case 'art_deco':
      return `ART STYLE — bright playful kids' educational poster (like an Atakule Ankara poster for children):
- Bold saturated color blocks: sky blue, sunshine yellow, purple, coral pink.
- Big chunky bubble-letter title with a thick white outline and drop shadow, slightly tilted for energy.
- Comic-style decorative stickers scattered around: stars, hearts, sparkles, exclamation bursts.
- Two cheerful cartoon children mascots (one boy, one girl) pointing or waving near the bottom.
- Rounded speech-bubble callouts for fun-fact text.
- A simplified cartoon map with a location pin in a rounded card.
- Icon badges are solid-colored circles with simple white line-art icons (recycle bin, hand, water drop, group of people).
- Everything has thick rounded outlines, like a children's picture book illustration.`;
    case 'modern_minimalist':
      return `ART STYLE — clean modern editorial poster:
- Minimal palette (2-3 colors max) on a crisp white or very light background.
- Generous negative space, thin geometric divider lines, no ornamentation.
- Sans-serif typography throughout, confident large title.
- Icons are simple single-line (outline) glyphs inside thin-bordered circles.
- The photo sits in a sharp-edged or subtly rounded rectangle with a thin hairline border, no heavy frame.
- Overall feel: contemporary museum wayfinding signage / a well-designed infographic, not decorative.`;
    case 'classic_antique':
    default:
      return `ART STYLE — classic museum heritage poster (like an Erimtan Müzesi Ankara poster):
- Deep navy and aged-gold color palette on warm ivory paper background.
- Ancient Greek/Roman fluted column illustrations flanking the header and the quote box.
- Real architectural/interior photography (not cartoon) placed in a rounded frame with a thin gold border, top-right.
- Elegant serif typography for the title, italic serif for the slogan and quote.
- Circular dark-navy badge icons with a single gold emblem (column, vase, musical note) for each list item.
- Thin gold rule lines separating sections, understated and academic in tone, like a real museum wall panel.`;
  }
}

/**
 * Generates the ENTIRE 1-page infographic poster as a single AI image (Nano Banana Pro /
 * gemini-3-pro-image-preview), instead of hand-drawing it with Canvas primitives.
 */
export async function generateFullPosterImage(
  data: InfographicPosterData,
  district: string,
  authorName: string,
  authorSchool: string,
  referencePhoto?: { mimeType: string; data: string } | null,
  apiKey?: string
): Promise<string> {
  const resolvedApiKey = apiKey || getGeminiApiKey();
  if (!resolvedApiKey) {
    throw new Error('Gemini API anahtarı tanımlı değil (VITE_GEMINI_API_KEY).');
  }

  const ds = data.designSystem;
  const styleDirective = getStyleDirective(ds?.themeVariant || 'classic_antique');

  const whatItemsText = data.whatIsThere
    .map((item, i) => `  ${i + 1}. "${item.title}" — "${item.desc}"`)
    .join('\n');
  const learningsText = data.learnings.map((l, i) => `  ${i + 1}. "${l}"`).join('\n');
  const tipsText = data.visitTips.map((t, i) => `  ${i + 1}. "${t}"`).join('\n');

  const prompt = `Design a single-page A4-portrait Turkish educational cultural-heritage poster / infographic info-card for the "Ankara Dijital Kültür Rotaları" school programme (Turkish Ministry of Education, Ankara Provincial Directorate).

${styleDirective}

CRITICAL — TEXT ACCURACY:
Render every Turkish text string below EXACTLY as written, including Turkish letters (ç, ğ, ı, İ, ö, ş, ü). Do not translate, do not paraphrase, do not invent additional text. Keep the text legible and correctly spelled — proofread it against the source before finalizing.

LAYOUT (8 zones, top to bottom / left to right):
1. Top-left header: small tag line "${data.headerTag}", then a large title "${data.mainTitle.toUpperCase()}", then slogan "${data.slogan}".
2. Top-right: a featured photo/illustration of the place in a decorative frame${referencePhoto ? ' (use the attached reference photo as the visual basis for this frame — keep the building/scene recognizable)' : ''}.
3. Left box "${data.mainTitle.toUpperCase()} HAKKINDA": body text — "${data.aboutText}"
4. Left box "MÜZEDE / ROTADA NELER VAR?": three items —
${whatItemsText}
5. Right box "GEZİ BİLGİLERİ":
   YER: "${data.geziBilgileri.yer}"
   ZİYARET SAATLERİ: "${data.geziBilgileri.saatler}"
   KURUCU / MİMAR: "${data.geziBilgileri.kurucu}"
   ULAŞIM: "${data.geziBilgileri.ulasim}"
   Small note: "Hazırlayan: Öğr. ${authorName} (${authorSchool})"
6. Full-width strip "GEZİMİZDEN NELER ÖĞRENECEĞİZ?": five short learning-outcome items in a row, each with its own icon —
${learningsText}
7. Bottom-left strip "GEZİMİZİ VERİMLİ GEÇİRMEK İÇİN": five short visit-tip lines, each with its own icon —
${tipsText}
8. Bottom-right quote box with decorative quotation marks: "${data.quote}"

The poster must read as ONE cohesive finished graphic design (not a mockup, not a screenshot of a website, no browser chrome, no placeholder lorem ipsum). Portrait orientation, print-poster quality.`;

  const parts: any[] = [{ text: prompt }];
  if (referencePhoto) {
    parts.push({
      inlineData: {
        mimeType: referencePhoto.mimeType,
        data: referencePhoto.data,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${resolvedApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: '3:4', imageSize: '2K' },
        },
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini poster görsel API isteği başarısız (HTTP ${response.status}): ${errBody}`);
  }

  const responseData = await response.json();
  const imagePart = responseData.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData?.data
  );

  if (!imagePart) {
    throw new Error('Gemini poster görsel yanıtı boş döndü.');
  }

  return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
}

