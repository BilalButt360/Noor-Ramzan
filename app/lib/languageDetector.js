// lib/languageDetector.js
export function detectLanguage(text) {
  const urduPattern = /[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const romanUrduPattern = /\b(?:kya|hai|hain|ka|ki|ko|se|mein|tha|the|raha|rahi|kar|karo|karta|karti|aap|tum|hum|woh|yeh|mera|tera|apna)\b/i;
  
  // Arabic/Urdu script check
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ur'; // Urdu/Arabic script
  }
  
  // Roman Urdu keywords check
  if (romanUrduPattern.test(text)) {
    return 'ur-rom'; // Roman Urdu
  }
  
  // Default to English
  return 'en';
}