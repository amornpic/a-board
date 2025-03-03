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
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { enumToArray } from "@/lib/utils"
import { Community } from "@/enums/community"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/auth"
import { Post } from "@/types/post"

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
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

export function EditPostDialog({
  open,
  onOpenChange,
  post,
}: EditPostDialogProps) {
  const {user} = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      community: post.community,
      body: post.body,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: values.title,
            community: values.community,
            body: values.body,
            user_id: user?.id
          }),
        })

        location.reload();
        onOpenChange(false)
      } catch (error) {
        throw error
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="modal-modal-description">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
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
                                    {enumToArray(Community).map((value, index) => (
                                    <SelectItem key={index} value={value}>
                                        {value}
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
                    <Button type="submit">Edit</Button>
                </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

