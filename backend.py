from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model with GPU acceleration
try:
    llm = Llama(
        model_path="./mistral-7b-instruct-v0.1.Q5_K_M.gguf",
        n_ctx=2048,
        n_threads=8,       # Safe for Ryzen 5 5600H
        n_gpu_layers=-1    # Use GPU for all layers
    )
    logger.info("Model loaded successfully with GPU support")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

class Query(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(query: Query):
    try:
        logger.info(f"Received prompt: {query.prompt[:50]}...")
        
        res = llm(
            prompt=query.prompt,
            max_tokens=256,
            temperature=0.7,
            stop=["</s>", "[/INST]"]
        )
        
        output = res["choices"][0]["text"].strip()
        logger.info(f"Generated response of length: {len(output)}")
        
        return {"output": output}
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model with GPU acceleration
try:
    llm = Llama(
        model_path="./mistral-7b-instruct-v0.1.Q5_K_M.gguf",
        n_ctx=2048,
        n_threads=8,       # Safe for Ryzen 5 5600H
        n_gpu_layers=-1    # Use GPU for all layers
    )
    logger.info("Model loaded successfully with GPU support")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

class Query(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(query: Query):
    try:
        logger.info(f"Received prompt: {query.prompt[:50]}...")
        
        res = llm(
            prompt=query.prompt,
            max_tokens=256,
            temperature=0.7,
            stop=["</s>", "[/INST]"]
        )
        
        output = res["choices"][0]["text"].strip()
        logger.info(f"Generated response of length: {len(output)}")
        
        return {"output": output}
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
