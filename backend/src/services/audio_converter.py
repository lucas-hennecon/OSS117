import os
from pathlib import Path
from pydub import AudioSegment
from loguru import logger


def read_flac_to_bytes(file_path: str) -> bytes:
    """
    Read a FLAC file and return its contents as bytes.
    
    Args:
        file_path (str): Path to the FLAC file
        
    Returns:
        bytes: The FLAC file contents as bytes
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file is not a FLAC file
        Exception: If reading fails
    """
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Validate file is FLAC
        if not file_path.lower().endswith('.flac'):
            raise ValueError(f"File must be a FLAC file: {file_path}")
        
        # Read the file as bytes
        logger.info(f"Reading FLAC file: {file_path}")
        with open(file_path, 'rb') as file:
            file_bytes = file.read()
        
        logger.info(f"Successfully read {len(file_bytes)} bytes from {file_path}")
        return file_bytes
        
    except Exception as e:
        logger.error(f"Error reading FLAC file: {str(e)}")
        raise e


def read_flac_metadata(file_path: str) -> dict:
    """
    Read metadata from a FLAC file.
    
    Args:
        file_path (str): Path to the FLAC file
        
    Returns:
        dict: Dictionary containing audio metadata (duration, sample rate, channels, etc.)
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file is not a FLAC file
        Exception: If reading fails
    """
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Validate file is FLAC
        if not file_path.lower().endswith('.flac'):
            raise ValueError(f"File must be a FLAC file: {file_path}")
        
        # Load the FLAC file to get metadata
        logger.info(f"Reading FLAC metadata: {file_path}")
        audio = AudioSegment.from_file(file_path, format="flac")
        
        # Extract metadata
        metadata = {
            'duration_ms': len(audio),
            'duration_seconds': len(audio) / 1000.0,
            'sample_rate': audio.frame_rate,
            'channels': audio.channels,
            'frame_width': audio.frame_width,
            'file_path': file_path,
            'file_size_bytes': os.path.getsize(file_path)
        }
        
        logger.info(f"Successfully read metadata from {file_path}")
        return metadata
        
    except Exception as e:
        logger.error(f"Error reading FLAC metadata: {str(e)}")
        raise e


def convert_m4a_to_flac(input_path: str, output_path: str = None) -> str:
    """
    Convert an M4A file to FLAC format.
    
    Args:
        input_path (str): Path to the input M4A file
        output_path (str, optional): Path for the output FLAC file. 
                                   If not provided, will use the same name with .flac extension
    
    Returns:
        str: Path to the converted FLAC file
        
    Raises:
        FileNotFoundError: If the input file doesn't exist
        Exception: If conversion fails
    """
    try:
        # Validate input file exists
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
        
        # Validate input file is M4A
        if not input_path.lower().endswith('.m4a'):
            raise ValueError(f"Input file must be an M4A file: {input_path}")
        
        # Generate output path if not provided
        if output_path is None:
            input_file = Path(input_path)
            output_path = str(input_file.with_suffix('.flac'))
        
        # Load the M4A file
        logger.info(f"Loading M4A file: {input_path}")
        audio = AudioSegment.from_file(input_path, format="m4a")
        
        # Export as FLAC
        logger.info(f"Converting to FLAC: {output_path}")
        audio.export(output_path, format="flac")
        
        logger.info(f"Successfully converted {input_path} to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error converting M4A to FLAC: {str(e)}")
        raise e


def batch_convert_m4a_to_flac(input_directory: str, output_directory: str = None) -> list[str]:
    """
    Convert all M4A files in a directory to FLAC format.
    
    Args:
        input_directory (str): Directory containing M4A files
        output_directory (str, optional): Directory to save FLAC files. 
                                        If not provided, will use the same directory
    
    Returns:
        list[str]: List of paths to converted FLAC files
    """
    try:
        input_dir = Path(input_directory)
        if not input_dir.exists():
            raise FileNotFoundError(f"Input directory not found: {input_directory}")
        
        if output_directory is None:
            output_dir = input_dir
        else:
            output_dir = Path(output_directory)
            output_dir.mkdir(parents=True, exist_ok=True)
        
        # Find all M4A files
        m4a_files = list(input_dir.glob("*.m4a")) + list(input_dir.glob("*.M4A"))
        
        if not m4a_files:
            logger.warning(f"No M4A files found in {input_directory}")
            return []
        
        converted_files = []
        
        for m4a_file in m4a_files:
            try:
                output_file = output_dir / f"{m4a_file.stem}.flac"
                converted_path = convert_m4a_to_flac(str(m4a_file), str(output_file))
                converted_files.append(converted_path)
            except Exception as e:
                logger.error(f"Failed to convert {m4a_file}: {str(e)}")
                continue
        
        logger.info(f"Successfully converted {len(converted_files)} out of {len(m4a_files)} files")
        return converted_files
        
    except Exception as e:
        logger.error(f"Error in batch conversion: {str(e)}")
        raise e


if __name__ == "__main__":
    # Example usage
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python audio_converter.py <input_file.m4a> [output_file.flac]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        result = convert_m4a_to_flac(input_file, output_file)
        print(f"Conversion successful: {result}")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        sys.exit(1) 