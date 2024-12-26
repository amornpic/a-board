'use client'

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CreatePostDialog } from "@/components/create-post-dialog"
import Posts from "@/components/posts"
import { Post } from "@/types/post"
import { useAuth } from "@/context/auth"
import { Community } from "@/enums/community"
import { enumToArray } from "@/lib/utils"

export default function PostsPage() {
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [communityFilter, setCommunityFilter] = useState<string>('')

  const { user } = useAuth()

  useEffect(() => {
    const getPosts = async (user_id: number) => {
      const response  = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts?user_id=${user_id}`)
        .then((response) => response.json())
      setPosts(response) 
    }
    
    if (user) {
      getPosts(user.id)
    }
    
    }, [user])

    const filteredPosts = useMemo(() => {
        let filteredPosts = posts

        if (searchText.length > 1) {
            filteredPosts = filteredPosts.filter((post) => post.title.toLowerCase().includes(searchText.toLowerCase()))
        }

        if (communityFilter) {
            filteredPosts = filteredPosts.filter((post) => post.community === communityFilter)
        }

        return filteredPosts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    }, [searchText, posts, communityFilter])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <Input 
            type="search" 
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
            <Select onValueChange={setCommunityFilter}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {enumToArray(Community).map((community, index) => (
                            <SelectItem key={index} value={community}>{community}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button onClick={() => setCreatePostOpen(true)} disabled={!user} className="whitespace-nowrap">
                Create +
            </Button>
        </div>
      </div>

      <Posts posts={filteredPosts} canEdit />

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </div>
  )
}


