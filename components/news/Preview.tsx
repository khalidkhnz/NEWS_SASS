"use client";

import { Delta } from "quill";
import { parseQuillDelta, TextRun } from "quilljs-parser";
import React from "react";

const Preview = ({ delta }: { delta?: Delta }) => {
  try {
    return (
      <div
        style={{
          color: "black",
          padding: "10px",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {delta &&
          parseQuillDelta(delta)?.paragraphs?.map((paragraph, idx) => {
            const textRun = paragraph.textRuns as ParagraphType[] | undefined;
            const embed = paragraph.embed;
            const attributes = paragraph?.attributes || {};

            const headerStyles = {
              1: "33px",
              2: "25px",
              3: "15px",
            };

            return (
              <span
                key={`paragraph-${idx}`}
                style={{
                  width: "100%",
                  fontSize:
                    headerStyles[
                      attributes?.header as keyof typeof headerStyles
                    ] || headerStyles[3],
                  textAlign: attributes?.align || "left",
                  ...(attributes.blockquote
                    ? {
                        padding: "5px",
                      }
                    : {}),
                }}
              >
                {textRun && parseQuillText(textRun)}
                {embed?.image && <img src={embed.image} alt={`image-${idx}`} />}
              </span>
            );
          })}
      </div>
    );
  } catch (error) {
    console.log({ error });
    return <h3 className="text-black">Error While Generating Preview</h3>;
  }
};

type ParagraphType = TextRun;

function parseQuillText(textRuns: ParagraphType[]) {
  return (
    <React.Fragment>
      {textRuns?.map((textRun, idx) => {
        const text = textRun?.text;
        const attributes = textRun?.attributes || {};

        return (
          <React.Fragment key={`text-run-${idx}-${text}`}>
            <span
              style={{
                textWrap: "wrap",
                fontWeight: attributes?.bold ? "bold" : "normal",
                fontStyle: attributes?.italic ? "italic" : "normal",
                textDecoration: attributes?.underline
                  ? "underline"
                  : attributes?.strike
                  ? "line-through"
                  : "none",
                color: attributes?.color || "inherit",
                backgroundColor: attributes?.background || "transparent",
                verticalAlign: attributes?.script || "baseline",
              }}
            >
              {text}
            </span>
          </React.Fragment>
        );
      })}
      <br />
    </React.Fragment>
  );
}

export default Preview;
