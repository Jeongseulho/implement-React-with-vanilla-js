function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

export class KarlNode {
  children: Array<KarlNode>;
  nodeDetail: Text | KarlElement;

  constructor({
    children,
    nodeDetail,
  }: {
    children: Array<KarlNode>;
    nodeDetail: Text | KarlElement;
  }) {
    this.children = children;
    this.nodeDetail = nodeDetail;
  }
}

type Text = string;

export class KarlElement {
  tagName: string;
  attributes: object;

  constructor({
    tagName,
    attributes,
  }: {
    tagName: string;
    attributes: object;
  }) {
    this.tagName = tagName;
    this.attributes = attributes;
  }

  getID(): string {
    return (this.attributes as Record<string, string>)['id'];
  }

  getClasses(): string {
    return (this.attributes as Record<string, string>)['class'];
  }
}
// text type의 노드를 만드는 메소드
export function createText(data: string): KarlNode {
  return new KarlNode({ children: [], nodeDetail: data });
}

// 이외 type의 노드들(Element)을 만드는 메소드
// 추가적으로 attrs(속성), children(자식노드)를 갖는다.
export function createElement(
  name: string,
  attrs: object,
  children: Array<KarlNode>,
): KarlNode {
  return new KarlNode({
    children,
    nodeDetail: new KarlElement({ tagName: name, attributes: attrs }),
  });
}

export default class HtmlParser {
  input: string;
  position: number;

  constructor(input: string, position: number) {
    this.input = input;
    this.position = position;
  }

  // 현재 position에 있는 문자를 반환하는 메소드
  getCharacter(): string {
    return this.input[this.position];
  }

  // 현재 position에서부터의 문자열들이 파라미터 문자열 str 로 시작하는지 판단하는 메소드
  isStartWith(str: string): boolean {
    const characterArray = Array.from(str);
    let currentPosition = this.position;

    return characterArray.every((character) => {
      return this.input[currentPosition++] === character;
    });
  }

  // 현재 position이 input의 끝을 가리키는지 판단하는 메소드
  isEndOfInput(): boolean {
    return this.position >= this.input.length;
  }

  // Generator Function
  // Iterator 를 반환하며 이를 통해 흐름을 통제한다.
  makeInputIterator = function* (
    input: string,
    start = 0,
  ): Generator<[number, string]> {
    for (let i = start; i < input.length; i++) {
      yield [i, input[i]];
    }
  };

  // 문자를 소비하는 메소드. Iterator의 next()를 통해
  // 현재 position의 문자를 얻고 반환한다.(소비한다)
  consumeCharacter(): string {
    const inputIterator = this.makeInputIterator(this.input, this.position);
    const [currentPosition, currentCharacter] = inputIterator.next().value;
    this.position += 1;

    return currentCharacter;
  }

  // consumeCharacter를 반복적으로 실행하는 메소드
  // test라는 판별 함수를 파라미터로 받는다.
  // 현재 position이 input의 끝이 아니고, 판별 함수가 참을 반환하면 계속 문자를 소비한다.
  // 마지막에 지금까지 소비된 문자열을 반환한다.
  // 파싱 과정에서 주로 사용될 것이다.
  consumeWhile(test: (character: string) => boolean): string {
    let result = '';
    while (!this.isEndOfInput() && test(this.getCharacter())) {
      result += this.consumeCharacter();
    }
    return result;
  }

  // 파싱 과정에서의 연속된 공백을 모두 소비하는 메소드
  // 공백에 대한 판별 함수를 파라미터로 받는 consumeWhile를 실행한다.
  consumeWhitespace(): void {
    this.consumeWhile(function (character: string): boolean {
      if (character === ' ') return true;

      return false;
    });
  }

  // HTML input 파싱을 시작하는 entry 메소드
  // parseNodes()로 HTML input 내 모든 노드(<html> 태그의 자식 노드)들을 파싱한다.
  // 모든 노드를 자식으로 갖는 최상위 태그인 <html> 태그를 반환한다.
  parse(): KarlNode {
    const nodes = this.parseNodes();

    if (nodes.length === 1) {
      return nodes[0];
    }
    return createElement('html', {}, nodes);
  }

  // 자식 노드들을 파싱하는 메소드
  // HTML input의 끝에 도달하거나 '</' 문자열(부모 태그가 닫힘을 의미)을 만나기 전까지
  // parseNode()로 노드를 파싱하고 자식 노드에 추가한다.
  parseNodes(): KarlNode[] {
    let nodes = [] as KarlNode[];

    while (true) {
      this.consumeWhitespace();

      if (this.isEndOfInput() || this.isStartWith('</')) break;

      nodes.push(this.parseNode());
    }

    return nodes;
  }

  // 단일 노드를 파싱하는 메소드
  // '<' 문자열(태그가 열림을 의미)를 만난다면 Element, 그 외엔 Text 노드로 파싱한다.
  parseNode(): KarlNode {
    if (this.getCharacter() === '<') return this.parseElement();

    return this.parseText();
  }

  // Element 노드를 만드는 메소드
  // 태그의 이름, 속성, 자식 노드들을 파싱한다.
  // 마지막에 Element 노드를 반환한다.
  // assert 문(custom으로 만든 assert)으로 형식이 강요됩니다.
  parseElement(): KarlNode {
    assert(this.consumeCharacter() === '<', 'character is not <');

    const tagName = this.parseName();
    const attributes = this.parseAttributes();

    assert(this.consumeCharacter() === '>', 'character is not >');

    const children = this.parseNodes();

    assert(this.consumeCharacter() === '<', 'character is not <');
    assert(this.consumeCharacter() === '/', 'character is not /');
    assert(this.parseName() === tagName, 'There is no tag name in closing tag');
    assert(this.consumeCharacter() === '>', 'character is not >');

    return createElement(tagName, attributes, children);
  }

  // 태그의 이름을 파싱하는 메소드
  // 현재 소비하는 문자가 numberCharacters, lowerAlphabet, upperAlphabet 내 요소에 해당하면
  // 계속 소비하는 consumeWhile 메소드의 결과값을 반환한다. 즉 이름을 반환한다.
  // numberCharacters 는 숫자 문자('1', '2' ...), lowerAlphabet는 알파벳 소문자('a', 'b' ...)
  // upperAlphabet는 알파벳 대문자 ('A', 'B', ...) 를 요소로 갖는다.
  parseName(): string {
    return this.consumeWhile(function (character: string): boolean {
      if ('0' <= character && character <= '9') return true;
      if ('a' <= character && character <= 'z') return true;
      if ('A' <= character && character <= 'Z') return true;
      return false;
    });
  }

  // 속성들을 파싱하는 메소드
  // '>' 문자를 만날 때까지(태그의 닫힘을 의미)
  // 단일 속성을 파싱하는 parseAttr 메소드를 계속 실행하여 엳은 name과 value를
  // attributes 객체에 추가합니다. 그리고 마지막에 attributes 객체를 반환합니다.
  parseAttributes() {
    let attributes = {};

    while (true) {
      this.consumeWhitespace();

      if (this.getCharacter() === '>') break;

      const { name, value } = this.parseAttr();
      (attributes as Record<string, string>)['name'] = value;
    }

    return attributes;
  }

  // 단일 속성을 파싱하는 메소드
  // name="value" 형식의 문자열을 파싱한다.
  // assert 문으로 위의 형식이 강요됩니다.
  // '='을 구분자로 삼아 name과 value를 파싱한다.
  // name, value를 담은 객체를 반환한다.
  parseAttr(): { name: string; value: string } {
    const name = this.parseName();

    assert(
      this.consumeCharacter() === '=',
      "there is no '=' between attribute name and attribute value",
    );

    const value = this.parseAttrValue();

    return { name, value };
  }

  // 단일 속성의 value를 파싱하는 메소드
  // assert문으로 "value" 형식이 강요됩니다.
  parseAttrValue() {
    const quote = this.consumeCharacter();

    assert(quote === '"', 'open quote error');

    const value = this.consumeWhile(function (character: string): boolean {
      if (character !== quote) return true;

      return false;
    });

    assert(this.consumeCharacter() === quote, 'close quote error');

    return value;
  }

  // Text 노드를 만드는 메소드
  // '<' 문자(새로운 태그가 시작됨을 의미)를 만날 때 지금껏 소비한 문자열로 Text 노드를 만들고 반환.
  parseText(): KarlNode {
    return createText(
      this.consumeWhile(function (character: string): boolean {
        if (character !== '<') return true;

        return false;
      }),
    );
  }
}
