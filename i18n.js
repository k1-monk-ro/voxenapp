// ═══ VOXEN i18n v3 — TEXT REPLACEMENT ENGINE ═══
// Traduce automat ORICE text vizibil din pagină
// Nu necesită data-t — face match pe textul românesc

(function(){
var L='ro';try{L=localStorage.getItem('vxlang')||'ro';}catch(e){}

// Scurtătură: T[ro_text] = {en:'...',es:'...',...}
// Doar limbile cerute: en,es,fr,de,pt,ru,zh,ja,hi,bn
var T={
// ════ COMMON / NAV ════
'← Acasă':{en:'← Home',es:'← Inicio',fr:'← Accueil',de:'← Start',pt:'← Início',ru:'← Главная',zh:'← 首页',ja:'← ホーム',hi:'← होम',bn:'← হোম'},
'Companion':{en:'Companion',es:'Compañero',fr:'Compagnon',de:'Begleiter',pt:'Companheiro',ru:'Компаньон',zh:'同伴',ja:'コンパニオン',hi:'साथी',bn:'সঙ্গী'},
'Emoțional':{en:'Emotional',es:'Emocional',fr:'Émotionnel',de:'Emotional',pt:'Emocional',ru:'Эмоции',zh:'情感',ja:'感情',hi:'भावनात्मक',bn:'আবেগজনিত'},
'Terapie':{en:'Therapy',es:'Terapia',fr:'Thérapie',de:'Therapie',pt:'Terapia',ru:'Терапия',zh:'治疗',ja:'セラピー',hi:'थेरेपी',bn:'থেরাপি'},
'Grupuri':{en:'Groups',es:'Grupos',fr:'Groupes',de:'Gruppen',pt:'Grupos',ru:'Группы',zh:'群组',ja:'グループ',hi:'समूह',bn:'গ্রুপ'},
'Ajutor acum':{en:'Help now',es:'Ayuda ahora',fr:'Aide maintenant',de:'Hilfe jetzt',pt:'Ajuda agora',ru:'Помощь',zh:'立即求助',ja:'今すぐ助けて',hi:'अभी मदद',bn:'এখনই সাহায্য'},
'Treci printr-un moment greu?':{en:'Going through a tough time?',es:'¿Pasando un mal momento?',fr:'Un moment difficile ?',de:'Schwere Zeit?',pt:'Momento difícil?',ru:'Тяжёлый момент?',zh:'正在经历困难？',ja:'つらい時期ですか？',hi:'कठिन समय?',bn:'কঠিন সময়?'},
'Sari peste':{en:'Skip',es:'Saltar',fr:'Passer',de:'Überspringen',pt:'Pular',ru:'Пропустить',zh:'跳过',ja:'スキップ',hi:'छोड़ें',bn:'এড়িয়ে যান'},
'Înapoi':{en:'Back',es:'Atrás',fr:'Retour',de:'Zurück',pt:'Voltar',ru:'Назад',zh:'返回',ja:'戻る',hi:'वापस',bn:'পিছনে'},
'Continuă →':{en:'Continue →',es:'Continuar →',fr:'Continuer →',de:'Weiter →',pt:'Continuar →',ru:'Далее →',zh:'继续 →',ja:'続ける →',hi:'जारी रखें →',bn:'চালিয়ে যান →'},
'Vezi cum':{en:'See how',es:'Ver cómo',fr:'Voir comment',de:'So geht\'s',pt:'Veja como',ru:'Как это',zh:'查看方法',ja:'方法を見る',hi:'कैसे देखें',bn:'কিভাবে দেখুন'},
'Începem →':{en:'Let\'s start →',es:'Empecemos →',fr:'Commençons →',de:'Los geht\'s →',pt:'Começar →',ru:'Начнём →',zh:'开始 →',ja:'始めましょう →',hi:'शुरू करें →',bn:'শুরু করি →'},
'Începe gratuit':{en:'Start free',es:'Empezar gratis',fr:'Commencer gratuit',de:'Kostenlos starten',pt:'Começar grátis',ru:'Начать бесплатно',zh:'免费开始',ja:'無料で始める',hi:'मुफ़्त शुरू करें',bn:'বিনামূল্যে শুরু'},
'Începe cu Plus':{en:'Start with Plus',es:'Empezar con Plus',fr:'Commencer avec Plus',de:'Mit Plus starten',pt:'Começar com Plus',ru:'Начать с Plus',zh:'使用Plus开始',ja:'Plusで始める',hi:'Plus से शुरू करें',bn:'Plus দিয়ে শুরু'},

// ════ HOME ════
'Acasă':{en:'Home',es:'Inicio',fr:'Accueil',de:'Start',pt:'Início',ru:'Главная',zh:'首页',ja:'ホーム',hi:'होम',bn:'হোম'},
'Bună dimineața.':{en:'Good morning.',es:'Buenos días.',fr:'Bonjour.',de:'Guten Morgen.',pt:'Bom dia.',ru:'Доброе утро.',zh:'早上好。',ja:'おはようございます。',hi:'सुप्रभात।',bn:'সুপ্রভাত।'},
'Bună ziua.':{en:'Good afternoon.',es:'Buenas tardes.',fr:'Bon après-midi.',de:'Guten Tag.',pt:'Boa tarde.',ru:'Добрый день.',zh:'下午好。',ja:'こんにちは。',hi:'नमस्ते।',bn:'শুভ অপরাহ্ন।'},
'Bună seara.':{en:'Good evening.',es:'Buenas noches.',fr:'Bonsoir.',de:'Guten Abend.',pt:'Boa noite.',ru:'Добрый вечер.',zh:'晚上好。',ja:'こんばんは。',hi:'शुभ संध्या।',bn:'শুভ সন্ধ্যা।'},
'Bună.':{en:'Hello.',es:'Hola.',fr:'Salut.',de:'Hallo.',pt:'Olá.',ru:'Привет.',zh:'你好。',ja:'こんにちは。',hi:'नमस्ते।',bn:'হ্যালো।'},
'Ai făcut primul pas — ești aici. Acum hai să facem al doilea.':{en:'You took the first step — you\'re here. Let\'s take the second.',es:'Diste el primer paso — estás aquí. Demos el segundo.',fr:'Tu as fait le premier pas. Faisons le deuxième.',de:'Du hast den ersten Schritt getan. Machen wir den zweiten.',pt:'Você deu o primeiro passo. Vamos dar o segundo.',ru:'Первый шаг сделан. Давай сделаем второй.',zh:'你迈出了第一步。让我们迈出第二步。',ja:'最初の一歩を踏み出しました。次へ進みましょう。',hi:'पहला कदम उठाया। दूसरा उठाते हैं।',bn:'প্রথম পদক্ষেপ নিয়েছেন। দ্বিতীয়টি নিই।'},
'Spune-mi cum ești azi':{en:'Tell me how you are today',es:'Dime cómo estás hoy',fr:'Dis-moi comment tu vas',de:'Sag mir wie es dir geht',pt:'Me diga como você está',ru:'Расскажи как ты сегодня',zh:'告诉我你今天怎么样',ja:'今日の調子を教えて',hi:'बताइए आज कैसे हैं',bn:'আজ কেমন আছেন বলুন'},
'Un minut. Fără format, fără judecată. Voxen ascultă.':{en:'One minute. No format, no judgment. Voxen listens.',es:'Un minuto. Sin formato, sin juicio. Voxen escucha.',fr:'Une minute. Sans format, sans jugement. Voxen écoute.',de:'Eine Minute. Kein Format, kein Urteil. Voxen hört zu.',pt:'Um minuto. Sem formato, sem julgamento. Voxen ouve.',ru:'Минута. Без формата, без осуждения. Voxen слушает.',zh:'一分钟。无格式，无评判。Voxen倾听。',ja:'1分間。形式なし、判断なし。Voxenが聴きます。',hi:'एक मिनट। कोई प्रारूप नहीं। Voxen सुनता है।',bn:'এক মিনিট। ফরম্যাট নেই। Voxen শোনে।'},
'Planul tău de recuperare':{en:'Your recovery plan',es:'Tu plan de recuperación',fr:'Ton plan de guérison',de:'Dein Genesungsplan',pt:'Seu plano de recuperação',ru:'Твой план восстановления',zh:'你的康复计划',ja:'あなたの回復プラン',hi:'आपकी रिकवरी योजना',bn:'আপনার পুনরুদ্ধার পরিকল্পনা'},
'⚠ Când vine pofta':{en:'⚠ When cravings hit',es:'⚠ Cuando llega el antojo',fr:'⚠ Quand l\'envie arrive',de:'⚠ Wenn das Verlangen kommt',pt:'⚠ Quando a vontade vem',ru:'⚠ Когда тянет',zh:'⚠ 当渴望来临',ja:'⚠ 渇望が来たとき',hi:'⚠ जब लालसा आए',bn:'⚠ যখন আকাঙ্ক্ষা আসে'},
'→ Săptămâna asta':{en:'→ This week',es:'→ Esta semana',fr:'→ Cette semaine',de:'→ Diese Woche',pt:'→ Esta semana',ru:'→ На этой неделе',zh:'→ 本周',ja:'→ 今週',hi:'→ इस हफ्ते',bn:'→ এই সপ্তাহে'},
'Companion AI':{en:'AI Companion',es:'Compañero IA',fr:'Compagnon IA',de:'KI-Begleiter',pt:'Companheiro IA',ru:'ИИ Компаньон',zh:'AI同伴',ja:'AIコンパニオン',hi:'AI साथी',bn:'AI সঙ্গী'},
'Blocaj emoțional':{en:'Emotional blockage',es:'Bloqueo emocional',fr:'Blocage émotionnel',de:'Emotionale Blockade',pt:'Bloqueio emocional',ru:'Эмоциональный блок',zh:'情感阻塞',ja:'感情的ブロック',hi:'भावनात्मक अवरोध',bn:'আবেগজনিত বাধা'},
'Autoexcludere disponibilă':{en:'Self-exclusion available',es:'Autoexclusión disponible',fr:'Auto-exclusion disponible',de:'Selbstsperre verfügbar',pt:'Autoexclusão disponível',ru:'Самоисключение доступно',zh:'可自我排除',ja:'自己排除可能',hi:'आत्म-बहिष्कार उपलब्ध',bn:'স্ব-বর্জন উপলব্ধ'},
'Primul pas: vorbește cu un medic':{en:'First step: talk to a doctor',es:'Primer paso: habla con un médico',fr:'Parle d\'abord à un médecin',de:'Erster Schritt: sprich mit einem Arzt',pt:'Primeiro: fale com um médico',ru:'Первый шаг: поговори с врачом',zh:'第一步：与医生交谈',ja:'最初の一歩：医師に相談',hi:'पहला कदम: डॉक्टर से बात करें',bn:'প্রথমে ডাক্তারের সাথে কথা বলুন'},
'Instrumente de recuperare':{en:'Recovery tools',es:'Herramientas de recuperación',fr:'Outils de guérison',de:'Genesungswerkzeuge',pt:'Ferramentas de recuperação',ru:'Инструменты восстановления',zh:'康复工具',ja:'回復ツール',hi:'रिकवरी उपकरण',bn:'পুনরুদ্ধার সরঞ্জাম'},
'Ghid recuperare alcool →':{en:'Alcohol recovery guide →',es:'Guía recuperación alcohol →',fr:'Guide guérison alcool →',de:'Alkohol-Genesungsleitfaden →',pt:'Guia de recuperação álcool →',ru:'Руководство по алкоголю →',zh:'酒精康复指南 →',ja:'アルコール回復ガイド →',hi:'शराब मुक्ति गाइड →',bn:'মদ্যপান মুক্তি গাইড →'},
'Ghid recuperare substanțe →':{en:'Substance recovery guide →',es:'Guía recuperación sustancias →',fr:'Guide guérison substances →',de:'Substanz-Genesungsleitfaden →',pt:'Guia recuperação substâncias →',ru:'Руководство по веществам →',zh:'物质康复指南 →',ja:'薬物回復ガイド →',hi:'नशा मुक्ति गाइड →',bn:'মাদক মুক্তি গাইড →'},

// ════ EMOTIONAL ════
'🌫️ Sprijin emoțional':{en:'🌫️ Emotional support',es:'🌫️ Apoyo emocional',fr:'🌫️ Soutien émotionnel',de:'🌫️ Emotionale Unterstützung',pt:'🌫️ Apoio emocional',ru:'🌫️ Эмоциональная поддержка',zh:'🌫️ 情感支持',ja:'🌫️ 感情的サポート',hi:'🌫️ भावनात्मक सहारा',bn:'🌫️ মানসিক সহায়তা'},
'Nu e lene.':{en:'It\'s not laziness.',es:'No es pereza.',fr:'Pas de la paresse.',de:'Keine Faulheit.',pt:'Não é preguiça.',ru:'Это не лень.',zh:'不是懒惰。',ja:'怠けではない。',hi:'यह आलस नहीं।',bn:'অলসতা নয়।'},
'Nu e vina ta.':{en:'It\'s not your fault.',es:'No es tu culpa.',fr:'Pas ta faute.',de:'Nicht deine Schuld.',pt:'Não é sua culpa.',ru:'Не твоя вина.',zh:'不是你的错。',ja:'あなたのせいではない。',hi:'आपकी गलती नहीं।',bn:'আপনার দোষ নয়।'},
'Înțelege ce ți se întâmplă':{en:'Understand what\'s happening',es:'Entiende qué te pasa',fr:'Comprends ce qui t\'arrive',de:'Verstehe was passiert',pt:'Entenda o que acontece',ru:'Пойми что происходит',zh:'了解发生了什么',ja:'何が起きているか理解する',hi:'समझें क्या हो रहा है',bn:'বুঝুন কী হচ্ছে'},
'Bateria internă e goală':{en:'Your inner battery is drained',es:'Tu batería interna está agotada',fr:'Ta batterie interne est vide',de:'Deine innere Batterie ist leer',pt:'Sua bateria interna esgotou',ru:'Внутренняя батарея разряжена',zh:'内心电池耗尽',ja:'心の電池切れ',hi:'आंतरिक बैटरी खत्म',bn:'অভ্যন্তরীণ ব্যাটারি শেষ'},
'Cercul vicios al inactivității':{en:'The vicious cycle of inactivity',es:'El círculo vicioso de la inactividad',fr:'Le cercle vicieux de l\'inactivité',de:'Der Teufelskreis der Inaktivität',pt:'O ciclo vicioso da inatividade',ru:'Порочный круг бездействия',zh:'不活动的恶性循环',ja:'不活動の悪循環',hi:'निष्क्रियता का दुष्चक्र',bn:'নিষ্ক্রিয়তার দুষ্টচক্র'},
'Emoțiile înghețate':{en:'Frozen emotions',es:'Emociones congeladas',fr:'Émotions gelées',de:'Eingefrorene Gefühle',pt:'Emoções congeladas',ru:'Замороженные эмоции',zh:'冰冻的情绪',ja:'凍りついた感情',hi:'जमी भावनाएँ',bn:'জমাট আবেগ'},
'Instrumente':{en:'Tools',es:'Herramientas',fr:'Outils',de:'Werkzeuge',pt:'Ferramentas',ru:'Инструменты',zh:'工具',ja:'ツール',hi:'उपकरण',bn:'সরঞ্জাম'},
'Activarea comportamentală':{en:'Behavioral activation',es:'Activación conductual',fr:'Activation comportementale',de:'Verhaltensaktivierung',pt:'Ativação comportamental',ru:'Поведенческая активация',zh:'行为激活',ja:'行動活性化',hi:'व्यवहार सक्रियण',bn:'আচরণগত সক্রিয়করণ'},
'Jurnalul vocal de deblocare':{en:'Voice journal for unblocking',es:'Diario vocal de desbloqueo',fr:'Journal vocal de déblocage',de:'Sprach-Tagebuch',pt:'Diário vocal de desbloqueio',ru:'Голосовой журнал',zh:'解锁语音日记',ja:'音声ジャーナル',hi:'वॉयस जर्नल',bn:'ভয়েস জার্নাল'},
'Igiena somnului':{en:'Sleep hygiene',es:'Higiene del sueño',fr:'Hygiène du sommeil',de:'Schlafhygiene',pt:'Higiene do sono',ru:'Гигиена сна',zh:'睡眠卫生',ja:'睡眠衛生',hi:'नींद की स्वच्छता',bn:'ঘুমের স্বাস্থ্যবিধি'},
'Micro-conexiunea socială':{en:'Social micro-connection',es:'Micro-conexión social',fr:'Micro-connexion sociale',de:'Soziale Mikro-Verbindung',pt:'Micro-conexão social',ru:'Микро-связь',zh:'社交微连接',ja:'ソーシャルマイクロコネクション',hi:'सामाजिक सूक्ष्म-संबंध',bn:'সামাজিক মাইক্রো-সংযোগ'},
'Ancorarea în prezent':{en:'Grounding in the present',es:'Anclaje en el presente',fr:'Ancrage dans le présent',de:'Erdung im Moment',pt:'Ancoragem no presente',ru:'Заземление',zh:'当下锚定',ja:'今ここに留まる',hi:'वर्तमान में जुड़ाव',bn:'বর্তমানে নোঙর'},
'Când merită ajutor profesional':{en:'When to seek professional help',es:'Cuándo buscar ayuda profesional',fr:'Quand chercher de l\'aide',de:'Wann professionelle Hilfe',pt:'Quando buscar ajuda',ru:'Когда обратиться к специалисту',zh:'何时寻求专业帮助',ja:'専門家の助けを求めるとき',hi:'पेशेवर मदद कब लें',bn:'পেশাদার সাহায্য কখন নেবেন'},
'Fundamental':{en:'Fundamental',es:'Fundamental',fr:'Fondamental',de:'Grundlegend',pt:'Fundamental',ru:'Базовый',zh:'基础',ja:'基本',hi:'मौलिक',bn:'মৌলিক'},
'Cu Voxen':{en:'With Voxen',es:'Con Voxen',fr:'Avec Voxen',de:'Mit Voxen',pt:'Com Voxen',ru:'С Voxen',zh:'使用Voxen',ja:'Voxenで',hi:'Voxen के साथ',bn:'Voxen দিয়ে'},
'Bază':{en:'Basic',es:'Base',fr:'Base',de:'Basis',pt:'Base',ru:'База',zh:'基础',ja:'基本',hi:'आधार',bn:'ভিত্তি'},
'Relații':{en:'Relationships',es:'Relaciones',fr:'Relations',de:'Beziehungen',pt:'Relações',ru:'Отношения',zh:'关系',ja:'人間関係',hi:'संबंध',bn:'সম্পর্ক'},
'Mindfulness':{en:'Mindfulness',es:'Mindfulness',fr:'Pleine conscience',de:'Achtsamkeit',pt:'Mindfulness',ru:'Осознанность',zh:'正念',ja:'マインドフルネス',hi:'माइंडफुलनेस',bn:'মাইন্ডফুলনেস'},

// ════ ALCOOL ════
'🍷 Recuperare alcool':{en:'🍷 Alcohol recovery',es:'🍷 Recuperación alcohol',fr:'🍷 Guérison alcool',de:'🍷 Alkohol-Genesung',pt:'🍷 Recuperação álcool',ru:'🍷 От алкоголя',zh:'🍷 酒精康复',ja:'🍷 アルコール回復',hi:'🍷 शराब से मुक्ति',bn:'🍷 মদ্যপান মুক্তি'},
'Primul pas nu e':{en:'The first step isn\'t',es:'El primer paso no es',fr:'Le premier pas n\'est pas',de:'Der erste Schritt ist nicht',pt:'O primeiro passo não é',ru:'Первый шаг — не',zh:'第一步不是',ja:'最初の一歩は',hi:'पहला कदम',bn:'প্রথম পদক্ষেপ'},
'să te oprești.':{en:'to stop.',es:'parar.',fr:'de s\'arrêter.',de:'aufzuhören.',pt:'parar.',ru:'остановиться.',zh:'停下来。',ja:'止めることではない。',hi:'रुकना नहीं है।',bn:'থামা নয়।'},
'Oprirea bruscă a alcoolului poate fi periculoasă':{en:'Sudden alcohol withdrawal can be dangerous',es:'Dejar el alcohol de repente puede ser peligroso',fr:'L\'arrêt brutal de l\'alcool peut être dangereux',de:'Plötzlicher Alkoholentzug kann gefährlich sein',pt:'Parar o álcool de repente pode ser perigoso',ru:'Резкий отказ от алкоголя может быть опасен',zh:'突然戒酒可能很危险',ja:'突然の断酒は危険',hi:'अचानक शराब छोड़ना खतरनाक हो सकता है',bn:'হঠাৎ মদ ছাড়া বিপজ্জনক হতে পারে'},
'Evaluarea medicală':{en:'Medical evaluation',es:'Evaluación médica',fr:'Évaluation médicale',de:'Medizinische Bewertung',pt:'Avaliação médica',ru:'Медицинская оценка',zh:'医学评估',ja:'医学的評価',hi:'चिकित्सा मूल्यांकन',bn:'চিকিৎসা মূল্যায়ন'},
'Primul pas':{en:'First step',es:'Primer paso',fr:'Premier pas',de:'Erster Schritt',pt:'Primeiro passo',ru:'Первый шаг',zh:'第一步',ja:'最初の一歩',hi:'पहला कदम',bn:'প্রথম পদক্ষেপ'},
'Jurnalul vocal de consum':{en:'Voice consumption journal',es:'Diario vocal de consumo',fr:'Journal vocal de consommation',de:'Sprach-Konsumtagebuch',pt:'Diário vocal de consumo',ru:'Голосовой журнал потребления',zh:'语音消费日记',ja:'音声消費ジャーナル',hi:'वॉयस खपत जर्नल',bn:'ভয়েস সেবন জার্নাল'},
'Anti-poftă':{en:'Anti-craving',es:'Anti-antojo',fr:'Anti-envie',de:'Anti-Verlangen',pt:'Anti-fissura',ru:'Против тяги',zh:'抗渴望',ja:'抗渇望',hi:'लालसा-रोधी',bn:'আকাঙ্ক্ষা-বিরোধী'},
'Comunitate':{en:'Community',es:'Comunidad',fr:'Communauté',de:'Gemeinschaft',pt:'Comunidade',ru:'Сообщество',zh:'社区',ja:'コミュニティ',hi:'समुदाय',bn:'সম্প্রদায়'},
'Alcoolicii Anonimi (AA)':{en:'Alcoholics Anonymous (AA)',es:'Alcohólicos Anónimos (AA)',fr:'Alcooliques Anonymes (AA)',de:'Anonyme Alkoholiker (AA)',pt:'Alcoólicos Anônimos (AA)',ru:'Анонимные Алкоголики (АА)',zh:'匿名戒酒会 (AA)',ja:'アルコホーリクス・アノニマス (AA)',hi:'अल्कोहोलिक्स एनोनिमस (AA)',bn:'অ্যালকোহলিক্স অ্যানোনিমাস (AA)'},
'Azi aleg altfel.':{en:'Today I choose differently.',es:'Hoy elijo diferente.',fr:'Aujourd\'hui je choisis autrement.',de:'Heute wähle ich anders.',pt:'Hoje escolho diferente.',ru:'Сегодня выбираю иначе.',zh:'今天我选择不同。',ja:'今日は違う選択を。',hi:'आज मैं अलग चुनता हूँ।',bn:'আজ ভিন্নভাবে বেছে নিই।'},
'Marchez ziua 1':{en:'Mark day 1',es:'Marcar día 1',fr:'Marquer jour 1',de:'Tag 1 markieren',pt:'Marcar dia 1',ru:'Отметить день 1',zh:'标记第1天',ja:'1日目を記録',hi:'दिन 1 चिह्नित करें',bn:'দিন ১ চিহ্নিত'},
'zile fără alcool':{en:'days alcohol-free',es:'días sin alcohol',fr:'jours sans alcool',de:'Tage ohne Alkohol',pt:'dias sem álcool',ru:'дней без алкоголя',zh:'天不饮酒',ja:'日間禁酒',hi:'दिन शराब के बिना',bn:'দিন মদ ছাড়া'},
'Resurse verificate România':{en:'Verified resources',es:'Recursos verificados',fr:'Ressources vérifiées',de:'Verifizierte Ressourcen',pt:'Recursos verificados',ru:'Проверенные ресурсы',zh:'已验证的资源',ja:'確認済みリソース',hi:'सत्यापित संसाधन',bn:'যাচাইকৃত সম্পদ'},
'Ajutor real,':{en:'Real help,',es:'Ayuda real,',fr:'Aide réelle,',de:'Echte Hilfe,',pt:'Ajuda real,',ru:'Реальная помощь,',zh:'真正的帮助，',ja:'本当の助け、',hi:'असली मदद,',bn:'আসল সাহায্য,'},
'nu link-uri moarte.':{en:'not dead links.',es:'no enlaces muertos.',fr:'pas de liens morts.',de:'keine toten Links.',pt:'sem links mortos.',ru:'не мёртвые ссылки.',zh:'不是死链接。',ja:'デッドリンクではなく。',hi:'मृत लिंक नहीं।',bn:'ডেড লিঙ্ক নয়।'},
'Momentul tău':{en:'Your moment',es:'Tu momento',fr:'Ton moment',de:'Dein Moment',pt:'Seu momento',ru:'Твой момент',zh:'你的时刻',ja:'あなたの瞬間',hi:'आपका पल',bn:'আপনার মুহূর্ত'},

// ════ SUBSTANȚE ════
'💊 Recuperare substanțe':{en:'💊 Substance recovery',es:'💊 Recuperación sustancias',fr:'💊 Guérison substances',de:'💊 Substanz-Genesung',pt:'💊 Recuperação substâncias',ru:'💊 От веществ',zh:'💊 物质康复',ja:'💊 薬物回復',hi:'💊 नशा मुक्ति',bn:'💊 মাদক মুক্তি'},
'Nu ești ce ai':{en:'You are not what',es:'No eres lo que',fr:'Tu n\'es pas ce que',de:'Du bist nicht, was',pt:'Você não é o que',ru:'Ты — не то, что',zh:'你不是你所',ja:'あなたは',hi:'आप वो नहीं',bn:'আপনি যা'},
'consumat.':{en:'you consumed.',es:'consumiste.',fr:'tu as consommé.',de:'du konsumiert hast.',pt:'consumiu.',ru:'употреблял.',zh:'消费的。',ja:'摂取したものではない。',hi:'सेवन किया वो नहीं हैं।',bn:'সেবন করেছেন তা নন।'},
'Supradoza e o urgență medicală':{en:'Overdose is a medical emergency',es:'La sobredosis es una emergencia médica',fr:'Le surdosage est une urgence médicale',de:'Überdosis ist ein medizinischer Notfall',pt:'Overdose é uma emergência médica',ru:'Передозировка — неотложная помощь',zh:'药物过量是医疗紧急情况',ja:'過剰摂取は医療緊急事態',hi:'ओवरडोज़ मेडिकल इमरजेंसी है',bn:'অতিমাত্রা চিকিৎসা জরুরি'},
'Reducerea riscurilor':{en:'Harm reduction',es:'Reducción de daños',fr:'Réduction des risques',de:'Schadensminderung',pt:'Redução de danos',ru:'Снижение вреда',zh:'减少伤害',ja:'ハームリダクション',hi:'नुकसान कम करना',bn:'ক্ষতি হ্রাস'},
'Harm reduction':{en:'Harm reduction',es:'Reducción de daños',fr:'Réduction des risques',de:'Schadensminderung',pt:'Redução de danos',ru:'Снижение вреда',zh:'减少伤害',ja:'ハームリダクション',hi:'नुकसान कम करना',bn:'ক্ষতি হ্রাস'},
'Jurnalul vocal de poftă':{en:'Craving voice journal',es:'Diario vocal de antojos',fr:'Journal vocal d\'envie',de:'Verlangen-Sprachtagebuch',pt:'Diário vocal de fissura',ru:'Голосовой журнал тяги',zh:'渴望语音日记',ja:'渇望の音声ジャーナル',hi:'लालसा वॉयस जर्नल',bn:'আকাঙ্ক্ষা ভয়েস জার্নাল'},
'Planul de urgență personal':{en:'Personal emergency plan',es:'Plan de emergencia personal',fr:'Plan d\'urgence personnel',de:'Persönlicher Notfallplan',pt:'Plano de emergência pessoal',ru:'Личный план экстренной помощи',zh:'个人紧急计划',ja:'個人緊急プラン',hi:'व्यक्तिगत आपातकालीन योजना',bn:'ব্যক্তিগত জরুরি পরিকল্পনা'},
'Comunitate terapeutică':{en:'Therapeutic community',es:'Comunidad terapéutica',fr:'Communauté thérapeutique',de:'Therapeutische Gemeinschaft',pt:'Comunidade terapêutica',ru:'Терапевтическое сообщество',zh:'治疗社区',ja:'治療コミュニティ',hi:'चिकित्सा समुदाय',bn:'থেরাপিউটিক সম্প্রদায়'},
'Rezidențial':{en:'Residential',es:'Residencial',fr:'Résidentiel',de:'Stationär',pt:'Residencial',ru:'Стационар',zh:'住院',ja:'入院',hi:'आवासीय',bn:'আবাসিক'},
'Pregătire':{en:'Preparation',es:'Preparación',fr:'Préparation',de:'Vorbereitung',pt:'Preparação',ru:'Подготовка',zh:'准备',ja:'準備',hi:'तैयारी',bn:'প্রস্তুতি'},

// ════ AUTOEXCLUDERE ════
'🛑 Autoexcludere gambling':{en:'🛑 Gambling self-exclusion',es:'🛑 Autoexclusión juego',fr:'🛑 Auto-exclusion jeu',de:'🛑 Glücksspiel-Selbstsperre',pt:'🛑 Autoexclusão jogo',ru:'🛑 Самоисключение',zh:'🛑 赌博自我排除',ja:'🛑 ギャンブル自己排除',hi:'🛑 जुआ आत्म-बहिष्कार',bn:'🛑 জুয়া স্ব-বর্জন'},
'Oprește-te azi.':{en:'Stop today.',es:'Para hoy.',fr:'Arrête aujourd\'hui.',de:'Hör heute auf.',pt:'Pare hoje.',ru:'Остановись сегодня.',zh:'今天停止。',ja:'今日やめよう。',hi:'आज रुकें।',bn:'আজ থামুন।'},
'Nu mâine.':{en:'Not tomorrow.',es:'No mañana.',fr:'Pas demain.',de:'Nicht morgen.',pt:'Não amanhã.',ru:'Не завтра.',zh:'不是明天。',ja:'明日ではなく。',hi:'कल नहीं।',bn:'কাল নয়।'},
'Cum te autoexcluzi — 4 căi oficiale':{en:'How to self-exclude — 4 official channels',es:'Cómo autoexcluirte — 4 canales oficiales',fr:'Comment s\'auto-exclure — 4 voies officielles',de:'Wie du dich selbst sperrst — 4 offizielle Wege',pt:'Como se autoexcluir — 4 canais oficiais',ru:'Как самоисключиться — 4 канала',zh:'如何自我排除——4个官方渠道',ja:'自己排除の方法——4つの公式チャネル',hi:'आत्म-बहिष्कार कैसे करें — 4 चैनल',bn:'স্ব-বর্জন কিভাবে — ৪টি চ্যানেল'},
'zile de la decizia ta':{en:'days since your decision',es:'días desde tu decisión',fr:'jours depuis ta décision',de:'Tage seit Entscheidung',pt:'dias desde sua decisão',ru:'дней с решения',zh:'天自决定以来',ja:'日間（決断から）',hi:'दिन फैसले से',bn:'দিন সিদ্ধান্তের পর'},
'Am depus cererea':{en:'I filed the request',es:'Presenté la solicitud',fr:'J\'ai déposé la demande',de:'Antrag eingereicht',pt:'Enviei o pedido',ru:'Подал заявку',zh:'我提交了申请',ja:'申請しました',hi:'मैंने अनुरोध दायर किया',bn:'আমি আবেদন জমা দিয়েছি'},
'Azi iau decizia.':{en:'Today I decide.',es:'Hoy decido.',fr:'Aujourd\'hui je décide.',de:'Heute entscheide ich.',pt:'Hoje eu decido.',ru:'Сегодня решаю.',zh:'今天我做决定。',ja:'今日決めます。',hi:'आज फैसला करता हूँ।',bn:'আজ সিদ্ধান্ত নিই।'},

// ════ SETTINGS ════
'Setări':{en:'Settings',es:'Ajustes',fr:'Paramètres',de:'Einstellungen',pt:'Configurações',ru:'Настройки',zh:'设置',ja:'設定',hi:'सेटिंग्स',bn:'সেটিংস'},
'Profilul tău, contul, limba și datele.':{en:'Your profile, account, language and data.',es:'Tu perfil, cuenta, idioma y datos.',fr:'Profil, compte, langue et données.',de:'Profil, Konto, Sprache und Daten.',pt:'Perfil, conta, idioma e dados.',ru:'Профиль, аккаунт, язык и данные.',zh:'资料、帐户、语言和数据。',ja:'プロフィール、アカウント、言語、データ。',hi:'प्रोफ़ाइल, खाता, भाषा और डेटा।',bn:'প্রোফাইল, অ্যাকাউন্ট, ভাষা ও ডেটা।'},
'Cont':{en:'Account',es:'Cuenta',fr:'Compte',de:'Konto',pt:'Conta',ru:'Аккаунт',zh:'账户',ja:'アカウント',hi:'खाता',bn:'অ্যাকাউন্ট'},
'Profilul tău':{en:'Your profile',es:'Tu perfil',fr:'Ton profil',de:'Dein Profil',pt:'Seu perfil',ru:'Твой профиль',zh:'个人资料',ja:'プロフィール',hi:'प्रोफ़ाइल',bn:'প্রোফাইল'},
'Limba':{en:'Language',es:'Idioma',fr:'Langue',de:'Sprache',pt:'Idioma',ru:'Язык',zh:'语言',ja:'言語',hi:'भाषा',bn:'ভাষা'},
'Explorează':{en:'Explore',es:'Explorar',fr:'Explorer',de:'Erkunden',pt:'Explorar',ru:'Исследуй',zh:'探索',ja:'探索',hi:'एक्सप्लोर',bn:'অন্বেষণ'},
'Date și confidențialitate':{en:'Data & privacy',es:'Datos y privacidad',fr:'Données et confidentialité',de:'Daten & Datenschutz',pt:'Dados e privacidade',ru:'Данные и конфиденциальность',zh:'数据与隐私',ja:'データとプライバシー',hi:'डेटा और गोपनीयता',bn:'ডেটা ও গোপনীয়তা'},
'Despre':{en:'About',es:'Acerca de',fr:'À propos',de:'Über',pt:'Sobre',ru:'О приложении',zh:'关于',ja:'について',hi:'के बारे में',bn:'সম্পর্কে'},
'Exportă datele mele':{en:'Export my data',es:'Exportar mis datos',fr:'Exporter mes données',de:'Daten exportieren',pt:'Exportar dados',ru:'Экспорт данных',zh:'导出数据',ja:'データエクスポート',hi:'डेटा निर्यात',bn:'ডেটা রপ্তানি'},
'Șterge toate datele':{en:'Delete all data',es:'Eliminar datos',fr:'Supprimer les données',de:'Alle Daten löschen',pt:'Excluir dados',ru:'Удалить данные',zh:'删除数据',ja:'データ削除',hi:'सभी डेटा हटाएं',bn:'সব ডেটা মুছুন'},
'🔒 Salvează-ți progresul':{en:'🔒 Save your progress',es:'🔒 Guarda tu progreso',fr:'🔒 Sauvegarde ta progression',de:'🔒 Fortschritt speichern',pt:'🔒 Salve seu progresso',ru:'🔒 Сохрани прогресс',zh:'🔒 保存进度',ja:'🔒 進捗を保存',hi:'🔒 प्रगति सहेजें',bn:'🔒 অগ্রগতি সংরক্ষণ'},
'Creează cont →':{en:'Create account →',es:'Crear cuenta →',fr:'Créer un compte →',de:'Konto erstellen →',pt:'Criar conta →',ru:'Создать аккаунт →',zh:'创建帐户 →',ja:'アカウント作成 →',hi:'खाता बनाएं →',bn:'অ্যাকাউন্ট তৈরি →'},
'Mă lupt cu':{en:'I struggle with',es:'Lucho con',fr:'Je me bats avec',de:'Ich kämpfe mit',pt:'Luto contra',ru:'Борюсь с',zh:'我在与之斗争',ja:'戦っているのは',hi:'मैं जूझ रहा हूँ',bn:'আমি লড়ছি'},
'Unde sunt pe drum':{en:'Where I am',es:'Dónde estoy',fr:'Où j\'en suis',de:'Wo ich bin',pt:'Onde estou',ru:'Где я на пути',zh:'我在哪里',ja:'どこにいるか',hi:'कहाँ हूँ',bn:'কোথায় আছি'},
'Declanșatorii mei':{en:'My triggers',es:'Mis desencadenantes',fr:'Mes déclencheurs',de:'Meine Auslöser',pt:'Meus gatilhos',ru:'Мои триггеры',zh:'我的触发因素',ja:'トリガー',hi:'मेरे ट्रिगर',bn:'আমার ট্রিগার'},
'Sprijinul meu':{en:'My support',es:'Mi apoyo',fr:'Mon soutien',de:'Meine Unterstützung',pt:'Meu apoio',ru:'Моя поддержка',zh:'我的支持',ja:'サポート',hi:'मेरा सहारा',bn:'আমার সহায়তা'},
'Reminder':{en:'Reminder',es:'Recordatorio',fr:'Rappel',de:'Erinnerung',pt:'Lembrete',ru:'Напоминание',zh:'提醒',ja:'リマインダー',hi:'रिमाइंडर',bn:'রিমাইন্ডার'},
'Ghid recuperare alcool':{en:'Alcohol recovery guide',es:'Guía recuperación alcohol',fr:'Guide guérison alcool',de:'Alkohol-Leitfaden',pt:'Guia recuperação álcool',ru:'Руководство по алкоголю',zh:'酒精康复指南',ja:'アルコール回復ガイド',hi:'शराब मुक्ति गाइड',bn:'মদ মুক্তি গাইড'},
'Ghid recuperare substanțe':{en:'Substance recovery guide',es:'Guía sustancias',fr:'Guide substances',de:'Substanz-Leitfaden',pt:'Guia substâncias',ru:'Руководство по веществам',zh:'物质康复指南',ja:'薬物回復ガイド',hi:'नशा मुक्ति गाइड',bn:'মাদক মুক্তি গাইড'},
'Autoexcludere jocuri de noroc':{en:'Gambling self-exclusion',es:'Autoexclusión juego',fr:'Auto-exclusion jeu',de:'Glücksspiel-Selbstsperre',pt:'Autoexclusão jogo',ru:'Самоисключение',zh:'赌博自我排除',ja:'ギャンブル自己排除',hi:'जुआ आत्म-बहिष्कार',bn:'জুয়া স্ব-বর্জন'},
'Blocaj emoțional / depresie':{en:'Emotional blockage / depression',es:'Bloqueo emocional / depresión',fr:'Blocage émotionnel / dépression',de:'Emotionale Blockade / Depression',pt:'Bloqueio emocional / depressão',ru:'Эмоциональный блок / депрессия',zh:'情感阻塞/抑郁',ja:'感情的ブロック/うつ',hi:'भावनात्मक अवरोध / अवसाद',bn:'আবেগজনিত বাধা / বিষণ্ণতা'},
'Terapie zonală':{en:'Local therapy',es:'Terapia zonal',fr:'Thérapie locale',de:'Lokale Therapie',pt:'Terapia local',ru:'Зональная терапия',zh:'区域治疗',ja:'ゾーンセラピー',hi:'क्षेत्रीय थेरेपी',bn:'আঞ্চলিক থেরাপি'},
'Despre Voxen':{en:'About Voxen',es:'Acerca de Voxen',fr:'À propos de Voxen',de:'Über Voxen',pt:'Sobre Voxen',ru:'О Voxen',zh:'关于Voxen',ja:'Voxenについて',hi:'Voxen के बारे में',bn:'Voxen সম্পর্কে'},
'Gata':{en:'Done',es:'Listo',fr:'Terminé',de:'Fertig',pt:'Pronto',ru:'Готово',zh:'完成',ja:'完了',hi:'हो गया',bn:'সম্পন্ন'},
'JSON pe dispozitiv':{en:'JSON on device',es:'JSON en dispositivo',fr:'JSON sur appareil',de:'JSON auf Gerät',pt:'JSON no dispositivo',ru:'JSON на устройстве',zh:'设备上的JSON',ja:'デバイス上のJSON',hi:'डिवाइस पर JSON',bn:'ডিভাইসে JSON'},
'Pornește de la zero':{en:'Start from scratch',es:'Empezar de cero',fr:'Recommencer à zéro',de:'Von vorne anfangen',pt:'Começar do zero',ru:'Начать с нуля',zh:'从零开始',ja:'ゼロから始める',hi:'शून्य से शुरू',bn:'শূন্য থেকে শুরু'},

// ════ HOME extras ════
'zi pe drum':{en:'day on path',es:'día en camino',fr:'jour en route',de:'Tag unterwegs',pt:'dia no caminho',ru:'день в пути',zh:'天在路上',ja:'日目',hi:'दिन',bn:'দিন'},
'jurnale':{en:'journals',es:'diarios',fr:'journaux',de:'Einträge',pt:'diários',ru:'записей',zh:'日志',ja:'件',hi:'जर्नल',bn:'জার্নাল'},
'pași făcuți':{en:'steps done',es:'pasos hechos',fr:'pas faits',de:'Schritte',pt:'passos feitos',ru:'шагов',zh:'步',ja:'歩',hi:'कदम',bn:'পদক্ষেপ'},
'Harta ta de declanșatori':{en:'Your trigger map',es:'Tu mapa de desencadenantes',fr:'Ta carte des déclencheurs',de:'Deine Auslöser-Karte',pt:'Seu mapa de gatilhos',ru:'Карта триггеров',zh:'触发因素地图',ja:'トリガーマップ',hi:'ट्रिगर मैप',bn:'ট্রিগার ম্যাপ'},
'↻ În fiecare zi':{en:'↻ Every day',es:'↻ Cada día',fr:'↻ Chaque jour',de:'↻ Jeden Tag',pt:'↻ Todo dia',ru:'↻ Каждый день',zh:'↻ 每天',ja:'↻ 毎日',hi:'↻ हर दिन',bn:'↻ প্রতিদিন'},
'Rutina ta':{en:'Your routine',es:'Tu rutina',fr:'Ta routine',de:'Deine Routine',pt:'Sua rotina',ru:'Твой распорядок',zh:'你的日程',ja:'ルーティン',hi:'दिनचर्या',bn:'রুটিন'},
'Primii 7 pași':{en:'First 7 steps',es:'Primeros 7 pasos',fr:'7 premiers pas',de:'Erste 7 Schritte',pt:'Primeiros 7 passos',ru:'Первые 7 шагов',zh:'前7步',ja:'最初の7歩',hi:'पहले 7 कदम',bn:'প্রথম ৭ পদক্ষেপ'},
'Sprijinul tău':{en:'Your support',es:'Tu apoyo',fr:'Ton soutien',de:'Deine Unterstützung',pt:'Seu apoio',ru:'Поддержка',zh:'你的支持',ja:'サポート',hi:'सहारा',bn:'সহায়তা'},
'Ghid autoexcludere →':{en:'Self-exclusion guide →',es:'Guía autoexclusión →',fr:'Guide auto-exclusion →',de:'Selbstsperre-Leitfaden →',pt:'Guia autoexclusão →',ru:'Руководство →',zh:'自我排除指南 →',ja:'自己排除ガイド →',hi:'आत्म-बहिष्कार गाइड →',bn:'স্ব-বর্জন গাইড →'},
'Zilele 1–2':{en:'Days 1–2',es:'Días 1–2',fr:'Jours 1–2',de:'Tage 1–2',pt:'Dias 1–2',ru:'Дни 1–2',zh:'第1-2天',ja:'1-2日目',hi:'दिन 1-2',bn:'দিন ১-২'},
'Ziua 3':{en:'Day 3',es:'Día 3',fr:'Jour 3',de:'Tag 3',pt:'Dia 3',ru:'День 3',zh:'第3天',ja:'3日目',hi:'दिन 3',bn:'দিন ৩'},
'Ziua 4':{en:'Day 4',es:'Día 4',fr:'Jour 4',de:'Tag 4',pt:'Dia 4',ru:'День 4',zh:'第4天',ja:'4日目',hi:'दिन 4',bn:'দিন ৪'},
'Ziua 5':{en:'Day 5',es:'Día 5',fr:'Jour 5',de:'Tag 5',pt:'Dia 5',ru:'День 5',zh:'第5天',ja:'5日目',hi:'दिन 5',bn:'দিন ৫'},
'Ziua 6':{en:'Day 6',es:'Día 6',fr:'Jour 6',de:'Tag 6',pt:'Dia 6',ru:'День 6',zh:'第6天',ja:'6日目',hi:'दिन 6',bn:'দিন ৬'},
'Ziua 7':{en:'Day 7',es:'Día 7',fr:'Jour 7',de:'Tag 7',pt:'Dia 7',ru:'День 7',zh:'第7天',ja:'7日目',hi:'दिन 7',bn:'দিন ৭'},
'Înregistrează primul jurnal vocal.':{en:'Record your first voice journal.',es:'Graba tu primer diario vocal.',fr:'Enregistre ton premier journal vocal.',de:'Nimm dein erstes Sprachtagebuch auf.',pt:'Grave seu primeiro diário vocal.',ru:'Запиши первый голосовой журнал.',zh:'录制第一个语音日记。',ja:'最初の音声ジャーナルを録音。',hi:'पहला वॉयस जर्नल रिकॉर्ड करें।',bn:'প্রথম ভয়েস জার্নাল রেকর্ড করুন।'},
'Explorează modulul de recuperare.':{en:'Explore the recovery module.',es:'Explora el módulo de recuperación.',fr:'Explore le module de guérison.',de:'Erkunde das Genesungsmodul.',pt:'Explore o módulo de recuperação.',ru:'Изучи модуль восстановления.',zh:'探索康复模块。',ja:'回復モジュールを探索。',hi:'रिकवरी मॉड्यूल एक्सप्लोर करें।',bn:'রিকভারি মডিউল অন্বেষণ।'},
'Marchează prima ta victorie.':{en:'Mark your first victory.',es:'Marca tu primera victoria.',fr:'Marque ta première victoire.',de:'Markiere deinen ersten Sieg.',pt:'Marque sua primeira vitória.',ru:'Отметь первую победу.',zh:'标记第一次胜利。',ja:'最初の勝利を記録。',hi:'पहली जीत दर्ज करें।',bn:'প্রথম বিজয় চিহ্নিত করুন।'},
'Identifică momentul cel mai greu.':{en:'Identify your hardest moment.',es:'Identifica tu momento más difícil.',fr:'Identifie ton moment le plus dur.',de:'Finde deinen schwersten Moment.',pt:'Identifique o momento mais difícil.',ru:'Найди самый трудный момент.',zh:'找出最困难的时刻。',ja:'一番つらい瞬間を特定。',hi:'सबसे कठिन पल पहचानें।',bn:'কঠিনতম মুহূর্ত চিহ্নিত করুন。'},
'Spune-i cuiva că ai început.':{en:'Tell someone you started.',es:'Dile a alguien que empezaste.',fr:'Dis à quelqu\'un que tu as commencé.',de:'Sag jemandem dass du begonnen hast.',pt:'Diga a alguém que começou.',ru:'Скажи кому-нибудь что начал.',zh:'告诉某人你开始了。',ja:'始めたことを誰かに。',hi:'किसी को बताएं शुरू किया।',bn:'কাউকে বলুন শুরু করেছেন।'},
'Ascultă-ți primul jurnal.':{en:'Listen to your first journal.',es:'Escucha tu primer diario.',fr:'Écoute ton premier journal.',de:'Höre dein erstes Tagebuch.',pt:'Ouça seu primeiro diário.',ru:'Послушай первый журнал.',zh:'听第一篇日记。',ja:'最初のジャーナルを聴いて。',hi:'पहला जर्नल सुनें。',bn:'প্রথম জার্নাল শুনুন。'},

// ════ EMOTIONAL extras ════
'explicat simplu.':{en:'explained simply.',es:'explicado simple.',fr:'expliqué simplement.',de:'einfach erklärt.',pt:'explicado simples.',ru:'простым языком.',zh:'简单解释。',ja:'わかりやすく。',hi:'सरल भाषा में।',bn:'সহজ ভাষায়。'},
'Pași mici care':{en:'Small steps that',es:'Pequeños pasos que',fr:'De petits pas qui',de:'Kleine Schritte die',pt:'Pequenos passos que',ru:'Маленькие шаги',zh:'小步骤',ja:'小さなステップ',hi:'छोटे कदम जो',bn:'ছোট পদক্ষেপ যা'},
'sparg inerția.':{en:'break the inertia.',es:'rompen la inercia.',fr:'brisent l\'inertie.',de:'die Trägheit brechen.',pt:'quebram a inércia.',ru:'ломают инерцию.',zh:'打破惰性。',ja:'惰性を打ち破る。',hi:'जड़ता तोड़ते हैं।',bn:'জড়তা ভাঙে。'},
'Vezi pașii ↓':{en:'See steps ↓',es:'Ver pasos ↓',fr:'Voir les étapes ↓',de:'Schritte ↓',pt:'Ver passos ↓',ru:'Шаги ↓',zh:'查看步骤 ↓',ja:'ステップ ↓',hi:'चरण देखें ↓',bn:'পদক্ষেপ ↓'},

// ════ ALCOOL extras ════
'Pași concreți,':{en:'Concrete steps,',es:'Pasos concretos,',fr:'Des pas concrets,',de:'Konkrete Schritte,',pt:'Passos concretos,',ru:'Конкретные шаги,',zh:'具体步骤，',ja:'具体的なステップ、',hi:'ठोस कदम,',bn:'কংক্রিট পদক্ষেপ,'},
'în ordinea corectă.':{en:'in the right order.',es:'en el orden correcto.',fr:'dans le bon ordre.',de:'in der richtigen Reihenfolge.',pt:'na ordem certa.',ru:'в правильном порядке.',zh:'按正确顺序。',ja:'正しい順序で。',hi:'सही क्रम में।',bn:'সঠিক ক্রমে。'},
'Momentul tău':{en:'Your moment',es:'Tu momento',fr:'Ton moment',de:'Dein Moment',pt:'Seu momento',ru:'Твой момент',zh:'你的时刻',ja:'あなたの瞬間',hi:'आपका पल',bn:'আপনার মুহূর্ত'},
'Resurse verificate România':{en:'Verified resources',es:'Recursos verificados',fr:'Ressources vérifiées',de:'Verifizierte Ressourcen',pt:'Recursos verificados',ru:'Проверенные ресурсы',zh:'已验证资源',ja:'確認済みリソース',hi:'सत्यापित संसाधन',bn:'যাচাইকৃত সম্পদ'},
'Ajutor real,':{en:'Real help,',es:'Ayuda real,',fr:'Aide réelle,',de:'Echte Hilfe,',pt:'Ajuda real,',ru:'Реальная помощь,',zh:'真正的帮助，',ja:'本当の助け、',hi:'असली मदद,',bn:'আসল সাহায্য,'},
'nu link-uri moarte.':{en:'not dead links.',es:'no enlaces muertos.',fr:'pas de liens morts.',de:'keine toten Links.',pt:'sem links mortos.',ru:'не мёртвые ссылки.',zh:'不是死链接。',ja:'デッドリンクではなく。',hi:'मृत लिंक नहीं।',bn:'ডেড লিঙ্ক নয়。'},

// ════ SUBSTANȚE extras ════
'Pași reali,':{en:'Real steps,',es:'Pasos reales,',fr:'Des vrais pas,',de:'Echte Schritte,',pt:'Passos reais,',ru:'Реальные шаги,',zh:'真正的步骤，',ja:'本当のステップ、',hi:'असली कदम,',bn:'আসল পদক্ষেপ,'},
'fără judecată.':{en:'without judgment.',es:'sin juicio.',fr:'sans jugement.',de:'ohne Urteil.',pt:'sem julgamento.',ru:'без осуждения.',zh:'不评判。',ja:'判断なし。',hi:'बिना आलोचना।',bn:'বিচার ছাড়া。'},
'Comunitate terapeutică':{en:'Therapeutic community',es:'Comunidad terapéutica',fr:'Communauté thérapeutique',de:'Therapeutische Gemeinschaft',pt:'Comunidade terapêutica',ru:'Терапевтическое сообщество',zh:'治疗社区',ja:'治療コミュニティ',hi:'चिकित्सा समुदाय',bn:'থেরাপিউটিক সম্প্রদায়'},
'Rezidențial':{en:'Residential',es:'Residencial',fr:'Résidentiel',de:'Stationär',pt:'Residencial',ru:'Стационар',zh:'住院',ja:'入院',hi:'आवासीय',bn:'আবাসিক'},
'Pregătire':{en:'Preparation',es:'Preparación',fr:'Préparation',de:'Vorbereitung',pt:'Preparação',ru:'Подготовка',zh:'准备',ja:'準備',hi:'तैयारी',bn:'প্রস্তুতি'},
'Planul de urgență personal':{en:'Personal emergency plan',es:'Plan de emergencia personal',fr:'Plan d\'urgence personnel',de:'Persönlicher Notfallplan',pt:'Plano de emergência pessoal',ru:'Личный план помощи',zh:'个人紧急计划',ja:'個人緊急プラン',hi:'व्यक्तिगत आपातकालीन योजना',bn:'ব্যক্তিগত জরুরি পরিকল্পনা'},

// ════ AUTOEXCLUDERE extras ════
'Ce trebuie să știi':{en:'What you need to know',es:'Lo que necesitas saber',fr:'Ce qu\'il faut savoir',de:'Was du wissen musst',pt:'O que precisa saber',ru:'Что нужно знать',zh:'你需要知道的',ja:'知っておくべきこと',hi:'आपको क्या जानना चाहिए',bn:'আপনার কী জানা দরকার'},
'Cel mai rapid':{en:'Fastest',es:'Más rápido',fr:'Le plus rapide',de:'Am schnellsten',pt:'Mais rápido',ru:'Самый быстрый',zh:'最快',ja:'最速',hi:'सबसे तेज़',bn:'সবচেয়ে দ্রুত'},
'De acasă':{en:'From home',es:'Desde casa',fr:'De chez toi',de:'Von zuhause',pt:'De casa',ru:'Из дома',zh:'从家里',ja:'自宅から',hi:'घर से',bn:'বাড়ি থেকে'},
'Cu asistență':{en:'With assistance',es:'Con asistencia',fr:'Avec assistance',de:'Mit Unterstützung',pt:'Com assistência',ru:'С помощью',zh:'有协助',ja:'アシスタンス付き',hi:'सहायता के साथ',bn:'সহায়তা সহ'},
'Atenție':{en:'Caution',es:'Atención',fr:'Attention',de:'Achtung',pt:'Atenção',ru:'Внимание',zh:'注意',ja:'注意',hi:'ध्यान',bn:'মনোযোগ'},
'Am depus cererea':{en:'I filed the request',es:'Presenté la solicitud',fr:'J\'ai déposé la demande',de:'Antrag eingereicht',pt:'Enviei o pedido',ru:'Подал заявку',zh:'我提交了申请',ja:'申請しました',hi:'मैंने अनुरोध दायर किया',bn:'আমি আবেদন জমা দিয়েছি'},
'Azi iau decizia.':{en:'Today I decide.',es:'Hoy decido.',fr:'Aujourd\'hui je décide.',de:'Heute entscheide ich.',pt:'Hoje eu decido.',ru:'Сегодня решаю.',zh:'今天我做决定。',ja:'今日決めます。',hi:'आज फैसला करता हूँ।',bn:'আজ সিদ্ধান্ত নিই。'},
'Joc responsabil →':{en:'Responsible gaming →',es:'Juego responsable →',fr:'Jeu responsable →',de:'Verantwortungsvolles Spielen →',pt:'Jogo responsável →',ru:'Ответственная игра →',zh:'负责任游戏 →',ja:'責任あるゲーム →',hi:'जिम्मेदार गेमिंग →',bn:'দায়িত্বশীল গেমিং →'},
'Cum te autoexcluzi — 4 căi oficiale':{en:'How to self-exclude — 4 official channels',es:'Cómo autoexcluirte — 4 canales',fr:'Comment s\'auto-exclure — 4 voies',de:'Selbstsperre — 4 Wege',pt:'Como se autoexcluir — 4 canais',ru:'Самоисключение — 4 канала',zh:'自我排除——4个渠道',ja:'自己排除——4つの方法',hi:'आत्म-बहिष्कार — 4 चैनल',bn:'স্ব-বর্জন — ৪টি চ্যানেল'},

// ════ SETTINGS extras ════
'Creează cont →':{en:'Create account →',es:'Crear cuenta →',fr:'Créer un compte →',de:'Konto erstellen →',pt:'Criar conta →',ru:'Создать аккаунт →',zh:'创建帐户 →',ja:'アカウント作成 →',hi:'खाता बनाएं →',bn:'অ্যাকাউন্ট তৈরি →'},
'🔒 Salvează-ți progresul':{en:'🔒 Save your progress',es:'🔒 Guarda tu progreso',fr:'🔒 Sauvegarde ta progression',de:'🔒 Fortschritt speichern',pt:'🔒 Salve seu progresso',ru:'🔒 Сохрани прогресс',zh:'🔒 保存进度',ja:'🔒 進捗を保存',hi:'🔒 प्रगति सहेजें',bn:'🔒 অগ্রগতি সংরক্ষণ'},
'Mă lupt cu':{en:'I struggle with',es:'Lucho con',fr:'Je me bats avec',de:'Ich kämpfe mit',pt:'Luto contra',ru:'Борюсь с',zh:'我在与之斗争',ja:'戦っているのは',hi:'मैं जूझ रहा हूँ',bn:'আমি লড়ছি'},
'Unde sunt pe drum':{en:'Where I am',es:'Dónde estoy',fr:'Où j\'en suis',de:'Wo ich bin',pt:'Onde estou',ru:'Где я на пути',zh:'我在哪里',ja:'どこにいるか',hi:'कहाँ हूँ',bn:'কোথায় আছি'},
'Declanșatorii mei':{en:'My triggers',es:'Mis desencadenantes',fr:'Mes déclencheurs',de:'Meine Auslöser',pt:'Meus gatilhos',ru:'Мои триггеры',zh:'触发因素',ja:'トリガー',hi:'मेरे ट्रिगर',bn:'আমার ট্রিগার'},
'Sprijinul meu':{en:'My support',es:'Mi apoyo',fr:'Mon soutien',de:'Meine Unterstützung',pt:'Meu apoio',ru:'Моя поддержка',zh:'我的支持',ja:'サポート',hi:'मेरा सहारा',bn:'আমার সহায়তা'},
'Ghid recuperare alcool':{en:'Alcohol recovery guide',es:'Guía recuperación alcohol',fr:'Guide guérison alcool',de:'Alkohol-Leitfaden',pt:'Guia recuperação álcool',ru:'Руководство по алкоголю',zh:'酒精康复指南',ja:'アルコール回復ガイド',hi:'शराब मुक्ति गाइड',bn:'মদ মুক্তি গাইড'},
'Ghid recuperare substanțe':{en:'Substance recovery guide',es:'Guía sustancias',fr:'Guide substances',de:'Substanz-Leitfaden',pt:'Guia substâncias',ru:'Руководство по веществам',zh:'物质康复指南',ja:'薬物回復ガイド',hi:'नशा मुक्ति गाइड',bn:'মাদক মুক্তি গাইড'},
'Autoexcludere jocuri de noroc':{en:'Gambling self-exclusion',es:'Autoexclusión juego',fr:'Auto-exclusion jeu',de:'Glücksspiel-Selbstsperre',pt:'Autoexclusão jogo',ru:'Самоисключение',zh:'赌博自我排除',ja:'ギャンブル自己排除',hi:'जुआ आत्म-बहिष्कार',bn:'জুয়া স্ব-বর্জন'},
'Blocaj emoțional / depresie':{en:'Emotional blockage / depression',es:'Bloqueo emocional / depresión',fr:'Blocage émotionnel / dépression',de:'Emotionale Blockade / Depression',pt:'Bloqueio emocional / depressão',ru:'Эмоциональный блок / депрессия',zh:'情感阻塞/抑郁',ja:'感情ブロック/うつ',hi:'भावनात्मक अवरोध / अवसाद',bn:'আবেগ বাধা / বিষণ্ণতা'},
'Terapie zonală':{en:'Local therapy',es:'Terapia local',fr:'Thérapie locale',de:'Lokale Therapie',pt:'Terapia local',ru:'Зональная терапия',zh:'区域治疗',ja:'ゾーンセラピー',hi:'क्षेत्रीय थेरेपी',bn:'আঞ্চলিক থেরাপি'},
'Despre Voxen':{en:'About Voxen',es:'Acerca de Voxen',fr:'À propos de Voxen',de:'Über Voxen',pt:'Sobre Voxen',ru:'О Voxen',zh:'关于Voxen',ja:'Voxenについて',hi:'Voxen के बारे में',bn:'Voxen সম্পর্কে'},
'Gata':{en:'Done',es:'Listo',fr:'Terminé',de:'Fertig',pt:'Pronto',ru:'Готово',zh:'完成',ja:'完了',hi:'हो गया',bn:'সম্পন্ন'},
'JSON pe dispozitiv':{en:'JSON on device',es:'JSON en dispositivo',fr:'JSON sur appareil',de:'JSON auf Gerät',pt:'JSON no dispositivo',ru:'JSON на устройстве',zh:'设备上的JSON',ja:'デバイスのJSON',hi:'डिवाइस पर JSON',bn:'ডিভাইসে JSON'},
'Pornește de la zero':{en:'Start from scratch',es:'Empezar de cero',fr:'Recommencer à zéro',de:'Von vorne anfangen',pt:'Começar do zero',ru:'Начать с нуля',zh:'从零开始',ja:'ゼロから始める',hi:'शून्य से शुरू',bn:'শূন্য থেকে শুরু'},

// ════ ONBOARDING extras ════
'BUN VENIT':{en:'WELCOME',es:'BIENVENIDO',fr:'BIENVENUE',de:'WILLKOMMEN',pt:'BEM-VINDO',ru:'ДОБРО ПОЖАЛОВАТЬ',zh:'欢迎',ja:'ようこそ',hi:'स्वागत',bn:'স্বাগতম'},
'Hai să-ți configurăm':{en:'Let\'s set up',es:'Configuremos',fr:'Configurons',de:'Lass uns einrichten',pt:'Vamos configurar',ru:'Давай настроим',zh:'让我们设置',ja:'設定しましょう',hi:'चलिए तैयार करें',bn:'চলুন সেট করি'},
'drumul tău.':{en:'your path.',es:'tu camino.',fr:'ton chemin.',de:'deinen Weg.',pt:'seu caminho.',ru:'твой путь.',zh:'你的路径。',ja:'あなたの道を。',hi:'आपका रास्ता।',bn:'আপনার পথ。'},
'Alcool':{en:'Alcohol',es:'Alcohol',fr:'Alcool',de:'Alkohol',pt:'Álcool',ru:'Алкоголь',zh:'酒精',ja:'アルコール',hi:'शराब',bn:'মদ'},
'Substanțe':{en:'Substances',es:'Sustancias',fr:'Substances',de:'Substanzen',pt:'Substâncias',ru:'Вещества',zh:'物质',ja:'薬物',hi:'नशीले पदार्थ',bn:'মাদক'},
'Jocuri de noroc':{en:'Gambling',es:'Juegos de azar',fr:'Jeux de hasard',de:'Glücksspiel',pt:'Jogos de azar',ru:'Азартные игры',zh:'赌博',ja:'ギャンブル',hi:'जुआ',bn:'জুয়া'},
'Depresie sau blocaj emoțional':{en:'Depression or emotional blockage',es:'Depresión o bloqueo emocional',fr:'Dépression ou blocage émotionnel',de:'Depression oder emotionale Blockade',pt:'Depressão ou bloqueio emocional',ru:'Депрессия или блок',zh:'抑郁或情感障碍',ja:'うつ病または感情ブロック',hi:'अवसाद या भावनात्मक अवरोध',bn:'বিষণ্ণতা বা আবেগ বাধা'},
'Altceva':{en:'Something else',es:'Otra cosa',fr:'Autre chose',de:'Etwas anderes',pt:'Outra coisa',ru:'Другое',zh:'其他',ja:'その他',hi:'कुछ और',bn:'অন্য কিছু'},
'Vreau să reduc sau să mă opresc':{en:'I want to reduce or stop',es:'Quiero reducir o parar',fr:'Je veux réduire ou arrêter',de:'Ich will reduzieren oder aufhören',pt:'Quero reduzir ou parar',ru:'Хочу уменьшить или остановиться',zh:'我想减少或停止',ja:'減らすかやめたい',hi:'कम करना या रोकना चाहता हूँ',bn:'কমাতে বা থামাতে চাই'},
'Recuperare din consum de substanțe':{en:'Recovery from substance use',es:'Recuperación del consumo de sustancias',fr:'Guérison de la consommation de substances',de:'Erholung vom Substanzkonsum',pt:'Recuperação do uso de substâncias',ru:'Восстановление от употребления',zh:'物质使用康复',ja:'薬物使用からの回復',hi:'नशे से मुक्ति',bn:'মাদক সেবন থেকে পুনরুদ্ধার'},
'Pariuri, cazinou, jocuri online':{en:'Betting, casino, online games',es:'Apuestas, casino, juegos online',fr:'Paris, casino, jeux en ligne',de:'Wetten, Casino, Online-Spiele',pt:'Apostas, cassino, jogos online',ru:'Ставки, казино, онлайн-игры',zh:'投注、赌场、在线游戏',ja:'賭け、カジノ、オンラインゲーム',hi:'सट्टा, कैसीनो, ऑनलाइन गेम',bn:'বাজি, ক্যাসিনো, অনলাইন গেম'},
'Încă mă gândesc':{en:'Still thinking',es:'Aún pensando',fr:'J\'y réfléchis',de:'Denke noch nach',pt:'Ainda pensando',ru:'Ещё думаю',zh:'还在考虑',ja:'まだ考え中',hi:'अभी सोच रहा',bn:'এখনো ভাবছি'},
'La început':{en:'At the beginning',es:'Al principio',fr:'Au début',de:'Am Anfang',pt:'No começo',ru:'В начале',zh:'在开始',ja:'始めたばかり',hi:'शुरुआत में',bn:'শুরুতে'},
'De câteva luni':{en:'A few months in',es:'Unos meses',fr:'Quelques mois',de:'Seit Monaten',pt:'Alguns meses',ru:'Несколько месяцев',zh:'几个月了',ja:'数ヶ月',hi:'कुछ महीने',bn:'কয়েক মাস'},
'După o recădere':{en:'After a relapse',es:'Tras una recaída',fr:'Après une rechute',de:'Nach Rückfall',pt:'Após recaída',ru:'После срыва',zh:'复发之后',ja:'再発後',hi:'दोबारा गिरने के बाद',bn:'পুনরায় পতনের পর'},
'Serile':{en:'Evenings',es:'Las noches',fr:'Les soirées',de:'Abende',pt:'Noites',ru:'Вечера',zh:'晚上',ja:'夜',hi:'शाम',bn:'সন্ধ্যা'},
'Stresul':{en:'Stress',es:'Estrés',fr:'Stress',de:'Stress',pt:'Estresse',ru:'Стресс',zh:'压力',ja:'ストレス',hi:'तनाव',bn:'চাপ'},
'Singurătatea':{en:'Loneliness',es:'Soledad',fr:'Solitude',de:'Einsamkeit',pt:'Solidão',ru:'Одиночество',zh:'孤独',ja:'孤独',hi:'अकेलापन',bn:'একাকীত্ব'},
'Ieșirile':{en:'Going out',es:'Salidas',fr:'Sorties',de:'Ausgehen',pt:'Saídas',ru:'Встречи',zh:'外出',ja:'外出',hi:'बाहर जाना',bn:'বাইরে যাওয়া'},
'Plictiseala':{en:'Boredom',es:'Aburrimiento',fr:'Ennui',de:'Langeweile',pt:'Tédio',ru:'Скука',zh:'无聊',ja:'退屈',hi:'बोरियत',bn:'একঘেয়েমি'},
'Izolarea':{en:'Isolation',es:'Aislamiento',fr:'Isolement',de:'Isolation',pt:'Isolamento',ru:'Изоляция',zh:'隔离',ja:'孤立',hi:'अलगाव',bn:'বিচ্ছিন্নতা'},
'Am pe cineva':{en:'I have someone',es:'Tengo a alguien',fr:'J\'ai quelqu\'un',de:'Ich habe jemanden',pt:'Tenho alguém',ru:'Есть кто-то',zh:'有人陪伴',ja:'誰かがいる',hi:'कोई है मेरे साथ',bn:'কেউ আছে'},
'Am un terapeut':{en:'I have a therapist',es:'Tengo un terapeuta',fr:'J\'ai un thérapeute',de:'Ich habe einen Therapeuten',pt:'Tenho um terapeuta',ru:'Есть терапевт',zh:'有治疗师',ja:'セラピストがいる',hi:'एक थेरेपिस्ट है',bn:'থেরাপিস্ট আছে'},
'Un grup':{en:'A group',es:'Un grupo',fr:'Un groupe',de:'Eine Gruppe',pt:'Um grupo',ru:'Группа',zh:'一个小组',ja:'グループ',hi:'एक समूह',bn:'একটি গ্রুপ'},
'Singur, deocamdată':{en:'Alone, for now',es:'Solo, por ahora',fr:'Seul, pour l\'instant',de:'Allein, vorerst',pt:'Sozinho, por enquanto',ru:'Один, пока что',zh:'目前独自一人',ja:'今のところ一人',hi:'अभी अकेले',bn:'আপাতত একা'},
'Dimineața':{en:'Morning',es:'Mañana',fr:'Matin',de:'Morgens',pt:'Manhã',ru:'Утром',zh:'早上',ja:'朝',hi:'सुबह',bn:'সকাল'},
'Seara':{en:'Evening',es:'Noche',fr:'Soir',de:'Abends',pt:'Noite',ru:'Вечером',zh:'晚上',ja:'夜',hi:'शाम',bn:'সন্ধ্যা'},
'Noaptea târziu':{en:'Late at night',es:'Tarde en la noche',fr:'Tard le soir',de:'Spät nachts',pt:'De madrugada',ru:'Поздно ночью',zh:'深夜',ja:'深夜',hi:'देर रात',bn:'গভীর রাতে'},
'Oricând — decid eu pe moment':{en:'Anytime — I decide in the moment',es:'Cuando sea — decido en el momento',fr:'N\'importe quand — je décide sur le moment',de:'Jederzeit — ich entscheide spontan',pt:'A qualquer hora — decido no momento',ru:'В любое время — решаю сам',zh:'随时——我自己决定',ja:'いつでも——その時決める',hi:'कभी भी — मैं उस वक्त तय करूं',bn:'যেকোনো সময় — আমি সেই মুহূর্তে ঠিক করি'},
'Ai făcut ceva important.':{en:'You did something important.',es:'Hiciste algo importante.',fr:'Tu as fait quelque chose d\'important.',de:'Du hast etwas Wichtiges getan.',pt:'Fez algo importante.',ru:'Ты сделал важное.',zh:'你做了重要的事。',ja:'大切なことをしました。',hi:'आपने महत्वपूर्ण किया।',bn:'গুরুত্বপূর্ণ কিছু করেছেন。'},
'Salvează-ți progresul.':{en:'Save your progress.',es:'Guarda tu progreso.',fr:'Sauvegarde.',de:'Fortschritt speichern.',pt:'Salve seu progresso.',ru:'Сохрани прогресс.',zh:'保存进度。',ja:'進捗を保存。',hi:'प्रगति सहेजें。',bn:'অগ্রগতি সংরক্ষণ।'},
'Continuă cu Email':{en:'Continue with Email',es:'Continuar con Email',fr:'Continuer avec Email',de:'Mit E-Mail fortfahren',pt:'Continuar com Email',ru:'Продолжить с Email',zh:'通过邮箱继续',ja:'メールで続ける',hi:'ईमेल से जारी',bn:'ইমেইল দিয়ে চালিয়ে যান'},
'Continuă cu Apple':{en:'Continue with Apple',es:'Continuar con Apple',fr:'Continuer avec Apple',de:'Mit Apple fortfahren',pt:'Continuar com Apple',ru:'Продолжить с Apple',zh:'通过Apple继续',ja:'Appleで続ける',hi:'Apple से जारी',bn:'Apple দিয়ে চালিয়ে যান'},
'Continuă cu Google':{en:'Continue with Google',es:'Continuar con Google',fr:'Continuer avec Google',de:'Mit Google fortfahren',pt:'Continuar com Google',ru:'Продолжить с Google',zh:'通过Google继续',ja:'Googleで続ける',hi:'Google से जारी',bn:'Google দিয়ে চালিয়ে যান'},
'Continuă fără cont →':{en:'Continue without account →',es:'Continuar sin cuenta →',fr:'Continuer sans compte →',de:'Ohne Konto →',pt:'Sem conta →',ru:'Без аккаунта →',zh:'不注册继续 →',ja:'アカウントなし →',hi:'बिना खाते के →',bn:'অ্যাকাউন্ট ছাড়া →'},
};

// ═══ TEXT REPLACEMENT ENGINE ═══
function translatePage(){
  if(L==='ro')return;
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(function(node){
    var text=node.textContent.trim();
    if(!text||text.length<2)return;
    if(T[text]&&T[text][L]){
      node.textContent=node.textContent.replace(text,T[text][L]);
    }
  });
  // Also translate data-t elements (backward compat)
  document.querySelectorAll('[data-t]').forEach(function(el){
    var key=el.getAttribute('data-t');
    if(T[key]&&T[key][L])el.textContent=T[key][L];
  });
}

// Run on load + on language change
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',translatePage);
}else{
  translatePage();
}

// Re-translate when language changes via globe menu
window.addEventListener('voxen-lang-change',translatePage);

// Override globe menu to fire event
var origSet=window.localStorage.setItem.bind(window.localStorage);
try{
  var _origSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
    _origSetItem.call(this,k,v);
    if(k==='vxlang'){
      L=v;
      translatePage();
    }
  


};
}catch(e){}

})();
