# -*- coding: utf-8 -*-
"""Generate the launcher page.

The tile list is kept here rather than hand-written into the HTML so the 1..N
numbering and the page splits stay in sync when screens are added.
"""
import io

PER_PAGE = 9

SCREENS = [
    ("grnt", u"Garanti"),
    ("ykb", u"Yapı Kredi"),
    ("is", u"İş Bankası"),
    ("oyk", u"Oyak Yatırım"),
    ("dark-liste", u"Liste (Koyu)"),
    ("red-portfoyum", u"Hisse Senetleri"),
    ("portfoy-emirler", u"Portföy / Emirler"),
    ("blue-card", u"Hisse Kartı"),
    ("navy-portfoy", u"Hisse Portföyüm"),
    ("red-tabs", u"Portföyüm (Sekmeli)"),
    ("orange-portfoyum", u"Portföyüm (Turuncu)"),
    ("navy-tab", u"Portföyüm (Lacivert)"),
    ("mobil-borsa", u"Mobil Borsa"),
    ("maroon-hesabim", u"Hesabım"),
    ("emir-takip", u"Hisse Emir Takip"),
    ("yesil-portfoy", u"Hisse Portföyüm (Yeşil)"),
    ("navy-liste", u"Portföyüm (Liste)"),
    ("varlik-detay", u"Varlık Detayı"),
    ("ykb-dunyam", u"Yatırım Dünyam"),
    ("mor-hesabim", u"Hesabım (Mor)"),
    ("koyu-liste", u"Liste (Lacivert)"),
    ("oyak-tum", u"Tüm Hesaplar"),
    ("atrium", u"Atrium/İstanbul"),
    ("sembol-tablo", u"Sembol Tablosu"),
    ("turuncu-varlik", u"Varlıklarım"),
    ("cepteteb", u"Portföyüm (CEPTETEB)"),
    ("portfoy-tablo", u"Portföy Tablosu"),
    ("emir-girisi", u"Emir Girişi"),
    ("vakif-yatirim", u"Vakıf Yatırım"),
    ("toplu-emir", u"Toplu Emir"),
    ("pdf-rapor", u"PDF Rapor"),
]

HEAD = u"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>Portföy Uygulamaları</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="phone" id="phone">
  <div class="header">
    <div class="header-text">
      <div class="header-title">Portföy Uygulamaları</div>
      <div class="header-subtitle">%d ekran &middot; bir tanesini seçin</div>
    </div>
    <button class="gear" id="btnSettings" aria-label="Ayarlar">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.65 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 15.6 12 3.6 3.6 0 0 1 12 15.6z"/>
      </svg>
    </button>
  </div>

  <div class="pages" id="pages">
"""

FOOT = u"""  </div>

  <div class="settings hidden" id="settings">
    <div class="settings-head">
      <button id="btnBack" aria-label="Geri">
        <svg viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h2>Ayarlar</h2>
      <span style="width:2.2em"></span>
    </div>
    <div class="settings-body">
      <div class="settings-card">
        <div class="field-row">
          <span class="field-label">IEYHO Son Fiyat</span>
          <input class="field-input" type="text" inputmode="decimal" id="inPrice" placeholder="179,60">
        </div>
        <div class="field-row">
          <span class="field-label">IEYHO Değişim %</span>
          <input class="field-input" type="text" inputmode="decimal" id="inChange" placeholder="4,12">
        </div>
        <p class="field-hint">Hissenin günlük fiyat değişimi %'si</p>
        <p class="field-note" id="priceNote"></p>
      </div>
    </div>
    <div class="settings-bar">
      <button class="btn-clear" id="btnClear">Temizle</button>
      <button class="btn-save" id="btnSavePrice">Kaydet</button>
    </div>
  </div>

  <div class="pager" id="pager">
    <button class="pager-btn" id="prev" aria-label="Önceki">&#8249;</button>
    <div class="dots" id="dots"></div>
    <button class="pager-btn" id="next" aria-label="Sonraki">&#8250;</button>
  </div>
</div>

<script src="parse-number.js"></script>
<script src="keyboard.js"></script>
<script src="global-price.js"></script>
<script src="app.js"></script>
<script src="shell.js"></script>
</body>
</html>
"""


def main():
    pages = [SCREENS[i:i + PER_PAGE] for i in range(0, len(SCREENS), PER_PAGE)]
    out = [HEAD % len(SCREENS)]
    n = 0
    for p in pages:
        out.append(u'    <div class="page">\n')
        for slug, name in p:
            n += 1
            out.append(
                u'      <a class="tile" href="%s/index.html">\n'
                u'        <span class="tile-shot"><img src="icons/%s.jpg" alt="" loading="lazy"></span>\n'
                u'        <span class="tile-label"><b>%d.</b> %s</span></a>\n' % (slug, slug, n, name))
        out.append(u'    </div>\n')
    out.append(FOOT)
    io.open("index.html", "w", encoding="utf-8").write(u"".join(out))
    print("%d screens across %d pages" % (len(SCREENS), len(pages)))


if __name__ == "__main__":
    main()
