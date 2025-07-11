import clsx from "clsx";

const VARIANTS = {
  primary:
    "bg-primary text-mist shadow-md shadow-steelBlue hover:text-paleBlue",
  secondary: "bg-black opacity-60 text-paleBlue hover:bg-primary",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "rounded-full font-heading font-semibold text-center",
        "text-heading2 sm:text-heading1",
        "w-40 sm:w-52",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
