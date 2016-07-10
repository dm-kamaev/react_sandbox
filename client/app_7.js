var log = console.log;
var my_news = [
  {
    id: '1',
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...',
    bigText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem vero minima distinctio placeat, consectetur alias facilis repellendus autem atque inventore amet eaque ad. Cum unde et magni nulla, a cumque.'
  },
  {
    id: '2',
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem eaque earum aspernatur totam, inventore, sit dicta, modi incidunt culpa asperiores! Laudantium nisi recusandae suscipit praesentium eius ad eaque tempora.'
  },
  {
    id: '3',
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde praesentium ratione accusamus, dolor consequatur reprehenderit. Tenetur beatae, repudiandae sit possimus perspiciatis ipsam hic, atque quibusdam, reprehenderit consequatur, itaque velit sint!'
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
  getInitialState: function() { return { visible: false }; },
  read_more: function (e) {
    e.preventDefault();
    this.setState({ visible:true }, function () { console.log('Состояние изменилось'); });
  },
  render : function() {
    var one_new   = this.props.one_new,
        visible   = this.state.visible,
        read_more = this.read_more;
    return (
      <div key={one_new.id} className='article'>
        <p className="news__author">{one_new.author}:</p>
        <p className="news__text">{one_new.text}</p>
        <a href="#" onClick={read_more} className={(visible) ? 'none' : 'news__readmore'}>Подробнее</a>
        <p className={(visible) ? '' : 'none'}>{one_new.bigText}</p>
      </div>
    );
  }
});


var Add = React.createClass({
  componentDidMount: function() { ReactDOM.findDOMNode(this.refs.author).focus(); },
  getInitialState: function() { //устанавливаем начальное состояние (state)
     return {
       btnIsDisabled: true,
       agreeNotChecked: true,
       authorIsEmpty: true,
       textIsEmpty: true,
     };
  },
  onCheckRuleClick: function(e) {
    ReactDOM.findDOMNode(this.refs.author).disabled = !e.target.checked;
  },
  onFieldChange: function(fieldName, e) {
    var next = {};
    if (e.target.value.trim().length > 0) {
      next[fieldName] = false;
      this.setState(next);
    } else {
      next[fieldName] = true;
      this.setState(next);
    }
  },
  onBtnClickHandler: function(e) {
     e.preventDefault();
     var author = ReactDOM.findDOMNode(this.refs.author).value;
     var text = ReactDOM.findDOMNode(this.refs.text).value;
     console.log(author+' :\n'+text);
  },
  onCheckRuleClick: function(e) {
    this.setState({ btnIsDisabled: !this.state.btnIsDisabled }); //устанавливаем значение в state
  },
  render: function() {
    var changeField = this.changeField,
        showValue = this.showValue,
        value = this.state.field_value;
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          onChange={this.onFieldChange.bind(this, 'author')}
          placeholder='Ваше имя'
          ref='author'
        />
        <textarea
          className='add__text'
          defaultValue=''
          onChange={this.onFieldChange.bind(this, 'text')}
          placeholder='Текст новости'
          ref='text'
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
        </label>

        {/* берем значение для disabled атрибута из state */}
        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={this.state.btnIsDisabled}
          >
          Показать alert
        </button>
      </form>
    );
  }
});


var News = React.createClass({
  // ПРОВЕРКА, ЧТО ЕСТЬ МАССИВ, НЕ БУДЕТ РАБОТАТЬ НА ПРОДАКШЕНЕ
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  getInitialState: function() { return { counter: 0 }; },
  count_all_news: function (e) {
    e.preventDefault();
    this.setState({ counter: ++this.state.counter });
  },
  render: function() {
    var count_all_news = this.count_all_news;
    var data = this.props.data;
    var articles = data.map(function(one_new, index) {
      return <Article key={index} one_new={one_new}/>;
    });
    var style = { display:(data.length > 0) ? 'display' : 'none' }
    return (
      <div className="news">
        {articles}
        <strong onClick={count_all_news} style={style}>Всего новостей: {data.length}</strong>
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <h3>Новости</h3>
        Всем привет, я компонент App! Я умею отображать новости.
        <Add/>
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