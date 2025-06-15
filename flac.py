import os
from pathlib import Path
from pydub import AudioSegment
from loguru import logger


def convert_m4a_to_flac(input_path: str, output_path: str = None) -> str:
    """
    Convert an M4A file to FLAC format.

    Args:
        input_path (str): Path to the input M4A file
        output_path (str, optional): Path for the output FLAC file. 
                                   If not provided, will use the same name with .flac extension

    Returns:
        str: Path to the converted FLAC file

    Raises:@
        FileNotFoundError: If the input file doesn't exist
        Exception: If conversion fails
    """
    try:
        # Validate input file exists
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")

#Validate input file is M4A
        if not input_path.lower().endswith('.m4a'):
            raise ValueError(f"Input file must be an M4A file: {input_path}")

#Generate output path if not provided
        if output_path is None:
            input_file = Path(input_path)
            output_path = str(input_file.with_suffix('.flac'))

#Load the M4A file
        logger.info(f"Loading M4A file: {input_path}")
        audio = AudioSegment.from_file(input_path, format="m4a")

#Export as FLAC
        logger.info(f"Converting to FLAC: {output_path}")
        audio.export(output_path, format="flac")

        logger.info(f"Successfully converted {input_path} to {output_path}")
        return output_path

    except Exception as e:
        logger.error(f"Error converting M4A to FLAC: {str(e)}")
        raise e
    

if __name__ == "__main__":
    input_path = "test2.m4a"
    convert_m4a_to_flac(input_path)