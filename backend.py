from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vllm import LLM, SamplingParams
import logging

# Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vllm_api")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    llm = LLM(model="mistral-7b-instruct-v0.1.Q5_K_M.gguf")
    logger.info("✅ vLLM model loaded")
except Exception as e:
    logger.error(f"❌ Model load failed: {e}")
    raise RuntimeError("Model load failed")

class Query(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(query: Query):
    try:
        logger.info(f"🔐 Prompt: {query.prompt[:60]}...")
        sampling_params = SamplingParams(max_tokens=256, temperature=0.3)
        outputs = llm.generate([query.prompt], sampling_params=sampling_params)
        result = outputs[0].outputs[0].text.strip()
        return {"output": result}
    except Exception as e:
        logger.error(f"❌ Inference failed: {e}")
        raise HTTPException(status_code=500, detail="Generation failed")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
