describe('--help parser', () => {
    it('should return an empty array if no args are found', () => {
        expect(parseHelp('')).toEqual([])
    });
    it('should parse a single arg in a single line', () => {
        const expected: Array<Arg> = [{shortArg:'-v', description: 'Print version'}];
        expect(parseHelp('-v    Print version')).toEqual(expected);
    });
    it('should parse a single arg in multiple lines', () => {
        const expected: Array<Arg> = [
            {shortArg:'-v', description: 'Print version'},
            {shortArg:'-g', description: '-g opt'},
        ];
        expect(parseHelp('-v    Print version\n\n-g  -g opt')).toEqual(expected);
    });
});

describe('parseArgLine', () => {
    describe('should return a null', () => {
        it('if string is empty', () => {
            expect(parseArgLine('')).toEqual(null)
        });
        it('if string does not contain an arg', () => {
            expect(parseArgLine('some irrelevant text')).toEqual(null)
        });
    });
    describe('should return an arg', () => {
        it('has string containing short arg and description', () => {
            expect(parseArgLine('-s    a short arg')).toEqual({shortArg:'-s', description: 'a short arg'});
        });
        it('has string containing long arg and description', () => {
            expect(parseArgLine('--long a long arg')).toEqual({longArg:'--long', description: 'a long arg'});
        });
        it('has string containing both short and long arg and description', () => {
            expect(parseArgLine('-s, --long short and long arg')).toEqual({
                shortArg:'-s',
                longArg: '--long',
                description: 'short and long arg'
            });
        });
        it('has string containing both short and long arg and description with hyphen', () => {
            expect(parseArgLine('-s, --long - 1 short and 1 long - the arg')).toEqual({
                shortArg:'-s',
                longArg: '--long',
                description: '1 short and 1 long - the arg'
            });
        });
    });
});

function parseHelp(output: string): Array<Arg> {
    let res: Array<Arg> = [];

    for (let line of output.split("\n")) {
        let arg = parseArgLine(line);
        if (arg) {
            res.push(arg);
        }
    }

    return res;
}

function parseArgLine(line: string): Arg | null {
    line = line.trim();
    if (!line.startsWith('-')) {
        return null;
    }

    const shortArg = hasArg(/(?<!-)-\w+/.exec(line));
    const longArg = hasArg(/--\w+/.exec(line));
    if (!Boolean(shortArg || longArg)) {
        return null;
    }

    const description = line
        .replace(shortArg || '', '')
        .replace(longArg || '', '')
        .replace(/^\W+\s/, '').trim()
    ;
    if (description) {
        let arg: Arg = {description: description};
        if (shortArg) {
            arg.shortArg = shortArg;
        }
        if (longArg) {
            arg.longArg = longArg;
        }
        return arg;
    }

    return null;

    function hasArg(regexResult:  RegExpExecArray | null): string | null {
        return regexResult && regexResult[0];
    }

}

interface Arg {
    description: string;
    longArg?: string;
    shortArg?: string;
}

// TODO CLI:
// should print an error if no argument is specified

// Parser:
// should return an object with corresponding description and long and/or short option
// should return a [] if no options are found

