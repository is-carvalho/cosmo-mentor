import ast

def extract_variable_names(code):
    # Transforma o código em uma árvore sintática abstrata
    tree = ast.parse(code)
    
    # Lista para armazenar os nomes das variáveis
    variable_names = []

    
    # Percorre a árvore sintática e procura por nomes de variáveis
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            variable_names.append(node.id)
    
    return set(variable_names)
