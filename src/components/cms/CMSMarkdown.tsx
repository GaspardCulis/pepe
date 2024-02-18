import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const CMSMarkdown = (props: { query: string, variables: object, data: any }) => {
  const { data } = useTina(props);

  return (
    <div data-tina-field={tinaField(data)}>
      <TinaMarkdown
        content={data.home.quote}
      />
    </div>
  );
};
