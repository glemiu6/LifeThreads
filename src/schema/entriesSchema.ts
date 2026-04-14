import { z } from 'zod';

// Validação para a criação de uma nova Entrada
export const createEntrySchema = z.object({
    title: z.string({
        required_error: "O título é obrigatório.",
        invalid_type_error: "O título deve ser um texto.",
    }).min(1, "O título não pode estar vazio."),
    
    body: z.string({
        required_error: "O corpo da entrada é obrigatório.",
        invalid_type_error: "O corpo da entrada deve ser um texto.",
    }).min(1, "O corpo da entrada não pode estar vazio."),
    
    // Aceita datas no formato string (ex: "2023-10-25T10:00:00Z") e converte/valida
    entry_date: z.string({
        required_error: "A data da entrada é obrigatória.",
    }).refine((date) => !isNaN(Date.parse(date)), {
        message: "Data inválida. Utiliza um formato válido (ex: ISO 8601).",
    }),
    
    location: z.string().optional(),
});

// Validação para a atualização de uma Entrada (todos os campos são opcionais, mas se enviados, não podem estar vazios)
export const updateEntrySchema = z.object({
    title: z.string().min(1, "O título não pode estar vazio.").optional(),
    body: z.string().min(1, "O corpo da entrada não pode estar vazio.").optional(),
    location: z.string().optional(),
});

// Validação para o ID passado nos parâmetros da rota (ex: /api/entries/:id)
export const entryIdSchema = z.number({
    required_error: "O ID da entrada é obrigatório.",
    invalid_type_error: "O ID deve ser um número.",
}).int().positive("O ID deve ser um número inteiro positivo.");