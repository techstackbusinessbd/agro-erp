<?php

namespace App\Traits;

trait ApiResponse
{
    /**
     * Build a success response
     */
    public function successResponse($data, $message = null, $code = 200)
    {
        return response()->json([
            'status'  => 'Success',
            'message' => $message,
            'data'    => $data
        ], $code);
    }

    /**
     * Build an error response
     */
    public function errorResponse($message, $code = 400)
    {
        return response()->json([
            'status'  => 'Error',
            'message' => $message,
            'data'    => null
        ], $code);
    }
}
