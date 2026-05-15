# User মডিউল ইমপ্লিমেন্টেশন প্ল্যান (Implementation Plan)

## কী কী পরিবর্তন করা হবে:

১. **Database & Model Updates (ডাটাবেস ও মডেল আপডেট)**
   - `database/migrations/2026_05_15_090000_create_users_table.php`: ইউজারের `id` কে UUID করা হবে। সাথে `company_id`, `branch_id`, `role`, `username`, `phone` এবং `is_active` ফিল্ড যুক্ত করা হবে।
   - `app/Models/User.php`: মডেলটিতে `HasUuids`, `SoftDeletes` যুক্ত করা হবে। Company ও Branch এর সাথে রিলেশনশিপ দেওয়া হবে।

২. **User Management Module (ইউজার ম্যানেজমেন্ট CRUD)**
   - `UserRepositoryInterface` ও `UserRepository`: ইউজার ডাটাবেস অপারেশন হ্যান্ডেল করার জন্য রিপোজিটরি।
   - `UserService`: ইউজার তৈরি ও আপডেট করার সার্ভিস ক্লাস। পাসওয়ার্ড হ্যাশিং এখানে করা হবে।
   - `UserController`: API Controller।
   - `StoreUserRequest`, `UpdateUserRequest`, `UserResource`: ভ্যালিডেশন এবং এপিআই রেসপন্সের জন্য।
