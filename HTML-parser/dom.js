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
