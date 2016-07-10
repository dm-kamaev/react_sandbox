var my_news = [
  {
    id: '1',
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...'
  },
  {
    id: '2',
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!'
  },
  {
    id: '3',
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000'
  }
];

var Comments = React.createClass({
  render: function() {
    return (
      <div className="comments">
        Нет новостей - комментировать нечего.
      </div>
    );
  }
});

var Article = React.createClass({
  render : function() {
    var one_new = this.props.one_new;
    return (
      <div key={one_new.id} className='article'>
        <p className="news__author">{one_new.author}:</p>
        <p className="news__text">{one_new.text}</p>
      </div>
    );
  }
});

var News = React.createClass({
  // ПРОВЕРКА, ЧТО ЕСТЬ МАССИВ, НЕ БУДЕТ РАБОТАТЬ НА ПРОДАКШЕНЕ
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var data = this.props.data;
    var articles = data.map(function(one_new, index) {
      return <Article key={index} one_new={one_new}/>;
    });
    var style = { display:(data.length > 0) ? 'display' : 'none' }
    return (
      <div className="news">
        {articles}
        <strong style={style}>Всего новостей: {data.length}</strong>
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        Всем привет, я компонент App! Я умею отображать новости.
        <News data={my_news} />
        <Comments/>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);