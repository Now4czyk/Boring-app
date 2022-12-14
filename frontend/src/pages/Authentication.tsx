import { useLocation } from "react-router-dom";
import { FormControl, Grid } from "@mui/material";
import { FormSignup, FormSignin } from "components";

export const Authentication = () => {
  const isSignIn = useLocation().pathname.includes("signin");
  const Form = () => (isSignIn ? <FormSignin /> : <FormSignup />);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item marginY="2rem">
        <FormControl>
          <Form />
        </FormControl>
      </Grid>
    </Grid>
  );
};
