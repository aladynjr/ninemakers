import React from 'react'
import { ImArrowUp } from 'react-icons/im';
import { Link } from 'react-router-dom';

function PostCard({ post, upvotedPosts, UpvotePost, showTitle = true }) {
    return (
        <div>
            <div name='card' className=" block p-6 rounded-lg Xshadow-lg bg-white max-w-2xl">
                {/* <b> {post.postId + post.postTitle.split(" ").splice(0, 10).join(" ")}</b>  */}
 {/* <div className='mt-2 mr-2 flex flex-col px-3 py-1 rounded hover:bg-stone-100  cursor-pointer scale-90 '
                    style={{ border: '1px solid lightgrey', borderColor: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : 'lightgrey' }}
                    onClick={() => { UpvotePost(post.postId); }}>
                    <div style={{ width: 'fit-content' }}>
                        <ImArrowUp style={{ fontSize: '16px', color: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : 'lightgrey' }} /></div>
                    <span className=' text-xs py-1 font-semibold text-neutral-700'  > {post.upvotes}</span>
                </div> */}
                <div className='flex items-center lg:items-start'  >
                   

                    <div class="postVotes snipcss-i2sDb hover:bg-neutral-100 "  >
                        <div className=' px-4   cursor-pointer  '

                            onClick={() => { UpvotePost(post.postId); }}>

                            <div class="upvote " style={{ borderBottomColor: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : 'lightgrey' }}>
                            </div>
                            <span >
                                {post.upvotes}
                            </span>
                        </div>
                    </div>
                    <img src={post?.tagDetails?.tagUrl} className='mt-2 mr-6 rounded-md' style={{ width: '50px', height: '50px' }} alt="" />

                    <div name='title & content' className='-ml-2' >
                        <Link to={`/post/${post.postId + post.postTitle.split(" ").splice(0, 10).join(" ")}`}>

                            {showTitle && <h1 name='post title' className="text-gray-900 text-base leading-tight font-semibold text-left  ">
                                {post.postTitle}
                                <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                    style={{ backgroundColor: post?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                                    {post?.tagDetails?.tagName}
                                </span>
                            </h1>}
                        </Link>

                        <p name='post content' className="text-gray-700 text-left text-base mt-4 HideOnMobile " style={{ whiteSpace: 'pre-line' }}>
                            {post.postContent}
                        </p>
                    </div>
                </div>
                <p name='post content' className="text-gray-700 text-left text-base m-auto mt-4 HideOnDesktop" style={{ whiteSpace: 'pre-line' }}>
                    {post.postContent}
                </p>
            </div>

            <div style={{marginBlock:'70px'}} ></div>



            <div className='WebflowCardDesign' >
                <a className="div-block white-box w-inline-block snipcss-9bMbz " style={{width:'90%', maxWidth:'800px', margin:'auto'}} >
                    <div>
                        <img src={post?.tagDetails?.tagUrl} loading="lazy" width="50" alt="" />
                    </div>
                    <div class="div-block-2">
                        <h5 class="heading-2">
                            {post.postTitle}
                            <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                style={{ backgroundColor: post?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                                {post?.tagDetails?.tagName}
                            </span>
                        </h5>
                        <div class="text-block HideOnMobile">
                        {post.postContent}
                            </div>
                    </div>
                    <div>
                        <div class="upvote-box" onClick={() => { UpvotePost(post.postId); }}>
                            <div class="text-block-3" style={{ color: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : '#4b587c' }}>
                                ▲
                            </div>
                            <div class="text-block-2">
                                1591
                            </div>
                        </div>
                    </div>
                   
                </a>
                <div class="text-block HideOnDesktop" style={{width:'90%', textAlign:'left', margin:'auto'}}>
                        {post.postContent}
                            </div>
            </div>

                <div style={{marginBlock:'70px'}} ></div>

            <div className='WebflowCardDesign' >

                <Link className="div-block white-box w-inline-block snipcss-9bMbz " 
                style={{width:'100%', maxWidth:'800px', margin:'auto'}} 
                to={`/post/${post.postId + post.postTitle.split(" ").splice(0, 10).join(" ")}`}>
                <div class="postVotes snipcss-i2sDb hover:bg-neutral-100 "  >
                        <div className=' px-4   cursor-pointer  '

                            onClick={() => { UpvotePost(post.postId); }}>

                            <div class="upvote " style={{ borderBottomColor: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : 'lightgrey' }}>
                            </div>
                            <span >
                                {post.upvotes}
                            </span>
                        </div>
                    </div>
                    <div>
                        <img src={post?.tagDetails?.tagUrl} loading="lazy" width="50" alt="" />
                    </div>
                    <div class="div-block-2">
                        <h5 class="heading-2">
                            {post.postTitle}
                            <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                style={{ backgroundColor: post?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px', fontSize:'11px' }} >
                                {post?.tagDetails?.tagName}
                            </span>
                        </h5>
                        <div class="text-block HideOnMobile " style={{maxWidth:'500px'}} >
                        {post.postContent}
                            </div>
                    </div>

                   
                </Link>
                <div class="text-block HideOnDesktop" style={{width:'90%', textAlign:'left', margin:'auto'}}>
                        {post.postContent}
                            </div>
            </div>

        </div>
    )
}

export default PostCard