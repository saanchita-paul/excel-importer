<?php

namespace App\Services;

use App\Models\Person;
use Illuminate\Support\Facades\Validator;

class PersonImporter
{
    public array $failures = [];

    public function import(array $data, array $headers): void
    {
        foreach (array_slice($data, 1) as $index => $row) {
            $rowData = array_combine($headers, $row);

            if (empty(array_filter($rowData))) {
                continue;
            }

            $rowNumber = $index + 2;

            $validator = Validator::make($rowData, [
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|regex:/^[0-9\s\-\+\(\)]+$/',
                'gender' => 'required|in:M,F',
            ]);

            if ($validator->fails()) {
                $this->failures[] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->toArray(),
                    'data' => $rowData,
                ];
                continue;
            }

            Person::create($rowData);
        }
    }
}
