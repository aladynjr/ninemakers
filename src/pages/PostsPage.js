import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
import GetPosts from '../utilities/GetPosts';

function PostsPage() {
    //get tags 
    const [tags, setTags] = useState([
        {
        tagName: 'productivity',
        tagColor: 'limegreen'
    },
    {
        tagName: 'health',
        tagColor: 'red'
    }
]);


    //get posts from firebase 
    const [posts, setPosts] = useState([
        {
            postTitle: 'What is Productivity?',
            postContent: `Let's define productivity. Productivity is a measure of efficiency of a person completing a task. We often assume that productivity means getting more things done each day. Wrong. Productivity is getting important things done consistently. And no matter what you are working on, there are only a few things that are truly important. Being productive is about maintaining a steady, average speed on a few things, not maximum speed on everything.`,
            postTag: `productivity`
        },
        {
            postTitle: 'What is Health?',
            postContent: `Are you really Healthy? Health is a measure of efficiency of a person completing a task. We often assume that productivity means getting more things done each day. Wrong. Productivity is getting important things done consistently. And no matter what you are working on, there are only a few things that are truly important. Being productive is about maintaining a steady, average speed on a few things, not maximum speed on everything.`,
            postTag: `health`
        }
    ]);


    // useEffect(() => {
    //     GetTags(setTags);
    //     GetPosts(setPosts);
    // }, [])
    console.log({ posts })
    console.log({ tags })




    return (
        <div>

            {posts && <div>
                {posts.map((post) => {
                    return (
                        <div className="flex justify-center m-4 ">
                            <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">{post.postTitle}</h5>
                                {tags.map((tag) => {
                                    return (
                                        <div>
                                            {(tag.tagName == post.postTag) &&
                                                <div>
                                                    <b style={{ backgroundColor: (tag.tagColor), color: 'white' }} >{tag.tagName}</b>
                                                </div>}
                                        </div>
                                    )

                                })}
                                <p className="text-gray-700 text-left mb-4">
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