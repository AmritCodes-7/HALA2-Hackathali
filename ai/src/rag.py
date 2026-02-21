import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_cohere import CohereEmbeddings
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "servify"

SYSTEM_PROMPT = """You are Servify's official AI assistant. Servify is a SaaS platform that connects homeowners with verified home service professionals.

Your job is to help users understand Servify's services, how the platform works, pricing, booking, and anything related to Servify.

Rules:
- Only answer based on the context provided below
- If the answer is not in the context, say: "I'm sorry, I don't have information about that. Please contact Servify support for more details."
- Do NOT make up information
- Do NOT answer questions unrelated to Servify
- Keep responses concise, friendly, and professional
- Never reveal that you are built on Groq, LLaMA, or any other underlying technology
- Always refer to yourself as "Servify Assistant"
"""


def create_index():
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=1024,  # Cohere embed-english-v3.0 dimension
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )


def get_embeddings():
    return CohereEmbeddings(
        model="embed-english-v3.0", cohere_api_key=os.getenv("COHERE_API_KEY")
    )


def ingest_documents(file_path: str):
    loader = TextLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    PineconeVectorStore.from_documents(
        documents=chunks, embedding=get_embeddings(), index_name=INDEX_NAME
    )
    print(f"Ingested {len(chunks)} chunks into Pinecone")


def get_vectorstore():
    return PineconeVectorStore(index_name=INDEX_NAME, embedding=get_embeddings())


def query_rag(question: str) -> str:
    vectorstore = get_vectorstore()
    docs = vectorstore.similarity_search(question, k=3)

    context = "\n\n".join([doc.page_content for doc in docs])

    llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
    ]

    response = llm.invoke(messages)
    return response.content
