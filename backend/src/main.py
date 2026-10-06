import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitimos a Vercel conectarse
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@app.post("/api/contact")
async def send_contact_email(form: ContactForm):
    # Tus credenciales (las pondremos en el .env)
    sender_email = os.getenv("EMAIL_USER", "criskol.71@gmail.com")
    sender_password = os.getenv("EMAIL_PASS", "tu_contraseña_de_aplicacion_aqui")
    receiver_email = "criskol.71@gmail.com" # A dónde llegan los mensajes

    # Construir el correo
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"🚀 Nuevo mensaje de tu portafolio: {form.name}"
    
    body = f"""
    Has recibido un nuevo mensaje desde tu portafolio web:
    
    Nombre: {form.name}
    Email: {form.email}
    
    Mensaje:
    {form.message}
    """
    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    # Enviar el correo usando el servidor de Gmail
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        return {"success": True, "message": "Correo enviado correctamente"}
    except Exception as e:
        return {"success": False, "message": f"Error al enviar: {str(e)}"}

@app.get("/")
def read_root():
    return {"status": "Backend del portafolio activo"}