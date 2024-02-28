import { useTina, tinaField } from "tinacms/dist/react";

export const CMSLabel = (props: {
  query: string,
  variables: object,
  data: any,
  collection: string,
  field: string,
  className: string
}) => {
  const { data } = useTina(props);

  return (
    <h1
      data-tina-field={tinaField(data[props.collection], props.field)}
      className={props.className}
    >{data[props.collection][props.field]}</h1>
  );
};
