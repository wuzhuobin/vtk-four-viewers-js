// react
import React from 'react'
import ReactDOM from 'react-dom'
// me 
import App from './app'
const body = document.createElement('body');
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);
document.getElementsByTagName('html')[0].appendChild(body);
ReactDOM.render(
    React.createElement(App),
    root
);
// ReactDOM.render(<App root={root}>{root}</App>);