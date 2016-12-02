import Vue from 'vue';
import Loading from 'src/components/Loading.vue';

describe('Loading.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Loading);
    const vm = new Constructor().$mount();
    expect(vm.$el.classList[0]).to.equal('loading-container');
  });
});
