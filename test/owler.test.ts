/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-14 19:23:05
 * @Description: owler test
 */
import crypto from 'crypto';
import type { Document } from 'domhandler';
import { parseDocument } from 'htmlparser2';
import 'jest';
import Owler from '../src/owler';

/**
 * Owler Test
 */
describe('Owler Test', () => {
    const html = `
        <!DOCTYPE html>
        <html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
        <head>
        <meta charset="utf-8"/>
        <link rel="dns-prefetch" href="https://github.githubassets.com"/>
        <script>
          const a = 'asdfasdfasdf';
          console.log(a);
          function testFunc(){
            console.log('testFunc');
          }
          testFunc();
        </script>
        <style>
          .test {
            color:#445566;
          }
          .test1 {
            color:#445566;
          }
        </style>
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
              <span o-text="item">{{item.a}}</span>
            </div>
          </div>
          <script>
          const a = 'asdfasdfasdf';
          console.log(a);
          function testFunc(){
            console.log('testFunc');
          }
          testFunc();
        </script>
        <style>
          .test {
            color:#445566;
          }
          .test1 {
            color:#445566;
          }
        </style>
        </body>
        </html>`;
    it('html will be render correct!', () => {
        const htmlAst: Document = parseDocument('你好，合理hell', { xmlMode: true });
        const htmlAst1: Document = parseDocument(html.toString(), { xmlMode: true });
        const owler = new Owler({ root: __dirname });
        const renderHTML = owler.render(html, {
            dataList: [1, 2, 3, 4, 5],
            dataObject: { a: 1, b: 2 },
            name: 'semmy',
            age: 18,
            student: 'i am student',
            test: 'test',
        });
        console.log(renderHTML);
    });

    it('crypto test', () => {
        console.log('========1', crypto.createHash('md5').update(html, 'utf8').digest('hex'));
        console.log(
            '========2',
            crypto
                .createHash('md5')
                .update(html, 'utf8')
                .update(JSON.stringify({ a: 'aa', b: 'bb', c: 123 }))
                .digest('hex'),
        );
        Buffer.from('test');
        console.log(
            '========3',
            crypto
                .createHash('md5')
                .update(html, 'utf8')
                .update(JSON.stringify({ a: 'aa', b: 'bb', c: 1233 }))
                .digest('hex'),
        );
    });
});
