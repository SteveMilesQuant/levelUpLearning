import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import useRoles from "./hooks/useRoles";
import { FaLevelUpAlt, FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";

interface Role {
  name: string;
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");

  const roles = useRoles(signedIn, setError);

  const isGuardian = roles.find((role) => role.name === "GUARDIAN");
  const isInstructor = roles.find((role) => role.name === "INSTRUCTOR");
  const isAdmin = roles.find((role) => role.name === "ADMIN");

  const primaryColor = "lightskyblue";

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
        <GridItem area="nav" backgroundColor={primaryColor}>
          <NavBar signedIn={signedIn} setSignedIn={setSignedIn}></NavBar>
        </GridItem>
        {signedIn && (
          <GridItem area="aside">
            <VStack padding="20px" gap="20px">
              {isGuardian && (
                <>
                  <FaGraduationCap size={40} color={primaryColor} />
                  <FaLevelUpAlt size={40} color={primaryColor} />
                </>
              )}
              {isInstructor && (
                <>
                  <GiTeacher size={40} color={primaryColor} />
                  <MdOutlineDesignServices size={40} color={primaryColor} />
                </>
              )}
              {isAdmin && (
                <>
                  <AiOutlineSchedule size={40} color={primaryColor} />
                  <MdManageAccounts size={40} color={primaryColor} />
                </>
              )}
            </VStack>
          </GridItem>
        )}
        <GridItem area="main">Main</GridItem>
      </Grid>
    </>
  );
}

export default App;
