/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-02 22:02:10
 * @Description: include tag
 */
import type { AnyNode, ChildNode } from 'domhandler';
import { Element } from 'domhandler';
import * as DomUtils from 'domutils';
import fs from 'fs';
import { parseDocument } from 'htmlparser2';
import path from 'path';
import { walkVisit } from '../utils';
import OTag from './o-tag';

export default class OInclude extends OTag {
    parse(node: AnyNode, parent: AnyNode | undefined, index: number, data?: any, options?: OwlerOption) {
        const attribs = (node as Element).attribs;
        if (!attribs['src']) {
            throw new Error('must be provide "src" attribute in the o-include tag.');
        }
        const html = fs.readFileSync(path.resolve(process.cwd(), options?.root ?? '', options?.views ?? '', attribs['src']));
        const htmlAst: ChildNode[] = parseDocument(html.toString(), this.parserOptions).children;
        let prevNode = node.previousSibling;
        let nextNode = node.nextSibling;
        DomUtils.removeElement(node);
        if (prevNode) {
            htmlAst.forEach((nodeItem, i) => {
                if (prevNode) {
                    walkVisit(nodeItem, void 0, i, data, options);
                    DomUtils.append(prevNode, nodeItem);
                    prevNode = nodeItem;
                }
            });
        } else if (nextNode) {
            htmlAst.forEach((nodeItem, i) => {
                if (nextNode) {
                    walkVisit(nodeItem, void 0, i, data, options);
                    DomUtils.prepend(nextNode, nodeItem);
                    nextNode = nodeItem;
                }
            });
        } else {
            htmlAst.forEach((nodeItem) => DomUtils.appendChild(parent as Element, nodeItem));
        }
        return htmlAst[0] ?? parent?.nextSibling;
    }
}
