<?php

use App\Article;

use Faker\Factory as Faker;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		Article::truncate();

		$this->call('ArticlesTableSeeder');
	}
}

class ArticlesTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 100) as $index) {
            Article::create([
                'title' => $faker->sentence(5),
                'content' => $faker->paragraph(5)
            ]);
        }
    }
}
