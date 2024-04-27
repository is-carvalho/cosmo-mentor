from collections import defaultdict
import re
import Levenshtein
import spacy
from .reference_base_generator import generate_reference_vocabulary
from .variable_name_checker import classify_variable_names
from .variable_parsear import extract_variable_names
import torch
from transformers import BertModel, BertTokenizer

SIMILARITY_THRESHOLD = 0.65

def calculate_semantic_similarity(bad_variable, reference_variable):

    # Carregue o tokenizer e o modelo BERT
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertModel.from_pretrained("bert-base-uncased")

    # Tokenize as palavras
    tokens_word1 = tokenizer.tokenize(bad_variable)
    tokens_word2 = tokenizer.tokenize(reference_variable)

    # Adicione tokens especiais [CLS] e [SEP]
    tokens = ["[CLS]"] + tokens_word1 + ["[SEP]"] + tokens_word2 + ["[SEP]"]

    # Converta os tokens em IDs
    input_ids = tokenizer.convert_tokens_to_ids(tokens)

    # Certifique-se de que as entradas tenham o mesmo comprimento
    max_length = max(len(tokens_word1), len(tokens_word2)) + 3  # +3 para [CLS], [SEP], [SEP]
    input_ids += [0] * (max_length - len(input_ids))  # Preencha com zeros se necessário

    # Converta para tensor e alimente para o modelo BERT
    input_ids = torch.tensor(input_ids).unsqueeze(0)  # Adicione uma dimensão para batch size
    embeddings = model(input_ids)[0]

    # Reshape para que os vetores tenham a mesma forma
    embeddings_word1 = embeddings[0][:len(tokens_word1)]
    embeddings_word2 = embeddings[0][-len(tokens_word2):]

    # Calcule a similaridade de cosseno entre os vetores de representação médios
    similarity = torch.nn.functional.cosine_similarity(embeddings_word1.mean(dim=0).unsqueeze(0), embeddings_word2.mean(dim=0).unsqueeze(0))

    return similarity.item()

def calculate_levenshtein_similarity(bad_variable, reference_variable):
    return Levenshtein.ratio(bad_variable.lower(), reference_variable.lower())

def calculate_combined_similarity(bad_variable, reference_variables):
    similarities = [
        (variable, (calculate_levenshtein_similarity(bad_variable.lower(), variable.lower()) + calculate_semantic_similarity(bad_variable.lower(), variable.lower())) / 2)
        for variable in reference_variables
    ]
    return sorted(similarities, key=lambda x: x[1], reverse=True)

def variable_lines_map(code):

    student_variables = extract_variable_names(code)

    lines = code.split('\n')
    variables = defaultdict(list)
    
    for i, line in enumerate(lines):
        for student_var in student_variables:
            if student_var in line:
                variables[student_var].append(i)

    return variables
    

def find_variable_line(variable_name, map):

    if variable_name in map:
    
        return map[variable_name] # Return a list with the lines of the variables occurence


def check_naming_conventions(variable_names):

    def check(variable_name):
        """
        Check if the variable_name follows snake_case naming convention.
        Returns True if it adheres to the convention, otherwise False.
        """
        # Remove leading/trailing underscores, if any
        variable_name = variable_name.strip('_')

        # Check if the variable_name contains only lowercase letters, digits, and underscores
        valid_characters = set('abcdefghijklmnopqrstuvwxyz0123456789_')

        if all(char in valid_characters for char in variable_name):
            # Check if the variable_name starts with a lowercase letter
            if variable_name[0].islower():
                return {'variable_name': variable_name, 'is_valid':True}

        return {'variable_name': variable_name, 'is_valid':False}
    
    results = map(check, variable_names)
    return results

def buld_naming_conventions_msg(check_conventions_results, variables_map):

    check_conventions_msgs = []
    for variable in check_conventions_results:
        if not variable['is_valid']:
            variable_lines = find_variable_line(variable["variable_name"], variables_map)
            for variable_line in variable_lines:
                check_conventions_msgs.append({'type':'error', 'message':f'Aviso: A variável "{variable["variable_name"]}" não segue as convenções de nomenclatura.', 'line': variable_line + 1})
                check_conventions_msgs.append({'type':'info', 'message':'Variáveis e funções python devem seguir o padrão snake_case (letras minúsculas separadas por underscore).\nEx: minha_variavel, não MINHA_VARIAVEL.\n', 'line': variable_line + 1})

    #if len(check_conventions_msgs) > 0:
        #check_conventions_msgs.append({'type':'info', 'message':'Variáveis e funções python devem seguir o padrão snake_case (letras minúsculas separadas por underscore). \n\n', 'line': find_variable_line(variable["variable_name"], variables_map)})
    
    return check_conventions_msgs


def get_similarity_variables_score(bad_variable_names, solution_reference):
    variables_similarities = {}

    for bad_variable in bad_variable_names:
        combined_similarity = calculate_combined_similarity(bad_variable, solution_reference)
        variables_similarities[bad_variable] = combined_similarity
    return variables_similarities

def suggestions(bad_variable, best_suggestions,
                not_too_best_best_suggestions, 
                good_variable_names, variables_map):
    
    variable_lines = find_variable_line(bad_variable, variables_map)
    suggestions = []
    if (len(bad_variable) > 2 and bad_variable[1] != '_'):
        if len(best_suggestions) > 0:
            best_suggestion = best_suggestions[0][0]
            for variable_line in variable_lines:
                suggestions.append({'type': 'warning', 'message': f'Considere substituir a variável "{bad_variable}" por: {best_suggestion}', 'line': variable_line + 1})
                suggestions.append({'type':'info', 'message':'Escolha sempre nomes descritivos e representativos para suas variáveis. Isso torna seu código muito mais legível e compreensível.\n', 'line': suggestions[-1]['line']})
        else:
            suggestion_text = ''
            if len(not_too_best_best_suggestions) < 3:
                for not_best_suggestion in not_too_best_best_suggestions[0:2]:
                    suggestion_text += f'\n "{not_best_suggestion[0]}"'
            else:
                 for not_best_suggestion in not_too_best_best_suggestions[0:3]:
                    suggestion_text += f'\n "{not_best_suggestion[0]}"'

            for variable_line in variable_lines:
                
                suggestions.append({'type':'warning', 'message':f'Considere substituir a variável "{bad_variable}" por nomes mais descritivos. O que você acha dos seguites nomes: {suggestion_text}', 'line':variable_line + 1})
                suggestions.append({'type':'info', 'message':'Escolha sempre nomes descritivos e representativos para suas variáveis. Isso torna seu código muito mais legível e compreensível.\n', 'line': suggestions[-1]['line']})
    else:
        suggestion_text = ''
        not_too_best_best_suggestions = set([item[0] for item in not_too_best_best_suggestions]) - set(good_variable_names)
        
        for not_best_suggestion in not_too_best_best_suggestions:
            suggestion_text += f'\n "{not_best_suggestion}"'

        for variable_line in variable_lines:
            suggestions.append({'type':'warning', 'message':f'Considere substituir a variável "{bad_variable}" por nomes mais descritivos. O que você acha dos seguites nomes: {suggestion_text}\n', 'line': variable_line + 1})
            suggestions.append({'type':'info', 'message':'Escolha sempre nomes descritivos e representativos para suas variáveis. Isso torna seu código muito mais legível e compreensível.\n', 'line': suggestions[-1]['line']})
    return suggestions

def get_suggestions(student_code, solution_reference, problem_description):
    
    variables_map = variable_lines_map(student_code)
    
    reference_vocabulary, _ = generate_reference_vocabulary(problem_description, solution_reference)
    variable_names = classify_variable_names(student_code, reference_vocabulary)
    bad_variable_names = variable_names['bad_variable_names']['variables']
    good_variable_names = variable_names['good_variable_names']['variables']
    

    check_conventions_results = check_naming_conventions(list(extract_variable_names(student_code)))
    suggestions_msg = buld_naming_conventions_msg(check_conventions_results, variables_map)

    if len(bad_variable_names) > 0:

        variables_similarities = get_similarity_variables_score(bad_variable_names, extract_variable_names(solution_reference))
        for bad_variable, similarity_list in variables_similarities.items():

            best_suggestions = [(variable, similarity) for variable, similarity in similarity_list if similarity >= SIMILARITY_THRESHOLD]
            best_suggestions = sorted(best_suggestions, key=lambda x: x[1], reverse=True)

            not_too_best_best_suggestions = [(variable, similarity) for variable, similarity in similarity_list]
            not_too_best_best_suggestions = sorted(not_too_best_best_suggestions, key=lambda x: x[1], reverse=True)

            suggestions_msg = suggestions_msg + suggestions(bad_variable, best_suggestions, not_too_best_best_suggestions, good_variable_names, variables_map)
        
    if suggestions_msg:
        return suggestions_msg
    print("lista variáveis vazia")
    return []