<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PersonImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');
        $data = Excel::toArray([], $file)[0];

        $headers = array_map('strtolower', array_map('trim', $data[0]));
        $failures = [];


        $emailsInFile = [];
        foreach (array_slice($data, 1) as $index => $row) {
            $insertData = [];

            $rowData = array_combine($headers, $row);

            if (empty(array_filter($rowData))) {
                continue;
            }

            $rowNumber = $index + 2;
            $email = $rowData['email'];

            $validator = Validator::make($rowData, [
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|regex:/^[0-9\s\-\+\(\)]+$/',
                'gender' => 'required|in:M,F',
            ]);

            if ($validator->fails()) {
                $failures[] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->toArray(),
                    'data' => $rowData,
                ];
                continue;
            }

            if (in_array($email, $emailsInFile)) {
                $failures[] = [
                    'row' => $rowNumber,
                    'errors' => ['email' => ['Duplicate email in file']],
                    'data' => $rowData,
                ];
                continue;
            }

            $emailsInFile[] = $email;

            if (Person::where('email', $email)->exists()) {
                $failures[] = [
                    'row' => $rowNumber,
                    'errors' => ['email' => ['The email has already been taken.']],
                    'data' => $rowData,
                ];
                continue;
            }

            $insertData[] = $rowData;
        }

        // Export failures to Excel
        $excelPath = null;
        if (count($failures)) {
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
            $excelPath = "public/exports/$filename";
            $writer = new Xlsx($spreadsheet);
            $dirPath = storage_path('app/public/exports');
            if (!is_dir($dirPath)) {
                mkdir($dirPath, 0755, true);
            }
            $writer->save(storage_path('app/' . $excelPath));
        }

        return response()->json([
            'failures' => $failures,
            'download_url' => $excelPath ? Storage::url($excelPath) : null,
        ]);

    }
}
