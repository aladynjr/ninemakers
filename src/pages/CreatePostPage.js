import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
function CreatePostPage() {

    //get tags 
    const [tags, setTags] = useState([]);

    console.log({ tags })
    
    useEffect(() => {
        GetTags(setTags);
    }, [])

    //Create post form 
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postTag, setPostTag] = useState([]);

    //add post to firebase 
    const postsCollectionRef = collection(db, "posts");
    const CreatePost = async () => {
        await addDoc(postsCollectionRef, {
            postTitle: postTitle,
            postContent: postContent,
            postTag: postTag,
            postDate: serverTimestamp(),
            upvotes : 0
        });
        console.log('DB : post added');
    };

    return (
        <div>

            <div class="flex justify-center">
                <div class="mb-3 xl:w-96">
                    <label for="exampleFormControlInput1" class="form-label inline-block mb-2 text-gray-700"
                    >Post Title</label>
                    <input
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        type="text"
                        class=" form-control block w-full px-3 py-1.5  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300   rounded  transition  ease-in-out   m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                        id="exampleFormControlInput1"
                        placeholder="Your Title"
                    />
                </div>
            </div>

            <div class="flex justify-center">
                <div class="mb-3 xl:w-96">
                    <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700"
                    >Post Content</label>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        class="  form-control  block   w-full   px-3   py-1.5 text-base   font-normal   text-gray-700   bg-white bg-clip-padding    border border-solid border-gray-300   rounded   transition   ease-in-out   m-0   focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                        id="exampleFormControlTextarea1"
                        rows="3"
                        placeholder="Your Post Text"
                    ></textarea>
                </div>



            </div>
            {tags && <div>


                <label for="large" class="block mb-2 text-base font-medium text-gray-900 dark:text-gray-400">Choose a Tag</label>
                <select
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                    id="large" class="block py-3 px-4 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                    {tags.map((tag, i) => {
                        return (
                            <option key={i} value={tag.tagName} >{tag.tagName}</option>
                        )

                    })}

                </select>
            </div>}

            <button
                onClick={() => { CreatePost() }}
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >Create Post</button>
        </div>
    )
}

export default CreatePostPage