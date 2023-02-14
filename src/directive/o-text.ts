/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-14 15:16:25
 * @Description: text
 */
import type { AnyNode } from 'domhandler';
import { DataNode, Element, Node } from 'domhandler';
import * as DomUtils from 'domutils';
import { parseDOM } from 'htmlparser2';
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
        let text = (node as DataNode).data;
        text = text.replace(/(\{\{.*?\}\})/g, function (varText: string) {
            const variable = varText.match(/\{\{(.*?)\}\}/)![1].trim();
            if (!(variable in data)) {
                throw new Error(`'${variable}' not found!`);
            }
            return new Function('data', `with(data){ return ${variable} }`)(data);
        });
        (node as DataNode).data = text;
        return node;
    }
}
