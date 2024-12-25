"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityOptions?: string[]
}

const formSchema = z.object({
    title: z.string().min(5, {
      message: "title must be at least 5 characters.",
    }),
    community: z.string().min(2, {
      message: "community must be at least 2 characters.",
    }),
    body: z.string().min(20, {
      message: "Message must be at least 20 characters.",
    }).max(250, {
        message: "Message must be at most 250 characters.",
    }),
  })

export function CreatePostDialog({ open, onOpenChange, communityOptions }: CreatePostDialogProps) {
    const {user} = useAuth()
    const router = useRouter();
    // const [communities, setCommunities] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          community: "",
          body: "",
        },
      })
      
      const communities = useMemo(() => {
        if (communityOptions && communityOptions?.length > 0) {
          return communityOptions
        } else {
         return
        }
      }, [communityOptions])
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: values.title,
                community: values.community,
                body: values.body,
                user_id: user?.id
              }),
            })
      
            const post = await response.json()
            console.log('post', post);
            router.refresh()
            onOpenChange(false)
          } catch (error) {
            throw error
          }
      }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="community"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a community" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {communities?.length && communities.map((community, index) => (
                                    <SelectItem key={index} value={community}>
                                        {community}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Title" {...field} className="space-y-2"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea placeholder="What's on your mind..." {...field} className="space-y-2"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">Post</Button>
                </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

