<?php

use App\Article;
use App\Comment;

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

        $this->call('ArticlesTableSeeder');
		$this->call('CommentsTableSeeder');
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

class CommentsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $articleIds = Article::all()->lists('id');

        foreach (range(1, 200) as $index) {
            Comment::create([
                'name' => $faker->name,
                'content' => $faker->paragraph(2),
                'article_id' => $faker->randomElement($articleIds)
            ]);
        }
    }
}
