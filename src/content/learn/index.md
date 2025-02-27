---
title: Быстрый старт
---

<Intro>

Эта страница содержит 80% концепций React, которые ты будешь применять ежедневно.

</Intro>

<YouWillLearn>

- Создавать компоненты
- Добавлять разметку и стили
- Отображать данные
- Использовать условия и списки
- Реагировать на события
- Шерить данные между компонентами

</YouWillLearn>

## Компоненты {/*components*/}

Приложения на React состоят из *компонентов*. Компонент это кусочек пользовательского интерфейса, в который заключена логика и правила отображения. Компонент может быть маленьким, как кнопка, а может быть целой страницей или экраном.

Компоненты это JavaScript-функции, возвращающие разметку:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Теперь можно вложить `MyButton` в другой компонент:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Важно, что `<MyButton />` начинается с заглавной буквы. Имена компонентов должны всегда следовать этому правилу, тогда как HTML-тэги нужно указывать строчными буквами.

Взглянем на результат:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

## JSX {/*writing-markup-with-jsx*/}

Синтаксис, который используется в примерах выше, называется *JSX*. Он является опциональным, но используется подавляющим большинством разработчиков. Все [рекомендуемые инструменты](/learn/installation) поддерживает JSX из коробки.

JSX строже, чем HTML. Например, нужно всегда закрывать одинарные теги, например `<br />`. А еще, компонент должен всегда возвращать один JSX-элемент. Если необходимо вернуть несколько, их следует обернуть в общего родителя, как `<div>...</div>`, либо в пустой элемент `<>...</>`. И это не всё.

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

Если нужно портировать в JSX много кода на HTML, можно использовать [онлайн-конвертеры](https://transform.tools/html-to-jsx)

## Добавляем стили {/*adding-styles*/}

В React мы задаем CSS-классы через `className`...

```js
<img className="avatar" />
```

...и описываем соответствующие ему правила в отдельном CSS-файле:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

В самом простом случае стили можно подгрузить стандартно, в HTML через тег  [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). 

## Отображение данных {/*displaying-data*/}

JSX позволяет сочетать разметку и JavaScript. Так, через фигурные скобки можно встроить в разметку переменные или выражения, и они будут показаны пользователю.

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

То же самое можно сделать и с атрибутами, например, передав путь к изображению:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

В примере выше `style={{}}` это не какой-то особый синтаксис, а обычный объект внутри `style={ }`. 

## Отображение по условию {/*conditional-rendering*/}

React не предлагает особый подход для написания условий. Вместо этого, мы пишем код так, будто это обычный JavaScript. Например, можно использовать конструкцию [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else):

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

А если хочется более компактного кода, применить [условный оператор `?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), который в отличие от `if` работает внутри JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Если же ветка `else` не нужна, есть и третий способ через [синтаксис логического `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Эти же методы можно применять и для задания атрибутов.

## Отображение списков {/*rendering-lists*/}

Для отрисовки списка компонентов мы будем опираться на возможности JavaScript, такие как [цикл `for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) и [функция `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Представим, что у нас есть массив продуктов:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Теперь в компоненте, используя функцию `map()`, трансформируем этот массив данных в массив элементов `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Обрати внимание на атрибут `key`. Каждому элементу списка необходима строка или число, уникально отличающая его от соседних элементов. Обычно такие ключи мы берем из данных, например, это может быть ID из базы данных. React использует ключи для эффективных перерисовок при изменении состава или порядка элементов списка.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Реагируем на события {/*responding-to-events*/}

Объявим в компоненте *обработчик события*:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Обрати внимание, что `onClick={handleClick}` не содержит вызова. Мы не _вызываем_ функцию-обработчик, а только *передаем ее*. React вызовет ее сам, когда пользователь кликнет по кнопке.

## Добавляем стейт {/*updating-the-screen*/}

Иногда нам нужно, чтобы компонент "запоминал" некоторую информацию и отрисовывался исходя из нее. Например, мы можем считать количество кликов по кнопке. Для этого мы добавляем к компоненту *стейт*.

Для начала, импортируем [`useState`](/reference/react/useState):

```js
import { useState } from 'react';
```

Теперь можем объявить переменную состояния внутри компонента:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Функция `useState` дает нам текущее состояние (`count`) и функцию, через которую его можно менять (`setCount`). Им можно задать любые имена, но чаще всего используется соглашение называть их `[something, setSomething]`.

При первом отображении `count` будет равен `0`. Чтобы обновить состояние, вызов `setCount()` и передай в него новое значение. Например, можно сделать это при щелчке на кнопку!

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

Если мы создадим две одинаковые кнопки, каждая из них будет хранить состояние независимо.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Обрати внимание, что каждая кнопка "помнит" свое собственное состояние `count` и не влияет на другую.

## Используем хуки {/*using-hooks*/}

Функции, начинающиеся с `use` называются *Хуками*. `useState` это встроенный хук React. Список всех встроенных хуков можно найти в [справочнике](/reference/react). А чуть позже ты сможешь писать и свои собственные хуки. 

К хукам более строгие правила, чем к обычным функциям. Их можно объявлять только *на верхнем уровне* компонентов (или других хуков). Если нужно использовать `useState` внутри условия или цикла, создай новый компонент и вынеси хук в него.

## Шеринг данных {/*sharing-data-between-components*/}

В предыдущем примере каждый `MyButton` имел свой независимый `count`, и по щелчку по одной из них обновлялся лишь соответствующий `count`:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Изначально, в каждом `MyButton` состояние `count` равно `0`.

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

Первый `MyButton` обновляет свой `count` до `1`.

</Diagram>

</DiagramGroup>

Но иногда мы хотим чтобы компоненты *шерили состояние и всегда обновлялись синхронно*.

Для этого стейт нужно вынести из кнопок _на уровень выше_, к ближайшему общему родителю.

В этом примере это компонент `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Теперь `count` находится в `MyApp` и передается обоим дочерним элементам _сверху_.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

По щелчку по любой из кнопок `MyApp` обновляет состояние `count` на `1` и передает его кнопкам.

</Diagram>

</DiagramGroup>

Теперь клики считаются совместно. Теперь реализуем это в коде.

Во-первых, *поднимем состояние вверх*, из `MyButton` в `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

Далее, *спустим состояние* из `MyApp` в каждую из `MyButton`, совместно с общим обработчиком кликов. Мы можем передать информацию в `MyButton` используя фигурные скобки в JSX, как делали ранее в примере с `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Счетчики, которые обновляются синхронно</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Данные, которые мы спускаем вниз, называют _props_, _пропсы_. Теперь наш компонент `MyApp` содержит и стейт, и обработчик, и мы *передаем их вниз как пропсы*.

Наконец, допишем `MyButton` чтобы принимать эти пропсы:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Кликов: {count}
    </button>
  );
}
```

По клику на кнопку срабатывает обработчик события `onClick`. На каждой из кнопок на `onClick` повешена функция-обработчик `handleClick`. Код внутри `handleClick` выполняет действие `setCount(count + 1)`, инкрементируя `count`. Обновленное состояние `count` снова передается в обе кнопки, и вызывает ререндеринг. По-английски этот процесс называется "lifting state up".

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Счетчики, которые обновляются синхронно</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>