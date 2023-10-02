/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-09-22 17:28:17
 * @Description: text
 */
import type { AnyNode } from 'domhandler';
import { DataNode, Element, Node } from 'domhandler';
import { appendChild } from 'domutils';
import { parseDocument } from 'htmlparser2';
import jsonParse from 'json-templates';
import get from 'lodash/get';
import { SymbolTag } from '../common/constant';
import OTag from './o-tag';

export default class OText extends OTag {
    parse(node: AnyNode, parent: AnyNode | undefined, index: number, data?: any, options?: any) {
        const expression = (node as Element).attribs[SymbolTag.OText];
        delete (node as Element).attribs[SymbolTag.OText];
        let result: string = JSON.stringify(get(data, expression));
        const newNodes = parseDocument(result, this.parserOptions).childNodes;
        newNodes?.forEach((n) => appendChild(node as Element, n));
        return node;
    }
    parseTextBlock(node: Node, parent: Node | undefined, index: number, data?: any, options?: any): Node {
        const text = (node as DataNode).data;
        const template = jsonParse(text);
        (node as DataNode).data = String(template(data));
        return node;
    }
}
