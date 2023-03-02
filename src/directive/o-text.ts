/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-02 21:26:43
 * @Description: text
 */
import type { AnyNode } from 'domhandler';
import { DataNode, Element, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import { parseDOM } from 'htmlparser2';
import jsonParse from 'json-templates';
import { SymbolTag } from '../common/constant';
import OTag from './o-tag';

export default class OText extends OTag {
    parse(node: AnyNode, parent: AnyNode | undefined, index: number, data?: any, options?: any) {
        const expression = (node as Element).attribs[SymbolTag.OText];
        delete (node as Element).attribs[SymbolTag.OText];
        let result: string = '';
        try {
            const func = new Function('data', `with(data){ return ${expression} }`);
            result = func(data);
        } catch (error) {
            console.error(error);
            throw new Error(`can not execute expression '${expression}'`);
        }
        const newNodes = parseDOM(result, this.parserOptions);
        newNodes?.forEach((n) => DomUtils.appendChild(node as Element, n));
        return node;
    }
    parseTextBlock(node: Node, parent: Node | undefined, index: number, data?: any, options?: any): Node {
        const text = (node as DataNode).data;
        const template = jsonParse(text);
        (node as DataNode).data = String(template(data));
        return node;
    }
}
