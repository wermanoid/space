import React, { createContext, useContext } from 'react';

const initial = new Map<any, any>();
const Context = createContext<any>(initial);

export const Provider: React.SFC<any> = ({ children, services = [] }) => {
  services.forEach(([service, instance]: any) =>
    initial.set(service, instance)
  );
  return <Context.Provider value={initial}>{children}</Context.Provider>;
};

export const userService = <T, I = any>(
  inject?: (new (...args: any[]) => T) | ((...args: any[]) => T)
): T => {
  const result = useContext<Map<any, any>>(Context);
  return inject ? result.get(inject) : result.values();
};
