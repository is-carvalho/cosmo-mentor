from flask import Blueprint
from flask import request, jsonify
from api.utils.responses import response_with
from api.utils import responses as resp
from api.checker.quality_checkers import get_checkers



suggestion_routes = Blueprint("suggestion_routes", __name__)

@suggestion_routes.route('/', methods=['POST'])
def create_suggestion():
    try:
        data = request.get_json()

        content = data['codigo']
        author = data['aluno']
        question = data['questao']
        language = data['language']

        content = content.replace('\r', '')

        checkers = get_checkers(data['questao_desc'], content, data['solucao'])
        
        message = {'variaveis': checkers['variable_suggestor'].get_suggestions(),
                    'complexidade': checkers['complexity_suggestor'].get_suggestions(),
                    'refatoracao': checkers['refactoring_suggestor'].get_suggestions()}        

        return response_with(resp.SUCCESS_201, value={"suggestions":message})
    
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)
