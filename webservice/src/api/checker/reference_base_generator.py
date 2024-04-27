import os
import unidecode
from nltk.tokenize import word_tokenize
import joblib
from nltk.corpus import stopwords
from nltk.stem import RSLPStemmer
import re
import spacy
from .variable_parsear import extract_variable_names


def extract_keywords(text, solution_reference):
    """
    Retorna lista de tokens normalizados. A normalização inclui:
        - Remoção de acentos
        - Tokenização
        - Remoção de tokens que não são palavras (ex: pontuação)
        - Coloca todas palavras em letras minúsculas
        - Remoção de palavras irrelevantes (stopwords)
        - Seleção de palavras com determinadas classes gramaticais (substantivos e adjetivos)
        - Remoção de palavras menores que 3 caracteres
        - Remoção de palavras que contenham apenas números ou caracteres repetidos (ex: "aaa111" ou "ttt333") 
    """

    folder = '/api/checker/trained_POS_taggers/'

    word_tokens = word_tokenize(text)
    word_tokens = [unidecode.unidecode(token) for token in word_tokens]
    
    cod_reference_tokens = word_tokenize(' '.join(solution_reference))
    
    word_tokens = [token for token in word_tokens if token.isalpha()]
    word_tokens = [token.lower() for token in word_tokens]

    tagger01 = joblib.load(os.getcwd()+folder+'POS_tagger_brill.pkl')

    word_tokens_tagged01 = tagger01.tag(word_tokens)

    nlp = spacy.load('pt_core_news_sm')

    word_tokens_doc = [nlp(token) for token in word_tokens]

    word_tokens_tagged02 = []
    for doc in word_tokens_doc:
        for token in doc:
            word_tokens_tagged02.append((token.text, token.tag_))

    stop_words = set(stopwords.words('portuguese'))
    filtered_tokens01 = [w for w, tag in word_tokens_tagged01 if not w in stop_words and (tag == "N" or tag == "ADJ") and len(w) > 2 and not re.match(r'^[a-zA-Z]*([0-9]+)$', w) and not re.match(r'^(\w)\1+[0-9]*$', w)]
    filtered_tokens02 = [w[0] for w in word_tokens_tagged02 if not w[0] in stop_words and (w[1] == "NOUN" or w[1] == "ADJ") and len(w[0]) > 2 and not re.match(r'^[a-zA-Z]*([0-9]+)$', w[0]) and not re.match(r'^(\w)\1+[0-9]*$', w[0])]

    filtered_tokens01.extend(filtered_tokens02)

    filtered_tokens01 = list(set(filtered_tokens01))

    stemmer = RSLPStemmer()
    stemmed_tokens = [stemmer.stem(word) for word in filtered_tokens01]
    stemmed_solution_reference = [stemmer.stem(variable) for variable in cod_reference_tokens]


    return stemmed_tokens, stemmed_solution_reference


def generate_reference_vocabulary(problem_description, solution_reference):
    """
    - problem_description: Descrição de um problema
    - reference_vocabulary: Conjunto de palavras normalizadas e
      relevantes para o problema
    """
    
    normalized_description, normalized_refence = extract_keywords(problem_description, extract_variable_names(solution_reference))
    
    normalized_description.extend(normalized_refence)

    reference_vocabulary = set(normalized_description)

    return reference_vocabulary, (list(reference_vocabulary), normalized_refence)