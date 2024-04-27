from .VariableSuggestor import VariableSuggestor
from .ComplexitySuggestor import ComplexitySuggestor
from .RefactorySuggestor import RefactorySuggestor


def get_checkers(problem_description, student_code, solution_reference):


    variable_suggestions = VariableSuggestor(
        problem_description = problem_description,
        student_code = student_code,
        solution_reference = solution_reference)
    
    
    complexity_suggestions = ComplexitySuggestor(
        student_code = student_code,
        solution_reference = solution_reference)
    

    refactoring_suggestion = RefactorySuggestor(code=student_code)


    return {'variable_suggestor': variable_suggestions,
            'complexity_suggestor': complexity_suggestions,
            'refactoring_suggestor': refactoring_suggestion}
