import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
//import DarkModeContext from "../DarkMode";
import { GitHub as GitHubIcon } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  makeStyles,
  Theme,
  darken,
  fade,
  Box,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#23f0c7",
    marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  github: {
    backgroundColor: "#24292e",
    color: "#eee",
    "&:hover": {
      backgroundColor: darken("#24292e", 0.1),
    },
  },
  google: {
    backgroundColor: "#ea4335",
    color: "#eee",
    "&:hover": {
      backgroundColor: darken("#ea4335", 0.1),
    },
  },
  input: {
    margin: theme.spacing(1),
    width: "40%",
    "& .MuiFormLabel-root": {
      color: "#eee",
      //color: (props: Style): string => (props.darkMode ? "#eee" : "#222"),
    },
    "& .MuiOutlinedInput-root": {
      //color: (props: Style): string => (props.darkMode ? "#eee" : "#222"),
      color: "#eee",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,

      "&.Mui-focused fieldset": {
        borderColor: "#114B5F",
      },
    },
    "& .MuiFormHelperText-root": {
      fontWeight: "bold",
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
  datePicker: {
    backgroundColor: "#66d0f91a",
    width: "40%",
    "& .MuiInputBase-root": {
      color: "#eee",
      padding: "1rem",
    },
    "& .MuiSvgIcon-root": {
      color: "#eee",
    },
  },
}));

const Register = (): JSX.Element => {
  const csrf = Cookies.get("XSRF-TOKEN")!;
  //const darkMode = useContext(DarkModeContext);
  const classes = useStyles();
  const [errors, setErrors] = useState({
    name: [],
    password: [],
    email: [],
  });
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const history = useHistory();

  const handleGithubOauth = (): void => {
    window.location.replace("/auth/github");
  };

  const handleGoogleOauth = (): void => {
    window.location.replace("/auth/google");
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const name = e.target.getAttribute("name")!;
    setData({ ...data, [name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(birthday);
    fetch("/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrf,
      },
      body: JSON.stringify({
        ...data,
        birthday,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push("/");
        } else {
          setErrors({ ...errors, ...data.errors });
        }
      });
  };

  const handleBirthdayChange = (date: MaterialUiPickersDate): void => {
    if (date !== null) setBirthday(date.toDate());
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h2">Register</Typography>

        <TextField
          name="name"
          id="outlined-basic"
          fullWidth
          label="Username"
          onChange={handleRegisterChange}
          value={data.name}
          variant="outlined"
          error={errors.name.length > 0}
          helperText={errors.name.join("\n")}
          classes={{
            root: classes.input,
          }}
        />

        <TextField
          name="email"
          id="outlined-basic"
          label="E-Mail"
          fullWidth
          type="email"
          onChange={handleRegisterChange}
          value={data.email}
          error={errors.email.length > 0}
          helperText={errors.email.join("\n")}
          variant="outlined"
          classes={{
            root: classes.input,
          }}
        />

        <TextField
          name="password"
          id="outlined-basic"
          label="Password"
          fullWidth
          type="password"
          onChange={handleRegisterChange}
          value={data.password}
          variant="outlined"
          error={errors.password.length > 0}
          helperText={errors.password.join("\n")}
          classes={{
            root: classes.input,
          }}
        />

        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            disableToolbar
            disableFuture
            fullWidth
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Birthday"
            value={birthday}
            className={classes.datePicker}
            onChange={handleBirthdayChange}
          />
        </MuiPickersUtilsProvider>

        <Box display="flex" flexDirection="column">
          <Button type="submit" variant="contained" className={classes.button}>
            Register
          </Button>
          <Box display="flex">
            <Button
              variant="contained"
              className={classes.github}
              onClick={handleGithubOauth}
            >
              <GitHubIcon />
              {" Github"}
            </Button>
            <Button
              variant="contained"
              className={classes.google}
              onClick={handleGoogleOauth}
            >
              <FontAwesomeIcon icon={faGoogle} /> Google
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default Register;
