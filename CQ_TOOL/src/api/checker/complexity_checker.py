import io
import sys
from radon.metrics import h_visit
from radon.raw import analyze
from mccabe import get_module_complexity
import tempfile

def lines_complexity(code):
    # - sloc - The number of source lines of code
    try:
        lines_metrics = analyze(code)
        sloc = lines_metrics[2]
        return sloc
    except Exception as e:
        print(f"Error in lines_complexity: {e}")
        return None

def cyclomatic_complexity(code, threshold=1):
    # - cc - cyclomatic complexity
    try:
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
            temp_file.write(code)
            file_path = temp_file.name

        text_trap = io.StringIO()
        sys.stdout = text_trap

        cc = get_module_complexity(module_path=file_path, threshold=threshold)

        sys.stdout = sys.__stdout__

        return cc
    except Exception as e:
        print(f"Error in cyclomatic_complexity: {e}")
        return None

def halstead_complexity(code):
    # halstead complexity metrics

    # - difficulty - The difficulty measure is related to the difficulty
    #  of the program to write or understand, e.g. when doing code review.
    # - effort - The effort measure translates into actual coding time using the following relation,
    # - Time required to program: T = E / 18 seconds

    try:
        halstead_metrics = h_visit(code).total

        difficulty = halstead_metrics.difficulty
        effort = halstead_metrics.effort
        time = halstead_metrics.time

        return {'difficulty': difficulty, 'effort': effort, 'time': time}
    except Exception as e:
        print(f"Error in halstead_complexity: {e}")
        return None