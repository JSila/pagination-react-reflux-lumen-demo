var App = React.createClass({displayName: "App",
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
    propTypes: {
        pageNumber: React.PropTypes.number
    },
    loadPaginatedDataForPage(pageNumber) {                
        atomic.get(this.props.url + '?page=' + pageNumber)
            .success(data => {
                this.setState({
                    articles: data.data,
                    current_page: data.current_page,
                    last_page: data.last_page,
                    next_page_url: data.next_page_url,
                    prev_page_url: data.prev_page_url
                });
            });
    },
    componentDidMount() {
        this.loadPaginatedDataForPage(this.props.pageNumber);
    },
    render() {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement(Pagination, {
                    baseUrl: this.props.url, 
                    currentPage: this.state.current_page, 
                    totalPages: this.state.last_page, 
                    nextPageUrl: this.state.next_page_url, 
                    previousPageUrl: this.state.prev_page_url, 
                    loadPaginatedDataForPage: this.loadPaginatedDataForPage}), 
                React.createElement(ArticlesList, {articles: this.state.articles})
            )
        );
    }
});

var ArticlesList = React.createClass({displayName: "ArticlesList",
    render() {
        return (
            React.createElement("div", {className: "article-list"}, 
                this.props.articles.map(article => React.createElement(Article, {key: article.id, article: article}))
            )
        );
    }
});

var Article = React.createClass({displayName: "Article",
    render() {
        var article = this.props.article;
        return (
            React.createElement("article", null, 
                React.createElement("h1", {className: "entry-title"}, article.title), 
                React.createElement("div", {className: "entry-content"}, article.content)
            )
        );
    }
});

var Pagination = React.createClass({displayName: "Pagination",
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
            this.props.loadPaginatedDataForPage(pageNumber);
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
            React.createElement("nav", {className: "text-center"}, 
                React.createElement("ul", {className: "pagination pagination-sm"}, 

                    React.createElement("li", {className: firstItemClass}, 
                        React.createElement("a", {href: firstItemUrl, "aria-label": "Previous", onClick: handlePreviousPageClick}, 
                            React.createElement("span", {"aria-hidden": "true"}, "«")
                        )
                    ), 

                    this.pages().map(page => {
                        
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
                    }), 

                    React.createElement("li", {className: lastItemClass}, 
                        React.createElement("a", {href: lastItemUrl, "aria-label": "Next", onClick: handleNextPageClick}, 
                            React.createElement("span", {"aria-hidden": "true"}, "»")
                        )
                    )
                    
                )
            )
        );
    }
});

React.render(React.createElement(App, {url: "/articles", pageNumber: 1}), document.body);
