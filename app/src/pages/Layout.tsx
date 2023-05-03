import { Outlet } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import useRoles from "../hooks/useRoles";

const Layout = () => {
  const { data: roles } = useRoles();

  return (
    <Grid
      templateAreas={{
        base: `"header header" "aside main"`,
      }}
      gridTemplateColumns={"5rem 1fr"}
      gap={0}
    >
      <GridItem area="header" backgroundColor="blue.100">
        <NavBar></NavBar>
      </GridItem>
      <GridItem area="aside">
        {roles && <SideIconList roles={roles} />}
      </GridItem>
      <GridItem area="main">
        <Outlet />
      </GridItem>
    </Grid>
  );
};

export default Layout;
