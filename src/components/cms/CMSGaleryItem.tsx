import { useTina, tinaField } from "tinacms/dist/react";

export const CMSGaleryItem = (props: { query: string, variables: object, data: any }) => {
  const { data } = useTina(props);

  return (
    <>
      <div className="flex">
        <img
          src={data.galeryItems.image}
          alt={data.galeryItems.name}
          data-tina-field={tinaField(data.galeryItems, "image")}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <h2
          className="text-md pt-3 xl:pt-5 xl:text-xl hover:underline hover:underline-offset-4 font-bold"
          data-tina-field={tinaField(data.galeryItems, "name")}
        >
          {data.galeryItems.name}
        </h2>
      </div>
    </>
  );
};
