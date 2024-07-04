import { z } from "zod";

export const choiceSchema = z.object({
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
  choices: z.array(choiceSchema),
});
export const updateQuestionSchema = z.object({
  id: z.string().min(1, { message: "id  is required" }),
  questionTitle: z.string().min(1, { message: "question  is required" }),
  choices: z.array(choiceSchema),
  isFlagged: z.boolean(),
  comment: z.string().optional(),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  questions: z.array(createQuestionSchema).optional(),
});

export const FormSchema = z.object({
  searchParam: z.string(),
});

export const inAppSchema = z.object({
  link: z.string().min(1, { message: "redirect user link is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  time: z.string(),
  to: z.array(z.string()).min(1, { message: "at least one receipient" }),
  tag: z.array(z.string()).min(1, { message: "at least one tag" }),
  read: z.array(z.string()),
  star: z.array(z.string()),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export type UpdateQuestionSchema = z.infer<typeof updateQuestionSchema>;

export type ChoiceSchema = z.infer<typeof choiceSchema>;

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

export type formSchema = z.infer<typeof FormSchema>;

export type InAppSchema = z.infer<typeof inAppSchema>;
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
