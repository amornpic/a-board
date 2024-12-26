'use client'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Post } from '@/types/post'
import { Badge } from './ui/badge'
import { MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useCallback, useEffect, useState } from 'react'
import { EditPostDialog } from './edit-post-dialog'
import { DeletePostDialog } from './delete-post-dialog'


interface PostsProps {
    posts: Post[]
    canEdit?: boolean
}
 
export default function Posts({ posts, canEdit }: PostsProps) {
  const postsData = posts
  const [deletePostOpen, setDeletePostOpen] = useState(false)
  const [editPostOpen, setEditPostOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const handleEditClick = (post: Post) => {
    setSelectedPost(post)
    setEditPostOpen(true)
  }

  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post)
    setDeletePostOpen(true)
  }

  const handleDeleteConfirm = useCallback( async () => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${selectedPost?.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: selectedPost?.user.id
            }),
        })
        setDeletePostOpen(false)
        location.reload();
    } catch (error) {
        throw error
    }
  }, [selectedPost])

  useEffect(() => {
    if (editPostOpen === false) {
        setSelectedPost(null)
    }
  }, [editPostOpen])

  useEffect(() => {
    if (deletePostOpen === false) {
        setSelectedPost(null)
    }
  }, [deletePostOpen])
    
  return (
    <div>
        {postsData.map((post) => (
          <article key={post.id} className="bg-white p-4 first:rounded-t-xl last:rounded-b-xl border-b border-slate-200">
            <div className="flex flex-row mb-2 justify-between">
                <div className="flex flex-row gap-2 mb-2 items-center">
                    <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${post.user.id}`} alt={post.user.username} />
                        <AvatarFallback>{post.user.username}</AvatarFallback>
                    </Avatar>
                    <p className="text-md text-muted-foreground mb-1">
                        {post.user.username}
                    </p>
                </div>
                { canEdit ? <div className="flex items-center gap-1">
                    <Button
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleEditClick(post)}
                    >
                    <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteClick(post)}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>: null}
            </div>
              <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <Badge variant="secondary" className="mb-2">{post.community}</Badge>
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold leading-tight mb-2 hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.body}
                  </p>
                </Link>
                <div className="mt-4 text-muted-foreground flex items-center">
                    <MessageCircle className='mr-2' />
                  <p className="text-sm">
                     {post.comments.length} Comments
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}

        {selectedPost && (
            <EditPostDialog
                open={editPostOpen}
                onOpenChange={setEditPostOpen}
                post={selectedPost}
            />
        )}

        <DeletePostDialog
            open={deletePostOpen}
            onOpenChange={setDeletePostOpen}
            onConfirm={handleDeleteConfirm}
        />
      </div>
  )
}