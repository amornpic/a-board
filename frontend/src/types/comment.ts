import { User } from "./auth"

export interface Comment {
    id: string
    massage: string
    user: User
}