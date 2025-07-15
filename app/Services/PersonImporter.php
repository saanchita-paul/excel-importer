<?php

namespace App\Services;

use App\Http\Requests\PersonRequest;
use App\Models\Person;
use Illuminate\Support\Facades\Validator;

class PersonImporter
{
    public array $failures = [];

    public function import(array $data, array $headers): void
    {
        $personRequest = new PersonRequest();
        $rules = $personRequest->rules();

        foreach (array_slice($data, 1) as $index => $row) {
            $rowData = array_combine($headers, $row);

            if (empty(array_filter($rowData))) {
                continue;
            }

            $rowNumber = $index + 2;

            $validator = Validator::make($rowData, $rules);


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
