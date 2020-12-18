import express, { Request, Response } from 'express';
import path from 'path'
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.get('/', (request: Request, response: Response) => {
  return response.json({message: 'ok'});
});

app.listen(3333);