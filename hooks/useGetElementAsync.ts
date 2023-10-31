import { useEffect, useRef, useState } from "react";

const useGetElementAsync = (query: string) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const attempt = useRef(0);

  useEffect(() => {
    (async () => {
      let element = await new Promise<HTMLElement | null>((resolve) => {
        function getElement() {
          const element = document.querySelector<HTMLElement>(query);
          if (element) {
            resolve(element);
          } else {
            if (attempt.current > 10) {
              resolve(null);
              return;
            }

            attempt.current += 1;

            // Set timeout isn't a must but it
            // decreases number of recursions
            setTimeout(() => {
              requestAnimationFrame(getElement);
            }, 100);
          }
        }

        getElement();
      });

      setElement(element);
    })();
  }, [query]);

  return element;
};

export default useGetElementAsync;
