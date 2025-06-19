<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\Filters\Filter;

class RecipeFuzzyFieldFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        if (Str::contains($property, '.')) { //handle nested relations
            [$relation, $column] = explode('.', $property);

            $query->whereHas($relation, function ($q) use ($column, $value) {
                $q->where($column, 'like', "%{$value}%");
            });
        } else {
            $query->where($property, 'like', "%{$value}%");
        }
    }
}
