import React, {useState} from 'react'
import {Post, Props} from "@/types/post";
import {router, usePage, Link} from "@inertiajs/react";
import {PageProps} from "@/types";
import {Card, CardContent, CardFooter, CardHeader} from "@/Components/ui/card";
import {Button} from "@/Components/ui/button";
import {EditIcon, Eye, Heart, Trash} from "lucide-react";

const ListPosts = ({posts, showAuthor = true} : Props) => {
  const { auth } = usePage<PageProps>().props
  const [ deletingId, setDeletingId ] = useState<number | null>(null)

  /**
   * Gère la suppression d'un article spécifique.
   * @param {number} postId
   * Confirme l'intention de l'utilisateur de supprimer la publication, définit un state de suppression
   * temporaire, et communique avec le serveur pour supprimer la publication.
   * En cas de suppression réussie, efface le state de suppression. En cas d'erreur, efface le state de
   * suppression et avertit l'utilisateur de l'échec.
   */
  const handleDelete = (postId: number) => {
    if (confirm('Etes-vous sûr de vouloir supprimer ce post ?')) {
      setDeletingId(postId)
      router.delete(route('posts.destroy', postId), {
        onSuccess: () => {
          setDeletingId(null)
        },
        onError: () => {
          setDeletingId(null)
          alert('Une erreur s\'est produite lors de la suppression du post')
        }
      })
    }
  }

  /**
   * Envoie une requête POST vers une route Laravel (`posts.like`) pour "liker" un post.
   * Elle ne recharge pas la page, ne scroll pas vers le haut, et garde l'état du composant inchangé.
   * @param postId
   */
  const handleLike = (postId: number) => {
    router.post(route('posts.like', postId), {}, {
      preserveScroll: true,
      preserveState: true
    })
  }

  /**
   * Détermine si l'utilisateur actuellement authentifié est autorisé à modifier post.
   * Cette fonction compare l'identifiant de l'utilisateur actuellement authentifié à celui de l'utilisateur
   * qui a créé la publication.  Si les deux identifiants correspondent,
   * elle renvoie « true », indiquant que l'utilisateur peut modifier le post.
   * Sinon, elle renvoie « false ».
   * @param {Post} post
   * @returns {boolean}
   */
  const canEditPost = (post: Post): boolean => {
    return auth.user?.id === post.user_id
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post)  => (
        <Card key={post.id} className="overflow-hidden">
          {post.image && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                className="object-cover w-full h-full"
                src={`/storage/${post.image}`}
                alt={post.title}
              />
            </div>
          )}

          <CardHeader>
            <h3 className="text-xl text-gray-800 font-semibold">{post.title}</h3>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 line-clamp-3 mb-4">{post.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              {showAuthor && (
                <span>Par {post.author.name}</span>
              )}
              <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            {/* Bouton pour les likes */}
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                className={`transition-colors ${post.is_liked
                          ? "text-red-600 hover;text-red-700"
                          : "text-gray-600 hover:text-gray-700"}
                `}
                size="icon"
                onClick={() => handleLike(post.id)}>
                <Heart className="h-6 w-6" fill={post.is_liked ? "currentColor" : "none"}/>
              </Button>
              <span className="text-gray-600">{post.likes_count}</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Bouton pour être dirigé vers la page single */}
              <Button variant="link" asChild>
                <Link href={route('posts.show', post.id)}>
                  <Eye />
                </Link>
              </Button>

              {canEditPost(post) && (
                <>
                  {/* Bouton pour être dirigé vers la page d'édition */}
                  <Button variant="ghost" asChild>
                    <Link href={route('posts.edit', post.id)}>
                      <EditIcon />
                    </Link>
                  </Button>

                  {/* Bouton pour suppression du post */}
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    asChild
                  >
                    <Link href={route('posts.destroy', post.id)}>
                      <Trash />
                    </Link>
                  </Button>
                </>
              )}
            </div>

          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
export default ListPosts
