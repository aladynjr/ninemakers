import React, { useEffect, useState } from 'react'
import { Divider } from '@mui/material';
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
var validator = require("email-validator");

function EmailSubscribe() {

    const [email, setEmail] = useState('');

    //add email to firebase 
    //add post to firebase 
    const emailsCollectionRef = collection(db, "subscription_emails");
    const AddEmail = async () => {
        setLoading(true);
        setLoading(true);
        await addDoc(emailsCollectionRef, {
            email: email,
            timestamp: serverTimestamp()
        });
        console.log('DB : email added');
        setLoading(false);
        setAlertMessage('Email added successfully');
        setAlertSeverity('success');
        setOpenAlert(true);

    };

    //alert 


    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [alertMessage, setAlertMessage] = useState('')

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    useEffect(() => {
        if (!openAlert) return
        //set open alert to false after 5 seconds 
        setTimeout(() => {
            document.getElementById('alertMessage').classList.add('fade-out')
        }, 1000)
        setTimeout(() => {
            setOpenAlert(false)
            document.getElementById('alertMessage').classList.remove('fade-out')

        }, 2500)

    }, [openAlert])

//loading 
const [loading, setLoading ] = useState(false)
    return (
        <div  >

            {(loading) && <div id='alertMessage' style={{ height: '150%', position:'absolute', top:'0'  }} className=' fade-in w-full h-screen fixed backdrop-blur-xl bg-black/50 z-50 -mt-12  ' >
                <div class="lds-dual-ring" style={{ position: 'sticky', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.7' }} ></div>
            </div>}

            <Divider style={{ background: 'lightgrey', opacity: '0.2', width: '70%', margin: 'auto', marginBottom: '120px' }} />


            <div class=" w-11/12 max-w-lg  " style={{ margin: '20px auto', position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', paddingBottom: '50px' }}>

                <div class='opacity-90 mb-10 text-lg' > Subscribe to The 99Makers Newsletter.</div>


                <div class="  flex "  >
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            borderRadius: '5px 0px 0px 5px', border: '#073581 solid 1.5px', borderRight: 'transparent solid',
                            margin: 'auto', marginRight: '-4px', height: '48px', boxShadow: 'none'
                        }}
                        class=" form-control block w-full px-3 py-1  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300   rounded  transition  ease-in-out   m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                        id="exampleFormControlInput1"
                        placeholder="Email address"
                    />

                    <button
                        type="button"
                        data-mdb-ripple="true"
                        onClick={() => { if(validator.validate(email)){AddEmail()} else {
                            setAlertMessage('Please enter a valid email address');
                            setAlertSeverity('error');
                            setOpenAlert(true);
                            
                        }  }}
                        data-mdb-ripple-color="light"
                        style={{ background: '#073581', borderRadius: '0px 5px 5px 0px', textTransform: 'none' }}
                        className="inline-block px-6 py-4 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out "
                    >Subscribe
                    </button>

                </div>
                <div class='text-xs w-full mt-4 opacity-90 '  >    Spam is gross and we won't send you any. You're free to unsubscribe at any time.</div>

            </div>



            {openAlert && <div id='alertMessage'>
                {alertSeverity == 'success' && <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-green-100 rounded-lg py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                    {alertMessage}
                </div>}

                {alertSeverity == 'error' && <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-110.28 0-200-89.72-200-200S145.72 56 256 56s200 89.72 200 200-89.72 200-200 200zm24-304h-48c-6.627 0-12 5.373-12 12v144c0 6.627 5.373 12 12 12h48c6.627 0 12-5.373 12-12V192c0-6.627-5.373-12-12-12zm0 192h-48v-48h48v48z"></path>
                    </svg>
                    {alertMessage}

                </div>}
            </div>}
        </div>
    )
}

export default EmailSubscribe