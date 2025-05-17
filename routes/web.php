<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Welcome - Page d'accueil
Route::get('/', [WelcomeController::class, 'index']);

// Posts en authentifié
Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
  Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
  Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
  Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
  Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
  Route::post('/posts/{post}/like', [PostController::class, 'like'])->name('posts.like');
});

// Posts en non authentifié
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
      'userPosts' => Auth::user()->posts()->with('author')->get()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile de l'utilisateur en authentifié
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
