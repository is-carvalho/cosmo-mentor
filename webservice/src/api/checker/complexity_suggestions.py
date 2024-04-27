from ..checker import complexity_checker as c_checker
from math import modf

def suggestions(student_code, reference_code):

    ZERO = 0.0
    THRESHOLD = 1.0
    HUNDRED_PERCENT = 100

    ratios = get_ratios(student_code, reference_code)

    messages = []
    for metric in ratios:
        ratio = ratios[metric]
        frational_part, integer_part = modf(ratio)

        if metric == 'raws':
            if ratio > THRESHOLD:
                if integer_part == 1:
                    messages.append({"type": "warning", "message": f'Seu código é {round(frational_part * HUNDRED_PERCENT)} % maior que o código de referência. Considere refatorar seu código e diminua a quantidade de linhas.'})
                else:
                    messages.append({"type": "warning", "message": f'Seu código é {round((ratio - THRESHOLD) * HUNDRED_PERCENT)} % maior que o código de referência. Considere refatorar seu código e diminua a quantidade de linhas.'})
            elif ratio < THRESHOLD and frational_part != ZERO:
                messages.append({"type": "info", "message": f'Parabéns! Seu código é {round(HUNDRED_PERCENT - frational_part * HUNDRED_PERCENT)} % menor que o código de referência.'})

        elif metric == 'cc':
            if ratio > THRESHOLD: 
                if integer_part == 1:    
                    messages.append({"type": "warning", "message": f'Seu código é {round(frational_part * HUNDRED_PERCENT)} % mais complexo que o código de referência. Considere refatorar seu código minimizando a quantidade de condicionais ou loops.'})
                else:
                    messages.append({"type": "warning", "message": f'Seu código é {round((ratio - THRESHOLD) * HUNDRED_PERCENT)} % mais complexo que o código de referência. Considere refatorar seu código minimizando a quantidade de condicionais ou loops.'})
            elif ratio < THRESHOLD and frational_part != ZERO:
                messages.append({"type": "info", "message": f'Parabéns! Seu código é {round(HUNDRED_PERCENT - frational_part * HUNDRED_PERCENT)} % menos complexo que o código de referência.'})

        elif metric == 'difficulty':
            if ratio > THRESHOLD:  
                if integer_part == 1:     
                    messages.append({"type": "warning", "message": f'Seu código tem uma dificuldade de {round(frational_part * HUNDRED_PERCENT)} %  que o código de referência.'})
                else:
                    messages.append({"type": "warning", "message": f'Seu código tem uma dificuldade de {round((ratio- 1) * HUNDRED_PERCENT)} %  que o código de referência.'})
            elif ratio < THRESHOLD and frational_part != ZERO:
                messages.append({"type": "info", "message": f'Parabéns! Seu código tem uma dificulade de {round(HUNDRED_PERCENT - frational_part * HUNDRED_PERCENT)} % menor que o código de referência.'})

    return messages


def get_ratios(student_code, reference_code):

    student_raws = c_checker.lines_complexity(student_code)
    reference_raws = c_checker.lines_complexity(reference_code)

    student_cc = c_checker.cyclomatic_complexity(student_code)
    reference_cc = c_checker.cyclomatic_complexity(reference_code)
    
    student_difficulty = c_checker.halstead_complexity(student_code)['difficulty']
    reference_difficulty = c_checker.halstead_complexity(student_code)['difficulty']

    # compute ratios
    def calculate_ratios(student, reference):
        if reference == 0:
            reference = 1
            student += 1
        ratio = student / reference
        return ratio

    # buld a ratios dictionary
    def ratios():
        
        ratios = {'raws': calculate_ratios(student_raws, reference_raws),
                'cc': calculate_ratios(student_cc, reference_cc),
                'difficulty': calculate_ratios(student_difficulty, reference_difficulty)}

        return ratios
    return ratios()