import { Node } from 'domhandler';

export default abstract class OTag {
    abstract parse(node: Node, parent: Node | undefined, index: number, data: any, options?: any): Node | undefined | null;
}
