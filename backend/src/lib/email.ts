import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST ?? 'smtp.gmail.com',
    port:Number(process.env.EMAIL_PORT ?? 587),
    secire:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
} as nodemailer.TransportOptions);

export async function sendInviteEmail(
    toEmail:string,
    threadTitle:string,
    inviterName:string,
    expiresAt:Date
):Promise<void> {
    const expiryStr = expiresAt.toLocaleDateString('pt-PT');
    await transporter.sendMail({
        from:`"Life Threads" <${process.env.EMAIL_USER}>`,
        to:toEmail,
        subject:`${inviterName} convidou-te para a Thread "${threadTitle}"`,
        html:`
           <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px;">
                <h2 style="color: #2563eb;">Life Threads</h2>
                <p>Olá!</p>
                <p><strong>${inviterName}</strong> convidou-te para participar na Thread 
                <strong>"${threadTitle}"</strong>.</p>
                <p style="color: #6b7280; font-size: 14px;">
                Este convite expira em <strong>${expiryStr}</strong>.
                </p>
                <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
                Acede à aplicação Life Threads para aceitar ou recusar o convite.
                </p>
            </div>
            `
    });
}

export async function sendWelcomeEmail(toEmail:string,name:string):Promise<void>{
    await transporter.sendMail({
        from:`"Life Threads" <${process.env.EMAIL_USER}>`,
        to:toEmail,
        subject:'Bem-vindo ao Life Threads',
        html:`
            <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px;">
                <h2 style="color: #2563eb;">Life Threads</h2>
                <p>Olá <strong>${name}</strong>!</p>
                <p>A tua conta foi criada com sucesso. Começa a guardar as tuas memórias.</p>
            </div>
            `
})
}