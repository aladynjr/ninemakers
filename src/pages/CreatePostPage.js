import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {Helmet} from "react-helmet";
function CreatePostPage() {

function Random10CharsCode(){
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

    //get tags 
    const [tags, setTags] = useState([]);

    console.log({ tags })

    useEffect(() => {
        GetTags(setTags);
    }, [])

    //Create post form 
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postTag, setPostTag] = useState(null);

    //add post to firebase 
    const postsCollectionRef = collection(db, "posts");
    const CreatePost = async () => {
        setLoading(true);
        await addDoc(postsCollectionRef, {
            postTitle: postTitle,
            postContent: postContent,
            postTag: postTag,
            postDate: serverTimestamp(),
            upvotes: 0,
            postId : Random10CharsCode()
        });
        console.log('DB : post added');
        setLoading(false);
        setAlertMessage('Post added successfully');
        setAlertSeverity('success');
        setOpenAlert(true);

    };

    const [showTagsMenu, setShowTagsMenu] = useState(false);
    useEffect(() => {
        if (showTagsMenu) {
            //add 'transform opacity-100 scale-100' to element with id tagsMenu 
            document.getElementById('tagsMenu').classList.add('transform', 'opacity-100', 'scale-100');
            document.getElementById('tagsMenu').classList.remove('pointer-events-none');

        }
        if (!showTagsMenu) {
            document.getElementById('tagsMenu').classList.remove('transform', 'opacity-100', 'scale-100');
            document.getElementById('tagsMenu').classList.add('transform', 'opacity-0', 'scale-95','pointer-events-none');


        }
    }, [showTagsMenu])

    //loading 
    const [loading, setLoading] = useState(false);

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

        

    return (
        <div style={{ paddingTop: '50px', paddingBottom: '200px' }} className='animate__animated animate__fadeInDown'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>99Makers - Create Post </title>
                <link rel="canonical" href={"/create"} />
            </Helmet>
            {(loading) && <div id='alertMessage' style={{height:'100%'}} className=' fade-in w-full h-screen fixed backdrop-blur-xl bg-black/50 z-50 -mt-12  ' >
                <div class="lds-dual-ring" style={{ position: 'sticky', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.7' }} ></div>
            </div>}

            <div class="flex justify-center flex-col " style={{ maxWidth: '600px', margin: 'auto', width: '90%' }}  >
                <h1 className='text-2xl w-[90%] max-w-2xl text-left mb-8 ml-6 ' >Create a Post</h1>

                <div class="mb-3 w-11/12" style={{ margin: '20px auto' }}>
                    <label for="exampleFormControlInput1" class="form-label inline-block mb-2 text-gray-700 w-full text-left"
                    >Post Title</label>
                    <input
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        type="text"
                        class=" form-control block w-full px-3 py-2  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300   rounded  transition  ease-in-out   m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                        id="exampleFormControlInput1"
                        placeholder="Your Title"
                    />
                </div>

                <div class="mb-3 w-11/12" style={{ margin: '30px auto', marginTop: '0' }}  >
                    <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700 w-full text-left "
                    >Post Content</label>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        class="  form-control  block   w-full   px-3   py-3 text-base   font-normal   text-gray-700   bg-white bg-clip-padding    border border-solid border-gray-300   rounded   transition   ease-in-out   m-0   focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                        id="exampleFormControlTextarea1"
                        rows="6"
                        placeholder="Your Post Content"
                    ></textarea>
                </div>

                <div className='flex items-center justify-between ChooseTagAndButtonResponsiveness' style={{ maxWidth: '600px', margin: 'auto', width: '90%' }} >
                    <ClickAwayListener onClickAway={() => { setShowTagsMenu(false) }}>

                        <div class="relative inline-block text-left ChooseTagResponsiv ">
                            <div>
                                <button type="button"
                                    onClick={() => { if (showTagsMenu) { setShowTagsMenu(false) } else { setShowTagsMenu(true) } }}
                                    class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 w-48 " id="menu-button" aria-expanded="true" aria-haspopup="true"
                                    style={{ backgroundColor: postTag ? (postTag.tagColor) : '', color: postTag ? 'white' : 'grey', minWidth: '80px', minHeight: '28px' }}
                                >
                                    {postTag ? (postTag.tagName) : 'Choose a Tag'}
                                    {/* <!-- Heroicon name: mini/chevron-down --> */}
                                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div id="tagsMenu" class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div class="py-1" role="none">
                                    {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}

                                    {tags.map((tag, i) => {
                                        return (
                                            <div className='flex hover:bg-gray-100 hover:text-gray-900 w-4/5 m-auto' style={{ cursor: 'pointer' }} onClick={() => { setPostTag(tag.TagName); setShowTagsMenu(false) }} >
                                                <button
                                                    class="text-white block px-4 py-1 my-2 text-sm  w-full text-left rounded-3xl" style={{ backgroundColor: (tag.tagColor), width: 'fit-content', minWidth: '80px', minHeight: '28px' }} role="menuitem" tabindex="-1" id="menu-item-0"
                                                >
                                                    {tag.tagName}
                                                </button>

                                                <img style={{ width: '25px', height: '25px', margin: 'auto', objectFit: 'cover', marginRight: '10px' }} src={tag.tagUrl} />

                                            </div>

                                        )
                                    })}


                                </div>
                            </div>
                        </div>
                    </ClickAwayListener>

                    <div>


                        <button
                            onClick={() => { 
                                if (postTitle && postContent && postTag) {
                                    CreatePost()
                                } else {
                                    setAlertMessage('Please fill all the fields');
                                    setAlertSeverity('error');
                                    setOpenAlert(true);
                                }
                            
                               
                             }}
                            type="button"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"

                            className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out animate__animated animate__fadeInDown animate__delay-1s"
                        >Create Post</button>
                    </div>

                </div>


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

export default CreatePostPage