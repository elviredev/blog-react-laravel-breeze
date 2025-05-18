import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {Post} from "@/types/post";
import {PageProps} from "@/types";
import ListPosts from "@/Components/Post/ListPosts";

interface Props extends PageProps{
  userPosts: Post[]
}

export default function Dashboard({userPosts}: Props) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Tableau de Bord
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="relative inline-block text-3xl font-beba-new tracking-wider font-extrabold text-gray-800">Mes publications</h2>

                  <Link
                    href={route('posts.create')}
                    className="btn-primary"
                  >
                    Créer un article
                  </Link>
                </div>

                {/* Liste des Posts */}
                {userPosts.length > 0 ? (
                  <ListPosts posts={userPosts} showAuthor={false} canEdit={true} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Vous n'avez pas encore de publications</p>
                    <Link
                      href={route('posts.create')}
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      Créer votre premier article
                    </Link>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
