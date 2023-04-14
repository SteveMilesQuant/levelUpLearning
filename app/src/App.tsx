import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Grid,
  GridItem,
  Icon,
  VStack,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import useRoles from "./hooks/useRoles";
import SideIconList from "./components/SideIconList";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const roles = useRoles(signedIn, setError);

  return (
    <>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            onClick={() => setError("")}
          />
        </Alert>
      )}
      <Grid
        templateAreas={{
          base: `"nav nav" "aside main"`,
        }}
      >
        <GridItem area="nav" backgroundColor="blue.100">
          <NavBar
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            onError={(error) => setError(error)}
          ></NavBar>
        </GridItem>
        {signedIn && (
          <GridItem justifyContent="left" area="aside">
            <SideIconList roles={roles} />
          </GridItem>
        )}
        <GridItem area="main">Main</GridItem>
      </Grid>
    </>
  );
}

export default App;
