/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-14 15:15:54
 * @Description: global utils
 */
import type { AnyNode } from 'domhandler';
import { Element } from 'domhandler';
import { SymbolTag, SyntaxKind } from '../common/constant';
import TagHandler from '../directive';

export function walkVisit(node: AnyNode, parent: AnyNode | undefined, index: number, data: any, options?: any) {
    //handle o-include tag
    if ((node as Element).tagName?.toLocaleLowerCase() === SymbolTag.OInclude) {
        const newNode = TagHandler[SymbolTag.OInclude].parse(node, parent, index, data, options);
        node = newNode;
    }
    const attribs = (node as Element).attribs ?? {};
    //handle o-for tag
    if (SymbolTag.OFor in attribs) {
        const newNode = TagHandler[SymbolTag.OFor].parse(node, parent, index, data, options);
        node = newNode;
    }
    //handle o-if tag
    if (SymbolTag.OIf in attribs) {
        const newNode = TagHandler[SymbolTag.OIf].parse(node, parent, index, data, options);
        node = newNode!;
    }
    //handle o-text tag
    if (SymbolTag.OText in attribs) {
        const newNode = TagHandler[SymbolTag.OText].parse(node, parent, index, data, options);
        node = newNode!;
    }
    //tag node
    if (node?.type.toLocaleLowerCase() === SyntaxKind.Tag) {
        //has children nodes
        if (Array.isArray((node as Element).children)) {
            for (let i = 0; i < (node as Element).children.length; i++) {
                walkVisit((node as Element).children[i], node, i, data, options);
            }
        }
    } else if (node?.type.toLocaleLowerCase() === SyntaxKind.Text) {
        TagHandler[SymbolTag.OText].parseTextBlock(node, parent, index, data, options);
    }
}
