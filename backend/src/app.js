const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const path = require('path');

const User = require('./routes/UserRoute');
const State = require('./routes/StateRoute');
const City = require('./routes/CityRoute');
const Course = require('./routes/CourseRoute');
const Class = require('./routes/ClassRoute');
const Question = require('./routes/QuestionRoute');
const Concept = require('./routes/ConceptRoute');
const Answer = require('./routes/AnswerRoute');
const TestCase = require('./routes/TestCaseRoute');
const Language = require('./routes/LanguageRoute');
const Dificulty = require('./routes/DificultyRoute');
const Category = require('./routes/CategoryRoute');
const Log = require('./routes/LogRoute');
const Cards = require('./routes/CardsRoute');
const Forum = require('./routes/ForumRoute');
const Notifications = require('./routes/NotificationRoute');
const Achievement = require('./routes/AchievementRoute');
// const SkillTree = require("./routes/SkillTreeRoute");

const Cacabugs = require('./routes/CacabugsRoute');
const CacabugsManager = require('./routes/CacabugsManagerRoute');
const Ranking = require('./routes/RankingRoute');
const DojoRoute = require('./routes/DojoRoute');
const Tutorial = require('./routes/TutorialRoute');

const TheoryManager = require('./routes/TheoryManagerRoute');
const ImageRoute = require('./routes/ImageRoute');

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-PINGOTHER, Content-Type, Authorization'
  );
  app.use(cors());
  next();
});

app.use(User);
app.use(State);
app.use(City);
app.use(Course);
app.use(Class);
app.use(Question);
app.use(Concept);
app.use(Answer);
app.use(TestCase);
app.use(Language);
app.use(Dificulty);
app.use(Category);
app.use(Log);
app.use(Cards);
app.use(Forum);
app.use(Notifications);
app.use(Achievement);
app.use(Cacabugs);
app.use(CacabugsManager);
app.use(Ranking);
app.use(DojoRoute);
app.use(Tutorial);
app.use(TheoryManager);
app.use(ImageRoute);

app.use(errors());

module.exports = app;
