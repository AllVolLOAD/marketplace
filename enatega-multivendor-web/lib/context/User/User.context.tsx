"use client";

import { GET_USER_PROFILE } from "@/lib/api/graphql";
import {
  ApolloError,
  LazyQueryExecFunction,
  OperationVariables,
  useLazyQuery,
} from "@apollo/client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { v4 } from "uuid";

export interface CartItem {
  key: string;
  variantId: string;
  productId: string;
  title: string;
  image?: string;
  options?: { size?: string; color?: string };
  price: number;
  currency: string;
  quantity: number;
  [key: string]: any;
}

export interface ProfileType {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  phoneIsVerified?: boolean;
  emailIsVerified?: boolean;
  addresses?: any[];
  [key: string]: any;
}

export interface UserContextType {
  isLoggedIn: boolean;
  loadingProfile: boolean;
  errorProfile: ApolloError | undefined;
  profile: ProfileType | null;
  fetchProfile: LazyQueryExecFunction<any, OperationVariables>;
  setTokenAsync: (token: string, cb?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  cart: CartItem[];
  cartCount: number;
  clearCart: () => void;
  updateCart: (cart: CartItem[]) => Promise<void>;
  addItem: (...args: any[]) => Promise<void>;
  addQuantity: (key: string, quantity?: number) => Promise<void>;
  removeQuantity: (key: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
  updateItemQuantity: (key: string, changeAmount: number) => Promise<void>;
  calculateSubtotal: () => string;
  restaurant: string | null;
  setCartRestaurant: (restaurantId: string) => void;
  transformCartWithFoodInfo: (items: any[], _order?: any) => any[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurantState] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("restaurant") : null
  );

  const [
    fetchProfile,
    {
      called: calledProfile,
      loading: loadingProfile,
      error: errorProfile,
      data: dataProfile,
    },
  ] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: "network-only",
    onError,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error);
        setCart([]);
      }
    }
    setCartRestaurantState(localStorage.getItem("restaurant"));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchProfile();
  }, [token, fetchProfile]);

  function onError(error: ApolloError) {
    console.log("error", error.message);
  }

  const setTokenAsync = async (tokenReq: string, cb: () => void = () => {}) => {
    setToken(tokenReq);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", tokenReq);
    }
    cb();
  };

  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setToken(null);
    } catch (error) {
      console.log("error on logout", error);
    }
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setCartRestaurantState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("restaurant");
    }
  }, []);

  const addItem = useCallback(async (...args: any[]) => {
    const normalizedItem: CartItem | null =
      args.length === 1 &&
      typeof args[0] === "object" &&
      args[0] !== null &&
      "variantId" in args[0]
        ? {
            key: v4(),
            productId: String(args[0].productId || ""),
            variantId: String(args[0].variantId || ""),
            title: String(args[0].title || "Item"),
            image: args[0].image,
            options: args[0].options || {},
            price: Number(args[0].price || 0),
            currency: String(args[0].currency || "USD"),
            quantity: Number(args[0].quantity || 1),
            ...args[0],
          }
        : {
            key: v4(),
            image: args[0],
            productId: args[1] || "",
            variantId: args[2] || args[1] || "",
            quantity: Number(args[4] || 1),
            title: "Item",
            options: {},
            price: 0,
            currency: "USD",
          };

    if (!normalizedItem) return;

    const restaurantId =
      args.length > 1 ? (args[3] as string | undefined) : undefined;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (c) => c.variantId === normalizedItem.variantId
      );
      let updatedCart = [...prevCart];
      if (existingIndex > -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + normalizedItem.quantity,
        };
      } else {
        updatedCart = [...prevCart, normalizedItem];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        if (restaurantId) {
          localStorage.setItem("restaurant", restaurantId);
          setCartRestaurantState(restaurantId);
        }
      }
      return updatedCart;
    });
  }, []);

  const updateCart = useCallback(async (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  }, []);

  const addQuantity = useCallback(async (key: string, quantity = 1) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.key === key
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  }, []);

  const removeQuantity = useCallback(async (key: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      if (typeof window !== "undefined") {
        if (updatedCart.length === 0) {
          localStorage.removeItem("cartItems");
        } else {
          localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }
      }
      return updatedCart;
    });
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.key !== key);
      if (typeof window !== "undefined") {
        if (updatedCart.length === 0) {
          localStorage.removeItem("cartItems");
        } else {
          localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }
      }
      return updatedCart;
    });
  }, []);

  const updateItemQuantity = useCallback(
    async (key: string, changeAmount: number) => {
      if (changeAmount > 0) {
        await addQuantity(key, 1);
      } else {
        await removeQuantity(key);
      }
    },
    [addQuantity, removeQuantity]
  );

  const calculateSubtotal = useCallback(() => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  const setCartRestaurant = useCallback((restaurantId: string) => {
    setCartRestaurantState(restaurantId);
    if (typeof window !== "undefined") {
      localStorage.setItem("restaurant", restaurantId);
    }
  }, []);

  const transformCartWithFoodInfo = useCallback((items: any[]) => {
    return items;
  }, []);

  const numberOfCartItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!token,
        loadingProfile: loadingProfile && calledProfile,
        errorProfile,
        profile: dataProfile?.profile ?? null,
        fetchProfile,
        setTokenAsync,
        logout,
        cart,
        cartCount: numberOfCartItems(),
        clearCart,
        updateCart,
        addItem,
        addQuantity,
        removeQuantity,
        deleteItem,
        updateItemQuantity,
        calculateSubtotal,
        restaurant: cartRestaurant,
        setCartRestaurant,
        transformCartWithFoodInfo,
        setCart,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
export default UserContext;
