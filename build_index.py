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
    <div class="header-title">Portföy Uygulamaları</div>
    <div class="header-subtitle">%d ekran &middot; bir tanesini seçin</div>
  </div>

  <div class="pages" id="pages">
"""

FOOT = u"""  </div>

  <div class="pager" id="pager">
    <button class="pager-btn" id="prev" aria-label="Önceki">&#8249;</button>
    <div class="dots" id="dots"></div>
    <button class="pager-btn" id="next" aria-label="Sonraki">&#8250;</button>
  </div>
</div>

<script src="app.js"></script>
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
