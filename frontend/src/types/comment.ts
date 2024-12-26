import { User } from "./auth"

export interface Comment {
    id: string
    massage: string
    user: User
    created_at: Date
    updated_at: Date
}