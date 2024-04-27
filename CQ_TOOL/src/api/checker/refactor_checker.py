import os
import subprocess

def call_to_pylint(code):
    """ Making use of pylint to get some problems in the code """
    
    def run_pylint():
        try:
            # Create a temp file to storage the code
            with open("temp_code.py", "w") as temp_file:
                temp_file.write(code)

            # Call Pylint using the subprocess
            result = subprocess.run(["pylint", "temp_code.py", "--disable=all", "--enable=R1716,R1712,C0200,R0916,C0301"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            # Capture the pylint output
            pylint_output = result.stdout
            pylint_errors = result.stderr

            # Processing output to get only the important info
            pylint_output = pylint_output.split('\n')[1:-5]
            pylint_errors = pylint_errors.split('\n')[1:-3]

            pylint_output = [output[13:].split(':') for output in pylint_output]

            return pylint_output, pylint_errors

        except Exception as e:
            return None, str(e)
        finally:
            # Cleaning: Delete temp file
            try:
                os.remove("temp_code.py")
            except Exception as e:
                pass

    pylint_outputs, _ = run_pylint()

    def chaining_comparison():
        """ Get only chaining comparison occurrences related """

        CHAINED_COMPARISON_CODE_POS = 2
        CHAINED_COMPARISON_CODE = ' R1716'

        # Filtering for chaining comparison related problems in output
        chaining_comparison_output = [output for output in pylint_outputs if output[CHAINED_COMPARISON_CODE_POS] == CHAINED_COMPARISON_CODE]

        new_chaining_comparison_output = []
        for output in chaining_comparison_output:
            del output[1]

            new_chaining_comparison_output.append(output)
            
        chaining_comparison_output.clear()
        return new_chaining_comparison_output


    def swap_variables():
        """ Get only swap variables occurrences related """
        SWAP_CODE_POS = 2
        SWAP_CODE = ' R1712'

        # Filtering for swap variables related problems in output
        swap_output = [output for output in pylint_outputs if output[SWAP_CODE_POS] == SWAP_CODE]
        
        new_swap_output = []
        for output in swap_output:
            del output[1]

            new_swap_output.append(output)
    
        swap_output.clear()
        return new_swap_output


    def using_enumerate():
        """ Get only enumerate occurrences related """
        ENUMERATE_CODE_POS = 2
        ENUMERATE_CODE = ' C0200'

        # Filtering for enumerate related problems in output
        enumerate_output = [output for output in pylint_outputs if output[ENUMERATE_CODE_POS] == ENUMERATE_CODE]
        
        new_enumerate_output = []
        for output in enumerate_output:
            del output[1]

            new_enumerate_output.append(output)
    
        enumerate_output.clear()
        return new_enumerate_output


    def multiple_boolean_expressions():
        """ Get only multiple boolean expressions occurrences related """
        MBE_CODE_POS = 2
        MBE_CODE = ' R0916'

        # Filtering for multiple boolean expressions
        MBE_output = [output for output in pylint_outputs if output[MBE_CODE_POS] == MBE_CODE]
        
        new_MBE_output = []
        for output in MBE_output:
            del output[1]

            new_MBE_output.append(output)
    
        MBE_output.clear()
        return new_MBE_output


    def code_line_too_long():
        """ Get only code line too long occurrences related """
        LTL_CODE_POS = 2
        LTL_CODE = ' C0301'

        # Filtering for occurrences code line too long
        LTL_output = [output for output in pylint_outputs if output[LTL_CODE_POS] == LTL_CODE]
        
        new_LTL_output = []
        for output in LTL_output:
            del output[1]

            new_LTL_output.append(output)
    
        LTL_output.clear()
        return new_LTL_output

    # Return dict with a list for each one problem
    if pylint_outputs:
        return {
                'chaining_comparison': chaining_comparison(),
                'swap_variables': swap_variables(),
                'using_enumerate': using_enumerate(),
                'multiple_boolean_expressions': multiple_boolean_expressions(),
                'code_line_too_long': code_line_too_long()
                }
    return {}
