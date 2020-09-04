const jumps = [-2, -1, 1, 2];
const possibleMoves = jumps
  .map(x => jumps
       .filter(y => Math.abs(x) !== Math.abs(y))
       .map(y => ({ x, y }))
      ).reduce((acc, curr) => acc.concat(curr), []);
const lowerBound = 1;
const upperBound = 8;


function asciiToNumber(char) {
  return char.charCodeAt(0) - 96;
}

function numberToAscii(number) {
    return String.fromCharCode(number + 96);
}  

function generateAllowedKnightMoves(position) {
  const x = asciiToNumber(position.charAt(0));
  const y = Number(position.charAt(1));
  return possibleMoves
    .map(({ x: possibleX, y: possibleY}) => ({ x: x + possibleX, y: y + possibleY}))
    .filter(coordinates => 
        Object.values(coordinates).every(coordinate => coordinate >= lowerBound && coordinate <= upperBound))
    .map(({x, y}) => `${numberToAscii(x)}${y}`);

}

function knight(start, finish) {
  let pendingPositions = [{ position: start, searchLength: 0 }];
  const seenPositions = new Set([start]);
  while (pendingPositions.length > 0) {
    const { position, searchLength } = pendingPositions.shift();
    if (position === finish) {
        return searchLength;
    } else {
        seenPositions.add(position);
        const newPositions = generateAllowedKnightMoves(position)
            .filter(position => !seenPositions.has(position))
            .map(position => ({ position, searchLength: searchLength + 1}));
        pendingPositions = pendingPositions.concat(newPositions);
    }
  }
  throw Error('No solution!');
}
