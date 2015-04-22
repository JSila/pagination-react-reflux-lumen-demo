(function(React, Reflux, ReactRouter, request)  {

    var $__0=       ReactRouter,Route=$__0.Route,RouteHandler=$__0.RouteHandler,Link=$__0.Link,State=$__0.State,HistoryLocation=$__0.HistoryLocation,DefaultRoute=$__0.DefaultRoute;

    var ArticlesActions = Reflux.createActions([
        'getArticles', 'getArticleComments'
    ]);

    var ArticlesStore = Reflux.createStore({
        listenables: [ArticlesActions],
        onGetArticles:function(url, pageNumber) {
            request.get(url + '?page=' + pageNumber)
                .success(function(data)  {
                    this.trigger({
                        articles: data.data,
                        current_page: data.current_page,
                        last_page: data.last_page,
                        next_page_url: data.next_page_url,
                        prev_page_url: data.prev_page_url
                    });
                }.bind(this));
        },
        onGetArticleComments:function(url, articleId, pageNumber) {
            request.get(url + '/'+ articleId +'/comments?page=' + pageNumber)
                .success(function(data)  {
                    this.trigger({
                        comments: data.data,
                        current_page: data.current_page,
                        last_page: data.last_page,
                        next_page_url: data.next_page_url,
                        prev_page_url: data.prev_page_url
                    });
                }.bind(this));
        }
    });

    var ____Class1u=React.Component;for(var ____Class1u____Key in ____Class1u){if(____Class1u.hasOwnProperty(____Class1u____Key)){App[____Class1u____Key]=____Class1u[____Class1u____Key];}}var ____SuperProtoOf____Class1u=____Class1u===null?null:____Class1u.prototype;App.prototype=Object.create(____SuperProtoOf____Class1u);App.prototype.constructor=App;App.__superConstructor__=____Class1u;function App(){"use strict";if(____Class1u!==null){____Class1u.apply(this,arguments);}}
        Object.defineProperty(App.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            return React.createElement(RouteHandler, React.__spread({},  this.props));
        }});
    

    var Index = React.createClass({displayName: "Index",
        mixins: [Reflux.connect(ArticlesStore)],
        getInitialState:function() {
            return {
                articles: [],
                current_page: null,
                last_page: null,
                next_page_url: null,
                prev_page_url: null
            };
        },
        propTypes: {
            url: React.PropTypes.string.isRequired
        },
        getArticles:function(pageNumber) {      
            ArticlesActions.getArticles(this.props.url, pageNumber);
        },
        componentDidMount:function() {
            this.getArticles(1);
        },
        render:function() {
            return (
                React.createElement("div", {className: "container"}, 
                    React.createElement(Pagination, {
                        baseUrl: this.props.url, 
                        currentPage: this.state.current_page, 
                        totalPages: this.state.last_page, 
                        nextPageUrl: this.state.next_page_url, 
                        previousPageUrl: this.state.prev_page_url, 
                        getData: this.getArticles}), 
                    React.createElement(ArticlesList, {articles: this.state.articles})
                )
            );
        }
    });

    var ____Class1v=React.Component;for(var ____Class1v____Key in ____Class1v){if(____Class1v.hasOwnProperty(____Class1v____Key)){ArticlesList[____Class1v____Key]=____Class1v[____Class1v____Key];}}var ____SuperProtoOf____Class1v=____Class1v===null?null:____Class1v.prototype;ArticlesList.prototype=Object.create(____SuperProtoOf____Class1v);ArticlesList.prototype.constructor=ArticlesList;ArticlesList.__superConstructor__=____Class1v;function ArticlesList(){"use strict";if(____Class1v!==null){____Class1v.apply(this,arguments);}}
        Object.defineProperty(ArticlesList.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            return (
                React.createElement("div", {className: "article-list"}, 
                    this.props.articles.map(function(article)  {return React.createElement(Article, {key: article.id, article: article});})
                )
            )
        }});
    

    var ____Class1w=React.Component;for(var ____Class1w____Key in ____Class1w){if(____Class1w.hasOwnProperty(____Class1w____Key)){CommentsList[____Class1w____Key]=____Class1w[____Class1w____Key];}}var ____SuperProtoOf____Class1w=____Class1w===null?null:____Class1w.prototype;CommentsList.prototype=Object.create(____SuperProtoOf____Class1w);CommentsList.prototype.constructor=CommentsList;CommentsList.__superConstructor__=____Class1w;function CommentsList(){"use strict";if(____Class1w!==null){____Class1w.apply(this,arguments);}}
        Object.defineProperty(CommentsList.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            return (
                React.createElement("div", {className: "comment-list"}, 
                    this.props.comments.map(function(comment)  {return React.createElement(Comment, {key: comment.id, comment: comment});})
                )
            )
        }});
    

    var ____Class1x=React.Component;for(var ____Class1x____Key in ____Class1x){if(____Class1x.hasOwnProperty(____Class1x____Key)){Article[____Class1x____Key]=____Class1x[____Class1x____Key];}}var ____SuperProtoOf____Class1x=____Class1x===null?null:____Class1x.prototype;Article.prototype=Object.create(____SuperProtoOf____Class1x);Article.prototype.constructor=Article;Article.__superConstructor__=____Class1x;function Article(){"use strict";if(____Class1x!==null){____Class1x.apply(this,arguments);}}
        Object.defineProperty(Article.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            var article = this.props.article;
            return (
                React.createElement("article", null, 
                    React.createElement("h1", {className: "entry-title"}, React.createElement(Link, {to: "single", params: article, article: article}, article.title)), 
                    React.createElement("div", {className: "entry-content"}, article.content)
                )
            )
        }});
    

    var ____Class1y=React.Component;for(var ____Class1y____Key in ____Class1y){if(____Class1y.hasOwnProperty(____Class1y____Key)){Comment[____Class1y____Key]=____Class1y[____Class1y____Key];}}var ____SuperProtoOf____Class1y=____Class1y===null?null:____Class1y.prototype;Comment.prototype=Object.create(____SuperProtoOf____Class1y);Comment.prototype.constructor=Comment;Comment.__superConstructor__=____Class1y;function Comment(){"use strict";if(____Class1y!==null){____Class1y.apply(this,arguments);}}
        Object.defineProperty(Comment.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            var comment = this.props.comment;
            return (
                React.createElement("article", null, 
                    React.createElement("h1", {className: "comment-title"}, comment.name), 
                    React.createElement("div", {className: "comment-content"}, comment.content)
                )
            )
        }});
    
    var Single = React.createClass({displayName: "Single",
        mixins: [Reflux.connect(ArticlesStore)],
        getInitialState:function() {
            return {
                comments: [],
                current_page: null,
                last_page: null,
                next_page_url: null,
                prev_page_url: null
            };
        },
        contextTypes: {
            router: React.PropTypes.func
        },
        getArticleComments:function(pageNumber) {
            ArticlesActions.getArticleComments(this.props.url, this.context.router.getCurrentParams().id, pageNumber);
        },
        componentDidMount:function() {
            this.getArticleComments(1);
        },
        render:function() {
            console.log(this.props);
            return (
                React.createElement("div", {className: "container"}, 
                    React.createElement(Pagination, {
                        baseUrl: this.props.url, 
                        currentPage: this.state.current_page, 
                        totalPages: this.state.last_page, 
                        nextPageUrl: this.state.next_page_url, 
                        previousPageUrl: this.state.prev_page_url, 
                        getData: this.getArticleComments}), 
                    React.createElement(CommentsList, {comments: this.state.comments})
                )
            );
        }
    });

    var ____Class1z=React.Component;for(var ____Class1z____Key in ____Class1z){if(____Class1z.hasOwnProperty(____Class1z____Key)){Pagination[____Class1z____Key]=____Class1z[____Class1z____Key];}}var ____SuperProtoOf____Class1z=____Class1z===null?null:____Class1z.prototype;Pagination.prototype=Object.create(____SuperProtoOf____Class1z);Pagination.prototype.constructor=Pagination;Pagination.__superConstructor__=____Class1z;function Pagination(){"use strict";if(____Class1z!==null){____Class1z.apply(this,arguments);}}
        Object.defineProperty(Pagination.prototype,"pages",{writable:true,configurable:true,value:function() {"use strict";
            var pages = [];
            for(var i=1; i<=this.props.totalPages; i++) {
                pages.push({
                    num: i,
                    isCurrent: i === this.props.currentPage
                });
            }
            return pages;
        }});

        Object.defineProperty(Pagination.prototype,"handlePageClick",{writable:true,configurable:true,value:function(pageNumber, e) {"use strict";
            e.preventDefault();
            if (pageNumber > 0 && pageNumber <= this.props.totalPages) {
                this.props.getData(pageNumber);
            }
        }});

        Object.defineProperty(Pagination.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
            var firstItemClass = this.props.currentPage == 1 ? 'disabled' : '';
            var firstItemUrl = this.props.previousPageUrl ? this.props.previousPageUrl : '';
            var lastItemClass = this.props.currentPage == this.props.totalPages ? 'disabled' : '';
            var lastItemUrl = this.props.nextPageUrl ? this.props.nextPageUrl : '';

            var handlePreviousPageClick = this.handlePageClick.bind(this, this.props.currentPage-1);
            var handleNextPageClick = this.handlePageClick.bind(this, this.props.currentPage+1);

            return (
                React.createElement("nav", {className: "text-center"}, 
                    React.createElement("ul", {className: "pagination pagination-sm"}, 

                        React.createElement("li", {className: firstItemClass}, 
                            React.createElement("a", {href: firstItemUrl, "aria-label": "Previous", onClick: handlePreviousPageClick}, 
                                React.createElement("span", {"aria-hidden": "true"}, "«")
                            )
                        ), 

                        this.pages().map(function(page)  {
                            
                            var itemUrl = this.props.baseUrl + '?page=' + page.num;
                            var itemClass = page.isCurrent ? 'active' : '';

                            return (
                                React.createElement("li", {key: page.num, className: itemClass}, 
                                    React.createElement("a", {href: itemUrl, onClick: this.handlePageClick.bind(this, page.num)}, 
                                        page.num, 
                                        page.isCurrent ? React.createElement("span", {className: "sr-only"}, "(current)") : ''
                                    )
                                )
                            );
                        }.bind(this)), 

                        React.createElement("li", {className: lastItemClass}, 
                            React.createElement("a", {href: lastItemUrl, "aria-label": "Next", onClick: handleNextPageClick}, 
                                React.createElement("span", {"aria-hidden": "true"}, "»")
                            )
                        )
                        
                    )
                )
            );
        }});
    ;

    var routes = (
        React.createElement(Route, {handler: App}, 
            React.createElement(DefaultRoute, {name: "index", handler: Index}), 
            React.createElement(Route, {name: "single", path: "/:id", handler: Single})
        )
    )

    ReactRouter.run(routes, HistoryLocation, function(Handler, state)  {
        React.render(React.createElement(Handler, {url: "/articles"}), document.body);
    });

}.bind(this))(window.React, window.Reflux, window.ReactRouter, window.atomic);
