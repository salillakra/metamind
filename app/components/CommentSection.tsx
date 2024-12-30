import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Heart } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


const FormSchema = z.object({
    comment: z.string().nonempty("Comment is required"),
})


function onSubmit(data: z.infer<typeof FormSchema>) {

    console.log(data)
}

const commentcomp = () => {


    return (
        <div>
            <article className="p-6 text-base bg-white rounded-lg shadow-md dark:bg-primary-foreground">
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <img
                            className="mr-2 w-8 h-8 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                            alt="Michael Gough"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Michael Gough</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <time dateTime="2022-02-08" title="February 8th, 2022">Feb. 8, 2022</time>
                            </p>
                        </div>
                    </div>
                </footer>
                <p className="text-gray-700 dark:text-gray-300">
                    Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                    instruments for the UX designers. The knowledge of the design tools are as important as the
                    creation of the design strategy.
                </p>
                <div className="flex items-center mt-4 space-x-4">
                    <button
                        type="button"
                        className="flex items-center text-sm text-red-600 hover:underline dark:text-blue-400 font-medium"
                    >

                        <Heart size={30} className="w-4 text-red-500  h-4 mr-1" />
                    </button>
                </div>
            </article>

        </div>
    )
}

function CommentSection(props: any) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })
    return (
        <div className='flex justify-center mt-10'>
            <div className='container'>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Comments
                </h2>

                <div className='flex mt-10 flex-col mx-5 items-center justify-center '>
                    <div className="md:w-1/2 w-[90%] ">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write a comment..."
                                                    className="min-h-40"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">
                                    Post Comment
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>

                <div className="mt-10 max-w-2xl mx-auto grid gap-5">
                    {commentcomp()}
                    {commentcomp()}
                    {commentcomp()}
                </div>
            </div>
        </div>
    )
}

export default CommentSection