import Owler from '../src/owler';

/**
 * Owler Test
 */
describe('Owler Test', () => {
    it('html will be render correct!', () => {
        const html = `
        <div>
          div的内容
          <span>span的内容</span>
          <p o-if="false"></p>
        </div>`;

        const owler = new Owler();
        expect(owler.render(html)).toBeUndefined();
    });
});
