<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FailureExporter
{
    public function export(array $failures): ?string
    {
        if (count($failures) === 0) {
            return null;
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray(['Row', 'Name', 'Email', 'Phone', 'Gender', 'Errors'], null, 'A1');

        foreach ($failures as $i => $fail) {
            $row = $fail['row'];
            $errors = collect($fail['errors'])->map(fn($v, $k) => "$k: " . implode(', ', $v))->implode(' | ');

            $sheet->fromArray([
                $row,
                $fail['data']['name'] ?? '',
                $fail['data']['email'] ?? '',
                $fail['data']['phone'] ?? '',
                $fail['data']['gender'] ?? '',
                $errors,
            ], null, 'A' . ($i + 2));
        }

        $filename = 'failures_' . Str::random(8) . '.xlsx';
        $path = "public/exports/$filename";
        $dir = storage_path('app/public/exports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        (new Xlsx($spreadsheet))->save(storage_path("app/$path"));

        return Storage::url($path);
    }
}
