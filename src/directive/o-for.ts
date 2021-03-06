import { Element, Node } from 'domhandler';
import { parseDOM } from 'htmlparser2';
import * as DomUtils from 'domutils';
import OTag from './o-tag';
import { SymbolTag, SyntaxKind } from '../common/constant';
import { walkVisit } from '../utils';

export default class OFor extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data: any, options?: any) {
        let nextIndex = index;
        const expression = (node as Element).attribs[SymbolTag.OFor];
        delete (node as Element).attribs[SymbolTag.OFor];
        const match = expression.match(/(.*)\s+(in|of)\s+(.*)/);
        let dataExpression = null;
        let loopSymbol = null;
        let iterator = null;
        let alias = null;

        if (match) {
            dataExpression = match[3].trim();
            loopSymbol = match[2].trim();
            const itMatch = match[1].match(/\((.*),(.*)\)/);
            if (itMatch) {
                // o-for="(k,v) in array", iterator is 'k', alias is 'v'
                iterator = itMatch[1].trim();
                alias = itMatch[2].trim();
            } else {
                // o-for="ele in array", alias is 'ele'
                alias = match[1].trim();
            }
        } else {
            throw new Error('o-for express error.');
        }
        const itemHtml = DomUtils.getOuterHTML(node);

        let newNode = node;
        if (loopSymbol === 'of') {
            // data express is array
            for (let i = 0, iLen = data[dataExpression].length; i < iLen; i++) {
                const element = data[dataExpression][i];
                const newNodeData = Object.assign({}, data, { [alias]: element, [iterator ? iterator : 'oIndex']: i });
                nextIndex = index + i;
                walkVisit(newNode, parent, nextIndex, newNodeData, options);
                if (i < iLen - 1) {
                    const doms = parseDOM(itemHtml, this.parserOptions).filter(
                        (dom) => dom?.type.toLocaleLowerCase() === SyntaxKind.Tag,
                    );
                    DomUtils.append(newNode, doms[0]);
                    newNode = doms[0];
                }
            }
        } else if (loopSymbol === 'in') {
            // data express is object
            let i = 0;
            for (const key in data[dataExpression]) {
                if (Object.prototype.hasOwnProperty.call(data[dataExpression], key)) {
                    const value = data[dataExpression][key];
                    const newNodeData = Object.assign({}, data, {
                        [alias]: { [key]: value },
                        [iterator ? iterator : 'oIndex']: i,
                    });
                    nextIndex = index + i;
                    walkVisit(newNode, parent, nextIndex, newNodeData, options);
                    if (i < Object.keys(data[dataExpression]).length - 1) {
                        const doms = parseDOM(itemHtml, this.parserOptions).filter(
                            (dom) => dom?.type.toLocaleLowerCase() === SyntaxKind.Tag,
                        );
                        DomUtils.append(newNode, doms[0]);
                        newNode = doms[0];
                    }
                }
                i++;
            }
        } else {
            throw new Error('loop symbol error');
        }
        return (parent as Element)?.children[nextIndex + 1] ?? (parent as Element).nextSibling;
    }
}
