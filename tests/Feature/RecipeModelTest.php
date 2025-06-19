<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class)->in(__DIR__);

test('recipes generate unique slugs when names are the same', function () {
    $recipe1 = \App\Models\Recipe::factory()->create(['name' => 'Chili Mac']);
    $recipe2 = \App\Models\Recipe::factory()->create(['name' => 'Chili Mac']);

    expect($recipe1->slug)->toBe('chili-mac');
    expect($recipe2->slug)->not->toBe('chili-mac');
    expect($recipe2->slug)->toStartWith('chili-mac');
});

