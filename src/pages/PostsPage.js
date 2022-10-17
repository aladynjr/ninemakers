import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
import GetPosts from '../utilities/GetPosts';

function PostsPage() {
    //get tags 
    const [tags, setTags] = useState([]);


    //get posts from firebase 
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        GetTags(setTags);
        GetPosts(setPosts);
    }, [])
    console.log({ posts })
    console.log({ tags })

    const [postsWithTags, setPostsWithTags] = useState([]);
    //merge posts with tags if tag in post  postTag and tag name in tag tagName are the same 
    useEffect(() => {
        if (!posts || !tags) return;
        const postsWithTags = posts.map(post => {
            const postTag = post.postTag;
            const tagDetails = tags.find(tag => tag.tagName === postTag);
            return {
                ...post,
                tagDetails
            }
        })
        setPostsWithTags(postsWithTags);

    }, [posts, tags])
    console.log({ postsWithTags })
    return (
        <div>

            {postsWithTags && <div>
                {postsWithTags.map((post) => {
                    return (
                        <div className="flex justify-center m-4 ">
                            <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                                    <div className="text-gray-900 text-base leading-tight font-semibold text-left ">
                                        {post.postTitle}
                                        <span className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                            style={{ backgroundColor: post.tagDetails.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content' }} >
                                            {post.tagDetails.tagName}
                                        </span>
                                    </div>


                                <img src={post?.tagDetails?.tagUrl} style={{ width: '50px', height: '50px' }} alt="" />
                                <p className="text-gray-700 text-left mb-4" style={{ whiteSpace: 'pre-line' }}>
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