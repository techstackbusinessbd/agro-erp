# Spatie Roles & Permissions Implementation Plan

## কী কী পরিবর্তন করা হয়েছে:

১. **Package Installation (প্যাকেজ ইনস্টল)**
   - `spatie/laravel-permission` প্যাকেজ ইনস্টল করা হয়েছে।

২. **Config & Migration Setup (কনফিগারেশন এবং মাইগ্রেশন)**
   - `config/permission.php` এবং স্প্যাটির মাইগ্রেশন পাবলিশ করা হয়েছে।
   - **গুরুত্বপূর্ণ:** আমাদের `users` টেবিলের আইডি যেহেতু UUID, তাই মাইগ্রেশন ফাইলে `$table->unsignedBigInteger('model_id')` এর বদলে `$table->uuid('model_morph_key')` সেট করা হয়েছে।

৩. **Model Update (মডেল আপডেট)**
   - `app/Models/User.php` মডেলে স্প্যাটির `HasRoles` ট্রেইট যুক্ত করা হয়েছে।

৪. **Seeder Creation (সিডার তৈরি)**
   - `RolesAndPermissionsSeeder.php` তৈরি করা হয়েছে।
   - ডিফল্ট রোলগুলো (super_admin, company_admin, manager, staff) তৈরি করে পারমিশন অ্যাসাইন করা হয়েছে।
   - `UserFactory` তে `username` ফিল্ডটি ফিক্স করে নতুন করে സീডিং করা হয়েছে।
