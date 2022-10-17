import React, { useState, useEffect, useRef, forwardRef } from 'react'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage, db } from "../firebase-config";
import { TwitterPicker } from 'react-color'
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc, onSnapshot, query, orderBy

} from "firebase/firestore";
import GetTags from '../utilities/GetTags'
import { AiFillTags } from 'react-icons/ai'
import { LoadingButton } from '@mui/lab'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



function AdminPage() {

    function RandomNumber() {
        return Math.floor(1000 + Math.random() * 9000)
    }



    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);


    //generate a random four chars number
    const [loading, setLoading] = useState(false);

    const uploadFile = () => {
        //check if all fields are filled
        if (!imageUpload || !tagName || !tagColor) {
            setAlertMessage('Please fill all fields')
            setAlertSeverity('error')
            setOpenAlert(true)

            return
        }


        setLoading(true);

        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + RandomNumber()}`);
        uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        setImageUrl(url);
                        createQuestion(url);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);

                        setAlertMessage('Error uploading image');
                        setAlertSeverity('error');
                        setOpenAlert(true);
                    }
                    );
            })

    };

    //tag color 
    const [tagColor, setTagColor] = useState('limegreen');

    const handleChangeComplete = (color) => {
        if (!color) return;
        setTagColor(color?.hex);
    };
    console.log({ tagColor })

    //tag name 
    const [tagName, setTagName] = useState('Tag Name');


    //ADD TAG TO FIREBASE 

    const tagsCollectionRef = collection(db, "tags");
    const createQuestion = async (imageUrl) => {
        await addDoc(tagsCollectionRef, {
            tagName: tagName,
            tagColor: tagColor,
            tagUrl: imageUrl
        });
        console.log('%c TAG ADDED', 'color: green; font-weight: bold;')

        setAlertMessage('Tag Added Successfully ');
        setAlertSeverity('success');
        setOpenAlert(true);

        setLoading(false);
    };

    //get tags 
    const [tags, setTags] = useState(null);
    useEffect(() => {
        GetTags(setTags)
    }, [])

    //edit tags 
    const [editTagName, setEditTagName] = useState(null);
    const [editTagColor, setEditTagColor] = useState(null);
    const [editTagUrl, setEditTagUrl] = useState('');
    const [selectedTagId, setSelectedTagId] = useState(null);

    const handleEditChangeComplete = (color) => {
        if (!color) return
        setEditTagColor(color?.hex);
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
        }, 5000)
        setTimeout(() => {
            setOpenAlert(false)
            document.getElementById('alertMessage').classList.remove('fade-out')

        }, 6500)

    }, [openAlert])

    //form validation
    const [formError, setFormError] = useState('');

    return (
        <div style={{ paddingTop: '50px', paddingBottom: '100px' }} >
            {loading && <div id='alertMessage' className=' fade-in w-full h-screen fixed backdrop-blur-xl bg-black/50 z-50 -mt-12  ' >
                <div class="lds-dual-ring" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.7' }} ></div>
            </div>}
            <div className="flex justify-center flex-col flex-wrap items-stretch" style={{ maxWidth: '900px', margin: 'auto' }} >

                <h1 className='text-2xl w-[90%] max-w-2xl text-left mb-8 ml-6 ' >Create a Tag</h1>
                <div className='flex flex-wrap' >
                    <div className='m-auto' >
                        <div className="mb-6  w-[90%] max-w-sm" style={{ margin: '20px auto' }}>
                            <p htmlFor="exampleFormControlInput1"
                                className="form-label inline-block mb-2 text-gray-700 text-left w-full "
                            >Tag Name</p>
                            <input
                                value={tagName} onChange={(e) => setTagName(e.target.value)}
                                type="text" className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleFormControlInput1"
                                placeholder="Productivity"
                            />
                        </div>


                        <div className="mb-6 w-[90%] max-w-sm" style={{ margin: '20px auto' }}>
                            <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700 w-full text-left">
                                Upload Tag Image</label>
                            <input
                                // onClick={() => { uploadFile() }}
                                onChange={(event) => {
                                    setImageUpload(event.target.files[0]);
                                }}
                                className="form-control w-full block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" />
                        </div>
                    </div>


                    <div className='m-auto ' style={{ marginBottom: '-56px' }} >

                        <div className='px-6  max-w-sm flex items-center w-full ' style={{ maxWidth: '240px', margin: '20px auto' }} >
                            <img style={{ width: '50px', height: '50px', margin: 'auto',/* borderRadius: '100%', */ objectFit: 'cover'/*, backgroundColor: tagColor, padding: '2px'*/ }} src={imageUpload ? URL.createObjectURL(imageUpload) : 'https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc='} />
                            <div className='w-[90%] max-w-sm text-white text-sm rounded-3xl py-1 px-3  ' style={{ backgroundColor: tagColor, width: tagName ? 'fit-content' : '100px', minWidth: '80px', minHeight: '28px' }} >{tagName}</div>
                        </div>


                        <div className='mb-12 mt-6'  >
                            <TwitterPicker
                                color={tagColor}
                                onChangeComplete={handleChangeComplete}
                                triangle={'top-right'}
                            />

                        </div>
                    </div>
                </div>
            </div>


            <button type="button"
                style={{ marginTop: '66px' }}
                onClick={() => { uploadFile() }}

                class="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  focus:shadow-lg transition duration-150 ease-in-out">
                Create Tag
            </button>


            {/* <LoadingButton
                        loading={loading} variant='contained' color='success' endIcon={<AiFillTags />}
                        disableRipple={true}
                        style={{ marginTop: '66px' }}
                        onClick={() => { uploadFile() }}
        
                    > Create Tag</LoadingButton> */}

            {/* <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar> */}

            {openAlert && <div id='alertMessage'>
                {alertSeverity == 'success' && <div style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-green-100 rounded-lg py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                    {alertMessage}
                </div>}

                {alertSeverity == 'error' && <div style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-110.28 0-200-89.72-200-200S145.72 56 256 56s200 89.72 200 200-89.72 200-200 200zm24-304h-48c-6.627 0-12 5.373-12 12v144c0 6.627 5.373 12 12 12h48c6.627 0 12-5.373 12-12V192c0-6.627-5.373-12-12-12zm0 192h-48v-48h48v48z"></path>
                    </svg>
                    {alertMessage}

                </div>}
            </div>}

            {/* <button
                onClick={() => { uploadFile() }}
                type="button"
                data-mdb-ripple="true"
                style={{marginTop:'66px'}}
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >Create Tag</button> */}



             {tags && <div>
                {tags.map((tag, i) => {
                    return (
                        <div key={i}>
                            <img style={{ width: '100px', margin: 'auto' }} src={(tag?.tagUrl)} width={'100'} alt="" />
                            <p style={{ color: tag.tagColor }} >{tag.tagName}</p>
                            <button onClick={() => {
                                setSelectedTagId(tag.id)
                                setEditTagColor(tag.tagColor)
                                setEditTagName(tag.tagName)
                                setEditTagUrl(tag.tagUrl)
                            }} type="button" class="px-6 py-2.5 bg-orange-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Launch Edit modal
                            </button>
                            <button onClick={() => {
                                 const Doc = doc(db, "tags", tag.id);
                                 deleteDoc(Doc);
                                 tags.filter((item) => item.tagName !== tag.tagName)

                            }} type="button" class="px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                Delete
                            </button>

                        </div>
                    )
                })}
            </div>} 



            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog relative w-auto pointer-events-none">
                    <div
                        class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div
                            class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Modal title</h5>
                            <button type="button"
                                class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body relative p-4">
                            <div className="mb-6 xl:w-96">
                                <label htmlFor="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700"
                                >Edit Tag Name</label>
                                <input
                                    defaultValue={editTagName} value={editTagName} onChange={(e) => setEditTagName(e.target.value)}
                                    type="text" className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleFormControlInput1"
                                    placeholder="Productivity"
                                />
                            </div>

                            <div className="flex justify-center  ">
                                <TwitterPicker
                                    color={editTagColor || tagColor}
                                    onChangeComplete={handleEditChangeComplete}
                                />
                            </div>
                        </div>
                        <div
                            class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button type="button" class="px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out" data-bs-dismiss="modal">Close</button>
                            <button type="button"
                                onClick={() => {
                                    updateDoc(doc(db, "tags", selectedTagId), { tagName: editTagName, tagColor: editTagColor })
                                        .then(() => {
                                            console.log("Document successfully updated!");
                                        })

                                }} class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AdminPage