export interface User {
    id: number
    username: string
    avatar?: string
}
  
export interface AuthState {
    user: User | null
    isLoading: boolean
}
  
  