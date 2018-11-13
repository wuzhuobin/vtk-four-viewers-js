// react
import React from 'react'
import ReactDOM from 'react-dom'
// me 
import ReactApp from './ReactApp'
const body = document.createElement('body');
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);
document.getElementsByTagName('html')[0].appendChild(body);
// ReactDOM.render(
//     React.createElement(App),
//     root
// );
ReactDOM.render(<ReactApp/>, root);