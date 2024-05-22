// import { useEffect, useState } from "react";

// type FetchMoreFunction = () => Promise<void>;

// export const useInfiniteScroll = (fetchMoreFunc: FetchMoreFunction) => {
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop !==
//           document.documentElement.offsetHeight ||
//         isFetching
//       )
//         return;
//       setIsFetching(true);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isFetching]);

//   useEffect(() => {
//     if (!isFetching) return;
//     fetchMoreFunc().then(() => setIsFetching(false));
//   }, [isFetching, fetchMoreFunc]);

//   return [isFetching, setIsFetching];
// };

import { useEffect, useState } from "react";

type FetchMoreFunction = () => Promise<void>;

export const useInfiniteScroll = (fetchMoreFunc: FetchMoreFunction) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 10;
      const currentPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.offsetHeight;

      if (currentPosition + threshold >= pageHeight && !isFetching) {
        setIsFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      try {
        await fetchMoreFunc();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching, fetchMoreFunc]);

  return [isFetching, setIsFetching];
};
