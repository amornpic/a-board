import { User } from "./auth"
import { Comment } from "./comment"

export interface Post {
    id: number
    title: string
    body: string
    community: string
    user: User
    comments: Comment[]
    created_at: Date
    updated_at: Date
}