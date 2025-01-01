"use client";

import type React from "react";
import TShirtOptions from "./t-shirt-options";
import MugOptions from "./mug-options";

const optionsMap: { [key: string]: React.ReactNode } = {
  "t-shirt": <TShirtOptions />,
  mug: <MugOptions />,
};

function ProductOptions({ slug }: { slug: string }) {
  return (
    <div>
      {optionsMap[slug] || <p>No options available for this product.</p>}
    </div>
  );
}

export default ProductOptions;
