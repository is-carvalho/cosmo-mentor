from .complexity_suggestions import suggestions


class ComplexitySuggestor:
    def __init__(self, student_code, solution_reference):
        self.student_code = student_code
        self.solution_reference = solution_reference
    
    def get_suggestions(self):

        return suggestions(self.student_code, self.solution_reference)