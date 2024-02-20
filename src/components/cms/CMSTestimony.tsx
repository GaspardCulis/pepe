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

  const transformTransitionStyle = {
		transition: "transform 800ms ease-in-out",
		transitionDelay: "1s"
	};

  return (
    <>
      <div
        className={`border-b-2 px-16 py-8 text-center overflow-hidden max-h-[32rem] ${expanded ? "expanded" : ""} ${overflows ? "overflows" : ""}`}
        data-tina-field={tinaField(data.testimonies, "content")}
        ref={contentRef}
        style={
          expanded ? {
            maxHeight: "none"
          } : overflows ? {
            WebkitMaskImage: "linear-gradient(180deg, #000 80%, transparent)"
          } : {}
        }
      >
        <TinaMarkdown
          content={data.testimonies.content}
        />
      </div>
      <div
        className="w-full relative hidden -translate-y-10 cursor-pointer"
        style={
          overflows ? {
            display: "block"
          } : {}
        }
      >
        <div className="w-full absolute overflow-hidden flex justify-center">
          <div
            className="w-fit text-center rounded-full bg-slate-500 px-4 py-1 text-base text-slate-200 translate-y-10"
            onClick={() => setExpanded(!expanded)}
            style={
            overflows ? {
              transform: "translate(0rem)",
              ...transformTransitionStyle
            } : transformTransitionStyle
          }
          >
            <label
              className="pointer-events-none"
              style={
                expanded ? {
                  display: "none"
                } : {
                  display: "block"
                }
              }
            >Voir plus</label
            >
            <label
              className="pointer-events-none"
              style={
                expanded ? {
                  display: "block"
                } : {
                  display: "none"
                }
              }
            >Voir moins</label
            >
          </div>
        </div>
      </div>
      <div className="text-center mb-12 p-6">
        <h2
          className="not-prose text-3xl font-bold"
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
