import React, { createContext, useState, ReactNode } from "react";
import { Products } from "./modules/Products";
import { api } from "./functions/api";

interface ProviderProps {
  children: ReactNode;
}

// Create the context object
export const AppContext = createContext({
  cartID: null as string | null,
  setCartID: (id: string | null) => {},
  cursor: null,
  setCursor: (cursor: any) => {},
  products: null as Products | null,
  setProducts: (products: Products | null) => {},
  categories: null as Products | null,
  setCategories: (categories: Products | null) => {},
});

// Create the provider component
export const AppProvider = ({ children }: ProviderProps) => {
  const [cartID, setCartID] = useState<string | null>(null);
  const [cursor, setCursor] = useState(null);
  const [products, setProducts] = useState<Products | null>(null);
  const [categories, setCategories] = useState<Products | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `
            {
              products(first:10) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
      
                edges {
                  node {
                    title
                    description
                    collections(first: 10) {
                      edges {
                        node {
                          title
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                        }
                      }
                    }
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          title
                          priceV2 {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `;
        const data = await api(query);
        setProducts(data.data.products);
        setCursor(data.data.products.pageInfo.endCursor);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const query = `
              {
                collections(first: 10) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
            `;

        const { data } = await api(query);
        const dataMapped = data.collections.edges.map(
          (edge: any) => edge.node.title
        );
        setCategories(dataMapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <AppContext.Provider
      value={{
        cartID,
        setCartID,
        cursor,
        setCursor,
        products,
        setProducts,
        categories,
        setCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
