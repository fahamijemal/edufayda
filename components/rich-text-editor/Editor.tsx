"use client";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './Menubar';

export function RichTextEditor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });
    return (
        <div className="border rounded-md p-4">
            <Menubar editor={editor} />
            <div className="mt-2">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}