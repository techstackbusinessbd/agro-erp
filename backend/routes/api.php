<?php



/*
|--------------------------------------------------------------------------
| Enterprise API Route Registry
|--------------------------------------------------------------------------
| লারাভেল ১১ ডিফল্টভাবেই এই ফাইলের সব রাউটে 'api' প্রিফিক্স
| এবং 'api' মিডলওয়্যার যুক্ত করে দেয়।
*/

// ১. Core Module
require base_path('app/Modules/Core/routes/api.php');

// ২. HR Module (ভবিষ্যতের জন্য উদাহরণ)
// require base_path('app/Modules/HR/routes/api.php');

// ৩. Accounts Module (ভবিষ্যতের জন্য উদাহরণ)
// require base_path('app/Modules/Accounts/routes/api.php');
