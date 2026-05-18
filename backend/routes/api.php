<?php



/*
|--------------------------------------------------------------------------
| Enterprise API Route Registry
|--------------------------------------------------------------------------
| লারাভেল ১১ ডিফল্টভাবেই এই ফাইলের সব রাউটে 'api' প্রিফিক্স
| এবং 'api' মিডলওয়্যার যুক্ত করে দেয়।
*/

// ১. Auth Module
require base_path('app/Modules/Auth/routes/api.php');

// ২. Core Module
require base_path('app/Modules/Core/routes/api.php');

// ৩. Master Data Module
require base_path('app/Modules/MasterData/routes/api.php');

// ৪. Warehouse & Territory Module
require base_path('app/Modules/Warehouse/routes/api.php');

// ২. HR Module (ভবিষ্যতের জন্য উদাহরণ)
// require base_path('app/Modules/HR/routes/api.php');

// ৩. Accounts Module (ভবিষ্যতের জন্য উদাহরণ)
// require base_path('app/Modules/Accounts/routes/api.php');
