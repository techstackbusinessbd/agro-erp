<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\LoginHistory;
use App\Modules\Auth\Resources\AuditLogResource;
use App\Modules\Auth\Resources\LoginHistoryResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    use ApiResponse;

    /**
     * Get list of audit logs.
     */
    public function auditLogs(Request $request): JsonResponse
    {
        if (!auth()->user()->hasRole('Super Admin') && !auth()->user()->can('audit.view')) {
            return $this->errorResponse('Unauthorized access to audit logs.', 403);
        }

        $query = AuditLog::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('auditable_type', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $logs = $query->paginate($request->integer('per_page', 15));

        return $this->successResponse([
            'data' => AuditLogResource::collection($logs->items()),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ]
        ], 'Audit logs retrieved successfully.');
    }

    /**
     * Get list of login history logs.
     */
    public function loginHistories(Request $request): JsonResponse
    {
        if (!auth()->user()->hasRole('Super Admin') && !auth()->user()->can('audit.view')) {
            return $this->errorResponse('Unauthorized access to login histories.', 403);
        }

        $query = LoginHistory::with('user')->orderBy('logged_in_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('user_agent', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $history = $query->paginate($request->integer('per_page', 15));

        return $this->successResponse([
            'data' => LoginHistoryResource::collection($history->items()),
            'meta' => [
                'current_page' => $history->currentPage(),
                'last_page' => $history->lastPage(),
                'per_page' => $history->perPage(),
                'total' => $history->total(),
            ]
        ], 'Login histories retrieved successfully.');
    }
}
