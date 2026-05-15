# API Error Handling & Auth Testing Plan

## কী কী পরিবর্তন করা হবে:

১. **Global API Error Handling (গ্লোবাল এরর হ্যান্ডলিং)**
   - `bootstrap/app.php`-তে গ্লোবাল এক্সেপশন ইন্টারসেপ্ট করে আমাদের `ApiResponse` ফরম্যাটে রিটার্ন করা হবে।
   - হ্যান্ডেল করা এক্সেপশনগুলো:
     - `ValidationException` (422)
     - `AuthenticationException` (401)
     - `UnauthorizedException` (403) - Spatie-এর জন্য
     - `NotFoundHttpException` / `ModelNotFoundException` (404)
     - `Throwable` (500 Server Error)

২. **Pest Tests for Auth & Roles (লগইন এবং রোলের টেস্টিং)**
   - `tests/Feature/AuthApiTest.php`: ইমেইল/ইউজারনেম দিয়ে লগইন, লগআউট এবং ফেইলর টেস্ট।
   - `tests/Feature/UserRoleApiTest.php`: স্প্যাটি রোলের টেস্ট (যেমন: পারমিশন ছাড়া রিকোয়েস্ট পাঠালে 403 এরর আসা)।
