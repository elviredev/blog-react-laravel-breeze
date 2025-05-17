import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState } from "react";
import ApplicationLogoNav from "@/Components/ApplicationLogoNav";

const Nav = () => {
  const { auth } = usePage<PageProps>().props
  const [menuOpen, setMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false) // Pour l'animation

  /**
   * Fonction pour ouvrir le Menu Mobile
   */
  const handleOpenMenu = () => {
    setMenuOpen(true)
    setIsClosing(false)
  }

  /**
   * Fonction pour fermer le Menu Mobile
   * Le menu n’est supprimé du DOM qu’après 300ms, à la fin de l’animation
   */
  const handleCloseMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setMenuOpen(false)
      setIsClosing(false)
    }, 300) // même durée que l'animation
  }


  return (
    <nav className="bg-gray-50 shadow-md border-b border-b-cyan-700/40 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!menuOpen && (
        <div className="flex justify-between items-center h-16">
          {/* Logo + Nom app*/}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <ApplicationLogoNav />
            </Link>
            <span className="text-2xl font-beba-new tracking-wide text-cyan-600 pt-3">
              MyApp
            </span>
          </div>

          {/* Bouton Hamburger pour Mobile */}
          <div className="sm:hidden">
            <button
              onClick={handleOpenMenu}
              className="text-gray-600 focus:outline-none cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Liens Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            {auth.user ? (
              <Link
                href={route("dashboard")}
                className="btn-primary">
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  href={route("login")}
                  className="text-gray-600 hover:text-gray-900">
                  Connexion
                </Link>
                <Link
                  href={route("register")}
                  className="btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div
          className={`sm:hidden bg-gray-50 px-4 pt-4 pb-6 border-cyan-600/10
          transition-all duration-300 ease-in-out
          ${isClosing ? 'animate-slide-up' : 'animate-slide-down'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-beba-new tracking-wide text-cyan-600">MyApp</span>
            <button
              onClick={handleCloseMenu}
              className="text-gray-600 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {auth.user ? (
              <Link
                href={route("dashboard")}
                className="btn-primary"
              >
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  href={route("login")}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Connexion
                </Link>
                <Link
                  href={route("register")}
                  className="btn-primary"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
export default Nav
