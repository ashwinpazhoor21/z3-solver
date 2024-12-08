import { init } from 'z3-solver';

const { Context } = await init();
const { Solver, Int, And, Or } = new Context("main");
const logicSolver = new Solver();

// Define variables for constraints
const varX = Int.const('varX');
const varY = Int.const('varY');

console.log("Generating points inside the fence...");

// Add constraints for "inside the fence"
logicSolver.add(
    varX.gt(5),
    varX.lt(10),
    varY.gt(15),
    varY.lt(25)
);

if (await logicSolver.check() === 'sat') {
    // Retrieve solution for inside the fence
    const solutionModel = logicSolver.model();
    const xInside = solutionModel.eval(varX);
    const yInside = solutionModel.eval(varY);
    console.log(`Solution: (${xInside}, ${yInside})`);
} else {
    console.log("No solution found: Constraints may conflict.");
}

// Reset solver for the next section
logicSolver.reset();

console.log();
console.log("Generating points on the fence...");

// Add constraints for "on the fence"
logicSolver.add(
    Or(
        And(varX.eq(5), varY.lt(25), varY.gt(15)),
        And(varY.eq(15), varX.lt(10), varX.gt(5))
    )
);

const fenceSolutions = [];

if (await logicSolver.check() === 'sat') {
    while (await logicSolver.check() === 'sat') {
        const model = logicSolver.model();
        const xFence = parseInt(model.eval(varX).toString());
        const yFence = parseInt(model.eval(varY).toString());
        fenceSolutions.push([xFence, yFence]);
        console.log(`(${xFence}, ${yFence})`);

        if (xFence === 5) {
            logicSolver.add(varY.neq(yFence));
        }
        if (yFence === 15) {
            logicSolver.add(varX.neq(xFence));
        }
    }
} else {
    console.log("No solution found: Constraints may conflict.");
}

// Reset solver for the final section
logicSolver.reset();

console.log();
console.log("Generating points outside the fence...");

// Add constraints for "outside the fence"
logicSolver.add(
    varY.ge(20),
    varY.le(30),
    varX.ge(8),
    varX.le(20)
);

const outsideSolutions = [];

if (await logicSolver.check() === 'sat') {
    while (await logicSolver.check() === 'sat') {
        const model = logicSolver.model();
        const xOutside = parseInt(model.eval(varX).toString());
        const yOutside = parseInt(model.eval(varY).toString());
        outsideSolutions.push([xOutside, yOutside]);
        console.log(`(${xOutside}, ${yOutside})`);
        logicSolver.add(Or(varX.neq(xOutside), varY.neq(yOutside)));
    }
} else {
    console.log("No solution found: Constraints may conflict.");
}