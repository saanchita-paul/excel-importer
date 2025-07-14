<?php

use App\Http\Controllers\PersonImportController;
use Illuminate\Support\Facades\Route;

Route::post('/import-matches', [PersonImportController::class, 'import']);
