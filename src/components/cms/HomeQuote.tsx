import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const HomeQuote = (props: { query: string, variables:object, data: any }) => {
  const { data } = useTina(props);

  return (
      <div
  				data-tina-field={tinaField(data, "home")}
        >
  			<TinaMarkdown
  				content={data.home.quote}
  			/>
  		</div>
  );
};
