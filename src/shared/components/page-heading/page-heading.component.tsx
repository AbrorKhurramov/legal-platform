interface IPageHeadingProps {
  title: string;
  description?: string;
}

export const PageHeading = (props: IPageHeadingProps) => {
  const { title, description } = props;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-h3 text-greyscale-900">{title}</h1>
      {description && <p className="max-w-3xl text-sm text-greyscale-600">{description}</p>}
    </div>
  );
};
