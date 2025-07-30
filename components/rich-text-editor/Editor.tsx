"use client";

import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './Menubar';
import { useEditor } from '@tiptap/react';
import TextAlign from "@tiptap/extension-text-align"
export function RichTextEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
        TextAlign
  });
  return (
    <div>
      <Menubar editor={editor} />
    </div>
  );
}
