import React from 'react';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";


export const App = () => {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const error = useSelector<AppRootStateType, null | string>(state => state.app.error)
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
                        News
                    </Typography>
                    <Button color={"inherit"}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" style={{paddingLeft: '80px'}}>
                <TodolistsList/>
            </Container>
        </div>
    )
}


