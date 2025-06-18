<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class RecipeFuzzyKeywordFilter implements Filter
{
    public function __invoke($query, $value, $property)
    {
        return $query->where(function (Builder $q) use ($value) {
            $q->where('name', 'like', "%$value%")
                ->orWhere('description', 'like', "%$value%")
                ->orWhereHas('ingredients', function ($q) use ($value) {
                    $q->where('name', 'like', "%$value%");
                })
                ->orWhereHas('steps', function ($q) use ($value) {
                    $q->where('description', 'like', "%$value%");
                });
        });
    }
}
