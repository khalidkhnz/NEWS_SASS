"use client";

import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";
import hljs from "highlight.js";
import Quill, { Delta } from "quill";
import { Button } from "../ui/button";
import { useExtendedEffect } from "@/hooks/useExtendedEffect";

interface Props {
  initialDelta?: Delta | undefined;
  onSave: (delta: Delta) => void;
  onPreview: (delta: Delta) => void;
}

const QuillEditor = ({ initialDelta, onPreview, onSave }: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && toolbarRef.current && !quill) {
      const quillInstance = new Quill(editorRef.current, {
        modules: {
          syntax: {
            hljs,
          },
          toolbar: toolbarRef.current,
        },
        placeholder: "Compose an epic...",
        theme: "snow",
      });

      setQuill(quillInstance);
    }
  }, [quill]);

  useExtendedEffect({
    mode: "DEFAULT",
    exec(finish) {
      if (initialDelta && quill) {
        quill.setContents(initialDelta);
        finish();
      }
    },
    dependencies: [initialDelta, quill, { set: quill?.setContents }],
  });

  function handlePreview() {
    if (quill) {
      const contents = quill?.getContents();
      if (contents) {
        onPreview(contents);
      }
    }
  }

  function handleSave() {
    const content = quill?.getContents();
    if (content) onSave(content);
    else alert("No Content To Save");
  }

  function handleLog() {
    console.log(quill?.getContents());
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 p-2 items-center justify-end">
        <Button variant={"ghost"} className="w-[120px]" onClick={handleLog}>
          Log Content
        </Button>
        <Button variant={"ghost"} className="w-[120px]" onClick={handlePreview}>
          Preview
        </Button>
        <Button className="w-[120px]" onClick={handleSave}>
          Save
        </Button>
      </div>
      <div id="toolbar-container" ref={toolbarRef}>
        <span className="ql-formats">
          <select className="ql-font"></select>
          <select className="ql-size"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1"></button>
          <button className="ql-header" value="2"></button>
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-direction" value="rtl"></button>
          <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>

      <div
        ref={editorRef}
        id="editor"
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
      ></div>
    </div>
  );
};

export default QuillEditor;
