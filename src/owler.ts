import { Parser } from 'htmlparser2';
import { DomHandler, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import * as crypto from 'crypto';
import { walkVisit } from './utils';

export default class Owler {
    /** cache page */
    private caches: Map<string, string> = new Map();

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
        let md5Value = crypto.createHash('md5').update(html, 'utf8').digest('hex');
        let renderHtml = this.caches.get(md5Value) ?? '';
        if (renderHtml) {
            return renderHtml;
        }
        const handler = new DomHandler((error, ast) => {
            if (error) {
                // Handle error
                throw error;
            } else {
                this.parseDom(ast, data, Object.assign({}, this.defaultOptions, options));
                renderHtml = DomUtils.getOuterHTML(ast);
            }
        });
        const parser = new Parser(handler, { xmlMode: true });
        parser.write(html);
        parser.end();
        md5Value = crypto.createHash('md5').update(renderHtml, 'utf8').digest('hex');
        this.caches.set(md5Value, renderHtml);
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
