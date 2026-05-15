<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case COMPANY_ADMIN = 'company_admin';
    case MANAGER = 'manager';
    case STAFF = 'staff';
}
