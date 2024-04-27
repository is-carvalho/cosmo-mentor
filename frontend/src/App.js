import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile.jsx';
import RegisterUser from './pages/RegisterUser';
import Answer from './pages/Answer.jsx';
import Course from './pages/Course';
import Class from './pages/Class';
import Question from './pages/Question.js';
import RegisterConcept from './pages/RegisterConcept';
import EditConcepts from './pages/EditConcepts';
import { PrivateRoute } from './authorization/PrivateRoute';
import QuestionsManager from './pages/QuestionsManager';
import RegisterQuestion from './pages/RegisterQuestion';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import LogSubmissionsProfessor from './pages/LogSubmissionsProfessor';
import LogSubmissionsStudent from './pages/LogSubmissionsStudent';

import Menu from './pages/Menu.jsx';
import Forum from './pages/Forum.jsx';
import CreatePost from './pages/CreatePost.jsx';
import InsidePost from './pages/InsidePost.jsx';
import ChangeQuestionOrder from './pages/ChangeQuestionOrder.jsx';
import CacabugsManager from './pages/CacabugsManager';
import Cacabugs from './pages/Cacabugs.jsx';
import CacaBugsQuestao from './pages/CacabugsQuestao.jsx';

import CreateDojo from './pages/CreateDojo';
import ChooseDojo from './pages/ChooseDojo';
import CodeDojo from './pages/CodeDojo';
import AnswerDojo from './pages/AnswerDojo';

import { ToastProvider, useToasts } from 'react-toast-notifications';
import DashboardClass from './pages/DashboardClass';
import Ranking from './pages/Ranking';
import CodeModal from './pages/components/CodeModal';

import TheoryManager from './pages/TheoryManager';
import CreateTheory from './pages/CreateTheory';
import ReadTheory from './pages/ReadTheory';
import ViewTheory from './pages/ViewTheory';
import UpdateTheory from './pages/UpdateTheory';

import AnswerProcessImage from './pages/AnswerProcessImage.jsx';
class App extends Component {
  render() {
    return (
      <ToastProvider
        placement='top-center'
        newestOnTop={true}
      >
        <BrowserRouter>
          <div className='App'>
            <Switch>
              <Route
                exact
                path='/cadastrar'
                component={RegisterUser}
              />
              <Route
                exact
                path='/'
                component={Login}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/log'
                component={Log}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/logSubmissoesProfessor'
                component={LogSubmissionsProfessor}
              />
              <PrivateRoute
                type='1,2,3'
                exact
                path='/LogSubmissionsStudent'
                component={LogSubmissionsStudent}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/dashboardClass'
                component={DashboardClass}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/questoes/cadastrar'
                component={RegisterQuestion}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/questoes/cadastrarConceito'
                component={RegisterConcept}
              />
              <PrivateRoute
                type='1,2'
                exact
                path='/questoes/mudarOrdem'
                component={ChangeQuestionOrder}
              />
              <PrivateRoute
                type='1,2'
                path='/:idQuest/editar'
                component={RegisterQuestion}
              />
              <PrivateRoute
                type='1,2,3'
                path='/:idQuest/visualizar'
                component={Answer}
              />
              <PrivateRoute
                type='1,2'
                path='/questoes'
                component={QuestionsManager}
              />
              <PrivateRoute
                type='1,2'
                path='/dashboard'
                component={Dashboard}
              />
              <PrivateRoute
                type='3'
                path='/menu'
                component={Menu}
              />
              <PrivateRoute
                type='3'
                path='/cursos'
                component={Course}
              />
              <PrivateRoute
                type='3'
                path='/cacabugs'
                component={Cacabugs}
              />
              <PrivateRoute
                type='3'
                path='/:idQuestao/cacabugs'
                component={CacaBugsQuestao}
              />
              <PrivateRoute
                type='1,2'
                path='/cacabugsmanager'
                component={CacabugsManager}
              />
              <PrivateRoute
                type='3'
                path='/:idCurso/turmas'
                component={Class}
              />
              <PrivateRoute
                type='3'
                path='/:idCurso/:idTurma/questoes'
                component={Question}
              />
              <PrivateRoute
                type='3'
                path='/:idTurma/:idQuest/responder'
                component={Answer}
              />
              <PrivateRoute
                type='3'
                path='/:idTurma/:idQuest/responderDojo'
                component={AnswerDojo}
              />
              <PrivateRoute
                type='3'
                path='/:idTurma/:idQuest/processImage'
                component={AnswerProcessImage}
              />
              <PrivateRoute
                path='/profile'
                component={Profile}
              />
              <Route
                type='1,2,3'
                exact
                path='/:idCurso/:idTurma/:idQuest/duvidas'
                component={Forum}
              />
              <Route
                type='1,2,3'
                path='/forum'
                component={Forum}
              />
              <Route
                type='1,2,3'
                exact
                path='/criarPost'
                component={CreatePost}
              />
              <Route
                type='1,2,3'
                exact
                path='/:idCurso/:idTurma/:idQuest/criarPost'
                component={CreatePost}
              />
              <Route
                type='1,2,3'
                exact
                path='/respostas/:idPost'
                component={InsidePost}
              />
              <PrivateRoute
                type='1,2'
                path='/createDojo'
                component={CreateDojo}
              />
              <Route
                type='1,2,3'
                exact
                path='/choose-dojo'
                component={ChooseDojo}
              />
              <PrivateRoute
                type='1,2,3'
                path='/:idDojo/responder'
                component={CodeDojo}
              />
              <PrivateRoute
                type='3'
                path='/cacabugs'
                component={Cacabugs}
              />
              <PrivateRoute
                type='3'
                path='/:idQuestao/cacabugs'
                component={CacaBugsQuestao}
              />
              <PrivateRoute
                type='1,2'
                path='/theory-list'
                component={TheoryManager}
              />
              <PrivateRoute
                type='1,2'
                path='/theory-edit/:id'
                component={UpdateTheory}
              />
              <PrivateRoute
                type='1,2'
                path='/theory-add'
                component={CreateTheory}
              />
              <PrivateRoute
                type='1,2'
                path='/theory-detail/:id'
                component={ReadTheory}
              />
              <PrivateRoute
                type='1,2,3'
                path='/theory-view/:idTurma/:idConceito'
                component={ViewTheory}
              />
              <PrivateRoute
                type='1,2,3'
                path='/ranking'
                component={Ranking}
              />
              <PrivateRoute
                type='1,2,3'
                path='/codeModal'
                component={CodeModal}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </ToastProvider>
    );
  }
}

export default App;
