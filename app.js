const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology:true})

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model('Article', articleSchema)

// ------------------ Routes for all articles ------------------ //
app.route('/articles')
    .get((req, res) => {
        Article.find((err, articles) => res.send(err?err:articles) )})

    .post((req, res) => {
        const {title, content} = req.body;

        const newArticle = new Article({ title,content })

        newArticle.save(err=>res.send(err?err:"Your article is submitted"))
    })

    .delete((req, res) => {
        Article.deleteMany((err)=>res.send(err?err:"all articles deleted"))
    })

// ------------------ Routes for a specific article ------------------ //
app.route("/articles/:titleParam")

    .get((req, res) => {
        const {titleParam} = req.params
        Article.findOne({title:titleParam}, (err, article) => {
            res.send(err?err:article)
        })
    })

    .put((req, res) => {
        const {title, content} = req.body
        const {titleParam} = req.params

        Article.update(
            {title:titleParam},
            {title, content},
            {overwrite: true}, // mongoDB by default has this enabled but not mongoose
            ( err ) => {res.send(err?err:`Successfully update ${titleParam}`)}
        )})

    .patch((req, res) => {
        const {title, content} = req.body
        const {titleParam} = req.params

        Article.update(
            {title: titleParam},
            {$set: req.body},
            (err)=>res.send(err?err:"Successfully updated the article")
        )
    })

    .delete((req, res) => {
        const {titleParam} = req.params 
        Article.deleteOne({title:titleParam}, (err) => res.send(err?err:`Deleted doc with title: ${titleParam}`))
    })

app.listen(3000,()=>{
    console.log("Server started on port 3000")
})
