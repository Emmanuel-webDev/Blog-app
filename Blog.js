const exp = require('express');
const mongo = require('mongodb');
const path = require('path');

const app = exp();

const mdb = require('./data/database')

const ObjectId = mongo.ObjectId

app.set('views', path.join(__dirname, 'Frontend'))
app.set('view engine', 'ejs')

app.use(exp.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.render('index')
});

app.post('/allpost', async (req, res)=>{
const authid = new ObjectId(req.body.author);
const auth = await mdb.getdb().collection('authors').findOne({_id: authid});

    const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    date: new Date().toLocaleDateString(),
    author:{
        id: authid,
        name:auth.name,
        email: auth.email
    }
    }
    const result = await mdb.getdb().collection('posts').insertOne(newPost);
    res.redirect('/allpost')
});

app.get('/allpost', async (req,res)=>{
   const posts = await mdb.getdb().collection('posts').find({}, {title:1, summary:1, 'author.name':1}).toArray();
    res.render('all', {posts: posts})
})

app.get('/create', async (req, res)=>{
    const authorsdoc = await mdb.getdb().collection('authors').find().toArray();
   
    res.render('create', {auth: authorsdoc})
})

app.get('/post-details/:id', async(req, res)=>{
    const postid = req.params.id;
   const posted = await mdb.getdb().collection('posts').findOne({_id: new ObjectId(postid)}, {summary : 0})

   if(!posted){
       return "Error"
   }
   res.render('post-details', {post: posted});
})

app.get('/edit/:id',async(req, res)=>{
    const postid = req.params.id;
    const posted = await mdb.getdb().collection('posts').findOne({_id: new ObjectId(postid)}, {summary : 1, title:1, content:1})
    if(!posted){
        return "Error"
    }
    res.render('update', {post: posted});
})

app.post('/edit/:id/updated', async(req,res)=>{
    const postid = new ObjectId(req.params.id);
    const auth = await mdb.getdb().collection('posts').updateOne({_id: postid}, {$set:
        {
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content
            }

    });
res.redirect('/allpost')
    
})
app.post('/del/:id', async(req,res)=>{
    const postid = new ObjectId(req.params.id);
    const output = await mdb.getdb().collection('posts').deleteOne({_id: postid})
    res.redirect('/allpost')
})

mdb.connection().then(function (){
app.listen(3000)
});
    

