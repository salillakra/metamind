'use server'

import { connectDB } from "@/db/connect"
import { PostModel } from "@/db/post"

export const CreatePost = async ({ title, category, _id }: { title: string, category: string, _id: string }) => {
    try {
        await connectDB()
        const post = new PostModel({
            authorId: _id,
            title: title,
            category: category,
        })

        // Save the post to the database
        await post.save();
        return ({ success: true })
    } catch (error) {
        console.error(error)
        return ({ success: false, error: 'Failed to create post' })
    }
}