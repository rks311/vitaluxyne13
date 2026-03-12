export type Lang = "fr" | "ar";

export const translations: Record<string, Record<Lang, string>> = {
  // Header
  "nav.catalog": { fr: "Catalogue", ar: "الكتالوج" },
  "nav.packs": { fr: "Packs", ar: "الباقات" },
  "nav.home": { fr: "Accueil", ar: "الرئيسية" },
  "nav.cart": { fr: "Panier", ar: "السلة" },

  // Hero
  "hero.subtitle": { fr: "Compléments Alimentaires Premium", ar: "مكملات غذائية ممتازة" },
  "hero.authentic": { fr: "Authentique", ar: "أصلي" },
  "hero.delivery": { fr: "Livraison", ar: "التوصيل" },
  "hero.payment": { fr: "Paiement", ar: "الدفع" },

  // Flash Banner
  "flash.title": { fr: "FLASH SALE", ar: "تخفيضات سريعة" },
  "flash.ends": { fr: "se termine dans", ar: "ينتهي خلال" },

  // Categories
  "cat.title": { fr: "CATÉGORIES", ar: "الفئات" },

  // Popular
  "popular.title": { fr: "BEST", ar: "الأكثر" },
  "popular.highlight": { fr: "SELLERS", ar: "مبيعاً" },
  "popular.sub": { fr: "Les plus vendus ce mois", ar: "الأكثر مبيعاً هذا الشهر" },
  "popular.viewAll": { fr: "Tout voir", ar: "عرض الكل" },

  // Packs
  "packs.title": { fr: "NOS", ar: "باقاتنا" },
  "packs.highlight": { fr: "PACKS", ar: "المميزة" },
  "packs.sub": { fr: "Économisez avec nos packs combinés", ar: "وفّر مع باقاتنا المجمعة" },
  "packs.order": { fr: "Commander", ar: "اطلب الآن" },
  "packs.whatsapp": { fr: "Contactez-nous sur WhatsApp pour commander ce pack !", ar: "تواصل معنا عبر واتساب لطلب هذه الباقة!" },
  "packs.viewDetail": { fr: "Voir détails →", ar: "عرض التفاصيل →" },
  "packs.contains": { fr: "Ce pack contient", ar: "تحتوي هذه الباقة على" },
  "packs.save": { fr: "Vous économisez", ar: "توفير" },
  "packs.more": { fr: "autres", ar: "أخرى" },

  // Promos
  "promo.title": { fr: "PROMOS", ar: "عروض" },
  "promo.highlight": { fr: "EN COURS", ar: "حالية" },
  "promo.sub": { fr: "Offres limitées — ne ratez pas !", ar: "عروض محدودة — لا تفوتها!" },

  // Trust
  "trust.delivery": { fr: "Livraison 48h", ar: "توصيل 48 ساعة" },
  "trust.deliveryDesc": { fr: "Partout en Algérie", ar: "في كل أنحاء الجزائر" },
  "trust.cod": { fr: "Paiement COD", ar: "الدفع عند الاستلام" },
  "trust.codDesc": { fr: "Cash à la livraison", ar: "نقداً عند التسليم" },
  "trust.original": { fr: "100% Original", ar: "100% أصلي" },
  "trust.originalDesc": { fr: "Produits authentiques", ar: "منتجات أصلية" },
  "trust.support": { fr: "Support 24/7", ar: "دعم 24/7" },
  "trust.supportDesc": { fr: "Réponse rapide WhatsApp", ar: "رد سريع عبر واتساب" },

  // Testimonials
  "reviews.title": { fr: "AVIS", ar: "آراء" },
  "reviews.highlight": { fr: "CLIENTS", ar: "العملاء" },
  "reviews.sub": { fr: "Ce que disent nos clients", ar: "ماذا يقول عملاؤنا" },

  // Product Card
  "product.add": { fr: "Ajouter", ar: "أضف" },
  "product.top": { fr: "🔥 Top", ar: "🔥 الأفضل" },
  "product.addToCart": { fr: "Ajouter au panier", ar: "أضف إلى السلة" },
  "product.inStock": { fr: "En stock", ar: "متوفر" },
  "product.outOfStock": { fr: "Rupture de stock", ar: "غير متوفر" },
  "product.flavor": { fr: "Goût", ar: "النكهة" },
  "product.weight": { fr: "Poids", ar: "الوزن" },
  "product.quantity": { fr: "Quantité", ar: "الكمية" },
  "product.similar": { fr: "PRODUITS", ar: "منتجات" },
  "product.similarHighlight": { fr: "SIMILAIRES", ar: "مشابهة" },
  "product.notFound": { fr: "Produit non trouvé", ar: "المنتج غير موجود" },
  "product.back": { fr: "Retour", ar: "رجوع" },
  "product.backToCatalog": { fr: "Retour au catalogue", ar: "العودة للكتالوج" },
  "product.reviews": { fr: "avis", ar: "تقييم" },
  "product.nutrition": { fr: "Valeurs Nutritionnelles", ar: "القيم الغذائية" },

  // Catalog
  "catalog.title": { fr: "NOTRE", ar: "كتالوجنا" },
  "catalog.highlight": { fr: "CATALOGUE", ar: "المتميز" },
  "catalog.search": { fr: "Rechercher un produit...", ar: "البحث عن منتج..." },
  "catalog.filters": { fr: "Filtres", ar: "تصفية" },
  "catalog.category": { fr: "Catégorie", ar: "الفئة" },
  "catalog.objective": { fr: "Objectif", ar: "الهدف" },
  "catalog.clearFilters": { fr: "Effacer les filtres", ar: "مسح الفلاتر" },
  "catalog.results": { fr: "produit(s) trouvé(s)", ar: "منتج(ات) تم العثور عليها" },
  "catalog.noResults": { fr: "Aucun produit trouvé", ar: "لم يتم العثور على منتجات" },

  // Cart
  "cart.title": { fr: "Panier", ar: "السلة" },
  "cart.empty": { fr: "Votre panier est vide", ar: "سلتك فارغة" },
  "cart.total": { fr: "Total", ar: "المجموع" },
  "cart.order": { fr: "Commander", ar: "اطلب الآن" },
  "cart.viewCatalog": { fr: "Voir le catalogue", ar: "عرض الكتالوج" },

  // Checkout
  "checkout.title": { fr: "COMMANDER", ar: "تأكيد الطلب" },
  "checkout.info": { fr: "Infos", ar: "المعلومات" },
  "checkout.delivery": { fr: "Livraison", ar: "التوصيل" },
  "checkout.confirm": { fr: "Confirmer", ar: "تأكيد" },
  "checkout.yourInfo": { fr: "Vos informations", ar: "معلوماتك" },
  "checkout.fullName": { fr: "Nom complet", ar: "الاسم الكامل" },
  "checkout.phone": { fr: "Téléphone (ex: 0555123456)", ar: "الهاتف (مثال: 0555123456)" },
  "checkout.selectWilaya": { fr: "Sélectionner la Wilaya", ar: "اختر الولاية" },
  "checkout.commune": { fr: "Commune", ar: "البلدية" },
  "checkout.address": { fr: "Adresse complète", ar: "العنوان الكامل" },
  "checkout.notes": { fr: "Notes supplémentaires (optionnel)", ar: "ملاحظات إضافية (اختياري)" },
  "checkout.deliveryMode": { fr: "Mode de livraison", ar: "طريقة التوصيل" },
  "checkout.homeDelivery": { fr: "Livraison à domicile", ar: "توصيل للمنزل" },
  "checkout.homeDeliveryDesc": { fr: "Yalidine Express", ar: "يالدين إكسبرس" },
  "checkout.relayPoint": { fr: "Point relais Yalidine", ar: "نقطة استلام يالدين" },
  "checkout.relayDesc": { fr: "Gratuit - Retrait en agence", ar: "مجاني - استلام من الوكالة" },
  "checkout.codPayment": { fr: "Paiement à la livraison", ar: "الدفع عند الاستلام" },
  "checkout.codDesc": { fr: "Payez en espèces à la réception.", ar: "ادفع نقداً عند الاستلام." },
  "checkout.confirmOrder": { fr: "Confirmer la commande", ar: "تأكيد الطلب" },
  "checkout.name": { fr: "Nom:", ar: "الاسم:" },
  "checkout.phoneLabel": { fr: "Téléphone:", ar: "الهاتف:" },
  "checkout.addressLabel": { fr: "Adresse:", ar: "العنوان:" },
  "checkout.deliveryLabel": { fr: "Livraison:", ar: "التوصيل:" },
  "checkout.atHome": { fr: "À domicile", ar: "للمنزل" },
  "checkout.relay": { fr: "Point relais", ar: "نقطة استلام" },
  "checkout.whatsappConfirm": { fr: "Confirmation via WhatsApp", ar: "تأكيد عبر واتساب" },
  "checkout.whatsappDesc": { fr: "Votre commande sera envoyée via WhatsApp et enregistrée.", ar: "سيتم إرسال طلبك عبر واتساب وتسجيله." },
  "checkout.back": { fr: "Retour", ar: "رجوع" },
  "checkout.next": { fr: "Suivant", ar: "التالي" },
  "checkout.confirmViaWhatsapp": { fr: "Confirmer via WhatsApp", ar: "تأكيد عبر واتساب" },
  "checkout.subtotal": { fr: "Sous-total", ar: "المجموع الفرعي" },
  "checkout.deliveryFee": { fr: "Livraison", ar: "التوصيل" },
  "checkout.free": { fr: "Gratuit", ar: "مجاني" },
  "checkout.summary": { fr: "Résumé", ar: "الملخص" },
  "checkout.emptyCart": { fr: "Votre panier est vide", ar: "سلتك فارغة" },
  "checkout.orderSuccess": { fr: "envoyée avec succès !", ar: "تم إرسال الطلب بنجاح!" },
  "checkout.orderError": { fr: "Erreur lors de l'envoi. Réessayez.", ar: "خطأ أثناء الإرسال. حاول مرة أخرى." },

  // Footer
  "footer.desc": { fr: "La référence des compléments alimentaires de musculation en Algérie.", ar: "المرجع في المكملات الغذائية لكمال الأجسام في الجزائر." },
  "footer.navigation": { fr: "Navigation", ar: "التنقل" },
  "footer.info": { fr: "Informations", ar: "معلومات" },
  "footer.faq": { fr: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.returns": { fr: "Politique de retour", ar: "سياسة الإرجاع" },
  "footer.shipping": { fr: "Livraison", ar: "التوصيل" },
  "footer.contact": { fr: "Contact", ar: "اتصل بنا" },
  "footer.rights": { fr: "© 2026 Ultra Nutrition. Tous droits réservés.", ar: "© 2026 Ultra Nutrition. جميع الحقوق محفوظة." },

  // Pack Builder
  "packBuilder.title": { fr: "CRÉER MON", ar: "أنشئ" },
  "packBuilder.highlight": { fr: "PACK", ar: "باقتي" },
  "packBuilder.sub": { fr: "Compose ton pack personnalisé", ar: "أنشئ باقتك المخصصة" },
  "packBuilder.objective": { fr: "Objectif", ar: "الهدف" },
  "packBuilder.protein": { fr: "Protéine", ar: "البروتين" },
  "packBuilder.complement": { fr: "Complément", ar: "المكمل" },
  "packBuilder.summary": { fr: "Résumé", ar: "الملخص" },
  "packBuilder.whatObjective": { fr: "Quel est ton objectif ?", ar: "ما هو هدفك؟" },
  "packBuilder.massGain": { fr: "Prise de masse", ar: "زيادة الكتلة" },
  "packBuilder.cutting": { fr: "Sèche", ar: "تنشيف" },
  "packBuilder.chooseProtein": { fr: "Choisis ta protéine", ar: "اختر البروتين" },
  "packBuilder.addComplement": { fr: "Ajoute un complément", ar: "أضف مكملاً" },
  "packBuilder.packReady": { fr: "Ton pack est prêt !", ar: "باقتك جاهزة!" },
  "packBuilder.validatePack": { fr: "Valide ton pack et passe commande.", ar: "أكّد باقتك واطلبها." },
  "packBuilder.yourPack": { fr: "Ton Pack", ar: "باقتك" },
  "packBuilder.noProducts": { fr: "Aucun produit sélectionné", ar: "لم يتم اختيار منتجات" },
  "packBuilder.orderPack": { fr: "Commander le pack", ar: "اطلب الباقة" },

  // 404
  "notFound.title": { fr: "Page non trouvée", ar: "الصفحة غير موجودة" },
  "notFound.back": { fr: "Retour à l'accueil", ar: "العودة للرئيسية" },

  // Admin
  "admin.dashboard": { fr: "Dashboard", ar: "لوحة التحكم" },
  "admin.orders": { fr: "Commandes", ar: "الطلبات" },
  "admin.products": { fr: "Produits", ar: "المنتجات" },
  "admin.packs": { fr: "Packs", ar: "الباقات" },
  "admin.clients": { fr: "Clients", ar: "العملاء" },
  "admin.promos": { fr: "Promotions", ar: "العروض" },
  "admin.settings": { fr: "Paramètres", ar: "الإعدادات" },
  "admin.logout": { fr: "Déconnexion", ar: "تسجيل الخروج" },
  "admin.login": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "admin.signup": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "admin.loginTitle": { fr: "ADMINISTRATION", ar: "الإدارة" },
  "admin.loginSub": { fr: "Ultra Nutrition — Panneau Admin", ar: "Ultra Nutrition — لوحة الإدارة" },
  "admin.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "admin.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "admin.loading": { fr: "Chargement...", ar: "جاري التحميل..." },
  "admin.hasAccount": { fr: "Déjà un compte ? Se connecter", ar: "لديك حساب؟ سجل الدخول" },
  "admin.firstTime": { fr: "Première utilisation ? Créer un compte", ar: "أول استخدام؟ أنشئ حساباً" },
  "admin.accountCreated": { fr: "Compte créé ! Vous êtes connecté.", ar: "تم إنشاء الحساب! أنت متصل." },
  "admin.loginSuccess": { fr: "Connexion réussie", ar: "تم الاتصال بنجاح" },

  // Language
  "lang.switch": { fr: "العربية", ar: "Français" },
};
