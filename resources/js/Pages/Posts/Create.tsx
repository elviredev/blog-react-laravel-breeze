import React, { useState, FormEvent } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { CreateProps, PostFormData, PostFormField } from '@/types/post'
import { Errors } from "@/types/post";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {Textarea} from "@/Components/ui/textarea";
import {Button} from "@/Components/ui/button";

const Create = ({}: CreateProps) => {

  const { data, setData: unsafeSetData, post, processing, errors: rawErrors, reset } = useForm<PostFormData>({
    title: '',
    description: '',
    image: null
  })

  // Recast propre de setData avec les bonnes clés
  const setData = unsafeSetData as (field: PostFormField, value: PostFormData[PostFormField]) => void
  // Cast de errors en rawErrors pour pouvoir utiliser le type Errors<PostFormData>
  const errors = rawErrors as Errors<PostFormData>

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  /**
   * Gère l'événement de modification d'un fichier image en entrée.
   * Lit le fichier sélectionné, met à jour l'état associé et crée une URL d'aperçu pour l'image.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // changer l'image si elle existe
      // @ts-ignore
      setData('image', file)
      // contruire l'url
      const reader = new FileReader()
      // mettre à jour le state
      reader.onloadend = ()=> {
        setPreviewUrl(reader.result as string)
      }
      // lire l'image
      reader.readAsDataURL(file)
    }
  }

  /**
   * Gère le processus de soumission du formulaire.
   *
   * @param {FormEvent<HTMLFormElement>} e - FormEvent est déclenché lors de la soumission.
   * Empêche le comportement par défaut de la soumission du form et lance
   * une requête POST sur la route spécifiée
   * Exécute les actions de réussite spécifiées, telles que la réinitialisation du form et la suppression de
   * l'URL d'aperçu, une fois la requête terminée.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('posts.store'), {
      onSuccess: () => {
        reset()
        setPreviewUrl('')
      }
    })
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Créer un article
        </h2>
      }
    >
      <Head title="Créer un article" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-beba-new tracking-wider font-extrabold text-gray-800">
                Créer un article
              </h2>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                  />
                  {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block pb-4 file file:cursor-pointer file:mr-4  file:rounded-md file:border-0 file:text-sm file: text-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 file:px-4"
                  />
                  {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="preview" className="max-h-48 rounded-md" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => window.history.back()}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={processing}
                  >
                    {processing ? 'Création...' : 'Créer l\'article'}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}
export default Create
