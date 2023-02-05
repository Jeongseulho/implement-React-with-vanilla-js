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
