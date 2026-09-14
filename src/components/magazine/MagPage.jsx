import { forwardRef } from "react";

// react-pageflip needs every direct child to forward a ref to the DOM node.
const MagPage = forwardRef(({ children, className = "" }, ref) => {
  return (
    <div className="page-flip-face" ref={ref}>
      <div className={`magazine-page ${className}`}>{children}</div>
    </div>
  );
});

MagPage.displayName = "MagPage";
export default MagPage;
