export type Products = {
  edges: {
    node: {
      title: string;
      description: string;
      images: {
        edges: {
          node: {
            originalSrc: string;
          };
        }[];
      };
      variants: {
        edges: {
          node: {
            priceV2: {
              amount: string;
              currencyCode: string;
            };
          };
        }[];
      };
    };
  }[];
};
