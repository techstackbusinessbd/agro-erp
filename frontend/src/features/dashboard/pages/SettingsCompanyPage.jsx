import React from 'react';
import { Building } from 'lucide-react';

export default function SettingsCompanyPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
            <Building className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Company Information</h2>
            <p className="text-center max-w-md">
                This module is currently under development. Here you will be able to manage your enterprise company details, tax information, and branding.
            </p>
        </div>
    );
}
