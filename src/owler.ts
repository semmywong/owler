// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { Parser } from 'htmlparser2';
import { DomHandler, Element } from 'domhandler';
import * as DomUtils from 'domutils';

export default class Owler {
    public Owler(options: any) {}
    /**
     *
     * @param html html string
     * @param options
     */
    public render(html: string, options?: any) {
        const handler = new DomHandler(function (error, dom) {
            if (error) {
                // Handle error
                throw error;
            } else {
                // Parsing completed, do something
                let newDom = dom[1] as Element;
                // DomUtils.removeElement(newDom.children[2]);
                const element = new Element('span', { a: 'aa', b: 'bb' });
                const attr = (newDom.children[3] as Element).attribs;
                attr['name'] = 'isName';
                attr['data-index'] = '1';

                (newDom.children[3] as Element).attribs = attr;
                DomUtils.appendChild(newDom.children[3] as Element, element);
                const newHtml = DomUtils.getOuterHTML(dom);
                DomUtils.append(
                    newDom.children[3] as Element,
                    ((DomUtils.getElements({ 'o-if': 'false' }, dom, true)[0] as any).firstChild || {}) as Element,
                );
                console.log('=====', DomUtils.getOuterHTML(newDom));
            }
        });
        const parser = new Parser(handler);
        parser.write(html);
        parser.end();
    }

    /**
     *
     * @param filePath will be rendered file path and file name.
     * @param options
     */
    public renderFile(filePath: string, options?: any) {}
}
