<?php

namespace Database\Factories;

use App\Modules\Core\Models\Branch;
use App\Modules\Core\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class BranchFactory extends Factory
{
    protected $model = Branch::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => $this->faker->city() . ' Branch',
            'code' => $this->faker->unique()->bothify('BR-####'),
            'is_active' => true,
        ];
    }
}
