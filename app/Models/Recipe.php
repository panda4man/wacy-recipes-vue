<?php

namespace App\Models;

use App\Actions\GenerateUniqueRecipeSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'author_email',
        'slug',
    ];

    // ---- Relationships ----

    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(Step::class)->orderBy('order');
    }

    // ---- Meta ----

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // ---- Bootstrapping ----

    protected static function booted(): void
    {
        static::creating(function (Recipe $recipe) {
            $slug = (new GenerateUniqueRecipeSlug())->handle($recipe->name);
            $recipe->slug = $slug;
        });
    }
}
