import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Button, Grid} from '@material-ui/core'
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {loginTC} from "../../state/auth-reducer";

export const Login = () => {
    const dispatch = useDispatch()
    type FormikErrorsType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: values => {
            const errors: FormikErrorsType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 2 || values.password.length > 10) {
                errors.password = 'Must be 2-10 characters'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })
    return <Grid container justify="center">
        <Grid item xs={4}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}>here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <FormGroup>
                        <TextField
                            style={{height: '65px'}}

                            label="Email"
                            margin="normal"

                            {...formik.getFieldProps('email')}
                            error={formik.touched.email && !!formik.errors.email}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            style={{height: '65px'}}

                            type="password"
                            label="Password"
                            margin="normal"

                            {...formik.getFieldProps('password')}
                            error={formik.touched.password && !!formik.errors.password}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox/>}

                            name='rememberMe'
                            onChange={formik.handleChange}
                            value={formik.values.rememberMe}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}
