# 🌸 महिला ऋण सेवा – Women's Loan Management App

**2% ब्याज दर पर महिला संगठन के लिए डिजिटल ऋण प्रबंधन प्रणाली**

A full-featured React web application for managing low-interest (2%) loans for women's self-help organizations, built entirely in Hindi.

## मॉड्यूल / Modules

| मॉड्यूल | विवरण |
|---------|-------|
| 🏠 डैशबोर्ड | संगठन का संपूर्ण अवलोकन – सदस्य, ऋण, भुगतान |
| 👤 पंजीकरण & KYC | आधार/पैन वेरिफिकेशन, 3-चरण पंजीकरण |
| 📝 ऋण आवेदन | ₹5,000–₹50,000, EMI कैलकुलेटर, भुगतान शेड्यूल |
| ✅ अनुमोदन | एडमिन वर्कफ्लो, डिजिटल सिग्नेचर, सूचना |
| 💳 EMI भुगतान | UPI/Netbanking/Wallet/Cash, रिमाइंडर |
| 🧮 ब्याज कैलकुलेटर | Amortization table, EMI ब्रेकअप |
| 📊 रिपोर्ट | मासिक रिपोर्ट, सदस्यवार हिसाब, डैशबोर्ड |
| ❓ सहायता | FAQ, हिंदी चैटबॉट, संपर्क जानकारी |

## त्वरित शुरुआत / Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## तकनीक / Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Language:** Hindi (हिंदी) UI
- **State:** React Context API
- **Styling:** Custom CSS (no external UI library)

## ब्याज फॉर्मूला / Interest Formula

```
EMI = P × r × (1+r)ⁿ / [(1+r)ⁿ - 1]
```
जहाँ P = मूलधन, r = मासिक ब्याज दर (2% = 0.02), n = महीने
