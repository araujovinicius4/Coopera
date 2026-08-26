import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import routes from './routes/index.js';

const app=express(); app.set('trust proxy',1); app.use(helmet()); app.use(cors({origin:config.origin,credentials:true})); app.use(express.json({limit:'32kb'})); app.use(cookieParser());
app.use('/api',rateLimit({windowMs:60_000,limit:120,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Muitas tentativas. Aguarde um instante.'}}),routes);
app.use((_req,res)=>res.status(404).json({error:'Rota não encontrada.'}));
app.use((error,_req,res,_next)=>{console.error(error);res.status(error.status||500).json({error:error.status?error.message:'Não foi possível concluir agora.'});});
app.listen(config.port,()=>console.log(`Coopera API em http://localhost:${config.port}`));
