import HtmlParser from './dom.js';
const html = `<html><body><h1>Title</h1><div id="main" class="test"><p>Hello<em>world</em>!</p></div></body></html>`;
const parsedHtml = new HtmlParser(html, 0);
console.log(parsedHtml);
