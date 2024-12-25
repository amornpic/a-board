'use client'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Post } from '@/types/post'
import { Badge } from './ui/badge'
import { MessageCircle } from 'lucide-react'

 
export default function Posts({ posts }: { posts: Post[] }) {
  const postsData = posts
    
  return (
    <div>
        {postsData.map((post) => (
          <article key={post.id} className="bg-white p-4 first:rounded-t-xl last:rounded-b-xl border-b border-slate-200">
            <div className="flex flex-row items-center gap-2 mb-2">
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=2" alt={post.user.username} />
                    <AvatarFallback>{post.user.username}</AvatarFallback>
                </Avatar>
                <p className="text-md text-muted-foreground mb-1">
                    {post.user.username}
                </p>
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
      </div>
  )
}