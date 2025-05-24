<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
  /**
   * Permettre à un utilisateur authentifié d'accèder à la page de création d'un post
   * @return Response
   */
  public function create(): Response
  {
    if (!Auth::check()) {
      abort(403, "Non Autorisé");
    }
    return Inertia::render('Posts/Create');
  }

  /**
   * Permet d'enregistrer un nouveau post et de l'enregistrer dans la base de données
   * @param Request $request
   * @return RedirectResponse
   */
  public function store(Request $request)
  {
    if (!Auth::check()) {
      abort(403, "Non Autorisé");
    }

    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'description' => 'required|string',
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $post = Post::create([
      'title' => $validated['title'],
      'description' => $validated['description'],
      'user_id' => Auth::id(),
    ]);

    if ($request->hasFile('image')) {
      $path = $request->file('image')->store('posts', 'public');
      $post->image = $path;
    }

    $post->save();

    return redirect()->route('dashboard')->with('success', 'Post créé avec succès.');

  }

  /**
   * Permet d'afficher un post
   * @param Post $post
   * @return Response
   */
  public function show(Post $post): Response
  {
    return Inertia::render('Posts/Show', [
      'post' => $post->load('author')
    ]);
  }

  /**
   * Permet de modifier un post
   * @param Post $post
   * @return Response
   */
  public function edit(Post $post): Response
  {
    return Inertia::render('Posts/Edit', [
      'post' => $post
    ]);
  }

  /**
   * Met à jour un post existant avec les nouvelles données fournies et les enregistre dans la base de données
   * @param Request $request
   * @param Post $post
   * @return RedirectResponse
   */
  public function update(Request $request, Post $post)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'description' => 'required|string',
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $post->title = $validated['title'];
    $post->description = $validated['description'];

    if ($request->hasFile('image')) {
      if ($post->image) {
        Storage::disk('public')->delete($post->image);
      }

      $path = $request->file('image')->store('posts', 'public');
      $post->image = $path;
    }

    $post->save();

    return redirect()->route('dashboard')->with('success', 'Post mis à jour avec succès.');
  }

  /**
   * Supprime un post existant ainsi que l'image associée, si elle existe, de la base de données et du stockage.
   * @param Post $post
   * @return RedirectResponse
   */
  public function destroy(Post $post)
  {
    if ($post->image) {
      Storage::disk('public')->delete($post->image);
    }

    $post->delete();
    return redirect()->route('dashboard')->with('success', 'Article supprimé avec succès.');
  }

  /**
   * Gère l'ajout ou la suppression d'un like pour un post.
   * Si l'utilisateur a déjà aimé le post, le like est retiré, sinon il est ajouté.
   *
   * @param Post $post
   * @return RedirectResponse
   */
  public function like(Post $post)
  {
    $user = Auth::user();

    if ($post->likedBy()->where('user_id', $user->id)->exists()) {
      $post->likedBy()->detach($user->id);
      $message = "Like retiré sur le Post";
    } else {
      $post->likedBy()->attach($user->id);
      $message = "Post liké";
    }

    return redirect()->back()->with('success', $message);
  }
}
