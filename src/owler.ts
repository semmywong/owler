/*
 * @Author: Semmy Wong
 * @Date: 2023-01-29 15:22:28
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-03-14 19:36:32
 * @Description: owler main class
 */
import crypto from 'crypto';
import render from 'dom-serializer';
import type { AnyNode } from 'domhandler';
import { DomHandler } from 'domhandler';
import fs from 'fs';
import { Parser } from 'htmlparser2';
import path from 'path';
import { walkVisit } from './utils';

export default class Owler {
    /** cache page */
    private caches: Map<string, string> = new Map();

    private defaultOptions: OwlerOption = {
        root: './',
        views: './',
        viewExt: '.html',
    };

    constructor(options?: any) {
        Object.assign(this.defaultOptions, options);
    }

    private parseDom(ast: AnyNode[], data: any, options?: any) {
        for (let i = 0; i < ast.length; i++) {
            walkVisit(ast[i], void 0, i, data, options);
        }
    }

    /**
     *
     * @param html html string
     * @param data data which use in html to render
     * @param options
     */
    public render(html: string, data: any = {}, options?: any) {
        let md5Value = crypto.createHash('md5').update(html, 'utf8').update(JSON.stringify(data)).digest('hex');
        let renderHtml = this.caches.get(md5Value) ?? '';
        if (renderHtml) {
            return renderHtml;
        }
        const handler = new DomHandler((error, ast) => {
            if (error) {
                // Handle error
                throw error;
            } else {
                this.parseDom(ast, data, Object.assign({}, this.defaultOptions, options));
                renderHtml = render(ast);
            }
        });
        const parser = new Parser(handler, { xmlMode: true });
        parser.write(html);
        parser.end();
        md5Value = crypto.createHash('md5').update(renderHtml, 'utf8').digest('hex');
        this.caches.set(md5Value, renderHtml);
        return renderHtml;
    }

    /**
     *
     * @param filePath will be rendered file path and file name.
     * @param data data which use in html to render
     * @param options
     */
    public renderFile(filePath: string, data: any, options?: any) {
        const { root, views, viewExt } = this.defaultOptions;
        const content = fs.readFileSync(path.join(root, views, `${filePath}${viewExt}`), 'utf8');
        return this.render(content, data, options);
    }
}
