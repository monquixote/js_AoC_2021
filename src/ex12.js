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
        if (!nodes.has(x)) {
            nodes.set(x, [])
        }
    });
    const [from, to] = path;

    nodes.get(from).push(to);
    nodes.get(to).push(from);

})

console.log(nodes)

function canVisitOnce(currentPath, proposed) {
    if (proposed === proposed.toUpperCase()) {
        return true;
    }
    return !currentPath.includes(proposed);
}

function canVisitTwice(currentPath, proposed) {
    if (proposed === proposed.toUpperCase()) {
        return true;
    }
    if(proposed === 'start') {
        return false;
    }

    if(!currentPath.includes(proposed)) {
        return true;
    }

    const lowerOnly = currentPath
        .filter(x => x === x.toLowerCase())
    
    const uniq = _.uniq(lowerOnly);

    /*
    if(uniq.length !== lowerOnly.length) {
        console.log('fail', currentPath, proposed)
    }
    */

    return uniq.length === lowerOnly.length;
}

//Return an array of paths
function exploreFactory(canVisit) {
    return function explorePaths(currentPath, myNodes) {
        const currentNode = currentPath[currentPath.length - 1]
        if (currentNode === 'end') {
            return [currentPath];
        }
        const routes = myNodes
            .get(currentNode)
            .filter(x => canVisit(currentPath, x));
        // console.log('path',currentPath,'routes', routes)

        return routes.map(route => explorePaths([...currentPath, route], myNodes)).flat();
    }
}

const validPaths = exploreFactory(canVisitOnce)(['start'], nodes);

console.log(validPaths.length);

const validPaths2 = exploreFactory(canVisitTwice)(['start'], nodes);
console.log(validPaths2.length);
