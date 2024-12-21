export const CustomizeRequiredMark: (
  labelNode: React.ReactNode,
  info: {
    required: boolean;
  }
) => React.ReactNode = (label, { required }) => (
  <>
    {label}
    {required ? (
      <div className="flex items-center justify-center px-1 text-[#dc4c2c]">
        *
      </div>
    ) : null}
  </>
);