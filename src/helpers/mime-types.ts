const MIMETypes = {
  documents: {
    pdf: [
      {
        name: 'pdf',
        template: 'application/pdf',
      },
    ],
    word: [
      {
        name: 'docx',
        template: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      {
        name: 'doc',
        template: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
    excel: [
      {
        name: 'xlsx',
        template: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      {
        name: 'xlsm',
        template: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      {
        name: 'xlsb',
        template: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      {
        name: 'xltx',
        template: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    text: [
      {
        name: 'txt',
        template: 'text/plain',
      },
      {
        name: 'cache-manifest',
        template: 'text/cache-manifest',
        reference: '[w3c][robin_berjon]',
      },
      {
        name: 'calendar',
        template: 'text/calendar',
        reference: '[rfc5545]',
      },
      {
        name: 'cql',
        template: 'text/cql',
        reference: '[hl7][bryn_rhodes]',
      },
      {
        name: 'cql-expression',
        template: 'text/cql-expression',
        reference: '[hl7][bryn_rhodes]',
      },
      {
        name: 'cql-identifier',
        template: 'text/cql-identifier',
        reference: '[hl7][bryn_rhodes]',
      },
      {
        name: 'css',
        template: 'text/css',
        reference: '[rfc2318]',
      },
      {
        name: 'csv',
        template: 'text/csv',
        reference: '[rfc4180][rfc7111]',
      },
      {
        name: 'csv-schema',
        template: 'text/csv-schema',
        reference: '[national_archives_uk][david_underdown]',
      },
      {
        name: 'directory - deprecated by rfc6350',
        template: 'text/directory',
        reference: '[rfc2425][rfc6350]',
      },
      {
        name: 'dns',
        template: 'text/dns',
        reference: '[rfc4027]',
      },
      {
        name: 'ecmascript (obsoleted in favor of text/javascript)',
        template: 'text/ecmascript',
        reference: '[rfc9239]',
      },
      {
        name: 'encaprtp',
        template: 'text/encaprtp',
        reference: '[rfc6849]',
      },
      {
        name: 'enriched',
        template: '',
        reference: '[rfc1896]',
      },
      {
        name: 'example',
        template: 'text/example',
        reference: '[rfc4735]',
      },
      {
        name: 'fhirpath',
        template: 'text/fhirpath',
        reference: '[hl7][bryn_rhodes]',
      },
      {
        name: 'flexfec',
        template: 'text/flexfec',
        reference: '[rfc8627]',
      },
      {
        name: 'fwdred',
        template: 'text/fwdred',
        reference: '[rfc6354]',
      },
      {
        name: 'gff3',
        template: 'text/gff3',
        reference: '[sequence_ontology]',
      },
      {
        name: 'grammar-ref-list',
        template: 'text/grammar-ref-list',
        reference: '[rfc6787]',
      },
      {
        name: 'hl7v2',
        template: 'text/hl7v2',
        reference: '[hl7][marc_duteau]',
      },
      {
        name: 'html',
        template: 'text/html',
        reference: '[w3c][robin_berjon]',
      },
      {
        name: 'javascript',
        template: 'text/javascript',
        reference: '[rfc9239]',
      },
      {
        name: 'jcr-cnd',
        template: 'text/jcr-cnd',
        reference: '[peeter_piegaze]',
      },
      {
        name: 'markdown',
        template: 'text/markdown',
        reference: '[rfc7763]',
      },
      {
        name: 'mizar',
        template: 'text/mizar',
        reference: '[jesse_alama]',
      },
      {
        name: 'n3',
        template: 'text/n3',
        reference: '[w3c][eric_prudhommeaux]',
      },
      {
        name: 'parameters',
        template: 'text/parameters',
        reference: '[rfc7826]',
      },
      {
        name: 'parityfec',
        template: 'text/parityfec',
        reference: '[rfc3009]',
      },
      {
        name: 'plain',
        template: '',
        reference: '[rfc2046][rfc3676][rfc5147]',
      },
      {
        name: 'provenance-notation',
        template: 'text/provenance-notation',
        reference: '[w3c][ivan_herman]',
      },
      {
        name: 'prs.fallenstein.rst',
        template: 'text/prs.fallenstein.rst',
        reference: '[benja_fallenstein]',
      },
      {
        name: 'prs.lines.tag',
        template: 'text/prs.lines.tag',
        reference: '[john_lines]',
      },
      {
        name: 'prs.prop.logic',
        template: 'text/prs.prop.logic',
        reference: '[hans-dieter_a._hiep]',
      },
      {
        name: 'raptorfec',
        template: 'text/raptorfec',
        reference: '[rfc6682]',
      },
      {
        name: 'red',
        template: 'text/red',
        reference: '[rfc4102]',
      },
      {
        name: 'rfc822-headers',
        template: 'text/rfc822-headers',
        reference: '[rfc6522]',
      },
      {
        name: 'richtext',
        template: '',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'rtf',
        template: 'text/rtf',
        reference: '[paul_lindner]',
      },
      {
        name: 'rtp-enc-aescm128',
        template: 'text/rtp-enc-aescm128',
        reference: '[_3gpp]',
      },
      {
        name: 'rtploopback',
        template: 'text/rtploopback',
        reference: '[rfc6849]',
      },
      {
        name: 'rtx',
        template: 'text/rtx',
        reference: '[rfc4588]',
      },
      {
        name: 'sgml',
        template: 'text/sgml',
        reference: '[rfc1874]',
      },
      {
        name: 'shaclc',
        template: 'text/shaclc',
        reference: '[w3c_shacl_community_group][vladimir_alexiev]',
      },
      {
        name: 'shex',
        template: 'text/shex',
        reference: '[w3c][eric_prudhommeaux]',
      },
      {
        name: 'spdx',
        template: 'text/spdx',
        reference: '[linux_foundation][rose_judge]',
      },
      {
        name: 'strings',
        template: 'text/strings',
        reference: '[ieee-isto-pwg-ppp]',
      },
      {
        name: 't140',
        template: 'text/t140',
        reference: '[rfc4103]',
      },
      {
        name: 'tab-separated-values',
        template: 'text/tab-separated-values',
        reference: '[paul_lindner]',
      },
      {
        name: 'troff',
        template: 'text/troff',
        reference: '[rfc4263]',
      },
      {
        name: 'turtle',
        template: 'text/turtle',
        reference: '[w3c][eric_prudhommeaux]',
      },
      {
        name: 'ulpfec',
        template: 'text/ulpfec',
        reference: '[rfc5109]',
      },
      {
        name: 'uri-list',
        template: 'text/uri-list',
        reference: '[rfc2483]',
      },
      {
        name: 'vcard',
        template: 'text/vcard',
        reference: '[rfc6350]',
      },
      {
        name: 'vnd.a',
        template: 'text/vnd.a',
        reference: '[regis_dehoux]',
      },
      {
        name: 'vnd.abc',
        template: 'text/vnd.abc',
        reference: '[steve_allen]',
      },
      {
        name: 'vnd.ascii-art',
        template: 'text/vnd.ascii-art',
        reference: '[kim_scarborough]',
      },
      {
        name: 'vnd.curl',
        template: 'text/vnd.curl',
        reference: '[robert_byrnes]',
      },
      {
        name: 'vnd.debian.copyright',
        template: 'text/vnd.debian.copyright',
        reference: '[charles_plessy]',
      },
      {
        name: 'vnd.dmclientscript',
        template: 'text/vnd.dmclientscript',
        reference: '[dan_bradley]',
      },
      {
        name: 'vnd.dvb.subtitle',
        template: 'text/vnd.dvb.subtitle',
        reference: '[peter_siebert][michael_lagally]',
      },
      {
        name: 'vnd.esmertec.theme-descriptor',
        template: 'text/vnd.esmertec.theme-descriptor',
        reference: '[stefan_eilemann]',
      },
      {
        name: 'vnd.exchangeable',
        template: 'text/vnd.exchangeable',
        reference: '[martin_cizek]',
      },
      {
        name: 'vnd.familysearch.gedcom',
        template: 'text/vnd.familysearch.gedcom',
        reference: '[gordon_clarke]',
      },
      {
        name: 'vnd.ficlab.flt',
        template: 'text/vnd.ficlab.flt',
        reference: '[steve_gilberd]',
      },
      {
        name: 'vnd.fly',
        template: 'text/vnd.fly',
        reference: '[john-mark_gurney]',
      },
      {
        name: 'vnd.fmi.flexstor',
        template: 'text/vnd.fmi.flexstor',
        reference: '[kari_e._hurtta]',
      },
      {
        name: 'vnd.gml',
        template: 'text/vnd.gml',
        reference: '[mi_tar]',
      },
      {
        name: 'vnd.graphviz',
        template: 'text/vnd.graphviz',
        reference: '[john_ellson]',
      },
      {
        name: 'vnd.hans',
        template: 'text/vnd.hans',
        reference: '[hill_hanxv]',
      },
      {
        name: 'vnd.hgl',
        template: 'text/vnd.hgl',
        reference: '[heungsub_lee]',
      },
      {
        name: 'vnd.in3d.3dml',
        template: 'text/vnd.in3d.3dml',
        reference: '[michael_powers]',
      },
      {
        name: 'vnd.in3d.spot',
        template: 'text/vnd.in3d.spot',
        reference: '[michael_powers]',
      },
      {
        name: 'vnd.iptc.newsml',
        template: 'text/vnd.iptc.newsml',
        reference: '[iptc]',
      },
      {
        name: 'vnd.iptc.nitf',
        template: 'text/vnd.iptc.nitf',
        reference: '[iptc]',
      },
      {
        name: 'vnd.latex-z',
        template: 'text/vnd.latex-z',
        reference: '[mikusiak_lubos]',
      },
      {
        name: 'vnd.motorola.reflex',
        template: 'text/vnd.motorola.reflex',
        reference: '[mark_patton]',
      },
      {
        name: 'vnd.ms-mediapackage',
        template: 'text/vnd.ms-mediapackage',
        reference: '[jan_nelson]',
      },
      {
        name: 'vnd.net2phone.commcenter.command',
        template: 'text/vnd.net2phone.commcenter.command',
        reference: '[feiyu_xie]',
      },
      {
        name: 'vnd.radisys.msml-basic-layout',
        template: 'text/vnd.radisys.msml-basic-layout',
        reference: '[rfc5707]',
      },
      {
        name: 'vnd.senx.warpscript',
        template: 'text/vnd.senx.warpscript',
        reference: '[pierre_papin]',
      },
      {
        name: 'vnd.si.uricatalogue (obsoleted by request)',
        template: 'text/vnd.si.uricatalogue',
        reference: '[nicholas_parks_young]',
      },
      {
        name: 'vnd.sun.j2me.app-descriptor',
        template: 'text/vnd.sun.j2me.app-descriptor',
        reference: '[gary_adams]',
      },
      {
        name: 'vnd.sosi',
        template: 'text/vnd.sosi',
        reference: '[petter_reinholdtsen]',
      },
      {
        name: 'vnd.trolltech.linguist',
        template: 'text/vnd.trolltech.linguist',
        reference: '[david_lee_lambert]',
      },
      {
        name: 'vnd.wap.si',
        template: 'text/vnd.wap.si',
        reference: '[wap-forum]',
      },
      {
        name: 'vnd.wap.sl',
        template: 'text/vnd.wap.sl',
        reference: '[wap-forum]',
      },
      {
        name: 'vnd.wap.wml',
        template: 'text/vnd.wap.wml',
        reference: '[peter_stark]',
      },
      {
        name: 'vnd.wap.wmlscript',
        template: 'text/vnd.wap.wmlscript',
        reference: '[peter_stark]',
      },
      {
        name: 'vtt',
        template: 'text/vtt',
        reference: '[w3c][silvia_pfeiffer]',
      },
      {
        name: 'wgsl',
        template: 'text/wgsl',
        reference: '[w3c][david_neto]',
      },
      {
        name: 'xml',
        template: 'text/xml',
        reference: '[rfc7303]',
      },
      {
        name: 'xml-external-parsed-entity',
        template: 'text/xml-external-parsed-entity',
        reference: '[rfc7303]',
      },
    ],
  },
  media: {
    image: [
      {
        name: 'aces',
        template: 'image/aces',
        reference: '[smpte][howard_lukk]',
      },
      {
        name: 'apng',
        template: 'image/apng',
        reference: '[w3c][w3c_png_working_group]',
      },
      {
        name: 'avci',
        template: 'image/avci',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'avcs',
        template: 'image/avcs',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'avif',
        template: 'image/avif',
        reference: '[alliance_for_open_media][cyril_concolato]',
      },
      {
        name: 'bmp',
        template: 'image/bmp',
        reference: '[rfc7903]',
      },
      {
        name: 'cgm',
        template: 'image/cgm',
        reference: '[alan_francis]',
      },
      {
        name: 'dicom-rle',
        template: 'image/dicom-rle',
        reference: '[dicom_standard_committee][david_clunie]',
      },
      {
        name: 'dpx',
        template: 'image/dpx',
        reference: '[smpte][smpte_director_of_standards_development]',
      },
      {
        name: 'emf',
        template: 'image/emf',
        reference: '[rfc7903]',
      },
      {
        name: 'example',
        template: 'image/example',
        reference: '[rfc4735]',
      },
      {
        name: 'fits',
        template: 'image/fits',
        reference: '[rfc4047]',
      },
      {
        name: 'g3fax',
        template: 'image/g3fax',
        reference: '[rfc1494]',
      },
      {
        name: 'gif',
        template: '',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'heic',
        template: 'image/heic',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'heic-sequence',
        template: 'image/heic-sequence',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'heif',
        template: 'image/heif',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'heif-sequence',
        template: 'image/heif-sequence',
        reference: '[iso-iec_jtc_1][david_singer]',
      },
      {
        name: 'hej2k',
        template: 'image/hej2k',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'hsj2',
        template: 'image/hsj2',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'ief',
        template: '',
        reference: '[rfc1314]',
      },
      {
        name: 'j2c',
        template: 'image/j2c',
        reference: '[iso-iec_jtc_1_sc_29_wg_1][iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jls',
        template: 'image/jls',
        reference: '[dicom_standard_committee][david_clunie]',
      },
      {
        name: 'jp2',
        template: 'image/jp2',
        reference: '[rfc3745]',
      },
      {
        name: 'jpeg',
        template: 'image/jpeg',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'jpg',
        template: 'image/jpeg',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'jfif',
        template: 'image/jpeg',
        reference: '',
      },
      {
        name: 'jph',
        template: 'image/jph',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jphc',
        template: 'image/jphc',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jpm',
        template: 'image/jpm',
        reference: '[rfc3745]',
      },
      {
        name: 'jpx',
        template: 'image/jpx',
        reference: '[rfc3745]',
      },
      {
        name: 'jxr',
        template: 'image/jxr',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jxra',
        template: 'image/jxra',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jxrs',
        template: 'image/jxrs',
        reference: '[iso-iec_jtc_1][itu-t]',
      },
      {
        name: 'jxs',
        template: 'image/jxs',
        reference: '[iso-iec_jtc_1]',
      },
      {
        name: 'jxsc',
        template: 'image/jxsc',
        reference: '[iso-iec_jtc_1]',
      },
      {
        name: 'jxsi',
        template: 'image/jxsi',
        reference: '[iso-iec_jtc_1]',
      },
      {
        name: 'jxss',
        template: 'image/jxss',
        reference: '[iso-iec_jtc_1]',
      },
      {
        name: 'ktx',
        template: 'image/ktx',
        reference: '[khronos][mark_callow]',
      },
      {
        name: 'ktx2',
        template: 'image/ktx2',
        reference: '[khronos][mark_callow]',
      },
      {
        name: 'naplps',
        template: 'image/naplps',
        reference: '[ilya_ferber]',
      },
      {
        name: 'png',
        template: 'image/png',
        reference: '[w3c][png_working_group]',
      },
      {
        name: 'prs.btif',
        template: 'image/prs.btif',
        reference: '[ben_simon]',
      },
      {
        name: 'prs.pti',
        template: 'image/prs.pti',
        reference: '[juern_laun]',
      },
      {
        name: 'pwg-raster',
        template: 'image/pwg-raster',
        reference: '[michael_sweet]',
      },
      {
        name: 'svg+xml',
        template: 'image/svg+xml',
        reference: '[w3c][http://www.w3.org/tr/svg/mimereg.html]',
      },
      {
        name: 't38',
        template: 'image/t38',
        reference: '[rfc3362]',
      },
      {
        name: 'tiff',
        template: 'image/tiff',
        reference: '[rfc3302]',
      },
      {
        name: 'tiff-fx',
        template: 'image/tiff-fx',
        reference: '[rfc3950]',
      },
      {
        name: 'vnd.adobe.photoshop',
        template: 'image/vnd.adobe.photoshop',
        reference: '[kim_scarborough]',
      },
      {
        name: 'vnd.airzip.accelerator.azv',
        template: 'image/vnd.airzip.accelerator.azv',
        reference: '[gary_clueit]',
      },
      {
        name: 'vnd.cns.inf2',
        template: 'image/vnd.cns.inf2',
        reference: '[ann_mclaughlin]',
      },
      {
        name: 'vnd.dece.graphic',
        template: 'image/vnd.dece.graphic',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.djvu',
        template: 'image/vnd.djvu',
        reference: '[leon_bottou]',
      },
      {
        name: 'vnd.dwg',
        template: 'image/vnd.dwg',
        reference: '[jodi_moline]',
      },
      {
        name: 'vnd.dxf',
        template: 'image/vnd.dxf',
        reference: '[jodi_moline]',
      },
      {
        name: 'vnd.dvb.subtitle',
        template: 'image/vnd.dvb.subtitle',
        reference: '[peter_siebert][michael_lagally]',
      },
      {
        name: 'vnd.fastbidsheet',
        template: 'image/vnd.fastbidsheet',
        reference: '[scott_becker]',
      },
      {
        name: 'vnd.fpx',
        template: 'image/vnd.fpx',
        reference: '[marc_douglas_spencer]',
      },
      {
        name: 'vnd.fst',
        template: 'image/vnd.fst',
        reference: '[arild_fuldseth]',
      },
      {
        name: 'vnd.fujixerox.edmics-mmr',
        template: 'image/vnd.fujixerox.edmics-mmr',
        reference: '[masanori_onda]',
      },
      {
        name: 'vnd.fujixerox.edmics-rlc',
        template: 'image/vnd.fujixerox.edmics-rlc',
        reference: '[masanori_onda]',
      },
      {
        name: 'vnd.globalgraphics.pgb',
        template: 'image/vnd.globalgraphics.pgb',
        reference: '[martin_bailey]',
      },
      {
        name: 'vnd.microsoft.icon',
        template: 'image/vnd.microsoft.icon',
        reference: '[simon_butcher]',
      },
      {
        name: 'vnd.mix',
        template: 'image/vnd.mix',
        reference: '[saveen_reddy]',
      },
      {
        name: 'vnd.ms-modi',
        template: 'image/vnd.ms-modi',
        reference: '[gregory_vaughan]',
      },
      {
        name: 'vnd.mozilla.apng',
        template: 'image/vnd.mozilla.apng',
        reference: '[stuart_parmenter]',
      },
      {
        name: 'vnd.net-fpx',
        template: 'image/vnd.net-fpx',
        reference: '[marc_douglas_spencer]',
      },
      {
        name: 'vnd.pco.b16',
        template: 'image/vnd.pco.b16',
        reference: '[pco_ag][jan_zeman]',
      },
      {
        name: 'vnd.radiance',
        template: 'image/vnd.radiance',
        reference: '[randolph_fritz][greg_ward]',
      },
      {
        name: 'vnd.sealed.png',
        template: 'image/vnd.sealed.png',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.sealedmedia.softseal.gif',
        template: 'image/vnd.sealedmedia.softseal.gif',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.sealedmedia.softseal.jpg',
        template: 'image/vnd.sealedmedia.softseal.jpg',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.svf',
        template: 'image/vnd.svf',
        reference: '[jodi_moline]',
      },
      {
        name: 'vnd.tencent.tap',
        template: 'image/vnd.tencent.tap',
        reference: '[ni_hui]',
      },
      {
        name: 'vnd.valve.source.texture',
        template: 'image/vnd.valve.source.texture',
        reference: '[henrik_andersson]',
      },
      {
        name: 'vnd.wap.wbmp',
        template: 'image/vnd.wap.wbmp',
        reference: '[peter_stark]',
      },
      {
        name: 'vnd.xiff',
        template: 'image/vnd.xiff',
        reference: '[steven_martin]',
      },
      {
        name: 'vnd.zbrush.pcx',
        template: 'image/vnd.zbrush.pcx',
        reference: '[chris_charabaruk]',
      },
      {
        name: 'webp',
        template: 'image/webp',
        reference: '[rfc-zern-webp-12]',
      },
      {
        name: 'wmf',
        template: 'image/wmf',
        reference: '[rfc7903]',
      },
      {
        name: 'x-emf - deprecated in favor of image/emf',
        template: 'image/emf',
        reference: '[rfc7903]',
      },
      {
        name: 'x-wmf - deprecated in favor of image/wmf',
        template: 'image/wmf',
        reference: '[rfc7903]',
      },
    ],
    audio: [
      {
        name: '32kadpcm',
        template: 'audio/32kadpcm',
        reference: '[rfc3802][rfc2421]',
      },
      {
        name: '3gpp',
        template: 'audio/3gpp',
        reference: '[rfc3839][rfc6381]',
      },
      {
        name: '3gpp2',
        template: 'audio/3gpp2',
        reference: '[rfc4393][rfc6381]',
      },
      {
        name: 'aac',
        template: 'audio/aac',
        reference: '[iso-iec_jtc_1][max_neuendorf]',
      },
      {
        name: 'ac3',
        template: 'audio/ac3',
        reference: '[rfc4184]',
      },
      {
        name: 'amr',
        template: 'audio/amr',
        reference: '[rfc4867]',
      },
      {
        name: 'amr-wb',
        template: 'audio/amr-wb',
        reference: '[rfc4867]',
      },
      {
        name: 'amr-wb+',
        template: 'audio/amr-wb+',
        reference: '[rfc4352]',
      },
      {
        name: 'aptx',
        template: 'audio/aptx',
        reference: '[rfc7310]',
      },
      {
        name: 'asc',
        template: 'audio/asc',
        reference: '[rfc6295]',
      },
      {
        name: 'atrac-advanced-lossless',
        template: 'audio/atrac-advanced-lossless',
        reference: '[rfc5584]',
      },
      {
        name: 'atrac-x',
        template: 'audio/atrac-x',
        reference: '[rfc5584]',
      },
      {
        name: 'atrac3',
        template: 'audio/atrac3',
        reference: '[rfc5584]',
      },
      {
        name: 'basic',
        template: 'audio/basic',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'bv16',
        template: 'audio/bv16',
        reference: '[rfc4298]',
      },
      {
        name: 'bv32',
        template: 'audio/bv32',
        reference: '[rfc4298]',
      },
      {
        name: 'clearmode',
        template: 'audio/clearmode',
        reference: '[rfc4040]',
      },
      {
        name: 'cn',
        template: 'audio/cn',
        reference: '[rfc3389]',
      },
      {
        name: 'dat12',
        template: 'audio/dat12',
        reference: '[rfc3190]',
      },
      {
        name: 'dls',
        template: 'audio/dls',
        reference: '[rfc4613]',
      },
      {
        name: 'dsr-es201108',
        template: 'audio/dsr-es201108',
        reference: '[rfc3557]',
      },
      {
        name: 'dsr-es202050',
        template: 'audio/dsr-es202050',
        reference: '[rfc4060]',
      },
      {
        name: 'dsr-es202211',
        template: 'audio/dsr-es202211',
        reference: '[rfc4060]',
      },
      {
        name: 'dsr-es202212',
        template: 'audio/dsr-es202212',
        reference: '[rfc4060]',
      },
      {
        name: 'dv',
        template: 'audio/dv',
        reference: '[rfc6469]',
      },
      {
        name: 'dvi4',
        template: 'audio/dvi4',
        reference: '[rfc4856]',
      },
      {
        name: 'eac3',
        template: 'audio/eac3',
        reference: '[rfc4598]',
      },
      {
        name: 'encaprtp',
        template: 'audio/encaprtp',
        reference: '[rfc6849]',
      },
      {
        name: 'evrc',
        template: 'audio/evrc',
        reference: '[rfc4788]',
      },
      {
        name: 'evrc-qcp',
        template: 'audio/evrc-qcp',
        reference: '[rfc3625]',
      },
      {
        name: 'evrc0',
        template: 'audio/evrc0',
        reference: '[rfc4788]',
      },
      {
        name: 'evrc1',
        template: 'audio/evrc1',
        reference: '[rfc4788]',
      },
      {
        name: 'evrcb',
        template: 'audio/evrcb',
        reference: '[rfc5188]',
      },
      {
        name: 'evrcb0',
        template: 'audio/evrcb0',
        reference: '[rfc5188]',
      },
      {
        name: 'evrcb1',
        template: 'audio/evrcb1',
        reference: '[rfc4788]',
      },
      {
        name: 'evrcnw',
        template: 'audio/evrcnw',
        reference: '[rfc6884]',
      },
      {
        name: 'evrcnw0',
        template: 'audio/evrcnw0',
        reference: '[rfc6884]',
      },
      {
        name: 'evrcnw1',
        template: 'audio/evrcnw1',
        reference: '[rfc6884]',
      },
      {
        name: 'evrcwb',
        template: 'audio/evrcwb',
        reference: '[rfc5188]',
      },
      {
        name: 'evrcwb0',
        template: 'audio/evrcwb0',
        reference: '[rfc5188]',
      },
      {
        name: 'evrcwb1',
        template: 'audio/evrcwb1',
        reference: '[rfc5188]',
      },
      {
        name: 'evs',
        template: 'audio/evs',
        reference: '[_3gpp][kyunghun_jung]',
      },
      {
        name: 'example',
        template: 'audio/example',
        reference: '[rfc4735]',
      },
      {
        name: 'flexfec',
        template: 'audio/flexfec',
        reference: '[rfc8627]',
      },
      {
        name: 'fwdred',
        template: 'audio/fwdred',
        reference: '[rfc6354]',
      },
      {
        name: 'g711-0',
        template: 'audio/g711-0',
        reference: '[rfc7655]',
      },
      {
        name: 'g719',
        template: 'audio/g719',
        reference: '[rfc5404][rfc errata 3245]',
      },
      {
        name: 'g7221',
        template: 'audio/g7221',
        reference: '[rfc5577]',
      },
      {
        name: 'g722',
        template: 'audio/g722',
        reference: '[rfc4856]',
      },
      {
        name: 'g723',
        template: 'audio/g723',
        reference: '[rfc4856]',
      },
      {
        name: 'g726-16',
        template: 'audio/g726-16',
        reference: '[rfc4856]',
      },
      {
        name: 'g726-24',
        template: 'audio/g726-24',
        reference: '[rfc4856]',
      },
      {
        name: 'g726-32',
        template: 'audio/g726-32',
        reference: '[rfc4856]',
      },
      {
        name: 'g726-40',
        template: 'audio/g726-40',
        reference: '[rfc4856]',
      },
      {
        name: 'g728',
        template: 'audio/g728',
        reference: '[rfc4856]',
      },
      {
        name: 'g729',
        template: 'audio/g729',
        reference: '[rfc4856]',
      },
      {
        name: 'g7291',
        template: 'audio/g7291',
        reference: '[rfc4749][rfc5459]',
      },
      {
        name: 'g729d',
        template: 'audio/g729d',
        reference: '[rfc4856]',
      },
      {
        name: 'g729e',
        template: 'audio/g729e',
        reference: '[rfc4856]',
      },
      {
        name: 'gsm',
        template: 'audio/gsm',
        reference: '[rfc4856]',
      },
      {
        name: 'gsm-efr',
        template: 'audio/gsm-efr',
        reference: '[rfc4856]',
      },
      {
        name: 'gsm-hr-08',
        template: 'audio/gsm-hr-08',
        reference: '[rfc5993]',
      },
      {
        name: 'ilbc',
        template: 'audio/ilbc',
        reference: '[rfc3952]',
      },
      {
        name: 'ip-mr_v2.5',
        template: 'audio/ip-mr_v2.5',
        reference: '[rfc6262]',
      },
      {
        name: 'l8',
        template: 'audio/l8',
        reference: '[rfc4856]',
      },
      {
        name: 'l16',
        template: 'audio/l16',
        reference: '[rfc4856]',
      },
      {
        name: 'l20',
        template: 'audio/l20',
        reference: '[rfc3190]',
      },
      {
        name: 'l24',
        template: 'audio/l24',
        reference: '[rfc3190]',
      },
      {
        name: 'lpc',
        template: 'audio/lpc',
        reference: '[rfc4856]',
      },
      {
        name: 'melp',
        template: 'audio/melp',
        reference: '[rfc8130]',
      },
      {
        name: 'melp600',
        template: 'audio/melp600',
        reference: '[rfc8130]',
      },
      {
        name: 'melp1200',
        template: 'audio/melp1200',
        reference: '[rfc8130]',
      },
      {
        name: 'melp2400',
        template: 'audio/melp2400',
        reference: '[rfc8130]',
      },
      {
        name: 'mhas',
        template: 'audio/mhas',
        reference: '[iso-iec_jtc_1][nils_peters][ingo_hofmann]',
      },
      {
        name: 'mobile-xmf',
        template: 'audio/mobile-xmf',
        reference: '[rfc4723]',
      },
      {
        name: 'mpa',
        template: 'audio/mpa',
        reference: '[rfc3555]',
      },
      {
        name: 'mp4',
        template: 'audio/mp4',
        reference: '[rfc4337][rfc6381]',
      },
      {
        name: 'mp4a-latm',
        template: 'audio/mp4a-latm',
        reference: '[rfc6416]',
      },
      {
        name: 'mpa-robust',
        template: 'audio/mpa-robust',
        reference: '[rfc5219]',
      },
      {
        name: 'mpeg',
        template: 'audio/mpeg',
        reference: '[rfc3003]',
      },
      {
        name: 'mpeg4-generic',
        template: 'audio/mpeg4-generic',
        reference: '[rfc3640][rfc5691][rfc6295]',
      },
      {
        name: 'ogg',
        template: 'audio/ogg',
        reference: '[rfc5334][rfc7845]',
      },
      {
        name: 'opus',
        template: 'audio/opus',
        reference: '[rfc7587]',
      },
      {
        name: 'parityfec',
        template: 'audio/parityfec',
        reference: '[rfc3009]',
      },
      {
        name: 'pcma',
        template: 'audio/pcma',
        reference: '[rfc4856]',
      },
      {
        name: 'pcma-wb',
        template: 'audio/pcma-wb',
        reference: '[rfc5391]',
      },
      {
        name: 'pcmu',
        template: 'audio/pcmu',
        reference: '[rfc4856]',
      },
      {
        name: 'pcmu-wb',
        template: 'audio/pcmu-wb',
        reference: '[rfc5391]',
      },
      {
        name: 'prs.sid',
        template: 'audio/prs.sid',
        reference: '[linus_walleij]',
      },
      {
        name: 'qcelp',
        template: 'audio/qcelp',
        reference: '[rfc3555][rfc3625]',
      },
      {
        name: 'raptorfec',
        template: 'audio/raptorfec',
        reference: '[rfc6682]',
      },
      {
        name: 'red',
        template: 'audio/red',
        reference: '[rfc3555]',
      },
      {
        name: 'rtp-enc-aescm128',
        template: 'audio/rtp-enc-aescm128',
        reference: '[_3gpp]',
      },
      {
        name: 'rtploopback',
        template: 'audio/rtploopback',
        reference: '[rfc6849]',
      },
      {
        name: 'rtp-midi',
        template: 'audio/rtp-midi',
        reference: '[rfc6295]',
      },
      {
        name: 'rtx',
        template: 'audio/rtx',
        reference: '[rfc4588]',
      },
      {
        name: 'scip',
        template: 'audio/scip',
        reference: '[scip][michael_faller][daniel_hanson]',
      },
      {
        name: 'smv',
        template: 'audio/smv',
        reference: '[rfc3558]',
      },
      {
        name: 'smv0',
        template: 'audio/smv0',
        reference: '[rfc3558]',
      },
      {
        name: 'smv-qcp',
        template: 'audio/smv-qcp',
        reference: '[rfc3625]',
      },
      {
        name: 'sofa',
        template: 'audio/sofa',
        reference: '[aes][piotr_majdak]',
      },
      {
        name: 'sp-midi',
        template: 'audio/sp-midi',
        reference: '[athan_billias][midi_association]',
      },
      {
        name: 'speex',
        template: 'audio/speex',
        reference: '[rfc5574]',
      },
      {
        name: 't140c',
        template: 'audio/t140c',
        reference: '[rfc4351]',
      },
      {
        name: 't38',
        template: 'audio/t38',
        reference: '[rfc4612]',
      },
      {
        name: 'telephone-event',
        template: 'audio/telephone-event',
        reference: '[rfc4733]',
      },
      {
        name: 'tetra_acelp',
        template: 'audio/tetra_acelp',
        reference: '[etsi][miguel_angel_reina_ortega]',
      },
      {
        name: 'tetra_acelp_bb',
        template: 'audio/tetra_acelp_bb',
        reference: '[etsi][miguel_angel_reina_ortega]',
      },
      {
        name: 'tone',
        template: 'audio/tone',
        reference: '[rfc4733]',
      },
      {
        name: 'tsvcis',
        template: 'audio/tsvcis',
        reference: '[rfc8817]',
      },
      {
        name: 'uemclip',
        template: 'audio/uemclip',
        reference: '[rfc5686]',
      },
      {
        name: 'ulpfec',
        template: 'audio/ulpfec',
        reference: '[rfc5109]',
      },
      {
        name: 'usac',
        template: 'audio/usac',
        reference: '[iso-iec_jtc_1][max_neuendorf]',
      },
      {
        name: 'vdvi',
        template: 'audio/vdvi',
        reference: '[rfc4856]',
      },
      {
        name: 'vmr-wb',
        template: 'audio/vmr-wb',
        reference: '[rfc4348][rfc4424]',
      },
      {
        name: 'vnd.3gpp.iufp',
        template: 'audio/vnd.3gpp.iufp',
        reference: '[thomas_belling]',
      },
      {
        name: 'vnd.4sb',
        template: 'audio/vnd.4sb',
        reference: '[serge_de_jaham]',
      },
      {
        name: 'vnd.audiokoz',
        template: 'audio/vnd.audiokoz',
        reference: '[vicki_debarros]',
      },
      {
        name: 'vnd.celp',
        template: 'audio/vnd.celp',
        reference: '[serge_de_jaham]',
      },
      {
        name: 'vnd.cisco.nse',
        template: 'audio/vnd.cisco.nse',
        reference: '[rajesh_kumar]',
      },
      {
        name: 'vnd.cmles.radio-events',
        template: 'audio/vnd.cmles.radio-events',
        reference: '[jean-philippe_goulet]',
      },
      {
        name: 'vnd.cns.anp1',
        template: 'audio/vnd.cns.anp1',
        reference: '[ann_mclaughlin]',
      },
      {
        name: 'vnd.cns.inf1',
        template: 'audio/vnd.cns.inf1',
        reference: '[ann_mclaughlin]',
      },
      {
        name: 'vnd.dece.audio',
        template: 'audio/vnd.dece.audio',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.digital-winds',
        template: 'audio/vnd.digital-winds',
        reference: '[armands_strazds]',
      },
      {
        name: 'vnd.dlna.adts',
        template: 'audio/vnd.dlna.adts',
        reference: '[edwin_heredia]',
      },
      {
        name: 'vnd.dolby.heaac.1',
        template: 'audio/vnd.dolby.heaac.1',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.heaac.2',
        template: 'audio/vnd.dolby.heaac.2',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.mlp',
        template: 'audio/vnd.dolby.mlp',
        reference: '[mike_ward]',
      },
      {
        name: 'vnd.dolby.mps',
        template: 'audio/vnd.dolby.mps',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.pl2',
        template: 'audio/vnd.dolby.pl2',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.pl2x',
        template: 'audio/vnd.dolby.pl2x',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.pl2z',
        template: 'audio/vnd.dolby.pl2z',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dolby.pulse.1',
        template: 'audio/vnd.dolby.pulse.1',
        reference: '[steve_hattersley]',
      },
      {
        name: 'vnd.dra',
        template: 'audio/vnd.dra',
        reference: '[jiang_tian]',
      },
      {
        name: 'vnd.dts',
        template: 'audio/vnd.dts',
        reference: '[william_zou]',
      },
      {
        name: 'vnd.dts.hd',
        template: 'audio/vnd.dts.hd',
        reference: '[william_zou]',
      },
      {
        name: 'vnd.dts.uhd',
        template: 'audio/vnd.dts.uhd',
        reference: '[phillip_maness]',
      },
      {
        name: 'vnd.dvb.file',
        template: 'audio/vnd.dvb.file',
        reference: '[peter_siebert]',
      },
      {
        name: 'vnd.everad.plj',
        template: 'audio/vnd.everad.plj',
        reference: '[shay_cicelsky]',
      },
      {
        name: 'vnd.hns.audio',
        template: 'audio/vnd.hns.audio',
        reference: '[swaminathan]',
      },
      {
        name: 'vnd.lucent.voice',
        template: 'audio/vnd.lucent.voice',
        reference: '[greg_vaudreuil]',
      },
      {
        name: 'vnd.ms-playready.media.pya',
        template: 'audio/vnd.ms-playready.media.pya',
        reference: '[steve_diacetis]',
      },
      {
        name: 'vnd.nokia.mobile-xmf',
        template: 'audio/vnd.nokia.mobile-xmf',
        reference: '[nokia]',
      },
      {
        name: 'vnd.nortel.vbk',
        template: 'audio/vnd.nortel.vbk',
        reference: '[glenn_parsons]',
      },
      {
        name: 'vnd.nuera.ecelp4800',
        template: 'audio/vnd.nuera.ecelp4800',
        reference: '[michael_fox]',
      },
      {
        name: 'vnd.nuera.ecelp7470',
        template: 'audio/vnd.nuera.ecelp7470',
        reference: '[michael_fox]',
      },
      {
        name: 'vnd.nuera.ecelp9600',
        template: 'audio/vnd.nuera.ecelp9600',
        reference: '[michael_fox]',
      },
      {
        name: 'vnd.octel.sbc',
        template: 'audio/vnd.octel.sbc',
        reference: '[greg_vaudreuil]',
      },
      {
        name: 'vnd.presonus.multitrack',
        template: 'audio/vnd.presonus.multitrack',
        reference: '[matthias_juwan]',
      },
      {
        name: 'vnd.qcelp - deprecated in favor of audio/qcelp',
        template: 'audio/vnd.qcelp',
        reference: '[rfc3625]',
      },
      {
        name: 'vnd.rhetorex.32kadpcm',
        template: 'audio/vnd.rhetorex.32kadpcm',
        reference: '[greg_vaudreuil]',
      },
      {
        name: 'vnd.rip',
        template: 'audio/vnd.rip',
        reference: '[martin_dawe]',
      },
      {
        name: 'vnd.sealedmedia.softseal.mpeg',
        template: 'audio/vnd.sealedmedia.softseal.mpeg',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.vmx.cvsd',
        template: 'audio/vnd.vmx.cvsd',
        reference: '[greg_vaudreuil]',
      },
      {
        name: 'vorbis',
        template: 'audio/vorbis',
        reference: '[rfc5215]',
      },
      {
        name: 'vorbis-config',
        template: 'audio/vorbis-config',
        reference: '[rfc5215]',
      },
    ],
    video: [
      {
        name: '3gpp',
        template: 'video/3gpp',
        reference: '[rfc3839][rfc6381]',
      },
      {
        name: '3gpp2',
        template: 'video/3gpp2',
        reference: '[rfc4393][rfc6381]',
      },
      {
        name: '3gpp-tt',
        template: 'video/3gpp-tt',
        reference: '[rfc4396]',
      },
      {
        name: 'av1',
        template: 'video/av1',
        reference: '[alliance_for_open_media]',
      },
      {
        name: 'bmpeg',
        template: 'video/bmpeg',
        reference: '[rfc3555]',
      },
      {
        name: 'bt656',
        template: 'video/bt656',
        reference: '[rfc3555]',
      },
      {
        name: 'celb',
        template: 'video/celb',
        reference: '[rfc3555]',
      },
      {
        name: 'dv',
        template: 'video/dv',
        reference: '[rfc6469]',
      },
      {
        name: 'encaprtp',
        template: 'video/encaprtp',
        reference: '[rfc6849]',
      },
      {
        name: 'example',
        template: 'video/example',
        reference: '[rfc4735]',
      },
      {
        name: 'ffv1',
        template: 'video/ffv1',
        reference: '[rfc9043]',
      },
      {
        name: 'flexfec',
        template: 'video/flexfec',
        reference: '[rfc8627]',
      },
      {
        name: 'h261',
        template: 'video/h261',
        reference: '[rfc4587]',
      },
      {
        name: 'h263',
        template: 'video/h263',
        reference: '[rfc3555]',
      },
      {
        name: 'h263-1998',
        template: 'video/h263-1998',
        reference: '[rfc4629]',
      },
      {
        name: 'h263-2000',
        template: 'video/h263-2000',
        reference: '[rfc4629]',
      },
      {
        name: 'h264',
        template: 'video/h264',
        reference: '[rfc6184]',
      },
      {
        name: 'h264-rcdo',
        template: 'video/h264-rcdo',
        reference: '[rfc6185]',
      },
      {
        name: 'h264-svc',
        template: 'video/h264-svc',
        reference: '[rfc6190]',
      },
      {
        name: 'h265',
        template: 'video/h265',
        reference: '[rfc7798]',
      },
      {
        name: 'h266',
        template: 'video/h266',
        reference: '[rfc9328]',
      },
      {
        name: 'iso.segment',
        template: 'video/iso.segment',
        reference: '[david_singer][iso-iec_jtc_1]',
      },
      {
        name: 'jpeg',
        template: 'video/jpeg',
        reference: '[rfc3555]',
      },
      {
        name: 'jpeg2000',
        template: 'video/jpeg2000',
        reference: '[rfc5371][rfc5372]',
      },
      {
        name: 'jxsv',
        template: 'video/jxsv',
        reference: '[rfc9134]',
      },
      {
        name: 'mj2',
        template: 'video/mj2',
        reference: '[rfc3745]',
      },
      {
        name: 'mp1s',
        template: 'video/mp1s',
        reference: '[rfc3555]',
      },
      {
        name: 'mp2p',
        template: 'video/mp2p',
        reference: '[rfc3555]',
      },
      {
        name: 'mp2t',
        template: 'video/mp2t',
        reference: '[rfc3555]',
      },
      {
        name: 'mp4',
        template: 'video/mp4',
        reference: '[rfc4337][rfc6381]',
      },
      {
        name: 'mp4v-es',
        template: 'video/mp4v-es',
        reference: '[rfc6416]',
      },
      {
        name: 'mpv',
        template: 'video/mpv',
        reference: '[rfc3555]',
      },
      {
        name: 'mpeg',
        template: '',
        reference: '[rfc2045][rfc2046]',
      },
      {
        name: 'mpeg4-generic',
        template: 'video/mpeg4-generic',
        reference: '[rfc3640]',
      },
      {
        name: 'nv',
        template: 'video/nv',
        reference: '[rfc4856]',
      },
      {
        name: 'ogg',
        template: 'video/ogg',
        reference: '[rfc5334][rfc7845]',
      },
      {
        name: 'parityfec',
        template: 'video/parityfec',
        reference: '[rfc3009]',
      },
      {
        name: 'pointer',
        template: 'video/pointer',
        reference: '[rfc2862]',
      },
      {
        name: 'quicktime',
        template: 'video/quicktime',
        reference: '[rfc6381][paul_lindner]',
      },
      {
        name: 'raptorfec',
        template: 'video/raptorfec',
        reference: '[rfc6682]',
      },
      {
        name: 'raw',
        template: 'video/raw',
        reference: '[rfc4175]',
      },
      {
        name: 'rtp-enc-aescm128',
        template: 'video/rtp-enc-aescm128',
        reference: '[_3gpp]',
      },
      {
        name: 'rtploopback',
        template: 'video/rtploopback',
        reference: '[rfc6849]',
      },
      {
        name: 'rtx',
        template: 'video/rtx',
        reference: '[rfc4588]',
      },
      {
        name: 'scip',
        template: 'video/scip',
        reference: '[scip][michael_faller][daniel_hanson]',
      },
      {
        name: 'smpte291',
        template: 'video/smpte291',
        reference: '[rfc8331]',
      },
      {
        name: 'smpte292m',
        template: 'video/smpte292m',
        reference: '[rfc3497]',
      },
      {
        name: 'ulpfec',
        template: 'video/ulpfec',
        reference: '[rfc5109]',
      },
      {
        name: 'vc1',
        template: 'video/vc1',
        reference: '[rfc4425]',
      },
      {
        name: 'vc2',
        template: 'video/vc2',
        reference: '[rfc8450]',
      },
      {
        name: 'vnd.cctv',
        template: 'video/vnd.cctv',
        reference: '[frank_rottmann]',
      },
      {
        name: 'vnd.dece.hd',
        template: 'video/vnd.dece.hd',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.dece.mobile',
        template: 'video/vnd.dece.mobile',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.dece.mp4',
        template: 'video/vnd.dece.mp4',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.dece.pd',
        template: 'video/vnd.dece.pd',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.dece.sd',
        template: 'video/vnd.dece.sd',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.dece.video',
        template: 'video/vnd.dece.video',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.directv.mpeg',
        template: 'video/vnd.directv.mpeg',
        reference: '[nathan_zerbe]',
      },
      {
        name: 'vnd.directv.mpeg-tts',
        template: 'video/vnd.directv.mpeg-tts',
        reference: '[nathan_zerbe]',
      },
      {
        name: 'vnd.dlna.mpeg-tts',
        template: 'video/vnd.dlna.mpeg-tts',
        reference: '[edwin_heredia]',
      },
      {
        name: 'vnd.dvb.file',
        template: 'video/vnd.dvb.file',
        reference: '[peter_siebert][kevin_murray]',
      },
      {
        name: 'vnd.fvt',
        template: 'video/vnd.fvt',
        reference: '[arild_fuldseth]',
      },
      {
        name: 'vnd.hns.video',
        template: 'video/vnd.hns.video',
        reference: '[swaminathan]',
      },
      {
        name: 'vnd.iptvforum.1dparityfec-1010',
        template: 'video/vnd.iptvforum.1dparityfec-1010',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.iptvforum.1dparityfec-2005',
        template: 'video/vnd.iptvforum.1dparityfec-2005',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.iptvforum.2dparityfec-1010',
        template: 'video/vnd.iptvforum.2dparityfec-1010',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.iptvforum.2dparityfec-2005',
        template: 'video/vnd.iptvforum.2dparityfec-2005',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.iptvforum.ttsavc',
        template: 'video/vnd.iptvforum.ttsavc',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.iptvforum.ttsmpeg2',
        template: 'video/vnd.iptvforum.ttsmpeg2',
        reference: '[shuji_nakamura]',
      },
      {
        name: 'vnd.motorola.video',
        template: 'video/vnd.motorola.video',
        reference: '[tom_mcginty]',
      },
      {
        name: 'vnd.motorola.videop',
        template: 'video/vnd.motorola.videop',
        reference: '[tom_mcginty]',
      },
      {
        name: 'vnd.mpegurl',
        template: 'video/vnd.mpegurl',
        reference: '[heiko_recktenwald]',
      },
      {
        name: 'vnd.ms-playready.media.pyv',
        template: 'video/vnd.ms-playready.media.pyv',
        reference: '[steve_diacetis]',
      },
      {
        name: 'vnd.nokia.interleaved-multimedia',
        template: 'video/vnd.nokia.interleaved-multimedia',
        reference: '[petteri_kangaslampi]',
      },
      {
        name: 'vnd.nokia.mp4vr',
        template: 'video/vnd.nokia.mp4vr',
        reference: '[miska_m._hannuksela]',
      },
      {
        name: 'vnd.nokia.videovoip',
        template: 'video/vnd.nokia.videovoip',
        reference: '[nokia]',
      },
      {
        name: 'vnd.objectvideo',
        template: 'video/vnd.objectvideo',
        reference: '[john_clark]',
      },
      {
        name: 'vnd.radgamettools.bink',
        template: 'video/vnd.radgamettools.bink',
        reference: '[henrik_andersson]',
      },
      {
        name: 'vnd.radgamettools.smacker',
        template: 'video/vnd.radgamettools.smacker',
        reference: '[henrik_andersson]',
      },
      {
        name: 'vnd.sealed.mpeg1',
        template: 'video/vnd.sealed.mpeg1',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.sealed.mpeg4',
        template: 'video/vnd.sealed.mpeg4',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.sealed.swf',
        template: 'video/vnd.sealed.swf',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.sealedmedia.softseal.mov',
        template: 'video/vnd.sealedmedia.softseal.mov',
        reference: '[david_petersen]',
      },
      {
        name: 'vnd.uvvu.mp4',
        template: 'video/vnd.uvvu.mp4',
        reference: '[michael_a_dolan]',
      },
      {
        name: 'vnd.youtube.yt',
        template: 'video/vnd.youtube.yt',
        reference: '[google]',
      },
      {
        name: 'vnd.vivo',
        template: 'video/vnd.vivo',
        reference: '[john_wolfe]',
      },
      {
        name: 'vp8',
        template: 'video/vp8',
        reference: '[rfc7741]',
      },
      {
        name: 'vp9',
        template: 'video/vp9',
        reference: '[rfc-ietf-payload-vp9-16]',
      },
    ],
  },
};
export default MIMETypes;
