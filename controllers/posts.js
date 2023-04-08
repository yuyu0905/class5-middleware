const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const Post = require('../models/posts');
const User = require('../models/users');

const posts = {
    // 設計貼文的 GET API，並需設計篩選功能(從新到舊貼文、從舊到最新、關鍵字搜尋)
    async getPosts(req, res, next) {
        const { timeSort, q } = req.query;
        const sort = timeSort === "asc" ? "createdAt":"-createdAt"
        const keyword = !q ? {} : {"content": new RegExp(q)};
        
        const post = await Post.find(keyword).populate({
            path: "user",
            select: "name photo"
        }).sort(sort);
        // asc 遞增(由小到大，由舊到新) createdAt ; 
        // desc 遞減(由大到小、由新到舊) "-createdAt"

        successHandle(res, post);
    },

    // 設計貼文 POST API，圖片先傳固定 url
    async createPosts(req, res, next) {
        const { user, content, image } = req.body;
        if(!content) {
            return next(appError(400, "你沒有填寫 content 資料"))
        }
        const newPost = await Post.create(
            {
                user,
                content,
                image,
            }
        );
        successHandle(res, newPost);
    },
}

module.exports = posts;
