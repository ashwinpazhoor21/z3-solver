import { init } from 'z3-solver';

// Initialize Z3 context and solver
const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");
const animalAllocationSolver = new Solver();

// Define variables for participants
const bob = Int.const('Bob');
const mary = Int.const('Mary');
const cathy = Int.const('Cathy');
const sue = Int.const('Sue');

// Add constraints
animalAllocationSolver.add(
    // Assign specific animals
    bob.eq(1),   // Bob gets Dog
    sue.eq(3),   // Sue gets Bird

    // Mary cannot get Fish
    mary.neq(2),

    // All participants must have distinct animals
    Distinct(bob, mary, cathy, sue),

    // Ensure animal IDs are within valid range (1 to 4)
    And(bob.ge(1), bob.le(4)),
    And(mary.ge(1), mary.le(4)),
    And(cathy.ge(1), cathy.le(4)),
    And(sue.ge(1), sue.le(4))
);

// Check if constraints are satisfiable
console.log(await animalAllocationSolver.check());

// Extract the model if satisfiable
const model = animalAllocationSolver.model();
const bobAnimal = model.eval(bob);
const maryAnimal = model.eval(mary);
const cathyAnimal = model.eval(cathy);
const sueAnimal = model.eval(sue);

// Map animal IDs to their names
const animalMap = {
    1: 'Dog',
    2: 'Fish',
    3: 'Bird',
    4: 'Cat'
};

// Print results
const participants = ['Bob', 'Mary', 'Cathy', 'Sue'];
const animalAssignments = [bobAnimal, maryAnimal, cathyAnimal, sueAnimal];

participants.forEach((name, index) => {
    const animalID = parseInt(animalAssignments[index].toString(), 10);
    console.log(`${name}: ${animalMap[animalID]}`);
});