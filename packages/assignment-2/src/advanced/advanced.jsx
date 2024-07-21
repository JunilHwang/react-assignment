import { deepEquals, shallowEquals } from "../basic/basic.js";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export const memo1 = (() => {
  const cache = new WeakMap();
  return (fn) => {
    const cached = cache.get(fn);
    if (cached) {
      return cached;
    }
    const result = fn();
    cache.set(fn, result);
    return result;
  }
})();

export const memo2 = (() => {
  const cache = new WeakMap();
  const dependenciesCache = new WeakMap();
  return (fn, dependencies) => {
    const cached = cache.get(fn);
    const cachedDependencies = dependenciesCache.get(fn);
    if (cached && shallowEquals(dependencies, cachedDependencies)) {
      return cached;
    }
    const result = fn();
    cache.set(fn, result);
    dependenciesCache.set(fn, dependencies);
    return result;
  }
})();

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const setStateDeferenceAtDeepEquals = useCallback((newState) => {
    if (!deepEquals(state, newState)) {
      setState(newState);
    }
  }, [state]);

  return [state, setStateDeferenceAtDeepEquals];
}


const UserContext = createContext([null, () => null]);
const CounterContext = createContext([0, () => null]);
const TodoContext = createContext([[], () => null]);

export const TestContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [todoItems, setTodoItems] = useState([]);

  const userContextValue = useMemo(() => [user, setUser], [user])
  const countContextValue = useMemo(() => [count, setCount], [count])
  const todoItemsContextValue = useMemo(() => [todoItems, setTodoItems], [todoItems])

  return (
    <UserContext.Provider value={userContextValue}>
      <CounterContext.Provider value={countContextValue}>
        <TodoContext.Provider value={todoItemsContextValue}>
          {children}
        </TodoContext.Provider>
      </CounterContext.Provider>
    </UserContext.Provider>
  )
}
export const useUser = () => {
  return useContext(UserContext);
}

export const useCounter = () => {
  return useContext(CounterContext);
}

export const useTodoItems = () => {
  return useContext(TodoContext);
}
