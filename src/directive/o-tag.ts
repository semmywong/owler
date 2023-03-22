/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-22 09:37:09
 * @Description: base tag class
 */
import { Node } from 'domhandler';

export default abstract class OTag {
    protected parserOptions: any = {
        xmlMode: true,
    };

    abstract parse(node: Node, parent: Node | undefined, index: number, data: any, options?: any): Node | undefined | null;
}
