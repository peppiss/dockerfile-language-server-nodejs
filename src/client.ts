import * as child_process from "child_process";
import { StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc";

let lspProcess = child_process.spawn("node", [ "out/src/server.js", "--stdio" ]);
let messageId = 1;

const reader = new StreamMessageReader(lspProcess.stdout);
const writer = new StreamMessageWriter(lspProcess.stdin);

function send(method: string, params: object) {
    let message = {
        jsonrpc: "2.0",
        id: messageId++,
        method: method,
        params: params
    };
    writer.write(message);
}

function initialize() {
    send("initialize", {
        rootPath: process.cwd(),
        processId: process.pid,
        capabilities: {
            /* ... */
        }
    });
}

reader.listen((data) => {
    console.log(data);
})

initialize();