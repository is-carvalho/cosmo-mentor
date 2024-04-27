from .variable_parsear import extract_variable_names
from googletrans import Translator
from langdetect import detect
import unidecode
import re
from nltk.stem import RSLPStemmer

def classify_variable_names(student_code, reference_terms, reserved_words=('i', 'j', 'k', 'conta', 'count')):
    student_variables = extract_variable_names(student_code)
    variables_amount = len(student_variables)

    if variables_amount > 0:
        student_variables = list(set(student_variables))
        translator = Translator()
        
        def translate_to_portuguese(variable):
            try:
                split_variable = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?![a-z])', variable)
                language = detect(split_variable[0]) if split_variable else 'unknown'
                if language == 'en':
                    return [translator.translate(token, dest='pt').text for token in split_variable]
            except:
                pass
            return [variable]
        
        def stem_and_normalize(variables):
            stemmer = RSLPStemmer()
            return [unidecode.unidecode(stemmer.stem(token.lower())) for token in variables]
        
        appropriate_variables = []
        inappropriate_variables = []
        
        for variable in student_variables:
            translated_variables = translate_to_portuguese(variable)
            stemmed_variables = stem_and_normalize(translated_variables)

            if variable in reserved_words:
                appropriate_variables.append(variable)
            elif any(term in reference_terms for term in stemmed_variables):
                appropriate_variables.append(variable)
            else:
                inappropriate_variables.append(variable)

        report = {
            'good_variable_names': {
                'variables': appropriate_variables, 
                'amount': len(appropriate_variables),
            },
            'bad_variable_names': {
                'variables': inappropriate_variables, 
                'amount': len(inappropriate_variables),
            },
        }

        return report
    
    return {'good_variable_names': {'variables': [], 'amount': 0}, 'bad_variable_names': {'variables': [], 'amount': 0}}
