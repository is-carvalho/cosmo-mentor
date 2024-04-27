from .refactoring_suggestions import refactor_suggestions
class RefactorySuggestor:

    """
    VariableSuggestor is responsable to provide refactoring suggestions
    """

    def __init__(self, code):
        self.code = code

    def get_suggestions(self):
        return refactor_suggestions(self.code)
