"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm ${
          editor.isActive('bold') 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm ${
          editor.isActive('italic')
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded text-sm ${
          editor.isActive('underline')
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        U
      </button>
      <select
        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        className="bg-gray-700 text-white rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="#ffffff">White</option>
        <option value="#a855f7">Purple</option>
        <option value="#3b82f6">Blue</option>
        <option value="#22c55e">Green</option>
        <option value="#eab308">Yellow</option>
        <option value="#ef4444">Red</option>
      </select>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Placeholder.configure({
        placeholder: 'This will be displayed in your character card and influence search, it will not influence how your character responds.'
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-[150px] px-4 py-3 focus:outline-none',
      },
    },
  });

  return (
    <div className="bg-gray-700/50 rounded-lg border border-gray-600">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}