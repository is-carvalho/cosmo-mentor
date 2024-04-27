from .refactor_checker import call_to_pylint

def refactor_suggestions(code):
    """ Return a list of messages related to refactoring """

    def problems_to_refactor():
        return call_to_pylint(code)

    problems = problems_to_refactor()

    suggestions = []

    if problems:
        for problem in problems:
            for registro in problems[problem]:
                line = registro[0]

                if problem == 'chaining_comparison':
                    suggestions.append({'type': 'warning', 'message': 'Simplifique as comparações entre os operandos (chained-comparison).', 'line': line})
                    suggestions.append({'type': 'warning', 'message': "Em Python, você pode encadear as comparações de forma mais concisa. Tente escrever 'a < b < c' em vez de 'a < b and b < c'.\n", 'line': line})
                    #if registro == problems[problem][-1]:
                        #suggestions.append({'type': 'warning', 'message': "Em Python, você pode encadear as comparações de forma mais concisa. Tente escrever 'a < b < c' em vez de 'a < b and b < c'.\n", 'line': line})

                if problem == 'swap_variables':
                    suggestions.append({"type": "warning", "message": "Considere usar a troca de variáveis do python (swap): Linha.", 'line': line})
                    suggestions.append({"type": "warning", "message": "Lembre-se de que o Python permite que você simplifique a troca de variáveis. A técnica 'a, b = b, a' é mais concisa e legível do que usar uma variável temporária.\n", 'line': line})

                if problem == 'using_enumerate':
                    suggestions.append({"type": "warning", "message": "Considere usar a função 'enumerate' do python: Linha.", 'line': line})
                    suggestions.append({"type": "warning", "message": "Certifique-se de entender que 'enumerate' retorna pares (índice, valor) para cada elemento no iterable. Isso permite que você acesse ambos simultaneamente.\n", 'line': line})

                if problem == 'multiple_boolean_expressions':
                    suggestions.append({"type": "warning", "message": "Parece que você está utilizando muitas expressões booleanas.", 'line': line})
                    suggestions.append({"type": "warning", "message": "Simplicidade é uma virtude na programação. Evite criar expressões booleanas excessivamente complexas, a menos que seja absolutamente necessário para a lógica do seu programa.\n", 'line': line})

                if problem == 'code_line_too_long':
                    suggestions.append({"type": "warning", "message": "Linha muita longa.", 'line': line})
                    suggestions.append({"type": "warning", "message": "Para resolver o problema de linhas muito longas, considere quebrar seu código em várias linhas quando ele ficar muito extenso. Isso tornará seu código mais legível.\n", 'line': line})
    if suggestions:
        return suggestions
    return []
