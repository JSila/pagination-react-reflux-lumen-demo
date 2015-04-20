((React, Reflux, request) => {

    var ArticlesActions = Reflux.createActions([
        'getArticles'
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
        }
    });

    var App = React.createClass({
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
            this.getArticles(this.props.pageNumber);
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
                        getArticles={this.getArticles} />
                    <ArticlesList articles={this.state.articles}/>
                </div>
            );
        }
    });

    var ArticlesList = React.createClass({
        render() {
            return (
                <div className="article-list">
                    {this.props.articles.map(article => <Article key={article.id} article={article} />)}
                </div>
            );
        }
    });

    var Article = React.createClass({
        render() {
            var article = this.props.article;
            return (
                <article>
                    <h1 className="entry-title">{article.title}</h1>
                    <div className="entry-content">{article.content}</div>
                </article>
            );
        }
    });

    var Pagination = React.createClass({
        pages() {
            var pages = [];
            for(var i=1; i<=this.props.totalPages; i++) {
                pages.push({
                    num: i,
                    isCurrent: i === this.props.currentPage
                });
            }
            return pages;
        },
        handlePageClick(pageNumber, e) {
            e.preventDefault();
            if (pageNumber > 0 && pageNumber <= this.props.totalPages) {
                this.props.getArticles(pageNumber);
            }
        },
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
    });

    React.render(<App url="/articles" />, document.body);

})(window.React, window.Reflux, window.atomic);
