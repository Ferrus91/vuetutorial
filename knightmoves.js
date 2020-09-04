const jumps = [-2, -1, 1, 2];
const possibleMoves = jumps
  .map(x => jumps
       .filter(y => Math.abs(x) !== Math.abs(y))
       .map(y => ({ x, y }))
      ).reduce((acc, curr) => acc.concat(curr), []);
const lowerBound = 1;
const upperBound = 8;
const aCharCode = 'a'.charCodeAt(0);
const asciiToNumber = char => char.charCodeAt(0) - (aCharCode - 1);
const numberToAscii = number => String.fromCharCode(number + (aCharCode - 1));  

const generateAllowedKnightMoves = (position) => {
  const x = asciiToNumber(position.charAt(0));
  const y = Number(position.charAt(1));
  return possibleMoves
    .map(({ x: possibleX, y: possibleY}) => ({ x: x + possibleX, y: y + possibleY}))
    .filter(coordinates => 
        Object.values(coordinates).every(coordinate => coordinate >= lowerBound && coordinate <= upperBound))
    .map(({x, y}) => `${numberToAscii(x)}${y}`);
}

const knight = (start, finish) => {
  let pendingPositions = [{ position: start, searchLength: 0 }];
  const seenPositions = new Set([start]);
  if (start === finish) return 0;
  while (pendingPositions.length > 0) {
    const { position, searchLength } = pendingPositions.shift();
    seenPositions.add(position);
    const newPositions = generateAllowedKnightMoves(position)
        .filter(position => !seenPositions.has(position))
        .map(position => ({ position, searchLength: searchLength + 1}));
    if (newPositions.some(newPosition => newPosition.position === finish)) return searchLength + 1;
    pendingPositions = pendingPositions.concat(newPositions);
  }
  throw Error('No solution!');
}
