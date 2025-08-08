import React, { useState, useEffect } from "react";
import Product from "../../utils/product";


function ProductGrid({ products }) {





  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products?.map((product) => (
        <Product product={product}/>
      ))}
    </div>
  );
}

export default ProductGrid;
