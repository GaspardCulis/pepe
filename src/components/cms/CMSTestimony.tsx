import { useState, useRef, useEffect } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const CMSTestimony = (props: { query: string, variables: object, data: any }) => {
  const { data } = useTina(props);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isOverflowing = contentRef.current?.scrollHeight! > contentRef.current?.clientHeight!;
    setOverflows(isOverflowing);
  }, []);

  return (
    <>
      <div
        className={`content border-b-2 px-16 py-8 text-center overflow-hidden max-h-[32rem] ${expanded ? "expanded" : ""} ${overflows ? "overflows" : ""}`}
        data-tina-field={tinaField(data.testimonies, "content")}
        ref={contentRef}
      >
        <TinaMarkdown
          content={data.testimonies.content}
        />
      </div>
      <div
        className="expand-wrapper w-full relative hidden -translate-y-10 cursor-pointer"
      >
        <div className="w-full absolute overflow-hidden flex justify-center">
          <div
            className="expand-text w-fit text-center rounded-full bg-slate-500 px-4 py-1 text-base text-slate-200 translate-y-10"
            onClick={() => setExpanded(!expanded)}
          >
            <label className="expand-text-closed pointer-events-none"
            >Voir plus</label
            >
            <label className="expand-text-opened pointer-events-none"
            >Voir moins</label
            >
          </div>
        </div>
      </div>
      <div className="author_info text-center mb-12 p-6">
        <h2
          className="author not-prose text-3xl font-bold"
          data-tina-field={tinaField(data.testimonies, "author")}
        >
          {data.testimonies.author}
        </h2>
        <p
          className="not-prose text-gray-500 text-sm"
          data-tina-field={tinaField(data.testimonies, "date")}
        >{data.testimonies.date ? new Date(data.testimonies.date).toLocaleDateString() : ""}</p>
      </div>
    </>
  );
};
