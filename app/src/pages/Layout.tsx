import { Outlet } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import ErrorMessage from "../components/ErrorMessage";
import useRoles from "../hooks/useRoles";
import { useState } from "react";

const Layout = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const roles = useRoles(signedIn, setError);

  return (
    <>
      {error && (
        <ErrorMessage onClose={() => setError("")}>{error}</ErrorMessage>
      )}
      <Grid
        templateAreas={{
          base: `"nav nav" "aside main"`,
        }}
        gridTemplateColumns={"5rem 1fr"}
        gap={0}
      >
        <GridItem area="nav" backgroundColor="blue.100">
          <NavBar
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            onError={(error) => setError(error)}
          ></NavBar>
        </GridItem>
        <GridItem justifyContent="left" area="aside">
          {signedIn && <SideIconList roles={roles} />}
        </GridItem>
        <GridItem area="main">
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
};

export default Layout;
