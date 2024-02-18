import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const CMSMarkdown = (props: { query: string, variables: object, data: any, collection: string, field: string }) => {
  const { data } = useTina(props);

  return (
    <div data-tina-field={tinaField(data)}>
      <TinaMarkdown
        content={data[props.collection][props.field]}
      />
    </div>
  );
};
