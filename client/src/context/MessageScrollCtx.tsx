import { useContext, createContext, useRef } from 'react';

interface ScrollCtxType {
  ScrollRefComponent: () => JSX.Element;
  scrollToBottom: () => void;
}

const ScrollCtx = createContext<ScrollCtxType>(null as any);

function ScrollStateProvider({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(/*{ behavior: 'smooth' }*/);
  };

  const ScrollRefComponent = () => <div ref={scrollRef}></div>;

  return (
    <ScrollCtx.Provider
      value={{
        ScrollRefComponent,
        scrollToBottom,
      }}
    >
      {children}
    </ScrollCtx.Provider>
  );
}

export const useScrollCtx = () => useContext(ScrollCtx);

export default ScrollStateProvider;
