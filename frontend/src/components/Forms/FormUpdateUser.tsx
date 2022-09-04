import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql";
import { Box, Button } from "@mui/material";
import { FormInputText } from "./utils";
import { Dispatch, SetStateAction } from "react";

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
}

export const FormUpdateUser = ({
  defaultValues,
  setEditMode,
}: {
  defaultValues: FormInputs;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const methods = useForm<FormInputs>({ defaultValues });
  const { handleSubmit, control, setError, formState } = methods;

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      navigate(0);
    },
  });

  const onSubmit = async ({ firstName, lastName, email }: FormInputs) => {
    if (firstName.length === 0)
      setError("firstName", { message: "First name is invalid" });
    if (lastName.length === 0)
      setError("lastName", { message: "Last name is invalid" });
    if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    )
      setError("email", { message: "Email is invalid" });

    if (formState.isSubmitSuccessful) {
      await updateUser({
        variables: {
          firstName,
          lastName,
          email,
        },
      });
      setEditMode(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
        paddingTop: "1rem",
        width: "25rem",
      }}
    >
      <FormInputText name="firstName" control={control} label="First Name" />
      <FormInputText name="lastName" control={control} label="Last Name" />
      <FormInputText name="email" control={control} label="Email" />
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Update
      </Button>
      <Button variant="contained" onClick={() => setEditMode(false)}>
        Cancel
      </Button>
    </Box>
  );
};