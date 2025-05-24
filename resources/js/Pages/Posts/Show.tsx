import Nav from '@/Components/Nav'
import { ShowProps } from "@/types/post"
import { Head, Link, router } from "@inertiajs/react"
import { Heart, ChevronLeftCircle } from "lucide-react"


// @ts-ignore
const Show = ({auth, post}: ShowProps) => {

  /**
   * Gère l'action like pour un article
   * Vérifie si l'utilisateur est authentifié.
   * Si ce n'est pas le cas, redirige vers la page de connexion.
   **/
  const handleLike = () => {
    if (!auth.user) {
      window.location.href = route('login')
      return
    }

    router.post(route('posts.like', post.id), {}, {
      preserveScroll: true,
      preserveState: true
    })
  }

  console.log('POST => ', post)
  // @ts-ignore
  /**
   * Facilite la suppression d'un article.
   * Affiche une boîte de dialogue de confirmation avant de procéder à la suppression.
   * Si l'utilisateur confirme, la suppression est déclenchée par l'envoi d'une requête via le chemin
   * spécifié.
   */
  const handleDelete = (postId: number) => {
    if (confirm('Etes vous sur de vouloir supprimer cet article ?')) {
      router.delete(route('posts.destroy', postId))
    }
  }

  /**
   * Booléen permettant de déterminer si l'utilisateur est connecté et s'il peut modifier l'article
   */
  const canEdit = auth.user?.id === post.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={post.title} />
      <Nav />

      <div className="py-12">
        <article className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                {/* Retour sur page d'accueil */}
                <Link
                  href="/"
                  className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200"
                >

                  <div className="flex items-center">
                    <ChevronLeftCircle className="inline-block mr-1 w-5 h-5" />
                    <span>Retour</span>
                  </div>
                </Link>
                {/* Boutons Modifier et Supprimer */}
                {canEdit && (
                  <div className="flex gap-4">
                    <Link
                      href={route('posts.edit', post.id)}
                      className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              {/* Image de l'article */}
              {post.image && (
                <div className="mb-8">
                  <img
                    src={`/storage/${post.image}`}
                    alt={post.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}
              {/* Titre de l'article */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>

              {/* Contenu de l'article */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-4">
                  <span>Par {post.author.name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                {/* Bouton pour liker l'article + compteur de likes*/}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`transition-colors ${post.is_liked
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-500 hover:text-gray-600"}`}
                  >
                    <Heart

                      className="w6 h-6"
                      fill={post.is_liked ? "currentColor" : "none"}
                    />
                  </button>

                  <span className="text-gray-600">
                    {post.likes_count}
                  </span>
                </div>
              </div>

              <div className="prose max-with-none">
                <p className="text-gray-700">
                  {post.description}
                </p>
              </div>

            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
export default Show
