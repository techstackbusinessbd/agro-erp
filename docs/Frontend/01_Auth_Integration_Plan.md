# Frontend React Setup & Auth Testing Plan

## কী কী পরিবর্তন করা হবে:

১. **Frontend Setup (React + Vite)**
   - `npx create-vite` কমান্ডের মাধ্যমে `frontend` ডিরেক্টরি তৈরি করে React ও Vite সেটআপ করা হবে।
   - রাউটিং এবং এপিআই কলের জন্য `axios` এবং `react-router-dom` ইনস্টল করা হবে।

২. **Beautiful Login UI (লগইন পেজ ডিজাইন)**
   - `frontend/src/index.css` এবং `frontend/src/pages/Login.jsx` তৈরি করা হবে।
   - পিওর CSS ব্যবহার করে (Tailwind ছাড়া) একটি প্রিমিয়াম গ্লাসমরফিজম (Glassmorphism) ডিজাইনের লগইন পেজ তৈরি করা হবে।

৩. **API Connection (ব্যাকএন্ড কানেকশন)**
   - `frontend/src/utils/axios.js` ফাইলে Axios কনফিগার করা হবে।
   - `baseURL` হিসেবে `http://localhost:8080` এবং `withCredentials: true` দেওয়া হবে যেন Sanctum 쿠কি ঠিকমতো স্টোর হয়।

৪. **Backend Adjustments for SPA (ব্যাকএন্ড কনফিগারেশন)**
   - `backend/bootstrap/app.php`-তে `$middleware->statefulApi()` চালু করা হবে।
   - `backend/.env` ফাইলে `SANCTUM_STATEFUL_DOMAINS` এবং `SESSION_DOMAIN` ঠিক করে দেওয়া হবে যেন লোকালহোস্টে কোনো CORS Error না আসে।
