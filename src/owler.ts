import { Parser } from 'htmlparser2';
import { DomHandler, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import { walkVisit } from './utils';

export default class Owler {
    private defaultOptions: Partial<OwlerOption> = {
        root: './',
        views: './',
        viewExt: 'html',
    };

    constructor(options?: any) {
        Object.assign(this.defaultOptions, options);
    }

    /**
     *
     * @param html html string
     * @param options
     */
    public render(html: string, data: any = {}, options?: any) {
        let renderHtml = '';
        const handler = new DomHandler((error, ast) => {
            if (error) {
                // Handle error
                throw error;
            } else {
                this.parseDom(ast, data, Object.assign({}, this.defaultOptions, options));
                // Parsing completed, do something
                // let newDom = dom[1] as Element;
                // // DomUtils.removeElement(newDom.children[2]);
                // const element = new Element('span', { a: 'aa', b: 'bb' });
                // const attr = (newDom.children[3] as Element).attribs;
                // attr['name'] = 'isName';
                // attr['data-index'] = '1';
                // (newDom.children[3] as Element).attribs = attr;
                // DomUtils.appendChild(newDom.children[3] as Element, element);
                renderHtml = DomUtils.getOuterHTML(ast);
                // DomUtils.append(
                //     newDom.children[3] as Element,
                //     ((DomUtils.getElements({ 'o-if': 'false' }, dom, true)[0] as any).firstChild || {}) as Element,
                // );
            }
        });
        const parser = new Parser(handler, { xmlMode: true });
        parser.write(html);
        parser.end();
        console.log('==============', renderHtml);
        return renderHtml;
    }

    /**
     *
     * @param pathName will be rendered file path and file name.
     * @param options
     */
    public renderFile(pathName: string, data: any, options?: any) {}

    private parseDom(ast: Node[], data: any, options?: any) {
        for (let i = 0; i < ast.length; i++) {
            walkVisit(ast[i], void 0, i, data, options);
        }
    }
}
