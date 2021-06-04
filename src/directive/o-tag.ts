import { Node } from 'domhandler';

export default abstract class OTag {
    protected parserOptions: any = {
        xmlMode: true,
    };

    abstract parse(node: Node, parent: Node | undefined, index: number, data: any, options?: any): Node | undefined | null;
}
