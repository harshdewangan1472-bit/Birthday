import React, { forwardRef } from "react";

// react-pageflip needs every direct child to forward a ref to the DOM node.
const Page = forwardRef(({ children, className = "" }, ref) => {
  return (
    <div className="page-flip-face" ref={ref}>
      <div className={`magazine-page ${className}`}>{children}</div>
    </div>
  );
});

Page.displayName = "Page";
export default Page;
