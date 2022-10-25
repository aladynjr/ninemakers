const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');

var app = admin.initializeApp();

// Getting and replacing meta tags
exports.preRender = functions.https.onRequest((request, response) => {

    // Error 404 is false by default
    let error404 = false;

    // Getting the path
    const path = request.path ? request.path.split('/') : request.path;
    // path[0] = erikmartinjordan.com path[1] = kpis
    // path[0] = erikmartinjordan.com path[1] = projects
    // ...

    // Getting index.html text
    let index = fs.readFileSync('./web/index.html').toString();
    // Changing metas function
    const setMetas = (title, description) => {

        index = index.replace('{{title}}', title);
        index = index.replace('{{description}}', description);

    }

    // Navigation menu
    if (path[1] === '') {
        setMetas('99Makers - Learn how people are starting successful businesses');
        response.send(index);

    }
    else if (path[1] === 'post') {

        //get post title and description from url which are after posts/ in the url
        const postTitle = path[2];
        //get post description from url (first 10 chars in postTitle are postId )
        const postId = postTitle.substring(0, 10);
        //get post form firebase using postId (where query) 
        console.log('got postId : ' + postId)
        const post = admin.firestore().collection('posts').where('postId', '==', postId).get()
            .then((data) => {
                data.docs.map((document) => {
                    //set metas
                    setMetas(document.data().postTag + ' - ' + document.data().postTitle,
                    document.data().upvotes + ' votes. ' + document.data().postContent);
                    console.log('got post from firebase : ' + document.data().postTitle);
                })
            })

            //send index 
            .then(() => {
                response.send(index);
            })

            .catch((error) => {
                console.log(error);
            }
            );

        //another method to get description frmo the page content





    }else if(path[1] === 'create'){
        setMetas('Create a post - 99Makers', 'Create a post - 99Makers');
        response.send(index);
    }
    else if(path[1] === 'admin'){
        setMetas('Admin - 99Makers', 'Admin - 99Makers');
        response.send(index);
    } else if(path[1] === 'emails'){
        setMetas('Emails - 99Makers', 'Emails - 99Makers');
        response.send(index);
    }
     else {
        response.send(index);

    }


    // We need to considerate the routes and a default state to 404 errors as well
    // ...



    // Sending index.html    
    // error404
    //     ? response.status(400).send(index)
    //     : response.status(200).send(index);

});
