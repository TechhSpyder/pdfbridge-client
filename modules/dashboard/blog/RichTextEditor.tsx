"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { common, createLowlight } from "lowlight";
import React, { useState } from "react";
import { Dialog } from "@/modules/app/dialog";
import { Button } from "@/modules/app/button";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Code as CodeIcon,
  Trash2,
  Undo,
  Redo,
  Minus,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
} from "lucide-react";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({
  onClick,
  active = false,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      active
        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
        : "bg-transparent text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline underline-offset-4 cursor-pointer",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-blue max-w-none focus:outline-none min-h-[400px] p-6 text-slate-300",
      },
    },
  });

  const handleLinkConfirm = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  const openLinkDialog = () => {
    if (editor) {
      setLinkUrl(editor.getAttributes("link").href || "");
      setIsLinkDialogOpen(true);
    }
  };

  if (!editor) return null;

  return (
    <div className="w-full bg-black/20 border border-white/5 rounded-2xl focus-within:border-blue-500/30 transition-all">
      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        url={linkUrl}
        setUrl={setLinkUrl}
        onConfirm={handleLinkConfirm}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900/50 border-b border-white/5 sticky top-0 z-10">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </MenuButton>

        <div className="w-px h-6 bg-white/5 mx-1" />

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </MenuButton>

        <div className="w-px h-6 bg-white/5 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </MenuButton>

        <div className="w-px h-6 bg-white/5 mx-1" />

        <MenuButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <TableIcon size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <CodeIcon size={16} />
        </MenuButton>
        <MenuButton
          onClick={openLinkDialog}
          active={editor.isActive("link")}
          title="Link"
        >
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter size={16} />
        </MenuButton>

        <div className="w-px h-6 bg-white/5 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </MenuButton>

        {editor.isActive("table") && (
          <>
            <div className="w-px h-6 bg-white/5 mx-1" />
            <MenuButton
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add Column Before"
            >
              <TableIcon size={14} className="rotate-90 opacity-50" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Column After"
            >
              <TableIcon size={14} className="rotate-270 opacity-100" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add Row Before"
            >
              <TableIcon size={14} className="rotate-270 opacity-100" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row After"
            >
              <TableIcon size={14} className="rotate-270 opacity-100" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              <Trash2 size={14} className="text-red-500/50" />
            </MenuButton>
          </>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
        }
        .ProseMirror pre {
          background: #0d1117;
          border-radius: 0.5rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          margin: 2.5rem 0;
        }
        .ProseMirror mark {
          background-color: rgba(59, 130, 246, 0.3);
          color: inherit;
          padding: 0 0.2rem;
          border-radius: 0.2rem;
        }
      `}</style>
    </div>
  );
}

function LinkDialog({
  open,
  onOpenChange,
  url,
  setUrl,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  setUrl: (url: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Insert Link</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="items-start gap-4">
          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              URL
            </label>
            <input
              autoFocus
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
              className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="https://example.com"
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className="gap-3">
          <Dialog.Close>
            <Button variant="secondary" className="h-11 px-6">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={onConfirm}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/20"
          >
            Apply
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
