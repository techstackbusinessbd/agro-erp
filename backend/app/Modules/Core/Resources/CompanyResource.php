<?php

namespace App\Modules\Core\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'address'    => $this->address,
            'logo'       => $this->logo,
            // Enum থেকে শুধু string ভ্যালুটা ফ্রন্টএন্ডে পাঠাচ্ছি
            'status'     => $this->status?->value ?? $this->status,
            'currency'   => $this->currency,
            'timezone'   => $this->timezone,
            // সময়টাকে সুন্দর ফরম্যাটে পাঠাচ্ছি
            'created_at' => $this->created_at?->format('Y-m-d h:i A'),
        ];
    }
}
