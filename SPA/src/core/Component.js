export default class Component {
  $target; // target element
  $props; // parent component props
  $state; // component state
  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.setEvent();
    this.render();
  }
  setup() {}
  mounted() {}
  template() {
    return '';
  }
  render() {
    this.$target.innerHTML = this.template();
    this.mounted(); // render 이후에 mounted 호출
  }
  setEvent() {}
  setState(newState) {
    this.$state = { ...this.$state, ...newState };
    this.render(); // state가 변경되면 render 함수를 호출
  }

  // 이벤트 위임을 사용하여 효율적으로 이벤트를 관리할 수 있도록 도와주는 함수
  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}
