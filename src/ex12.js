const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input12.txt', 'utf-8');

const inputPaths = input
    .split('\n')
    .filter(x => x.length > 0)
    .map(x => x.split('-'));

const nodes = new Map();

inputPaths.forEach((path) => {
    path.forEach(x => {
        if(!nodes.has(x)) {
            nodes.set(x, [])
        }
    });
    const [from, to] = path;

    nodes.get(from).push(to);
    nodes.get(to).push(from);
    
})

console.log(nodes)

function canVisit(currentPath, proposed) {
    if(proposed === proposed.toUpperCase()) {
        return true;
    }
    return !currentPath.includes(proposed);
}

//Return an array of paths
function explorePaths(currentPath, myNodes) {
    const currentNode = currentPath[currentPath.length -1]
    if(currentNode === 'end') {
        return [ currentPath ];
    }
    const routes = myNodes
        .get(currentNode)
        .filter(x => canVisit(currentPath, x));  
    // console.log('path',currentPath,'routes', routes)
    
    return routes.map(route => explorePaths([...currentPath,route],myNodes)).flat();
}

const validPaths = explorePaths(['start'],nodes);

console.log(validPaths, validPaths.length);