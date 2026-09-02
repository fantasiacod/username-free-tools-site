/* QuickToolsHub — tiny client-side i18n (English / Arabic).
   Any element with data-i18n="key" gets its textContent replaced.
   Any element with data-i18n-content="key" gets its `content` attribute replaced (for <meta>).
   Toggle button #lang-toggle switches language and flips dir=rtl for Arabic. */
(function(){
  const translations = {
    en: {
      "nav.tools": "Tools",
      "nav.about": "About",
      "nav.contact": "Contact",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms",
      "ad.slot": "Ad space (reserved)",
      "ad.slot.home": "Ad space (reserved — will be enabled once an ad network is approved)",

      "home.title": "QuickToolsHub — Free Online Tools, No Signup",
      "home.meta": "Free, fast, browser-based tools: generate QR codes, convert and compress images, and more. No signup, no uploads to a server — everything runs in your browser.",
      "home.hero.h1": "Free tools that just work.",
      "home.hero.p": "No signup, no installs, no file uploads to a server — every tool below runs entirely in your browser. Pick one and get started.",
      "home.card.qr.title": "QR Code Generator",
      "home.card.qr.desc": "Turn any link or text into a downloadable QR code instantly.",
      "home.card.img.title": "Image Converter & Compressor",
      "home.card.img.desc": "Convert between PNG, JPEG and WebP, and shrink file size with a quality slider.",
      "home.card.text.title": "Text Case Converter & Word Counter",
      "home.card.text.desc": "Switch text to UPPERCASE, lowercase, Title Case or Sentence case, with a live word/character count.",
      "home.card.pdf.title": "PDF Compressor",
      "home.card.pdf.desc": "Shrink PDF file size without leaving your browser.",
      "badge.live": "Live",
      "badge.soon": "Coming soon",
      "home.content.h2": "Why QuickToolsHub?",
      "home.content.p": "Most “free” tools online ask you to upload your files to a stranger's server. Every tool on QuickToolsHub runs entirely client-side, in your own browser, using standard web APIs — your files never leave your device. That also means the tools work instantly, with no waiting on an upload or download queue.",

      "about.title": "About — QuickToolsHub",
      "about.meta": "QuickToolsHub is a growing collection of free, browser-based tools. Learn what we're building and why everything runs client-side.",
      "about.h1": "About QuickToolsHub",
      "about.p1": "QuickToolsHub is a small, independent collection of free online tools. The idea is simple: everyday tasks — generating a QR code, converting an image, compressing a file — shouldn't require an account, a subscription, or uploading your files to an unknown server.",
      "about.p2": "Every tool here runs entirely in your browser using standard web technologies (the Canvas API, File API, and similar). Nothing you enter or upload is sent to a server, because there's no backend involved at all — the site is just static files.",
      "about.p3": "New tools are added regularly. If there's a tool you'd like to see, get in touch on the contact page.",

      "contact.title": "Contact — QuickToolsHub",
      "contact.meta": "Get in touch with QuickToolsHub with feedback, tool suggestions, or bug reports.",
      "contact.h1": "Contact",
      "contact.p1": "Have feedback, found a bug, or want to suggest a new tool? Open an issue on the project's GitHub repository and it'll be reviewed.",
      "contact.link": "Open an issue on GitHub →",

      "privacy.title": "Privacy Policy — QuickToolsHub",
      "privacy.meta": "QuickToolsHub privacy policy: what data is collected, how cookies and ads work on this site.",
      "privacy.h1": "Privacy Policy",
      "privacy.updated": "Last updated:",
      "privacy.h2.how": "How the tools work",
      "privacy.p.how": "All tools on QuickToolsHub run entirely in your browser. Files you open (images, PDFs, etc.) are processed locally on your device and are never uploaded to our servers, because this site has no backend server — it is a static website.",
      "privacy.h2.cookies": "Cookies and analytics",
      "privacy.p.cookies": "This site may use standard, privacy-respecting analytics to understand aggregate traffic (for example, which pages are visited and roughly how many visitors there are). This does not include the content of any file you process with a tool.",
      "privacy.h2.ads": "Advertising",
      "privacy.p.ads": "QuickToolsHub may display ads served by third-party advertising networks (such as Google AdSense or comparable networks). These networks may use cookies or similar technologies to serve relevant ads and measure ad performance. You can control ad personalization through your browser settings or via Google's Ads Settings where applicable.",
      "privacy.h2.links": "Third-party links",
      "privacy.p.links": "This site may link to third-party sites (such as GitHub). We are not responsible for the privacy practices of those sites.",
      "privacy.h2.contact": "Contact",
      "privacy.p.contact": "Questions about this policy can be raised via the contact page.",

      "terms.title": "Terms of Use — QuickToolsHub",
      "terms.meta": "Terms of use for QuickToolsHub's free online tools.",
      "terms.h1": "Terms of Use",
      "terms.intro": "By using QuickToolsHub, you agree to the following:",
      "terms.h2.risk": "Use at your own risk",
      "terms.p.risk": "Tools are provided “as is”, free of charge, with no warranty of any kind. While every effort is made to keep them working correctly, we are not liable for any loss or damage resulting from their use.",
      "terms.h2.use": "Acceptable use",
      "terms.p.use": "Don't use this site's tools for unlawful purposes or to process content you don't have the rights to.",
      "terms.h2.changes": "Changes",
      "terms.p.changes": "These terms and the site's tools may change or be discontinued at any time without notice.",

      "qr.title": "Free QR Code Generator — No Signup | QuickToolsHub",
      "qr.meta": "Generate a QR code from any link or text for free, right in your browser. Download as PNG instantly. No signup, no watermark.",
      "qr.h1": "QR Code Generator",
      "qr.desc": "Type or paste any link or text below. Your QR code is generated instantly and entirely in your browser — nothing is sent anywhere.",
      "qr.label.text": "Text or URL",
      "qr.label.size": "Size",
      "qr.btn.generate": "Generate",
      "qr.btn.download": "Download PNG",
      "qr.note": "Tip: this tool works offline once the page is loaded — no data about the text you enter is transmitted anywhere.",
      "qr.h2.how": "How it works",
      "qr.p.how": "This generator uses the open-source QRCode.js library running locally in your browser to encode your text into a QR code image. Because everything happens client-side, there's no server round-trip and no limit on how many codes you generate.",
      "qr.h2.uses": "Common uses",
      "qr.p.uses": "Share a Wi-Fi password, link to a menu or portfolio, add a QR code to a business card or flyer, or quickly transfer a link from desktop to phone by scanning.",

      "img.title": "Free Image Converter & Compressor — PNG, JPEG, WebP | QuickToolsHub",
      "img.meta": "Convert images between PNG, JPEG and WebP and compress them with a quality slider, free, right in your browser. No signup, no upload to a server.",
      "img.h1": "Image Converter & Compressor",
      "img.desc": "Drop an image below to convert it to PNG, JPEG or WebP, and shrink its file size with the quality slider. Everything happens locally in your browser — your image is never uploaded anywhere.",
      "img.dz.label": "Click to choose an image, or drag & drop it here",
      "img.dz.loaded": "loaded — adjust options below and click Convert",
      "img.label.format": "Output format",
      "img.label.quality": "Quality:",
      "img.label.maxw": "Max width (px, optional)",
      "img.btn.convert": "Convert",
      "img.btn.download": "Download",
      "img.note": "Supported input: any image type your browser can decode (PNG, JPEG, WebP, GIF, BMP). PNG output has no quality slider since PNG is lossless.",
      "img.h2.how": "How it works",
      "img.p.how": "The tool loads your image into an HTML canvas and re-encodes it using your browser's built-in image codecs — the same technology browsers use to render images on the web. Nothing is uploaded to a server at any point.",
      "img.h2.when": "When to use JPEG vs WebP vs PNG",
      "img.p.when": "Use JPEG for photos where small file size matters most. Use WebP for a modern format that's usually smaller than JPEG at the same quality. Use PNG when you need transparency or lossless quality, such as for logos and screenshots with text.",
      "img.compare.original": "Original",
      "img.compare.converted": "Converted",
      "img.summary.label": "What changed:",
      "img.summary.format": "Format",
      "img.summary.quality": "Quality",
      "img.summary.dimensions": "Dimensions",
      "img.summary.filesize": "File size",
      "img.summary.smaller": "smaller",
      "img.summary.larger": "larger",
      "img.summary.unchanged": "unchanged",

      "text.title": "Free Text Case Converter & Word Counter | QuickToolsHub",
      "text.meta": "Convert text to UPPERCASE, lowercase, Title Case or Sentence case, with a live word and character counter. Free, instant, runs entirely in your browser.",
      "text.h1": "Text Case Converter & Word Counter",
      "text.desc": "Paste or type your text below. Convert it to any case with one click, and see the word/character count update live as you type. Nothing you type is sent anywhere.",
      "text.placeholder": "Type or paste your text here...",
      "text.btn.upper": "UPPERCASE",
      "text.btn.lower": "lowercase",
      "text.btn.title": "Title Case",
      "text.btn.sentence": "Sentence case",
      "text.btn.copy": "Copy",
      "text.btn.clear": "Clear",
      "text.stats": "{words} words · {chars} characters · {charsNoSpaces} characters (no spaces) · {sentences} sentences",
      "text.h2.why": "Why use a case converter?",
      "text.p.why": "Retyping text to fix its capitalization is slow and error-prone. This tool instantly reformats any block of text — a title you want in Title Case, an accidentally-caps-locked paragraph, or a heading you need in Sentence case — without you having to type it again.",
      "text.h2.counter": "How the word counter works",
      "text.p.counter": "The counter updates live as you type or paste, and also after each case conversion. Word count splits on whitespace, character counts include and exclude spaces, and sentence count is an approximate count based on sentence-ending punctuation (., !, ?)."
    },
    ar: {
      "nav.tools": "الأدوات",
      "nav.about": "من نحن",
      "nav.contact": "تواصل معنا",
      "footer.privacy": "سياسة الخصوصية",
      "footer.terms": "الشروط",
      "ad.slot": "مساحة إعلانية (محجوزة)",
      "ad.slot.home": "مساحة إعلانية (محجوزة — سيتم تفعيلها بعد الموافقة على شبكة إعلانات)",

      "home.title": "QuickToolsHub — أدوات مجانية أونلاين بدون تسجيل",
      "home.meta": "أدوات مجانية سريعة تعمل داخل المتصفح: مولّد رموز QR، محوّل وضاغط صور، والمزيد. بدون تسجيل وبدون رفع أي ملف لأي سيرفر.",
      "home.hero.h1": "أدوات مجانية تشتغل فورًا.",
      "home.hero.p": "بدون تسجيل، وبدون تثبيت، وبدون رفع ملفاتك لأي سيرفر — كل أداة بالأسفل تعمل بالكامل داخل متصفحك. اختر أداة وابدأ.",
      "home.card.qr.title": "مولّد رمز QR",
      "home.card.qr.desc": "حوّل أي رابط أو نص إلى رمز QR قابل للتحميل فورًا.",
      "home.card.img.title": "محوّل وضاغط الصور",
      "home.card.img.desc": "حوّل بين صيغ PNG وJPEG وWebP، وقلّل حجم الملف باستخدام شريط الجودة.",
      "home.card.text.title": "محوّل حالة النص وعدّاد الكلمات",
      "home.card.text.desc": "حوّل النص إلى أحرف كبيرة أو صغيرة أو حالة العنوان أو الجملة، مع عدّاد كلمات وأحرف مباشر.",
      "home.card.pdf.title": "ضاغط PDF",
      "home.card.pdf.desc": "قلّل حجم ملف PDF بدون مغادرة المتصفح.",
      "badge.live": "متاحة الآن",
      "badge.soon": "قريبًا",
      "home.content.h2": "ليش QuickToolsHub؟",
      "home.content.p": "أغلب الأدوات “المجانية” على الإنترنت تطلب منك رفع ملفاتك على سيرفر مجهول. كل أداة في QuickToolsHub تعمل بالكامل داخل متصفحك باستخدام تقنيات ويب قياسية — ملفاتك لا تغادر جهازك أبدًا. وهذا يعني أيضًا أن الأدوات تعمل فورًا بدون انتظار رفع أو تحميل.",

      "about.title": "من نحن — QuickToolsHub",
      "about.meta": "QuickToolsHub مجموعة متنامية من الأدوات المجانية التي تعمل داخل المتصفح. تعرّف على ما نبنيه ولماذا كل شي يعمل من جهتك.",
      "about.h1": "عن QuickToolsHub",
      "about.p1": "QuickToolsHub مجموعة صغيرة ومستقلة من الأدوات المجانية على الإنترنت. الفكرة بسيطة: المهام اليومية — توليد رمز QR، تحويل صورة، ضغط ملف — لا يجب أن تتطلب حسابًا أو اشتراكًا أو رفع ملفاتك لسيرفر مجهول.",
      "about.p2": "كل أداة هنا تعمل بالكامل داخل متصفحك باستخدام تقنيات ويب قياسية (مثل Canvas API وFile API). لا شي مما تُدخله أو ترفعه يُرسل لأي سيرفر، لأنه لا يوجد أي سيرفر خلفي أصلًا — الموقع مجرد ملفات ثابتة.",
      "about.p3": "نضيف أدوات جديدة بشكل مستمر. إذا كان عندك اقتراح لأداة تحب تشوفها، تواصل معنا من صفحة التواصل.",

      "contact.title": "تواصل معنا — QuickToolsHub",
      "contact.meta": "تواصل مع فريق QuickToolsHub لإرسال ملاحظات، اقتراح أداة جديدة، أو الإبلاغ عن مشكلة.",
      "contact.h1": "تواصل معنا",
      "contact.p1": "عندك ملاحظة، لقيت مشكلة، أو تبي تقترح أداة جديدة؟ افتح Issue في مستودع المشروع على GitHub وبنراجعه.",
      "contact.link": "افتح Issue على GitHub ←",

      "privacy.title": "سياسة الخصوصية — QuickToolsHub",
      "privacy.meta": "سياسة الخصوصية لموقع QuickToolsHub: ما البيانات التي نجمعها، وكيف تعمل ملفات تعريف الارتباط والإعلانات في هذا الموقع.",
      "privacy.h1": "سياسة الخصوصية",
      "privacy.updated": "آخر تحديث:",
      "privacy.h2.how": "كيف تعمل الأدوات",
      "privacy.p.how": "جميع أدوات QuickToolsHub تعمل بالكامل داخل متصفحك. الملفات اللي تفتحها (صور، PDF، إلخ) تُعالَج محليًا على جهازك ولا تُرفع أبدًا لأي سيرفر لدينا، لأن هذا الموقع ليس له أي سيرفر خلفي — هو موقع ثابت بالكامل.",
      "privacy.h2.cookies": "ملفات تعريف الارتباط والتحليلات",
      "privacy.p.cookies": "قد يستخدم هذا الموقع أدوات تحليل قياسية تحترم الخصوصية لفهم حركة الزوار الإجمالية (مثل أكثر الصفحات زيارة وعدد الزوار التقريبي). هذا لا يشمل محتوى أي ملف تعالجه بإحدى الأدوات.",
      "privacy.h2.ads": "الإعلانات",
      "privacy.p.ads": "قد يعرض QuickToolsHub إعلانات من شبكات إعلانية خارجية (مثل Google AdSense أو شبكات مشابهة). قد تستخدم هذه الشبكات ملفات تعريف ارتباط أو تقنيات مشابهة لعرض إعلانات ذات صلة وقياس أدائها. يمكنك التحكم بتخصيص الإعلانات عبر إعدادات متصفحك أو عبر إعدادات إعلانات Google حيث ينطبق ذلك.",
      "privacy.h2.links": "روابط لمواقع أخرى",
      "privacy.p.links": "قد يحتوي هذا الموقع على روابط لمواقع خارجية (مثل GitHub). نحن غير مسؤولين عن ممارسات الخصوصية في تلك المواقع.",
      "privacy.h2.contact": "التواصل",
      "privacy.p.contact": "أي استفسار حول هذه السياسة يمكن طرحه عبر صفحة التواصل.",

      "terms.title": "شروط الاستخدام — QuickToolsHub",
      "terms.meta": "شروط استخدام أدوات QuickToolsHub المجانية.",
      "terms.h1": "شروط الاستخدام",
      "terms.intro": "باستخدامك لموقع QuickToolsHub، فأنت توافق على التالي:",
      "terms.h2.risk": "الاستخدام على مسؤوليتك",
      "terms.p.risk": "الأدوات مُقدَّمة “كما هي”، مجانًا، وبدون أي ضمان من أي نوع. رغم بذل كل جهد ممكن لإبقائها تعمل بشكل صحيح، نحن غير مسؤولين عن أي خسارة أو ضرر ينتج عن استخدامها.",
      "terms.h2.use": "الاستخدام المقبول",
      "terms.p.use": "لا تستخدم أدوات هذا الموقع لأغراض غير قانونية أو لمعالجة محتوى لا تملك الحق فيه.",
      "terms.h2.changes": "التغييرات",
      "terms.p.changes": "قد تتغير هذه الشروط وأدوات الموقع أو تتوقف في أي وقت بدون إشعار مسبق.",

      "qr.title": "مولّد رمز QR مجاني — بدون تسجيل | QuickToolsHub",
      "qr.meta": "ولّد رمز QR من أي رابط أو نص مجانًا، مباشرة داخل متصفحك. حمّله كصورة PNG فورًا. بدون تسجيل وبدون علامة مائية.",
      "qr.h1": "مولّد رمز QR",
      "qr.desc": "اكتب أو الصق أي رابط أو نص بالأسفل. يتم توليد رمز QR فورًا وبالكامل داخل متصفحك — لا شي يُرسل لأي مكان.",
      "qr.label.text": "النص أو الرابط",
      "qr.label.size": "الحجم",
      "qr.btn.generate": "توليد",
      "qr.btn.download": "تحميل PNG",
      "qr.note": "ملاحظة: هذه الأداة تعمل بدون إنترنت بعد تحميل الصفحة — لا تُرسل أي بيانات عن النص اللي تكتبه لأي مكان.",
      "qr.h2.how": "كيف تعمل",
      "qr.p.how": "يستخدم هذا المولّد مكتبة QRCode.js مفتوحة المصدر تعمل محليًا داخل متصفحك لتحويل نصّك إلى صورة رمز QR. وبما أن كل شي يحدث من جهتك، لا يوجد اتصال بأي سيرفر ولا حد لعدد الرموز اللي تولّدها.",
      "qr.h2.uses": "استخدامات شائعة",
      "qr.p.uses": "شارك كلمة مرور واي فاي، اربط قائمة طعام أو ملف أعمال، أضف رمز QR على بطاقة عمل أو منشور دعائي، أو انقل رابط من جهاز الحاسوب للجوال بمسحه سريعًا.",

      "img.title": "محوّل وضاغط صور مجاني — PNG وJPEG وWebP | QuickToolsHub",
      "img.meta": "حوّل الصور بين PNG وJPEG وWebP واضغطها بشريط جودة، مجانًا، مباشرة داخل متصفحك. بدون تسجيل وبدون رفع لأي سيرفر.",
      "img.h1": "محوّل وضاغط الصور",
      "img.desc": "أفلت صورة بالأسفل لتحويلها إلى PNG أو JPEG أو WebP، وتقليل حجمها بشريط الجودة. كل شي يحدث محليًا داخل متصفحك — صورتك لا تُرفع لأي مكان أبدًا.",
      "img.dz.label": "اضغط لاختيار صورة، أو اسحبها وأفلتها هنا",
      "img.dz.loaded": "تم تحميلها — عدّل الخيارات بالأسفل واضغط تحويل",
      "img.label.format": "صيغة الإخراج",
      "img.label.quality": "الجودة:",
      "img.label.maxw": "أقصى عرض (بكسل، اختياري)",
      "img.btn.convert": "تحويل",
      "img.btn.download": "تحميل",
      "img.note": "المدخلات المدعومة: أي نوع صورة يقدر متصفحك يفكّها (PNG، JPEG، WebP، GIF، BMP). صيغة PNG ليس لها شريط جودة لأنها بدون فقدان.",
      "img.h2.how": "كيف تعمل",
      "img.p.how": "تحمّل الأداة صورتك داخل عنصر Canvas وتعيد ترميزها باستخدام مُرمّزات الصور المدمجة في متصفحك — نفس التقنية اللي تستخدمها المتصفحات لعرض الصور على الويب. لا شي يُرفع لأي سيرفر في أي وقت.",
      "img.h2.when": "متى تستخدم JPEG أو WebP أو PNG",
      "img.p.when": "استخدم JPEG للصور الفوتوغرافية حيث صغر الحجم أهم شي. استخدم WebP كصيغة حديثة عادة أصغر من JPEG بنفس الجودة. استخدم PNG لما تحتاج شفافية أو جودة بدون فقدان، مثل الشعارات ولقطات الشاشة اللي فيها نص.",
      "img.compare.original": "الصورة الأصلية",
      "img.compare.converted": "بعد التحويل",
      "img.summary.label": "التعديلات اللي تمت:",
      "img.summary.format": "الصيغة",
      "img.summary.quality": "الجودة",
      "img.summary.dimensions": "الأبعاد",
      "img.summary.filesize": "حجم الملف",
      "img.summary.smaller": "أصغر",
      "img.summary.larger": "أكبر",
      "img.summary.unchanged": "بدون تغيير",

      "text.title": "محوّل حالة النص وعدّاد الكلمات مجانًا | QuickToolsHub",
      "text.meta": "حوّل النص إلى أحرف كبيرة أو صغيرة أو حالة العنوان أو الجملة، مع عدّاد كلمات وأحرف مباشر. مجاني وفوري ويعمل بالكامل داخل متصفحك.",
      "text.h1": "محوّل حالة النص وعدّاد الكلمات",
      "text.desc": "الصق أو اكتب نصّك بالأسفل. حوّله لأي حالة بضغطة واحدة، وشاهد عدّاد الكلمات/الأحرف يتحدّث مباشرة أثناء الكتابة. لا شي مما تكتبه يُرسل لأي مكان.",
      "text.placeholder": "اكتب أو الصق نصّك هنا...",
      "text.btn.upper": "أحرف كبيرة",
      "text.btn.lower": "أحرف صغيرة",
      "text.btn.title": "حالة العنوان",
      "text.btn.sentence": "حالة الجملة",
      "text.btn.copy": "نسخ",
      "text.btn.clear": "مسح",
      "text.stats": "{words} كلمة · {chars} حرف · {charsNoSpaces} حرف (بدون مسافات) · {sentences} جملة",
      "text.h2.why": "ليش تستخدم محوّل حالة النص؟",
      "text.p.why": "إعادة كتابة النص لتصحيح حالة أحرفه بطيئة وعرضة للأخطاء. هذه الأداة تعيد تنسيق أي نص فورًا — عنوان تبيه بحالة العنوان، فقرة انكتبت بالخطأ بأحرف كبيرة، أو عنوان تبيه بحالة الجملة — بدون ما تعيد كتابته.",
      "text.h2.counter": "كيف يعمل عدّاد الكلمات",
      "text.p.counter": "يتحدّث العدّاد مباشرة أثناء الكتابة أو اللصق، وأيضًا بعد كل تحويل حالة. عدّ الكلمات يعتمد على الفراغات، وعدّ الأحرف يشمل ويستثني المسافات، وعدّ الجمل تقريبي بناءً على علامات نهاية الجملة (. ! ؟)."
    }
  };

  function getLang(){
    try { return localStorage.getItem('qth-lang') || 'en'; } catch(e){ return 'en'; }
  }

  function t(key, lang){
    const dict = translations[lang] || translations.en;
    return dict[key] !== undefined ? dict[key] : (translations.en[key] || key);
  }

  function applyLang(lang){
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function(el){
      const key = el.getAttribute('data-i18n-content');
      if(dict[key] !== undefined) el.setAttribute('content', dict[key]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      const key = el.getAttribute('data-i18n-placeholder');
      if(dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    const btn = document.getElementById('lang-toggle');
    if(btn) btn.textContent = lang === 'ar' ? 'English' : 'العربية';

    document.dispatchEvent(new CustomEvent('qth-lang-changed', { detail: { lang: lang } }));
  }

  function setLang(lang){
    try { localStorage.setItem('qth-lang', lang); } catch(e){}
    applyLang(lang);
  }

  function init(){
    applyLang(getLang());
    const btn = document.getElementById('lang-toggle');
    if(btn){
      btn.addEventListener('click', function(){
        setLang(getLang() === 'ar' ? 'en' : 'ar');
      });
    }
  }

  window.QTH_I18N = { translations: translations, getLang: getLang, setLang: setLang, applyLang: applyLang, t: t, init: init };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
