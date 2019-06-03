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
    let splitted = /^(\S+)\s+(.+)/.exec(line);
    if (splitted && splitted[1] && splitted[2]) {
        return {shortArg: splitted[1], description: splitted[2]};
    }
    return null;
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

