import { z } from "zod";

export const ChoiceSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, { message: "choice is required" }),
  answer: z.boolean().default(false),
});
// export const QuestionTitleSchema = z.object({
//   id: z.string().min(1),
//   content: z.string().min(1, { message: "Title is required" }),
// });
export const createQuestionSchema = z.object({
  // id: z.string().optional(),
  questionTitle: z.string().min(1, { message: "question  is required" }),
  choices: z.array(ChoiceSchema),
});
export const updateQuestionSchema = z.object({
  id: z.string().min(1, { message: "id  is required" }),
  questionTitle: z.string().min(1, { message: "question  is required" }),
  choices: z.array(ChoiceSchema),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  questions: z.array(createQuestionSchema).optional(),
});

export const createHobbySchema = z.object({
  hobby: z.string().min(1, { message: "hobby has to be one character long " }),
});
export const createAnimalSchema = z.object({
  name: z.string().min(3, { message: "animal name must be 3 character long " }),
  description: z.string().min(1, {
    message: "animal description must be at least one character long",
  }),
  hobbies: z.array(createHobbySchema).optional(),
});

export type CreateAnimalSchema = z.infer<typeof createAnimalSchema>;

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

// export const updateNoteSchema = createNoteSchema.extend({
//   id: z.string().min(1),
// });

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});

export const updateNoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(updateQuestionSchema).optional(),
});

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
