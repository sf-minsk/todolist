import React, {useEffect} from 'react';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {initializeAppTC, RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Redirect, Route, Switch} from "react-router-dom";
import {Login} from "../features/Login/Login";
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import {logoutTC} from "../state/auth-reducer";


export const App = () => {
    const dispatch = useDispatch()
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const error = useSelector<AppRootStateType, null | string>(state => state.app.error)
    const logout = () => {
        dispatch(logoutTC())
    }
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            {
                status === 'loading' &&
                <LinearProgress color="secondary" style={{position: 'fixed', width: '100%'}}/>
            }
            {
                error !== null && <ErrorSnackbar/>
            }
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton
                        edge={"start"}
                        color={"inherit"}
                        aria-label={'menu'}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        TODOLIST
                    </Typography>
                    {isLoggedIn ?
                        <Button onClick={logout} style={{position: 'absolute', right: '10px'}} variant="contained"
                                color={"secondary"}>
                            Logout
                        </Button> : null}

                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" style={{paddingLeft: '80px'}}>
                <Switch>
                    <Route exact path={'/'} render={() => isLoggedIn ? <TodolistsList/> : <Redirect to='/login'/>}/>
                    <Route path={'/login'} render={() => !isLoggedIn ? <Login/> : <Redirect to='/'/>}/>
                    <Route path={'/404'} render={() => <h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'/*'} to={'/404'}/>
                </Switch>
            </Container>
        </div>
    )
}


