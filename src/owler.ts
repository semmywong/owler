import { Parser, parseDOM } from 'htmlparser2';
import { DomHandler, Element, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import OFor from './directive/o-for';
import OIf from './directive/o-if';
import OInclude from './directive/o-include';
import OText from './directive/o-text';
import { SyntaxKind, SymbolTag } from './common/constant';
import OTag from './directive/o-tag';

export default class Owler {
    private tagHandler: { [key: string]: OTag } = {};

    private defaultOptions: Partial<OwlerOption> = {
        root: './',
        views: './',
        viewExt: 'html',
    };

    constructor(options?: any) {
        Object.assign(this.defaultOptions, options);
        this.initTagHandler();
    }

    private initTagHandler() {
        this.tagHandler['o-for'] = new OFor();
        this.tagHandler['o-if'] = new OIf();
        this.tagHandler['o-include'] = new OInclude();
        this.tagHandler['o-text'] = new OText();
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
                this.parseDom(ast, data, options);
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
        const parser = new Parser(handler);
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
            this.visit(ast[i], void 0, i, data, options);
        }
    }
    private visit(node: Node, parent: Node | undefined, index: number, data: any, options?: any) {
        //handle o-include tag
        if ((node as Element).tagName?.toLocaleLowerCase() === SymbolTag.OInclude) {
            const newNode = this.tagHandler[SymbolTag.OInclude].parse(
                node,
                parent,
                index,
                data,
                Object.assign({}, this.defaultOptions, options),
            );
            node = newNode as Node;
        }
        const attribs = (node as Element).attribs ?? {};
        //handle o-if tag
        if (SymbolTag.OIf in attribs) {
            const newNode = this.tagHandler[SymbolTag.OIf].parse(
                node,
                parent,
                index,
                data,
                Object.assign({}, this.defaultOptions, options),
            );
            node = newNode as Node;
        }
        //tag node
        if (node?.type.toLocaleLowerCase() === SyntaxKind.Tag) {
            //has children nodes
            if (Array.isArray((node as Element).children)) {
                for (let i = 0; i < (node as Element).children.length; i++) {
                    this.visit((node as Element).children[i], node, i, data, options);
                }
            }
        } else if (node?.type.toLocaleLowerCase() === SyntaxKind.Text) {
            (this.tagHandler[SymbolTag.OText] as OText).parseTextBlock(node, parent, index, data, options);
        }
    }
}
