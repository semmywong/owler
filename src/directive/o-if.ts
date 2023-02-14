import { Element, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import { SymbolTag, SyntaxKind } from '../common/constant';
import OTag from './o-tag';

export default class OIf extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data: any, options?: any): Node | undefined | null {
        this.oIfParse(SymbolTag.OIf, node, parent, data, options);
        let returnNode: Node | null = (parent as Element)?.children?.[index] ?? parent?.nextSibling;
        while (returnNode?.type.toLocaleLowerCase() === SyntaxKind.Text) {
            returnNode = returnNode.nextSibling;
        }
        return returnNode ?? parent;
    }

    private oIfParse(tag: string, node: Node, parent: Node | undefined, data: any, options?: any) {
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
                    DomUtils.removeElement(nextNode);
                    nextNode = nextNode.nextSibling;
                } else {
                    break;
                }
            }
        } else {
            //remove current node
            let nextNode = node.nextSibling;
            DomUtils.removeElement(node);

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
