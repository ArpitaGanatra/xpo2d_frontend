import React, { useState } from 'react';
import {
    Dialog, Grid,
    AppBar, Toolbar, IconButton, makeStyles, Typography, Slide, Button, Tabs, Tab
    , Box, TextField
} from '@material-ui/core';
import PropTypes from 'prop-types';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';
import Product from './Product'
import Team from './Team'
import Video from './Video'
import Assets from './Assets'
import CallIcon from '@material-ui/icons/Call';
import MailIcon from '@material-ui/icons/Mail';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import { createEnquiry } from 'src/slices/enquiry'
import useAuth from 'src/hooks/useAuth';
import Photo from './Photo'

import {   
    openModal,
    closeModal
  } from 'src/slices/exhibitor';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const useStyles = makeStyles(theme => ({
    imgContainer: {
        margin: 'auto',
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        maxWidth: 345,
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Results = ({
    className,
    exhibitor,
    ...rest
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    //const [open, setOpen] = useState(false);
    const [value, setValue] = React.useState(0);
    const { isModalOpen } = useSelector((state) => state.exhibitor);
    //const [fullWidth, setFullWidth] = React.useState(true);
    //const [maxWidth, setMaxWidth] = React.useState('lg');
    const { user } = useAuth();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickOpen = () => {
        dispatch(openModal());
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <React.Fragment>

            <Carousel>
                <div onClick={handleClickOpen}>
                    <img src={exhibitor.stall_image} alt={exhibitor.name} />
                    <p className="legend">{exhibitor.name}</p>
                </div>
            </Carousel>

            <Dialog fullWidth={true}
                maxWidth="lg" open={isModalOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {exhibitor.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="About" {...a11yProps(0)} />
                    <Tab label="Products" {...a11yProps(1)} />
                    <Tab label="Team" {...a11yProps(2)} />
                    <Tab label="Photo" {...a11yProps(3)} />
                    <Tab label="Video" {...a11yProps(4)} />
                    <Tab label="Assets" {...a11yProps(5)} />
                    <Tab label="Contact Us" {...a11yProps(6)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Typography>{ReactHtmlParser(exhibitor.about_me)}</Typography>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid container xs={12} sm spacing={2}>
                        <Product product={exhibitor.product_data}></Product>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Grid container xs={12} sm spacing={2}>
                        <Team team={exhibitor.staff_data}></Team>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Grid container xs={12} sm spacing={2}>
                        <Photo photo={exhibitor.photo_data}></Photo>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Grid container xs={12} sm spacing={2}>
                        <Video video={exhibitor.video_data}></Video>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Assets assets={exhibitor.assets_data}></Assets>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <Formik
                        initialValues={{
                            message: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            message: Yup.string().max(1000).required("Message is required"),
                        })}
                        onSubmit={async (values, {
                            resetForm,
                            setErrors,
                            setStatus,
                            setSubmitting
                        }) => {
                            try {
                                const data = {
                                    message: values.message,
                                    exhibitor_id: exhibitor.id,
                                    visitor_id: user.id,
                                    leader_type: "enquiry",
                                };
                                await dispatch(createEnquiry(data));                                
                                dispatch(closeModal());
                                resetForm();
                                setStatus({ success: true });
                                setSubmitting(false);
                                enqueueSnackbar('Enquiry send', {
                                    variant: 'success'
                                });

                            } catch (err) {
                                console.error(err);
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                            touched,
                            values
                        }) => (
                                <form
                                    onSubmit={handleSubmit}
                                    className={clsx(classes.root, className)}
                                    {...rest}
                                >
                                    <Grid item container direction="column">
                                        <Grid item>
                                            <Grid item container spacing={2}>
                                                <Grid item>
                                                    <CallIcon />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1">{exhibitor.phone_number}</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item container spacing={2}>
                                                <Grid item>
                                                    <MailIcon />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1">{exhibitor.email}</Typography>
                                                </Grid>

                                            </Grid>
                                            <Grid item style={{ marginTop: "1em", marginBottom: "1em" }}>
                                                <TextField style={{ width: "100%" }}
                                                    error={Boolean(touched.message && errors.message)}
                                                    fullWidth
                                                    helperText={touched.message && errors.message}
                                                    id="outlined-multiline-static"
                                                    name="message"
                                                    label="Send Enquiry"
                                                    multiline
                                                    rows={4}
                                                    defaultValue="Write your message here..."
                                                    variant="outlined"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" type="submit">Send Enquiry</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                    </Formik>
                </TabPanel>
            </Dialog>
        </React.Fragment>
    )
}
Results.propTypes = {
    className: PropTypes.string,
    exhibitor: PropTypes.array.isRequired
};

Results.defaultProps = {
    exhibitor: []
};

export default Results;