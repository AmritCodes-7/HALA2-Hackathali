import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "servify"


def create_index():
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=3072,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )


def ingest_documents(file_path: str):
    loader = TextLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001", google_api_key=os.getenv("GEMINI_API_KEY")
    )

    PineconeVectorStore.from_documents(
        documents=chunks, embedding=embeddings, index_name=INDEX_NAME
    )
    print(f"Ingested {len(chunks)} chunks into Pinecone")


def get_vectorstore():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001", google_api_key=os.getenv("GEMINI_API_KEY")
    )
    return PineconeVectorStore(index_name=INDEX_NAME, embedding=embeddings)


def query_rag(question: str) -> str:
    vectorstore = get_vectorstore()
    docs = vectorstore.similarity_search(question, k=3)

    # combine retrieved chunks
    context = "\n\n".join([doc.page_content for doc in docs])

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)

    response = llm.invoke(
        f"Answer the question using the context below.\n\nContext:\n{context}\n\nQuestion: {question}"
    )

    return response.content
