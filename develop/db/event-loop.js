const fs = require('fs');
const dns = require('dns');

function timestamp() {
    return performance.now().toFixed(2);
}

console.log("Program start", timestamp());

console.log("Program end", timestamp());

process.nextTick(() => {
    console.log("Next tick", timestamp());
})

Promise.resolve()
    .then(() => {
        console.log("Promise 1", timestamp());
    });

setTimeout(() => {
    console.log("Program run 0", timestamp());
}, 0);

dns.lookup('localhost', (err, address, family) => {
    console.log("DNS lookup", address, timestamp());
})

setImmediate(() => {
    console.log("Immediate", timestamp());

})

fs.writeFile('./test.txt', "Hello World!", () => console.log("File done", timestamp()));

setTimeout(() => {
    console.log("Program run 1", timestamp());
}, 100);