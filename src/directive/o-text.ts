import { Element, Node } from 'domhandler';
import OTag from './o-tag';

export default class OText extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data?: any, options?: any) {
        return node;
    }
    parseTextBlock(node: Node, parent: Node | undefined, index: number, data?: any, options?: any): Node {
        return node;
    }
}
