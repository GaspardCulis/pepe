import { useTina, tinaField } from "tinacms/dist/react";

export const CMSHint = (props: { query: string, variables: object, data: any, collection: string, field: string, content: any}) => {
  const { data } = useTina(props);

  return (
    <div data-tina-field={tinaField(data[props.collection], props.field)} />
  );
};
