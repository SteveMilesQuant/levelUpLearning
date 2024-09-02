import { Stack, useBreakpointValue } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import HomePageCarousel from "../components/HomePageCarousel";
import HomePageMission from "../components/HomePageMission";
import HomePageFocus from "../components/HomePageFocus";
import HomePageTeaser from "../components/HomePageTeaser";
import { Fragment, useEffect, useState } from "react";

const Home = () => {
  const homePageItems = [
    <HomePageTeaser key={0} />,
    <HomePageFocus key={1} />,
    <HomePageCarousel key={2} />,
    <HomePageMission key={3} />
  ];

  const minSize = useBreakpointValue(
    {
      base: 2,
      sm: 2,
      md: 1,
      lg: 1,
      xl: 1,
    },
    {
      fallback: 'lg',
    },
  )
  const [loadedItems, setLoadedItems] = useState(homePageItems.slice(0, 1));
  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    if (!minSize || loadedItems.length >= minSize) return;
    setLoadedItems(homePageItems.slice(0, minSize));
  }, [minSize]);

  const fetchNextItem = () => {
    if (loadedItems.length === homePageItems.length) return;
    const newLength = loadedItems.length + 1;
    if (newLength === homePageItems.length) setHasMoreItems(false);
    setLoadedItems(homePageItems.slice(0, newLength));
  }

  return (
    <InfiniteScroll
      dataLength={loadedItems.length}
      next={fetchNextItem}
      hasMore={hasMoreItems}
      loader={<Fragment />}
    >
      <Stack width="99vw" alignItems="center" marginY={5} spacing={10}>
        {loadedItems.map(item => item)}
      </Stack>
    </InfiniteScroll >
  );
};

export default Home;
