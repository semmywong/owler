import { Element, Node, DataNode } from 'domhandler';
import { parseDOM } from 'htmlparser2';
import * as DomUtils from 'domutils';
import OTag from './o-tag';
import { SymbolTag } from '../common/constant';

export default class OText extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data?: any, options?: any) {
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
