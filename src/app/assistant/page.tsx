"use client";

import { Message, useAssistant } from "ai/react";
import cn from "clsx";
import Link from "next/link";
import { Discuss } from "react-loader-spinner";
import { addBoldnessAndParagraphs } from "../utils";

const questionsList = [
  "Livrez-vous au Royaume-Uni?",
  "Quels sont les avantages réservés aux clients privilège ?",
  "Puis-je annuler une commande ?",
  "Existe-t-il un programme de fidélité pour les bons clients ?",
  "Quels sont les avantages du club idéal ?",
  "Ma commande n’est pas conforme ?",
  "Comment marche me regroupement de commandes et la livraison différée ?",
  "D’où proviennent les vins vendus en e-cave ?",
  "Je n’arrive pas à passer un ordre d’achat",
  "Comment marche votre service de stockage ?",
  "Quel plan de stockage choisir ?",
];

export default function Chat() {
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    setMessages,
    setInput,
  } = useAssistant({ api: "/api/assistant", threadId: undefined });

  return (
    <div>
      <button
        onClick={() => {
          setMessages([]);
        }}
        className="mb-2 rounded-lg py-2 px-4 bg-red-800 text-white font-bold fixed top-4 right-4"
      >
        New chat
      </button>

      <Link
        target="_blank"
        href="https://www.idealwine.com/fr/aide/faq"
        className="mb-2 rounded-lg py-2 px-4 bg-red-800 text-white font-bold fixed top-16 right-4"
      >
        FAQ
      </Link>

      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={cn(
              "mb-2 rounded-lg py-2 px-4 w-[80%]",
              message.role === "user"
                ? "text-end bg-gray-300 self-end"
                : "bg-red-800 text-white"
            )}
          >
            {message.role !== "data" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: addBoldnessAndParagraphs(message.content),
                }}
              />
            )}
            {message.role === "data" && (
              <>
                {(message.data as any).description}
                <br />
                <pre className={"bg-gray-200"}>
                  {JSON.stringify(message.data, null, 2)}
                </pre>
              </>
            )}
          </div>
        ))}

        {status === "in_progress" && (
          <Discuss
            visible={true}
            height="30"
            width="30"
            colors={["#991B1B", "#991B1B"]}
          />
        )}

        <form onSubmit={submitMessage}>
          <div className="fixed bottom-0 w-full max-w-md flex flex-col text-end">
            {messages.length === 0 ? (
              <div className="pb-3">
                <div className="font-bold mb-2">Questions fréquentes :</div>
                <ul>
                  {questionsList.map((question) => (
                    <li
                      className="cursor-pointer text-gray-500 mb-1"
                      key={question}
                    >
                      <button
                        onClick={(event) => {
                          setInput(question);
                        }}
                        type="submit"
                        className="underline text-end"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <input
              className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
              disabled={status !== "awaiting_message"}
              value={input}
              placeholder="Quels sont les avantages réservés aux clients privilège ?"
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
