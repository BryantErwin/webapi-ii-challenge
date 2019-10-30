const express = require('express');
const server = express();
const postsRouter = require('./data/posts/postsRouter');

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<P>Welcome to my API</P>`);
});

server.use('/api/post', postsRouter);

const port = 4000;
server.listen(port, () => {
    console.log('Server is live on port 4000')
})
