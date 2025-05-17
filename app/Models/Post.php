<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
  /** @use HasFactory<UserFactory> */
  use HasFactory;

  protected $fillable = [
    'title',
    'description',
    'image',
    'user_id',
  ];

  protected $appends = ['is_liked', 'likes_count'];

  protected $with = ['likedBy'];

  /**
   * Define a relationship to the User model as the author of a given resource.
   * A post can only belong to one author
   * @return BelongsTo
   */
  public function author(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  /**
   * A post can be liked by multiple users
   * cette relation permet de retrouver tous les users qui ont liké ce post
   * retourne une collection d'objets utilisateurs
   * @return BelongsToMany
   */
  public function likedBy(): BelongsToMany
  {
    return $this->belongsToMany(User::class, 'post_likes');
  }

  /**
   * Assesseur: permet de définir un attribut personnalisé pour ce model
   * Return true si le user connecté a déja liké ce post
   * @return bool
   */
  public function getIsLikedAttribute(): bool
  {
    return Auth::check() && $this->likedBy->contains('id', Auth::id());
  }

  /**
   * Assesseur: retourne le nombre d'utilisateurs ayant aimé ce post
   * @return int
   */
  public function getLikesCountAttribute(): int
  {
    return $this->likedBy->count();
  }


}
