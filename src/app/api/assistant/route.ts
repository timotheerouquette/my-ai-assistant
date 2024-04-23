import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = await req.json();

  const thread = await openai.beta.threads.create();

  const response = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });

  const stream = await openai.beta.threads.runs.stream(thread.id, {
    assistant_id: "asst_1m6HOKnDJNcm2qz9qQTYQwO9",
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
