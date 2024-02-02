import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Stack, Typography } from "@mui/material";
import MUILink from "@mui/material/Link";
import { Link, useNavigate } from "react-router-dom";
import { ISignUpInput } from "@/types/auth.types";
import { signUpSchema } from "@/validations/auth.validations";
import TextField from "@/components/form/fields/TextField";
import Form from "@/components/form/Form";
import { signUp } from "@/actions/auth.action";

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm<ISignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const { handleSubmit } = form;

  const onFormSubmit: SubmitHandler<ISignUpInput> = async (values) => {
    await signUp(values);
    navigate('/login');
  }

  return (
    <div className="flexCenter flex1 stretchSelf">
      <Typography variant="h3" gutterBottom>
        Sign up
      </Typography>
      <div className="stretchSelf">
        <Stack spacing={2}>
          <Form form={form} onSubmit={handleSubmit(onFormSubmit)}>
            <TextField
              label="First name"
              name="firstName"
            />
            <TextField
              label="Last name"
              name="lastName"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
            />

            <TextField
              label="Password"
              name="password"
              type="password"
            />
            <TextField
              label="Password confirmation"
              name="passwordConfirmation"
              type="password"
            />
          </Form>
          <Typography variant="body1">
            Already have an account? <MUILink component={Link} to="/login">Login</MUILink>
          </Typography>
        </Stack>

      </div>
    </div>
  );
}

export default SignUp