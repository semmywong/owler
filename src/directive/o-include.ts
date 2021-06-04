import * as fs from 'fs';
import * as path from 'path';
import { parseDOM } from 'htmlparser2';
import { Element, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import OTag from './o-tag';

export default class OInclude extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data?: any, options?: OwlerOption) {
        const attribs = (node as Element).attribs;
        if (!attribs['src']) {
            throw new Error('must be provide "src" attribute in the o-include tag.');
        }
        const html = fs.readFileSync(path.resolve(process.cwd(), options?.root ?? '', options?.views ?? '', attribs['src']));
        const htmlAst: Node[] = parseDOM(html.toString(), this.parserOptions);
        let prevNode = node.previousSibling;
        let nextNode = node.nextSibling;
        DomUtils.removeElement(node);
        if (prevNode) {
            htmlAst.forEach((nodeItem) => {
                DomUtils.append(prevNode!, nodeItem);
                prevNode = nodeItem;
            });
        } else if (nextNode) {
            htmlAst.forEach((nodeItem) => {
                DomUtils.prepend(nextNode!, nodeItem);
            });
        } else {
            htmlAst.forEach((nodeItem) => DomUtils.appendChild(parent as Element, nodeItem));
        }
        return htmlAst[0] ?? parent?.nextSibling;
    }
}
