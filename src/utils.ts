import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as proc from 'process';


export function resolve(filePath: string): string {
        if (!filePath) {
            return "";
        }
        const p = filePath.replace("~", this.home());
        return path.normalize(path.resolve(p));
    }

export function home(): string{
    return proc.env[(proc.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}