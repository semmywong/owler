import 'jest';
import * as path from 'path';
import Owler from '../src/owler';
import { parseDOM } from 'htmlparser2';
import { Element, Node } from 'domhandler';

/**
 * Owler Test
 */
describe('Owler Test', () => {
    it('html will be render correct!', () => {
        const html = `
        <!DOCTYPE html>
        <html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
        <head>
        <meta charset="utf-8"/>
        <link rel="dns-prefetch" href="https://github.githubassets.com"/>
        </head>
        <body>
          <div>
            div的内容
            <span>span的内容</span>
            <br/>
            <span o-text="name"></span>
            <p o-if="true">{{name}},{{age}}</p>
            <article>{{student}}</article>
            <o-include src="./include.html"></o-include>
            <o-include src="./include1.html"/>
            <input/>
            <div class="o-for-of" o-for="item of dataList">
              <span>{{item}}</span>
            </div>
            <div class="o-for-in" o-for="item in dataObject">
              <span o-text="item"></span>
            </div>
          </div>
        </body>
        </html>`;
        const htmlAst: Node[] = parseDOM('你好，合理hell', { xmlMode: true });
        const htmlAst1: Node[] = parseDOM(html.toString(), { xmlMode: true });
        const owler = new Owler({ root: __dirname });
        owler.render(html, {
            dataList: [1, 2, 3, 4, 5],
            dataObject: { a: 1, b: 2 },
            name: 'semmy',
            age: 18,
            student: 'i am student',
            test: 'test',
        });
    });
});
