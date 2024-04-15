import { useEffect, useState, useCallback } from "react";

type FetchMoreFunction = () => Promise<void>;

export const useInfiniteScroll = (fetchMoreFunc: FetchMoreFunction) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching
      )
        return;
      setIsFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreFunc().then(() => setIsFetching(false));
  }, [isFetching, fetchMoreFunc]);

  return [isFetching, setIsFetching];
};
