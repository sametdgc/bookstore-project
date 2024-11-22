import React from "react";

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={`px-4 py-2 bg-[#65aa92] text-white rounded-lg hover:bg-[#4a886e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#65aa92] focus:ring-offset-2 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default Button;
