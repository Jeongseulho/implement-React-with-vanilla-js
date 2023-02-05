function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
export class KarlNode {
  children;
  nodeType;
  constructor({ children, nodeDetail }) {
    this.children = children;
    this.nodeDetail = nodeDetail;
  }
}

export class KarlElement {
  tagName;
  attributes;
  constructor({ tagName, attributes }) {
    this.tagName = tagName;
    this.attributes = attributes;
  }

  getId() {
    return this.attributes['id'];
  }

  getClasses() {
    return this.attributes['class'];
  }
}

// create text type node
export function createText(data) {
  return new KarlNode({ children: [], nodeDetail: data });
}

// create node except text type
export function createElement(name, attrs, children) {
  return new KarlNode({
    children,
    nodeDetail: new KarlElement({ tagName: name, attributes: attrs }),
  });
}

export default class HtmlParser {
  html;
  idx;
  constructor(html, idx) {
    this.html = html;
    this.idx = idx;
  }

  getChar() {
    return this.html[this.idx];
  }

  isStartWith(str) {
    const charArr = Array.from(str);
    let curIdx = this.idx;

    return charArr.every((char) => {
      if (this.html[curIdx] === char) {
        curIdx++;
        return true;
      }
      return false;
    });
  }

  isEndOfHtml() {
    return this.idx >= this.html.length;
  }

  *getHtmlIterator(html, start = 0) {
    for (let i = start; i < html.length; i++) {
      yield [i, html[i]];
    }
  }

  consumeChar() {
    const htmlIterator = this.getHtmlIterator(this.html, this.idx);
    const [curIdx, curChar] = htmlIterator.next().value;
    this.idx++;
  }

  consumeLoop(testFnc) {
    let consumedHtml = '';
    while (!this.isEndOfHtml() && testFnc(this.getChar())) {
      result += this.consumeChar();
    }
    return consumedHtml;
  }

  consumeWhitespace() {
    this.consumeLoop((char) => char === ' ');
  }

  parse() {
    const nodes = this.parseNodes();
    if (nodes.length === 1) {
      return nodes.pop();
    }
    return createElement('html', {}, nodes);
  }

  parseNodes() {
    if (this.getChar() === '<') {
      return this.parseElement();
    }
    return this.parseText();
  }

  parseElement() {
    assert(this.getChar() === '<', 'char is not <');
    const tagName = this.parseTagName();
    const attrs = this.parseAttrs();

    assert(this.consumeChar() === '>', 'char is not >');
    const children = this.parseNodes();

    assert(this.consumeChar() === '<', 'char is not <');
    assert(this.consumeChar() === '/', 'char is not </');
    assert(this.parseTagName() === tagName, 'tag name is not matched');
    assert(this.consumeChar() === '>', 'char is not >');
    return createElement(tagName, attrs, children);
  }

  parseTagName() {
    return this.consumeLoop((char) => {
      return char.match(/[a-zA-Z0-9]/);
    });
  }

  parseAttrs() {
    let attrs = {};

    while (true) {
      this.consumeWhitespace();
      if (this.getChar() === '>') {
        break;
      }
      const { name, value } = this.parseAttr();
      attrs[name] = value;
    }
    return attrs;
  }
  parseAttr() {
    const name = this.parseTagName();
    assert(this.consumeChar() === '=', 'char is not =');
    const value = this.parseAttrValue();
    return { name, value };
  }

  parseAttrValue() {
    const quote = this.consumeChar();
    assert(quote === '"' || quote === "'", 'quote is not " or \'');
    const value = this.consumeWhile((char) => char !== quote);
    assert(this.consumeChar() === quote, 'quote is not " or \'');
    return value;
  }

  parseText() {
    return createText(this.consumeWhile((char) => char !== '<'));
  }
}
