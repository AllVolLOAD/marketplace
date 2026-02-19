import { ReactNode } from "react";
import { IGlobalProps } from "./global.interface";

export interface IConfigurationContextProps extends IGlobalProps {}

export interface IConfigurationProviderProps {
  children: ReactNode;
}
