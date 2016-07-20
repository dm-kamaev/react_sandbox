/*jshint sub: true*/
/*jshint loopfunc: true */
/*jshint newcap: false */
/*jshint multistr: true */
/*jshint expr: true */
/*jshint esnext: true */


// БИБЛИОТЕКА КНИГ
// TODO: Сделать валидацию некоторых полей
// TODO: localStorage

var React    = require('react');
var ReactDOM = require('react-dom');
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
// будем хранить this для компонентов
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
  }, // update state, if click "Edit" on another book
  // когда получаем новые props обновляем state
  // поля формы связаны со state
  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps.dataForForm);
  },
  editBook: function (e) {
    var listBooks = CONTEXT.BooksList.state.listBooks;
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
    CONTEXT.BooksList.setState({ listBooks: listBooks });
    CONTEXT.BooksChange.setState({ dataForForm: {} });
  },
  change: function (field, e) { this.setState({ [field]: e.target.value }); },
  render: function () {
    var book  = this.props.dataForForm;
    var style = { marginTop: '10px', backgroundColor: '#009933' };
    return (
      <div id={book.id} className="books__column">
        <span>Автор:</span><br/>
        <input onChange={this.change.bind(this, 'author')} value={this.state.author} className="books__input"/><br/>
        <p className="books__input_error"></p>

        <span> Название книги:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'name')} value={this.state.name} className="books__input"/><br/>
        <p className="books__input_error"></p>

        <span>Год издания:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'year')} value={this.state.year} className="books__input"/><br/>
        <p className="books__input_error"></p>

        <span>Кол-во страниц:</span><br/>
        <input type="text" onChange={this.change.bind(this, 'pages')} value={this.state.pages} className="books__input"/><br/>
        <p className="books__input_error"></p>

        <button onClick={this.editBook} type="submit" style={style} className="books__button_edit">Edit</button>
      </div>
    );
  }
});


var BooksAdd = React.createClass({
  addBook: function () {
    // не связанные со state поля
    var author = ReactDOM.findDOMNode(this.refs.author),
        name   = ReactDOM.findDOMNode(this.refs.name),
        year   = ReactDOM.findDOMNode(this.refs.year),
        pages  = ReactDOM.findDOMNode(this.refs.pages);
    var authorValue = author.value,
        nameValue   = name.value,
        yearValue   = year.value,
        pagesValue  = pages.value;
    var listBooks = CONTEXT.BooksList.state.listBooks;
    listBooks.push({
      id: (listBooks.length + 1).toString(),
      author: authorValue,
      name: nameValue,
      year: yearValue,
      pages: pagesValue,
    });
    CONTEXT.BooksList.setState({ listBooks: listBooks });
    author.value = ''; name.value = ''; year.value = ''; pages.value = '';
  },
  render : function() {
    var style = { marginTop: '10px', backgroundColor: '#009933' };
    return (
      <div className="books__column">
        <span>Автор:</span><br/>
        <input ref="author" className="books__input"/><br/>
        <p className="books_input_error"></p>

        <span> Название книги:</span><br/>
        <input type="text" className="books__input" ref="name"/><br/>
        <p className="books_input_error"></p>

        <span>Год издания:</span><br/>
        <input type="text" className="books__input" ref="year"/><br/>
        <p className="books_input_error"></p>

        <span>Кол-во страниц:</span><br/>
        <input type="text" className="books__input" ref="pages"/><br/>
        <p className="books_input_error"></p>

        <button onClick={this.addBook} type="submit" style={style} className="books__button_edit">Add</button>
      </div>
    );
  }
});


var BooksChange = React.createClass({
  getInitialState:    function () { return { dataForForm: {} }; },
  componentWillMount: function () { CONTEXT.BooksChange = this; },
  render: function () {
    var dataForForm = this.state.dataForForm;
    if (dataForForm && isEmptyHash(dataForForm)) {
      return <BooksAdd/>;
    } else {
      return <BooksEdit dataForForm={dataForForm} />;
    }
  }
});


var BooksList = React.createClass({
  getInitialState:    function()  { return { listBooks: listBooks }; },
  componentWillMount: function () { CONTEXT.BooksList = this; },
  removeBook: function (e) {
    var id        = e.target.parentNode.id,
        listBooks = this.state.listBooks;
    listBooks[id - 1] = null;
    this.setState({ listBooks: listBooks });
  },
  editBook: function (e) {
    var index     = e.target.parentNode.id - 1,
        listBooks = this.state.listBooks;
    CONTEXT.BooksChange.setState({ dataForForm: listBooks[index] });
  },
  render: function() {
    var handlerRemoveBook = this.removeBook,
        handlerEditBook   = this.editBook,
        listBooks         = this.state.listBooks;
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
          <button onClick={handlerEditBook} className="books__button_edit">Edit</button>
          <button onClick={handlerRemoveBook} className="books__button_remove">Remove</button>
          <div className="books__separator"/>
        </div>
      );
    });
    return (<div className="books__column">{listBooks}</div>);
  }
});


var Books = React.createClass({
  render: function() {
    return (
      <div className="books">
        <BooksChange/>
        <BooksList/>
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