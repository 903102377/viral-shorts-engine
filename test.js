const fs = require('fs');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/tools/flow-automator.ts', 'utf8');
const sf = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest);
const diagnostics = sf.parseDiagnostics;
if (diagnostics.length) {
    diagnostics.forEach(d => {
        const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
        console.log(`Line ${line + 1}: ${d.messageText}`);
    });
} else {
    console.log("No syntax errors found by TS parser");
}
