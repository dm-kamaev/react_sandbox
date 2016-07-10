var log = console.log.bind(console);
var listBooks = [
  {
    id: '1',
    author: 'Лев Толстой',
    name: 'Война и Мир',
    year: 1865,
    pages: 2200,
  },
  {
    id: '2',
    author: 'А. С. Пушкин',
    name: 'Евгений Онeгин',
    year: 1825,
    pages: 400
  },
];
var CONTEXT = {};

var BooksEdit = React.createClass({
  getInitialState: function() {
    var book = this.props.dataForForm;
    return {
      id: book.id,
      author: book.author,
      name: book.name,
      year: book.year,
      pages: book.pages,
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps.dataForForm);
  },
  editBook: function (e) {
    var listBooks = CONTEXT['Books'].state.listBooks;
    var id = e.target.parentNode.id;
    var index = id - 1;
    var state = this.state;
    listBooks[index] = {
      id:     state.id,
      author: state.author,
      name:   state.name,
      year:   state.year,
      pages:  state.pages,
    };
    CONTEXT['Books'].setState({ listBooks: listBooks });
  },
  change: function (field, e) { this.setState({ [field]: e.target.value }); },
  render: function () {
    var book  = this.props.dataForForm;
    var style = { marginTop: '10px', backgroundColor: '#009933' };
    return (
      <div id={book.id} className="main_table_column">
        <span>Автор:</span><br/>
        <input onChange={this.change.bind(this, 'author')} value={this.state.author} className="field"/><br/>
        <p className="error" id="error_author"></p>

        <span> Название книги:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'name')} value={this.state.name} className="field"/><br/>
        <p className="error" id="error_title_book"></p>

        <span>Год издания:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'year')} value={this.state.year} className="field"/><br/>
        <p className="error" id="error_year"></p>

        <span>Кол-во страниц:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'pages')} value={this.state.pages} className="field"/><br/>
        <p className="error" id="error_number_pages"></p>

        <button onClick={this.editBook} type="submit" style={style} className="edit">Edit</button>
      </div>
    );
  }
});


var BooksAdd = React.createClass({
  addBook: function () {
    var author = ReactDOM.findDOMNode(this.refs.author),
        name   = ReactDOM.findDOMNode(this.refs.name),
        year   = ReactDOM.findDOMNode(this.refs.year),
        pages  = ReactDOM.findDOMNode(this.refs.pages);
    var authorValue = author.value,
        nameValue   = name.value,
        yearValue   = year.value,
        pagesValue  = pages.value;
    // console.log(authorValue, nameValue, yearValue, pagesValue);
    var listBooks = CONTEXT['Books'].state.listBooks;
    listBooks.push({
      id: (listBooks.length + 1).toString(),
      author: authorValue,
      name: nameValue,
      year: yearValue,
      pages: pagesValue,
    });
    // console.log(listBooks);
    CONTEXT['Books'].setState({ listBooks: listBooks });
  },
  render : function() {
    var style = { marginTop: '10px', backgroundColor: '#009933' };
    return (
      <div className="main_table_column">
        <span>Автор:</span><br/>
        <input ref="author" className="field"/><br/>
        <p className="error" id="error_author"></p>

        <span> Название книги:</span><br/>
        <input type="text" className="field" ref="name"/><br/>
        <p className="error" id="error_title_book"></p>

        <span>Год издания:</span><br/>
        <input type="text" className="field" ref="year"/><br/>
        <p className="error" id="error_year"></p>

        <span>Кол-во страниц:</span><br/>
        <input type="text" className="field" ref="pages"/><br/>
        <p className="error" id="error_number_pages"></p>

        <button onClick={this.addBook} type="submit" style={style} className="edit" id="add">Add</button>
      </div>
    );
  }
});


var BooksChange = React.createClass({
  render: function() {
    var dataForForm = this.props.dataForForm;
    if (dataForForm && isEmptyHash(dataForForm)) {
      return <BooksAdd/>;
    } else {
      return <BooksEdit dataForForm={this.props.dataForForm} />;
    }
  }
});


var BooksList = React.createClass({
  removeBook: function (e) {
    var id = e.target.parentNode.id;
    var listBooks = CONTEXT['Books'].state.listBooks;
    listBooks[id-1] = null;
    CONTEXT['Books'].setState({ listBooks: listBooks });
  },
  editBook: function (e) {
    var index     = e.target.parentNode.id - 1,
        listBooks = CONTEXT['Books'].state.listBooks;
    CONTEXT['Books'].setState({ dataForForm: listBooks[index] });
    // log(index, listBooks,listBooks[index], CONTEXT['Books'].state.dataForForm)
    log(CONTEXT['Books'].state.dataForForm)
  },
  render: function() {
    var handlerRemoveBook = this.removeBook;
    var handlerEditBook = this.editBook;
    var listBooks = this.props.listBooks;
    listBooks = listBooks.map(function(book, index) {
      if (!book) { return; } // если книга была удалена
      return (
        <div key={book.id} id={book.id}>
          <p>
            <span>{book.author} </span>
            <span>"{book.name}"</span>
          </p>
          <p>
            <span>{book.year} г. </span>
            <span>{book.pages} стр.</span>
          </p>
          <hr class="spl"/>
          <button onClick={handlerEditBook} className="edit">Edit</button>
          <button onClick={handlerRemoveBook} className="remove">Remove</button>
        </div>
      );
    });
    return (<div className="main_table_column">{listBooks}</div>);
  }
});


var Books = React.createClass({
  getInitialState: function() {
    return {
      listBooks: listBooks,
      dataForForm: {},
    };
  },
  componentWillMount: function () { CONTEXT['Books'] = this; },
  render: function() {
    return (
      <div className="books">
        <BooksChange dataForForm={this.state.dataForForm}/>
        <BooksList   listBooks={this.state.listBooks}/>
      </div>
    );
  }
});


ReactDOM.render(
  <Books/>,
  document.getElementById('root')
);


function isEmptyHash (hash) {
  if (typeof hash === 'object' && !hash.length && hash.length !== 0) {
    for (var i in hash) {
      if (hash.hasOwnProperty(i)) return false;
    }
    return true;
  } else { console.error('isEmptyHash => hash: '+hash+' is not hash'); }
}