import { Textarea } from "@/components/ui/textarea"

export default function Editor({ id, setMarkdown }: { id: string, setMarkdown: (markdown: string) => void }) {
    return <Textarea onChange={(e) => {
        setMarkdown(e.target.value)
    }} id={id} className="min-h-[40rem]" placeholder="create your post here" />
}
