import { type Editor } from "@tiptap/react";

import { Tooltip, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Toggle } from "../ui/toggle";
import { Bold } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    editor: Editor | null;
}
export function Menubar({ editor }: RichTextEditorProps) {
    if (!editor) {
        return null;
    }
    return (
        <div>
            <TooltipProvider>
                <div>
                    <Tooltip>
                        <TooltipTrigger>
                            <Toggle 
                              size="sm" 
                              pressed={editor.isActive("bold")} 
                              onPressedChange={() => editor.chain().focus().toggleBold().run()}
                              className={cn(
                                editor.isActive("bold") && 'bg-muted text-muted-foreground'
                              )}
                              >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
