<?php

use App\Article;
use App\Comment;

$app->get('/articles', function() {
    $articles = Article::paginate();
    $articles->setPath('/articles');
    return $articles;
});

$app->get('/articles/{id}/comments', function($id) {
    $comments = Article::find($id)->comments()->paginate();
    $comments->setPath("/comments/{$id}");
    return $comments;
});

$app->get('/', function() {
    return view('index');
});

$app->get('/{id}', function($id) {
    return view('index');
});
