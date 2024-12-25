"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import notebookPic from '@/assets/images/notebook-signin.png'

const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

export default function SignInPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await login(values.username)
        router.push("/posts")
      } catch (error) {
        form.setError('username', { message: error.message })
      }
  }
  
  return (
    <div className="min-h-screen bg-[#1B4332] grid lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl font-semibold text-white">Sign in</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder="Username" {...field} className="h-12 bg-white border-0 text-base" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button 
                    type="submit" 
                    className="w-full h-12 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </Form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex items-center justify-center bg-[#2D6A4F]/10 relative">
        <div className="relative h-80">
          <Image
            src={notebookPic}
            alt="Notebook Illustration"
            className="center"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-8">
            <h2 className="text-3xl font-serif italic text-white text-center">
              a Board
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

