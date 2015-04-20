<?php

use App\Article;

$app->get('/', function() {
    return view('index');
});

$app->get('articles', function() {
    $articles = Article::paginate();
    $articles->setPath('/articles');
    return $articles;
});

