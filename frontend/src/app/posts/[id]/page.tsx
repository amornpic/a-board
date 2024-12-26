"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useAuth } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { Post } from "@/types/post"
import { TimeAgo } from "@/components/time-ago"

export default function PostDetail() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const getPost = async () => {
      const response  = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${params.id}`)
        .then((response) => response.json())
      setPost(response) 
    }

    if (params) {
      getPost()
    }

    }, [params])

  const handleAddComment = async () => {
    setShowCommentForm(true)
  }

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return
    setIsSubmitting(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: params.id,
          massage: newComment,
          user_id: user?.id
        }),
      })

      setNewComment("")
      setShowCommentForm(false)

      location.reload()
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/posts"
        className="inline-flex items-center justify-center w-12 h-12 mb-8 rounded-full bg-[#E5F6F0] hover:bg-[#d0f0e4] transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-[#1B4332]" />
      </Link>

      <article className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${post?.user.id}`} alt={post?.user.username} />
              <AvatarFallback>{post?.user.username}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="font-medium">{post?.user.username}</div>
            {post?.created_at && <div className="text-sm text-muted-foreground"><TimeAgo date={new Date(post?.created_at)} /></div>}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">{post?.community}</div>
          <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
          <p className="text-muted-foreground leading-relaxed">
            {post?.body}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{post?.comments.length} Comments</span>
        </div>

        {!showCommentForm && <Button
          variant="outline"
          color="green"
          className={cn(
            "w-32 h-10",
            !showCommentForm && "mb-8"
          )}
          onClick={handleAddComment}
          disabled={!user}
        >
          Add Comments
        </Button>}

        {showCommentForm && (
          <div className="space-y-4 mt-4 mb-8">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false)
                  setNewComment("")
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                Reply
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {post?.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${comment.user.id}`}alt={comment.user.username} />
                <AvatarFallback>{comment.user.username}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium">{comment.user.username}</span>
                  <span className="text-sm text-muted-foreground"><TimeAgo date={new Date(comment.created_at)} /></span>
                </div>
                <p className="text-muted-foreground">{comment.massage}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}