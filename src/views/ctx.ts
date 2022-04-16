import React from "react";
import type { AppContext } from "../shared";

export const Ctx = React.createContext<AppContext | undefined>(undefined);
