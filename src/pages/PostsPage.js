import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
import GetPosts from '../utilities/GetPosts';
import { ImArrowUp } from 'react-icons/im'
function PostsPage() {
    //get tags 
    const [tags, setTags] = useState([]);


    //get posts from firebase 
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        GetTags(setTags);
        GetPosts(setPosts);
    }, [])


    const [postsWithTags, setPostsWithTags] = useState([]);
    //merge posts with tags if tag in post  postTag and tag name in tag tagName are the same 
    useEffect(() => {
        if (!posts || !tags) return;
        const postsWithTags = posts.map(post => {
            const postTag = post.postTag.id;
            const tagDetails = tags.find(tag => tag.id === postTag);
            return {
                ...post,
                tagDetails
            }
        })
        setPostsWithTags(postsWithTags);

    }, [posts, tags])

    //upvoting 
    const [postUpvotes, setPostUpvotes] = useState(0);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    useEffect(() => {
        setUpvotedPosts(JSON.parse(localStorage.getItem('upvotedPosts')) || []);
        if (!upvotedPosts) {
            localStorage.setItem('upvotedPosts', JSON.stringify([]));
        }
    }, [])

    function UpvotePost(postId) {
        //if post is already upvoted remove it from upvoted posts state then update local storage, if its not add it to state and local storage 
        if (upvotedPosts.includes(postId)) {

            setUpvotedPosts(upvotedPosts.filter(post => post !== postId));
            localStorage.setItem('upvotedPosts', JSON.stringify(upvotedPosts.filter(post => post !== postId)));

            UpdateUpvotesInFirebase(postId, -1);

        }
        else {
            setUpvotedPosts([...upvotedPosts, postId]);
            localStorage.setItem('upvotedPosts', JSON.stringify([...upvotedPosts, postId]));
            UpdateUpvotesInFirebase(postId, 1);
        }

    }

    const UpdateUpvotesInFirebase = async (postId, value) => {
        //get all posts again as a promise
        const data = getDocs(collection(db, "posts"), where("id", "==", postId))
            .then((data) => {
                data.docs.map((document) => {
                    //increment this post's upvotes by 1

                    updateDoc(doc(db, "posts", postId), {
                        upvotes: document.data().upvotes + value
                    })
                    console.log('DB : post updated ')
                })

            });
    }


    return (
        <div style={{ paddingTop: '50px', paddingBottom: '100px' }}>

            <h1 className='text-2xl w-[90%] max-w-2xl text-left mb-8 ml-6  ' style={{ margin: 'auto' }} >  Posts</h1>

            {postsWithTags && <div>
                {postsWithTags.map((post) => {
                    var postUpvotes = (post.upvotes);
                    if (upvotedPosts.includes(post.id)) {
                        postUpvotes = postUpvotes + 1;
                    }

                    return (
                        <div name='Card Container' className=" flex justify-center m-auto my-6 w-11/12 ">
                            <div name='card' className=" block p-6 rounded-lg Xshadow-lg bg-white max-w-2xl">
                                <div className='flex items-center lg:items-start'  >
                                    <div className='mt-4 mr-4 flex flex-col '>
                                        <div style={{ width: 'fit-content' }}
                                            className='hover:bg-stone-100 p-1 rounded-lg cursor-pointer'
                                            onClick={() => { UpvotePost(post.id) }}
                                        >
                                            <ImArrowUp style={{ fontSize: '20px', color: upvotedPosts.includes(post.id) ? 'rgb(239 68 68)' : 'lightgrey' }} /></div>
                                        <span className=' text-sm  my-1 font-semibold' >{postUpvotes}</span>
                                    </div>
                                    <img src={post?.postTag?.tagUrl} className='mt-2 mr-6 rounded-md' style={{ width: '50px', height: '50px' }} alt="" />

                                    <div name='title & content' >
                                        <div name='post title' className="text-gray-900 text-base leading-tight font-semibold text-left ">
                                            {post.postTitle}
                                            <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                                style={{ backgroundColor: post?.postTag?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                                                {post.postTag.tagName}
                                            </span>
                                        </div>

                                        <p name='post content' className="text-gray-700 text-left text-base mt-4 HideOnMobile " style={{ whiteSpace: 'pre-line' }}>
                                            {post.postContent}
                                        </p>
                                    </div>
                                </div>
                                <p name='post content' className="text-gray-700 text-left text-base m-auto mt-4 HideOnDesktop" style={{ whiteSpace: 'pre-line' }}>
                                    {post.postContent}
                                </p>
                            </div>

                        </div>
                    )
                })}
            </div>}

        </div>
    )
}

export default PostsPage