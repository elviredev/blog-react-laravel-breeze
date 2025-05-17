import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Nav from "@/Components/Nav";
import {Post} from "@/types/post";
import ListPosts from "@/Components/Post/ListPosts";

const Welcome = ({ auth, posts, canRegister } : PageProps<{posts: Post[], canRegister: boolean}>) => {
  return (
    <>
      <Head title="Accueil" />
      <div className="min-h-screen">
        <Nav />

        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1
                className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl space-y-4"
              >
                <span className="block">Bienvenue sur</span>
                <span className="block text-cyan-700">Mon Blog Voyages</span>
              </h1>

              <p className="mt-6 max-w-md mx-auto text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid commodi dicta est ex impedit laborum officiis porro quam quod temporibus!
              </p>

              {/* Su Utilisateur non connecté ET peut s'inscrire */}
              {!auth.user && canRegister && (
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <Link
                      href={route("register")}
                      className="btn-primary text-lg shadow-md">
                      Commencer
                    </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h2
              className="relative inline-block text-4xl font-beba-new tracking-wider font-extrabold text-gray-800"
            >
              <span className="heading">
                Articles récents
              </span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl">
              Les derniers articles publiés sur notre blog
            </p>
          </div>

          <ListPosts posts={posts} />
        </div>
      </div>
    </>
  )
}
export default Welcome
