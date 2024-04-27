from .reference_base_generator import generate_reference_vocabulary
from .variable_name_checker import classify_variable_names
from .variable_naming_suggestions import get_suggestions

class VariableSuggestor:
    """
    VariableSuggestor é responsável por fornecer sugestões para 
    nomes de variáveis ruins em códigos de alunos. Para isso, utiliza:

    - problem_description (string) - Descrição da questão
    - student_code (string) - Código da solução fornecida pelo estudante
    - solution_reference (string) - Solução de referência
    """

    def __init__(self, problem_description, student_code, solution_reference):
        self.problem_description = problem_description
        self.student_code = student_code
        self.solution_reference = solution_reference

    def get_suggestions(self):

        suggestions = get_suggestions(self.student_code, self.solution_reference, self.problem_description)

        return suggestions