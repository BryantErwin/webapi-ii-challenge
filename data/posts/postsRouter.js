const router = require('express').Router();
const Posts = require('../db');

router.post('/', (req, res) => {
    const post = req.body;
    if (!post.title || post.contents){
        res.status(400).json({errorMessage: "Please provide title and content for the post."})
    }
    Posts.insert(post)
        .then((id) => {
            res.status(201).json(post);
        })
        .catch((err) => {
            res.status(500).json({error:"There was an error while saving the post to the database."})
        });
});

router.post('/:id/comments', (req, res) => {
    const comments = req.body;
    if(!comments.postID){
        res.status(404).json({message:"The post with the specified ID does not exist"})
    }
    if(!comments.text){
        res.status(400).json({errorMessage:"Please provide text for the comment."})
    }
    Posts.insertComment(comments)
        .then((id) => {
            res.status(201).json(comments)
        })
        .catch((err) => {
            res.status(500).json({error: "There was an error while saving the comment to the database "})
        })
});

router.get('/', (req,res) => {
    Posts.find().then((postsList) => {
        res.status(201).json(postsList)
    })
        .catch((err) => {
            res.status(500).json({error:"The posts information could not be retrieved."})
        })
});

router.get('/:id', (req,res) => {
    const id = req.params.id;
    Posts.findById(id).then((post) => {
        if(post === []){
            return res.status(404).json({message:"The post with the specified ID does not exist."})
        } else{
            res.status(201).json(post);
        }
    })
        .catch((err) => {
            res.status(500).json({error:"The post information could not be retrieved."})
        })
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    Posts.findPostComments(id).then((comments) => {
        if(comments === []){
            return res.status(404).json({message: "The post with the specified ID does not exist."})
        }else{
            res.status(201).json(comments)
        }
    })
        .catch((err) => {
            res.status(500).json({error:"The comments information could not be retrieved."})
        })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Posts.findById(id).then((returnVal) => {
        if(returnVal === []) {
            return res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
        .catch(err => console.log(err));
    Posts.remove(id).then((postList) => {
        res.status(201).json(postList)
    })
        .catch((err) => {
            res.status(500).json({error:"The post could not be removed"})
        })
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const post = req.body;
    Posts.findById(id).then((returnVal) => {
        if(returnVal === []){
            return res.status(404).json({message:"The post with the specified ID does not exist."})
        }
    })
        .catch(err => console.log(err))

    if(!post.title || !post.contents){
        res.status(404).json({errorMessage:"Please provide title and contents for the post."})
    }
    Posts.update(id, post).then((post) => {
        res.status(200).json(post)
    })
        .catch((err) => {
            res.status(500).json({error:"The post information could not be modified."})
        })
})


module.exports = router;