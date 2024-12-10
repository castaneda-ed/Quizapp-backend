const prisma = require("../prisma");
const seed = async () => {
  const categories = [
    { name: "General Knowledge" },
    { name: "Science" },
    { name: "Math" },
    { name: "History" },
  ];

  // Insert categories into the database
  await prisma.category.createMany({
    data: categories,
  });

  // Retrieve inserted categories with their IDs
  const insertedCategories = await prisma.category.findMany();

  const quizzes = [
    {
      category: insertedCategories.find(
        (cat) => cat.name === "General Knowledge"
      ).id,
      language: "English",
      difficulty: "Medium",
      questions: [
        {
          text: "What is the capital of France?",
          options: ["Paris", "London", "Berlin", "Madrid"],
          answer: "Paris",
        },
        {
          text: "Who wrote 'Romeo and Juliet'?",
          options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
          answer: "Shakespeare",
        },
        {
          text: "What is the largest planet in the solar system?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          answer: "Jupiter",
        },
        {
          text: "What is the freezing point of water?",
          options: ["0°C", "32°F", "100°C", "212°F"],
          answer: "0°C",
        },
        {
          text: "What element does 'O' represent on the periodic table?",
          options: ["Oxygen", "Osmium", "Ozone", "Opium"],
          answer: "Oxygen",
        },
      ],
    },
    {
      category: insertedCategories.find((cat) => cat.name === "Science").id,
      language: "English",
      difficulty: "Hard",
      questions: [
        {
          text: "What is the chemical symbol for gold?",
          options: ["Au", "Ag", "Pb", "Fe"],
          answer: "Au",
        },
        {
          text: "Who developed the theory of relativity?",
          options: ["Einstein", "Newton", "Galileo", "Darwin"],
          answer: "Einstein",
        },
        {
          text: "What is the atomic number of carbon?",
          options: ["6", "12", "8", "2"],
          answer: "6",
        },
        {
          text: "Which scientist discovered penicillin?",
          options: ["Einstein", "Darwin", "Fleming", "Newton"],
          answer: "Fleming",
        },
        {
          text: "What is the formula for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          answer: "H2O",
        },
      ],
    },
    {
      category: insertedCategories.find((cat) => cat.name === "History").id,
      language: "English",
      difficulty: "Easy",
      questions: [
        {
          text: "Who was the first president of the United States?",
          options: [
            "Abraham Lincoln",
            "George Washington",
            "Thomas Jefferson",
            "John Adams",
          ],
          answer: "George Washington",
        },
        {
          text: "In which year did World War II end?",
          options: ["1945", "1940", "1918", "1939"],
          answer: "1945",
        },
        {
          text: "Which country was the first to land on the moon?",
          options: ["USA", "USSR", "China", "India"],
          answer: "USA",
        },
        {
          text: "Who painted the Mona Lisa?",
          options: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Claude Monet",
          ],
          answer: "Leonardo da Vinci",
        },
        {
          text: "In which year did the Titanic sink?",
          options: ["1912", "1920", "1898", "1930"],
          answer: "1912",
        },
      ],
    },
  ];

  for (const quiz of quizzes) {
    await prisma.quiz.create({
      data: {
        categoryId: quiz.category,
        language: quiz.language,
        difficulty: quiz.difficulty,
        questions: {
          create: quiz.questions,
        },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
