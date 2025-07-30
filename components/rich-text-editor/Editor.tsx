"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from './Menubar';

export function RichTextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    immediatelyRender: false, // This fixes the SSR error
    content: '<p>Start writing your course description...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  if (!editor) {
    return (
      <div className="border rounded-lg">
        <div className="border-b p-2 bg-muted/50 animate-pulse h-12"></div>
        <div className="min-h-[200px] p-4 space-y-2">
          <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Menubar editor={editor} />
      <EditorContent editor={editor} className="border-t" />
    </div>
  );
}
