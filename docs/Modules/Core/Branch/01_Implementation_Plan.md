# Branch মডিউল ইমপ্লিমেন্টেশন প্ল্যান (Implementation Plan)

যেহেতু Branch ডাটাবেস মাইগ্রেশন সম্পন্ন হয়েছে, তাই আমরা Enterprise Agro ERP-এর নিয়ম মেনে Branch মডিউলের ফাইলগুলো তৈরি করব।

১. **Modular Monolith ও DDD:** সবগুলো ফাইল `app/Modules/Core` এর ভেতর রাখা হবে।
২. **Repository Pattern:** `Branch`-এর জন্য ইন্টারফেস এবং রিপোজিটরি ইমপ্লিমেন্ট করা হবে।
৩. **Service Layer:** `BranchService` ডাটাবেস ট্রানজেকশন (`DB::transaction()`) এবং বিজনেস লজিক হ্যান্ডেল করবে।
৪. **Thin Controller:** `BranchController` শুধুমাত্র HTTP রিকোয়েস্ট হ্যান্ডেল করবে এবং `BranchResource` রিটার্ন করবে।

## কী কী পরিবর্তন করা হবে:

### Core Module

#### [নতুন] `app/Modules/Core/Models/Branch.php`
- `HasUuids` এবং `SoftDeletes` ট্রেইট যোগ করা হবে।
- `$fillable` ফিল্ড: `company_id`, `name`, `code`, `is_active`।
- `company()` রিলেশনশিপ ডিফাইন করা হবে।

#### [নতুন] `app/Modules/Core/Interfaces/BranchRepositoryInterface.php`
- `EloquentRepositoryInterface` কে এক্সটেন্ড করবে।
- Covariant রিটার্ন টাইপ (`find(): ?Branch`, `create(): Branch`) যোগ করা হবে।

#### [নতুন] `app/Modules/Core/Repositories/BranchRepository.php`
- `BaseRepository` এক্সটেন্ড করবে এবং `BranchRepositoryInterface` ইমপ্লিমেন্ট করবে।
- কনস্ট্রাকটরে `Branch` মডেল ইনজেক্ট করা হবে।

#### [নতুন] `app/Modules/Core/Services/BranchService.php`
- `BranchRepositoryInterface` ইনজেক্ট করা হবে।
- `DB::transaction()` ব্যবহার করে `getAll()`, `store()`, `show()`, `update()`, এবং `destroy()` মেথড তৈরি করা হবে।

#### [নতুন] `app/Modules/Core/Requests/StoreBranchRequest.php`
- ভ্যালিডেশন রুলস: `company_id` (আবশ্যক, companies টেবিলে থাকতে হবে), `name` (একই কোম্পানির আন্ডারে ইউনিক হতে হবে), `code` (ইউনিক)।

#### [নতুন] `app/Modules/Core/Requests/UpdateBranchRequest.php`
- আপডেট করার সময় বর্তমান ব্রাঞ্চের আইডি বাদ দিয়ে ইউনিকনেস চেক করা হবে।

#### [নতুন] `app/Modules/Core/Resources/BranchResource.php`
- রেসপন্সের JSON ফরম্যাট ঠিক করা হবে। 

#### [নতুন] `app/Modules/Core/Controllers/BranchController.php`
- স্ট্যান্ডার্ড CRUD মেথড থাকবে।
- Constructor Property Promotion ব্যবহার করে `BranchService` ইনজেক্ট করা হবে।

#### [পরিবর্তন] `app/Providers/AppServiceProvider.php`
- `BranchRepositoryInterface` এর সাথে `BranchRepository` বাইন্ড করা হবে।
