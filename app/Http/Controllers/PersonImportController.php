<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PersonImporter;
use App\Services\FailureExporter;
use Maatwebsite\Excel\Facades\Excel;

class PersonImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $data = Excel::toArray([], $request->file('file'))[0];
        $headers = array_map('strtolower', array_map('trim', $data[0]));

        $importer = new PersonImporter();
        $importer->import($data, $headers);

        $exporter = new FailureExporter();
        $downloadUrl = $exporter->export($importer->failures);

        return response()->json([
            'failures' => $importer->failures,
            'download_url' => $downloadUrl,
        ]);
    }
}
