/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-22 09:30:02
 * @Description: if tag
 */
import type { AnyNode } from 'domhandler';
import { Element } from 'domhandler';
import { removeElement } from 'domutils';
import { SymbolTag, SyntaxKind } from '../common/constant';
import OTag from './o-tag';

export default class OIf extends OTag {
    parse(node: AnyNode, parent: AnyNode | undefined, index: number, data: any, options?: any): AnyNode | undefined | null {
        this.oIfParse(SymbolTag.OIf, node, parent, data, options);
        let returnNode: AnyNode | null = (parent as Element)?.children?.[index] ?? parent?.nextSibling;
        while (returnNode?.type.toLocaleLowerCase() === SyntaxKind.Text) {
            returnNode = returnNode.nextSibling;
        }
        return returnNode ?? parent;
    }

    private oIfParse(tag: string, node: AnyNode, parent: AnyNode | undefined, data: any, options?: any) {
        const expression = (node as Element).attribs[tag];
        let result = true;
        try {
            const func = new Function('data', `with(data){ return ${expression} }`);
            result = func(data);
        } catch (error) {
            console.error(error);
            throw new Error(`can not execute expression '${expression}'`);
        }
        if (result) {
            //remove o-if attribute
            delete (node as Element).attribs[tag];
            //remove next sibling condition node
            let nextNode = node.nextSibling;
            while (nextNode) {
                if (nextNode.type.toLocaleLowerCase() === SyntaxKind.Text) {
                    nextNode = nextNode.nextSibling;
                    continue;
                }
                const attribs = (nextNode as Element).attribs ?? {};
                if (SymbolTag.OElseIf in attribs || SymbolTag.OElse in attribs) {
                    removeElement(nextNode);
                    nextNode = nextNode.nextSibling;
                } else {
                    break;
                }
            }
        } else {
            //remove current node
            let nextNode = node.nextSibling;
            removeElement(node);

            while (nextNode?.type.toLocaleLowerCase() === SyntaxKind.Text) {
                nextNode = nextNode.nextSibling;
            }

            if (nextNode) {
                const attribs = (nextNode as Element).attribs ?? {};
                if (SymbolTag.OElseIf in attribs) {
                    this.oIfParse(SymbolTag.OElseIf, nextNode, parent, data, options);
                } else if (SymbolTag.OElse in attribs) {
                    delete (nextNode as Element).attribs[SymbolTag.OElse];
                }
            }
        }
    }
}
