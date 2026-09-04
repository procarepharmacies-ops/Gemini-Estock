export interface EStockProduct {
  productId: number;
  productCode: string;
  nameAr: string;
  nameEn: string;
  scientificName: string;
  therapeuticClass: string;
  sellPrice: number;
  buyPrice: number;
  isControlled: boolean;
  requiresPrescription: boolean;
  unit: string;
  substitutes: Array<{
    name: string;
    scientificName: string;
    price: number;
    savingsPercent: number;
  }>;
  batches: Array<{
    batchId: string;
    store: "Main Store" | "Branch 1 (Downtown)" | "Branch 2 (North Plaza)";
    amount: number;
    expDate: string;
    sellPrice: number;
  }>;
  counseling: {
    indications: string;
    dosageInstructions: string;
    foodTiming: string;
    commonSideEffects: string[];
    criticalWarnings: string[];
    missedDoseAdvice: string;
  };
}

export const ESTOCK_PHARMACY_PRODUCTS: EStockProduct[] = [
  {
    productId: 101,
    productCode: "MED-AUG-1000",
    nameAr: "أوجمنتين 1 جم أقراص",
    nameEn: "Augmentin 1g Tablets",
    scientificName: "Amoxicillin 875mg + Clavulanic Acid 125mg",
    therapeuticClass: "Antibiotic (Broad-Spectrum Penicillin)",
    sellPrice: 18.50,
    buyPrice: 14.00,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 14 Tablets (2 Strips)",
    substitutes: [
      { name: "Curam 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 14.20, savingsPercent: 23 },
      { name: "Megamox 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 12.00, savingsPercent: 35 },
      { name: "Hibiotic 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 13.50, savingsPercent: 27 },
      { name: "Klavox 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 13.80, savingsPercent: 25 },
    ],
    batches: [
      { batchId: "B-2024-081", store: "Main Store", amount: 42, expDate: "2027-04-15", sellPrice: 18.50 },
      { batchId: "B-2024-099", store: "Branch 1 (Downtown)", amount: 18, expDate: "2026-11-30", sellPrice: 18.50 },
      { batchId: "B-2023-110", store: "Branch 2 (North Plaza)", amount: 0, expDate: "2025-12-01", sellPrice: 18.50 },
    ],
    counseling: {
      indications: "Bacterial infections of the respiratory tract, ENT, skin, and urinary tract.",
      dosageInstructions: "Take 1 tablet every 12 hours (twice daily) at the start of a meal.",
      foodTiming: "Take right at the beginning of a meal to reduce GI upset and maximize clavulanate absorption.",
      commonSideEffects: ["Mild diarrhea", "Nausea or stomach cramp", "Oral/vaginal thrush with prolonged use"],
      criticalWarnings: [
        "Contraindicated in patients with severe penicillin/amoxicillin allergies or history of amoxicillin-associated jaundice/hepatic dysfunction.",
        "Complete the full prescribed course even if symptoms resolve early.",
      ],
      missedDoseAdvice: "Take as soon as remembered. If close to the next scheduled dose, skip the missed one. Never double up.",
    },
  },
  {
    productId: 102,
    productCode: "MED-CUR-1000",
    nameAr: "كيورام 1 جم أقراص",
    nameEn: "Curam 1g Tablets",
    scientificName: "Amoxicillin 875mg + Clavulanic Acid 125mg",
    therapeuticClass: "Antibiotic (Broad-Spectrum Penicillin)",
    sellPrice: 14.20,
    buyPrice: 10.50,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 12 Tablets",
    substitutes: [
      { name: "Augmentin 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 18.50, savingsPercent: -30 },
      { name: "Megamox 1g Tablets", scientificName: "Amoxicillin 875mg + Clavulanate 125mg", price: 12.00, savingsPercent: 15 },
    ],
    batches: [
      { batchId: "C-9921", store: "Main Store", amount: 65, expDate: "2027-08-20", sellPrice: 14.20 },
      { batchId: "C-9922", store: "Branch 1 (Downtown)", amount: 32, expDate: "2027-08-20", sellPrice: 14.20 },
      { batchId: "C-9923", store: "Branch 2 (North Plaza)", amount: 24, expDate: "2027-05-15", sellPrice: 14.20 },
    ],
    counseling: {
      indications: "Direct bioequivalent substitute to Augmentin 1g.",
      dosageInstructions: "Take 1 tablet every 12 hours with meals.",
      foodTiming: "Take with food.",
      commonSideEffects: ["Loose stools", "Nausea"],
      criticalWarnings: ["Check for penicillin allergy."],
      missedDoseAdvice: "Take as soon as remembered. Do not double dose.",
    },
  },
  {
    productId: 103,
    productCode: "MED-PAN-EXT",
    nameAr: "بنادول إكسترا أقراص",
    nameEn: "Panadol Extra Tablets",
    scientificName: "Paracetamol 500mg + Caffeine 65mg",
    therapeuticClass: "Analgesic & Antipyretic",
    sellPrice: 4.50,
    buyPrice: 3.10,
    isControlled: false,
    requiresPrescription: false,
    unit: "Box of 24 Tablets",
    substitutes: [
      { name: "Adol Extra Tablets", scientificName: "Paracetamol 500mg + Caffeine 65mg", price: 3.80, savingsPercent: 15 },
      { name: "Cetamol Extra", scientificName: "Paracetamol 500mg + Caffeine 65mg", price: 3.20, savingsPercent: 29 },
      { name: "Fevadol Plus", scientificName: "Paracetamol 500mg + Caffeine 65mg", price: 3.50, savingsPercent: 22 },
    ],
    batches: [
      { batchId: "PAN-801", store: "Main Store", amount: 320, expDate: "2027-10-01", sellPrice: 4.50 },
      { batchId: "PAN-802", store: "Branch 1 (Downtown)", amount: 150, expDate: "2027-10-01", sellPrice: 4.50 },
      { batchId: "PAN-803", store: "Branch 2 (North Plaza)", amount: 210, expDate: "2027-10-01", sellPrice: 4.50 },
    ],
    counseling: {
      indications: "Headache, migraine, toothache, muscular aches, backache, and fever.",
      dosageInstructions: "Adults: 1 to 2 tablets every 4 to 6 hours as needed. Maximum 8 tablets (4,000mg Paracetamol) per 24 hours.",
      foodTiming: "Can be taken with or without food. Takes effect faster on an empty stomach.",
      commonSideEffects: ["Mild insomnia if taken close to bedtime due to caffeine", "Mild restlessness"],
      criticalWarnings: [
        "Do NOT combine with other paracetamol/acetaminophen products to prevent fatal acute liver toxicity.",
        "Avoid excessive coffee/tea/energy drink intake while using.",
      ],
      missedDoseAdvice: "Take only as needed for pain relief.",
    },
  },
  {
    productId: 104,
    productCode: "MED-LIP-20",
    nameAr: "ليبيتور 20 مجم أقراص",
    nameEn: "Lipitor 20mg Tablets",
    scientificName: "Atorvastatin Calcium 20mg",
    therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
    sellPrice: 28.00,
    buyPrice: 21.50,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 28 Tablets",
    substitutes: [
      { name: "Ator 20mg Tablets", scientificName: "Atorvastatin 20mg", price: 16.50, savingsPercent: 41 },
      { name: "Lipona 20mg Tablets", scientificName: "Atorvastatin 20mg", price: 14.00, savingsPercent: 50 },
      { name: "Storvas 20mg Tablets", scientificName: "Atorvastatin 20mg", price: 15.00, savingsPercent: 46 },
    ],
    batches: [
      { batchId: "LIP-204", store: "Main Store", amount: 25, expDate: "2027-03-15", sellPrice: 28.00 },
      { batchId: "LIP-205", store: "Branch 1 (Downtown)", amount: 12, expDate: "2026-12-31", sellPrice: 28.00 },
      { batchId: "LIP-206", store: "Branch 2 (North Plaza)", amount: 30, expDate: "2027-03-15", sellPrice: 28.00 },
    ],
    counseling: {
      indications: "Hypercholesterolemia, prevention of cardiovascular events, coronary heart disease.",
      dosageInstructions: "Take 1 tablet once daily, preferably in the evening.",
      foodTiming: "Can be taken with or without food. Evening administration preferred for optimal cholesterol synthesis inhibition.",
      commonSideEffects: ["Mild muscle stiffness", "Headache", "Constipation or gas"],
      criticalWarnings: [
        "Report any unexplained muscle pain, tenderness, or weakness immediately (risk of rhabdomyolysis).",
        "Avoid grapefruit or grapefruit juice, which inhibits CYP3A4 metabolism and dramatically increases statin blood levels.",
        "Contraindicated in active liver disease and pregnancy.",
      ],
      missedDoseAdvice: "Take as soon as remembered. If more than 12 hours late, skip and take the next scheduled dose.",
    },
  },
  {
    productId: 105,
    productCode: "MED-GLU-500",
    nameAr: "جلوكوفاج 500 مجم أقراص",
    nameEn: "Glucophage 500mg Tablets",
    scientificName: "Metformin Hydrochloride 500mg",
    therapeuticClass: "Biguanide (Antidiabetic)",
    sellPrice: 7.50,
    buyPrice: 5.20,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 50 Tablets",
    substitutes: [
      { name: "Cidophage 500mg Tablets", scientificName: "Metformin HCl 500mg", price: 4.80, savingsPercent: 36 },
      { name: "Formit 500mg Tablets", scientificName: "Metformin HCl 500mg", price: 5.00, savingsPercent: 33 },
    ],
    batches: [
      { batchId: "GLU-101", store: "Main Store", amount: 140, expDate: "2028-01-10", sellPrice: 7.50 },
      { batchId: "GLU-102", store: "Branch 1 (Downtown)", amount: 85, expDate: "2028-01-10", sellPrice: 7.50 },
      { batchId: "GLU-103", store: "Branch 2 (North Plaza)", amount: 90, expDate: "2027-09-15", sellPrice: 7.50 },
    ],
    counseling: {
      indications: "Type 2 Diabetes Mellitus, Insulin Resistance, Polycystic Ovary Syndrome (PCOS).",
      dosageInstructions: "Usually initiated at 500mg once or twice daily with meals, titrated gradually.",
      foodTiming: "Always take during or immediately after a substantial meal to minimize gastrointestinal discomfort.",
      commonSideEffects: ["Metallic taste in mouth", "Transient nausea", "Abdominal bloating or loose stools (usually improves over 2-3 weeks)"],
      criticalWarnings: [
        "Risk of lactic acidosis in patients with significant renal impairment (eGFR < 30 mL/min).",
        "Must temporarily withhold 48 hours before iodinated radiological contrast procedures.",
      ],
      missedDoseAdvice: "Take with your next meal. Do not take an extra tablet to compensate.",
    },
  },
  {
    productId: 106,
    productCode: "MED-CON-5",
    nameAr: "كونكور 5 مجم أقراص",
    nameEn: "Concor 5mg Tablets",
    scientificName: "Bisoprolol Fumarate 5mg",
    therapeuticClass: "Cardioselective Beta-1 Blocker",
    sellPrice: 11.00,
    buyPrice: 8.00,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 30 Tablets",
    substitutes: [
      { name: "Biso 5mg Tablets", scientificName: "Bisoprolol 5mg", price: 6.50, savingsPercent: 41 },
      { name: "Bisocard 5mg Tablets", scientificName: "Bisoprolol 5mg", price: 7.00, savingsPercent: 36 },
      { name: "Lodoz 5/6.25mg Tablets", scientificName: "Bisoprolol + HCTZ (Combo)", price: 12.50, savingsPercent: -13 },
    ],
    batches: [
      { batchId: "CON-501", store: "Main Store", amount: 60, expDate: "2027-06-20", sellPrice: 11.00 },
      { batchId: "CON-502", store: "Branch 1 (Downtown)", amount: 30, expDate: "2027-06-20", sellPrice: 11.00 },
      { batchId: "CON-503", store: "Branch 2 (North Plaza)", amount: 0, expDate: "2025-05-10", sellPrice: 11.00 },
    ],
    counseling: {
      indications: "Hypertension, chronic heart failure, angina pectoris.",
      dosageInstructions: "Take 1 tablet once daily in the morning.",
      foodTiming: "Can be taken with or without breakfast.",
      commonSideEffects: ["Cold hands and feet", "Dizziness upon standing", "Fatigue"],
      criticalWarnings: [
        "Do NOT abruptly stop taking Bisoprolol; sudden discontinuation can precipitate rebound hypertensive crisis, severe angina, or arrhythmias.",
        "Contraindicated in severe asthma, cardiogenic shock, and bradycardia (pulse < 50 bpm).",
      ],
      missedDoseAdvice: "Take in the morning if remembered. If remembered in the evening, skip until the next morning.",
    },
  },
  {
    productId: 107,
    productCode: "MED-NEX-40",
    nameAr: "نيكسيوم 40 مجم أقراص",
    nameEn: "Nexium 40mg Tablets",
    scientificName: "Esomeprazole Magnesium 40mg",
    therapeuticClass: "Proton Pump Inhibitor (PPI)",
    sellPrice: 26.00,
    buyPrice: 19.50,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 28 Tablets",
    substitutes: [
      { name: "Esmo 40mg Tablets", scientificName: "Esomeprazole 40mg", price: 14.50, savingsPercent: 44 },
      { name: "Zurcal 40mg Tablets", scientificName: "Pantoprazole 40mg (Equivalent Class)", price: 15.00, savingsPercent: 42 },
      { name: "Controloc 40mg Tablets", scientificName: "Pantoprazole 40mg", price: 16.00, savingsPercent: 38 },
    ],
    batches: [
      { batchId: "NEX-401", store: "Main Store", amount: 15, expDate: "2027-02-14", sellPrice: 26.00 },
      { batchId: "NEX-402", store: "Branch 1 (Downtown)", amount: 0, expDate: "2026-08-01", sellPrice: 26.00 },
      { batchId: "NEX-403", store: "Branch 2 (North Plaza)", amount: 18, expDate: "2027-02-14", sellPrice: 26.00 },
    ],
    counseling: {
      indications: "Gastroesophageal Reflux Disease (GERD), peptic ulcer disease, H. pylori eradication.",
      dosageInstructions: "Take 1 tablet once daily, swallow whole with water. Do not crush or chew.",
      foodTiming: "Take 30 to 60 minutes BEFORE the first meal of the day (breakfast) for maximal acid pump suppression.",
      commonSideEffects: ["Headache", "Abdominal discomfort", "Dry mouth"],
      criticalWarnings: [
        "Long-term use (>1 year) may decrease magnesium, vitamin B12 absorption, and slightly increase bone fracture risk.",
        "Significant drug interaction with Clopidogrel (Plavix) by competing for CYP2C19 (Pantoprazole is preferred if on Plavix).",
      ],
      missedDoseAdvice: "Take before your next meal if remembered. Do not double the dose.",
    },
  },
  {
    productId: 108,
    productCode: "MED-CAT-50",
    nameAr: "كاتافلام 50 مجم أقراص",
    nameEn: "Cataflam 50mg Tablets",
    scientificName: "Diclofenac Potassium 50mg",
    therapeuticClass: "NSAID (Rapid-Onset Analgesic & Anti-inflammatory)",
    sellPrice: 6.00,
    buyPrice: 4.20,
    isControlled: false,
    requiresPrescription: false,
    unit: "Box of 20 Sugar-Coated Tablets",
    substitutes: [
      { name: "Dolphin 50mg Tablets", scientificName: "Diclofenac Potassium 50mg", price: 3.50, savingsPercent: 41 },
      { name: "Declophen 50mg Tablets", scientificName: "Diclofenac Potassium 50mg", price: 4.00, savingsPercent: 33 },
      { name: "Voltaren 50mg Enteric-Coated", scientificName: "Diclofenac Sodium 50mg (Delayed Release)", price: 6.50, savingsPercent: -8 },
    ],
    batches: [
      { batchId: "CAT-501", store: "Main Store", amount: 210, expDate: "2027-11-20", sellPrice: 6.00 },
      { batchId: "CAT-502", store: "Branch 1 (Downtown)", amount: 115, expDate: "2027-11-20", sellPrice: 6.00 },
      { batchId: "CAT-503", store: "Branch 2 (North Plaza)", amount: 80, expDate: "2027-11-20", sellPrice: 6.00 },
    ],
    counseling: {
      indications: "Acute migraine, dental pain, dysmenorrhea, post-traumatic inflammation, acute gout.",
      dosageInstructions: "Initial dose 50mg to 100mg, followed by 50mg every 8 hours as needed. Maximum 150mg/day.",
      foodTiming: "Take with or immediately after food or a glass of milk to protect gastric mucosa.",
      commonSideEffects: ["Heartburn, epigastric discomfort", "Nausea", "Fluid retention"],
      criticalWarnings: [
        "Contraindicated in active peptic ulcer, third-trimester pregnancy, and severe heart failure.",
        "Increased cardiovascular thrombotic risk with high doses or prolonged use.",
      ],
      missedDoseAdvice: "Take only as needed for acute pain.",
    },
  },
  {
    productId: 109,
    productCode: "MED-ZIT-500",
    nameAr: "زيثروماكس 500 مجم أقراص",
    nameEn: "Zithromax 500mg Tablets",
    scientificName: "Azithromycin 500mg",
    therapeuticClass: "Macrolide Antibiotic",
    sellPrice: 19.00,
    buyPrice: 14.50,
    isControlled: false,
    requiresPrescription: true,
    unit: "Box of 3 Tablets (3-Day Short Course)",
    substitutes: [
      { name: "Azitro 500mg Tablets", scientificName: "Azithromycin 500mg", price: 11.50, savingsPercent: 39 },
      { name: "Zisun 500mg Tablets", scientificName: "Azithromycin 500mg", price: 10.00, savingsPercent: 47 },
      { name: "Azithro 500mg Tablets", scientificName: "Azithromycin 500mg", price: 12.00, savingsPercent: 36 },
    ],
    batches: [
      { batchId: "ZIT-301", store: "Main Store", amount: 35, expDate: "2027-05-30", sellPrice: 19.00 },
      { batchId: "ZIT-302", store: "Branch 1 (Downtown)", amount: 20, expDate: "2027-05-30", sellPrice: 19.00 },
      { batchId: "ZIT-303", store: "Branch 2 (North Plaza)", amount: 15, expDate: "2027-05-30", sellPrice: 19.00 },
    ],
    counseling: {
      indications: "Community-acquired pneumonia, acute bacterial sinusitis, tonsillitis, chlamydia infections.",
      dosageInstructions: "Take 1 tablet (500mg) once daily for 3 consecutive days.",
      foodTiming: "Can be taken with or without food. Taking with a light snack reduces nausea.",
      commonSideEffects: ["Mild stomach cramps", "Loose bowel movements", "Headache"],
      criticalWarnings: [
        "Caution in patients with prolonged QT interval or cardiac arrhythmias.",
        "Separate administration by at least 2 hours from magnesium- or aluminum-containing antacids.",
      ],
      missedDoseAdvice: "Take as soon as remembered and complete the full 3-day course.",
    },
  },
  {
    productId: 110,
    productCode: "MED-VEN-100",
    nameAr: "فنتولين بخاخ 100 ميكروجرام",
    nameEn: "Ventolin Evohaler Inhaler",
    scientificName: "Salbutamol Sulfate 100mcg/actuation",
    therapeuticClass: "Short-Acting Beta-2 Agonist (Rescue Bronchodilator)",
    sellPrice: 9.50,
    buyPrice: 7.00,
    isControlled: false,
    requiresPrescription: false,
    unit: "Inhaler of 200 Metered Doses",
    substitutes: [
      { name: "Asthalin Inhaler 100mcg", scientificName: "Salbutamol 100mcg", price: 6.20, savingsPercent: 34 },
      { name: "Butalin Inhaler 100mcg", scientificName: "Salbutamol 100mcg", price: 6.80, savingsPercent: 28 },
    ],
    batches: [
      { batchId: "VEN-701", store: "Main Store", amount: 75, expDate: "2027-09-01", sellPrice: 9.50 },
      { batchId: "VEN-702", store: "Branch 1 (Downtown)", amount: 40, expDate: "2027-09-01", sellPrice: 9.50 },
      { batchId: "VEN-703", store: "Branch 2 (North Plaza)", amount: 35, expDate: "2027-09-01", sellPrice: 9.50 },
    ],
    counseling: {
      indications: "Rapid relief of bronchospasm in asthma, chronic bronchitis, and exercise-induced asthma.",
      dosageInstructions: "1 to 2 puffs inhaled when acute wheezing/shortness of breath occurs. Max 8 puffs in 24 hours.",
      foodTiming: "Administer irrespective of meals.",
      commonSideEffects: ["Fine hand tremor", "Mild heart palpitations/tachycardia", "Transient nervousness"],
      criticalWarnings: [
        "Shake well before each use. Breathe out gently, place mouthpiece between teeth and lips, press canister while inhaling slowly and deeply, hold breath for 10 seconds.",
        "If using more than 2-3 times per week, asthma control is inadequate and a controller steroid is required.",
      ],
      missedDoseAdvice: "Use only as needed for acute symptoms.",
    },
  },
];
