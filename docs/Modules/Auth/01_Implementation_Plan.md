# Auth মডিউল ইমপ্লিমেন্টেশন প্ল্যান (Implementation Plan)

## কী কী পরিবর্তন করা হবে:

১. **Auth Module (অথেনটিকেশন মডিউল)**
   - `app/Modules/Auth/Controllers/AuthController.php`: লগইন, লগআউট এবং প্রোফাইল দেখার জন্য এপিআই কন্ট্রোলার।
   - `app/Modules/Auth/Services/AuthService.php`: পাসওয়ার্ড চেক করা এবং লগইন টোকেন তৈরি করার লজিক।
   - `app/Modules/Auth/Requests/LoginRequest.php`: ফর্ম ভ্যালিডেশন (Email বা Username এবং Password)।
   - `app/Modules/Auth/routes/api.php`: API রাউটগুলো রেজিস্টার করা হবে।

২. **Sanctum ইন্টিগ্রেশন**
   - লারাভেলের `HasApiTokens` ട്രেইটটি ইউজারের মডেলে যুক্ত করা হবে।
