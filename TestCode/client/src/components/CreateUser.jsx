import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import validator from 'validator'
import { useDispatch } from 'react-redux';
import { fetchUserDetails, postUser, updateUser } from '../actions';

const CreateUser = ({ onClose, open, isUpdate, updatingData }) => {

    const [formFields, setFormFields] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [gender, setGender] = useState('male');
    const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString());
    const dispatch = useDispatch()

    useEffect(() => {
        if (updatingData && isUpdate) {
            setFormFields({ ...updatingData })
        } else {
            setFormFields({})
        }
    }, [updatingData])

    const dateHandleChange = (newValue) => {
        setDateOfBirth(newValue);
    };

    const genderHandleChange = (event) => {
        setGender(event.target.value);
    };

    const handleChange = (e) => {
        formFields[e.target.name] = e.target.value;
        setFormFields({ ...formFields });
    };

    const handleValidation = () => {
        let fields = formFields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "First name cannot be empty";
        }

        if (!fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Last name cannot be empty";
        }

        //Email
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Email cannot be empty";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (!(lastAtPos < lastDotPos &&
                lastAtPos > 0 &&
                fields["email"].indexOf("@@") == -1 &&
                lastDotPos > 2 &&
                fields["email"].length - lastDotPos > 2
            )
            ) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        if (!fields["password"] && !validator.isStrongPassword(fields["password"], {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            formIsValid = false;
            errors["password"] = "Password min Length 8 is required";
        }

        setFormErrors({ errors });
        return formIsValid;
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (isUpdate) {
                await updateUser(formFields._id, { ...formFields, gender, dateOfBirth })
            } else {
                if (handleValidation()) {
                    await postUser({ ...formFields, gender, dateOfBirth })
                    alert("Form submitted");
                }
            }
            dispatch(fetchUserDetails())
            onClose()
        } catch (error) {
            console.log(error)
        }
    }


    return (

        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isUpdate ? 'Update' : 'Create'} user</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter user detail
                </DialogContentText>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={formFields.firstName}
                    />
                    <span style={{ color: "red" }}>{formErrors.errors && formErrors.errors.firstName}</span>

                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={formFields.lastName}
                    />
                    <span style={{ color: "red" }}>{formErrors.errors && formErrors.errors.lastName}</span>

                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={formFields.email}
                    />
                    <span style={{ color: "red" }}>{formErrors.errors && formErrors.errors.email}</span>

                    <TextField
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={formFields.password}
                    />
                    <span style={{ color: "red" }}>{formErrors.errors && formErrors.errors.password}</span>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                        <Select
                            value={gender}
                            label="Gender"
                            onChange={genderHandleChange}
                        >
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                        </Select>
                    </FormControl>

                    <DesktopDatePicker
                        label="Date of birth"
                        inputFormat="MM/dd/yyyy"
                        value={dateOfBirth}
                        onChange={dateHandleChange}
                        renderInput={(params) => <TextField margin="dense" fullWidth {...params} />}
                    />

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            margin="dense"
                            name="code"
                            label="Country code"
                            type="number"
                            variant="outlined"
                            onChange={handleChange}
                            value={formFields.code}
                        />

                        <TextField
                            margin="dense"
                            name="mobileNumber"
                            label="Mobile number"
                            type="number"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formFields.mobile}
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{isUpdate ? 'Update' : 'Add'} user</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateUser;
