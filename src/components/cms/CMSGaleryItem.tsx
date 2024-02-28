import { useTina, tinaField } from "tinacms/dist/react";

export const CMSGaleryItem = (props: { query: string, variables: object, data: any, index: number }) => {
  const { data } = useTina(props);

  const item = data.categories.items[props.index];

  return (
    <>
      <div className="flex">
        <img
          src={item.image}
          alt={item.name}
          data-tina-field={tinaField(data.categories.items[props.index], "image")}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <h2
          className="text-md pt-3 xl:pt-5 xl:text-xl hover:underline hover:underline-offset-4 font-bold"
          data-tina-field={tinaField(data.categories.items[props.index])}
        >
          {item.name}
        </h2>
      </div>
    </>
  );
};
