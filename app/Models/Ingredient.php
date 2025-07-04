<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // ---- Relationships ----

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
