import { Element, Node } from 'domhandler';
import OTag from './o-tag';

export default class OFor extends OTag {
    parse(node: Node, parent: Node | undefined, index: number, data?: any, options?: any) {
        return node;
    }
}
