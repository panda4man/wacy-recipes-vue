<?php

use App\Http\Controllers\RecipeController;
use Illuminate\Support\Facades\Route;

Route::resource('recipes', RecipeController::class)
    ->only(['index', 'show']);
