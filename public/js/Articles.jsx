((React, Reflux, ReactRouter, request) => {

    var {Route, RouteHandler, Link, State, HistoryLocation, DefaultRoute} = ReactRouter;

    var ArticlesActions = Reflux.createActions([
        'getArticles', 'getArticleComments'
    ]);

    var ArticlesStore = Reflux.createStore({
        listenables: [ArticlesActions],
        onGetArticles(url, pageNumber) {
            request.get(url + '?page=' + pageNumber)
                .success(data => {
                    this.trigger({
                        articles: data.data,
                        current_page: data.current_page,
                        last_page: data.last_page,
                        next_page_url: data.next_page_url,
                        prev_page_url: data.prev_page_url
                    });
                });
        },
        onGetArticleComments(url, articleId, pageNumber) {
            request.get(url + '/'+ articleId +'/comments?page=' + pageNumber)
                .success(data => {
                    this.trigger({
                        comments: data.data,
                        current_page: data.current_page,
                        last_page: data.last_page,
                        next_page_url: data.next_page_url,
                        prev_page_url: data.prev_page_url
                    });
                });
        }
    });

    class App extends React.Component {
        render() {
            return <RouteHandler {...this.props} />;
        }
    }

    var Index = React.createClass({
        mixins: [Reflux.connect(ArticlesStore)],
        getInitialState() {
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
        getArticles(pageNumber) {      
            ArticlesActions.getArticles(this.props.url, pageNumber);
        },
        componentDidMount() {
            this.getArticles(1);
        },
        render() {
            return (
                <div className="container">
                    <Pagination
                        baseUrl={this.props.url}
                        currentPage={this.state.current_page}
                        totalPages={this.state.last_page}
                        nextPageUrl={this.state.next_page_url}
                        previousPageUrl={this.state.prev_page_url}
                        getData={this.getArticles} />
                    <ArticlesList articles={this.state.articles}/>
                </div>
            );
        }
    });

    class ArticlesList extends React.Component {
        render() {
            return (
                <div className="article-list">
                    {this.props.articles.map(article => <Article key={article.id} article={article} />)}
                </div>
            )
        }
    }

    class CommentsList extends React.Component {
        render() {
            return (
                <div className="comment-list">
                    {this.props.comments.map(comment => <Comment key={comment.id} comment={comment} />)}
                </div>
            )
        }
    }

    class Article extends React.Component{
        render() {
            var article = this.props.article;
            return (
                <article>
                    <h1 className='entry-title'><Link to='single' params={article} article={article}>{article.title}</Link></h1>
                    <div className='entry-content'>{article.content}</div>
                </article>
            )
        }
    }

    class Comment extends React.Component{
        render() {
            var comment = this.props.comment;
            return (
                <article>
                    <h1 className='comment-title'>{comment.name}</h1>
                    <div className='comment-content'>{comment.content}</div>
                </article>
            )
        }
    }
    var Single = React.createClass({
        mixins: [Reflux.connect(ArticlesStore)],
        getInitialState() {
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
        getArticleComments(pageNumber) {
            ArticlesActions.getArticleComments(this.props.url, this.context.router.getCurrentParams().id, pageNumber);
        },
        componentDidMount() {
            this.getArticleComments(1);
        },
        render() {
            console.log(this.props);
            return (
                <div className="container">
                    <Pagination
                        baseUrl={this.props.url}
                        currentPage={this.state.current_page}
                        totalPages={this.state.last_page}
                        nextPageUrl={this.state.next_page_url}
                        previousPageUrl={this.state.prev_page_url}
                        getData={this.getArticleComments} />
                    <CommentsList comments={this.state.comments}/>
                </div>
            );
        }
    });

    class Pagination extends React.Component {
        pages() {
            var pages = [];
            for(var i=1; i<=this.props.totalPages; i++) {
                pages.push({
                    num: i,
                    isCurrent: i === this.props.currentPage
                });
            }
            return pages;
        }

        handlePageClick(pageNumber, e) {
            e.preventDefault();
            if (pageNumber > 0 && pageNumber <= this.props.totalPages) {
                this.props.getData(pageNumber);
            }
        }

        render() {
            var firstItemClass = this.props.currentPage == 1 ? 'disabled' : '';
            var firstItemUrl = this.props.previousPageUrl ? this.props.previousPageUrl : '';
            var lastItemClass = this.props.currentPage == this.props.totalPages ? 'disabled' : '';
            var lastItemUrl = this.props.nextPageUrl ? this.props.nextPageUrl : '';

            var handlePreviousPageClick = this.handlePageClick.bind(this, this.props.currentPage-1);
            var handleNextPageClick = this.handlePageClick.bind(this, this.props.currentPage+1);

            return (
                <nav className="text-center">
                    <ul className="pagination pagination-sm">

                        <li className={firstItemClass}>
                            <a href={firstItemUrl} aria-label="Previous" onClick={handlePreviousPageClick}>
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>

                        {this.pages().map(page => {
                            
                            var itemUrl = this.props.baseUrl + '?page=' + page.num;
                            var itemClass = page.isCurrent ? 'active' : '';

                            return (
                                <li key={page.num} className={itemClass}>
                                    <a href={itemUrl} onClick={this.handlePageClick.bind(this, page.num)}>
                                        {page.num}
                                        {page.isCurrent ? <span className="sr-only">(current)</span> : ''}
                                    </a>
                                </li>
                            );
                        })}

                        <li className={lastItemClass}>
                            <a href={lastItemUrl} aria-label="Next" onClick={handleNextPageClick}>
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                        
                    </ul>
                </nav>
            );
        }
    };

    var routes = (
        <Route handler={App}>
            <DefaultRoute name="index" handler={Index}/>
            <Route name='single' path='/:id' handler={Single} />
        </Route>
    )

    ReactRouter.run(routes, HistoryLocation, (Handler, state) => {
        React.render(<Handler url='/articles' />, document.body);
    });

})(window.React, window.Reflux, window.ReactRouter, window.atomic);
