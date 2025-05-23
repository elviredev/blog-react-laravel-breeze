import {PageProps} from "@/types/index"

export interface Author {
  id: number
  name: string
}

export interface Post {
  id: number
  title: string
  description: string
  image: string | null
  created_at: string
  author: Author
  is_liked: boolean
  likes_count: number
  user_id: number
}

export interface PostFormData {
  [key: string]: string | File | null // requis pour FormDataType
  title: string
  description: string
  image: File | null
}

// Helper pour typer correctement setData
export type PostFormField = keyof PostFormData

export type Errors<T> = {
  [K in keyof T]?: string
}

export interface DashboardProps extends PageProps {
  userPosts: Post[]
}

export interface CreateProps extends PageProps {}

export interface EditProps extends PageProps {
  post: Post
}

export interface ShowProps extends PageProps {
  post: Post
}

export interface Props {
  posts: Post[]
  showAuthor?: boolean
  canEdit?: boolean
}
