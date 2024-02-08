import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import prisma from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );
    //hey,what's your wifi password ?
    //your wifi password is xyz
    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma?.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

    console.log("Relevant notes found: ", JSON.stringify(relevantNotes));
    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      // content: `Note Summaries:\n${relevantNotes
      //   ?.map((note) => {
      //     const desc =
      //       note.description.length > 50
      //         ? `${note.description.substring(0, 50)}...`
      //         : note.description; // Concisely summarize description

      //     const questionsDetails = note.questions
      //       .map((q, idx) => {
      //         const questionSummary =
      //           q.questionTitle.length > 30
      //             ? `${q.questionTitle.substring(0, 30)}...`
      //             : q.questionTitle; // Summarize question text
      //         const choicesSummary = q.choices
      //           .map((choice, cIdx) => `${cIdx + 1}: ${choice}`)
      //           .join(", "); // List choices
      //         const correctAnswer = `Correct: ${q.choices.find(
      //           (c) => c.answer == true,
      //         )}`;
      //         return `Q${
      //           idx + 1
      //         }: ${questionSummary} Choices: [${JSON.stringify(
      //           choicesSummary,
      //         )}] ${JSON.stringify(correctAnswer)}`;
      //       })
      //       .join("; ");

      //     return `Title: ${note.title}, Description: ${desc}, Questions: ${questionsDetails}`;
      //   })
      //   .join("\n\n")}`,
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes." +
        "The relevant notes for this query are: \n" +
        relevantNotes
          ?.map(
            (note) => {
              const questions = note.questions.map((q) => {
                const choices = q.choices.map(
                  (choice) => choice.content + choice.answer,
                );
                return q.questionTitle + JSON.stringify(choices);
              });

              return `Title: ${note.title}\nDescription:\n${
                note.description
              }\nQuestions:${JSON.stringify(questions)}`;
            },

            // \n\nQuestions:${ JSON.stringify(note.questions) }`,
          )
          .join("\n\n"),
    };
    console.log(systemMessage);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
