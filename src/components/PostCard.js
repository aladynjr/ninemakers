import React from 'react'
import { ImArrowUp } from 'react-icons/im';
import { Link } from 'react-router-dom';

function PostCard({ post, upvotedPosts, UpvotePost, showTitle = true }) {
    return (
        <div>



            <div className='WebflowCardDesign' >

                <div className="div-block white-box w-inline-block snipcss-9bMbz "
                    style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}
                  >
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
                            <Link
                                to={`/post/${post.postId + post.postTitle.split(" ").splice(0, 10).join(" ")}`}>         {post.postTitle}  </Link>
                            <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                style={{ backgroundColor: post?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '0px', fontSize: '11px', padding: '1px 8px' }} >
                                {post?.tagDetails?.tagName}
                            </span>
                        </h5>
                        <div class="text-block HideOnMobile " style={{ maxWidth: '500px' }} >
                            {post.postContent}
                        </div>
                    </div>



                </div>
                <div class="text-block HideOnDesktop" style={{ width: '90%', textAlign: 'left', margin: 'auto' }}>
                    {post.postContent}
                </div>
            </div>

        </div>
    )
}

export default PostCard