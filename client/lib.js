/*jshint sub: true*/
/*jshint loopfunc: true */
/*jshint newcap: false */
/*jshint multistr: true */
/*jshint expr: true */
/*jshint esnext: true */

var D     = document, W = window;
var H     = D.getElementsByTagName("head")[0];
var d     = D.documentElement;
var log   = console.log.bind(console);
var error = console.error.bind(console);



function getByID(id)               { var el=document.getElementById(id); return (el) ? el : (console.error('ERROR: getByID not get element by id => "#'+id+'"'));}
function getByClass(class_name)    { var el=document.getElementsByClassName(class_name); return (el[0]) ? el[0] : (console.error('ERROR: getByClass not get element by class => ".'+class_name+'"')); }
function getByClassAll(class_name) { var els=document.getElementsByClassName(class_name); if(els&&els.length!==0) return els; else console.error('ERROR: getByClassAll not get elements by class => ".'+class_name+'"');return [];}
/*function removeElement (parent_id, child_id) {
  var parent_el = getByID(parent_id) || null,
      child_el  = getByID(child_id)  || null;
  if (!parent_el) error('ERROR: removeElement not get element by parent_id => "'+parent_id+'"');
  if (!child_el)  error('ERROR: removeElement not get element by child_id  => "'+child_id+'"');
  parent_el.removeChild(child_el);
}*/


/**
 *  Пример вызова drawBorders(0);
 * [drawBorders –– Функция рисует бордеры рандомного цвета вокруг элементов]
 * \@param  {[type–– digit]} trigger [Если trigger === 1, то рисуем бордеры]
 */
function drawBorders (trigger) {
  if (trigger === 1) {
    [].forEach.call(document.querySelectorAll("*"), function(a) {
      a.style.outline = "2px solid #" + (~~(Math.random() * (1 << 24))).toString(16);
    });
  }
}


// scrollTo(document.body || document.documentElement, findPos(getByID('we_do')), 600);
// scrollTo(findPos(getByID('we_do')), 1000);
// scrollTo('we_do', 1000);
// to –– 'id' or getByID('id')
function scrollTo (to, duration) {
  to = (typeof to === 'string') ? findPos(getByID(to)) : to;
  var body    = D.body; // For Chrome, Safari and Opera
  var html    = d;      // Firefox and IE places the overflow at the <html> level, unless else is specified.
  if (duration <= 0) return;
  var difference = to - (body.scrollTop || html.scrollTop);
  var perTick = difference / duration * 10;

  setTimeout(function() {
    html.scrollTop = body.scrollTop = (body.scrollTop || html.scrollTop) + perTick;
    if (body.scrollTop === to || html.scrollTop === to) return;
    scrollTo(to, duration - 10);
  }, 10);
}


function smartBrowser () { return ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) ? true : false; }


// коориднаты элемента отсительно viewport
// для получения коориднат относительно body надо
// добавить pageYOffset, pageXOffset
function getObjLocation(id) {
  var el = getByID(id), r = {};
  if (el) {r = el.getBoundingClientRect();
    return {left: r.left, top: r.top, right: r.right, bottom: r.bottom};
  }
}


// находим верхнюю точку элемента
// obj –– getByID('id')
function findPos(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent) !== null);
    /* return [curtop]; for window.scroll*/
    return curtop;
  }
}

function objectLength (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}


// console.log(isEmptyHash({1:2}));
// console.log(isEmptyHash([1]));
function isEmptyHash (hash) {
  if (typeof hash === 'object' && !hash.length && hash.length !== 0) {
    for (var i in hash) {
      if (hash.hasOwnProperty(i)) return false;
    }
    return true;
  } else { console.log('ERROR: isEmptyHash | hash: '+hash+' is not hash'); }
}

// console.log(isEmptyArray([]));console.log(isEmptyArray([12,23]));console.log(isEmptyArray({}));
function isEmptyArray (array) {
  if (typeof array !== 'object' && array.length !== 0 && !array.length) {
    error('ERROR: isEmptyArray | array: '+array+' is not array');
    return false;
  }
  if (array.length === 0) return true;
}


// console.log(anyElementHash({1:123, 'hello': 'vasya'}));
function anyElementHash (obj) {
  if (isEmptyHash(obj)) { return null; }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return obj[key];
  }
}


// ПАТТЕРН ИСПОЛЬЗОВАНИЯ
// fadeInOut(document.getElementById('hello'),'Out','none', 100, function() {
//   fadeInOut(document.getElementById('hello'),'In','inline', 100);
// });
// fadeInOut(document.getElementById('hello'),'In','inline', 100);
// fadeInOut(document.getElementById('hello'),'Out','none', 100);
/**
 * fadeInOut функция проявления и затухания
 * @param  {[object]}   el          id элемента
 * @param  {[string]}   way         In or Out
 * @param  {[string]}   displayType тип свойства display
 * @param  {[digit]}    time        время эффекта
 */
function fadeInOut(el, way, displayType, time, callback){
  var info = {};
  info.op = +el.style.opacity; // привели к числу
  var s = (way === 'In') ? (1 / time) : -1 * (1 / time);
  if (way === 'In') { el.style.display = displayType; } // меняем свойство с none на переданное

  (function fade() {
     el.style.opacity = info.op + s;
     info.op = info.op + s;
    // End fadeIn
    if (info.op >= 1 && way === 'In') {
      if (callback) { callback(); }
    }
    // End fadeOut
    else if (info.op <= 0 && way === 'Out') {
      el.style.display = displayType; // как правило это none
      el.style.opacity = '0';
      if (callback) { callback(); }
    }
    else {
      ( window.requestAnimationFrame && requestAnimationFrame(fade) ) || setTimeout(fade, 16);
    }
  })();
}


/**
 * [_R description]
 * @param  string   –– u [url]
 * @param  boolean  –– d [если переданы параметры {}, то POST, иначе GET]
 * @param  function –– s [обработчик succes. Xhr передается]
 * @param  function –– e [обработчик error]
 * @param  digit    –– m [время задержки (5000ms default)]
 */
// Паттерн использования
// _R('/', null, function(Xhr) { console.log(Xhr.responseText);},function(err) {console.log(err)});
// function _R(u,d,s,e,m){var r=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP"),ue="/nss/err"/*если скрипт не лежит на сервере*/,t;if(r){r.open((d)?"POST":"GET",u,true);r.onreadystatechange=function(){if(t){/*Если запрос сработал сразу чистим таймер*/clearTimeout(t)}if(r.readyState==4){if(r.status>=200&&r.status<400){if(s){s(r)}}else{if(u!=ue){_R(ue,"e="+u)}}}};if(e){r.onerror=e;/*назначаем обработчик ошибок для самого AJAX*/m=m||5000;t=setTimeout(function(){/*Если через 5с скрипт не ответил, то обрываем соединение и вызываем функцию обработчик*/r.abort();e(m)},m)}try{r.send(d||null)}catch(z){}}};
function _R(u, d, s, e, m) {
  var r = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
    ue = "/nss/err" /*если скрипт не лежит на сервере*/ ,
    t;
  if (r) {
    r.open((d) ? "POST" : "GET", u, true);
    if (d) r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // для Express нужен заголовок, возможно требуется еще это charset=UTF-8 где-то
    r.onreadystatechange = function() {
      if (t) { /*Если запрос сработал сразу чистим таймер*/
        clearTimeout(t);
      }
      if (r.readyState == 4) {
        if (r.status >= 200 && r.status < 400) {
          if (s) {
            s(r);
          }
        } else {
          if (u != ue) {
            _R(ue, "e=" + u);
          }
        }
      }
    };
    if (e) {
      r.onerror = e; /*назначаем обработчик ошибок для самого AJAX*/
      m = m || 5000;
      t = setTimeout(function() { /*Если через 5с скрипт не ответил, то обрываем соединение и вызываем функцию обработчик*/
        r.abort();
        e(m);
      }, m);
    }
    try {
      r.send(preparePostparams(d) || null);
      // r.send(d || null);
    } catch (z) {}
  }
}


// превращаем {} в строку вида "k=v&k2=v2" для POST параметров
function preparePostparams (obj) {
  if (obj === null || obj === undefined || !(obj instanceof Object)) return false;
  var res = ''; // "k=v&k2=v2"
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      res += key+'='+obj[key]+'&';
    }
  }
  return res.replace(/&$/, '');
}

function addCss(s){if(s){H.appendChild(crEl("style",[],s));}}

function crEl(t,a,s,e){e=D.createElement(t);setArray(a,function(i,v){e[v[0]]=v[1];});if(s){e.appendChild(D.createTextNode(s));}return e;}

function setArray(a,f){for(var i=0,l=a.length;i<l;i++){if(a[i]!==undefined){f(i,a[i]);}}}