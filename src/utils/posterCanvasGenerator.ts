import { RouteCategory } from '../types';
import { InfographicPosterData } from '../services/geminiService';

export interface PosterCanvasParams {
  data: InfographicPosterData;
  photoUrl: string;
  routeCategory: RouteCategory;
  district: string;
  authorName: string;
  authorSchool: string;
}

/**
 * Dynamically Renders a 1-page Infographic Cultural Poster driven by Gemini AI Design System.
 * Canvas size: 1200 x 1700.
 */
export async function generatePosterImageFromCanvas(
  params: PosterCanvasParams
): Promise<string> {
  const width = 1200;
  const height = 1700;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context oluşturulamadı.');
  }

  const { data, photoUrl, district, authorName, authorSchool } = params;

  // Extract Dynamic Design Tokens from Gemini AI or fallback
  const ds = data.designSystem || {
    primaryColor: '#0B1E36',
    accentColor: '#B8860B',
    backgroundColor: '#FAF7F2',
    cardBorderColor: '#D8CBB7',
    themeVariant: 'classic_antique',
    quoteStyle: 'greek_column',
  };

  const primaryColor = ds.primaryColor || '#0B1E36';
  const accentColor = ds.accentColor || '#B8860B';
  const backgroundColor = ds.backgroundColor || '#FAF7F2';
  const cardBorderColor = ds.cardBorderColor || '#D8CBB7';

  // 1. Dynamic Background Color
  ctx.beginPath();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Outer border frame
  ctx.beginPath();
  ctx.strokeStyle = cardBorderColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);  // Decorative Header Accent Illustration (Left Header Accent)
  drawThemeHeaderAccent(ctx, ds.themeVariant, 35, 30, 48, 230, accentColor);

  // 2. TOP LEFT HEADER SECTION
  ctx.beginPath();
  ctx.textAlign = 'left';
  ctx.fillStyle = accentColor;
  ctx.font = 'italic 26px "MYRIAD PRO", Georgia, serif';
  ctx.fillText(data.headerTag || "Ankara'nın Kültür Hazinesi", 98, 65);

  // Main Title (e.g. ANKARA RESİM VE HEYKEL MÜZESİ)
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 42px "MYRIAD PRO", sans-serif';

  const titleLines = wrapText(ctx, (data.mainTitle || 'ANKARA RESİM VE HEYKEL MÜZESİ').toUpperCase(), 470);
  let titleY = 115;
  titleLines.forEach((line) => {
    ctx.fillText(line, 98, titleY);
    titleY += 48;
  });

  // Slogan & Divider line
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 20px "MYRIAD PRO", sans-serif';
  ctx.fillText(data.slogan || 'GEÇMİŞTEN İLHAM AL, GELECEĞİ KEŞFET!', 98, titleY + 8);

  ctx.beginPath();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.moveTo(98, titleY + 22);
  ctx.lineTo(560, titleY + 22);
  ctx.stroke();

  // 3. TOP RIGHT PHOTO SHOWCASE (User Uploaded Photo or AI Photo)
  const imageToLoad = photoUrl || data.aiGeneratedImageUrl || '/posters/resim-heykel-bina.png';
  let photoLoaded = false;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        photoLoaded = true;
        resolve();
      };
      img.onerror = () => reject();
      img.src = imageToLoad;
    });

    if (photoLoaded) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(585, 30, 580, 375, 14);
      ctx.clip();
      ctx.drawImage(img, 585, 30, 580, 375);
      ctx.restore();

      // Photo border in primary color
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.roundRect(585, 30, 580, 375, 14);
      ctx.stroke();
    }
  } catch (e) {
    console.warn('Canvas primary photo fallback notice:', e);
    ctx.beginPath();
    ctx.fillStyle = '#E2D8CC';
    ctx.roundRect(585, 30, 580, 375, 14);
    ctx.fill();
  }

  // 4. MIDDLE SECTION (Y: 420 to 1050)
  // --- Left Box 1: ABOUT (HAKKINDA) ---
  const aboutTitle = (data.mainTitle || 'MEKAN').toUpperCase() + ' HAKKINDA';
  drawBadgeHeader(ctx, 35, 425, 535, 44, aboutTitle, '🏛️', primaryColor);
  drawRoundedBox(ctx, 35, 475, 535, 165, cardBorderColor, ds.themeVariant);

  ctx.beginPath();
  ctx.fillStyle = '#1E293B';
  ctx.font = '500 18px "MYRIAD PRO", sans-serif';
  ctx.textAlign = 'left';
  const aboutLines = wrapText(ctx, data.aboutText, 495);
  let abY = 508;
  aboutLines.slice(0, 5).forEach((line) => {
    ctx.fillText(line, 55, abY);
    abY += 28;
  });

  // --- Left Box 2: WHAT IS THERE (MÜZEDE NELER VAR?) ---
  drawBadgeHeader(ctx, 35, 655, 535, 44, 'MÜZEDE / ROTADA NELER VAR?', '🏺', primaryColor);
  drawRoundedBox(ctx, 35, 705, 535, 345, cardBorderColor, ds.themeVariant);

  const whatItems = data.whatIsThere || [
    { title: 'ARKEOLOJİ VE SANAT KOLEKSİYONU', desc: 'Tarihi dönemlere ait eserler ve objeler.' },
    { title: 'GEÇİCİ SANAT SERGİLERİ', desc: 'Seçkin sergi ve sanat eserleri sergilenir.' },
    { title: 'KÜLTÜREL VE EĞİTİM ETKİNLİKLERİ', desc: 'Atölyeler ve söyleşiler düzenlenmektedir.' },
  ];

  let itemY = 735;
  const iconSymbols = ['🏛️', '🏺', '🎶'];
  whatItems.slice(0, 3).forEach((item, index) => {
    // Circle Icon Badge with Accent Color
    ctx.beginPath();
    ctx.fillStyle = accentColor;
    ctx.arc(75, itemY + 22, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(iconSymbols[index] || '✨', 75, itemY + 29);

    // Title & Desc
    ctx.beginPath();
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 18px "MYRIAD PRO", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.title, 110, itemY + 14);

    ctx.fillStyle = '#475569';
    ctx.font = '16px "MYRIAD PRO", sans-serif';
    const dLines = wrapText(ctx, item.desc, 440);
    ctx.fillText(dLines[0] || '', 110, itemY + 38);
    if (dLines[1]) ctx.fillText(dLines[1], 110, itemY + 58);

    itemY += 98;
  });

  // --- Right Box 3: GEZİ BİLGİLERİ ---
  drawBadgeHeader(ctx, 585, 425, 580, 44, '📍 GEZİ BİLGİLERİ', '📍', primaryColor);
  drawRoundedBox(ctx, 585, 475, 580, 575, cardBorderColor, ds.themeVariant);

  let infoY = 515;
  const gezi = data.geziBilgileri || {
    yer: `${district} / Ankara`,
    saatler: 'Salı - Pazar 09.00 - 17.00 (Pazartesi kapalı)',
    kurucu: 'T.C. Millî Eğitim Bakanlığı',
    ulasim: 'Otobüs ve metro hatları ile ulaşabilirsiniz.',
  };

  drawInfoRow(ctx, 610, infoY, '📍', 'YER:', gezi.yer, primaryColor, accentColor);
  drawInfoRow(ctx, 610, infoY + 75, '⏰', 'ZİYARET SAATLERİ:', gezi.saatler, primaryColor, accentColor);
  drawInfoRow(ctx, 610, infoY + 150, '👤', 'KURUCU / MİMAR:', gezi.kurucu, primaryColor, accentColor);
  drawInfoRow(ctx, 610, infoY + 225, '🚌', 'ULAŞIM:', gezi.ulasim, primaryColor, accentColor);

  // Sub-note box inside Gezi Bilgileri
  ctx.beginPath();
  ctx.fillStyle = '#F5EFE6';
  ctx.roundRect(605, infoY + 305, 540, 85, 10);
  ctx.fill();
  ctx.strokeStyle = cardBorderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = accentColor;
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ℹ️', 625, infoY + 355);

  ctx.fillStyle = '#334155';
  ctx.font = '500 15px "MYRIAD PRO", sans-serif';
  ctx.fillText('Müze ve mevkii girişleri etkinlik programlarına göre değişkenlik gösterebilir.', 665, infoY + 342);
  ctx.fillText(`Hazırlayan: Öğr. ${authorName} (${authorSchool})`, 665, infoY + 368);

  // 5. BOTTOM SECTION 1: GEZİMİZDEN NELER ÖĞRENECEĞİZ? (Y: 1070)
  drawBadgeHeader(ctx, 35, 1070, 1130, 44, '⚙️ GEZİMİZDEN NELER ÖĞRENECEĞİZ?', '⚙️', primaryColor);
  drawRoundedBox(ctx, 35, 1120, 1130, 190, cardBorderColor, ds.themeVariant);

  const learnings = data.learnings || [
    "Ankara'nın tarihi ve kültürel mirasını tanıyacağız.",
    'Farklı dönemlere ait eserleri inceleyeceğiz.',
    'Tarihi toplumların gelişimini keşfedeceğiz.',
    'Gözlem yapacak, sorular soracağız.',
    'Kültürel mirasın korunmasını fark edeceğiz.',
  ];

  const colWidth = 210;
  const colIcons = ['🏛️', '🔍', '🏺', '👁️', '👥'];

  learnings.slice(0, 5).forEach((learnText, idx) => {
    const cx = 55 + idx * (colWidth + 12);
    const cy = 1145;

    // Solid Circle Icon Badge
    ctx.beginPath();
    ctx.fillStyle = accentColor;
    ctx.arc(cx + colWidth / 2, cy + 24, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(colIcons[idx] || '✨', cx + colWidth / 2, cy + 31);

    ctx.beginPath();
    ctx.fillStyle = '#1E293B';
    ctx.font = '600 15px "MYRIAD PRO", sans-serif';

    const textLines = wrapText(ctx, learnText, colWidth - 12);
    let ly = cy + 74;
    textLines.forEach((l) => {
      ctx.fillText(l, cx + colWidth / 2, ly);
      ly += 20;
    });
  });

  // 6. BOTTOM SECTION 2: VERİMLİ GEÇİRMEK İÇİN & QUOTE (Y: 1330)
  drawBadgeHeader(ctx, 35, 1330, 680, 44, '🎒 GEZİMİZİ VERİMLİ GEÇİRMEK İÇİN', '🎒', primaryColor);
  drawRoundedBox(ctx, 35, 1380, 680, 270, cardBorderColor, ds.themeVariant);

  const tips = data.visitTips || [
    'Defter ve kalem getirmeyi unutma.',
    'Fotoğraf çekebilirsin, özen göster.',
    'Sessiz olalım, saygı duyalım.',
    'Eserlere dokunmayalım.',
    'Grup halinde hareket edelim.',
  ];

  const tipIcons = ['🎒', '📷', '🔇', '🖐️', '👥'];
  tips.slice(0, 5).forEach((tip, idx) => {
    const ty = 1405 + idx * 48;

    ctx.beginPath();
    ctx.fillStyle = primaryColor;
    ctx.arc(80, ty + 12, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tipIcons[idx] || '📌', 80, ty + 18);

    ctx.beginPath();
    ctx.fillStyle = '#1E293B';
    ctx.font = '600 16px "MYRIAD PRO", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(tip, 112, ty + 18);
  });

  // Right Quote Box
  drawRoundedBox(ctx, 735, 1330, 430, 320, cardBorderColor, ds.themeVariant);

  drawThemeHeaderAccent(ctx, ds.themeVariant, 1115, 1350, 36, 270, accentColor);

  ctx.beginPath();
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 54px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('“', 760, 1395);

  ctx.fillStyle = primaryColor;
  ctx.font = 'italic 20px Georgia, serif';
  const qLines = wrapText(
    ctx,
    data.quote || 'Tarih, insanın hafızasıdır; sanat ise ruhuna ışık tutar. Geçmişe dokunuyor, geleceğe ilham alıyoruz!',
    320
  );

  let qy = 1438;
  qLines.forEach((ql) => {
    ctx.fillText(ql, 765, qy);
    qy += 30;
  });

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText('”', 1045, qy + 10);

  // Guarantee export: a cross-origin photo without CORS headers (e.g. an AI-generated
  // preview image) can "taint" the canvas, which makes toDataURL throw a SecurityError.
  // If that happens, redraw the frame with the safe local fallback photo instead of failing.
  try {
    return canvas.toDataURL('image/jpeg', 0.94);
  } catch (err) {
    console.warn('Canvas dışa aktarma (toDataURL) güvenlik kısıtlaması nedeniyle başarısız oldu, yerel görsel ile yeniden deneniyor.', err);
    if (photoUrl !== '/posters/resim-heykel-bina.png') {
      return generatePosterImageFromCanvas({ ...params, photoUrl: '/posters/resim-heykel-bina.png' });
    }
    throw err;
  }
}

// Theme Accent Graphics
function drawThemeHeaderAccent(
  ctx: CanvasRenderingContext2D,
  themeVariant: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  if (themeVariant === 'ottoman_heritage') {
    // Ottoman Pointed Dome / Arch Motif
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + h * 0.4);
    ctx.quadraticCurveTo(x, y + h * 0.1, x + w / 2, y);
    ctx.quadraticCurveTo(x + w, y + h * 0.1, x + w, y + h * 0.4);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
    // Inner arch
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.moveTo(x + 6, y + h);
    ctx.lineTo(x + 6, y + h * 0.42);
    ctx.quadraticCurveTo(x + 6, y + h * 0.15, x + w / 2, y + 8);
    ctx.quadraticCurveTo(x + w - 6, y + h * 0.15, x + w - 6, y + h * 0.42);
    ctx.lineTo(x + w - 6, y + h);
    ctx.stroke();
    ctx.restore();
  } else if (themeVariant === 'art_deco') {
    // Sunburst / Star Emblem Motif
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    const cx = x + w / 2;
    const cy = y + 40;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const rx = cx + Math.cos(angle) * 22;
      const ry = cy + Math.sin(angle) * 22;
      ctx.fillRect(rx - 3, ry - 3, 6, 6);
    }
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (themeVariant === 'modern_minimalist') {
    // Minimalist Solid Accent Bar
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.roundRect(x, y, 8, h, 4);
    ctx.fill();
  } else {
    // classic_antique: Greek Column Pillar
    drawPillarGraphic(ctx, x, y, w, h, color);
  }
}

// Utility: Draw Header Badge
function drawBadgeHeader(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  iconSymbol: string,
  bgColor: string = '#0B1E36'
) {
  ctx.beginPath();
  ctx.fillStyle = bgColor;
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "MYRIAD PRO", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 20, y + 28);
}

// Utility: Draw Container Box
function drawRoundedBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  borderColor: string = '#D8CBB7',
  themeVariant: string = 'classic_antique'
) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.roundRect(x, y, w, h, themeVariant === 'modern_minimalist' ? 4 : 14);
  ctx.fill();

  ctx.strokeStyle = borderColor;

  if (themeVariant === 'ottoman_heritage') {
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2.5;
  } else if (themeVariant === 'art_deco') {
    ctx.lineWidth = 3;
  } else if (themeVariant === 'modern_minimalist') {
    ctx.lineWidth = 1;
  } else {
    ctx.lineWidth = 2;
  }

  ctx.stroke();
  ctx.restore();
}

// Utility: Draw Gezi Bilgileri Row
function drawInfoRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  icon: string,
  label: string,
  val: string,
  primaryColor: string = '#0B1E36',
  accentColor: string = '#B8860B'
) {
  ctx.beginPath();
  ctx.fillStyle = accentColor;
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(icon, x, y + 20);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 17px "MYRIAD PRO", sans-serif';
  ctx.fillText(label, x + 35, y + 18);

  ctx.fillStyle = '#334155';
  ctx.font = '500 16px "MYRIAD PRO", sans-serif';
  const valLines = wrapText(ctx, val, 480);
  ctx.fillText(valLines[0] || '', x + 35, y + 42);
  if (valLines[1]) ctx.fillText(valLines[1], x + 35, y + 64);
}

// Utility: Draw Greek Column Graphic
function drawPillarGraphic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  strokeColor: string = '#C5B59E'
) {
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;

  // Capital top
  ctx.strokeRect(x - 6, y, w + 12, 14);
  ctx.strokeRect(x - 2, y + 14, w + 4, 10);

  // Shaft lines
  ctx.moveTo(x + 4, y + 24);
  ctx.lineTo(x + 4, y + h - 24);
  ctx.moveTo(x + w / 2, y + 24);
  ctx.lineTo(x + w / 2, y + h - 24);
  ctx.moveTo(x + w - 4, y + 24);
  ctx.lineTo(x + w - 4, y + h - 24);
  ctx.stroke();

  // Base bottom
  ctx.strokeRect(x - 2, y + h - 24, w + 4, 10);
  ctx.strokeRect(x - 6, y + h - 14, w + 12, 14);
}

// Text wrapping utility
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
